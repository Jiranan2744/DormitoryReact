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

import Alert from 'react-bootstrap/Alert';


import { logInStart, logInSuccess, logInFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

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
    if (!formData.email || !formData.password) {
      return dispatch(logInFailure('Please fill all the fields'));
    }

    try {
      dispatch(logInStart());
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(logInFailure(data));
        return;
      }
      dispatch(logInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(logInFailure(error));
    }
  };

  return (
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
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
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
              label="Password"
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
             {loading ? 'Loading...' : 'Sign In'}
            </Button>

            <Grid container>
              <Grid item>
                <div className="col">
                  <p>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ color: '#4169E1', textDecoration: 'none' }}>
                      Sign up
                    </Link>
                  </p>
                </div>
                <span style={{ color: '#FF2300' }}>{error && 'Something went wrong!'}</span>

              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
