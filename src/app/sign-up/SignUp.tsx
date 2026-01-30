'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link'

import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from '@mui/material';

// Store
import {
  useStore,
} from '@/lib/providers/storeProvider'

// API
import postEntityExists from '@/lib/api/requests/postEntityExists';

interface Props {}

export default function SignUp({}: Props) {
  const router = useRouter();

  const {
    signUpDetails,
    setSignUpDetails,
  } = useStore((store) => store);

  // Page State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [FirstName, setFirstName] = useState('Oliver');
  const [LastName, setLastName] = useState('Mellon');
  const [Email, setEmail] = useState('test@test.com');

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await postEntityExists({
        FirstName,
        LastName,
        Email,
      });
      
      if(result && result.exists === false) {
        console.log('Result from postEntityExists:', result);
        setSignUpDetails({
          FirstName,
          LastName,
          Email,
        })
        router.push('/clearance/new');
      } else if (result) {
        if (result.exists) {
          throw new Error('We have found an existing record with the details provided. Please sign in instead.');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
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
          onClick={handleCheck}
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