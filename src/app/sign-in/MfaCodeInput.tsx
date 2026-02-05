'use client';

import { useState } from 'react';

import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';

export default function MfaCodeInput({
  loading,
  error,
  maskedEmail,
  handleVerifyMfa
}: {
  loading: boolean;
  error: string | null;
  maskedEmail: string;
  handleVerifyMfa: ({ mfaCode }: { mfaCode: string }) => void;
}) {
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
          const fullCode = mfaCode.join('');
          handleVerifyMfa({ mfaCode: fullCode });
        }}
      >
        Verify
      </Button>
    </>
  )
}