import React, { useState } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Link,
} from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';

function LoginForm({ onLogin, error: authError, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setLocalError('Please enter both username and password');
      return;
    }

    setLocalError('');
    onLogin({ username, password });
  };

  const error = authError || localError;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Card
        elevation={12}
        sx={{
          maxWidth: 450,
          width: '100%',
          p: 4,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <ScienceIcon
            sx={{
              fontSize: 64,
              color: '#667eea',
              mb: 2,
            }}
          />
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Chemical Visualizer
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Sign in to access your dashboard
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
            autoFocus
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              py: 1.5,
              borderRadius: 2,
              fontSize: 16,
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              },
            }}
          >
            Sign In
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link
              component="button"
              type="button"
              onClick={onSwitchToRegister}
              sx={{
                fontWeight: 600,
                color: '#667eea',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>

        <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            <strong>Default Credentials:</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Username: <strong>admin</strong> | Password: <strong>admin</strong>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default LoginForm;
