// react_frontend/src/components/MailDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import axios from 'axios';

export default function MailDialog({ open, handleClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/send_email`, formData);
      alert(response.data.message);
      handleClose(); // Close the dialog after successful submission
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message.');
    }
  };

  return (
    <Dialog 
    open={open} 
    onClose={handleClose}
    PaperProps={{
      sx: {
        width: '600px', // Set desired width
        maxWidth: '90vw', // Prevent overflow on small screens
        height: 'auto', // Adjust height as needed
      },
    }}
    >
      <DialogTitle>Contact Me</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Message"
            name="message"
            multiline
            rows={4}
            value={formData.message}
            onChange={handleChange}
            fullWidth
            required
          />
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          padding: 2, // Adds some padding for spacing
        }}
      >
        <Button 
        onClick={handleSubmit} 
        variant="contained" 
        color="primary"
        
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}