import React from "react";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PieChartIcon from '@mui/icons-material/PieChart';

Chart.register(...registerables);

export default function Charts({ summary }) {
  const averages = summary.averages || {};
  const avgLabels = Object.keys(averages);
  const avgValues = avgLabels.map((k) => averages[k] || 0);

  const typeDist = summary.type_distribution || {};
  const typeLabels = Object.keys(typeDist);
  const typeValues = typeLabels.map((k) => typeDist[k]);

  // Vibrant gradient colors
  const gradientColors = [
    { start: 'rgba(99, 102, 241, 0.8)', end: 'rgba(168, 85, 247, 0.8)', border: 'rgb(99, 102, 241)' },
    { start: 'rgba(59, 130, 246, 0.8)', end: 'rgba(37, 99, 235, 0.8)', border: 'rgb(59, 130, 246)' },
    { start: 'rgba(16, 185, 129, 0.8)', end: 'rgba(5, 150, 105, 0.8)', border: 'rgb(16, 185, 129)' },
  ];

  const avgData = {
    labels: avgLabels,
    datasets: [
      {
        label: "Average Values",
        data: avgValues,
        backgroundColor: avgLabels.map((_, i) => gradientColors[i % gradientColors.length].start),
        borderColor: avgLabels.map((_, i) => gradientColors[i % gradientColors.length].border),
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: avgLabels.map((_, i) => gradientColors[i % gradientColors.length].end),
      },
    ],
  };

  const pieColors = [
    'rgba(99, 102, 241, 0.85)',
    'rgba(16, 185, 129, 0.85)',
    'rgba(251, 146, 60, 0.85)',
    'rgba(236, 72, 153, 0.85)',
    'rgba(14, 165, 233, 0.85)',
  ];

  const typeData = {
    labels: typeLabels,
    datasets: [
      {
        data: typeValues,
        backgroundColor: pieColors,
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 15,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: { size: 13, weight: '600' },
          padding: 15,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: { size: 12 }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 12, weight: '600' }
        }
      }
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 13, weight: '600' },
          padding: 15,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      }
    },
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={7}>
        <Card 
          elevation={4}
          sx={{ 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" fontWeight={700}>
                Average Parameter Values
              </Typography>
            </Box>
            <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2 }}>
              <Bar data={avgData} options={chartOptions} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={5}>
        <Card 
          elevation={4}
          sx={{ 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PieChartIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" fontWeight={700}>
                Equipment Type Distribution
              </Typography>
            </Box>
            <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2 }}>
              <Doughnut data={typeData} options={pieOptions} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

