// src/App.jsx

import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  CssBaseline,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SideNav from './components/SideNav';
import Hero from './components/Hero';
import ResearchIntro from './components/ResearchIntro';
import ResearchProjects from './components/ResearchProjects';
import SideProjects from './components/SideProjects';
import Footer from './components/Footer';

// The drawer’s width on desktop
const drawerWidth = 260;

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // The content of the drawer
  const drawer = <SideNav />;

  return (
    <Router>
      {/* 
        CSS baseline helps ensure consistent
        styling across browsers 
      */}
      <CssBaseline />

      {/* 
        AppBar with a menu icon that toggles the Drawer
        only visible on xs/sm; hidden on md+
      */}
      <AppBar
        position="fixed"
        sx={{
          // zIndex: theme.zIndex.drawer + 1, // keep AppBar above Drawer
          display: { xs: 'block', sm: 'none' }, // hide on md+
        }}
      >
        <Toolbar>
          {/* Hamburger menu (hidden on smUp, shown on xs only) */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          {/* <Typography variant="h6" noWrap component="div">
            My Research Site
          </Typography> */}
        </Toolbar>
      </AppBar>

      {/* 
        Drawer for mobile (temporary):
        - visible only on small screens 
        - toggles via the hamburger button 
      */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth }, // keep space for permanent drawer on sm+
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Permanent drawer (shown on sm+ screens) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid #ddd',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* 
        Main content area (to the right of the Drawer).
        On mobile, it takes full width; on sm+, subtract drawerWidth 
      */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          // Only add top margin on mobile to make room for the AppBar
          // mt: { xs: '64px', sm: 0 },
        }}
      >
        {/* You need a little top padding for the fixed AppBar */}
        <Toolbar />
        <Hero />
        <ResearchIntro />
        <ResearchProjects />
        <SideProjects />
      </Box>

      {/* Footer at the bottom */}
      <Footer />
    </Router>
  );
}