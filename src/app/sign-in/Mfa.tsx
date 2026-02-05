'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useSession } from 'next-auth/react'

import {
  Box,
  Button,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';

export function MfaCodeInput({
  maskedEmail,
  handleVerifyMfa
}: {
  maskedEmail: string;
  handleVerifyMfa: ({ mfaCode }: { mfaCode: string }) => {ok: boolean};
}) {
  // Page State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const mfaCodeValid = generateMFACode(); // Placeholder for demo purposes
  const [mfaCode, setMfaCode] = useState(['', '', '', '', '', '']);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;
    
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...mfaCode];
    newCode[index] = value;
    setMfaCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`mfa-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !mfaCode[index] && index > 0) {
      const prevInput = document.getElementById(`mfa-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...mfaCode];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newCode[i] = pastedData[i];
    }
    setMfaCode(newCode);
  };

  return (
    <>
      <Typography variant='body1' sx={{mb:2}}>
        A verification code has been sent to {maskedEmail}
      </Typography>
      <Typography variant='body1' sx={{mb:4}}>
        Please enter the 6-digit code to complete sign in.
      </Typography>
      { 
        error && (
          <Typography variant='body1' sx={{mb:4, color: 'red'}}>
            {error}
          </Typography>
        )
      }
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
        <Box sx={{display: 'flex', gap: 1, justifyContent: 'center'}}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <TextField
              key={index}
              id={`mfa-input-${index}`}
              variant='outlined'
              size='small'
              value={mfaCode[index]}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              inputProps={{
                maxLength: 1,
                style: { textAlign: 'center', fontSize: '1.5rem', padding: '12px' }
              }}
              sx={{
                width: '50px',
                '& input': {
                  textAlign: 'center',
                }
              }}
              autoFocus={index === 0}
            />
          ))}
        </Box>
      </Box>
      <Button 
        variant='contained' 
        sx={{mt: 5}}
        disabled={loading || mfaCode.join('').length !== 6}
        onClick={() => {
          console.log('Submitting code:', mfaCode.join(''));
          const fullCode = mfaCode.join('');
          // Your verify logic here using fullCode
          const result = handleVerifyMfa({ mfaCode: fullCode });
          if (result?.ok) {
            setError(null);
          } else {
            setError('The verification code entered is incorrect. Please try again.');
          }
        }}
      >
        Verify
      </Button>
    </>
  )
}

export function EmailSelect({
  selectedEmail,
  setSelectedEmail,
  handleSendCode
}: {
  selectedEmail: number | null;
  setSelectedEmail: (email: number) => void;
  handleSendCode: () => void;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Page State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User is signed in, redirect to home
  useEffect(() => {
    if(session?.user) {
      // router.push('/');
      // router.refresh();
    }
  }, [session, router]);
  
  console.log('SignIn session user:', session?.user);

  if (session?.user) {
    return (
      <>
        <Typography variant='body1' sx={{mb:2}}>
          To sign in we will send you a verification code which you will need to enter in.
        </Typography>
        <Typography variant='body1' sx={{mb:4}}>
          Please select where you would like to receive your verification code.
        </Typography>
        { 
          error && (
            <Typography variant='body1' sx={{mb:4, color: 'red'}}>
              {error}
            </Typography>
          )
        }
        <Box>
          <FormControl>
            <RadioGroup
              key={'mfa-email-select'}
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(Number(e.target.value))}
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
          disabled={loading || selectedEmail === null}
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