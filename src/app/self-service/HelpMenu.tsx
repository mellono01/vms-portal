'use client'

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography 
} from '@mui/material'
import { HelpOutline, Close, ExpandMore, ExpandLess } from '@mui/icons-material';

interface HelpScenario {
  title: string;
  description: string;
  steps: string[];
}

const scenarios: HelpScenario[] = [
  {
    title: 'How to update your details',
    description: 'Update information on your existing clearances',
    steps: [
      'Click the "Edit" button on any clearance card',
      'Update the fields you need to change',
      'Save your changes',
      'Your information will be updated'
    ]
  },
  {
    title: 'How to renew an expiring clearance',
    description: 'Steps to renew a clearance before it expires',
    steps: [
      'Find the clearance marked "Expiring" on your dashboard',
      'Click the "Edit" button on that card',
      'Update required information',
      'Submit the renewal request',
      'Wait for approval notification'
    ]
  },
  {
    title: 'How to apply for a new clearance',
    description: 'Apply for a new clearance if you need one that you don\'t have',
    steps: [
      'Click "Add New Clearance" button',
      'Select the type of clearance you need',
      'Fill in all required fields',
      'Upload any required documents',
      'Review and submit your application'
    ]
  },
  {
    title: 'Need to contact us?',
    description: 'Get in touch with our support team',
    steps: [
      'Click the "Contact Support" button below',
    ]
  }
];

const HelpMenu = () => {
  const [open, setOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      {open ? (
        <Paper
          elevation={4}
          sx={{
            width: 320,
            maxHeight: '70vh',
            overflow: 'auto',
            borderRadius: 2,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              position: 'sticky',
              top: 0,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Help
            </Typography>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              sx={{ p: 0.5 }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {/* Scenarios List */}
          <List sx={{ p: 0 }}>
            {scenarios.map((scenario, index) => (
              <Box key={index}>
                <ListItemButton
                  onClick={() => toggleExpanded(index)}
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {scenario.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {scenario.description}
                      </Typography>
                    }
                  />
                  {expandedIndex === index ? (
                    <ExpandLess fontSize="small" />
                  ) : (
                    <ExpandMore fontSize="small" />
                  )}
                </ListItemButton>

                {/* Expanded Steps */}
                <Collapse in={expandedIndex === index} timeout="auto" unmountOnExit>
                  <Box sx={{ backgroundColor: 'grey.50', p: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                      Steps:
                    </Typography>
                    <ol style={{ margin: 0, paddingLeft: 20 }}>
                      {scenario.steps.map((step, stepIndex) => (
                        <li key={stepIndex} style={{ marginBottom: 6 }}>
                          <Typography variant="caption">
                            {step}
                          </Typography>
                        </li>
                      ))}
                    </ol>
                  </Box>
                </Collapse>
              </Box>
            ))}
          </List>
        </Paper>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          startIcon={<HelpOutline />}
          sx={{
            borderRadius: '50px',
            px: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Help
        </Button>
      )}
    </Box>
  );
};

export default HelpMenu;