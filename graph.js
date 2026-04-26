/**
 * graph.js — Chart rendering using Chart.js
 */

let barChart = null;
let cpiChart = null;

export function renderPerformanceChart(sim) {
  const ctx = document.getElementById('perfChart');
  if (!ctx) return;

  const pipelined = sim.cycle;
  const nonPipelined = sim.getNonPipelinedCycles();

  if (barChart) barChart.destroy();
  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Pipelined', 'Non-Pipelined'],
      datasets: [{
        label: 'Total Cycles',
        data: [pipelined, nonPipelined],
        backgroundColor: ['rgba(0,242,254,0.7)', 'rgba(249,83,198,0.7)'],
        borderColor: ['#0ff2fe', '#f953c6'],
        borderWidth: 2,
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0d0d1a',
          borderColor: '#0ff2fe',
          borderWidth: 1,
          titleColor: '#0ff2fe',
          bodyColor: '#fff',
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#aaa', font: { family: 'Share Tech Mono' } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.08)' },
          ticks: { color: '#aaa', font: { family: 'Share Tech Mono' } },
          beginAtZero: true,
        }
      }
    }
  });
}

export function renderCPIChart(cpiHistory) {
  const ctx = document.getElementById('cpiChart');
  if (!ctx) return;

  if (cpiChart) cpiChart.destroy();
  cpiChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: cpiHistory.map((_, i) => `C${i + 1}`),
      datasets: [{
        label: 'CPI',
        data: cpiHistory,
        borderColor: '#43e97b',
        backgroundColor: 'rgba(67,233,123,0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#43e97b',
        pointRadius: 3,
        tension: 0.4,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0d0d1a',
          borderColor: '#43e97b',
          borderWidth: 1,
          titleColor: '#43e97b',
          bodyColor: '#fff',
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#aaa', font: { family: 'Share Tech Mono' }, maxTicksLimit: 10 }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.08)' },
          ticks: { color: '#aaa', font: { family: 'Share Tech Mono' } },
          beginAtZero: true,
          suggestedMax: 3,
        }
      }
    }
  });
}

export function destroyCharts() {
  if (barChart) { barChart.destroy(); barChart = null; }
  if (cpiChart) { cpiChart.destroy(); cpiChart = null; }
}
