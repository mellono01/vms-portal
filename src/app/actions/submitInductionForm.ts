'use server'

import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'

import {vmsApi} from '@/lib/api/vmsApiRequestor';

// import type { FeatheryFieldTypes } from '@feathery/react'

function prepareBody(formFields: Record<string, any>) {
  // Prepare the body for the API request
  
  const body: Record<string, any> = {
  // === EXPECTED FIELDS IN REQ.BODY ===
  // CedowToken: string;
  // FormType: string; (FormType _id string)
  // FirstName: string;
  // MiddleName: string;
  // LastName: string;
  // DateOfBirth: string; (ISO format)
  // EmailAddress: string;
  // PhoneNumber: string;
  // DescriptionOfServices: string;
  // WwccNumber: string;
  // WwccExpiryDate: string; (ISO format)
  // State: string;
  // Locations: string[]; (Array of Location _id strings)
  };

    body.CedowToken = formFields.VMS_Token;
    body.FormTypeId = formFields.VMS_Clearance_ObjectID;
    body.FormType = formFields.VMS_Clearance_Type;
    body.FirstName = formFields.VMS_FirstName;
    body.MiddleName = formFields.VMS_MiddleName;
    body.LastName = formFields.VMS_LastName;
    body.DateOfBirth = formFields.VMS_DOB;
    body.EmailAddress = formFields.VMS_Email;
    body.PhoneNumber = formFields.VMS_Phone;
    body.DescriptionOfServices = ""; //?
    body.WwccNumber = formFields.VMS_WwccNumber;
    body.WwccExpiryDate = formFields.VMS_WwccExpiry;
    body.State = ""; //?
    body.Locations = Array.isArray(formFields.VMS_SchoolSelect2) ? formFields.VMS_SchoolSelect2 : []; //?
    body.Undertaking = {
      version: 2,
      statements: formFields.VMS_VolunteerUndertaking
    };
  
  return body;
}

export async function submitInductionForm(
  formFields: Record<string, any>
) {
  const session = await getServerSession(authOptions);

  // New user, full induction form.
  if(session && session.user && session.user.method === 'sign-up') {
    const body = prepareBody(formFields);

    const response = await vmsApi({
      endpointUrl: '/induction/new',
      method: 'POST',
      data: body
    });
    console.log('Form submission response:', response);

    if (!response.status || response.status < 200 || response.status >= 300) {
      throw new Error(`Failed to submit form: ${response.statusText}`);
    }

    return response;
  }

  // Exsiting user, new form.
  if(session && session.user && session.user.method === 'mfa-sign-in') {
    const body = prepareBody(formFields);

    const response = await vmsApi({
      endpointUrl: '/induction/existing',
      method: 'POST',
      data: body
    });
    console.log('Form submission response:', response);

    if (!response.status || response.status < 200 || response.status >= 300) {
      throw new Error(`Failed to submit form: ${response.statusText}`);
    }

    return response;
  }

  // Call api to submit data
  // console.log('Form Data Submitted:', formFields)
  // console.log('Form field data:', formFields.VMS_FirstName)

}