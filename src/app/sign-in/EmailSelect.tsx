'use client';

import { useSession } from 'next-auth/react'

import {
  Box,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';

export default function EmailSelect({
  loading,
  selectedEmail,
  setSelectedEmail,
  handleSendCode,
}: {
  loading: boolean;
  selectedEmail: string | null;
  setSelectedEmail: (email: string) => void;
  handleSendCode: () => void;
}) {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <>
        <Typography variant='body1' sx={{mb:2}}>
          To sign in we will send you a verification code which you will need to enter in.
        </Typography>
        <Typography variant='body1' sx={{mb:4}}>
          Please select where you would like to receive your verification code.
        </Typography>
        <Box>
          <FormControl>
            <RadioGroup
              key={'mfa-email-select'}
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
            >
              {session.user.emails.map((email) => (
                <FormControlLabel
                  key={email.id}
                  value={email.id}
                  control={<Radio />}
                  label={email.masked}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
       
        <Button 
          variant='contained' 
          sx={{mt: 5}}
          disabled={loading || selectedEmail === ''}
          onClick={() => {
            handleSendCode();
          }}
        >
          Send Code
        </Button>
      </>
    );
  }
}