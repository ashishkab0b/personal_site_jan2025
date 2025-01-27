import React, { useState } from 'react'
import { Box, Card, CardContent, CardHeader, Typography, IconButton, Link } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import ProjectDialog from './ProjectDialog'

export default function ProjectList({ projectsData }) {
  const [open, setOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  
  const handleOpen = (project) => {
    setSelectedProject(project)
    setOpen(true)
  }
  
  const handleClose = () => {
    setSelectedProject(null)
    setOpen(false)
  }
  
  // Helper function to render icons
  const renderIcons = (icons) => {
    return icons.map((icon, idx) => {
      // Add more icons as needed
      const IconComponent = icon.name === 'Github' ? GitHubIcon : null
      
      return (
        IconComponent && (
          <Link 
          href={icon.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          key={idx} 
          sx={{ mr: 1 }}
          >
          <IconButton color="primary">
          <IconComponent />
          </IconButton>
          </Link>
        )
      )
    })
  }
  
  return (
    <>
    <Box 
    sx={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: 2 
    }}
    >
    {projectsData.map((proj, idx) => (
      <Card
      key={idx}
      variant="outlined"
      sx={{
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s', // Smooth transition for hover effects
        '&:hover': {
          transform: 'scale(1.02)', // Slightly scale up on hover
          boxShadow: 3, // Add a subtle shadow effect
        },
      }}
      onClick={() => handleOpen(proj)}
      >
      <CardHeader
      title={proj.title}
      sx={{
        backgroundColor: 'secondary.main',
        color: '#fff',
      }}
      />
      <CardContent>
      <Typography variant="body1">{proj.short_description}</Typography>
      <Box sx={{ mt: 2 }}>{renderIcons(proj.icons)}</Box>
      <Typography
      variant="body2"
      sx={{
        marginTop: 1,
        color: 'text.secondary',
        fontStyle: 'italic',
      }}
      >
      Click to learn more...
      </Typography>
      </CardContent>
      </Card>
    ))}
    </Box>
    
    <ProjectDialog
    open={open}
    project={selectedProject}
    onClose={handleClose}
    />
    </>
  )
}