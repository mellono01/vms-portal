import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'

import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query'

import PageWrapper from "@components/pagewrapper";

import SelfService from '@/app/self-service/Page';
import { Backdrop, CircularProgress } from '@mui/material';

export default async function Home() {
  const queryClient = new QueryClient();
  const session = await getServerSession(authOptions);

  if(session) {
    // Redirect if the session is a 'sign-up' session (user has completed sign-up but not clearance)
    if (session.user && session.user.mfaVerified === false && session.user.method === 'sign-up') {
      redirect('/induction/new?existing=false');
    }

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PageWrapper component={<SelfService />} />
      </HydrationBoundary>
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
