// src/components/ResearchProjects.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import ProjectList from './ProjectList'

const projectsData = [
  {
    title: 'Emotion Regulation Personalization',
    short_description: 'In this work, I am uncovering psychological mechanisms important for personalizing emotion regulation support to the individual and then using this understanding to develop personalized LLM-based emotion regulation tools.',
    long_description: 'Decades of scientific research has revealed that how we regulate our emotions has a profound impact on our mental and physical well-being. However, when it comes to something as deeply personal as emotion regulation, there is no adequate one-size-fits-all approach. I am conducting research to understand what are the dimensions of the individual can be most effectively leveraged to personalize emotion regulation support to the individual. In my work, I have found that tailoring emotion regulation support to people\'s <em>values</em> and <em>prior beliefs about how the world</em> works can be a potent means to help people regulate their emotions more effectively. In ongoing work, I am leveraging this understanding to develop personalized large language model-based emotion regulation tools.',
    icons: []
  },
  {
    title: 'Mechanisms of Emotional Intelligence',
    short_description: 'In this work, I am trying to understand how facets of emotion awareness and emotion regulation interact and mutually reinforce each other.',
    long_description: 'Emotional intelligence is a complex and highly multi-faceted construct. Though widely recognized as an important predictor of well-being and success, the mechanisms that underlie how the many facets of emotional intelligence are not empirically understood. In my work, I am conducting research to understand how facets of emotional intelligence, such as emotion awareness and emotion regulation, interact and mutually reinforce each other. Understanding the processes by which adaptive awareness and regulation interact can help us develop more effective interventions to help people use their negative emotions when they are useful and manage them effectively when they are not.',
    icons: []
  }
]

export default function ResearchProjects() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        <Tooltip title="A representative subset of my research" arrow placement="right">
          <span>Current Research Foci</span>
        </Tooltip>
      </Typography>

      {/* Reuse the same ProjectList for research projects */}
      <ProjectList projectsData={projectsData} />
    </Box>
  )
}