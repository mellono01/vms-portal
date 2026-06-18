import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'

import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from '@mui/material';

import SignUp from '@/app/sign-up/SignUp';

interface Props {}

export default async function SignUpPage({}: Props) {
  const session = await getServerSession(authOptions)

  // Redirect if already authenticated
  if (session) {
    redirect('/')
  }
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
      <Typography variant="h4" sx={{mt:4, mb:4}}>
        Sign Up
      </Typography>
      <SignUp/>
    </Box>
  );
}