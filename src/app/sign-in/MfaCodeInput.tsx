'use client';

import { useEffect, useState } from 'react';

import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import {
  MarkEmailReadOutlined,
  Refresh,
} from '@mui/icons-material';

import { useStore } from '@/lib/providers/storeProvider';
import { useTestSettings } from '@/lib/providers/testSettingsProvider';
import { isTestEnvironment } from '@/lib/testSettings/testSettings';

const getSecondsLeft = (expiresAt: string | null) => {
  if (!expiresAt) return 600;
  return Math.max(Math.round((new Date(expiresAt).getTime() - Date.now()) / 1000), 0);
};

export default function MfaCodeInput({
  loading,
  error,
  mfaMethod,
  handleVerifyMfa,
  resendMfaCode,
  expiresAt,
}: {
  loading: boolean;
  error: string | null;
  mfaMethod: string;
  handleVerifyMfa: ({ mfaCode }: { mfaCode: string }) => void;
  resendMfaCode: () => void;
  expiresAt: string | null;
}) {
  const {
    testMfa,
  } = useStore((store) => store);

  const { settings: { prefillMfa, displayMfa } } = useTestSettings();

  const [mfaCode, setMfaCode] = useState(['', '', '', '', '', '']);
  const [secondsLeft, setSecondsLeft] = useState(() => getSecondsLeft(expiresAt));
  const [buttonText, setButtonText] = useState('Verify');

  useEffect(() => {
    if(isTestEnvironment() && prefillMfa && !!testMfa) {
      setMfaCode(testMfa.split(''));
    }
  }, [testMfa, prefillMfa]);

  useEffect(() => {
    setSecondsLeft(getSecondsLeft(expiresAt));

    const interval = setInterval(() => {
      setSecondsLeft(getSecondsLeft(expiresAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const isExpired = secondsLeft <= 0;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeLabel = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  useEffect(() => {
    if(mfaCode.join('').length !== 6) {
      setButtonText('Enter Code');
    }
    if(mfaCode.join('').length === 6) {
      setButtonText('Verify');
    }
    if(loading) {
      setButtonText('Verifying');
    }
  }, [mfaCode, loading]);

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

      {
        isTestEnvironment() && !!testMfa && displayMfa && (
          <Alert sx={{mb:5, display: 'flex', alignItems: 'center', justifyContent: 'center'}} severity="info">
            <Typography variant='body2'>
                [TEST ONLY] MFA code: <Typography component="span" variant='body2' sx={{ fontWeight: 'bold' }}>{testMfa}</Typography>
              </Typography>
          </Alert>
        )
      }

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
          <MarkEmailReadOutlined fontSize='large' />
        </Paper>

        <Typography variant='h5' sx={{textAlign: 'center', mb: 2}}>
          Enter your verification code
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{textAlign: 'center', mb: 1}}>
          Enter the 6-digit code to <strong>{mfaMethod}</strong> to complete sign in. 
        </Typography>

        <Typography
          variant='body2'
          sx={{textAlign: 'center', mb: 4}}
          color={isExpired ? 'error' : 'text.secondary'}
        >
          {isExpired ? 'Your code has expired. Please request a new one.' : `Code expires in ${timeLabel}`}
        </Typography>

        {error && (
          <Alert 
            severity='error' 
            variant='filled'
            sx={{display: 'flex', justifyContent: 'center', mb: 4, width: '100%'}}
          >
            {error}
          </Alert>
        )}

        <Box 
          sx={{
            display: 'flex', 
            gap: 1, 
            justifyContent: 'center', 
            width: '100%', 
            maxWidth: 352,
            mb: 5
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <TextField
              key={index}
              id={`mfa-input-${index}`}
              variant='outlined'
              value={mfaCode[index]}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={isExpired}
              inputProps={{
                maxLength: 1,
                inputMode: 'numeric',
                style: { textAlign: 'center', fontSize: '1.75rem', padding: '14px 0' }
              }}
              sx={{
                width: '52px',
                flexShrink: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
                '& input': {
                  textAlign: 'center',
                }
              }}
              autoFocus={index === 0}
            />
          ))}
        </Box>

        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, width: '100%', maxWidth: 352}}>
          <Button
            variant='contained'
            size='large'
            sx={{textTransform: 'none', width: '100%', maxWidth: 352}}
            disabled={loading || isExpired || mfaCode.join('').length !== 6}
            onClick={() => {
              const fullCode = mfaCode.join('');
              handleVerifyMfa({ mfaCode: fullCode });
            }}
          >
            {buttonText}
          </Button>
          <Tooltip 
            title={'Resend Code'} 
            placement="top" 
            slotProps={{ tooltip: { sx: { fontSize: '14px' } } }}
          >
            <Button
              variant='outlined'
              disabled={loading || !isExpired}
              onClick={() => {
                resendMfaCode();
              }}
            >
              <Refresh />
            </Button>
          </Tooltip>
        </Box>
      </Paper>
    </Box>
  )
}