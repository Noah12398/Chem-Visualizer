import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
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
  Paper,
  Button,
  IconButton,
  Chip,
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import ScienceIcon from '@mui/icons-material/Science';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

function App() {
  const [datasets, setDatasets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [auth, setAuth] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Handle login from LoginForm
  const handleLogin = async (credentials) => {
    try {
      const res = await axios.get("/api/datasets/", {
        auth: credentials,
        validateStatus: () => true
      });

      // Wrong password (401 or 403)
      if (res.status === 401 || res.status === 403) {
        setLoginError("Invalid username or password!");
        return;
      }

      // Server error
      if (res.status >= 500) {
        setLoginError("Server error occurred. Please try again later.");
        return;
      }

      // Unexpected response
      if (!Array.isArray(res.data)) {
        console.warn("Unexpected API response:", res.data);
        setLoginError("Unexpected server response. Please try again.");
        return;
      }

      // Check if user is admin by trying to fetch all datasets
      const adminCheck = credentials.username === 'admin' || res.data.some(d => d.uploaded_by_username && d.uploaded_by_username !== credentials.username);
      
      // Success
      setAuth(credentials);
      setIsAdmin(adminCheck);
      setLoginError(null);
      setDatasets(res.data);
      setSelected(res.data.length ? res.data[0] : null);

    } catch (err) {
      console.error(err);
      setLoginError("Network error — cannot reach server. Please check if the backend is running.");
    }
  };

  // Handle registration
  const handleRegister = async (credentials) => {
    try {
      const res = await axios.post("/api/register/", credentials);

      if (res.status === 201) {
        // Registration successful, automatically log in
        setRegisterError(null);
        setShowRegister(false);
        handleLogin(credentials);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const errors = err.response.data;
        if (errors.username) {
          setRegisterError(`Username error: ${errors.username.join(', ')}`);
        } else {
          setRegisterError("Registration failed. Please try again.");
        }
      } else {
        setRegisterError("Network error — cannot reach server.");
      }
    }
  };

  const handleLogout = () => {
    setAuth(null);
    setDatasets([]);
    setSelected(null);
    setLoginError(null);
    setRegisterError(null);
    setIsAdmin(false);
  };

  const fetchDatasets = async () => {
    if (!auth) return;

    try {
      const res = await axios.get("/api/datasets/", {
        auth: auth,
      });

      if (Array.isArray(res.data)) {
        setDatasets(res.data);
        setSelected(res.data.length ? res.data[0] : null);
      }
    } catch (err) {
      console.error("Error fetching datasets:", err);
    }
  };

  const downloadPDF = async () => {
    if (!selected || !auth) return;
    
    try {
      const res = await axios.get(`/api/datasets/${selected.id}/pdf/`, {
        auth: auth,
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dataset_${selected.id}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF");
    }
  };

  // Show register form if requested
  if (!auth && showRegister) {
    return (
      <RegisterForm 
        onRegister={handleRegister} 
        onBackToLogin={() => {
          setShowRegister(false);
          setRegisterError(null);
        }}
        error={registerError}
      />
    );
  }

  // Show login form if not authenticated
  if (!auth) {
    return (
      <LoginForm 
        onLogin={handleLogin} 
        error={loginError}
        onSwitchToRegister={() => {
          setShowRegister(true);
          setLoginError(null);
        }}
      />
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <AppBar position="static" elevation={0} sx={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <ScienceIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Chemical Equipment Visualizer
          </Typography>
          {auth && (
            <>
              {isAdmin && (
                <Chip 
                  icon={<AdminPanelSettingsIcon />}
                  label="Admin" 
                  color="warning" 
                  sx={{ mr: 2, fontWeight: 600 }}
                />
              )}
              <Chip 
                label={`User: ${auth.username}`} 
                color="secondary" 
                sx={{ mr: 2, fontWeight: 600 }}
              />
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, pb: 4 }}>
        <Card sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }} elevation={6}>
          <UploadForm onUploaded={fetchDatasets} auth={auth} />
        </Card>

        <Box sx={{ display: "flex", gap: 3, flexWrap: { xs: 'wrap', lg: 'nowrap' } }}>
          <Paper
            elevation={6}
            sx={{
              width: { xs: '100%', lg: 320 },
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: 3,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box sx={{ p: 2, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <Typography variant="h6" fontWeight={700}>
                📂 {isAdmin ? 'All Datasets' : 'My Uploads'}
              </Typography>
            </Box>
            <Divider />

            <List sx={{ p: 0 }}>
              {(datasets || []).map((d) => {
                const filename = d.file?.split("/").pop() || "Unknown file";
                const time = d.uploaded_at
                  ? new Date(d.uploaded_at).toLocaleString()
                  : "Unknown time";
                const uploader = d.uploaded_by_username || "Unknown";

                return (
                  <ListItem disablePadding key={d.id}>
                    <ListItemButton
                      selected={selected?.id === d.id}
                      onClick={() => setSelected(d)}
                      sx={{ 
                        borderRadius: 0,
                        '&.Mui-selected': {
                          background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                          borderLeft: '4px solid #667eea',
                        }
                      }}
                    >
                      <ListItemText
                        primary={filename}
                        secondary={
                          <>
                            {time}
                            {isAdmin && <><br />By: {uploader}</>}
                          </>
                        }
                        primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                        secondaryTypographyProps={{ fontSize: 12 }}
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
                <Card sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }} elevation={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" fontWeight={700} sx={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      📊 Dataset Summary
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={downloadPDF}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 3,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        }
                      }}
                    >
                      Download PDF
                    </Button>
                  </Box>
                  <DataTable dataset={selected} />
                </Card>

                <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }} elevation={6}>
                  <Typography variant="h5" gutterBottom fontWeight={700} sx={{ 
                    mb: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    📈 Visual Analytics
                  </Typography>
                  <Charts summary={selected.summary || {}} />
                </Card>
              </>
            ) : (
              <Card sx={{ p: 5, textAlign: "center", borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }} elevation={6}>
                <Typography variant="h5" color="text.secondary" fontWeight={600}>
                  🔍 No dataset selected
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Please upload a dataset to get started
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
