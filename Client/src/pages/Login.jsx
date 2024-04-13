import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';

import { logInStart, logInSuccess, logInFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/navbar/Navbar';

const defaultTheme = createTheme();

const Login = () => {
  const [formData, setFormData] = useState({});
  const {loading, error: error} = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if email and password are provided
    if (!formData.email || !formData.password) {
      return dispatch(logInFailure('Please fill all the fields'));
    }
  
    try {
      dispatch(logInStart());
      // Send login request to the server
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      // Check if the login request was successful
      if (!res.ok) {
        throw new Error('Failed to log in. Please try again.'); // Handle unsuccessful login
      }
  
      const data = await res.json();
  
      // Check if login was successful
      if (data.success === false) {
        dispatch(logInFailure(data.message)); // Dispatch login failure action with error message
        return;
      }
  
      dispatch(logInSuccess(data)); // Dispatch login success action
  
      // Redirect based on user role
      if (data.isAdmin) {
        // Redirect admin to the admin dashboard
        navigate('/admin-dashboard');
      } else if (data.role === 'owner' || data.role === 'customer' || data.role === 'users') {
        navigate('/'); // Redirect owner or customer to the main page
      } else {
        // If role is not specified or unrecognized, redirect to admin dashboard as fallback
        navigate('/admin-dashboard');
      }
    } catch (error) {
      // Handle errors during login process
      dispatch(logInFailure(error.message));
    }
  };
  
  
  return (
    <div>
      <Navbar />
      <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            ยินดีต้อนรับ เข้าสู่ระบบ
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="อีเมล"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="รหัสผ่าน"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              style={{ backgroundColor: '#4169E1' }}
              sx={{ mt: 3, mb: 2 }}
              
            >
             {loading ? 'Loading...' : 'เข้าสู่ระบบ'}
            </Button>

            <Grid container>
              <Grid item>
                <div className="col">
                  <p>
                    ไม่มีบัญชีผู้ใช้ ใช่หรือไม่?{' '}
                    <Link to="/signup" style={{ color: '#4169E1', textDecoration: 'none' }}>
                     สมัครสมาชิก
                    </Link>
                  </p>
                </div>
                <span style={{ color: '#FF2300' }}>{error && 'เกิดข้อผิดพลาด!'}</span>

              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </div>
    
  );
}

export default Login;
