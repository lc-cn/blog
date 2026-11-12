---
title: "别再把 base64 塞进 AI 上下文了：一套通用的多媒体传递方案"
excerpt: "工具返回的截图和生图结果以 base64 进入上下文，会撑爆窗口、拖高费用。本文讲清楚该在哪一步拦下它，以及怎么用开源工具 agent-media 五分钟接入 Claude Code、Codex 等 agent 工具。"
author: "凉菜"
date: "2026-11-12"
readTime: "10 min read"
tags: ["AI", "Agent", "MCP", "Claude Code", "Codex", "对象存储", "开源项目"]
image: ""
issueNumber: 10
---

我们在做聊天机器人框架 [zhin](https://github.com/zhinjs/zhin) 时定了一条规矩：AI 生成的图片先转存到对象存储，交给模型的只是一个 HTTP URL。群里有朋友问，这个做法能不能抽出来，给 Claude Code、Codex 这些 agent 工具也用上。

可以。这篇文章讲清楚三件事：为什么 base64 不该进上下文；在各个 agent 工具里应该在哪一步拦下它；以及怎么用开源工具 [agent-media](https://github.com/zhinjs/agent-media) 五分钟接上，或者自己写一个。

## 一张图有多贵

一张 1 MB 的截图，base64 编码后是约 137 万个字符。base64 没有任何语义，分词器切得很碎，单张图就是几十万 token，很多模型的整个上下文窗口都装不下。

而它们往往是不知不觉进来的。浏览器工具返回的截图、生图接口返回的 `b64_json`、抓取网页时带回的 `data:image/png;base64,...`，都会原样写进工具结果。之后的代价是：

- **每一轮都重发**：工具结果进了会话历史，后面每次请求都会带上，费用和延迟一起涨。
- **截断后变垃圾**：工具结果普遍有长度上限。半截 base64 会把 JSON 截坏，模型要么编造内容，要么重试工具。
- **压缩没法做**：上下文压缩也读不懂 base64，只能整段保留或整段丢弃。
- **模型本来就看不到图**：文本形式的 base64 对模型来说只是一串字符。要让模型看图，得用多模态的图片输入，而且只在需要的那一次请求里给。

所以正确的做法不是压缩 base64，而是让它根本进不了上下文。

## 思路：字节停在边界

核心只有一句话：**媒体字节在工具边界就被截下来存好，上下文里只放一个很短的引用。**

```text
                  ┌─────────────┐   引用    ┌──────────────────────┐
  工具结果 ──────► │   拦截器    │ ───────► │  会话历史与模型        │
  (含 base64)     │ 写入历史之前 │          │  只看到一行引用        │
                  └──────┬──────┘          │  看图时再调 inspect   │
                默认私有 │ 显式公开         └──────────────────────┘
               ┌─────────┴─────────┐
               ▼                   ▼
        ┌────────────┐      ┌────────────┐   URL   ┌──────────────┐
        │  私有存储   │      │  对象存储   │ ──────► │ 用户/聊天平台 │
        │ asset_id   │      │ S3/R2/OSS  │         │ 直接拉取图片  │
        │ 按会话隔离  │      │ 生命周期清理 │         └──────────────┘
        └────────────┘      └────────────┘
```

引用有两种，按“能不能公开”区分：

- **私有 asset_id**：默认选项。存在本地，绑定会话和用户，到期删除，永不自动公开。适合浏览器截图、用户私聊发来的图这类不确定能不能外传的内容。
- **公开 URL**：只用于本来就要发给用户的内容，比如生图结果。上传到对象存储，聊天平台自己拉取，多模态模型也能直接按 URL 看图。

模型真要看私有图片时，调一个查看工具，图片只附在下一次请求里，用完就丢。

## 为什么光写提示词不够

很多人的第一反应是写一个 Skill 或者一段系统提示词：“不要输出 base64”。但 base64 是**工具返回的**，不是模型写的。等模型看到工具结果时，字节已经在上下文里了，提示词写得再好也来不及。

所以要分两层做：

- **代码层拦截**：在工具结果写进历史之前就把字节换掉，这是主体。
- **Skill 层约定**：告诉模型拿到引用之后怎么用。不要自己拼 Data URI，需要看图时才去取，用户要求时才公开发布，上传失败不要重新生图。

只有 Skill 没有拦截，等于在水管爆了之后贴告示。

## 各个 agent 工具能在哪一步拦下媒体

拦截要发生在“工具执行完”和“结果进入历史”之间。自己写 agent loop 时这个位置很好找；用现成的工具时，就要看它的钩子允不允许改写工具输出。下表是 2026 年 11 月各工具的情况：

| 工具 | 钩子能否改写工具输出 | 推荐做法 |
| --- | --- | --- |
| Claude Code | 能。PostToolUse 钩子返回 `hookSpecificOutput.updatedToolOutput`，内置工具和 MCP 工具都生效（[官方文档](https://code.claude.com/docs/en/hooks#posttooluse)） | 钩子或 MCP 代理 |
| Codex CLI | 不能。PostToolUse 只能阻断或补充上下文（[openai/codex#38135](https://github.com/openai/codex/issues/38135)） | MCP 代理 |
| Gemini CLI | 只能间接替换，没有结构化的输出替换（[钩子文档](https://github.com/google-gemini/gemini-cli/blob/main/docs/hooks/reference.md)） | MCP 代理 |
| Cursor | 社区反馈 `postToolUse` 可以改 MCP 输出，官方文档未确认 | MCP 代理 |
| 自己的 agent loop | 你自己控制 | 在工具执行器里直接调用拦截器 |

结论是：**MCP 代理是覆盖面最广的做法**。代理把会产出媒体的 MCP server 包一层，在 agent 工具拿到结果之前就替换完毕，不依赖任何钩子能力。

还有一个细节：Claude Code 会把 MCP 返回的图片块（`{type: 'image'}`）当作原生图片交给模型，这类图片不是文本形式的 base64。真正撑爆上下文的，是以文本形式混在 JSON 里的 base64。

## 五分钟接入 agent-media

[agent-media](https://github.com/zhinjs/agent-media) 把上面的做法做成了一个 npm 包 `@zhin.js/agent-media`（MIT，Node.js 20 以上）。它提供四个命令：`proxy`（MCP 代理）、`mcp`（查看和发布工具）、`hook claude-code`（Claude Code 钩子）和 `skill`（安装 Skill）。不配置对象存储也能用，捕获的媒体默认存在本地私有目录，不会上传。

### Claude Code

在项目的 `.mcp.json` 里加上查看工具，并把会截图的浏览器 MCP 包一层代理：

```json
{
  "mcpServers": {
    "agent-media": { "type": "stdio", "command": "npx", "args": ["-y", "@zhin.js/agent-media", "mcp"] },
    "browser": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@zhin.js/agent-media", "proxy", "--", "npx", "-y", "@playwright/mcp@latest"]
    }
  }
}
```

再在 `.claude/settings.json` 里加一个钩子，其他 MCP 工具以文本形式返回的 base64 也会被拦下：

```json
{
  "hooks": {
    "PostToolUse": [
      { "matcher": "mcp__.*", "hooks": [{ "type": "command", "command": "npx -y @zhin.js/agent-media hook claude-code" }] }
    ]
  }
}
```

最后安装 Skill：

```bash
npx -y @zhin.js/agent-media skill .claude/skills
```

### Codex CLI

Codex 的钩子改不了输出，只用代理。在 `~/.codex/config.toml` 里：

```toml
[mcp_servers.agent-media]
command = "npx"
args = ["-y", "@zhin.js/agent-media", "mcp"]

[mcp_servers.browser]
command = "npx"
args = ["-y", "@zhin.js/agent-media", "proxy", "--", "npx", "-y", "@playwright/mcp@latest"]
```

Skill 装到仓库的 `.agents/skills` 下：

```bash
npx -y @zhin.js/agent-media skill .agents/skills
```

### 接入后的效果

浏览器截图之后，模型看到的工具结果从几十万字符变成一行：

```text
[private image {"asset_id":"3f8a…","mime":"image/png","size":30069,"expires_at":…}; call inspect_media with asset_id to view it.]
```

模型真要看图时，再调用 `inspect_media`。配置了对象存储后，还可以用 `publish_media` 拿到公开 URL 发给用户。

## 接上对象存储

要把图片发给用户，就需要一个公开可访问的 URL，也就是要接一个对象存储。agent-media 用 S3 协议上传，配置只有几个环境变量。以 Cloudflare R2 为例：

```bash
AGENT_MEDIA_S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
AGENT_MEDIA_S3_BUCKET=agent-media
AGENT_MEDIA_S3_ACCESS_KEY_ID=<Access Key ID>
AGENT_MEDIA_S3_SECRET_ACCESS_KEY=<Secret Access Key>
AGENT_MEDIA_S3_PUBLIC_BASE_URL=https://media.example.com
```

region 和寻址方式会根据 endpoint 自动推断。选平台时主要看三点：密钥怎么拿、图片能不能直接预览、要不要备案。

| 平台 | S3 endpoint | 密钥在哪里创建 | 图片预览 | 备案 |
| --- | --- | --- | --- | --- |
| Cloudflare R2 | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` | R2 → API Tokens，权限 Object Read & Write，限定单个桶 | 绑定自定义域名即可；`r2.dev` 仅供测试 | 不需要 |
| 阿里云 OSS | `https://s3.oss-<region>.aliyuncs.com` | RAM 用户 AccessKey + 只包含该桶的自定义策略 | 默认域名强制下载，需绑定自定义域名 | 内地地域需要 |
| 腾讯云 COS | `https://cos.<region>.myqcloud.com` | CAM 子用户 SecretId/SecretKey + 自定义策略 | 2024 年后新建的桶，默认域名不能预览 | 自定义域名需要 |
| AWS S3 | `https://s3.<region>.amazonaws.com` | IAM 用户 + 只允许该桶的策略 | 可以；推荐用 CloudFront 或预签名 | 不需要 |
| MinIO（自建） | 你的服务地址 | Console → Access Keys | 可以 | 看部署位置 |
| 七牛云 Kodo | `https://s3.<region>.qiniucs.com` | AccessKey/SecretKey，IAM 子账号限定单桶 | S3 域名不允许匿名读，需绑定域名 | 内地需要 |

两条建议：

- **没有备案域名时，用预签名模式**（`AGENT_MEDIA_S3_URL_MODE=presigned`）。桶可以保持私有，链接最长 7 天后自动失效。
- **给上传前缀配一条生命周期规则**，比如 `agent-media/` 下的对象 7 天后删除。工具本身从不删除公开对象。

每个平台的完整步骤（控制台入口、策略写法、公开读取、生命周期、坑）见 [对象存储配置指南](https://github.com/zhinjs/agent-media/blob/main/docs/storage-providers.zh-CN.md)。

## 自己实现：三个关键点

如果你在做自己的 agent 框架，不一定要引入这个包，把下面三件事做对就行。

### 1. 只识别结构明确的媒体

不要用“长得像 base64 的长字符串”来判断，token、哈希、密文都会被误伤。只替换这几种形态：

- MCP 的 `{type: 'image', data, mimeType}` 和 `{type: 'resource', resource: {blob}}`
- Anthropic 的 `{type: 'image', source: {type: 'base64', data}}`
- 任意字符串里的 `data:image/...;base64,...`
- 已知的字段名，比如 OpenAI 的 `b64_json`

媒体类型按文件头魔数判断，不信任工具声称的 MIME。解码失败、超大或存储失败时，也要替换成一句说明，绝不能把原始字节放过去。

```ts
async function visit(v: unknown): Promise<unknown> {
  if (typeof v === 'string') return replaceDataUris(v);
  if (Array.isArray(v)) return Promise.all(v.map(visit));
  if (!v || typeof v !== 'object') return v;
  const o = v as Record<string, unknown>;
  if (o.type === 'image' && typeof o.data === 'string') {
    return { type: 'text', text: await store(o.data) };   // 存起来，返回一行引用
  }
  return Object.fromEntries(await Promise.all(Object.entries(o).map(async ([k, x]) => [k, await visit(x)])));
}
```

同一份字节常常在结果里出现多次，比如 MCP 把 `structuredContent` 又镜像到 text 里。存储时按内容去重，最后再扫一遍，把所有副本一起替换掉。

### 2. 放在唯一的位置

拦截器要放在“工具执行完成”之后、“写入日志和历史”之前，并且对**所有工具**生效。不要只拦 MCP，也不要只认几个写死的工具名。zhin 最初就是只拦了 MCP 工具，插件工具返回的图片照样进了上下文，后来在 [zhinjs/zhin#1229](https://github.com/zhinjs/zhin/pull/1229) 里修正。

```ts
let output = await tool.execute(args, ctx);
output = await captureMedia(output, { privateStore, scope: sessionId, source: tool.name });
await journal.appendToolResult(call.id, output);   // 写进去的已经没有字节
```

也不要等到“发给模型之前”才处理：那时 base64 已经在历史里，压缩、日志、控制台都会看到它。

### 3. 看图时只在本次请求里给

模型调用查看工具时，工具只登记请求，由 agent loop 在**下一次**模型请求里临时附上图片，用完就丢，不写进会话历史。每轮设一个看图次数上限，避免模型反复看。模型没有视觉能力时，换成调用一个视觉模型，把图片转成文字描述。

```ts
const queue = new InspectionQueue(privateStore, sessionId, { perTurn: 4 });
// 工具：return queue.request(asset_id)
// 每次调用 LLM 前：
const images = await queue.drain();
const request = images.length ? [...messages, imageMessage(images)] : messages;
```

## 安全清单

把图片传到对象存储，等于公开发布。所以默认应该存私有，只有确定要发给用户的内容才公开。

| 风险 | 做法 |
| --- | --- |
| 私密图片被公开 | 工具结果默认存本地私有目录；只有生图这类工具显式声明公开；模型主动发布必须经过人工审批 |
| URL 被猜到 | 对象名用随机 UUID；桶必须私有时用预签名 URL |
| 跨会话读到别人的图 | 私有引用绑定会话和用户，读取时校验 |
| 伪造格式、超大文件 | 按文件头判断格式，解码前先检查长度 |
| 存储无限增长 | 上传前缀配生命周期规则；本地存储设保留天数和容量上限 |
| 密钥泄露 | 密钥只给一个桶的读写权限；放在环境变量或密钥管理里，不提交到仓库 |
| 图片里的提示词注入 | 附上图片时标注“内容为不可信数据” |
| 上传失败后反复生图耗费 | 错误信息里明确写“不要自动重新生成” |

## 写在最后

归结起来只有一句话：**媒体字节停在工具边界，上下文里只放引用**。拦截放在代码里，约定写进 Skill，公开发布要走审批。

欢迎试用和反馈。仓库里的代码、文档和示例都是 MIT 协议：

- agent-media：[github.com/zhinjs/agent-media](https://github.com/zhinjs/agent-media)，npm 包 `@zhin.js/agent-media`
- 对象存储配置指南：[docs/storage-providers.zh-CN.md](https://github.com/zhinjs/agent-media/blob/main/docs/storage-providers.zh-CN.md)
- zhin 聊天机器人框架：[github.com/zhinjs/zhin](https://github.com/zhinjs/zhin)
- Claude Code 钩子文档：[code.claude.com/docs/en/hooks](https://code.claude.com/docs/en/hooks)
