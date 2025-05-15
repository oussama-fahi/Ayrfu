// src/components/public/applicants/MotivationLetterStep.jsx
import React, { useState } from 'react';
import { 
  Typography, 
  TextField, 
  Box, 
  Paper,
  Button,
  Stack,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

const MotivationLetterStep = ({ letter, onChange }) => {
  const [wordCount, setWordCount] = useState(letter ? countWords(letter) : 0);
  const [charCount, setCharCount] = useState(letter ? letter.length : 0);
  
  // Template prompts for motivation letter
  const templates = [
    {
      title: "Highlight Your Skills",
      text: "I would like to emphasize my proficiency in [relevant skills], which I believe align perfectly with the requirements of this position."
    },
    {
      title: "Professional Growth",
      text: "I'm particularly excited about this opportunity as it allows me to expand my expertise in [industry/field] while contributing to innovative projects."
    },
    {
      title: "Company Values",
      text: "Your company's commitment to [company value/mission] resonates with my professional philosophy, and I'm eager to be part of an organization that prioritizes these values."
    },
    {
      title: "Relevant Experience",
      text: "In my previous role at [Company Name], I successfully [achievement relevant to the position], which demonstrates my ability to deliver results in similar environments."
    }
  ];
  
  // Count words in text
  function countWords(text) {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }
  
  // Handle text change
  const handleLetterChange = (e) => {
    const newText = e.target.value;
    onChange(newText);
    setWordCount(countWords(newText));
    setCharCount(newText.length);
  };
  
  // Insert template text at cursor position
  const insertTemplate = (templateText) => {
    // Create a textarea element to support document.execCommand
    const textarea = document.createElement('textarea');
    textarea.value = templateText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    // Alert user
    alert('Template copied to clipboard! Paste it in your motivation letter.');
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Motivation Letter
      </Typography>
      
      <Typography variant="body1" paragraph>
        Your motivation letter is your opportunity to explain why you're interested in this position and how your skills and experience make you the ideal candidate.
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          A great motivation letter should:
          <ul>
            <li>Explain why you're interested in the position</li>
            <li>Highlight relevant skills and experience</li>
            <li>Show your understanding of the company and role</li>
            <li>Be concise (aim for 250-400 words)</li>
          </ul>
        </Typography>
      </Alert>
      
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Chip 
          icon={<FormatQuoteIcon />} 
          label={`${wordCount} words`} 
          color={wordCount < 100 ? "warning" : wordCount > 500 ? "error" : "success"} 
          variant="outlined"
        />
        <Chip 
          label={`${charCount} characters`} 
          variant="outlined" 
          color="primary"
        />
        <Typography variant="caption" sx={{ ml: 'auto' }}>
          Recommended: 250-400 words
        </Typography>
      </Stack>
      
      <TextField
        label="Motivation Letter"
        multiline
        rows={12}
        fullWidth
        value={letter}
        onChange={handleLetterChange}
        placeholder="Dear Hiring Manager,

I am writing to express my interest in the [Position] role advertised by UDDAN. With my background in [relevant field/technology], I believe I am well-positioned to contribute to your team.

[Your motivation letter content here...]

Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experience align with your requirements.

Sincerely,
[Your Name]"
        sx={{ mb: 3 }}
      />
      
      <Divider sx={{ my: 3 }}>
        <Chip label="Need inspiration?" variant="outlined" color="primary" icon={<AutoFixHighIcon />} />
      </Divider>
      
      <Typography variant="subtitle2" gutterBottom>
        Helpful Templates
      </Typography>
      
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack spacing={1}>
          {templates.map((template, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                {template.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Box sx={{ 
                  p: 1, 
                  borderLeft: '3px solid',
                  borderColor: 'primary.main',
                  bgcolor: 'background.subtle',
                  flexGrow: 1,
                  borderRadius: '0 4px 4px 0'
                }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    "{template.text}"
                  </Typography>
                </Box>
                <Button 
                  size="small" 
                  startIcon={<ContentPasteIcon />}
                  sx={{ ml: 1 }}
                  onClick={() => insertTemplate(template.text)}
                >
                  Copy
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>
      
      <Typography variant="body2" color="text.secondary">
        Tip: Personalize your letter to show your genuine interest in the position and company. Avoid generic statements and focus on what makes you uniquely qualified.
      </Typography>
    </Box>
  );
};

export default MotivationLetterStep;