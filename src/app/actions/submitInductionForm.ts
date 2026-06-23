'use server'

import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'

// import type { FeatheryFieldTypes } from '@feathery/react'

export async function submitInductionForm(
  formFields: Record<string, any>
) {
  const session = await getServerSession(authOptions)
  console.log('[submitInductionForm] User Session:', session)
  // Call api to submit data
  console.log('Form Data Submitted:', formFields)
  console.log('Form field data:', formFields.VMS_FirstName)

  // Sign out "new" users
  if (session?.user?.method === 'sign-up') {
    console.log('[Portal] New user form submission, signing out user.')
    redirect('/sign-out?callbackUrl=/vms/portal/induction/complete')
  }

  // Redirect to complete page
  redirect('/induction/complete')
}