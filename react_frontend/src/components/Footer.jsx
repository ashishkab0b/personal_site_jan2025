// src/components/Footer.jsx
import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        py: 2,
        textAlign: 'center',
        bgcolor: 'background.paper',
        borderTop: '1px solid #ddd',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {' '}
        <a
          href="https://github.com/ashishkab0b/personal_site_jan2025"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          Made with ❤️ in React by Ashish Mehta
        </a>
      </Typography>
    </Box>
  );
}