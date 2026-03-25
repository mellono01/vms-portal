'use client';

import dayjs from 'dayjs';

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

// Store
import { useStore } from '@/lib/providers/storeProvider';

export default function FeatheryForm({
  from,
  prefilledValues,
}: {
  from: 'upgrade' | 'new' | 'new-existing',
  prefilledValues: {
    Select4?: string; // Volunteer, Contractor, Staff
    VMS_FirstName: string;
    VMS_MiddleName: string;
    VMS_LastName: string;
    VMS_DOB: string | undefined;
    VMS_Email: string;
    VMS_Phone: string;
  }
}) {
  const { data: session, status } = useSession();
  // console.log('[FeatheryForm] User Session:', session);
  const existingForms =
    ((session?.user as { Claims?: Array<{ Name: string; id: string }> } | undefined)?.Claims ?? []);
  console.warn('Existing Forms:', existingForms); 

  const {
    selectedForm,
    userData
  } = useStore((store) => store);

  const featherySdk = 'bb4b8927-47c8-4910-a6ba-ed492db9d98e' // SDK Key (Test)

  // Initialize Feathery
  init(featherySdk, {
    _enterpriseRegion: 'au' 
  });

  const context = useRef<FormContext>(null);

  const removeExistingCapacityOptions = () => {
    if (!context.current || existingForms.length === 0) {
      return;
    }

    const capacityField = context.current.fields?.['VMS_Capacity'];
    if (!capacityField?.options?.length) { // No options to filter, exit early
      return;
    }

    const normalize = (value: string) => value.trim().toLowerCase();
    const existingNames = new Set(
      existingForms
        .map((form) => form.Name)
        .filter(Boolean)
        .map(normalize)
    );

    const nextOptions = capacityField.options.filter((option) => {
      const optionValue = typeof option === 'string' ? option : option.value;
      return !existingNames.has(normalize(optionValue));
    });

    const removedCount = capacityField.options.length - nextOptions.length;
    if (removedCount > 0) {
      capacityField.options = nextOptions;

      const selectedCapacity =
        typeof capacityField.value === 'string' ? capacityField.value : '';
      if (selectedCapacity && existingNames.has(normalize(selectedCapacity))) {
        capacityField.clear?.();
      }

      console.log(`Removed ${removedCount} VMS_Capacity option(s) that already exist.`);
    }
  };

  if (session?.user) {
    // console.log('Initial Values:', initialValues);

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
          // onFormLoad={removeExistingCapacityOptions}
          initialValues={prefilledValues}
          hideTestUI={true}
        />
      </Box>
    );
  }
}