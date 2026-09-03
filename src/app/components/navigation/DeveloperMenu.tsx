"use client"

import { useState } from 'react';

import {
    Box,
    Divider,
    FormControl,
    InputLabel,
    Menu,
    MenuItem,
    Select,
    Switch,
    Typography,
} from '@mui/material';

// Store
import { useStore } from '@/lib/providers/storeProvider';

export default function DeveloperMenu({
    anchor,
    setAnchor,
}: {
    anchor: null | HTMLElement;
    setAnchor: (anchor: null | HTMLElement) => void;
}): JSX.Element {
  const {
    displayMfa,
    sendEmails,
    sendSms,
    email,
    mobile,
    emailOptions,
    mobileOptions,
    setDisplayMfa,
    setSendEmails,
    setSendSms,
    setEmail,
    setMobile,
  } = useStore((store) => store);
  const handleCloseDeveloperMenu = () => {
    setAnchor(null);
  };

  return (
    <Menu
      sx={{ mt: '45px', maxWidth: 500, minWidth: 350 }}
      id="developer-menu"
      anchorEl={anchor}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      // open={true}
      open={Boolean(anchor)}
      onClose={handleCloseDeveloperMenu}
    >
      <Box 
        sx={{
          display: 'flex', 
          flexDirection: 'column', 
          alignContent: 'center', 
          alignItems: 'center', 
          justifyContent: 'center', 
          p: 2, 
          minWidth: 300
        }}
      >
        <Typography variant="h6" sx={{mb:1}}>
          Test Settings
        </Typography>
        <Typography variant="body2" sx={{mb:1, textAlign: 'center'}}>
          Set the email and phone number to be used when testing (only in dev and test environments).
        </Typography>
        <Divider sx={{width: '100%', m: 1}}/>
        <Box>
          <Typography variant="body1" sx={{mb:1, textAlign: 'center', fontWeight: 'bold'}}>
            MFA Codes
          </Typography>
          <Box sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
            <Typography variant="body2" sx={{mb:1, textAlign: 'center'}}>
              Display MFA codes: 
            </Typography>
            <Switch 
              color="secondary"
              checked={displayMfa}
              onChange={(e) => {
                  setDisplayMfa(e.target.checked)
              }}
            />
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
            <Typography variant="body2" sx={{mb:1, textAlign: 'center'}}>
              Send MFA emails:
            </Typography>
            <Switch 
              color="secondary"
              checked={sendEmails}
              onChange={(e) => {
                setSendEmails(e.target.checked)
              }}
            />
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
            <Typography variant="body2" sx={{mb:1, textAlign: 'center'}}>
              Send MFA SMS:
            </Typography>
            <Switch 
              color="secondary"
              checked={sendSms}
              onChange={(e) => {
                  setSendSms(e.target.checked)
              }}
            />
          </Box>
        </Box>
        <Box>
          <FormControl fullWidth sx={{m: 1, minWidth: 230}}>
            <InputLabel id="email-select-label">Email</InputLabel>
            <Select
              labelId="email-select-label"
              id="email-select"
              value={email}
              label="Email"
              onChange={(e) => setEmail(e.target.value)}
            >
              {emailOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}@dow.catholic.edu.au
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{m: 1, minWidth: 230}}>
            <InputLabel id="mobile-number-select-label">Mobile Number</InputLabel>
            <Select
              labelId="mobile-number-select-label"
              id="mobile-number-select"
              value={mobile}
              label="Mobile Number"
              onChange={(e) => setMobile(e.target.value)}
            >

              {mobileOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Menu>
  );
};
