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

  // Redirect if already authenticated
  if (session && session.user) {
    if(session.user.method === 'sign-up') redirect('/induction/new')
    if(session.user.method === 'sign-in') redirect('/sign-in')

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PageWrapper component={<SelfService />} />
      </HydrationBoundary>
    );
  }
}
