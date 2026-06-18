# Mobile App Notes

This folder contains the static Projectile Motion Lab web app.

## Files

- `index.html` defines the controls, graph panels, presets, and reference notes.
- `style.css` provides the graphing-calculator inspired responsive layout.
- `app.js` contains the physics simulation, Chart.js configuration, validation, metrics, presets, reset behavior, and CSV export.
- `manifest.webmanifest` provides install/bookmark metadata for browsers.

## Features

- Vertical fall comparison with position, velocity, and acceleration graphs.
- Projectile trajectory comparison with ideal and drag-aware paths.
- Object presets for quick classroom experiments.
- Environment presets for Earth, Moon, Mars, and vacuum comparisons.
- Separate values for vertical fall and projectile launch parameters.
- Adjustable gravity, air density, and drag settings.
- Live auto-update mode with manual run buttons.
- Input validation for invalid or expensive simulation settings.
- Shareable links that encode the current simulation values in the URL hash.
- Mechanical energy chart for comparing ideal conservation against drag losses.
- Projectile animation scrubber with live ideal and drag position markers.
- Launch speed and angle sliders for faster exploration.
- Comparison table for range, apex, flight time, and ending energy.
- CSV export for further analysis in spreadsheets.
- Per-chart PNG export for reports, slides, and lab writeups.

## Local Use

Open `index.html` directly in a browser. The only external dependency is Chart.js, which is loaded from a CDN.

## Model Limitations

- Drag is modeled as quadratic drag.
- Gravity is adjustable but constant within a simulation run.
- Wind, lift, spin, buoyancy, and changing air density are not included.
- Numerical integration accuracy depends on the chosen time step.
