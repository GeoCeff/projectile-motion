# Projectile Motion Lab

An interactive browser-based physics lab for exploring projectile motion with and without air resistance. The app turns the Activity 4.3 projectile motion model into a polished graphing-calculator style experience with live charts, presets, validation, and exportable data.

## What It Does

- Simulates vertical fall with and without quadratic drag.
- Simulates 2D projectile launch with and without air resistance.
- Charts position, velocity, acceleration, and trajectory comparisons.
- Shows summary metrics such as range, apex, range loss, drag velocity, and terminal speed.
- Includes presets for common objects: baseball, tennis ball, ping pong ball, and steel ball.
- Supports auto-updating graphs, manual reruns, reset, and CSV export.
- Runs entirely in the browser with no build step.

## Live App

Open the app locally from:

```text
mobile_app/index.html
```

If GitHub Pages is enabled for this repository, the root `index.html` redirects to the app automatically.

## How To Use

1. Open `mobile_app/index.html` in a browser.
2. Choose an object preset or enter your own values.
3. Adjust mass, radius, drag coefficient, air density, speed, launch angle, and time step.
4. Use auto update for live recalculation, or turn it off and press the run buttons manually.
5. Export the generated simulation table with `Export CSV`.

## Physics Model

The app compares two models:

- Ideal motion, where the only acceleration is gravity.
- Motion with quadratic drag, where drag increases with cross-sectional area and the square of speed.

Core relationships:

```text
g = 9.8 m/s^2
A = pi r^2
F_d = 0.5 C rho A v^2
```

The drag force is applied opposite the direction of motion. The simulation uses a small fixed time step and numerical integration so students can see how changing parameters affects the result.

## Project Structure

```text
.
├── index.html              # Root redirect for simple hosting
├── mobile_app/
│   ├── index.html          # App interface
│   ├── style.css           # Responsive professional UI
│   ├── app.js              # Physics simulation, charts, presets, export
│   └── README.md           # App-specific notes
├── LICENSE                 # MIT license
└── README.md               # Project overview
```

## Tech Stack

- HTML
- CSS
- JavaScript
- Chart.js through CDN

No package installation is required.

## Suggested Repository About Fields

Description:

```text
Interactive projectile motion web app comparing ideal motion and quadratic air resistance.
```

Website:

```text
https://geoceff.github.io/projectile-motion/
```

Topics:

```text
physics, projectile-motion, simulation, chartjs, javascript, html, css, education, air-resistance
```

## License

This project is released under the [MIT License](LICENSE).
