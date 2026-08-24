"use server"

import { emailApi } from "../nodeMailerRequestor";

export default async function postMfaEmail({
  Name,
  MfaCode,
  Email
}:{
  Name: string;
  MfaCode: string;
  Email: string;
}) {
  const logPrefix = '[POST][Email]';

  if (!process.env.EMAIL_API_BASE_PATH) {
    throw new Error(`${logPrefix} Email API base path is not defined`);
  }

  const endpointUrl = '/mfa/email'

  const body = {
    Name: Name,
    MfaCode: MfaCode,
    Email: Email,
  };

  try {
    const response = await emailApi({
      endpointUrl: endpointUrl,
      method: 'POST',
      data: body,
    });
    
    return response;
  } catch (error) {
    console.error(`${logPrefix} Error during MFA request`, error);
    throw error;
  }
}