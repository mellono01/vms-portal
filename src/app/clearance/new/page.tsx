'use client';

import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

import dayjs from 'dayjs';

import {
  Backdrop,
  Box,
  CircularProgress,
} from '@mui/material';

import FeatheryForm from '../upgrade/FeatheryForm';

// DTO
import { PrefillForm } from '@lib/dto/feathery/PrefilledForm.dto';

interface Props {}

export default function Portal({}: Props) {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  // console.log('[Portal] User Session:', session);

  const existingUser = !(searchParams.get('existing') === 'false');

  let prefilledValues: PrefillForm = {
    VMS_IsFullInduction: 'true',
    VMS_Capacity: 'Contractor',
    VMS_FirstName: "",
    VMS_MiddleName: "",
    VMS_LastName: "",
    VMS_DOB: undefined,
    VMS_Email: "",
    VMS_Phone: "",
  };

  console.log('[Portal] Session Details (session.user):', session?.user);
  console.log('[Portal] existingUser:', existingUser);

  if(session?.user) {
    if(existingUser && session?.user?.details) {
      const userDetails = session?.user?.details;

      prefilledValues.VMS_FirstName = userDetails.FirstName || '';
      prefilledValues.VMS_MiddleName = userDetails.MiddleName || '';
      prefilledValues.VMS_LastName = userDetails.LastName || '';
      prefilledValues.VMS_DOB = dayjs(userDetails.DateOfBirth).format('YYYY-MM-DD') || undefined;
      prefilledValues.VMS_Email = userDetails.Forms[0]?.EmailAddress || '';
      prefilledValues.VMS_Phone = userDetails.Forms[0]?.PhoneNumber || '';

      // if(!!userDetails.DateOfBirth) {
      //   prefilledValues.VMS_DOB = dayjs(userDetails.DateOfBirth).format('YYYY-MM-DD');
      // }

      // if(process.env.NODE_ENV === 'development') {
      //   prefilledValues.VMS_Phone = '0400000000';
      //   prefilledValues.VMS_Email = `test@test.com.au`;
      //   prefilledValues.VMS_DOB = dayjs().subtract(30, 'year').format('YYYY-MM-DD');
      // }

    } else if (!existingUser) {
      const userDetails = session?.user || {};

      prefilledValues.VMS_FirstName = userDetails?.firstName || '';
      prefilledValues.VMS_LastName = userDetails?.lastName || '';
      prefilledValues.VMS_Email = userDetails?.email || '';

      // if(process.env.NODE_ENV === 'development') {
      //   prefilledValues.VMS_Phone = '0400000000';
      //   prefilledValues.VMS_Email = `test@test.com.au`;
      //   prefilledValues.VMS_DOB = dayjs().subtract(30, 'year').format('YYYY-MM-DD');
      //   prefilledValues.VMS_WwccNumber = '123456';
      //   prefilledValues.VMS_WwccExpiry = dayjs().add(1, 'year').format('YYYY-MM-DD');
      //   prefilledValues.VMS_DescriptionOfServices = 'Test Description';
      // }
    }
    
    return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt:5}}>
        <FeatheryForm from="new" prefilledValues={prefilledValues}/>
      </Box>
    );
  } else {
    return (
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }
}