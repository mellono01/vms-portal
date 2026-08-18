"use server"

import { emailApi } from "../nodeMailerRequestor";

export default async function postSms({
  MfaCode,
  Phone
}:{
  MfaCode: string;
  Phone: string;
}) {
  const logPrefix = '[POST][Sms]';

  if (!process.env.EMAIL_API_BASE_PATH) {
    throw new Error(`${logPrefix} Email API base path is not defined`);
  }

  if(Phone.slice(0, 2) !== '04' && Phone.slice(0, 3) !== '+61') {
    throw new Error(`${logPrefix} Phone number must start with '04' or '+61'`);
  }

  const formattedPhone = Phone.startsWith('+61') ? Phone : `+61${Phone.slice(1)}`;
  console.log(`${logPrefix} Formatted phone number: ${formattedPhone}`);

  const endpointUrl = '/mfa/sms'

  const body = {
    MfaCode: MfaCode,
    Phone: formattedPhone,
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