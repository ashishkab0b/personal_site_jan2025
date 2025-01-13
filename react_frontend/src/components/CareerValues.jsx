// src/components/CareerValues.jsx
import React from 'react'
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material'

export default function CareerValues() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Career Values
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Mentoring"
            secondary="I believe in guiding and supporting the next generation of researchers..."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Collaboration"
            secondary="Working with cross-functional teams drives innovation..."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Continuous Learning"
            secondary="Whether discovering new techniques or exploring adjacent fields..."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Future Value Placeholder"
            secondary="Fill in with more details or bullet points as you refine your thoughts."
          />
        </ListItem>
      </List>
    </Box>
  )
}