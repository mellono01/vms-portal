'use client';

import NextLink from 'next/link'

import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from '@mui/material';

interface Props {}

export default function SignUp({}: Props) {

  return (
    <>
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%'}}>
        <Typography variant='body1' sx={{mb:2, width: '95%', textAlign: 'center'}}>
          To complete our induction and receive your CEDoW Token please start by entering your details below.
        </Typography>
        <Typography variant='body1' sx={{mb:4, width: '95%', textAlign: 'center'}}>
          If you have already been issued a CEDoW Token please <NextLink href='/sign-in'>sign in</NextLink> instead.
        </Typography>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
          <TextField 
            id='textfield-firstName' 
            label='First Name' 
            variant='outlined'
            size='small'
            sx={{width: '400px'}}
          />
          <TextField 
            id='textfield-lastName' 
            label='Last Name' 
            variant='outlined' 
            size='small'
            sx={{width: '400px'}}
          />
          <TextField 
            id='textfield-email' 
            label='Email' 
            variant='outlined' 
            size='small'
            sx={{width: '400px'}}
          />
        </Box>
        <Button 
          variant='contained' 
          sx={{mt: 2}}
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