---
title: "Agent-47"
groups: ["ml"]
date: 2026-04-14
draft: false
image: "img/agent-47/cover.gif"
show_in_home: true
tags: ["AI", "software", "robotics"]
---

# Agent-47

Agent-47 is a personal AI agent I built that runs on my machine and takes instructions in plain English — from the terminal or from my phone via Telegram. You tell it what you want done, it figures out the steps, executes them, and reports back.

No GUIs, no clicking through menus. Just describe the task.

## What It Can Do

Here's a sample of the kinds of things you can ask it:

- *"Analyze the CSV in my workspace and show me the key trends"*
- *"Read my README, check the git diff, rewrite it, and push to GitHub"*
- *"Search the web for the latest AI research and summarize it"*
- *"What are my most recent emails about?"*
- *"Delete all files in the temp folder"*
- *"What do you see in front of the camera?"* — captures live RGB + depth from the RealSense
- *"What is in this image?"* — writes a vision tool on the spot if one doesn't exist yet

The agent handles file management, code operations, web search, email, GitHub, and computer vision out of the box. And if you ask for something it can't do yet, it doesn't fail — it writes the tool itself, registers it, and completes the request all in the same turn. That tool is saved to disk and available on every future run.

## Demo

<video controls width="100%" style="border-radius: 8px; margin: 1rem 0;">
  <source src="/img/agent-47/demo.mp4" type="video/mp4">
</video>

## Runs Anywhere You Are

Agent-47 supports two interfaces that share the same live session:

- **Terminal** — full control from the command line
- **Telegram bot** — send commands from your phone, get responses back wherever you are

Both interfaces stay in sync. A file you tell it to create from the terminal shows up in the same session your phone is watching.

## Hardware Vision

The agent is physically connected to an NVIDIA Jetson Orin Nano with an Intel RealSense D435i depth camera. This gives it real-world perception — it can see what's in front of the camera in both RGB and depth, reason about it, and take action based on what it observes.

![NVIDIA Jetson Orin Nano](/img/yolo/orin_nano.jpg)

![Intel RealSense Camera](/img/yolo/realsense.jpg)

## Technical Design

The core challenge in building an agent like this is cost and latency — a naive implementation sends every request through the most powerful model available, which gets expensive fast. Agent-47 addresses this with a two-model architecture:

- **Intent classification** runs on a lightweight model to determine which tools are relevant before anything is executed
- **Main reasoning** runs on a more capable model only when needed, with full tool access

Tools are connected via the **Model Context Protocol (MCP)**, which provides a standardized interface for integrating external services. Current integrations: GitHub, Brave Search, Gmail, and Telegram.

Conversation memory is handled through automatic summarization — the agent compresses older context as sessions grow rather than dropping it, keeping coherence across long runs without unbounded token growth. Every session ends with a full cost breakdown: tokens used, cache hits, and total spend.

| Component | Detail |
|---|---|
| Intent classification | Lightweight model |
| Main reasoning | Full-capability model |
| Tool connectivity | Model Context Protocol (MCP) |
| Integrations | GitHub, Brave Search, Gmail, Telegram |
| Vision hardware | Jetson Orin Nano + RealSense D435i |
| Language | Python |

## Source Code

[Agent-47 on GitHub](https://github.com/raystanlee/Agent-47)
