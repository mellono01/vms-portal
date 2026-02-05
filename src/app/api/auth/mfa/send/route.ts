import { NextRequest, NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

// API
import postMfa from '@/lib/api/requests/postMfa';

async function generateMfaCode(): Promise<string> {
  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    const unmaskedEmail = token?.emails?.find((e: any) => e.id === body?.EmailId)?.unmasked;
    
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mfa verification error:', error);
    return NextResponse.json({
      success: false,
      error: 'An error occurred during verification'
    });
  }
}