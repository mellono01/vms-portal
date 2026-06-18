'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs';

import {
  Box,
} from '@mui/material';

import {
  useStore,
} from '@/lib/providers/storeProvider'

import FeatheryForm from './FeatheryForm';

// DTO
import { PrefillForm } from '@lib/dto/feathery/PrefilledForm.dto';

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

  console.warn('Selected Form:', selectedForm);

  if(session?.user?.details && selectedForm) {
    const prefilledValues: PrefillForm = {
        VMS_IsFullInduction: 'false',
        VMS_Capacity: 'Contractor',
        VMS_FirstName: session?.user?.details?.FirstName || '',
        VMS_MiddleName: session?.user?.details?.MiddleName || '',
        VMS_LastName: session?.user?.details?.LastName || '',
        VMS_DOB: dayjs(session?.user?.details?.DateOfBirth).format('YYYY-MM-DD') || undefined,
        VMS_Email: selectedForm?.EmailAddress || '',
        VMS_Phone: selectedForm?.PhoneNumber || '',
    };

    return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt:5}}>
        <FeatheryForm from='upgrade' prefilledValues={prefilledValues}/>
      </Box>
    );
  }

}