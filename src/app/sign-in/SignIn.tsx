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

interface Props {}

export default function SignIn({}: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    signInDetails,
    setSignInDetails,
    setUserData,
  } = useStore((store) => store);
  
  // Page State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User is signed in, redirect to home
  useEffect(() => {
    if(session?.user) {
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
        Surname: signInDetails?.LastName || '',
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials')
      } else if (result?.ok) {
        console.log('Redirecting...') // Debug log
        router.push('/') // or wherever you want to redirect
        router.refresh();
      }
    } catch (err) {
      console.error('Sign in error:', err) // Debug log
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!session?.user) {
    return (
      <>
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
        </Box>
      </>
    );
  }
  
}