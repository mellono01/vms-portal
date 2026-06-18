'use client';

import { useRouter } from 'next/navigation'

import { 
  useRef, 
} from 'react';

import { useSession, signOut } from 'next-auth/react'

import { init, Form, FormContext } from '@feathery/react';

// DTO
import { PrefillForm } from '@lib/dto/feathery/PrefilledForm.dto';

export default function FeatheryForm({
  prefilledValues,
}: {
  prefilledValues: PrefillForm
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log('[FeatheryForm] User Session:', session);

  const featherySdk = 'bb4b8927-47c8-4910-a6ba-ed492db9d98e' // SDK Key (Test)

  // Initialize Feathery
  init(featherySdk, {
    _enterpriseRegion: 'au' 
  });

  const context = useRef<FormContext>(null);

  if (session && session.user) {
    const handleFormComplete = async () => {
      if(session.user.method === 'sign-up') {
        console.log('[Portal] Form completed, signing out user.');
        await signOut({ callbackUrl: "/vms/portal/clearance/complete" });
      } else {
        router.push('/vms/portal/clearance/complete');
      }
    }

    return (
      <Form 
        formId='avGDYr' 
        contextRef={context}
        // onFormLoad={removeExistingCapacityOptions}
        initialValues={prefilledValues}
        onFormComplete={handleFormComplete}
        hideTestUI={true}
      />
    );
  }
}