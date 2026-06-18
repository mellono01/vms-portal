import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'

import dayjs from 'dayjs';

// Components
import UpgradeClearance from '@/app/induction/upgrade/Upgrade'

// DTO
import { PrefillForm } from '@lib/dto/feathery/PrefilledForm.dto';

type PageProps = {
  searchParams: Promise<{ form?: string }>
};

export default async function UpgradeClearancePage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  
  console.log('Session in UpgradeClearancePage:', session?.user?.details?.Forms)

  // Do API call here to check for existing clearances.

  if(session && session.user && session.user.details && ['mfa-sign-in'].includes(session.user.method)) {
    const { form } = await searchParams;
    const userData = session.user.details;
    const formData = userData.Forms.find((formItem) => formItem.ref === Number(form));

    if(!formData) {
      console.warn('No form data found, redirecting to sign in page.');
      redirect('/');
    }
    
    const prefilledValues: PrefillForm = {
      VMS_IsFullInduction: 'false',
      VMS_Capacity: 'Contractor',
      VMS_CedowToken: '',
      VMS_FirstName: userData.FirstName || '',
      VMS_MiddleName: userData.MiddleName || '',
      VMS_LastName: userData.LastName || '',
      VMS_DOB: dayjs(userData.DateOfBirth).format('YYYY-MM-DD') || "",
      VMS_Email: formData?.EmailAddress || '',
      VMS_Phone: formData?.PhoneNumber || '',
    };

    return (
      <UpgradeClearance formValues={prefilledValues} />
    );
  } else {
    console.warn('No valid session found, redirecting to sign in page.');
    redirect('/sign-in');
  }
}