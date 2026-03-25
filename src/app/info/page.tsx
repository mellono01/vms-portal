'use client';

import { useRouter } from 'next/navigation';
import NextLink from 'next/link'

import {
  Box,
  Stepper,
  Step,
  StepLabel as MuiStepLabel,
  Typography,
  StepContent,
  Paper,
  styled,
  Divider,
  Breadcrumbs,
  Button,
} from '@mui/material';

// Components
import Faq from './Faq';
import Info from './Info';

interface Props {}

const pageTitle = 'Information & FAQs';

export default function InfoPage({}: Props) {
  const router = useRouter();
  console.log('window.history', window.history);
  console.log('Referrer:', document.referrer);
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Typography variant="h4" sx={{mt:2, mb:4}}>
        {pageTitle}
      </Typography>
      <Info />
      <Divider sx={{width: '40%', mb:4, backgroundColor: 'lightgray', height: '2px'}} />
      <Faq />
    </Box>
  )
}



