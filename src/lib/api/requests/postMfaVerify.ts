"use server"

import { vmsApi } from "../vmsApiRequestor";

interface PostMfaVerifyParams {
  Code: string;
  Email?: string;
  Phone?: string;
}

export default async function postMfaVerify({
  Email,
  Phone,
  MfaCode,
}:{
  Email: string;
  Phone: string;
  MfaCode: string;
}) {
  const logPrefix = '[POST][MfaVerify]';

  if (!process.env.VMS_API_BASE_PATH) {
    throw new Error(`${logPrefix} VMS API base path is not defined`);
  }

  const endpointUrl = '/mfa/verify'

  let body: PostMfaVerifyParams = {
    Code: MfaCode.trim(),
  };

  if (Email !== undefined) body.Email = Email.trim();
  if (Phone !== undefined) body.Phone = Phone.trim();

  try {
    const response = await vmsApi({
      endpointUrl: endpointUrl,
      method: 'POST',
      data: body,
    });
    
    return response;
  } catch (error) {
    console.error(`${logPrefix} Error during MFA verify request`, error);
    throw error;
  }
}