# Yurii Persystyi - Frontend Developer Portfolio

An interactive personal portfolio website built to showcase my frontend development skills, projects, and approach to creating modern web experiences.

The portfolio combines clean UI design with real-time WebGL graphics, particle systems, smooth transitions, and interactive 3D animations. Instead of using a traditional scrolling portfolio layout, the website presents each section as part of an immersive visual journey.

🌐 **Live Demo:** https://yurii1025.github.io/port/

## Overview

This portfolio was created as an exploration of how frontend development, interaction design, animation, and WebGL can work together in a single user experience.

The main visual element is an interactive particle-based 3D object that transforms as the user moves between sections of the website.

The experience is divided into several stages:

```text
Home
  ↓
About
  ↓
Skills
  ↓
Works
  ↓
Outro
```

Each stage has its own visual state and content while the central 3D object transforms to reflect the current section.

## Features

### 🌌 Interactive 3D Hero

The main visual element is a custom particle-based 3D object rendered with Three.js.

The object is built from thousands of particles and can smoothly morph between different forms depending on the active portfolio section.

Current visual states include:

* 🔵 Sphere
* 🌌 Galaxy / Network
* 🪐 Solar System
* ☀️ Sun
* 🕳️ Black Hole

The particle system is generated programmatically rather than using pre-rendered 3D assets. The `HeroSphere` class manages the different particle position sets and interpolates between them during transitions.

### 🖱️ Mouse Interaction

The WebGL scene responds to mouse movement.

Mouse coordinates are normalized and smoothly interpolated before being applied to the camera, creating a subtle parallax effect that makes the scene feel more dynamic.

The hero object also reacts when the pointer moves over its particles using Three.js `Raycaster` intersection detection.

### ✨ Particle Morphing

The same particle system can represent several completely different structures.

For example:

```text
Sphere
   ↓
Galaxy
   ↓
Solar System
   ↓
Sun
   ↓
Black Hole
```

Each state has its own generated particle positions.

The application interpolates between these position sets to create continuous transformations rather than replacing the object entirely.

### 🌌 Galaxy Visualization

The galaxy state uses multiple spiral arms generated mathematically from particle positions.

The current implementation creates a five-arm spiral structure with randomized noise to make the distribution feel more organic.

### 🪐 Solar System Visualization

The solar-system state is generated from:

* Multiple orbital radii
* Three planets
* Procedurally generated planet particles
* Orbital particle distributions

This creates a simplified procedural solar-system visualization without relying on external 3D models.

### ☀️ Sun Visualization

The sun state uses a dense particle shell with randomized phases.

The particles are distributed around the surface of the sphere to create a dense, glowing celestial-body effect.

### 🕳️ Black Hole

The final visual state transforms the particles into an accretion-disk-like structure around a separate black-hole core.

The black-hole core uses a custom `ShaderMaterial` with a small lighting calculation inside a fragment shader to create a dark, subtle highlight around the object.

### 🎬 Intro Animation

The website starts with a dedicated loading animation.

The loader begins as a small circle and expands across the screen before fading away. The WebGL canvas then becomes visible and the first section is revealed.

### 🧭 Section Navigation

The portfolio uses full-screen sections instead of a conventional long scrolling page.

Navigation is available through:

* Header navigation
* Mouse wheel
* Scroll-down buttons
* View Projects button

The current section is tracked internally and transitions are blocked while an animation is running to prevent overlapping navigation states.

### 🎞️ Section Transitions

Every section has its own entrance animation.

When navigating between sections:

1. The current section exits.
2. The next section enters from the appropriate direction.
3. The 3D object begins transforming.
4. Content elements appear sequentially.
5. Navigation state is updated.

Individual content elements use staggered reveal timing to create a more dynamic transition.

### 📱 Responsive Layout

The interface adapts to different screen sizes using CSS media queries.

The WebGL camera and renderer also respond to browser resizing, updating the camera aspect ratio and renderer dimensions accordingly.

## Portfolio Sections

### 🏠 Home

The landing screen introduces:

* Yurii Persystyi
* Frontend Developer role
* Personal development philosophy
* Core technologies
* View Projects button
* CV download

The hero section highlights React, JavaScript, responsive UI, and motion/interaction as key areas of focus.

### 👨‍💻 About

The About section presents the transition from technical education and support experience into frontend development.

The displayed journey includes:

* Computer Engineering
* Technical Support
* Frontend Development
* Interactive Experiences

The section emphasizes problem solving, communication, systems thinking, responsive interfaces, and user-focused design.

### 🛠️ Skills

The Skills section currently highlights:

| Skill          | Focus                              |
| -------------- | ---------------------------------- |
| **React**      | Component-based UI development     |
| **JavaScript** | Logic, DOM and APIs                |
| **CSS**        | Styling, layouts and animations    |
| **Figma**      | UI/UX design and prototyping       |
| **Git**        | Version control and collaboration  |
| **GSAP**       | Smooth, high-performance animation |

The portfolio represents skill levels visually using a five-dot indicator system.

### 💼 Works

The Works section showcases selected projects:

#### Emoji Memory Game

A browser-based memory game built with:

* HTML
* CSS
* JavaScript

**GitHub:** https://github.com/Yurii1025/Emoji-game

**Live Demo:** https://yurii1025.github.io/Emoji-game/

#### Animated Portfolio

The current portfolio itself.

Built with:

* HTML
* CSS
* JavaScript
* Three.js

**GitHub:** https://github.com/Yurii1025/port

**Live Demo:** https://yurii1025.github.io/port/

#### Gutendex Book Library

A book discovery application using the Gutendex API.

Built with:

* React
* JavaScript
* API integration

**GitHub:** https://github.com/Yurii1025/Gutendex

**Live Demo:** https://yurii1025.github.io/Gutendex/

The project cards and links are defined directly in the portfolio's Works section.

## Tech Stack

### Core

* **HTML5** - Semantic page structure
* **CSS3** - Layout, animations, responsive design, transitions, and visual effects
* **JavaScript ES Modules** - Application logic and modular architecture

### 3D & WebGL

* **Three.js** - WebGL rendering, scenes, cameras, particle systems, raycasting, geometries, materials, and shaders
* **WebGL** - Hardware-accelerated rendering through the browser

Three.js is loaded locally from the project's `build` directory rather than through a package manager. The application imports the Three.js module directly from `three.module.js`.

### Design

* **Inter** - Main interface typeface
* Custom CSS animations
* Responsive layouts
* CSS transitions
* Procedural visual effects

The project includes the Inter variable font locally and defines it through `@font-face`.

## Project Structure

```text
port/
├── assets/
│   ├── documents/
│   │   └── Yurii Persystyi CV.pdf
│   │
│   ├── icons/
│   │   ├── react.svg
│   │   ├── javascript2.svg
│   │   ├── css3.svg
│   │   ├── figma.svg
│   │   ├── git.svg
│   │   ├── layers.svg
│   │   ├── sparkles.svg
│   │   ├── github.png
│   │   └── ...
│   │
│   └── preview/
│       ├── emoji.png
│       ├── port.png
│       └── gutendex.png
│
├── build/
│   └── three.module.js
│
├── fonts/
│   └── Inter/
│       └── Inter-VariableFont_opsz,wght.ttf
│
├── js/
│   ├── shaders/
│   │
│   ├── app.js
│   ├── camera.js
│   ├── config.js
│   ├── heroSphere.js
│   ├── loader.js
│   ├── math.js
│   ├── mouse.js
│   ├── page.js
│   ├── plexus.js
│   ├── renderer.js
│   └── scene.js
│
├── libs/
│   ├── three.core.js
│   └── three.module.js
│
├── index.html
└── styles.css
```

The current repository is structured as a static web application with locally stored assets, fonts, Three.js modules, JavaScript modules, and the main stylesheet.

## Architecture

The application is split into several small JavaScript modules, each responsible for a specific part of the experience.

### `app.js`

The main application entry point.

It:

* Creates the `Plexus` instance
* Creates the `HeroSphere`
* Initializes mouse tracking
* Runs the animation loop
* Updates the camera
* Updates particle systems
* Renders the Three.js scene
* Performs raycasting against the hero sphere
* Starts page navigation and reveal effects

The render loop is driven by `requestAnimationFrame`.

### `scene.js`

Creates the main Three.js scene and perspective camera.

The camera uses:

```text
Field of view: 55°
Near clipping: 0.1
Far clipping: 100
Initial Z position: 6.5
```

The camera projection is recalculated whenever the browser window is resized.

### `renderer.js`

Creates the WebGL renderer with:

* Antialiasing
* Alpha transparency
* Device pixel ratio support
* sRGB color space
* ACES Filmic tone mapping

The pixel ratio is capped at `2` to help balance rendering quality and performance.

### `heroSphere.js`

The central visual engine of the portfolio.

The `HeroSphere` class generates and manages the particle-based visual system.

It stores multiple particle position sets:

```text
spherePositions
networkPositions
solarPositions
sunPositions
black hole data
```

The class also controls the corresponding transition progress values and visual states.

### `plexus.js`

Responsible for the additional particle/connection visual system used in the WebGL background.

It is instantiated alongside `HeroSphere` and updated on every animation frame.

### `camera.js`

Controls camera movement based on:

* Mouse position
* Scroll velocity
* Smooth interpolation

The camera uses `lerp()` to smoothly follow the target mouse position instead of immediately jumping to it.

### `page.js`

Controls the HTML interface and section navigation.

Responsibilities include:

* Section switching
* Navigation state
* Scroll handling
* Section transitions
* Intro animations
* Project button navigation
* Reload button
* Scroll-down controls

Sections are switched by applying CSS classes such as:

```text
active
exit-up
exit-down
enter-from-bottom
enter-from-top
```

### `loader.js`

Controls the initial loading sequence.

The WebGL canvas becomes visible after the intro delay, while the loader itself fades out.

### `config.js`

Contains configuration values for the particle and camera systems.

Current configuration includes:

```javascript
{
  particles: 100,
  connectionDistance: 1.55,
  particleSize: 0.032,
  speed: 0.0035,
  spaceX: 12,
  spaceY: 8,
  spaceZ: 6,
  cameraDistance: 9,
  mouseStrength: 0.75,
  rotationSpeed: 0.00045
}
```

### `math.js`

Provides small reusable mathematical helpers:

* `clamp()`
* `lerp()`
* `random()`

These functions are used by the animation and interaction systems.

## Rendering Pipeline

The application follows a continuous WebGL rendering loop:

```text
User Input
    ↓
Mouse / Wheel Events
    ↓
Camera Update
    ↓
Particle System Update
    ↓
Hero Sphere Update
    ↓
Raycasting
    ↓
Three.js Renderer
    ↓
WebGL Canvas
```

The main animation loop is defined in `app.js` and executes once per animation frame.

## Interaction Flow

The portfolio is designed around a controlled section-by-section journey.

### Navigation

Users can navigate using:

* Header navigation
* Mouse wheel
* Scroll buttons
* View Projects button

The wheel handler accumulates scroll delta and changes the section only after a defined threshold is reached. This prevents accidental transitions from small scroll movements.

### Visual Transformation

Each section corresponds to a different state of the central 3D object:

| Section | Visual State     |
| ------- | ---------------- |
| Home    | Sphere           |
| About   | Galaxy / Network |
| Skills  | Solar System     |
| Works   | Sun              |
| Outro   | Black Hole       |

The page controller triggers the corresponding transformation whenever the active section changes.

## Performance Considerations

The project uses several techniques to keep the WebGL experience responsive:

* Particle-based geometry instead of heavy 3D models
* `Float32Array` for particle position data
* GPU-rendered `THREE.Points`
* Device pixel ratio capped at `2`
* Hardware-accelerated WebGL rendering
* Reusable generated particle positions
* Smooth interpolation instead of abrupt state changes
* Local assets instead of unnecessary network requests

The renderer explicitly limits pixel ratio to reduce excessive GPU workload on high-density displays.

## Getting Started

This project is a static web application and does not require a Node.js build process or package installation.

### Prerequisites

You need:

* A modern browser with WebGL support
* Git, if you want to clone the repository
* A local development server for the best development experience

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Yurii1025/port.git
cd port
```

2. **Run the project with a local server**

Because the application uses JavaScript ES modules, it is recommended to serve the project through a local HTTP server instead of opening `index.html` directly.

For example, with Visual Studio Code:

1. Install the **Live Server** extension.
2. Open the project folder.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

The portfolio will then be available in your browser.

## Deployment

The project is deployed as a static website using GitHub Pages.

🌐 **Live Demo:** https://yurii1025.github.io/port/

No server-side application is required.

The repository contains all required frontend assets, JavaScript modules, fonts, and Three.js files needed to run the portfolio in the browser.

## Browser Requirements

The portfolio relies on WebGL and modern JavaScript features.

Recommended browsers:

* Google Chrome
* Mozilla Firefox
* Microsoft Edge
* Safari

A device with WebGL support is required for the full visual experience.

## Future Improvements

Possible improvements for future versions include:

* 📱 Further mobile optimization
* 🎮 Touch and gesture-based navigation
* 🎧 Optional sound design
* 🌓 Additional visual themes
* 🌐 Localization / multiple languages
* 🧩 More interactive WebGL scenes
* 🎨 Additional project case studies
* 📊 More detailed project information
* ⚡ Further WebGL performance optimization
* ♿ Improved accessibility
* 🔗 Fully implemented social media links
* 🖼️ Expanded project previews

## Inspiration & Approach

The portfolio is built around one main idea:

> **A portfolio should be an experience, not just a list of projects.**

Instead of presenting projects as isolated cards on a traditional page, the interface connects the content and visual layer together.

The changing 3D object represents the progression through the portfolio:

```text
Sphere
  ↓
Galaxy
  ↓
Solar System
  ↓
Sun
  ↓
Black Hole
```

The visual journey is designed to make navigation itself part of the portfolio.

## Author

**Yurii Persystyi**

Frontend Developer focused on:

* React
* JavaScript
* CSS
* Responsive UI
* UI/UX
* WebGL
* Interactive experiences
* Animation

### Links

* **GitHub:** https://github.com/Yurii1025
* **Portfolio:** https://yurii1025.github.io/port/

## License

This project is a personal portfolio and learning project.

The source code and original design are maintained by Yurii Persystyi.
