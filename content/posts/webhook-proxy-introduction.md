---
title: "Webhook Proxy：基于 Cloudflare Workers 的开源 Webhook 代理方案"
excerpt: "一个功能强大的 Webhook 代理服务，支持多平台集成、WebSocket/SSE 实时推送，以及完整的安全认证机制"
author: "凉菜"
date: "2025-11-08"
readTime: "8 min read"
tags: ["webhook", "cloudflare", "typescript", "开源项目"]
image: ""
issueNumber: 2
---

## 项目简介

[Webhook Proxy](https://github.com/lc-cn/webhook-proxy) 是一个基于 Cloudflare Workers 构建的开源 webhook 代理方案，它为开发者提供了一个强大而灵活的平台，用于接收、处理和转发来自各种服务的 webhook 事件。

### 核心亮点

- 🌐 **多平台支持**：支持 GitHub、GitLab、QQBot、Telegram、Stripe、Jenkins、Jira、Sentry 等多个主流平台
- ⚡ **实时推送**：提供 WebSocket 和 SSE 两种实时事件推送模式
- 🔒 **安全可靠**：集成 OAuth 认证、双因素认证(TOTP)、WebAuthn/Passkey 等多重安全机制
- 🚀 **高性能**：基于 Cloudflare Workers 的全球 CDN 边缘计算，响应时间低至 100ms
- 🛠️ **CLI 工具**：提供功能完善的命令行工具，支持自动登录和代理管理

## 技术架构

Webhook Proxy 采用现代化的技术栈和 Monorepo 架构：

### 核心服务 (@webhook-proxy/core)

核心服务运行在 Cloudflare Workers 上，利用其边缘计算能力提供低延迟的全球化服务：

- **运行时**：Cloudflare Workers
- **Web 框架**：Hono（轻量级、高性能）
- **数据库**：Cloudflare D1 (SQLite)
- **存储**：Cloudflare KV
- **认证**：OAuth 2.0, WebAuthn
- **语言**：TypeScript 5.3+

### CLI 工具 (webhook-proxy-cli)

提供便捷的命令行管理工具：

- **运行时**：Node.js 18+
- **框架**：Commander.js
- **UI 库**：Chalk + Ora + Inquirer
- **语言**：TypeScript 5.3+

## 主要功能

### 1. 多平台 Webhook 接入

Webhook Proxy 为每个主流平台提供了专门的适配器，支持平台特定的签名验证机制：

- **GitHub**：HMAC-SHA256 签名验证，平均响应时间 120ms
- **GitLab**：HMAC-SHA256 签名验证，平均响应时间 115ms
- **QQ Bot**：Ed25519 签名验证，支持官方机器人协议
- **Telegram**：Token 验证，响应最快（100ms）
- **Stripe**：HMAC-SHA256 + 时间戳验证
- **Generic**：通用适配器，支持任意平台

### 2. 实时事件推送

支持两种实时推送模式：

**WebSocket 模式**：
```javascript
const ws = new WebSocket('wss://your-domain.workers.dev/github/key/ws');

ws.onmessage = (event) => {
  const webhookEvent = JSON.parse(event.data);
  console.log('收到事件:', webhookEvent);
};
```

**SSE 模式**：
```javascript
const eventSource = new EventSource('https://your-domain.workers.dev/github/key/sse');

eventSource.onmessage = (event) => {
  const webhookEvent = JSON.parse(event.data);
  console.log('收到事件:', webhookEvent);
};
```

### 3. 完善的安全机制

#### 多种登录方式

CLI 支持 5 种灵活的登录方式：

1. **GitHub OAuth**（推荐）- 无需密码，快速便捷
2. **GitLab OAuth** - 适合 GitLab 用户
3. **用户名/邮箱 + 密码** - 传统方式，无需浏览器
4. **Passkey / 生物识别** - 使用指纹或 Face ID 登录
5. **手动输入 Token** - 备用方案

#### 双因素认证

- **TOTP**：支持 Google Authenticator 等 OTP 应用
- **WebAuthn**：支持硬件密钥和平台认证器

### 4. CLI 工具强大易用

```bash
# 安装 CLI
npm install -g webhook-proxy-cli

# 配置 API 地址
webhook-proxy config set-api https://your-api.workers.dev

# 登录（支持多种方式）
webhook-proxy login

# 列出所有代理
webhook-proxy list

# 创建新代理
webhook-proxy proxy create

# 更新代理
webhook-proxy proxy update <proxy-id>

# 删除代理
webhook-proxy proxy delete <proxy-id>
```

## 性能表现

Webhook Proxy 在 Cloudflare Workers 上展现出优异的性能：

| 平台 | P50 延迟 | P95 延迟 | P99 延迟 |
|------|---------|---------|---------|
| GitHub | 120ms | 250ms | 400ms |
| GitLab | 115ms | 240ms | 380ms |
| QQ Bot | 180ms | 350ms | 550ms |
| Telegram | 100ms | 220ms | 350ms |
| Stripe | 140ms | 280ms | 450ms |
| Generic | 80ms | 180ms | 300ms |

得益于 Cloudflare 的全球 CDN 网络，Webhook Proxy 能够在全球范围内提供低延迟的服务。

## 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/lc-cn/webhook-proxy.git
cd webhook-proxy

# 安装依赖
pnpm install

# 配置环境变量
cd packages/core
cp .dev.vars.example .dev.vars
# 编辑 .dev.vars，填入必要配置

# 启动开发服务器
pnpm dev
```

### 部署到 Cloudflare

```bash
# 登录 Cloudflare
npx wrangler login

# 创建 D1 数据库
npx wrangler d1 create webhook-proxy-db

# 创建 KV 命名空间
npx wrangler kv:namespace create "SESSIONS"
npx wrangler kv:namespace create "WEBHOOK_CONNECTIONS"

# 设置环境变量
npx wrangler secret put SESSION_SECRET
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET

# 运行数据库迁移
npx wrangler d1 migrations apply webhook-proxy-db --remote

# 部署
pnpm deploy
```

## 使用场景

### 1. GitHub Actions 集成

监听 GitHub webhook 事件，触发自定义工作流：

```javascript
const ws = new WebSocket('wss://api.workers.dev/github/your-key/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.event === 'push') {
    // 处理推送事件
    console.log('新的提交:', data.payload.commits);
  }
  
  if (data.event === 'pull_request') {
    // 处理 PR 事件
    console.log('PR 操作:', data.payload.action);
  }
};
```

### 2. QQ 机器人消息推送

接收 QQ 官方机器人的消息并进行处理：

```javascript
// 配置 QQ Bot webhook
const proxyUrl = 'https://api.workers.dev/qqbot/your-key';

// 通过 SSE 接收消息
const eventSource = new EventSource(`${proxyUrl}/sse`);

eventSource.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('收到 QQ 消息:', message.payload);
};
```

### 3. Stripe 支付通知

实时监听 Stripe 支付事件：

```javascript
const ws = new WebSocket('wss://api.workers.dev/stripe/your-key/ws');

ws.onmessage = (event) => {
  const stripeEvent = JSON.parse(event.data);
  
  switch (stripeEvent.payload.type) {
    case 'payment_intent.succeeded':
      console.log('支付成功:', stripeEvent.payload.data);
      break;
    case 'payment_intent.payment_failed':
      console.log('支付失败:', stripeEvent.payload.data);
      break;
  }
};
```

## 开发者友好

### Monorepo 架构

项目采用 pnpm workspaces 管理的 Monorepo 架构，清晰的代码组织：

```
webhook-proxy/
├── packages/
│   ├── core/           # 核心服务
│   │   ├── src/
│   │   │   ├── adapters/     # 平台适配器
│   │   │   ├── api/          # REST API
│   │   │   ├── auth/         # 认证模块
│   │   │   ├── db/           # 数据库操作
│   │   │   └── routes/       # 路由
│   │   └── migrations/       # 数据库迁移
│   │
│   └── cli/            # CLI 工具
│       └── src/
│           └── commands/     # CLI 命令
```

### 易于扩展

添加新平台支持非常简单：

```typescript
// 1. 创建适配器
import { BaseAdapter } from './base-cf.js';

export class MyPlatformAdapter extends BaseAdapter {
  async validateSignature(request: Request, secret: string): Promise<boolean> {
    // 实现签名验证
    return true;
  }

  async transformEvent(request: Request): Promise<WebhookEvent> {
    const body = await request.json();
    return {
      id: body.id,
      event: body.event_type,
      payload: body,
      timestamp: Date.now(),
    };
  }
}

// 2. 注册适配器
export function createAdapter(platform: string, env: Env): BaseAdapter {
  switch (platform) {
    case 'myplatform':
      return new MyPlatformAdapter(env);
    // ...
  }
}
```

## 社区与生态

### 开源许可

项目采用 MIT 许可证，允许自由使用、修改和分发。

### 贡献指南

项目提供了详细的贡献指南，欢迎开发者参与：

- 完善的类型定义
- 严格的代码规范
- 详细的文档和注释
- 持续集成和自动化部署

### 相关链接

- **GitHub 仓库**：[https://github.com/lc-cn/webhook-proxy](https://github.com/lc-cn/webhook-proxy)
- **npm 包**：[webhook-proxy-cli](https://www.npmjs.com/package/webhook-proxy-cli)
- **问题反馈**：[GitHub Issues](https://github.com/lc-cn/webhook-proxy/issues)

## 总结

Webhook Proxy 是一个功能完善、性能优异的 webhook 代理解决方案。无论你是需要集成多个第三方服务的 webhook，还是需要实时接收和处理事件，Webhook Proxy 都能提供简单、可靠的解决方案。

项目的亮点包括：

- ✅ 基于 Cloudflare Workers 的无服务器架构
- ✅ 支持主流平台的开箱即用
- ✅ 完善的安全认证机制
- ✅ 实时 WebSocket/SSE 推送
- ✅ 强大的 CLI 工具
- ✅ 清晰的代码结构和易于扩展

如果你正在寻找一个可靠的 webhook 代理方案，不妨试试 Webhook Proxy！

---

> 本文介绍的 Webhook Proxy 项目由 [lc-cn](https://github.com/lc-cn) 开发维护，是一个活跃的开源项目。如果这个项目对你有帮助，欢迎给项目点个 Star ⭐
