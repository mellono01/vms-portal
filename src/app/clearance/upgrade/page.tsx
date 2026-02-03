'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'

import {
  Box,
} from '@mui/material';

import {
  useStore,
} from '@/lib/providers/storeProvider'

import FeatheryForm from './FeatheryForm';

interface Props {}

export default function Portal({}: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    selectedForm
  } = useStore((store) => store);

  useEffect(() => {
    if (!selectedForm) {
      console.warn('no selected form, redirecting to self-service');
      router.push('/');
    }
  }, [selectedForm, router]);

  console.log('Selected Form:', selectedForm);

  if(session?.user && selectedForm) {
    return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt:5}}>
        <FeatheryForm from='upgrade'/>
      </Box>
    );
  }

}