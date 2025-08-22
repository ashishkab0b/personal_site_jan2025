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
    During my PhD, I worked in the lab of Professor James Gross to better understand how to personalize emotion regulation for individual people. When people feel negative emotions, they often use an emotion regulation strategy called reappraisal, which involves reframing a negative situation to help themselves feel better. However, there are so many different ways to reframe a negative situation, how can we know what will be the impact of any given perspective? In my work, I discovered that two key factors that explain the vast heterogeneity in what works for whom are (1) people’s prior beliefs about how the world works and (2) their personal values that govern how they evaluate the world. Thus, by considering people's prior beliefs and personal values we can better predict what kinds of reappraisals will be most effective for a given individual and enhance our ability to deliver personalized emotional support. I implemented these principles into large language model (LLM) tools to create emotion regulation messages tailored for unique individuals. Earlier in my PhD, I also did work examining the ways in which dimensions of emotion awareness and emotion regulation reciprocally influence each other. 
    </Typography>
    <Typography component="p">
    In my postdoc, I am extending these ideas beyond the domain of emotional support to develop methods for personalizing general purpose LLMs based on people's unique cognitive and affective characteristics. I am also working on developing new evaluation benchmarks for assessing the the ability of LLMs to personalize responses to individual users.
    </Typography>
    </Box>
    </Box>
    
    
  )
}
