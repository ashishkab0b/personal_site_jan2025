// src/components/SideProjects.jsx
import React from 'react'
import { Box, Typography, Card, CardContent, CardHeader } from '@mui/material'
import Tooltip from '@mui/material/Tooltip';

const projectsData = [
  {
    title: 'Reappraise.it',
    description: 'A personalized cognitive reappraisal chatbot designed to help users reframe negative thoughts. Built using Flask and React with DynamoDB for session-based chat history storage. It incorporates AI-driven strategies for delivering tailored interventions and user feedback collection.'
  },
  {
    title: 'EMA Pingbot',
    description: 'A tool for researchers to build ecological momentary assessment (EMA) studies. Participants join studies with unique codes and receive timely survey links. Built with Python, Flask, DynamoDB for data storage, and Celery for scheduled task management.'
  },
  {
    title: 'Multi-agent Fantasy Football Reinforcement Learning',
    description: 'A simulation of fantasy football drafts using multi-agent reinforcement learning models. Implemented with Stable Baselines 3 and custom SARLDraftEnv environments to train 12 RL agents that optimize draft strategies. The project explores reward scaling, action policies, and agent interactions to maximize team performance.'
  }
]

export default function SideProjects() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        <Tooltip title="A representative subset of technical side projects" arrow placement="right">
          <span>Technical Side Projects</span>
        </Tooltip>
      </Typography>
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 2 
        }}
      >
        {projectsData.map((proj, idx) => (
          <Card key={idx} variant="outlined" sx={{ borderRadius: 2 }}>
            <CardHeader 
              title={proj.title} 
              sx={{ 
                backgroundColor: 'secondary.main', 
                color: '#fff' 
              }} 
            />
            <CardContent>
              <Typography variant="body1">
                {proj.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}