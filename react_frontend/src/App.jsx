import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Box from '@mui/material/Box';
import SideNav from './components/SideNav';
import Hero from './components/Hero';
import ResearchIntro from './components/ResearchIntro';
import ResearchProjects from './components/ResearchProjects';
import SideProjects from './components/SideProjects';
import Footer from './components/Footer';

import '@fontsource/poppins'; // Defaults to 400 weight
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';

export default function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box 
          component="nav"
          sx={{
            width: '260px',
            flexShrink: 0,
            bgcolor: 'background.paper',
            borderRight: '1px solid #ddd',
            position: 'fixed',
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <SideNav />
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginLeft: '260px',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          <Hero />
          <ResearchIntro />
          <ResearchProjects />
          <SideProjects />
          {/* <CareerValues /> */}
        </Box>
        
        {/* Footer */}
        <Footer />
      </Box>
    </Router>
  );
}