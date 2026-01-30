'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from '@mui/material';

// Store
import {
  useStore,
} from '@/lib/providers/storeProvider'

import Clearances, { PlaceholderClearance } from './Clearances';
import PersonalDetails from './PersonalDetails';

interface Props {}

export default function SelfService({}: Props) {
  const router = useRouter();
  
  const {
    userData,
  } = useStore((store) => store);


  useEffect(() => {
    if (!userData) {
      console.warn('not signed in, redirecting to sign-in');
      router.push('/sign-in');
    }
  }, [userData, router]);

  if (userData) {
    console.warn('userData: ', userData);

    return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt:5}}>
        <PersonalDetails userData={userData} />
        <Clearances userData={userData} getUser={() => Promise.resolve([])} setLoadingUserData={() => {}}/>
        <PlaceholderClearance />
      </Box>
    );
  }

}