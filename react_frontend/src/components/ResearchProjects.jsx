// src/components/ResearchProjects.jsx
import React from 'react';
import { Box, Typography, Card, CardContent, CardHeader } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

const projectsData = [
  {
    title: 'Emotion Regulation Personalization',
    description: 'Brief blurb about Project Alpha...'
  },
  {
    title: 'Emotion Awareness',
    description: 'Brief blurb about Project Beta...'
  },
  {
    title: 'Project Gamma',
    description: 'Brief blurb about Project Gamma...'
  }
]

export default function ResearchProjects() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        <Tooltip title="A representative subset of research programs" arrow placement="right">
          <span>Research Projects</span>
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