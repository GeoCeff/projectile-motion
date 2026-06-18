# Mobile App Notes

This folder contains the static Projectile Motion Lab web app.

## Files

- `index.html` defines the controls, graph panels, presets, and reference notes.
- `style.css` provides the graphing-calculator inspired responsive layout.
- `app.js` contains the physics simulation, Chart.js configuration, validation, metrics, presets, reset behavior, and CSV export.

## Features

- Vertical fall comparison with position, velocity, and acceleration graphs.
- Projectile trajectory comparison with ideal and drag-aware paths.
- Object presets for quick classroom experiments.
- Separate values for vertical fall and projectile launch parameters.
- Live auto-update mode with manual run buttons.
- Input validation for invalid or expensive simulation settings.
- CSV export for further analysis in spreadsheets.

## Local Use

Open `index.html` directly in a browser. The only external dependency is Chart.js, which is loaded from a CDN.

## Model Limitations

- Gravity is fixed at `9.8 m/s^2`.
- Drag is modeled as quadratic drag.
- Wind, lift, spin, buoyancy, and changing air density are not included.
- Numerical integration accuracy depends on the chosen time step.
