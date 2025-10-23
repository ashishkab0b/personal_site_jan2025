import React, { useState } from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, useTheme } from '@mui/material';
import bgPic from '../assets/luangprabang.webp';

export default function Hero() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const compAffSciDef = `
    <p>Affective science is the interdisciplinary study of emotions, motivation, and related affective processes, including their biological, psychological, and social dimensions. It seeks to understand how affect influences cognition, behavior, and decision-making in various contexts.</p>
    <p>Computational affective science applies computational methods, such as natural language processing, machine learning, and simulations, to model, analyze, and predict affective processes. It combines theories from affective science with computational tools to quantify emotions, understand their dynamics, and design affect-aware systems. </p>
  `;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '300px', md: '500px' },
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
          url(${bgPic}) 
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

      {/* <Typography
        variant="h5"
        component="h2"
        sx={{
          maxWidth: '700px',
          mb: 3,
          textShadow: '1px 1px 6px rgba(0,0,0,0.4)',
          // cursor: 'pointer', // Makes it clear the text is clickable
          // '&:hover': {
          //   textShadow: '0px 0px 8px rgba(255,255,255,0.7)',
          // },
        }}
        // onClick={handleOpen} // Open dialog on click
      >
        AI Researcher
      </Typography> */}

      <Typography
        variant="h5"
        component="h2"
        sx={{
          maxWidth: '700px',
          mb: 3,
          textShadow: '1px 1px 6px rgba(0,0,0,0.4)',
          cursor: 'pointer', // Makes it clear the text is clickable
          '&:hover': {
            textShadow: '0px 0px 8px rgba(255,255,255,0.7)',
          },
        }}
        onClick={handleOpen} // Open dialog on click
      >
        AI Researcher <br />
        Computational Affective Scientist
      </Typography>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>What is Computational Affective Science?</DialogTitle>
        <DialogContent>
          <Typography
            sx={{ fontSize: '16px', lineHeight: 1.5 }}
            dangerouslySetInnerHTML={{ __html: compAffSciDef }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}