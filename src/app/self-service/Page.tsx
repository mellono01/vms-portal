'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'

import {
  Box,
} from '@mui/material';

import Clearances, { PlaceholderClearance } from './Clearances';
import PersonalDetails from './PersonalDetails';

interface Props {}

export default function SelfService({}: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (session?.user?.Forms) {
    return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt:5}}>
        <PersonalDetails />
        <Clearances />
        <PlaceholderClearance />
      </Box>
    );
  } else if (session?.user && !session.user.Forms) {
    router.push('/clearance/new');
    router.refresh();
  }

}