// src/components/SideNav.jsx
import { React, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Avatar,
  IconButton,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import GitHubIcon from '@mui/icons-material/GitHub';
import profilePic from '../assets/headshot.jpg';  // Import the profile picture
import MailDialog from './MailDialog';  // Import the Mail Dialog

import SvgIcon from '@mui/material/SvgIcon';

function GoogleScholarIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zM3.44 7L12 11.09 20.56 7 12 2 3.44 7zM12 13l-8.5-4v2.15l8.5 4 8.5-4V9l-8.5 4zM3.5 13.5v2l8.5 4 8.5-4v-2l-8.5 4-8.5-4z" />
    </SvgIcon>
  );
}
const StyledAvatar = styled(Avatar)({
  width: 120,
  height: 120,
  margin: '0 auto', // center horizontally
  marginBottom: '1rem',
});

export default function SideNav() {
  
  const [openMailDialog, setOpenMailDialog] = useState(false);

  const handleOpenMailDialog = () => setOpenMailDialog(true);
  const handleCloseMailDialog = () => setOpenMailDialog(false);


  return (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      {/* Small Picture (Avatar) */}
      <StyledAvatar
        alt="Ashish Mehta"
        src={profilePic}
        onContextMenu={(e) => e.preventDefault()} // Disable right-click
        draggable="false" // Disable drag-and-drop
      />

      <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
        Ashish Mehta
      </Typography>
      {/* <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Computational Affective Scientist
      </Typography> */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        PhD Candidate<br />Stanford University
      </Typography>

      <List>

        {/* CV (Google Doc) */}
        <ListItem disablePadding>
          <Tooltip title="Curriculum Vitae on Google Docs" arrow placement="right">
          <ListItemButton
            component="a"
            href="https://docs.google.com/document/d/1FfPnORHNtl72gVfcxily_1BDBJIbSboCpsPfdgXnNI0/edit?tab=t.0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemText primary="CV" />
          </ListItemButton>
          </Tooltip>
        </ListItem>
        
        {/* Ping bot */}
        <ListItem disablePadding>
          <Tooltip title="Free to use application I built to help researchers run ecological momentary assessment studies" arrow placement="right">
          <ListItemButton
            component="a"
            href="https://emapingbot.com/help"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemText primary="EMA Ping Bot" />
          </ListItemButton>
          </Tooltip>
        </ListItem>

        {/* Reappraise.it */}
        <ListItem disablePadding>
        <Tooltip title="Chatbot I built to help brainstorm reframings of difficult situations" arrow placement="right">
          <ListItemButton
            component="a"
            href="https://reappraise.it/?pid=site"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemText primary="Reappraise.it" />
          </ListItemButton>
          </Tooltip>
        </ListItem>

        {/* Resources (Notion) */}
        <ListItem disablePadding>
          <Tooltip title="A mixed bag of tips, code bits, and other helpful resources" arrow placement="right">
          <ListItemButton
            component="a"
            href="https://ashm.notion.site/helpful-resources"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemText primary="Resources" />
          </ListItemButton>
          </Tooltip>
        </ListItem>


        {/* Contact Button (Now Opens Dialog) */}
        <ListItem disablePadding>
          <Tooltip title="Send me a message" arrow placement="right">
            <ListItemButton onClick={handleOpenMailDialog}>
              <ListItemText primary="Contact" />
            </ListItemButton>
          </Tooltip>
        </ListItem>
        

        {/* GitHub & Google Scholar Icons Side by Side */}
        <ListItem disablePadding sx={{ justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>

            {/* GitHub Icon */}
            <Tooltip title="My GitHub page" arrow placement="right">
            <IconButton
              component="a"
              href="https://github.com/ashishkab0b"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GitHubIcon fontSize="large" />
            </IconButton>
            </Tooltip>

            {/* Google Scholar Icon */}
            <Tooltip title="My Google Scholar page" arrow placement="right">
            <IconButton
              component="a"
              href="https://scholar.google.com/citations?user=gIK-KZ4AAAAJ"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Scholar"
            >
              <GoogleScholarIcon fontSize="large" />
            </IconButton>
            </Tooltip>
          </Box>
        </ListItem>
      </List>
      {/* Mail Form Dialog */}
      <MailDialog open={openMailDialog} handleClose={handleCloseMailDialog} />
      
    </Box>
  )
}