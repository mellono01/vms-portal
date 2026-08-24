"use server"

import { emailApi } from "../nodeMailerRequestor";

export default async function postRecoveryEmail({
  Email,
  Name,
  CedowToken,
}:{
  Email: string;
  Name: string;
  CedowToken: string;
}) {
  const logPrefix = '[POST][Recovery Email]';

  if (!process.env.EMAIL_API_BASE_PATH) {
    throw new Error(`${logPrefix} Email API base path is not defined`);
  }

  const endpointUrl = '/recovery/email'

  const body = {
    Name: Name,
    CedowToken: CedowToken,
    Email: Email,
  };

  try {
    await emailApi({
      endpointUrl: endpointUrl,
      method: 'POST',
      data: body,
    })
    .then((res) => {
      console.log(`${logPrefix} Recovery email request successful`, res);
      return {ok: true};
    })
    .catch((error) => {
      console.error(`${logPrefix} Recovery email request failed`, error);
      return {ok: false, error};
    });
  } catch (error) {
    console.error(`${logPrefix} Error sending recovery email`, error);
    throw error;
  }
}