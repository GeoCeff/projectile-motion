# Projectile Motion Lab

An interactive browser-based physics lab for exploring projectile motion with and without air resistance. The app turns the Activity 4.3 projectile motion model into a polished graphing-calculator style experience with live charts, presets, validation, share links, image exports, and CSV data.

## What It Does

- Simulates vertical fall with and without quadratic drag.
- Simulates 2D projectile launch with and without air resistance.
- Charts position, velocity, acceleration, trajectory, and mechanical energy.
- Shows summary metrics such as range, apex, range loss, flight time, drag velocity, and terminal speed.
- Includes presets for common objects: baseball, tennis ball, ping pong ball, and steel ball.
- Includes environment presets for Earth, Moon, Mars, and vacuum conditions.
- Lets students change gravity and air density independently for each simulation.
- Supports auto-updating graphs, manual reruns, reset, CSV export, and per-chart PNG downloads.
- Creates shareable links that preserve the current simulation values.
- Includes lightweight web app manifest metadata for install/bookmark support.
- Runs a GitHub Actions syntax check on pushes and pull requests.
- Runs entirely in the browser with no build step.

## Live App

Use the live GitHub Pages app:

```text
https://geoceff.github.io/projectile-motion/
```

Or open the app locally from:

```text
mobile_app/index.html
```

## How To Use

1. Open the live app or `mobile_app/index.html`.
2. Choose an object preset or enter your own values.
3. Adjust mass, radius, drag coefficient, air density, gravity, speed, launch angle, and time step.
4. Use auto update for live recalculation, or turn it off and press the run buttons manually.
5. Use `Share Link` to copy the current setup, `Export CSV` to save generated data, or `PNG` to download individual charts.

## Physics Model

The app compares two models:

- Ideal motion, where the only acceleration is gravity.
- Motion with quadratic drag, where drag increases with cross-sectional area and the square of speed.

Core relationships:

```text
A = pi r^2
F_d = 0.5 C rho A v^2
E = 0.5 m v^2 + m g y
```

The drag force is applied opposite the direction of motion. Gravity is adjustable, so the same launch can be compared under Earth, Moon, Mars, and vacuum-style conditions. The simulation uses a small fixed time step and numerical integration so students can see how changing parameters affects the result.

## Project Structure

```text
.
|-- index.html               # Root redirect for simple hosting
|-- .github/workflows/
|   `-- ci.yml               # JavaScript syntax check
|-- mobile_app/
|   |-- index.html           # App interface
|   |-- style.css            # Responsive professional UI
|   |-- app.js               # Physics simulation, charts, presets, share links, export
|   |-- manifest.webmanifest # Browser install/bookmark metadata
|   `-- README.md            # App-specific notes
|-- LICENSE                  # MIT license
`-- README.md                # Project overview
```

## Tech Stack

- HTML
- CSS
- JavaScript
- Chart.js through CDN

No package installation is required.

## Repository About Fields

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
physics, projectile-motion, simulation, chartjs, javascript, html, css, education, air-resistance, numerical-methods
```

## License

This project is released under the [MIT License](LICENSE).
