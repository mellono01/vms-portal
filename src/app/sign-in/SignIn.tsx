'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link'

import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';

import {
  useStore,
} from '@/lib/providers/storeProvider'

// API
import getEntityForms from '@/lib/api/requests/getEntityForms';

interface Props {}

export default function SignIn({}: Props) {
  const router = useRouter();

  const {
    signInDetails,
    setSignInDetails,
    setUserData,
  } = useStore((store) => store);
  
  // Page State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [CedowToken, setCedowToken] = useState('DOW7410DE');
  const [LastName, setLastName] = useState('ABBASI');

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getEntityForms({
        CedowToken,
        LastName,
      });
      
      if(result.length > 0) {
        setUserData(result[0]);
        setSignInDetails({
          CedowToken,
          LastName,
        });
        router.push('/');
      } else {
        if (result.length === 0) {
          throw new Error('The details entered do not match our records. Please try again or select "Forgot your Cedow Token?".');
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
          onClick={()=>{handleCheck()}}
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