// src/components/ResearchIntro.jsx
import React from 'react'
import { Box, Typography } from '@mui/material'

export default function ResearchIntro() {
  return (
    <Box
    sx={{
      display: 'flex',
      alignItems: 'center', // Centers content vertically
      // justifyContent: 'space-between', // Ensures space between the label and content
      // marginBottom: '2rem', // Adjust the margin to your preference

      // mb: 4,
      // maxWidth: '900px', // Constrain the entire width
      // mx: 'auto', // Center the container on the page
      // px: 2, // Add some padding
    }}
    >
    {/* Left-aligned label */}
    <Box 
    sx={{ 
      // flexShrink: 0, 
      // mr: 2, // Space between the label and content
      textAlign: 'center' 
    }}
    >
    <Typography 
    variant="h4" 
    sx={{ color: 'primary.main', textAlign: 'left' }}
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
    I am a computational affective scientist driven by the question: How can we deepen AI’s understanding of what truly motivates and shapes human behavior? My research sits at the intersection of psychology and artificial intelligence, focused on understanding the individual factors that govern our affective experience so that we can enrich large language models (LLMs) with a more profound, nuanced grasp of human mental models, values, and motivation.
    </Typography>
    <Typography component="p">
    In my current work, I leverage insights into people’s beliefs and values to deliver personalized emotional support. Unlike the prevailing approach to emotion regulation in LLMs, which takes a one-size-fits-all approach, I am exploring how language models can meaningfully adapt to individuals’ unique worldviews and deeply held values. This approach recognizes that effectively providing emotional support requires understanding the core beliefs and values that shape how individuals interpret and navigate their experiences.
    </Typography>
    <Typography component="p">
    Looking ahead, I aim to develop methods that enable AI systems to engage with people in ways that reflect a deeper understanding of human thought and behavior. By applying my background in psychological theory and my technical expertise in AI systems, I strive to design technologies that are not only intelligent but also genuinely supportive, adaptable, and aligned with the complexities of human experience.
    </Typography>
    </Box>
    </Box>
    
    
  )
}






// I am a computational affective scientist driven by the question: How can we deepen AI’s understanding of what truly motivates and shapes human behavior? My research sits at the intersection of psychology and artificial intelligence, focused on enriching large language models (LLMs) with a more profound, nuanced grasp of human mental models, values, and motivation.
// In my current work, I leverage insights into people’s beliefs and values to deliver personalized emotional support. Unlike the prevailing approach to emotion regulation in LLMs, which takes a one-size-fits-all approach, I am exploring how language models can meaningfully adapt to individuals’ unique worldviews and deeply held values. This approach recognizes that effectively providing emotional support requires understanding the core beliefs and values that shape how individuals interpret and navigate their experiences.
// Looking ahead, I aim to develop methods that enable AI systems to engage with people in ways that reflect a deeper understanding of human thought and behavior. By applying my background in psychological theory and my technical expertise in AI systems, I strive to design technologies that are not only intelligent but also genuinely supportive, adaptable, and aligned with the complexities of human experience.