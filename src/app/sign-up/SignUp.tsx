'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link'

import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react'

import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from '@mui/material';

interface Props {}

export default function SignUp({}: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Page State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [FirstName, setFirstName] = useState('Oliver');
  const [LastName, setLastName] = useState('Mellon');
  const [Email, setEmail] = useState('test@test.com');

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
        router.push('/clearance/new?existing=false');
        router.refresh()
      }
    } catch (err) {
      console.error('Sign up error:', err)
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  console.log('session:', session);

  return (
    <>
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%'}}>
        <Typography variant='body1' sx={{mb:2, width: '95%', textAlign: 'center'}}>
          To complete our induction and receive your CEDoW Token please start by entering your details below.
        </Typography>
        <Typography variant='body1' sx={{mb:4, width: '95%', textAlign: 'center'}}>
          If you have already been issued a CEDoW Token please <NextLink href='/sign-in'>sign in</NextLink> instead.
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
            id='textfield-firstName' 
            label='First Name' 
            variant='outlined'
            size='small'
            sx={{width: '400px'}}
            value={FirstName}
            onChange={(e) => {setFirstName(e.target.value)}}
          />
          <TextField 
            id='textfield-lastName' 
            label='Last Name' 
            variant='outlined' 
            size='small'
            sx={{width: '400px'}}
            value={LastName}
            onChange={(e) => {setLastName(e.target.value)}}
          />
          <TextField 
            id='textfield-email' 
            label='Email' 
            variant='outlined' 
            size='small'
            sx={{width: '400px'}}
            value={Email}
            onChange={(e) => {setEmail(e.target.value)}}
          />
        </Box>
        <Button 
          variant='contained' 
          sx={{mt: 2}}
          disabled={loading}
          onClick={handleSubmit}
        >
          Go
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