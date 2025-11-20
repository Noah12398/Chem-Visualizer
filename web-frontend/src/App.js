import React, { useState, useEffect } from "react";
import UploadForm from "./components/UploadForm";
import DataTable from "./components/DataTable";
import Charts from "./components/Charts";
import axios from "axios";

import {
  Box,
  Card,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  Container,
  Paper
} from "@mui/material";

function App() {
  const [datasets, setDatasets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [auth, setAuth] = useState(null);
  const [error, setError] = useState(null);

  // Prompt login
  const askCredentials = () => {
    const username = window.prompt("Enter your username:");
    const password = window.prompt("Enter your password:");
    if (!username || !password) {
      alert("Username and password required");
      return null;
    }
    return { username, password };
  };

  // Fetch
  const fetchDatasets = async () => {
    let credentials = auth;

    if (!credentials) {
      credentials = askCredentials();
      if (!credentials) return;
    }

    try {
      const res = await axios.get("/api/datasets/", {
        auth: credentials,
        validateStatus: () => true
      });

      // Wrong password
      if (res.status === 401) {
        alert("Invalid username or password!");
        setAuth(null);
        setDatasets([]);
        setSelected(null);
        return;
      }

      // Server error
      if (res.status >= 500) {
        alert("Server error occurred");
        setDatasets([]);
        setSelected(null);
        return;
      }

      // Unexpected response
      if (!Array.isArray(res.data)) {
        console.warn("Unexpected API response:", res.data);
        setDatasets([]);
        setSelected(null);
        return;
      }

      setAuth(credentials);
      setDatasets(res.data);
      setSelected(res.data.length ? res.data[0] : null);

    } catch (err) {
      console.error(err);
      alert("Network error — cannot reach server");
      setDatasets([]);
      setSelected(null);
      setAuth(null);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f7" }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6">
            Chemical Equipment Parameter Visualizer
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Card sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Upload Dataset
          </Typography>
          <UploadForm onUploaded={fetchDatasets} auth={auth} />
        </Card>

        <Box sx={{ display: "flex", gap: 3 }}>
          <Paper
            elevation={2}
            sx={{
              width: 300,
              maxHeight: "80vh",
              overflowY: "auto",
              p: 2,
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Upload History
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <List>
              {(datasets || []).map((d) => {
                const filename = d.file?.split("/").pop() || "Unknown file";
                const time = d.uploaded_at
                  ? new Date(d.uploaded_at).toLocaleString()
                  : "Unknown time";

                return (
                  <ListItem disablePadding key={d.id}>
                    <ListItemButton
                      selected={selected?.id === d.id}
                      onClick={() => setSelected(d)}
                      sx={{ borderRadius: 2, mb: 1 }}
                    >
                      <ListItemText
                        primary={filename}
                        secondary={time}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Paper>

          <Box sx={{ flexGrow: 1 }}>
            {selected ? (
              <>
                <Card sx={{ p: 2, mb: 3 }} elevation={3}>
                  <Typography variant="h6" gutterBottom>
                    Data Table
                  </Typography>
                  <DataTable dataset={selected} />
                </Card>

                <Card sx={{ p: 2 }} elevation={3}>
                  <Typography variant="h6" gutterBottom>
                    Charts Summary
                  </Typography>
                  <Charts summary={selected.summary || {}} />
                </Card>
              </>
            ) : (
              <Card sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6">
                  No dataset selected — login or upload one
                </Typography>
              </Card>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
