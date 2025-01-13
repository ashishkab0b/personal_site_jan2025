// src/App.jsx
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Box from '@mui/material/Box'
import SideNav from './components/SideNav'
import Hero from './components/Hero'
import ResearchIntro from './components/ResearchIntro'
import ResearchProjects from './components/ResearchProjects'
import SideProjects from './components/SideProjects'
import CareerValues from './components/CareerValues'

import '@fontsource/poppins'; // Defaults to 400 weight
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';

export default function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Side Navigation (fixed width) */}
        <Box 
          component="nav"
          sx={{
            width: 260,
            flexShrink: 0,
            bgcolor: 'background.paper',
            borderRight: '1px solid #ddd',
          }}
        >
          <SideNav />
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 3,
          }}
        >
          <Hero />
          <ResearchIntro />
          <ResearchProjects />
          <SideProjects />
          {/* <CareerValues /> */}
        </Box>
      </Box>
    </Router>
  )
}