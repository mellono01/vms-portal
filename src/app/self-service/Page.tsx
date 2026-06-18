'use client';

import { useEffect } from 'react';

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
import { dataTagErrorSymbol } from '@tanstack/react-query';

interface Props {}

export default function SelfService({}: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  useEffect(() => {
    console.log('Checking session and status in useEffect:', { session, status });
    if(
      status === 'authenticated' &&
      session &&
      session.user &&
      session.user.method === 'mfa-sign-in' &&
      session.user.mfaVerified &&
      session.user.details
    ) {
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
        CedowToken: session.user.details.CedowToken,
        LastName: session.user.details.LastName,
      })
      .then((data) => {
        if(!!dataTagErrorSymbol) {
          // console.log('Fetched entity forms:', data);
          setUserData(data[0]);
          setFetchingUserData(false);
        } else {
          console.log("Response from getEntityForms is empty or undefined");
          setFetchingUserData(false);
          throw new Error('No data returned from getEntityForms');
        }
      })
      .catch((error) => {
        console.error('Error fetching entity forms:', error);
        setFetchingUserData(false);
      });
    }
  }, [session, status]);

  if (fetchingUserData || fetchingLocations) {
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
  } else if (session?.user && userData && !userData.Forms) {
    router.push('/clearance/new');
    router.refresh();
  } else {
    return (
      <ErrorPage />
    )
  }
}