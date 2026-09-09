import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function CategoryPieChart({ data }) {
  const chartData = {
    labels: data.map(cat => cat._id),
    datasets: [
      {
        data: data.map(cat => cat.total),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8AFFC1', '#FF8A5C'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h3>Spending Breakdown</h3>
      <Pie data={chartData} />
    </div>
  );
}

export default CategoryPieChart;
