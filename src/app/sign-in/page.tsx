import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from '@mui/material';

import SignIn from '@/app/sign-in/SignIn';

interface Props {}

export default function SignInPage({}: Props) {

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
      <Typography variant="h4" sx={{mt:4, mb:4}}>
        Sign In
      </Typography>
      <SignIn/>
    </Box>
  );
}