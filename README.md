# Water Ripples Shader (GLSL)

This project is a real-time animated water ripple shader written in GLSL. It simulates the natural motion of water using procedural ripple generation, displacement mapping, and time-based animations. The result is a visually realistic water surface that reacts dynamically over time, complete with ripple expansion and fading effects.

![image](https://github.com/user-attachments/assets/85e045e3-8e9a-4bf5-aebf-9853cdf80fb8)


## Features

- **Procedural Ripple Simulation**  
  Ripples are generated using sine and radial wave equations, creating circular patterns that mimic real water movement.

- **Displacement Mapping**  
  The water surface is distorted in the vertex shader based on dynamic wave calculations.

- **Time-Based Animation**  
  Ripples animate outward over time, simulating the natural decay and propagation of water waves.

- **Fading Effects**  
  Ripples gradually fade as they move outward, creating a smooth, realistic water decay effect.

## How It Works

The shader calculates ripple displacement procedurally using mathematical wave functions rather than texture maps. This allows for:

- Continuous animation controlled by a time uniform
- Clean, sharp surface deformation in real time
- Scalable simulation that can be tweaked by adjusting wave parameters

## Technologies Used

- **GLSL (OpenGL Shading Language)**  
- **OpenGL** (for rendering and setup)
