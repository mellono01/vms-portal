import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from '@mui/material';

import Faq from '@/app/faq/Faq';

interface Props {}

export default function SignInPage({}: Props) {

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
      <Typography variant="h4" sx={{mt:4, mb:4}}>
        Frequently Asked Questions (FAQ)
      </Typography>
      <Faq/>
    </Box>
  );
}