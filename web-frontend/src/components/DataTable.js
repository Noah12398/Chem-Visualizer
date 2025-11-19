import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Chip,
  Grid,
  Paper,
} from "@mui/material";

export default function DataTable({ dataset }) {
  const s = dataset.summary || {};

  const averages = Object.entries(s.averages || {});
  const types = Object.entries(s.type_distribution || {});

  return (
    <Card elevation={3} sx={{ p: 2 }}>
      <CardContent>

        {/* 🔷 Title */}
        <Typography variant="h5" gutterBottom>
          Dataset Summary
        </Typography>

        {/* 🔹 Total Rows */}
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          <strong>Total Rows:</strong>{" "}
          <Chip label={s.total_count ?? "N/A"} color="primary" />
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* 📊 Averages */}
        <Typography variant="h6" gutterBottom>
          Averages
        </Typography>

        {averages.length === 0 ? (
          <Typography color="text.secondary">No average values available.</Typography>
        ) : (
          <Grid container spacing={2}>
            {averages.map(([key, value]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    textAlign: "center",
                    bgcolor: "#fafafa",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    {key}
                  </Typography>
                  <Typography variant="body1">
                    {value === null ? "N/A" : Number(value).toFixed(3)}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        <Divider sx={{ my: 3 }} />

        {/* 🧪 Type Distribution */}
        <Typography variant="h6" gutterBottom>
          Type Distribution
        </Typography>

        {types.length === 0 ? (
          <Typography color="text.secondary">No type distribution available.</Typography>
        ) : (
          <Grid container spacing={2}>
            {types.map(([type, count]) => (
              <Grid item xs={12} sm={6} md={4} key={type}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    textAlign: "center",
                    bgcolor: "#fff8e1",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    {type}
                  </Typography>
                  <Typography variant="body1">{count}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}
