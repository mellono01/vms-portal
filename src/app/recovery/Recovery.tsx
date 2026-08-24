'use client';

import { useState } from 'react';
import NextLink from 'next/link'

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
  FindInPageOutlined,
  Error,
  CheckCircle,
} from '@mui/icons-material';

interface Props {}

const ResultMessage = ({
  success,
  message
}: {
  success: boolean;
  message: string
}) => {
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
        {
          success 
          ? <CheckCircle sx={{fontSize: '60px', color: 'success.main'}} />
          : <Error sx={{fontSize: '60px', color: 'warning.main'}} />
        }

        <Typography variant='h4' sx={{textAlign: 'center', mt: 2, mb: 2}}>
          Recover Your Token
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{textAlign: 'center', mb: 4, maxWidth: 420}}>
          {message}
        </Typography>

        <Button
          component={NextLink}
          href='/sign-in'
          variant='contained'
          size='large'
          sx={{width: '100%', maxWidth: 352}}
        >
          Back to Sign In
        </Button>
      </Paper>
    </Box>
  )
}

export default function Recovery({}: Props) {

  const [firstName, setFirstName] = useState('oliver');
  const [lastName, setLastName] = useState('mellon');
  const [email, setEmail] = useState('test@test.com');
  // const [firstName, setFirstName] = useState('');
  // const [lastName, setLastName] = useState('');
  // const [email, setEmail] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitResponse, setSubmitResponse] = useState<{success: boolean, message: string} | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null); // If there was an error with the API request

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';

    if (!email.trim()) {
    } else {
      if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitted(false);
    if (!validate()) return;

    setLoading(true);
    setSubmitResponse(null);

    try {
      await fetch('/vms/portal/api/auth/recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FirstName: firstName,
          LastName: lastName,
          Email: email,
        }),
      })
      .then((res) => {
        setLoading(false);
        console.log('Recovery request response', res);

        res.json().then((data) => {
          if(data.success === true) {
            setSubmitted(true);
            setSubmitResponse({success: true, message: data.message});
          }
          if(data.success === false && !data.error) {
            setSubmitted(true);
            setSubmitResponse({success: false, message: data.message});
          }
          if(data.error) {
            setSubmitError(data.message || 'An unknown error occurred while processing your recovery request. Please try again later.');
          }
        });
      });

    } catch (err) {
      setSubmitError('An error occurred while processing your recovery request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return <ResultMessage success={submitResponse?.success ?? true} message={submitResponse?.message ?? ''} />;
  }

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
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        
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
          <FindInPageOutlined fontSize='large' />
        </Paper>

        <Typography variant='h4' sx={{textAlign: 'center', mb: 2}}>
          Recover Your Token
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{textAlign: 'center', mb: 2}}>
          Your CEDoW Token was sent to the email address provided during sign up. Please check if it was sent to your junk or spam folder.
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{textAlign: 'center', mb: 4}}>
          If you cannot find your CEDoW Token, please enter your details below to begin the recovery process.
        </Typography>

        {
          submitError && (
            <Alert severity="error" sx={{display: 'flex', alignItems: 'center', mb: 2, width: '100%'}}>
              {submitError}
            </Alert>
          )
        }

        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, width: '100%', maxWidth: 400, mb: 4}}>
          <TextField
            required
            id='textfield-firstName'
            label='First Name'
            variant='outlined'
            sx={{width: '100%'}}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            required
            id='textfield-lastName'
            label='Last Name'
            variant='outlined'
            sx={{width: '100%'}}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <TextField
            required
            id='textfield-email'
            label='Email Address'
            variant='outlined'
            sx={{width: '100%'}}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Box>

        <Button
          variant='contained'
          size='large'
          sx={{width: '100%', maxWidth: 352}}
          onClick={handleSubmit}
          disabled={
            loading ||
            !firstName.trim() ||
            !lastName.trim() ||
            !email.trim() ||
            !!errors.firstName ||
            !!errors.lastName ||
            !!errors.email
          }
        >
          {loading ? 'Submitting...' : 'Go'}
        </Button>
        <Box sx={{mt: 4}}>
          <NextLink href='/sign-in' style={{textDecoration: 'none'}}>
            Already know your CEDoW Token?
          </NextLink>
        </Box>
        <Box sx={{mt: 2}}>
          <NextLink href='/sign-up' style={{textDecoration: 'none'}}>
            Don't have a CEDoW Token?
          </NextLink>
        </Box>
        <Box sx={{mt: 2}}>
          <NextLink href='/info' style={{textDecoration: 'none'}}>
            Need help or more information?
          </NextLink>
        </Box>
      </Paper>
    </Box>
  );
}