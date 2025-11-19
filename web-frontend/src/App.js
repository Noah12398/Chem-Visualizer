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

  const askCredentials = () => {
    const username = window.prompt("Enter your username:");
    const password = window.prompt("Enter your password:");
    if (username && password) {
      setAuth({ username, password });
      return { username, password };
    } else {
      alert("Username and password are required!");
      return null;
    }
  };
const fetchDatasets = async () => {
  let credentials = auth;
  if (!credentials) {
    credentials = askCredentials();
    if (!credentials) return;
  }

  console.log("Sending credentials:", credentials); // will log username & password

  try {
    const res = await axios.get("/api/datasets/", {
      auth: credentials, // use local variable, not state
    });
    setDatasets(res.data);
    if (res.data.length) setSelected(res.data[0]);
    setAuth(credentials); // now store for future requests
  } catch (err) {
    console.error(err);
    alert("Login failed or cannot fetch datasets. Try again.");
    setAuth(null); // reset auth if failed
  }
};

  useEffect(() => {
    fetchDatasets();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f7" }}>
      {/* 🔷 Top Bar */}
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6">
            Chemical Equipment Parameter Visualizer
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3 }}>
        {/* Upload Section */}
        <Card sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Upload Dataset
          </Typography>
          <UploadForm onUploaded={fetchDatasets} auth={auth} />
        </Card>

        <Box sx={{ display: "flex", gap: 3 }}>
          {/* 🔹 Sidebar History List */}
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
              {datasets.map((d) => {
                const filename = d.file.split("/").pop();
                const time = new Date(d.uploaded_at).toLocaleString();

                return (
                  <ListItem disablePadding key={d.id}>
                    <ListItemButton
                      selected={selected?.id === d.id}
                      onClick={() => setSelected(d)}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                      }}
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

          {/* 🔹 Main Content */}
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
                  <Charts summary={selected.summary} />
                </Card>
              </>
            ) : (
              <Card sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6">Select a dataset to view data</Typography>
              </Card>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
