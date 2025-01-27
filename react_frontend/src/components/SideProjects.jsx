// src/components/SideProjects.jsx
import React from 'react'
import { Box, Typography, Card, CardContent, CardHeader } from '@mui/material'
import Tooltip from '@mui/material/Tooltip';
import ProjectList from './ProjectList';
import GitHubIcon from '@mui/icons-material/GitHub';


const projectsData = [
  {
    title: 'Reappraise.it',
    short_description: 'A collaborative cognitive reappraisal chatbot designed to help users develop and refine more helpful perspectives on the challenges in their lives. Built using Flask (Python), React, and GPT.',
    long_description: 'Cognitive reappraisal is a powerful emotion regulation strategy that involves changing the way we think about a situation to change how we feel about it. Reappraise.it is a chatbot that helps users develop and refine more helpful perspectives on the challenges in their lives. The chatbot uses a large language model to generate reappraisals based on a brief interview of the participant and helps the user to refine and tailor the reappraisal to be most effective for them. The chatbot is designed to be collaborative, giving the user agency in finding the right reappraisal for them and also helping them practice the skill of reappraisal. This platform also serves as an economical data collection tool to ultimately train more emotionally intelligent AI systems.',
    icons: [{ name: 'Github', link: 'https://github.com/ashishkab0b/precision_reap_bot_react' }]
  },
  {
    title: 'EMA Pingbot',
    short_description: 'A tool for researchers to build ecological momentary assessment (EMA) studies. Built using Flask (Python), React, and Celery.',
    long_description: 'Ecological momentary assessment (EMA) is a research method that involves collecting data in real-time from participants in their natural environments. In affective science, where human experience is paramount to our understanding, EMA is a critical tool in the toolbox. I built EMA Pingbot to help researchers build, deploy, and manage EMA studies more easily. The tool allows researchers to create studies, schedule surveys, and collect data from participants in a streamlined, user-friendly interface. EMA Pingbot offers two main advantages over competing products. First, it allows researchers to build EMA studies using whatever survey software they know and prefer, instead of forcing them into a proprietary system. Second, it offers API access meaning that researchers can build complex dependencies and rules around their study implementation which allows for unlimited flexibility and creativity in survey design.',
    icons: [{ name: 'Github', link: 'https://github.com/ashishkab0b/pingbot_v2' }]
  },
  {
    title: 'Multi-agent Reinforcement Learning Fantasy Football Draft',
    short_description: 'A simulation study of the 2024 fantasy football draft using multi-agent proximal policy optimization (PPO) reinforcement learning models.',
    long_description: 'Fantasy football is a game in which you assemble a team of real-life NFL players and score points based on their performance in games. The first step in the game, known as the draft, involves taking turns picking players at the beginning of the season and is crucially important to the success of your season. In this project, I first scraped data from a range of different NFL data websites. I then used multi-agent reinforcement learning to simulate the 2024 fantasy football draft and identify the best draft strategy. In essence, this involves pitting multiple AI agents against each other in thousands of simulated drafts to learn a winning strategy.',
    icons: [{ name: 'Github', link: 'https://github.com/ashishkab0b/fantasy_football_2024' }]
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

      {/* Reuse the same ProjectList for side projects */}
      <ProjectList projectsData={projectsData} />
    </Box>
  )
}
