'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link'

import { useSession } from 'next-auth/react'

import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import {
  Person as SignInIcon,
  PersonAdd as PersonAddOutlinedIcon
} from '@mui/icons-material';

import {
  useStore,
} from '@/lib/providers/storeProvider'

import { useTestSettings } from '@/lib/providers/testSettingsProvider';

// Width of the content column inside each card. The heading, description,
// alert, text fields and button all use it, so the gap either side of the
// field box is identical to the gap above and below it.
const CONTENT_WIDTH = 400;

interface Props {}

export default function SignIn({}: Props) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { settings: { prefillMfa, displayMfa } } = useTestSettings();

  const {
    signInDetails,
    setSignInDetails,
    setTestMfa,
  } = useStore((store) => store);
  
  // Page State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Email, setEmail] = useState('');

  // DEV ONLY: Prefill form with test data
  useEffect(() => {
    setSignInDetails({
      CedowToken: 'DOW2AA5A2',
      LastName: 'Test',
    });
  }, [process.env.NODE_ENV === 'development']);

  // User is signed in, redirect to home
  // useEffect(() => {
  //   if(session?.user && session.user.mfaVerified) {
  //     router.push('/');
  //     router.refresh();
  //   }
  // }, [session, router]);

  if (!session) {
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

        <Box 
          sx={{
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            alignContent: 'center', 
            justifyContent: 'center', 
            width: '100%'
          }}
        >
          {/* <Typography variant='h4' sx={{textAlign: 'center', mb: 2}}>
            Welcome to {process.env.NEXT_PUBLIC_APPLICATION_NAME}
          </Typography> */}

          <Box 
            sx={{
              display: 'flex', 
              // Two 600px cards need ~1200px to sit side by side, so they stack
              // below md and only form a row on desktop.
              flexDirection: {xs: 'column', md: 'row'}, 
              alignItems: 'stretch', 
              alignContent: 'center',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            <Paper
              elevation={1}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: 600,
                mx: 'auto',
                bgcolor: 'background.paper',
                p: {xs: 3, sm: 5},
              }}
            >
              {/* <Paper
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
                <SignInIcon fontSize='large' />
              </Paper> */}

              <Typography variant='h5' sx={{textAlign: 'center', mb: 2}}>
                Sign In
              </Typography>
              <Typography variant='body1' color='text.secondary' sx={{textAlign: 'center', mb: 3}}>
                If you have previously completed the induction and have a CEDoW Token, please enter your details below to view and update your clearances.
              </Typography>

              {error && (
                <Alert
                  severity='error'
                  variant='filled'
                  sx={{display: 'flex', justifyContent: 'center', mb: 3, width: '100%', maxWidth: CONTENT_WIDTH}}
                >
                  {error}
                </Alert>
              )}

              <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: CONTENT_WIDTH, mb: 4}}>
                <TextField
                  id='textfield-token'
                  label='CEDoW Token'
                  variant='outlined'
                  sx={{width: '100%'}}
                  value={signInDetails?.CedowToken || ''}
                  onChange={(e) => {
                    setSignInDetails({
                      CedowToken: e.target.value,
                      LastName: signInDetails?.LastName ?? null
                    })
                  }}
                />
                <TextField
                  id='textfield-lastName'
                  label='Last Name'
                  variant='outlined'
                  sx={{width: '100%'}}
                  value={signInDetails?.LastName || ''}
                  onChange={(e) => {
                    setSignInDetails({
                      CedowToken: signInDetails?.CedowToken || '',
                      LastName: e.target.value
                    })
                  }}
                />
              </Box>

              <Button
                variant='contained'
                size='large'
                sx={{width: '100%', maxWidth: CONTENT_WIDTH, mt: 'auto'}}
                disabled={loading}
                onClick={() =>{}}
              >
                {loading ? 'Signing in...' : 'Go'}
              </Button>
            </Paper>
            <Divider orientation="vertical" variant="middle" flexItem sx={{mx: 3, display: {xs: 'none', md: 'block'}}}/>
            <Divider sx={{display: {xs: 'flex', md: 'none'}}}>
              <Typography variant='h6' color='text.secondary' sx={{textAlign: 'center', px: 2, my:3}}>
                OR
              </Typography>
            </Divider>
            <Paper
              elevation={1}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: 600,
                mx: 'auto',
                bgcolor: 'background.paper',
                p: {xs: 3, sm: 5},
              }}
            >
              {/* <Paper
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
                <PersonAddOutlinedIcon fontSize='large' />
              </Paper> */}

              <Typography variant='h5' sx={{textAlign: 'center', mb: 2}}>
                Sign Up (Induction)
              </Typography>
              <Typography variant='body1' color='text.secondary' sx={{textAlign: 'center', mb: 3}}>
                If you have not completed the induction and require a CEDoW Token please fill out your details below.
              </Typography>

              {error && (
                <Alert
                  severity='error'
                  variant='filled'
                  sx={{display: 'flex', justifyContent: 'center', mb: 3, width: '100%', maxWidth: CONTENT_WIDTH}}
                >
                  {error}
                </Alert>
              )}

              <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: CONTENT_WIDTH, mb: 4}}>
                <TextField
                  id='textfield-firstName'
                  label='First Name'
                  variant='outlined'
                  sx={{width: '100%'}}
                  value={FirstName}
                  onChange={(e) => {setFirstName(e.target.value)}}
                />
                <TextField
                  id='textfield-lastName'
                  label='Last Name'
                  variant='outlined'
                  sx={{width: '100%'}}
                  value={LastName}
                  onChange={(e) => {setLastName(e.target.value)}}
                />
                <TextField
                  id='textfield-email'
                  label='Email'
                  variant='outlined'
                  sx={{width: '100%'}}
                  value={Email}
                  onChange={(e) => {setEmail(e.target.value)}}
                />
              </Box>

              <Button
                variant='contained'
                size='large'
                sx={{width: '100%', maxWidth: CONTENT_WIDTH, mt: 'auto'}}
                disabled={loading}
                onClick={() => {}}
              >
                {loading ? 'Signing up...' : 'Go'}
              </Button>
            </Paper>
          </Box>
          <Box sx={{mt: 6}}>
            <NextLink href='/recovery' style={{textDecoration: 'none'}}>
              Forgot your CEDoW Token?
            </NextLink>
          </Box>
          <Box sx={{mt: 2}}>
            <NextLink href='/info' style={{textDecoration: 'none'}}>
              Need help or more information?
            </NextLink>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <>
    </>
  );
}