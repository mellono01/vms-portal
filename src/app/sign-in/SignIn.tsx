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

   // User only has 1 email address, auto select
  //  useEffect(() => {
  //   if (
  //     session?.user && 
  //     session.user.mfaVerified === false && 
  //     session.user.emails?.length === 1 &&
  //     selectedEmail === null
  //   ) {
  //     setSelectedEmail(session.user.emails[0].id);
  //   }

  //   if(
  //     session?.user && 
  //     session.user.mfaVerified === false && 
  //     session.user.emails?.length === 1 &&
  //     selectedEmail !== null
  //   ) {
  //     handleSendMfaEmail();
  //   }
  // }, [session, selectedEmail]);

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

    } catch (err) {
      console.error('Sign in error', err);
      setError('[SignIn] An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const handleSendMfaEmail = async () => {
    if (selectedEmail === null && selectedPhone === null) {
      console.warn('No mfa method selected for MFA code send');
      setError('Please select an email or phone number');
      return;
    }

    let mfaMethod = '';
    if (selectedEmail) mfaMethod = 'email';
    if (selectedPhone) mfaMethod = 'phone';

    console.log('Sending MFA code via', mfaMethod, { selectedEmail, selectedPhone });


    setLoading(true);
    setError('');

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
        setError('Invalid code, please try again.');
      }
    } catch (err) {
      console.error('Sign in error', err);
    } finally {
      setLoading(false);
    }
  }

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
    mfaStep === false
  ) {
    // if(session.user.emails?.length > 1) {
    //   return (
    //     <EmailSelect 
    //       loading={loading}
    //       selectedEmail={selectedEmail || ''}
    //       setSelectedEmail={setSelectedEmail}
    //       handleSendCode={handleSendMfaEmail}
    //     />
    //   );
    // }
    return (
        <SelectMfa 
          loading={loading}
          selectedEmail={selectedEmail || ''}
          selectedPhone={selectedPhone || ''}
          setSelectedPhone={setSelectedPhone}
          setSelectedEmail={setSelectedEmail}
          handleSendCode={handleSendMfaEmail}
        />
      );
  }

  if (
    session.user && 
    session.user.mfaVerified === false && 
    mfaStep === true
  ) {
    const email = session.user.emails?.find(e => e.id === selectedEmail);
    return (
      <MfaCodeInput 
        loading={loading}
        error={error}
        maskedEmail={email?.masked || ''}
        handleVerifyMfa={handleVerifyMfa}
      />
    );
  }

  return (
    <>
    </>
  );
}