const maxIterations = 50000;

const chartColors = {
  blue: '#2d70b3',
  blueFill: 'rgba(45, 112, 179, 0.12)',
  red: '#c74440',
  redFill: 'rgba(199, 68, 64, 0.12)',
  text: '#202124',
  muted: '#667085',
  grid: 'rgba(102, 112, 133, 0.18)'
};

const defaultValues = {
  mass: 0.145,
  radius: 0.0366,
  dragCoeff: 0.5,
  rho: 1.2,
  gravity: 9.8,
  tMax: 5,
  dt: 0.01,
  v0: 20,
  angle: 45,
  mass2: 0.145,
  radius2: 0.0366,
  dragCoeff2: 0.5,
  rho2: 1.2,
  gravity2: 9.8,
  dt2: 0.01
};

const presets = {
  baseball: { mass: 0.145, radius: 0.0366, dragCoeff: 0.5, v0: 20, angle: 45 },
  tennis: { mass: 0.057, radius: 0.0335, dragCoeff: 0.55, v0: 18, angle: 42 },
  pingpong: { mass: 0.0027, radius: 0.02, dragCoeff: 0.47, v0: 12, angle: 50 },
  steel: { mass: 0.5, radius: 0.025, dragCoeff: 0.47, v0: 22, angle: 40 }
};

const environments = {
  earth: { rho: 1.2, gravity: 9.8 },
  moon: { rho: 0, gravity: 1.62 },
  mars: { rho: 0.02, gravity: 3.71 },
  vacuum: { rho: 0, gravity: 9.8 }
};

const inputIds = Object.keys(defaultValues);
const lastResults = { fall: null, projectile: null };
let autoRunTimer = null;

Chart.defaults.font.family = 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
Chart.defaults.color = chartColors.muted;

function getArea(radius) {
  return Math.PI * radius * radius;
}

function getTerminalVelocity({ mass, radius, dragCoeff, rho, gravity }) {
  const area = getArea(radius);

  if (dragCoeff <= 0 || rho <= 0 || area <= 0) {
    return Infinity;
  }

  return Math.sqrt((2 * mass * gravity) / (dragCoeff * rho * area));
}

function simulateFall({ mass, radius, dragCoeff, rho, gravity, dt, tMax }) {
  const area = getArea(radius);
  const t = [];
  const yNoDrag = [];
  const vNoDrag = [];
  const aNoDrag = [];
  const yDrag = [];
  const vDrag = [];
  const aDrag = [];

  let y1 = 0;
  let v1 = 0;
  let y2 = 0;
  let v2 = 0;

  for (let index = 0; index <= Math.ceil(tMax / dt) && index < maxIterations; index += 1) {
    const time = index * dt;
    t.push(time);

    const a1 = -gravity;
    v1 += a1 * dt;
    y1 += v1 * dt;
    yNoDrag.push(y1);
    vNoDrag.push(v1);
    aNoDrag.push(a1);

    const drag = (0.5 * dragCoeff * rho * area * v2 * Math.abs(v2)) / mass;
    const a2 = -gravity - drag;
    v2 += a2 * dt;
    y2 += v2 * dt;
    yDrag.push(y2);
    vDrag.push(v2);
    aDrag.push(a2);
  }

  return { t, yNoDrag, vNoDrag, aNoDrag, yDrag, vDrag, aDrag };
}

function simulateProjectile({ v0, angle, mass, radius, dragCoeff, rho, gravity, dt }) {
  const area = getArea(radius);
  const angleRad = (angle * Math.PI) / 180;
  const xNoDrag = [];
  const yNoDrag = [];
  const xDrag = [];
  const yDrag = [];
  const tNoDrag = [];
  const tDrag = [];
  const energyNoDrag = [];
  const energyDrag = [];

  let x1 = 0;
  let y1 = 0;
  let vxOne = v0 * Math.cos(angleRad);
  let vyOne = v0 * Math.sin(angleRad);
  let x2 = 0;
  let y2 = 0;
  let vxTwo = vxOne;
  let vyTwo = vyOne;

  for (let index = 0; y1 >= 0 && index < maxIterations; index += 1) {
    tNoDrag.push(index * dt);
    xNoDrag.push(x1);
    yNoDrag.push(y1);
    energyNoDrag.push(0.5 * mass * (vxOne * vxOne + vyOne * vyOne) + mass * gravity * y1);
    vyOne -= gravity * dt;
    x1 += vxOne * dt;
    y1 += vyOne * dt;
  }

  for (let index = 0; y2 >= 0 && index < maxIterations; index += 1) {
    tDrag.push(index * dt);
    xDrag.push(x2);
    yDrag.push(y2);
    const speed = Math.sqrt(vxTwo * vxTwo + vyTwo * vyTwo);
    energyDrag.push(0.5 * mass * speed * speed + mass * gravity * y2);
    const dragX = (0.5 * dragCoeff * rho * area * vxTwo * Math.abs(speed)) / mass;
    const dragY = (0.5 * dragCoeff * rho * area * vyTwo * Math.abs(speed)) / mass;
    vxTwo -= dragX * dt;
    vyTwo += (-gravity - dragY) * dt;
    x2 += vxTwo * dt;
    y2 += vyTwo * dt;
  }

  return { xNoDrag, yNoDrag, xDrag, yDrag, tNoDrag, tDrag, energyNoDrag, energyDrag };
}

function createChart(context, config) {
  return new Chart(context, config);
}

function basePlugins(title) {
  return {
    title: { display: false, text: title },
    legend: {
      align: 'start',
      labels: { color: chartColors.muted, boxWidth: 28, boxHeight: 3, usePointStyle: true }
    },
    tooltip: {
      backgroundColor: chartColors.text,
      padding: 10,
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      displayColors: true
    }
  };
}

function buildLineConfig(labels, datasets, title) {
  return {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 260 },
      interaction: { intersect: false, mode: 'index' },
      elements: { point: { radius: 0, hoverRadius: 4 }, line: { borderWidth: 2.5 } },
      plugins: basePlugins(title),
      scales: {
        x: { ticks: { color: chartColors.muted, maxTicksLimit: 8 }, grid: { color: chartColors.grid } },
        y: { ticks: { color: chartColors.muted, maxTicksLimit: 7 }, grid: { color: chartColors.grid } }
      }
    }
  };
}

function buildTrajectoryConfig(datasets) {
  return {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 260 },
      interaction: { intersect: false, mode: 'nearest' },
      elements: { point: { radius: 0, hoverRadius: 4 }, line: { borderWidth: 2.5 } },
      plugins: basePlugins('Projectile Path Comparison'),
      scales: {
        x: {
          title: { display: true, text: 'Horizontal distance (m)', color: chartColors.muted },
          ticks: { color: chartColors.muted, maxTicksLimit: 9 },
          grid: { color: chartColors.grid }
        },
        y: {
          title: { display: true, text: 'Vertical height (m)', color: chartColors.muted },
          ticks: { color: chartColors.muted, maxTicksLimit: 7 },
          grid: { color: chartColors.grid },
          min: 0
        }
      }
    }
  };
}

function makeDataset(label, data, color, fillColor) {
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: fillColor,
    tension: 0.25,
    showLine: true,
    fill: false
  };
}

function getInput(id) {
  return document.getElementById(id);
}

function getInputValue(id) {
  return parseFloat(getInput(id).value);
}

function readInputs() {
  return inputIds.reduce((values, id) => {
    values[id] = getInputValue(id);
    return values;
  }, {});
}

function validateInputs(values) {
  const rules = [
    ['mass', values.mass > 0],
    ['radius', values.radius > 0],
    ['dragCoeff', values.dragCoeff >= 0],
    ['rho', values.rho >= 0],
    ['gravity', values.gravity > 0],
    ['tMax', values.tMax > 0],
    ['dt', values.dt > 0 && values.dt <= values.tMax],
    ['v0', values.v0 >= 0],
    ['angle', values.angle >= 0 && values.angle <= 90],
    ['mass2', values.mass2 > 0],
    ['radius2', values.radius2 > 0],
    ['dragCoeff2', values.dragCoeff2 >= 0],
    ['rho2', values.rho2 >= 0],
    ['gravity2', values.gravity2 > 0],
    ['dt2', values.dt2 > 0]
  ];

  const invalid = rules.filter(([, isValid]) => !isValid).map(([id]) => id);

  inputIds.forEach((id) => getInput(id).classList.toggle('is-invalid', invalid.includes(id)));

  if (invalid.length > 0) {
    return {
      valid: false,
      message: 'Check highlighted inputs. Values must be positive, and angle must be between 0 and 90 degrees.'
    };
  }

  if (values.tMax / values.dt > maxIterations || values.dt2 < 0.0005) {
    return {
      valid: false,
      message: 'Use a larger time step or shorter duration so the simulation can finish quickly.'
    };
  }

  return { valid: true, message: '' };
}

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) {
    return 'N/A';
  }

  return value.toFixed(digits);
}

function lastValue(values) {
  return values[values.length - 1];
}

function percentDifference(ideal, actual) {
  if (!Number.isFinite(ideal) || ideal === 0) {
    return 0;
  }

  return ((ideal - actual) / ideal) * 100;
}

function setMetrics(id, metrics) {
  document.getElementById(id).innerHTML = metrics
    .map(({ label, value }) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`)
    .join('');
}

function setStatus(message, type = 'info') {
  const status = document.getElementById('statusMessage');
  status.textContent = message;
  status.classList.toggle('is-warning', type === 'warning');
  status.classList.toggle('is-error', type === 'error');
}

function updateChart(chart, config) {
  chart.config.type = config.type;
  chart.config.data = config.data;
  chart.config.options = config.options;
  chart.update();
}

function renderFall(values) {
  const payload = {
    mass: values.mass,
    radius: values.radius,
    dragCoeff: values.dragCoeff,
    rho: values.rho,
    gravity: values.gravity,
    dt: values.dt,
    tMax: values.tMax
  };
  const result = simulateFall(payload);
  const labels = result.t.map((value) => value.toFixed(2));

  updateChart(
    chartY,
    buildLineConfig(labels, [
      makeDataset('No Air Resistance', result.yNoDrag, chartColors.blue, chartColors.blueFill),
      makeDataset('With Air Resistance', result.yDrag, chartColors.red, chartColors.redFill)
    ], 'Position vs Time')
  );

  updateChart(
    chartV,
    buildLineConfig(labels, [
      makeDataset('No Air Resistance', result.vNoDrag, chartColors.blue, chartColors.blueFill),
      makeDataset('With Air Resistance', result.vDrag, chartColors.red, chartColors.redFill)
    ], 'Velocity vs Time')
  );

  updateChart(
    chartA,
    buildLineConfig(labels, [
      makeDataset('No Air Resistance', result.aNoDrag, chartColors.blue, chartColors.blueFill),
      makeDataset('With Air Resistance', result.aDrag, chartColors.red, chartColors.redFill)
    ], 'Acceleration vs Time')
  );

  const terminalVelocity = getTerminalVelocity(payload);
  lastResults.fall = result;

  setMetrics('fallMetrics', [
    { label: 'No drag y', value: `${formatNumber(lastValue(result.yNoDrag))} m` },
    { label: 'Drag y', value: `${formatNumber(lastValue(result.yDrag))} m` },
    { label: 'Drag v', value: `${formatNumber(lastValue(result.vDrag))} m/s` },
    { label: 'Terminal speed', value: `${formatNumber(terminalVelocity)} m/s` }
  ]);
}

function renderProjectile(values) {
  const payload = {
    v0: values.v0,
    angle: values.angle,
    mass: values.mass2,
    radius: values.radius2,
    dragCoeff: values.dragCoeff2,
    rho: values.rho2,
    gravity: values.gravity2,
    dt: values.dt2
  };
  const result = simulateProjectile(payload);
  const rangeNoDrag = Math.max(...result.xNoDrag);
  const rangeDrag = Math.max(...result.xDrag);
  const apexNoDrag = Math.max(...result.yNoDrag);
  const apexDrag = Math.max(...result.yDrag);

  updateChart(
    chartXY,
    buildTrajectoryConfig([
      makeDataset(
        'No Air Resistance',
        result.xNoDrag.map((x, index) => ({ x, y: result.yNoDrag[index] })),
        chartColors.blue,
        chartColors.blueFill
      ),
      makeDataset(
        'With Air Resistance',
        result.xDrag.map((x, index) => ({ x, y: result.yDrag[index] })),
        chartColors.red,
        chartColors.redFill
      )
    ])
  );

  const energyTimes = result.tNoDrag.length >= result.tDrag.length ? result.tNoDrag : result.tDrag;
  const energyLabels = energyTimes.map((value) => value.toFixed(2));
  updateChart(
    chartEnergy,
    buildLineConfig(energyLabels, [
      makeDataset('No Air Resistance', result.energyNoDrag, chartColors.blue, chartColors.blueFill),
      makeDataset('With Air Resistance', result.energyDrag, chartColors.red, chartColors.redFill)
    ], 'Mechanical Energy vs Time')
  );

  lastResults.projectile = result;

  setMetrics('projectileMetrics', [
    { label: 'No drag range', value: `${formatNumber(rangeNoDrag)} m` },
    { label: 'Drag range', value: `${formatNumber(rangeDrag)} m` },
    { label: 'Range loss', value: `${formatNumber(percentDifference(rangeNoDrag, rangeDrag), 1)}%` },
    { label: 'Flight time', value: `${formatNumber(lastValue(result.tDrag))} s` },
    { label: 'No drag apex', value: `${formatNumber(apexNoDrag)} m` },
    { label: 'Drag apex', value: `${formatNumber(apexDrag)} m` }
  ]);
}

function renderAll() {
  const values = readInputs();
  const validation = validateInputs(values);

  if (!validation.valid) {
    setStatus(validation.message, 'error');
    return;
  }

  renderFall(values);
  renderProjectile(values);
  setStatus(`Updated with g=${formatNumber(values.gravity, 2)} m/s^2 for fall and g=${formatNumber(values.gravity2, 2)} m/s^2 for launch.`);
}

function scheduleAutoRun() {
  if (!document.getElementById('autoRun').checked) {
    setStatus('Auto update is paused. Press a run button to refresh the graphs.', 'warning');
    return;
  }

  window.clearTimeout(autoRunTimer);
  autoRunTimer = window.setTimeout(renderAll, 180);
}

function setValues(values) {
  Object.entries(values).forEach(([id, value]) => {
    getInput(id).value = value;
  });
}

function applyPreset(name) {
  const preset = presets[name];

  setValues({
    mass: preset.mass,
    radius: preset.radius,
    dragCoeff: preset.dragCoeff,
    mass2: preset.mass,
    radius2: preset.radius,
    dragCoeff2: preset.dragCoeff,
    v0: preset.v0,
    angle: preset.angle
  });

  document.querySelectorAll('.preset-button').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.preset === name);
  });

  renderAll();
}

function applyEnvironment(name) {
  const environment = environments[name];

  setValues({
    rho: environment.rho,
    rho2: environment.rho,
    gravity: environment.gravity,
    gravity2: environment.gravity
  });

  document.querySelectorAll('[data-environment]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.environment === name);
  });

  renderAll();
}

function resetAll() {
  setValues(defaultValues);
  document.querySelectorAll('.preset-button').forEach((button) => button.classList.remove('is-active'));
  window.history.replaceState(null, '', window.location.pathname);
  renderAll();
}

function rowsToCsv(rows) {
  return rows.map((row) => row.map((value) => String(value)).join(',')).join('\n');
}

function exportCsv() {
  if (!lastResults.fall || !lastResults.projectile) {
    renderAll();
  }

  const rows = [
    ['section', 'series', 't_s', 'x_m', 'y_m', 'velocity_m_s', 'acceleration_m_s2', 'energy_j']
  ];

  lastResults.fall.t.forEach((time, index) => {
    rows.push(['fall', 'no_drag', formatNumber(time, 4), '', formatNumber(lastResults.fall.yNoDrag[index], 4), formatNumber(lastResults.fall.vNoDrag[index], 4), formatNumber(lastResults.fall.aNoDrag[index], 4), '']);
    rows.push(['fall', 'with_drag', formatNumber(time, 4), '', formatNumber(lastResults.fall.yDrag[index], 4), formatNumber(lastResults.fall.vDrag[index], 4), formatNumber(lastResults.fall.aDrag[index], 4), '']);
  });

  lastResults.projectile.xNoDrag.forEach((x, index) => {
    rows.push(['projectile', 'no_drag', formatNumber(lastResults.projectile.tNoDrag[index], 4), formatNumber(x, 4), formatNumber(lastResults.projectile.yNoDrag[index], 4), '', '', formatNumber(lastResults.projectile.energyNoDrag[index], 4)]);
  });

  lastResults.projectile.xDrag.forEach((x, index) => {
    rows.push(['projectile', 'with_drag', formatNumber(lastResults.projectile.tDrag[index], 4), formatNumber(x, 4), formatNumber(lastResults.projectile.yDrag[index], 4), '', '', formatNumber(lastResults.projectile.energyDrag[index], 4)]);
  });

  const blob = new Blob([rowsToCsv(rows)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'projectile-motion-results.csv';
  link.click();
  URL.revokeObjectURL(url);
  setStatus('CSV exported with fall and projectile data.');
}

function buildShareUrl() {
  const url = new URL(window.location.href);
  const values = readInputs();
  url.hash = new URLSearchParams(
    Object.entries(values).map(([key, value]) => [key, String(value)])
  ).toString();
  return url.toString();
}

async function copyShareLink() {
  const shareUrl = buildShareUrl();

  try {
    await navigator.clipboard.writeText(shareUrl);
    setStatus('Share link copied with the current simulation values.');
  } catch (error) {
    window.prompt('Copy this share link:', shareUrl);
    setStatus('Copy the share link from the prompt.');
  }
}

function loadHashState() {
  if (!window.location.hash) {
    return;
  }

  const params = new URLSearchParams(window.location.hash.slice(1));
  const values = {};

  inputIds.forEach((id) => {
    if (params.has(id)) {
      const value = parseFloat(params.get(id));
      if (Number.isFinite(value)) {
        values[id] = value;
      }
    }
  });

  setValues(values);
}

const chartY = createChart(document.getElementById('chartY').getContext('2d'), buildLineConfig([], [], ''));
const chartV = createChart(document.getElementById('chartV').getContext('2d'), buildLineConfig([], [], ''));
const chartA = createChart(document.getElementById('chartA').getContext('2d'), buildLineConfig([], [], ''));
const chartXY = createChart(
  document.getElementById('chartXY').getContext('2d'),
  buildTrajectoryConfig([])
);
const chartEnergy = createChart(
  document.getElementById('chartEnergy').getContext('2d'),
  buildLineConfig([], [], '')
);

document.getElementById('runFall').addEventListener('click', () => {
  const values = readInputs();
  const validation = validateInputs(values);
  if (!validation.valid) {
    setStatus(validation.message, 'error');
    return;
  }

  renderFall(values);
  setStatus('Vertical motion updated.');
});

document.getElementById('runProjectile').addEventListener('click', () => {
  const values = readInputs();
  const validation = validateInputs(values);
  if (!validation.valid) {
    setStatus(validation.message, 'error');
    return;
  }

  renderProjectile(values);
  setStatus('Projectile path updated.');
});

document.getElementById('resetAll').addEventListener('click', resetAll);
document.getElementById('exportCsv').addEventListener('click', exportCsv);
document.getElementById('copyShareLink').addEventListener('click', copyShareLink);
document.getElementById('autoRun').addEventListener('change', scheduleAutoRun);

document.querySelectorAll('.preset-button').forEach((button) => {
  if (button.dataset.preset) {
    button.addEventListener('click', () => applyPreset(button.dataset.preset));
  }
});

document.querySelectorAll('[data-environment]').forEach((button) => {
  button.addEventListener('click', () => applyEnvironment(button.dataset.environment));
});

inputIds.forEach((id) => {
  getInput(id).addEventListener('input', scheduleAutoRun);
});

loadHashState();
renderAll();
