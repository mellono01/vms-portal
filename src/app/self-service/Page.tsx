'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'

import {
  Backdrop,
  Box,
  CircularProgress,
} from '@mui/material';

// Store
import { useStore } from '@/lib/providers/storeProvider';

// API
import getEntityForms from '@/lib/api/requests/getEntityForms';
import getLocations from '@/lib/api/requests/getLocations';

// Components
import Clearances from './Clearances';
import PersonalDetails from './PersonalDetails';
import HelpMenu from './HelpMenu';
import ErrorPage from '../error';

interface Props {}

export default function SelfService({}: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadError, setLoadError] = useState(false);

  console.warn('Session data in SelfService component:', session?.user);

  // Store Hooks
  const { 
    userData,
    setUserData,
    fetchingUserData,
    setFetchingUserData,
    locations,
    setLocations,
    fetchingLocations,
    setFetchingLocations
  } = useStore((store) => store);

  const shouldLoadSelfServiceData =
    status === 'authenticated' &&
    !!session?.user &&
    session.user.method === 'mfa-sign-in' &&
    session.user.mfaVerified &&
    !!session.user.details;

  useEffect(() => {
    console.log('Checking session and status in useEffect:', { session, status });
    if (shouldLoadSelfServiceData) {
      const details = session?.user?.details;
      if (!details) {
        return;
      }

      setLoadError(false);

      if(locations === null) {
        console.log('Locations not found in store. Fetching locations.');
        setFetchingLocations(true);
        getLocations()
          .then((data) => {
            console.log('Fetched locations:', data);
            setLocations(data);
            setFetchingLocations(false);
          })
          .catch((error) => {
            console.error('Error fetching locations:', error);
            setFetchingLocations(false);
          });
      }

      console.warn("User signed in with MFA. Fetching details.")
      setFetchingUserData(true);
      getEntityForms({
        CedowToken: details.CedowToken,
        LastName: details.LastName,
      })
      .then((data) => {
        if (data?.length > 0) {
          setUserData(data[0]);
          setFetchingUserData(false);
        } else {
          console.log("Response from getEntityForms is empty or undefined");
          setFetchingUserData(false);
          setLoadError(true);
        }
      })
      .catch((error) => {
        console.error('Error fetching entity forms:', error);
        setFetchingUserData(false);
        setLoadError(true);
      });
    }
  }, [locations, session, setFetchingLocations, setFetchingUserData, setLocations, setUserData, shouldLoadSelfServiceData, status]);

  useEffect(() => {
    if (session?.user && userData && !userData.Forms) {
      router.push('/induction/new');
      router.refresh();
    }
  }, [router, session, userData]);

  const isInitialLoad =
    status === 'loading' ||
    (shouldLoadSelfServiceData && !userData && !loadError);

  if (isInitialLoad || fetchingUserData || fetchingLocations) {
    return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt:5}}>
       <Backdrop
        open={true}
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      </Box>
    );
  } else if (userData && userData.Forms) {
    return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt:5}}>
        <PersonalDetails />
        <Clearances />
        <HelpMenu />
      </Box>
    );
  } else {
    return (
      <ErrorPage />
    )
  }
}