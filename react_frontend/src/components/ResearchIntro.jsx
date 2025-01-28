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
    Research<br/>Introduction
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
    I am a computational affective scientist driven by the question: How can we deepen AI’s understanding of what truly motivates and shapes human behavior? My research sits at the intersection of psychology and artificial intelligence, focused on understanding the person-specific factors that govern our affective experience and behavior so that we can enrich large language models (LLMs) with a more profound, nuanced grasp of their users.
    </Typography>
    <Typography component="p">
    In my current work, I leverage insights into people’s beliefs and values to deliver personalized emotional support. Unlike the prevailing approach to emotion regulation in LLMs, which takes a one-size-fits-all approach, I am exploring how language models can meaningfully adapt to individuals’ unique worldviews and deeply held values. This approach recognizes that effectively providing emotional support requires understanding the core beliefs and values that shape how individuals interpret and navigate their experiences.
    </Typography>
    <Typography component="p">
    Looking ahead, I aim to develop methods that enable AI systems to engage with people in ways that reflect a deeper understanding of human thought and behavior. By applying my background in psychological theory and my technical expertise in AI systems, I strive to design technologies that are not only intelligent but also deeply human.
    </Typography>
    </Box>
    </Box>
    
    
  )
}
