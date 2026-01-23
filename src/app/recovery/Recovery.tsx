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

export default function Recovery({}: Props) {

  return (
    <>
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%'}}>
        <Typography variant='body1' sx={{mb:2}}>
          Please enter your details below to begin the process of recovering your CEDoW Token.
        </Typography>
        <Typography variant='body1' sx={{mb:4, width: '95%', textAlign: 'center'}}>
          Your CEDoW Token was sent to the email address provided during sign up. If you cannot find this email please check your junk or spam folder.
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