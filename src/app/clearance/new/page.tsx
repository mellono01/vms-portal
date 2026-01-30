'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  Box,
} from '@mui/material';

import {
  useStore,
} from '@/lib/providers/storeProvider'

import FeatheryForm from '../upgrade/FeatheryForm';

interface Props {}

export default function Portal({}: Props) {
  const router = useRouter();

  const {
    signUpDetails,
  } = useStore((store) => store);

  useEffect(() => {
    if (!signUpDetails?.FirstName || !signUpDetails?.LastName || !signUpDetails?.Email) {
      console.warn('sign-up not started, redirecting to sign-up');
      router.push('/sign-up');
    }
  }, [signUpDetails, router]);

  if(signUpDetails) {
    return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt:5}}>
        <FeatheryForm from="new" />
      </Box>
    );
  }

}