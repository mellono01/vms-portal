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

import Welcome from '@/app/welcome/Welcome';

interface Props {}

export default async function WelcomePage({}: Props) {
  const session = await getServerSession(authOptions)

  // Redirect if already authenticated
  if (session && session.user) {
    if(session.user.method === 'mfa-sign-in') redirect('/')
    if(session.user.method === 'sign-up') redirect('/induction/new')
  }

  return (
    <Box 
      sx={{
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        width: '100%'
      }}
    >
      {/* <Typography variant="h4" sx={{mt:4, mb:4}}>
        Sign In
      </Typography> */}
      <Welcome/>
    </Box>
  );
}