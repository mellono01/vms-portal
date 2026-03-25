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
import { PlaceholderClearance } from './components/ClearanceCard';
import HelpMenu from './HelpMenu';

interface Props {}

export default function SelfService({}: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

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
      session.user.mfaVerified
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
        CedowToken: session.user.CedowToken,
        LastName: session.user.LastName,
      })
      .then((data) => {
        console.log('Fetched entity forms:', data[0]);
        setUserData(data[0]);
        setFetchingUserData(false);
      })
      .catch((error) => {
        console.error('Error fetching entity forms:', error);
        setFetchingUserData(false);
      });
    }
  }, [session, status]);

  if (userData && userData.Forms) {
    return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt:5}}>
        <PersonalDetails />
        <Clearances />
        <PlaceholderClearance />
        <HelpMenu />
      </Box>
    );
  } else if (fetchingUserData || fetchingLocations) {
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
  } else if (session?.user && userData && !userData.Forms) {
    router.push('/clearance/new');
    router.refresh();
  } else {
    <Box>
      error - unknown
    </Box>
  }
}