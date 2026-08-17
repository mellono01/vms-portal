'use client';

import { useSession } from 'next-auth/react';

import { 
  Box, 
  Typography
} from "@mui/material";

export default function InductionComplete() {
  const { data: session } = useSession();
  console.log('Induction complete page loaded', { user: session?.user });
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt:5}}>
      <Typography variant="h4" sx={{mb:3}}>Induction Complete</Typography>
      <Typography variant="body1" sx={{mt:2}}>Thank you for completing your induction</Typography>
      <Typography variant="body1" sx={{mt:2}}>You will receive an email containing a TOKEN which will be your proof of induction. Further details are contained within your email. </Typography>
      <Typography variant="body1" sx={{mt:2}}>Contact the school if you need more assistance. </Typography>
    </Box>
  );
}