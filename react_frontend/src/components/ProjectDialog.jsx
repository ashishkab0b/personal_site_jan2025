// src/components/ProjectDialog.jsx
import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'

export default function ProjectDialog({ open, project, onClose }) {
  if (!project) return null

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{project.title}</DialogTitle>
      <DialogContent dividers>
        <Typography 
        variant="body1"
        dangerouslySetInnerHTML={{ __html: project.long_description }}
        >
        </Typography>
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions> */}
    </Dialog>
  )
}