'use client';

import { useState, useEffect } from 'react';
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
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';

interface Props {}

export default function SignUp({}: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Page State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Email, setEmail] = useState('');

  // DEV ONLY: Prefill form with test data
  useEffect(() => {
    setFirstName('Olivia');
    setLastName('Mellon');
    setEmail('test@test.com');
  }, [process.env.NODE_ENV === 'development']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Use the 'sign-up' provider
      const result = await signIn('sign-up', {
        Email,
        FirstName,
        LastName,
        redirect: false,
      })

      if (result?.error) {
        setError('User already exists or invalid details')
      } else if (result?.ok) {
        // User session created successfully
        router.push('/induction/new?existing=false');
        router.refresh()
      }
    } catch (err) {
      console.error('Sign up error', err);
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
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
          <PersonAddOutlinedIcon fontSize='large' />
        </Paper>

        <Typography variant='h4' sx={{textAlign: 'center', mb: 2}}>
          Sign Up
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{textAlign: 'center', mb: 1}}>
          To complete our induction and receive your CEDoW Token please start by entering your details below.
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{textAlign: 'center', mb: 3}}>
          If you have already been issued a CEDoW Token please <NextLink href='/sign-in'>sign in</NextLink> instead.
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
          sx={{width: '100%', maxWidth: 352}}
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? 'Signing up...' : 'Go'}
        </Button>

        <Box sx={{mt: 4}}>
          <NextLink href='/recovery' style={{textDecoration: 'none'}}>
            Forgot your Cedow Token?
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