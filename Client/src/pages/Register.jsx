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
import Navbar from '../components/navbar/Navbar';

const defaultTheme = createTheme();

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(false);
      const res = await fetch('http://localhost:8800/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (!data.success) {
        setError(true);
      }
    } catch (error) {
      setError(false);
      alert('สมัครสมาชิกสำเร็จ'); // Display an alert
      navigate("/login")
    } finally {
      setLoading(false);
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
              สมัครสมาชิก
            </Typography>

            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstname"
                    required
                    fullWidth
                    id="firstname"
                    label="ชื่อ"
                    autoFocus
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastname"
                    label="นามสกุล"
                    name="lastname"
                    type='text'
                    autoComplete="family-name"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="อีเมล"
                    name="email"
                    type='text'
                    autoComplete="email"
                    onChange={handleChange}

                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="phone"
                    label="เบอร์โทร"
                    name="phone"
                    type='text'
                    autoComplete="phone"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="รหัสผ่าน"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    onChange={handleChange}
                  />

                </Grid>
              </Grid>
              <Button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: '#4169E1' }}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? 'Loading...' : 'สมัครสมาชิก'}
              </Button>

              <Grid container justifyContent="flex-end">
                <Grid item>
                  <div className="col">
                    <p>
                      มีบัญชีผู้ใช้เเล้ว ใช่หรือไม่?{' '}
                      <Link to="/login" style={{ color: '#4169E1', textDecoration: 'none' }}>
                        เข้าสู่ระบบ
                      </Link>
                    </p>
                  </div>
                </Grid>
                <span style={{ color: '#FF2300' }}>{error && 'Something went wrong!'}</span>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}