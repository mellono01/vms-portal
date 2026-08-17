'use client';

import {
  Box,
  Typography,
} from '@mui/material';

// Components
import Info from './Info';

interface Props {}

const pageTitle = 'Information and Contact';

export default function InfoPage({}: Props) {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Typography variant="h4" sx={{mt:4, mb:4}}>
        {pageTitle}
      </Typography>
      <Info />
    </Box>
  )
}



