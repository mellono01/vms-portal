'use client';

import { 
  useEffect, 
  useRef, 
  useState 
} from 'react';

import NextLink from 'next/link'
import { useSession } from 'next-auth/react'

import { 
  Box,
  Breadcrumbs, 
  Typography 
} from '@mui/material';

import { init, Form, FormContext } from '@feathery/react';

import { useStore } from '@/lib/providers/storeProvider';

export default function FeatheryForm({
  from
}: {
  from: 'upgrade' | 'new' | 'new-existing'
}) {
  const { data: session, status } = useSession();
  console.log('[FeatheryForm] User Session:', session); 

  const [initialValues, setInitialValues] = useState({
    VMS_FirstName: '', 
    VMS_MiddleName: '', 
    VMS_LastName: '', 
    VMS_DOB: '', 
    VMS_Email: '', 
    VMS_Phone: ''
  });

  const {
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

  useEffect(() => {
    console.log('from:', from);
    if (session?.user) {
      let values = initialValues;
      if (from === 'new') {
        values.VMS_FirstName = session?.user?.FirstName || '';
        values.VMS_LastName = session?.user?.LastName || '';
        values.VMS_Email = session?.user?.Email || '';
      }

      if (from === 'new-existing' || from === 'upgrade') {
        values.VMS_FirstName = session?.user?.FirstName || '';
        values.VMS_MiddleName = session?.user?.MiddleName || '';
        values.VMS_LastName = session?.user?.LastName || '';
        values.VMS_DOB = session?.user?.DateOfBirth || '';

        if (from === 'upgrade') {
          values.VMS_Email = selectedForm?.EmailAddress || '';
          values.VMS_Phone = selectedForm?.PhoneNumber || '';
        }
      }
      setInitialValues(values);
    }
  }, [session, selectedForm, from]);

  if (session?.user) {
    console.log('Initial Values:', initialValues);
    return (
      <Box
        sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}
      >
        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'start', width: '100%', ml:3}}>
          <Breadcrumbs aria-label="breadcrumb">
            <NextLink color="inherit" href="/self-service">
            {'<'} Back to Sign In/Sign Up
            </NextLink>
            {/* <Typography sx={{ color: 'text.primary' }}>Upgrade Clearance</Typography> */}
          </Breadcrumbs>
        </Box>
        <Form 
          formId='avGDYr' 
          contextRef={context}
          initialValues={initialValues}
        />
      </Box>
    );
  }
}