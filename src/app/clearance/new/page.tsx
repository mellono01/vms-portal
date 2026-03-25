'use client';

import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

import {
  Box,
} from '@mui/material';

import FeatheryForm from '../upgrade/FeatheryForm';
import dayjs from 'dayjs';

interface Props {}

export default function Portal({}: Props) {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  // console.log('[Portal] User Session:', session);

  const existingUser = !(searchParams.get('existing') === 'false');
  // console.log('[Portal] existingUser:', existingUser);

  const prefilledValues = {};

  if(session?.user) {
    if(existingUser) {
      prefilledValues.VMS_FirstName = session?.user?.FirstName || '';
      prefilledValues.VMS_MiddleName = session?.user?.MiddleName || '';
      prefilledValues.VMS_LastName = session?.user?.LastName || '';
      prefilledValues.VMS_DOB = dayjs(session?.user?.DateOfBirth).format('YYYY-MM-DD') || undefined;
      prefilledValues.VMS_Email = session?.user?.Email || '';
      prefilledValues.VMS_Phone = session?.user?.Phone || '';

      if(!!session?.user?.dateOfBirth) {
        prefilledValues.VMS_DOB = dayjs(session?.user?.dateOfBirth).format('YYYY-MM-DD');
      }

      if(process.env.NODE_ENV === 'development') {
        prefilledValues.VMS_Phone = '0400000000';
        prefilledValues.VMS_Email = `test@test.com.au`;
        prefilledValues.VMS_DOB = dayjs().subtract(30, 'year').format('YYYY-MM-DD');
      }

    } else if (!existingUser) {
      prefilledValues.VMS_FirstName = session?.user?.firstName || '';
      prefilledValues.VMS_MiddleName = session?.user?.middleName || '';
      prefilledValues.VMS_LastName = session?.user?.lastName || '';
      prefilledValues.VMS_DOB = dayjs(session?.user?.dateOfBirth).format('YYYY-MM-DD') || undefined;
      prefilledValues.VMS_Email = session?.user?.email || '';
      prefilledValues.VMS_Phone = session?.user?.phone || '';

      if(!!session?.user?.dateOfBirth) {
        prefilledValues.VMS_DOB = dayjs(session?.user?.dateOfBirth).format('YYYY-MM-DD');
      }

      if(process.env.NODE_ENV === 'development') {
        prefilledValues.VMS_Phone = '0400000000';
        prefilledValues.VMS_Email = `test@test.com.au`;
        prefilledValues.VMS_DOB = dayjs().subtract(30, 'year').format('YYYY-MM-DD');
        prefilledValues.VMS_WwccNumber = '123456';
        prefilledValues.VMS_WwccExpiry = dayjs().add(1, 'year').format('YYYY-MM-DD');
        prefilledValues.VMS_DescriptionOfServices = 'Test Description';
      }
    }
    

    return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt:5}}>
        <FeatheryForm from="new" prefilledValues={prefilledValues}/>
      </Box>
    );
  }
}