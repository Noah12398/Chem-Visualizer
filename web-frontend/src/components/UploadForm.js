import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Card,
  LinearProgress,
  Stack,
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function UploadForm({ onUploaded, auth }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a CSV file.");
    if (!auth) return alert("You must be logged in to upload.");

    const fd = new FormData();
    fd.append("file", file);

    try {
      setLoading(true);
      await axios.post("/api/upload/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        auth: auth,
      });

      setLoading(false);
      alert("Upload successful!");
      setFile(null);

      onUploaded && onUploaded();
    } catch (err) {
      setLoading(false);
      alert("Upload failed.");
      console.error(err);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight={700} sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        📤 Upload Dataset
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* File Input Box */}
          <Box
            sx={{
              border: "3px dashed",
              borderColor: file ? "#667eea" : "#d0d0d0",
              borderRadius: 3,
              p: 4,
              textAlign: "center",
              cursor: "pointer",
              background: file 
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                : '#fafafa',
              transition: 'all 0.3s ease',
              "&:hover": { 
                borderColor: "#667eea",
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
              },
            }}
            onClick={() => document.getElementById("csv-input").click()}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: file ? '#667eea' : '#999', mb: 1 }} />
            <Typography variant="body1" fontWeight={600}>
              {file ? (
                <span style={{ color: '#667eea' }}>✓ {file.name}</span>
              ) : (
                "Click or drag CSV file here to upload"
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Supported format: .csv
            </Typography>
          </Box>

          {/* Hidden file input */}
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />

          {/* Upload Button */}
          <Button
            variant="contained"
            type="submit"
            disabled={!file || loading}
            startIcon={<CloudUploadIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 700,
              fontSize: 15,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              },
              '&:disabled': {
                background: '#e0e0e0',
              }
            }}
          >
            {loading ? "Uploading..." : "Upload CSV"}
          </Button>

          {/* Progress Bar */}
          {loading && <LinearProgress sx={{
            borderRadius: 2,
            height: 6,
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            }
          }} />}
        </Stack>
      </form>
    </Box>
  );
}

