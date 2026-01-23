'use client';

import { useRef } from 'react';

import NextLink from 'next/link'

import { 
  Box,
  Breadcrumbs, 
  Typography 
} from '@mui/material';

import { init, Form, FormContext } from '@feathery/react';

import { useStore } from '@/lib/providers/storeProvider';

export default function FeatheryForm() {
  const {
    userData,
    selectedForm,
  } = useStore((store) => store);

  const featherySdk = 'bb4b8927-47c8-4910-a6ba-ed492db9d98e' // SDK Key (Test)
  // const featherySdk = '485460c5-27f2-4e7b-a88b-0d709d77bed2' // SDK Key (Live)
  // const featherySdk = 'bb4b8927-47c8-4910-a6ba-ed492db9d98e' // SDK Key (Test)
  // const featherySdk = 'b3f4ce09-d923-4130-9536-b444e4ee2e72' // API Key (Live)
  // const featherySdk = 'db21e8c2-b9db-4afe-a945-088688a30b9c' // API Key (Test)

  // Initialize Feathery
  init(featherySdk, {
    _enterpriseRegion: 'au' 
  });
  const context = useRef<FormContext>(null);

  // console.log('[Feathery Context]', context.current?.formName);

  // Show the Feathery form
  return (
    <Box
      sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}
    >
      <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'start', width: '100%', ml:3}}>
        <Breadcrumbs aria-label="breadcrumb">
          <NextLink color="inherit" href="/self-service">
            Self Service
          </NextLink>
          <Typography sx={{ color: 'text.primary' }}>Upgrade Clearance</Typography>
        </Breadcrumbs>
      </Box>
      <Form 
        formId='avGDYr' 
        contextRef={context}
        initialValues={{
          VMS_FirstName: userData?.FirstName || '', 
          VMS_MiddleName: userData?.MiddleName || '', 
          VMS_LastName: userData?.LastName || '', 
          VMS_DOB: userData?.DateOfBirth || '', 
          VMS_Email: selectedForm?.EmailAddress || '', 
          VMS_Phone: selectedForm?.PhoneNumber || ''
        }}
      />
    </Box>
  );
}