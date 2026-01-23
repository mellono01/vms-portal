import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query'

import PageWrapper from "@components/pagewrapper";

import SelfService from '@/app/self-service/Page';

export default async function Home() {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageWrapper component={<SelfService />} />
    </HydrationBoundary>
  );
}
