'use server';

import { getToken } from "next-auth/jwt";
import { headers, cookies } from 'next/headers';

// API
import postMfa from '@/lib/api/requests/postMfa';

async function generateMfaCode(): Promise<string> {
  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
}

const getAuthJwt = async () => {
  const req = {
    headers: Object.fromEntries(headers()),
    cookies: Object.fromEntries(cookies().getAll().map((c) => [c.name, c.value])),
  };
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  return token;
};

export async function sendMfaAction({
  EmailId,
} :{
  EmailId: string
}) {
  try {
    const token = await getAuthJwt();
    
    const unmaskedEmail = token?.emails?.find((e: any) => e.id === Number(EmailId))?.unmasked;

    const mfaCode = await generateMfaCode();

    if(mfaCode) {
      // Save mfa code to DB
      console.log('Sending MFA code to DB:', mfaCode, 'for user:', unmaskedEmail);
      const postedMfa = await postMfa({
        Email: unmaskedEmail,
        MfaCode: mfaCode,
      });

      if(postedMfa) {
        console.log('MFA code stored successfully for email:', unmaskedEmail);
        // TODO: send code to email using unmaskedEmail
        console.log('Sending MFA code to email:', unmaskedEmail);
      }
    }

    return;
  } catch (error) {
    console.error('Mfa verification error:', error);
    return {
      success: false,
      error: 'An error occurred during verification'
    };
  }
}
