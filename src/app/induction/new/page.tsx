'use server'
import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'

import dayjs from 'dayjs';

// Components
import NewClearance from '@/app/induction/new/New'

// DTO
import { PrefillForm } from '@lib/dto/feathery/PrefilledForm.dto';

interface Props {}

type NormalizedClearance = 'contractor' | 'volunteer' | '';

function normalizeClearance(value: string): NormalizedClearance {
  const normalizedValue = value.toLowerCase().replace(/\s+/g, '');

  if (normalizedValue.includes('contractor')) {
    return 'contractor';
  }

  if (normalizedValue.includes('volunteer')) {
    return 'volunteer';
  }

  return '';
}

export default async function NewClearancePage({}: Props) {
  const session = await getServerSession(authOptions)
  console.log('Session', session);

  if(session && session.user && ['mfa-sign-in', 'sign-up'].includes(session.user.method)) {
    const existingUser = session.user.method === 'mfa-sign-in';
    let clearances = "";
    
    if(existingUser) {
      clearances = (session.user.details?.Forms ?? []).map((form) => {
        return normalizeClearance(form.FormType.Name);
      })
      .filter((clearance): clearance is Exclude<NormalizedClearance, ''> => clearance !== '')
      .join(', ');
    }
    
    let prefilledValues: PrefillForm = {
      VMS_IsFullInduction: existingUser ? 'false' : 'true',
      // VMS_Capacity: "",
      VMS_PriorClearances: clearances,
      VMS_Token: "",
      VMS_FirstName: "",
      VMS_MiddleName: "",
      VMS_LastName: "",
      VMS_DOB: "",
      VMS_Email: "",
      VMS_Phone: "",
    };

    if(existingUser && session?.user?.details) {
      const userDetails = session?.user?.details;

      prefilledValues.VMS_Token = userDetails.CedowToken || '';
      prefilledValues.VMS_FirstName = userDetails.FirstName || '';
      prefilledValues.VMS_MiddleName = userDetails.MiddleName || '';
      prefilledValues.VMS_LastName = userDetails.LastName || '';
      prefilledValues.VMS_DOB = userDetails.DateOfBirth ? dayjs(userDetails.DateOfBirth).format('YYYY-MM-DD') : "";
      prefilledValues.VMS_Email = userDetails.Forms[0]?.EmailAddress || '';
      prefilledValues.VMS_Phone = userDetails.Forms[0]?.PhoneNumber || '';

    } else if (!existingUser) {
      const userDetails = session?.user || {};

      prefilledValues.VMS_FirstName = userDetails?.firstName || '';
      prefilledValues.VMS_LastName = userDetails?.lastName || '';
      prefilledValues.VMS_Email = userDetails?.email || '';
    }

    return (
      <NewClearance 
        formValues={prefilledValues} 
        featheryKey={process.env.FEATHERY_SDK_KEY ?? ''} 
        formId={process.env.FEATHERY_FORM_ID ?? ''} 
      />
    );
  } else {
    console.warn('No valid session found, redirecting to sign in page.');
    redirect('/sign-in');
  }
}