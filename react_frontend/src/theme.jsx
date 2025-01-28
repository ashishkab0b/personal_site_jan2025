// react_frontend/src/theme.jsx

import { createTheme } from '@mui/material/styles';

// Muted, Softer Dark Mode Theme
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,    // Extra small devices
      sm: 600,  // Small devices
      md: 960,  // Medium devices
      lg: 1280, // Large devices
      xl: 1920, // Extra large devices
    },
  },

  palette: {
    mode: 'dark',  // Enable Dark Mode
    primary: {
      main: '#8F95C3',  // Muted Indigo
      contrastText: '#EDEDED',
    },
    secondary: {
      main: '#5E9CA0',  // Muted Cyan
      contrastText: '#EDEDED',
    },
    background: {
      default: '#1B1D23',  // Soft dark gray background
      paper: '#24262E',    // Slightly lighter for cards and containers
    },
    text: {
      primary: '#E0E0E0',  // Light gray for text (not pure white)
      secondary: '#A0A0A0',  // Muted gray for secondary text
    },
    divider: 'rgba(255, 255, 255, 0.1)',  // Subtle dividers
  },
  typography: {
    fontFamily: `'Poppins', sans-serif`,  // Modern and clean font
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
      color: '#E0E0E0',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
      color: '#E0E0E0',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#E0E0E0',
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#CFCFCF',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      color: '#E0E0E0',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          backgroundColor: '#2D3038',  // Muted button color
          color: '#E0E0E0',
          '&:hover': {
            backgroundColor: '#3A3D45',  // Slightly lighter on hover
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#24262E',  // Consistent with dark background
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#33363F',  // Soft hover effect for SideNav
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1B1D23',  // Darker background for SideNav
          color: '#E0E0E0',
        },
      },
    }, 
    MuiTypography: {
      styleOverrides: {
        body1: {
          marginBottom: '1rem',  // Add spacing between <p> elements
        },
        body2: {
          marginBottom: '0.75rem',  // Optional: adjust spacing for body2
        },
      },
    },
  },
});

export default theme;