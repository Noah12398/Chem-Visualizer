import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Card, CardContent, Typography, Box } from "@mui/material";

Chart.register(...registerables);

export default function Charts({ summary }) {
  const averages = summary.averages || {};
  const avgLabels = Object.keys(averages);
  const avgValues = avgLabels.map((k) => averages[k] || 0);

  const typeDist = summary.type_distribution || {};
  const typeLabels = Object.keys(typeDist);
  const typeValues = typeLabels.map((k) => typeDist[k]);

  const avgData = {
    labels: avgLabels,
    datasets: [
      {
        label: "Average Values",
        data: avgValues,
        backgroundColor: "rgba(25,118,210,0.5)",
        borderColor: "rgba(25,118,210,1)",
        borderWidth: 1,
      },
    ],
  };

  const typeData = {
    labels: typeLabels,
    datasets: [
      {
        data: typeValues,
        backgroundColor: [
          "rgba(25,118,210,0.7)",
          "rgba(46,125,50,0.7)",
          "rgba(198,40,40,0.7)",
          "rgba(255,160,0,0.7)",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      <Card sx={{ width: 500, p: 2 }} elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Average Parameter Values
          </Typography>
          <Bar
            data={avgData}
            options={{
              responsive: true,
              plugins: { legend: { display: true } },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </CardContent>
      </Card>

      <Card sx={{ width: 400, p: 2 }} elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Type Distribution
          </Typography>
          <Pie
            data={typeData}
            options={{
              responsive: true,
              plugins: { legend: { position: "bottom" } },
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
