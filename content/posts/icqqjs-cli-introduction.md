---
title: "@icqqjs/cli：在终端里玩转 QQ 的命令行客户端"
excerpt: "一个基于 icqq 协议的命令行 QQ 客户端，使用 React Ink 构建交互式终端 UI，支持消息收发、群管理、频道操作等丰富功能"
author: "凉菜"
date: "2026-04-11"
readTime: "10 min read"
tags: ["QQ", "CLI", "typescript", "React Ink", "开源项目"]
image: ""
issueNumber: 7
---

## 项目简介

[@icqqjs/cli](https://github.com/icqqjs/cli) 是一个基于 [icqq](https://github.com/icqqjs/icqq) 协议库的命令行 QQ 客户端。它使用 React Ink 构建交互式终端 UI，让你无需打开图形界面，就能在终端中完成几乎所有 QQ 操作——从发送消息、管理好友群组，到频道交流、文件传输，一切尽在指尖。

### 为什么选择命令行？

作为开发者，终端是我们的主战场。在终端中操作 QQ 有着不可忽视的优势：

- 🚀 **效率至上**：无需切换窗口，一条命令搞定消息收发
- 🤖 **自动化友好**：轻松与 Shell 脚本、CI/CD 流程集成
- 🖥️ **服务器场景**：在无桌面环境的远程服务器上也能使用 QQ
- ⚡ **资源节省**：相比图形客户端，终端应用占用极少的系统资源
- 🔧 **极客体验**：对终端爱好者来说，命令行就是最好的 UI

## 核心亮点

- 💬 **完整的消息能力**：支持私聊、群聊、频道消息，支持 CQ 码发送表情、图片、@等富文本内容
- 🎨 **交互式终端 UI**：基于 React Ink 的现代化终端界面，提供流畅的聊天体验
- 👥 **全面的社交管理**：好友列表、好友分组、群管理、群文件系统一应俱全
- 🏰 **频道支持**：完整的 QQ 频道（Guild）操作，包括子频道消息、成员管理
- 🔄 **守护进程架构**：后台运行守护进程，断线自动重连，多账号随意切换
- 🌐 **Webhook 推送**：支持将消息事件通过 HTTP POST 推送到指定 URL
- 🔔 **系统通知**：可开关的系统通知，不错过任何重要消息

## 安装与快速上手

### 安装

使用 npm 全局安装：

```bash
npm install -g @icqqjs/cli
```

### 安装核心依赖

CLI 依赖 `@icqqjs/icqq` 协议库，首次使用需要安装。推荐使用一键安装命令：

```bash
# 自动配置 .npmrc + 安装 icqq
icqq setup
```

如需手动安装，请先配置 npm scope 指向 GitHub Packages，然后安装 `@icqqjs/icqq`。

### 登录

```bash
# 交互式登录，跟随向导完成配置
icqq login

# 快速重连（使用已保存的 token）
icqq login -r

# 指定账号快速重连
icqq login -q 12345 -r
```

登录成功后，守护进程会在后台运行，保持你的 QQ 在线状态。

## 架构设计

```
┌──────────────────────────────────────────────────────┐
│                     icqq CLI                         │
│  ┌────────────┐  ┌────────────┐  ┌───────────────┐  │
│  │  Pastel     │  │  React Ink │  │  IPC Client   │  │
│  │  文件路由   │─▸│  终端 UI   │  │  (ipc-client) │  │
│  └────────────┘  └────────────┘  └───────┬───────┘  │
└──────────────────────────────────────────┬───────────┘
                                           │ Unix Socket
                                           │ + Token 认证
┌──────────────────────────────────────────┴───────────┐
│                   守护进程 (Daemon)                    │
│  ┌────────────┐  ┌────────────┐  ┌───────────────┐  │
│  │  icqq      │  │  IPC       │  │  Webhook      │  │
│  │  Client    │◂─│  Server    │─▸│  推送          │  │
│  │  (QQ协议)  │  │  (server)  │  │  (HTTP POST)  │  │
│  └─────┬──────┘  └────────────┘  └───────────────┘  │
└────────┼─────────────────────────────────────────────┘
         │
         ▼
   腾讯 QQ 服务器
```

项目采用了优雅的分层架构：

- **CLI 层**：使用 [Pastel](https://github.com/vadimdemedes/pastel) 实现文件系统路由，`src/commands/` 的目录结构就是命令结构，非常直观。React Ink 负责渲染终端 UI，带来类似 React 的组件化开发体验
- **IPC 通信**：CLI 与守护进程通过 Unix Socket 通信（`~/.icqq/<uin>/daemon.sock`），首次连接需要 Token 认证，确保安全性
- **守护进程**：登录后在后台运行，自动管理 icqq 客户端实例，支持断线重连（指数退避，最多 5 次），日志超过 5MB 自动轮转
- **Webhook**：可选配置，守护进程可将所有消息事件 POST 到指定 URL，方便接入自动化流程

## 命令一览

### 消息——终端里的聊天体验

```bash
# 给好友发消息
icqq friend send <qq> "你好！"

# 发送群消息
icqq group send <gid> "大家好！"

# 进入交互式聊天模式（好友/群）
icqq friend chat <qq>
icqq group chat <gid>

# 查看聊天记录
icqq friend chat history <qq>
icqq group chat history <gid>
```

消息支持 CQ 码语法，可以发送富文本内容：

```
[face:id]    表情
[image:path] 图片
[at:uid]     @某人
[at:all]     @全体成员
[dice]       骰子
[rps]        猜拳
```

### 好友管理

```bash
# 好友列表
icqq friend list

# 查看好友资料
icqq friend view <qq>

# 点赞、戳一戳
icqq friend like <qq>
icqq friend poke <qq>

# 好友分组管理
icqq friend class list
icqq friend class add <name>

# 文件传输
icqq friend send-file <qq> <file>
```

### 群管理——管理员的得力助手

```bash
# 群列表和成员
icqq group list
icqq group member list <gid>

# 群管理操作
icqq group kick <gid> <qq>             # 踢人
icqq group mute <gid> <qq> [duration]  # 禁言
icqq group mute-all <gid>              # 全体禁言
icqq group set admin <gid> <qq>        # 设置管理员
icqq group set name <gid> <name>       # 修改群名

# 群文件系统
icqq group fs list <gid>               # 文件列表
icqq group fs upload <gid> <file>      # 上传文件
icqq group fs mkdir <gid> <name>       # 创建文件夹

# 群公告与签到
icqq group announce <gid> <content>
icqq group sign <gid>
```

### 频道操作

```bash
# 频道列表
icqq guild list

# 子频道消息
icqq guild channel send <guild_id> <channel_id> <message>

# 进入子频道聊天模式
icqq guild channel chat <guild_id> <channel_id>
```

### 多账号与配置

```bash
# 查看所有守护进程状态
icqq status

# 切换当前操作账号
icqq switch [uin]

# 也可以通过参数或环境变量指定
icqq -u 12345 profile
ICQQ_CURRENT_UIN=12345 icqq friend list

# 配置管理
icqq config get
icqq config set <key> <value>
```

### 更多实用功能

```bash
# 个人设置
icqq set nickname <name>        # 修改昵称
icqq set avatar <file>          # 修改头像
icqq set online-status <status> # 修改在线状态

# Webhook 配置
icqq webhook set <url>          # 设置推送地址
icqq webhook off                # 关闭推送

# 实用工具
icqq ocr <file>                 # 图片文字识别
icqq convert uid <qq>           # QQ 号转 UID
icqq completion [shell]         # 生成 Shell 自动补全
```

## 技术栈

| 技术 | 用途 |
|------|------|
| **TypeScript** | 主开发语言，类型安全 |
| **React Ink** | 终端 UI 渲染框架 |
| **Pastel** | 文件系统路由，命令即目录 |
| **Zod** | 参数校验 |
| **icqq** | QQ 协议实现 |
| **Unix Socket + IPC** | CLI 与守护进程通信 |
| **tsdown** | 构建工具 |
| **Vitest** | 测试框架 |

项目要求 Node.js >= 22，采用 ESM 模块系统，使用 pnpm 作为包管理器。

## 使用场景

### 1. 服务器消息通知

在服务器上部署 icqq CLI，配合 Webhook 或脚本实现自动消息通知：

```bash
# 部署完成后发送通知
icqq group send <gid> "🚀 v2.0.0 部署完成！"

# 配合 Webhook 接收消息事件
icqq webhook set https://your-server.com/webhook
```

### 2. 群管理自动化

编写 Shell 脚本批量处理群管理任务：

```bash
#!/bin/bash
# 批量禁言违规用户
for qq in 111 222 333; do
  icqq group mute <gid> $qq 3600
done
```

### 3. 开发调试

开发 QQ 机器人时，通过 CLI 快速测试消息收发：

```bash
# 快速发送测试消息
icqq friend send <qq> "测试消息"

# 查看消息详情
icqq msg get <msgid>
```

### 4. 日常使用

对于终端重度用户来说，icqq CLI 就是你的日常 QQ 客户端：

```bash
# 进入群聊天模式，实时收发消息
icqq group chat <gid>

# 查看好友请求并处理
icqq requests
icqq request accept <flag>
```

## 开发与贡献

如果你想参与开发或了解源码：

```bash
# 克隆并安装
git clone https://github.com/icqqjs/cli.git
cd cli
pnpm install

# 构建
pnpm build

# 本地全局注册
npm link

# 运行测试
pnpm test
```

项目使用 [release-please](https://github.com/googleapis/release-please) 管理版本发布，推送代码后 GitHub Actions 会自动创建 Version PR，合并后自动发布。

## 项目状态

icqqjs/cli 目前已发布到 **v1.4.3** 版本，处于活跃开发状态。近期更新亮点：

- ✅ 支持 Node.js 24
- ✅ 完整的频道（Guild）系统命令
- ✅ 交互式聊天模式，支持 @提及、表情选择、文件发送
- ✅ Shell 自动补全
- ✅ 登录向导优化，支持多平台和协议版本选择
- ✅ 智能安装流程，自动检测包管理器
- ✅ 可点击的终端链接

## 相关链接

- **GitHub 仓库**：[https://github.com/icqqjs/cli](https://github.com/icqqjs/cli)
- **npm 包**：[@icqqjs/cli](https://www.npmjs.com/package/@icqqjs/cli)
- **icqq 协议库**：[https://github.com/icqqjs/icqq](https://github.com/icqqjs/icqq)
- **问题反馈**：[GitHub Issues](https://github.com/icqqjs/cli/issues)

## 总结

@icqqjs/cli 为终端用户和开发者提供了一个功能完备的命令行 QQ 客户端。它的特点包括：

- ✅ 基于 React Ink 的现代化交互式终端 UI
- ✅ 覆盖 QQ 几乎所有功能的 100+ 命令
- ✅ 守护进程架构，后台运行、断线自动重连
- ✅ 多账号支持，灵活切换
- ✅ Webhook 推送，无缝对接自动化流程
- ✅ 频道系统完整支持
- ✅ 文件系统路由，命令结构清晰直观

无论你是想在服务器上收发 QQ 消息、自动化群管理任务，还是单纯享受在终端中使用 QQ 的极客体验，@icqqjs/cli 都值得一试！

---

> 本文介绍的 @icqqjs/cli 项目由 [icqqjs](https://github.com/icqqjs) 组织开发维护，采用 ISC 许可证。如果这个项目对你有帮助，欢迎给项目点个 Star ⭐
