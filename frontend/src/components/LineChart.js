import React, { useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';

import PropTypes from 'prop-types';

import {
  Chart as ChartJS,
  LineController,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  LineController,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const calculateLinearRegression = (data) => {
  const n = data.length;
  const sumX = data.reduce((acc, point) => acc + point.x, 0);
  const sumY = data.reduce((acc, point) => acc + point.y, 0);
  const sumXY = data.reduce((acc, point) => acc + point.x * point.y, 0);
  const sumX2 = data.reduce((acc, point) => acc + point.x * point.x, 0);

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) {
    return { slope: 0, intercept: 0 };
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
};

const LineChart = ({ data }) => {
  // Обработка данных
  const processedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }
    return data.map((item) => ({
      x: new Date(item.date).getTime(), // Преобразование даты в миллисекунды
      y: parseFloat(item.value), // Преобразование строки в число
    }));
  }, [data]);

  const { slope, intercept } = useMemo(() => {
    if (processedData.length === 0) {
      return { slope: 0, intercept: 0 };
    }
    return calculateLinearRegression(processedData);
  }, [processedData]);

  const regressionLine = useMemo(() => {
    if (processedData.length === 0) {
      return [];
    }
    const minX = Math.min(...processedData.map((d) => d.x));
    const maxX = Math.max(...processedData.map((d) => d.x));
    return [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept },
    ];
  }, [processedData, slope, intercept]);

  const chartData = {
    datasets: [
      {
        label: 'Scatter Points',
        data: processedData,
        backgroundColor: 'rgba(75, 192, 192, 1)',
        showLine: false,
      },
      {
        label: 'Regression Line',
        data: regressionLine,
        type: 'line',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Weight Chart with Linear Regression',
        font: {
          size: 16,
        },
      },
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'nearest',
        intersect: false,
      },
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Date (milliseconds since epoch)',
        },
        ticks: {
          callback: (value) => {
            const date = new Date(value);
            return date.toLocaleDateString();
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };

  return <Scatter data={chartData} options={options} />;
};

LineChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default LineChart;
