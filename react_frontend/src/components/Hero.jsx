// src/components/Hero.jsx
import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';

export default function Hero() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '300px', md: '500px' },  // Responsive height
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        px: 2,
        mb: 4,
        color: '#fff',
        background: `
          linear-gradient(
            rgba(0, 0, 0, 0.5), 
            rgba(0, 0, 0, 0.8)
          ),
          url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80') 
          center/cover no-repeat
        `,
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          textShadow: '2px 2px 8px rgba(0,0,0,0.6)',
        }}
      >
        Ashish Mehta
      </Typography>

      <Typography
        variant="h5"
        component="h2"
        sx={{
          maxWidth: '700px',
          mb: 3,
          textShadow: '1px 1px 6px rgba(0,0,0,0.4)',
        }}
      >
        Computational Affective Scientist
      </Typography>

      {/* <Button
        variant="contained"
        size="large"
        sx={{
          backgroundColor: theme.palette.secondary.main,
          color: '#fff',
          paddingX: 4,
          paddingY: 1.5,
          textTransform: 'none',
          fontWeight: 'bold',
          borderRadius: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
            boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          },
        }}
      >
        View My Work
      </Button> */}
    </Box>
  );
}