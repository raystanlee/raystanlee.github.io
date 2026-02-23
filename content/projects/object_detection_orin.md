---
title: "Object Detection on Orin Nano/Realsense"
group: software
date: 2025-02-22
draft: false
image: "img/yolo/yolo.jpg"
show_in_home: true
tags: ["robotics", "software", "hardware"]
---

# Overview

### Jetson Orin Nano + Intel RealSense + YOLOv8
A very basic real-time object detection project running directly on the NVIDIA Jetson Orin Nano using an Intel RealSense camera and YOLOv8.

The overall aim of working on this project was to setup my Nvidia Jetson Orin Nano and Intel RealSense camera, laying the foundation for future CV and automation project


## Setting Up the Jetson Orin Nano
![Orin setup](/img/yolo/orin_nano.jpg)
Getting started required flashing the correct JetPack image onto a microSD card and completing the Ubuntu setup process.

	•	Reformatting the SD card
	•	Downloading the correct Orin Nano image
	•	Re-flashing using Balena Etcher

After setup, I updated the system and installed essential development tools to prepare the device for computer vision workloads.

## Integrating the Intel RealSense Camera
![RealSense setup](/img/yolo/realsense.jpg)

The Intel RealSense D435i provides both color and depth data. Since the Jetson runs on ARM architecture, the RealSense SDK is not fully plug-and-play.

To ensure compatibility, I built the librealsense SDK from the available source code. Once installed successfully, the RealSense viewer confirmed that the camera feed was working correctly.

## Building the Real-Time Detection Pipeline
![Yolo setup](/img/yolo/setup.jpg)
With hardware validated, I installed the required Python libraries and implemented a simple real-time detection script.

The system:

	•	Streams color frames from the RealSense camera
	•	Runs YOLOv8 inference on each frame
	•	Displays annotated detections using OpenCV
	•	Runs fully on-device using the Jetson GPU

While intentionally simple, this project establishes a strong foundation for more advanced robotics, CV and autonomous systems work.

## Source Code

You can view the complete project repository here:

[Jetson Orin Nano + RealSense + YOLOv8 on GitHub](https://github.com/raystanlee/jetson-orin-nano-realsense-yolov8)