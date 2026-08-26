'use client';

import { 
  useEffect,
  useRef,
  useState, 
} from 'react';

import { useSession, signOut } from 'next-auth/react'

import { init, Form, FormContext } from '@feathery/react';

// Server Actions
import { submitInductionForm } from '../actions/submitInductionForm';

// DTO
import { PrefillForm } from '@lib/dto/feathery/PrefilledForm.dto';
import { CircularProgress, Paper } from '@mui/material';

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

  const context = useRef<FormContext>(null);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  // const navigateToComplete = () => {
  //   const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  //   window.location.assign(`${basePath}/induction/complete`);
  // };

  useEffect(() => {
    // Initialize Feathery on the client only to avoid SSR hydration mismatch
    init(featherySdk, {
      _enterpriseRegion: 'au'
    });
    setMounted(true);
  }, [featherySdk]);

  useEffect(() => {
    if (context.current) {
      setReady(true);
    } 
  }, [context.current]);

  const handleFormComplete = async (formContext: FormContext) => {
    console.log('Form completed', formContext);
    console.log('Form fields', formContext.getFieldValues());

    const fields = formContext.getFieldValues();

    if( // Induction is complete
      (Array.isArray(fields.VMS_VolunteerUndertaking) && fields.VMS_VolunteerUndertaking.length > 0) ||
      (Array.isArray(fields.VMS_VolunteerUndertaking2) && fields.VMS_VolunteerUndertaking2.length > 0)
    ) {
      console.log('Induction form is complete, sending to DB.');
      // await submitInductionForm(formContext.getFieldValues())
      // .then(() => {
      //   // Sign out "new" users
      //   if (session?.user?.method === 'sign-up') {
      //     console.log('New user form submission, signing out user.', { user: session.user, method: session.user.method });
      //     signOut({ redirectTo: '/induction/complete' })
      //   }
      // });
    } else {
      console.log('Induction form is not complete, not sending to DB.');
    }
  };

  if (session && session.user) {
    return (
      <Paper 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '95%',
          // minWidth: 'auto',
          px: 10,
          py: 5,
        }}
      >
        {/* {
          ready !== true && <CircularProgress />
        } */}
        {mounted && <Form 
          formId={formId} 
          contextRef={context}
          initialValues={prefilledValues}
          onFormComplete={handleFormComplete}
          hideTestUI={true}
          initialLoader = {{
            show: true,
          }}
        />}
      </Paper>
    );
  }
}