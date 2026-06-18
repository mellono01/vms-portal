import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'

import dayjs from 'dayjs';

// Components
import NewClearance from '@/app/induction/new/New'

// DTO
import { PrefillForm } from '@lib/dto/feathery/PrefilledForm.dto';

interface Props {}

export default async function NewClearancePage({}: Props) {
  const session = await getServerSession(authOptions)
  console.log('Session in NewClearancePage:', session)

  if(session && session.user && ['mfa-sign-in', 'sign-up'].includes(session.user.method)) {
    const existingUser = session.user.method === 'mfa-sign-in';
    
    let prefilledValues: PrefillForm = {
      VMS_IsFullInduction: existingUser ? 'false' : 'true',
      VMS_Capacity: "",
      VMS_CedowToken: '',
      VMS_FirstName: "",
      VMS_MiddleName: "",
      VMS_LastName: "",
      VMS_DOB: "",
      VMS_Email: "",
      VMS_Phone: "",
    };

    if(existingUser && session?.user?.details) {
      const userDetails = session?.user?.details;

      prefilledValues.VMS_FirstName = userDetails.FirstName || '';
      prefilledValues.VMS_MiddleName = userDetails.MiddleName || '';
      prefilledValues.VMS_LastName = userDetails.LastName || '';
      prefilledValues.VMS_DOB = dayjs(userDetails.DateOfBirth).format('YYYY-MM-DD') || "";
      prefilledValues.VMS_Email = userDetails.Forms[0]?.EmailAddress || '';
      prefilledValues.VMS_Phone = userDetails.Forms[0]?.PhoneNumber || '';

    } else if (!existingUser) {
      const userDetails = session?.user || {};

      prefilledValues.VMS_FirstName = userDetails?.firstName || '';
      prefilledValues.VMS_LastName = userDetails?.lastName || '';
      prefilledValues.VMS_Email = userDetails?.email || '';
    }

    return (
      <NewClearance formValues={prefilledValues} />
    );
  } else {
    console.warn('No valid session found, redirecting to sign in page.');
    redirect('/sign-in');
  }
}