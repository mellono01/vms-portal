'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link'

import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react'

import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import {
  Person as SignInIcon
} from '@mui/icons-material';

import {
  useStore,
} from '@/lib/providers/storeProvider'

// Components
import SelectMfa from './SelectMfa';
import MfaCodeInput from './MfaCodeInput';

interface Props {}

export default function SignIn({}: Props) {
  const { data: session, update } = useSession();
  const router = useRouter();

  const {
    signInDetails,
    setSignInDetails,
  } = useStore((store) => store);
  
  // Page State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);

  const [mfaStep, setMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaExpiresAt, setMfaExpiresAt] = useState<string | null>(null);

  // DEV ONLY: Prefill form with test data
  useEffect(() => {
    setSignInDetails({
      CedowToken: 'DOW2AA5A2',
      LastName: 'Test',
    });
  }, [process.env.NODE_ENV === 'development']);

  // User is signed in, redirect to home
  useEffect(() => {
    if(session?.user && session.user.mfaVerified) {
      router.push('/');
      router.refresh();
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('sign-in', {
        CedowToken: signInDetails?.CedowToken || '',
        LastName: signInDetails?.LastName || '',
        redirect: false,
      });

      if (result?.error) {
        setError('Details invalid or do not exist');
        setLoading(false);
      } else if (result?.ok) {
        setLoading(false);
        return;
      }

    } catch (err) {
      console.error('Sign in error', err);
      setError('[SignIn] An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const handleSendMfaCode = async () => {
    setLoading(true);
    setError('');

    if (selectedEmail === null && selectedPhone === null) {
      console.warn('No mfa method selected for MFA code send');
      setError('Please select an email or phone number');
      return;
    }

    if(mfaExpiresAt && new Date(mfaExpiresAt) > new Date()) {
      console.warn('MFA code already sent and not expired yet', { mfaExpiresAt });
      setError('A code has already been sent. Please wait before requesting a new one.');
      return;
    }

    let mfaMethod = '';
    if (selectedEmail) mfaMethod = 'email';
    if (selectedPhone) mfaMethod = 'phone';

    console.log('Sending MFA code via', mfaMethod, { selectedEmail, selectedPhone });

    try {
      const email = session?.user?.emails?.find(e => e.id === selectedEmail);
      const phone = session?.user?.phones?.find(p => p.id === selectedPhone);

      if (!email && !phone) {
        console.warn('Selected MFA method not found in user data');
        setError('Invalid selection');
        setLoading(false);
        return;
      }

      const response = await fetch('/vms/portal/api/auth/mfa/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          EmailId: selectedEmail,
          PhoneId: selectedPhone
        })
      });

      if (!response.ok) {
        console.error('Failed to send MFA code, response not ok', response);
        throw new Error('Failed to send MFA code');
      }

      const data = await response.json();
      console.log('MFA code sent successfully', data);

      setMfaExpiresAt(data?.expiresAt ?? null);

      // Move to MFA verification step
      setMfaStep(true);
      setError(null);
    } catch (err) {
      console.error('Email selection error', err);
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const handleVerifyMfa = async ({
    mfaCode
  }: {
    mfaCode: string;
  }) => {
    setLoading(true);
    setError('');

    try {
      const result = await signIn('mfa-sign-in', {
        CedowToken: signInDetails?.CedowToken || '',
        LastName: signInDetails?.LastName || '',
        EmailId: selectedEmail,
        PhoneId: selectedPhone,
        MfaCode: mfaCode,
        redirect: false,
      });

      if (result?.ok) {
        console.log('MFA verification successful, user signed in.');
        setError(null);
        setLoading(false);
      } else {
        setError('The code entered is incorrect. Please try again.');
      }
    } catch (err) {
      console.error('Sign in error', err);
    } finally {
      setLoading(false);
    }
  }

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
            <SignInIcon fontSize='large' />
          </Paper>

          <Typography variant='h4' sx={{textAlign: 'center', mb: 2}}>
            Sign In
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{textAlign: 'center', mb: 1}}>
            To view and manage your clearances please enter your details below.
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{textAlign: 'center', mb: 3}}>
            If you don't have a CEDoW Token and need one please <NextLink href='/sign-up'>sign up</NextLink>.
          </Typography>

          {error && (
            <Alert
              severity='error'
              variant='filled'
              sx={{display: 'flex', justifyContent: 'center', mb: 3, width: '100%', maxWidth: 400}}
            >
              {error}
            </Alert>
          )}

          <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 400, mb: 4}}>
            <TextField
              id='textfield-token'
              label='Cedow Token'
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
            sx={{width: '100%', maxWidth: 352}}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? 'Signing in...' : 'Go'}
          </Button>


          <Box sx={{mt:5}}>
            <NextLink 
              href='/recovery'
              style={{textDecoration: 'none'}}
  >
              Forgot your Cedow Token?
            </NextLink>
          </Box>
          <Box sx={{mt:2}}>
            <NextLink 
              href='/info' 
              style={{ textDecoration: 'none' }}
            > 
              Need help or more information?
            </NextLink>
          </Box>
        </Paper>
      </Box>
    )
  }

  if (
    session.user && 
    session.user.mfaVerified === false && 
    mfaStep === false
  ) {
    return (
        <SelectMfa 
          loading={loading}
          selectedEmail={selectedEmail || ''}
          selectedPhone={selectedPhone || ''}
          setSelectedPhone={setSelectedPhone}
          setSelectedEmail={setSelectedEmail}
          handleSendCode={handleSendMfaCode}
        />
      );
  }

  if (
    session.user && 
    session.user.mfaVerified === false && 
    mfaStep === true
  ) {
    const user = session.user;
    let mfaMethod = '';
    if(selectedEmail && user.emails) mfaMethod = user.emails.find(e => e.id === selectedEmail)?.masked ?? '';
    if(selectedPhone && user.phones) mfaMethod = user.phones.find(p => p.id === selectedPhone)?.masked ?? '';
    return (
      <MfaCodeInput 
        loading={loading}
        error={error}
        mfaMethod={mfaMethod}
        handleVerifyMfa={handleVerifyMfa}
        resendMfaCode={handleSendMfaCode}
        expiresAt={mfaExpiresAt}
      />
    );
  }

  return (
    <>
    </>
  );
}