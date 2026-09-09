import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function SpendingChart({ purchases }) {
  const categoryTotals = purchases.reduce((acc, p) => {
    if (typeof p.amount === 'number') {
      const cat = p.category.toLowerCase();
      acc[cat] = (acc[cat] || 0) + p.amount;
    }
    return acc;
  }, {});

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: 'Spending by Category',
        data: Object.values(categoryTotals),
        backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto' }}>
      <h3>Spending Chart</h3>
      <Bar data={data} options={options} />
    </div>
  );
}

export default SpendingChart;
