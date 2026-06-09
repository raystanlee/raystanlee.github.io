---
title: "SO-ARM101"
groups: ["ml", "hardware"]
date: 2026-06-06
draft: false
image: "img/so-arm/arm.jpg"
show_in_home: true
tags: ["robotics", "AI", "imitation learning", "hardware"]
---

Agent-47 already had perception (RealSense + Orin Nano) and reasoning. This project adds physical action — training an imitation learning policy on a robot arm and wiring it back into the agent as a callable MCP tool.

## Hardware

The SO-ARM101 is a 6-DOF desktop arm using Feetech STS3215 serial bus servos in a leader-follower teleoperation configuration. The leader records joint angles as you demonstrate; the follower mirrors in real time. It's the reference hardware for [LeRobot](https://github.com/huggingface/lerobot), which meant pretrained policies, active community support, and a known-good data pipeline out of the box.

![SO-ARM101](/img/so-arm/demo.gif)

**Task:** pick up a small dark object from a random position in a 20×20cm workspace and drop it in a fixed bin. Fixed top-down 1080p webcam, white paper background, coloured bin for visual contrast.

I deliberately didn't use the RealSense for this. ACT is RGB-only so the depth stream would be discarded anyway, and USB power was already marginal running two Feetech BusLinker boards simultaneously. The RealSense stays on the Orin for the agent's perception loop; the arm uses the cheap webcam from the kit.

## Data Collection

24 demonstrations (~25s each) via teleoperation. Each frame pairs two inputs — camera image + current joint positions — with one output: target joint positions. Dataset: **17,627 frames**, published to Hugging Face Hub.

A 5-episode dry run before real recording caught several issues: white object against white background made the release frame undetectable, camera position behind the arm caused occlusion, and the bin moved between episodes. Fixing these took 30 minutes. The bad dataset they prevented would have taken hours to diagnose post-hoc.

The most important discipline during recording: watch only the camera feed, never the physical arm. The policy reproduces what the camera saw — corrections made by watching the real arm introduce compensations the policy can't replicate at inference time.

## Policy: ACT

Architecture: **Action Chunking Transformer (ACT)** — predicts a chunk of 100 future joint positions per inference step rather than one. This removes the jitter from single-step prediction and lets the policy commit to longer motion sequences without recomputing at every frame.

Inputs: camera image through a ResNet-18 backbone + current joint state. Output: next 100 joint positions at 30 Hz. A VAE encoder regularises the latent space during training, preserving the natural variability across demonstrations instead of collapsing them into an averaged trajectory — important for tasks where grasp approach varies slightly each time.

| | |
|---|---|
| Architecture | ACT (Action Chunking Transformer) |
| Vision backbone | ResNet-18, ImageNet pretrained |
| Action chunk size | 100 steps |
| Demonstrations | 24 episodes / 17,627 frames |
| Hardware | Apple M4 Pro (MPS) |
| Training time | 8h 21m @ ~3.3 steps/sec |
| Final L1 loss | 0.045 |
| Control frequency | 30 Hz |

Trained overnight on MPS. An RTX 3090 rental would cut this to 3–4 hours — the M4 Pro is ~2.5x slower for this workload but costs nothing and doesn't require a remote environment.

## Evaluation

<video controls width="100%" style="border-radius: 8px; margin: 1rem 0;">
  <source src="/img/so-arm/demo.mp4" type="video/mp4">
</video>

`lerobot-record` has an upstream bug ([#2597](https://github.com/huggingface/lerobot/issues/2597)) where invoking it with `--policy.path` but no teleop device causes the reset loop to spin indefinitely — no policy and no teleoperator attached to the second call, so it spams `WARNING: No policy or teleoperator provided` and reads stale motor bus data until timeout. Worked around it by writing `robot/evaluate.py` directly against `ACTPolicy`: a 30 Hz inference loop with manual episode resets via keyboard prompt.

**Result: 5/5 successful pick-and-place runs.**

The policy is distribution-sensitive — lighting changes from training conditions degrade performance noticeably. Expected for vision-based imitation learning. The fix is data diversity across conditions, not architecture changes.

## Integration with Agent 47

The arm slots into the agent as an MCP tool using the same pattern as every other capability. `capture_scene` already gives the agent workspace vision via the RealSense. The next tool is `execute_manipulation`, which wraps the ACT policy and exposes it over the same interface.

```
"pick up the bottle"  →  capture_scene  →  execute_manipulation  →  capture_scene  →  report
```

Natural language in, physical action out, visual confirmation back. The agent calls the tool; the complexity lives in the policy.

## Source Code

[Agent-47 on GitHub](https://github.com/raystanlee/Agent-47) — `robot/` contains dataset config, training context, and evaluation script.
