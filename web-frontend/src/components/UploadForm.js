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

export default function UploadForm({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a CSV file.");

    const fd = new FormData();
    fd.append("file", file);

    try {
      setLoading(true);
      await axios.post("/api/upload/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        auth: { username: "admin", password: "admin" },
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
    <Card sx={{ p: 3, borderRadius: 3 }} elevation={2}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Typography variant="h6">Upload CSV File</Typography>

          {/* File Input Box */}
          <Box
            sx={{
              border: "2px dashed #90caf9",
              borderRadius: 3,
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              bgcolor: "#f5f9ff",
              "&:hover": { bgcolor: "#eaf4ff" },
            }}
            onClick={() => document.getElementById("csv-input").click()}
          >
            <Typography variant="body1">
              {file ? (
                <strong>{file.name}</strong>
              ) : (
                "Click or drag file here to upload"
              )}
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
            sx={{ width: 200 }}
          >
            {loading ? "Uploading..." : "Upload CSV"}
          </Button>

          {/* Progress Bar */}
          {loading && <LinearProgress />}
        </Stack>
      </form>
    </Card>
  );
}
