'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'

import {
  Box,
  Button,
  Typography,
  Backdrop,
  CircularProgress,
  Paper,
  Stack,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';

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

  const [buttonText, setButtonText] = useState('Send Code');

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

  useEffect(() => {
    if(!selectedEmail && !selectedPhone) {
      setButtonText('Choose an option');
    }
    if(!!selectedEmail || !!selectedPhone) {
      setButtonText('Send Code');
    }
    if(loading) {
      setButtonText('Sending Code');
    }
  }, [selectedEmail, selectedPhone, loading]);


  if (session?.user && session.user.emails && session.user.emails.length > 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          px: {xs: 2, sm: 5},
          py: {xs: 2, sm: 5},
        }}
      >
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <Paper
          elevation={1}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 600,
            bgcolor: 'background.paper',
            p: {xs: 3, sm: 5},
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              mb: 2,
            }}
          >
            <ShieldOutlinedIcon fontSize='large' />
          </Paper>

          <Typography variant='h5' sx={{textAlign: 'center', mb: 2}}>
            Verify it's you
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{textAlign: 'center', mb: 3}}>
            To sign in we will send you a verification code, valid for 10 minutes. Please select where you would like it sent:
          </Typography>

          <Stack spacing={2} sx={{width: '100%', maxWidth: 420, mb: 5}}>
            {session.user.emails.length > 0 && (
              <Box>
                <Typography variant='subtitle2' color='text.secondary' sx={{mb: 1, display: 'flex', alignItems: 'center', gap: 0.5}}>
                  <EmailOutlinedIcon fontSize='small' /> Email
                </Typography>
                <Stack spacing={1}>
                  {session.user.emails.map((email) => (
                    <Paper
                      key={email.id}
                      variant='outlined'
                      onClick={() => changeMfaSelection({type: 'email', value: email.id})}
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        cursor: 'pointer',
                        borderColor: selectedEmail === email.id ? 'primary.main' : 'divider',
                        borderWidth: selectedEmail === email.id ? 2 : 1,
                        bgcolor: selectedEmail === email.id ? 'action.selected' : 'background.paper',
                      }}
                    >
                      <Typography>{email.masked}</Typography>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}

            {session.user.phones.length > 0 && (
              <Box>
                <Typography variant='subtitle2' color='text.secondary' sx={{mb: 1, display: 'flex', alignItems: 'center', gap: 0.5}}>
                  <SmsOutlinedIcon fontSize='small' /> SMS
                </Typography>
                <Stack spacing={1}>
                  {session.user.phones.map((phone) => (
                    <Paper
                      key={phone.id}
                      variant='outlined'
                      onClick={() => changeMfaSelection({type: 'phone', value: phone.id})}
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        cursor: 'pointer',
                        borderColor: selectedPhone === phone.id ? 'primary.main' : 'divider',
                        borderWidth: selectedPhone === phone.id ? 2 : 1,
                        bgcolor: selectedPhone === phone.id ? 'action.selected' : 'background.paper',
                      }}
                    >
                      <Typography>{phone.masked}</Typography>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>

          <Button
            variant='contained'
            size='large'
            sx={{width: '100%', maxWidth: 352, mt: 1}}
            disabled={loading || (!selectedEmail && !selectedPhone)}
            onClick={() => {
              handleSendCode();
            }}
          >
            {buttonText}
          </Button>
        </Paper>
      </Box>
    );
  }
}