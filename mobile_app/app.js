const g = 9.8;
const chartColors = {
  blue: '#2d70b3',
  blueFill: 'rgba(45, 112, 179, 0.12)',
  red: '#c74440',
  redFill: 'rgba(199, 68, 64, 0.12)',
  text: '#202124',
  muted: '#667085',
  grid: 'rgba(102, 112, 133, 0.18)'
};

Chart.defaults.font.family = 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
Chart.defaults.color = chartColors.muted;

function getArea(radius) {
  return Math.PI * radius * radius;
}

function simulateFall({ mass, radius, dragCoeff, rho, dt, tMax }) {
  const A = getArea(radius);
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

  for (let time = 0; time <= tMax + 1e-9; time += dt) {
    t.push(time);

    const a1 = -g;
    v1 += a1 * dt;
    y1 += v1 * dt;
    yNoDrag.push(y1);
    vNoDrag.push(v1);
    aNoDrag.push(a1);

    const drag = (0.5 * dragCoeff * rho * A * v2 * Math.abs(v2)) / mass;
    const a2 = -g - drag;
    v2 += a2 * dt;
    y2 += v2 * dt;
    yDrag.push(y2);
    vDrag.push(v2);
    aDrag.push(a2);
  }

  return { t, yNoDrag, vNoDrag, aNoDrag, yDrag, vDrag, aDrag };
}

function simulateProjectile({ v0, angle, mass, radius, dragCoeff, rho, dt }) {
  const A = getArea(radius);
  const angleRad = (angle * Math.PI) / 180;
  const vx1 = v0 * Math.cos(angleRad);
  const vy1 = v0 * Math.sin(angleRad);
  const vx2 = v0 * Math.cos(angleRad);
  const vy2 = v0 * Math.sin(angleRad);

  const xNoDrag = [];
  const yNoDrag = [];
  const xDrag = [];
  const yDrag = [];

  let x1 = 0;
  let y1 = 0;
  let vxOne = vx1;
  let vyOne = vy1;
  let x2 = 0;
  let y2 = 0;
  let vxTwo = vx2;
  let vyTwo = vy2;

  while (y1 >= 0) {
    xNoDrag.push(x1);
    yNoDrag.push(y1);
    vyOne -= g * dt;
    x1 += vxOne * dt;
    y1 += vyOne * dt;
  }

  while (y2 >= 0) {
    xDrag.push(x2);
    yDrag.push(y2);
    const v = Math.sqrt(vxTwo * vxTwo + vyTwo * vyTwo);
    const dragX = (0.5 * dragCoeff * rho * A * vxTwo * Math.abs(v)) / mass;
    const dragY = (0.5 * dragCoeff * rho * A * vyTwo * Math.abs(v)) / mass;
    const ax = -dragX;
    const ay = -g - dragY;
    vxTwo += ax * dt;
    vyTwo += ay * dt;
    x2 += vxTwo * dt;
    y2 += vyTwo * dt;
  }

  return { xNoDrag, yNoDrag, xDrag, yDrag };
}

function createChart(context, config) {
  return new Chart(context, config);
}

function buildLineConfig(labels, datasets, title) {
  return {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 320 },
      interaction: { intersect: false, mode: 'index' },
      elements: { point: { radius: 0, hoverRadius: 4 }, line: { borderWidth: 2.5 } },
      plugins: {
        title: { display: false, text: title },
        legend: {
          align: 'start',
          labels: { color: chartColors.muted, boxWidth: 28, boxHeight: 3, usePointStyle: true }
        },
        tooltip: {
          backgroundColor: '#202124',
          padding: 10,
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          displayColors: true
        }
      },
      scales: {
        x: { ticks: { color: chartColors.muted, maxTicksLimit: 8 }, grid: { color: chartColors.grid } },
        y: { ticks: { color: chartColors.muted, maxTicksLimit: 7 }, grid: { color: chartColors.grid } }
      }
    }
  };
}

function getInputValue(id) {
  return parseFloat(document.getElementById(id).value);
}

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) {
    return '0.00';
  }

  return value.toFixed(digits);
}

function lastValue(values) {
  return values[values.length - 1];
}

function setMetrics(id, metrics) {
  document.getElementById(id).innerHTML = metrics
    .map(({ label, value }) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`)
    .join('');
}

function renderFall() {
  const payload = {
    mass: getInputValue('mass'),
    radius: getInputValue('radius'),
    dragCoeff: getInputValue('dragCoeff'),
    rho: getInputValue('rho'),
    dt: getInputValue('dt'),
    tMax: getInputValue('tMax')
  };

  const result = simulateFall(payload);
  const labels = result.t.map((value) => value.toFixed(2));

  const datasets = [
    {
      label: 'No Air Resistance',
      data: result.yNoDrag,
      borderColor: chartColors.blue,
      backgroundColor: chartColors.blueFill,
      tension: 0.25
    },
    {
      label: 'With Air Resistance',
      data: result.yDrag,
      borderColor: chartColors.red,
      backgroundColor: chartColors.redFill,
      tension: 0.25
    }
  ];

  updateChart(chartY, buildLineConfig(labels, datasets, 'Position vs Time'));

  const vDatasets = [
    {
      label: 'No Air Resistance',
      data: result.vNoDrag,
      borderColor: chartColors.blue,
      backgroundColor: chartColors.blueFill,
      tension: 0.25
    },
    {
      label: 'With Air Resistance',
      data: result.vDrag,
      borderColor: chartColors.red,
      backgroundColor: chartColors.redFill,
      tension: 0.25
    }
  ];
  updateChart(chartV, buildLineConfig(labels, vDatasets, 'Velocity vs Time'));

  const aDatasets = [
    {
      label: 'No Air Resistance',
      data: result.aNoDrag,
      borderColor: chartColors.blue,
      backgroundColor: chartColors.blueFill,
      tension: 0.25
    },
    {
      label: 'With Air Resistance',
      data: result.aDrag,
      borderColor: chartColors.red,
      backgroundColor: chartColors.redFill,
      tension: 0.25
    }
  ];
  updateChart(chartA, buildLineConfig(labels, aDatasets, 'Acceleration vs Time'));

  setMetrics('fallMetrics', [
    { label: 'No drag y', value: `${formatNumber(lastValue(result.yNoDrag))} m` },
    { label: 'Drag y', value: `${formatNumber(lastValue(result.yDrag))} m` },
    { label: 'No drag v', value: `${formatNumber(lastValue(result.vNoDrag))} m/s` },
    { label: 'Drag v', value: `${formatNumber(lastValue(result.vDrag))} m/s` }
  ]);
}

function renderProjectile() {
  const payload = {
    v0: getInputValue('v0'),
    angle: getInputValue('angle'),
    mass: getInputValue('mass2'),
    radius: getInputValue('radius'),
    dragCoeff: getInputValue('dragCoeff2'),
    rho: getInputValue('rho2'),
    dt: getInputValue('dt2')
  };

  const result = simulateProjectile(payload);

  const datasets = [
    {
      label: 'No Air Resistance',
      data: result.xNoDrag.map((x, index) => ({ x, y: result.yNoDrag[index] })),
      borderColor: chartColors.blue,
      backgroundColor: chartColors.blueFill,
      fill: false,
      tension: 0.25,
      showLine: true
    },
    {
      label: 'With Air Resistance',
      data: result.xDrag.map((x, index) => ({ x, y: result.yDrag[index] })),
      borderColor: chartColors.red,
      backgroundColor: chartColors.redFill,
      fill: false,
      tension: 0.25,
      showLine: true
    }
  ];

  updateChart(chartXY, {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 320 },
      interaction: { intersect: false, mode: 'nearest' },
      elements: { point: { radius: 0, hoverRadius: 4 }, line: { borderWidth: 2.5 } },
      plugins: {
        title: { display: false, text: 'Projectile Path Comparison' },
        legend: {
          align: 'start',
          labels: { color: chartColors.muted, boxWidth: 28, boxHeight: 3, usePointStyle: true }
        },
        tooltip: {
          backgroundColor: '#202124',
          padding: 10,
          titleColor: '#ffffff',
          bodyColor: '#ffffff'
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Horizontal distance (m)', color: chartColors.muted },
          ticks: { color: chartColors.muted, maxTicksLimit: 9 },
          grid: { color: chartColors.grid }
        },
        y: {
          title: { display: true, text: 'Vertical height (m)', color: chartColors.muted },
          ticks: { color: chartColors.muted, maxTicksLimit: 7 },
          grid: { color: chartColors.grid }
        }
      }
    }
  });

  setMetrics('projectileMetrics', [
    { label: 'No drag range', value: `${formatNumber(Math.max(...result.xNoDrag))} m` },
    { label: 'Drag range', value: `${formatNumber(Math.max(...result.xDrag))} m` },
    { label: 'No drag apex', value: `${formatNumber(Math.max(...result.yNoDrag))} m` },
    { label: 'Drag apex', value: `${formatNumber(Math.max(...result.yDrag))} m` }
  ]);
}

function updateChart(chart, config) {
  chart.config.type = config.type;
  chart.config.data = config.data;
  chart.config.options = config.options;
  chart.update();
}

const chartY = createChart(document.getElementById('chartY').getContext('2d'), buildLineConfig([], [], ''));
const chartV = createChart(document.getElementById('chartV').getContext('2d'), buildLineConfig([], [], ''));
const chartA = createChart(document.getElementById('chartA').getContext('2d'), buildLineConfig([], [], ''));
const chartXY = createChart(document.getElementById('chartXY').getContext('2d'), { type: 'scatter', data: { datasets: [] }, options: { responsive: true, maintainAspectRatio: false } });

document.getElementById('runFall').addEventListener('click', renderFall);
document.getElementById('runProjectile').addEventListener('click', renderProjectile);

renderFall();
renderProjectile();
