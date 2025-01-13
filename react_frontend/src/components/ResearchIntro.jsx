// src/components/ResearchStatement.jsx
import React from 'react'
import { Box, Typography } from '@mui/material'

export default function ResearchIntro() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Research Introduction
      </Typography>
      <Typography component="p">
        I am a computational affective scientist driven by the question: How can we deepen AI’s understanding of what truly motivates and shapes human behavior? My research sits at the intersection of psychology and artificial intelligence, focused on enriching large language models (LLMs) with a more profound, nuanced grasp of human mental models, values, and motivation.
      </Typography>
      <Typography component="p">
        In my current work, I leverage insights into people’s beliefs and values to deliver personalized emotional support. Unlike the prevailing approach to emotion regulation in LLMs, which takes a one-size-fits-all approach, I am exploring how language models can meaningfully adapt to individuals’ unique worldviews and deeply held values. This approach recognizes that effectively providing emotional support requires understanding the core beliefs and values that shape how individuals interpret and navigate their experiences.
      </Typography>
      <Typography component="p">
        Looking ahead, I aim to develop methods that enable AI systems to engage with people in ways that reflect a deeper understanding of human thought and behavior. By applying my background in psychological theory and my technical expertise in AI systems, I strive to design technologies that are not only intelligent but also genuinely supportive, adaptable, and aligned with the complexities of human experience.
      </Typography>
    </Box>
  )
}






