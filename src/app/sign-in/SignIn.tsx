'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link'

import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react'

import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';

import {
  useStore,
} from '@/lib/providers/storeProvider'

// Components
import { 
  MfaCodeInput, 
  EmailSelect 
} from './Mfa';

interface Props {}

export default function SignIn({}: Props) {
  const { data: session, update } = useSession();
  const router = useRouter();

  const {
    signInDetails,
    setSignInDetails,
  } = useStore((store) => store);
  
  // Page State
  const mfaCodeValid = 123456; // Placeholder for demo purposes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);

  const [mfaStep, setMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

  // User is signed in, redirect to home
  useEffect(() => {
    if(session?.user && session.user.mfaVerified) {
      router.push('/');
      router.refresh();
    }
  }, [session, router]);
  
  console.log('SignIn session user:', session?.user);
  // console.log('selectedEmail:', selectedEmail);

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
        setError('Invalid credentials');
        setLoading(false);
      } else if (result?.ok) {
        setLoading(false);
        return;
      }

      return new Error('Unexpected sign-in result');
    } catch (err) {
      console.error('Sign in error:', err);
      setError('[SignIn] An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const handleSendMfaEmail = async () => {
    if (selectedEmail === null) {
      setError('Please select an email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const email = session?.user?.emails?.find(e => e.id === selectedEmail);
      if (!email) {
        setError('Invalid email selection');
        setLoading(false);
        return;
      }

      const response = await fetch('/vms/portal/api/auth/mfa/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          EmailId: selectedEmail
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send MFA code');
      }

      // Move to MFA verification step
      setMfaStep(true);
      setError(null);
    } catch (err) {
      console.error('Email selection error:', err);
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
    try {
      const result = await signIn('mfa-sign-in', {
        CedowToken: signInDetails?.CedowToken || '',
        LastName: signInDetails?.LastName || '',
        EmailId: selectedEmail,
        MfaCode: mfaCode,
        redirect: false,
      });

      if (result?.ok) {
        setLoading(false);
        return {ok: true};
      }

      return new Error('Unexpected sign-in result');
    } catch (err) {
      console.error('Sign in error:', err);
      return {ok: false};
    } finally {
      setLoading(false);
    }
    
  }

  // const handleBack = () => {
  //   if (mfaStep) {
  //     // Go back to email selection or credentials
  //     setMfaStep(false);
  //     setMfaCode('');
  //   } else if (emailSelectionStep) {
  //     // Go back to credentials
  //     setEmailSelectionStep(false);
  //     setSelectedEmail(null);
  //     setAvailableEmails([]);
  //   }
  //   setError(null);
  // }

  if (!session) {
    return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%'}}>
        <Typography variant='body1' sx={{mb:2}}>
          To view and manage your clearances please enter your details below.
        </Typography>
        <Typography variant='body1' sx={{mb:4}}>
          If you don't have a CEDoW Token and need one please <NextLink href='/sign-up'>sign up</NextLink>.
        </Typography>
        { 
          error && (
            <Typography variant='body1' sx={{mb:4, color: 'red'}}>
              {error}
            </Typography>
          )
        }
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
          <TextField 
            id='textfield-token' 
            label='Cedow Token' 
            variant='outlined' 
            size='small'
            sx={{width: '400px'}}
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
            size='small'
            sx={{width: '400px'}}
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
          sx={{mt: 2}}
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? 'Signing in...' : 'Go'}
        </Button>
      </Box>
    )
  }

  if (
    session.user && 
    session.user.mfaVerified === false && 
    session.user.emails?.length > 1 && 
    mfaStep === false
  ) {
    return (
      <EmailSelect 
        selectedEmail={selectedEmail || ''}
        setSelectedEmail={setSelectedEmail}
        handleSendCode={handleSendMfaEmail}
      />
    );
  }

  if (
    session.user && 
    session.user.mfaVerified === false && 
    mfaStep === true) {
    const email = session.user.emails?.find(e => e.id === selectedEmail);
    return (
      <MfaCodeInput 
        maskedEmail={email?.masked || ''}
        handleVerifyMfa={handleVerifyMfa}
      />
    );
  }

  return (
    <>
      bork bork
    </>
  );
}