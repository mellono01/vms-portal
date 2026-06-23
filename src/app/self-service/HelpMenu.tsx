'use client'

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Collapse,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography 
} from '@mui/material'

import { 
  HelpOutline, 
  Close, 
  ExpandMore, 
  ExpandLess, 
  OpenInNew, 
  HelpOutlined,
  Edit,
  Search
} from '@mui/icons-material';

interface HelpLink {
  label: string;
  url: string;
}

interface HelpScenario {
  title: string;
  description: string;
  content?: React.ReactNode | React.ReactNode[];
  steps?: string[];
  note?: string | string[];
  links?: HelpLink[];
  alwaysExpanded?: boolean;
}

const HelpLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    rel="noopener noreferrer"
    target="_blank"
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.2,
      color: 'primary.main',
      fontWeight: 500,
      mt: 1,
      '&:hover': {
        textDecoration: 'underline',
      },
    }}
  >
    {children}
    <OpenInNew sx={{ fontSize: '1rem' }} />
  </Link>
);

const scenarios: HelpScenario[] = [
  {
    title: 'How to view your clearances',
    description: 'Understand your clearances and what they can be used for',
    content: (
      <Box>
        Clearances are displayed as "cards" on this page. Each card represents a clearance and provides information about its status, type, where it can be used and what it can be used for
        {' '}
        <Link
          component="button"
          type="button"
          underline="hover"
          onClick={() => window.dispatchEvent(new CustomEvent('flash-clearance-card'))}
          sx={{
            fontSize: 'inherit',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
            <Search sx={{ fontSize: '1rem', mr: 0.5 }} />
            <Typography variant='body2'>
              Show Me 
            </Typography>
        </Link>
        <br />
        <br />
        To view more information about what each clearance can be used for, click the <HelpOutlined sx={{ fontSize: '1rem', verticalAlign: 'text-bottom', color: 'primary.main' }} /> button at the top of your clearance card
        {' '}
        <Link
          component="button"
          type="button"
          underline="hover"
          onClick={() => window.dispatchEvent(new CustomEvent('flash-clearance-help-icon'))}
          sx={{
            fontSize: 'inherit',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <Search sx={{ fontSize: '1rem', mr: 0.5 }} />
          <Typography variant='body2'>
            Show Me 
          </Typography>
        </Link>
      </Box>
    ),
    
  },
  {
    title: 'How to update your details',
    description: 'Update information on your existing clearances',
    content: (
      <>
        <Typography variant="body2" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
          Steps:
        </Typography>
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          <li style={{ marginBottom: 6 }}>
            <Typography variant="body2" sx={{ verticalAlign: 'middle', display: 'flex', alignItems: 'center' }}>
              Click the 
              <Button 
                variant='text' 
                sx={{textTransform: 'none'}}
                onClick={() => {}}
              >
                <Edit/>
                <Typography variant='body1' sx={{ml:0.5}}>
                  Edit
                </Typography>
              </Button> 
              button on the clearance you wish to update
            </Typography>
          </li>
          <li style={{ marginBottom: 6 }}>
            <Typography variant="body2">
              Update the any fields you need to change
            </Typography>
          </li>
          <li style={{ marginBottom: 6 }}>
            <Typography variant="body2">
              Save your changes
            </Typography>
          </li>
          <li style={{ marginBottom: 6 }}>
            <Typography variant="body2">
              Your information will be updated
            </Typography>
          </li>
        </ol>
      </>
    ),
    note: 'Updating your WWCC number or expiry date will set your clearance status as "Renewing" while we re-verify your information.',
  },
  {
    title: 'How to add your Working With Children Check (WWCC)',
    description: 'Upgrade your clearance by adding your WWCC details',
    content: 'Upgrading a "Volunteer Exempt" or "Contractor Exempt" clearance will enable it to be used for volunteer or contractor visits that require a WWCC.',
    steps: [
      'Find the clearance you want to add your WWCC to',
      'Select the "Upgrade" button',
      'Fill out the WWCC details form and complete the declaration',
      'Wait while your WWCC is verified and your clearance is upgraded'
    ]
  },
  {
    title: 'How to renew an expiring clearance',
    description: 'Steps to renew a clearance before it expires',
    content: 'Renewing your clearance before it expires will allow you to continue visiting our sites without interruption.',
    steps: [
      'Find the clearance marked "Expiring" on your dashboard',
      'Click the "Edit" button on that card',
      'Update required information',
      'Submit the renewal request',
      'You will be notified once the renewal is complete'
    ]
  },
  {
    title: 'How to renew an expired clearance',
    description: 'Steps to renew a clearance after it has expired',
    content: 'An expired clearance must be renewed before it can be used again. The renewal process may require re-verification of your information, so it\'s best to renew before expiry.',
    steps: [
      'Find the clearance marked "Expired" on your dashboard',
      'Click the "Edit" button on that card',
      'Update required information',
      'Submit the renewal request',
      'Wait for notification that your renewal is complete and your clearance is active again'
    ]
  },
  {
    title: 'How to apply for a new clearance',
    description: 'Apply for a new clearance if you need one that you don\'t have',
    content: 'If you need to attend one of our sites for a reason not covered by your existing clearances, you can apply for a new clearance. You can have multiple clearances at the same time to cover different types of visits.',
    steps: [
      'Click "Add New Clearance"',
      'Answer the questions to determine which clearance you need',
      'Fill in all required fields',
      'Review and submit your details',
      'Wait for approval notification'
    ]
  }
];

const HELP_MENU_COOKIE = 'vmsp_help_menu_closed';

const getCookieValue = (name: string): string | null => {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const setCookieValue = (name: string, value: string, days: number): void => {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
};

const HelpMenu = () => {
  const [open, setOpen] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const isClosed = getCookieValue(HELP_MENU_COOKIE) === 'true';
    setOpen(!isClosed);
  }, []);

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleClose = () => {
    setOpen(false);
    setCookieValue(HELP_MENU_COOKIE, 'true', 365);
  };

  const handleOpen = () => {
    setOpen(true);
    setCookieValue(HELP_MENU_COOKIE, 'false', 365);
  };

  return (
    <Box
      component={Paper}
      elevation={24}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
            borderRadius: '50px',
      }}
    >
      {open ? (
        <Paper
          elevation={24}
          sx={{
            width: {
              xs: 'calc(100vw - 32px)',
              sm: 360,
              md: 480,
            },
            maxWidth: '480px',
            maxHeight: '70vh',
            overflow: 'hidden',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
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
              backgroundColor: 'secondary.main',
              // backgroundColor: 'primary.main',
              zIndex: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'black' }}>
              <HelpOutline  sx={{ fontSize: '1.4rem', mr:'4px' }}/>
              <Typography variant="h6" sx={{ m:0,fontWeight: 600 }}>
                Help
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{ p: 0.5, color: 'white' }}
            >
              <Close fontSize="small" sx={{ color: 'black' }} />
            </IconButton>
          </Box>

          {/* Scenarios List */}
          <List
            sx={{
              p: 0,
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {scenarios.map((scenario, index) => (
              <Box key={index}>
                <ListItemButton
                  onClick={() => {
                    if (!scenario.alwaysExpanded) {
                      toggleExpanded(index)
                    }
                  }}
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
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {scenario.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {scenario.description}
                      </Typography>
                    }
                  />
                  {scenario.alwaysExpanded ? null : expandedIndex === index ? (
                    <ExpandLess fontSize="small" />
                  ) : (
                    <ExpandMore fontSize="small" />
                  )}
                </ListItemButton>

                {/* Expanded Content */}
                <Collapse in={scenario.alwaysExpanded || expandedIndex === index} timeout="auto" unmountOnExit>
                  <Box sx={{ backgroundColor: 'grey.50', p: 2 }}>

                    {/* Text Content */}
                    {scenario.content && (
                      <>
                        {Array.isArray(scenario.content) ? (
                          <ul style={{ margin: 0, paddingLeft: 20, marginBottom: 12 }}>
                            {scenario.content.map((text, textIndex) => (
                              <li key={textIndex} style={{ marginBottom: 6 }}>
                                <Typography variant="body2" >
                                  {text}
                                </Typography>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <Typography component="div" variant="body2" sx={{ display: 'block', mb: 2, whiteSpace: 'pre-line' }}>
                            {scenario.content}
                          </Typography>
                        )}
                      </>
                    )}
                    
                    {/* Steps */}
                    {scenario.steps && (
                      <>
                        <Typography variant="body2" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                          Steps:
                        </Typography>
                        <ol style={{ margin: 0, paddingLeft: 20, marginBottom: (scenario.links || scenario.note) ? 12 : 0 }}>
                          {scenario.steps.map((step, stepIndex) => (
                            <li key={stepIndex} style={{ marginBottom: 6 }}>
                              <Typography variant="body2">
                                {step}
                              </Typography>
                            </li>
                          ))}
                        </ol>
                      </>
                    )}

                    {/* Text Note */}
                    {scenario.note && (
                      <>
                        {Array.isArray(scenario.note) ? (
                          <ul style={{ margin: 0, paddingLeft: 20, marginBottom: 12 }}>
                            {scenario.note.map((text, textIndex) => (
                              <li key={textIndex} style={{ marginBottom: 6 }}>
                                <Typography variant="body2">
                                  {text}
                                </Typography>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <Typography variant="body2" sx={{ display: 'block', mb: 2, mt: 3}}>
                            <strong>Note:</strong> {scenario.note}
                          </Typography>
                        )}
                      </>
                    )}

                    {/* Links */}
                    {scenario.links && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {scenario.links.map((link, linkIndex) => (
                          <Link
                            key={linkIndex}
                            href={link.url}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              textDecoration: 'none',
                              color: 'primary.main',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              '&:hover': {
                                textDecoration: 'underline',
                              }
                            }}
                          >
                            {link.label}
                            <OpenInNew sx={{ fontSize: '0.75rem' }} />
                          </Link>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </Box>
            ))}
            {/* <Box key={scenarios.length+1}>
              <ListItemButton
                onClick={() => {toggleExpanded(scenarios.length+1)}}
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
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      What can my clearance be used for?
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Find out what visits your clearance can be used for
                    </Typography>
                  }
                />
                {expandedIndex === scenarios.length+1 ? (
                  <ExpandLess fontSize="small" />
                ) : (
                  <ExpandMore fontSize="small" />
                )}
              </ListItemButton>

              <Collapse in={expandedIndex === scenarios.length+1} timeout="auto" unmountOnExit>
                <Box sx={{ backgroundColor: 'grey.50', p: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Each clearance type covers different types of visits. You can have multiple clearances at the same time to cover different visit purposes. If you need to attend one of our sites for a reason not covered by your existing clearances, you can apply for a new clearance.
                  </Typography>
                  <Typography variant="body2">
                    Volunteer
                  </Typography>
                </Box>
              </Collapse>
            </Box> */}
            <Box key={'need-more-help'} sx={{p:2, backgroundColor: 'grey.200'}}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Need something else?
              </Typography>
              <Typography variant="body2">
                Check the <HelpLink href="/vms/portal/info/faq">Frequently Asked Questions</HelpLink> or <HelpLink href="/vms/portal/info">Contact Us</HelpLink> for more support.
              </Typography>
            </Box>
          </List>
        </Paper>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          // color="primary"
          onClick={handleOpen}
          startIcon={<HelpOutline />}
          sx={{
            borderRadius: '50px',
            px: 2,
            textTransform: 'none',
            fontWeight: 600,
            '& .MuiButton-startIcon': {
              marginRight: '4px', // default is larger
              marginLeft: 0,
            },
          }}
        >
          Help
        </Button>
      )}
    </Box>
  );
};

export default HelpMenu;