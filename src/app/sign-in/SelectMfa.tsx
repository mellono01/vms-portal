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
  Divider,
  Backdrop,
  CircularProgress,
} from '@mui/material';

export default function SelectMfa({
  loading,
  selectedEmail,
  selectedPhone,
  setSelectedEmail,
  setSelectedPhone,
  handleSendCode,
}: {
  loading: boolean;
  selectedEmail: string | null;
  selectedPhone: string | null;
  setSelectedEmail: (email: string | null) => void;
  setSelectedPhone: (phone: string | null) => void;
  handleSendCode: () => void;
}) {
  const { data: session } = useSession();

  function changeMfaSelection({
    type, 
    value
  }: {
    type: 'email' | 'phone'; 
    value: string
  }) {
    if (type === 'email') {
      setSelectedEmail(value);
      setSelectedPhone(null);
    } else if (type === 'phone') {
      setSelectedPhone(value);
      setSelectedEmail(null);
    }
  }


  if (session?.user && session.user.emails && session.user.emails.length > 0) {
    return (
      <>
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Typography variant='body1'>
          To sign in we will send you a verification code which you will need to enter in.
        </Typography>
        <Typography variant='body1' sx={{mb:4}}>
          Please select the email or phone number you would like your verification code to be sent to:
        </Typography>
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', mb:2}}>
          <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3, mb: 5, width: '20%'}}>
            <Typography variant='h6' sx={{mb:1}}>
              Email
            </Typography>
            <FormControl>
              <RadioGroup
                key={'mfa-email-select'}
                value={selectedEmail}
                onChange={(e) => changeMfaSelection({type: 'email', value: e.target.value})}
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
          <Divider orientation='vertical' flexItem sx={{mx: 4}} />
          <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3, mb: 5, width: '20%'}}>
            <Typography variant='h6' sx={{mb:1}}>
              SMS
            </Typography>
            <FormControl>
              <RadioGroup
                key={'mfa-phone-select'}
                value={selectedPhone}
                onChange={(e) => changeMfaSelection({type: 'phone', value: e.target.value})}
              >
                {session.user.phones.map((phone) => (
                  <FormControlLabel
                    key={phone.id}
                    value={phone.id}
                    control={<Radio />}
                    label={phone.masked}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
       
        <Button 
          variant='contained' 
          sx={{mt: 5}}
          disabled={loading || (!selectedEmail && !selectedPhone)}
          onClick={() => {
            handleSendCode();
          }}
        >
          {loading ? 'Sending Code' : 'Send Code'}
        </Button>
      </>
    );
  }
}