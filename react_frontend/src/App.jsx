// src/App.jsx

import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Drawer,
  CssBaseline,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SideNav from './components/SideNav';
import Hero from './components/Hero';
import ResearchIntro from './components/ResearchIntro';
import AdminPage from './components/AdminPage';
import AnalyticsBeacon from './components/AnalyticsBeacon';
import CvPage from './components/CvPage';

const drawerWidth = 260;

function SiteLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = /^\/cv\/?$/i.test(pathname) ? 'CV | Ashish Mehta' : 'Ashish Mehta';
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = <SideNav onNavigate={() => setMobileOpen(false)} />;

  return (
    <>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          display: { xs: 'block', sm: 'none' },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

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

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AnalyticsBeacon />
      <Routes>
        <Route path="/admin/*" element={<AdminPage />} />
        <Route element={<SiteLayout />}>
          <Route path="/cv" element={<CvPage />} />
          <Route path="*" element={<><Hero /><ResearchIntro /></>} />
        </Route>
      </Routes>
    </Router>
  );
}
