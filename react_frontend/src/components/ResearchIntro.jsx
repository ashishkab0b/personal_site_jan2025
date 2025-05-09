// src/components/ResearchIntro.jsx

import React from 'react'
import { Box, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles';

export default function ResearchIntro() {


  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: isSmallScreen ? 'column' : 'row',
      gap: 3,
      mb: 4,
    }}
  >
    {/* Left-aligned label */}
    <Box sx={{ flexShrink: 0, textAlign: 'left', minWidth: 200 }}>
        <Typography
          variant="h4"
          sx={{ color: 'primary.main', mb: 2 }}
        >
    Research<br/>
    Introduction
    </Typography>
    </Box>
    
    {/* Main content */}
    <Box
    sx={{
      flexGrow: 1, // Takes up remaining space
      maxWidth: '800px',
      width: '100%',
      ml: 5,
      // px: 2,
    }}
    >
    <Typography component="p">
    In my recently defended PhD dissertation, I worked in the lab of Professor James Gross addressing the following issue. When people feel negative emotions, they often use a strategy called reappraisal which involves reframing a negative situation to help themselves feel better. However, there are so many different ways to reframe a negative situation, how can we know what will be the impact of any given perspective? In my work, I discovered that by considering people’s prior beliefs about how the world works and personal values that govern how they evaluate the world, we can better predict what kinds of reappraisals will be most effective for a given individual, enhancing our ability to deliver personalized emotional support. I implemented these principles into large language model (LLM) tools to create emotion regulation messages personalized for unique individuals. During my PhD, I also have done work examining the ways in which dimensions of emotion awareness and emotion regulation reciprocally influence each other. 
    </Typography>
    <Typography component="p">
    In my upcoming postdoc, I will be working with Professors Carol Dweck and Nick Haber to explore methods for incorporating human-like intrinsic motivation into autonomous AI agents. By taking inspiration from the motivational forces that drive human behavior, I aim to develop AI systems that that pursue open-ended goals in adaptive, self-directed ways while simultaneously developing a rigorous computational theory of motivation in humans.
    </Typography>
    </Box>
    </Box>
    
    
  )
}
