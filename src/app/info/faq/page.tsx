'use client';

import { useRouter } from 'next/navigation';

import {
  Box,
  Typography,
} from '@mui/material';

// Components
import Faq from './Faq';

interface Props {}

const pageTitle = 'Frequently Asked Questions (FAQs)';

export default function InfoPage({}: Props) {
  const router = useRouter();
  console.log('window.history', window.history);
  console.log('Referrer:', document.referrer);
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Typography variant="h4" sx={{mt:4, mb:4}}>
        {pageTitle}
      </Typography>
      <Faq />
    </Box>
  )
}



