'use client';

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
  const { data: session } = useSession();
  console.log('[FeatheryForm] User Session:', session);

  const featherySdk = 'bb4b8927-47c8-4910-a6ba-ed492db9d98e' // SDK Key (Test)

  // Initialize Feathery
  init(featherySdk, {
    _enterpriseRegion: 'au' 
  });

  const context = useRef<FormContext>(null);

  const navigateToComplete = () => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    window.location.assign(`${basePath}/induction/complete`);
  };

  if (session && session.user) {
    const handleFormComplete = async () => {
      if(session.user.method === 'sign-up') {
        console.log('[Portal] Form completed, signing out user.');
        await signOut({ redirect: false });
        navigateToComplete();
      } else {
        navigateToComplete();
      }
    }

    return (
      <Form 
        formId='avGDYr' 
        contextRef={context}
        initialValues={prefilledValues}
        onFormComplete={handleFormComplete}
        hideTestUI={true}
      />
    );
  }
}