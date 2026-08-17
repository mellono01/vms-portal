'use client';

import { 
  useRef, 
} from 'react';

import { useSession, signOut } from 'next-auth/react'

import { init, Form, FormContext } from '@feathery/react';

// Server Actions
import { submitInductionForm } from '../actions/submitInductionForm';

// DTO
import { PrefillForm } from '@lib/dto/feathery/PrefilledForm.dto';

export default function FeatheryForm({
  prefilledValues,
  featherySdk,
  formId,
}: {
  prefilledValues: PrefillForm
  featherySdk: string
  formId: string
}) {
  const { data: session } = useSession();

  // Initialize Feathery
  init(featherySdk, {
    _enterpriseRegion: 'au' 
  });

  const context = useRef<FormContext>(null);

  // const navigateToComplete = () => {
  //   const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  //   window.location.assign(`${basePath}/induction/complete`);
  // };

  const handleFormComplete = async (formContext: FormContext) => {
    console.log('Form completed', formContext.getFieldValues());
    await submitInductionForm(formContext.getFieldValues())
    .then(() => {
      // Sign out "new" users
      if (session?.user?.method === 'sign-up') {
        console.log('New user form submission, signing out user.', { user: session.user, method: session.user.method });
        signOut({ redirectTo: '/induction/complete' })
      }
    });
  };

  if (session && session.user) {
    return (
      <Form 
        formId={formId} 
        contextRef={context}
        initialValues={prefilledValues}
        onFormComplete={handleFormComplete}
        hideTestUI={true}
      />
    );
  }
}