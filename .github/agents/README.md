# GitHub Custom Agent - Blog Post Generator

This directory contains the custom agent configuration for automated blog article generation.

## Overview

The Blog Post Generator is a specialized GitHub custom agent designed to create blog articles that follow this repository's established format and structure.

## Configuration File

- **Location**: `.github/agents/blog-post-generator.yml`
- **Purpose**: Automated generation of blog posts with proper formatting and structure

## Features

The custom agent can:
- Generate blog posts with proper YAML frontmatter
- Create content following the repository's markdown conventions
- Maintain consistent formatting with existing posts
- Auto-increment issue numbers
- Apply appropriate file naming conventions

## Blog Post Format

All generated blog posts follow this structure:

```yaml
---
title: "Article Title"
excerpt: "Brief article summary"
author: "凉菜"
date: "YYYY-MM-DD"
readTime: "X min read"
tags: ["tag1", "tag2"]
image: ""
issueNumber: N
---

[Markdown content here]
```

## Usage

To use this custom agent through GitHub Copilot:
1. Mention the agent in your conversation with GitHub Copilot
2. Request a blog post on a specific topic
3. The agent will generate the complete blog post file in `content/posts/`

## Reference Example

See `content/posts/hello-world.md` for an example of the proper blog post format.

## Agent Capabilities

The agent will:
- ✅ Create properly formatted frontmatter
- ✅ Generate well-structured Markdown content
- ✅ Use appropriate file names
- ✅ Maintain consistency with existing posts
- ✅ Include all required metadata fields
- ✅ Follow content quality guidelines

## Customization

To modify the agent's behavior, edit `.github/agents/blog-post-generator.yml` and adjust the instructions as needed.
