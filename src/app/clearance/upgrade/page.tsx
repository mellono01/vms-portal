'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from '@mui/material';

import {
  useStore,
} from '@/lib/providers/storeProvider'

import FeatheryForm from './FeatheryForm';

interface Props {}

export default function Portal({}: Props) {
  const router = useRouter();

  const {
    userData,
    selectedForm
  } = useStore((store) => store);

  useEffect(() => {
    if (!userData) {
      console.warn('not signed in, redirecting to sign-in');
      router.push('/sign-in');
    } else if (userData && !selectedForm) {
      console.warn('no selected form, redirecting to self-service');
      router.push('/');
    }
  }, [userData, router]);

  if(userData && selectedForm) {
    return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt:5}}>
        <FeatheryForm />
      </Box>
    );
  }

}