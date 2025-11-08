# GitHub 自定义代理 - 博客文章生成器

本目录包含用于自动生成博客文章的自定义代理配置。

## 概述

博客文章生成器是一个专门的 GitHub 自定义代理，旨在创建遵循本仓库既定格式和结构的博客文章。

## 配置文件

- **位置**：`.github/agents/blog-post-generator.yml`
- **用途**：自动生成格式正确、结构规范的博客文章

## 功能特性

自定义代理可以：
- 生成带有正确 YAML 前置数据的博客文章
- 按照仓库的 Markdown 规范创建内容
- 保持与现有文章格式的一致性
- 自动递增问题编号
- 应用适当的文件命名规范

## 博客文章格式

所有生成的博客文章都遵循以下结构：

```yaml
---
title: "文章标题"
excerpt: "文章简要概述"
author: "凉菜"
date: "YYYY-MM-DD"
readTime: "X min read"
tags: ["标签1", "标签2"]
image: ""
issueNumber: N
---

[Markdown 内容在此]
```

## 使用方法

通过 GitHub Copilot 使用此自定义代理：
1. 在与 GitHub Copilot 的对话中提及该代理
2. 请求生成关于特定主题的博客文章
3. 代理将在 `content/posts/` 目录中生成完整的博客文章文件

## 参考示例

查看 `content/posts/hello-world.md` 以了解正确的博客文章格式示例。

## 代理能力

代理将：
- ✅ 创建格式正确的前置数据
- ✅ 生成结构良好的 Markdown 内容
- ✅ 使用适当的文件名
- ✅ 保持与现有文章的一致性
- ✅ 包含所有必需的元数据字段
- ✅ 遵循内容质量指南

## 自定义配置

要修改代理的行为，请编辑 `.github/agents/blog-post-generator.yml` 并根据需要调整说明。
