import { NextRequest, NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

// API
import postMfa from '@/lib/api/requests/postMfa';
import postEmail from '@/lib/api/requests/postEmail';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    console.log('Received MFA send request', { body, token });

    // Unmask values
    const unmaskedEmail = token?.emails?.find((e: any) => e.id === body?.EmailId)?.unmasked ?? '';
    const unmaskedPhone = token?.phones?.find((p: any) => p.id === body?.PhoneId)?.unmasked ?? '';

    console.log('Generating MFA code', { unmaskedEmail, unmaskedPhone });
    const postedMfa = await postMfa({
      Email: unmaskedEmail,
      Phone: unmaskedPhone,
    });

    if(postedMfa) {
      console.log('MFA code created in DB', postedMfa);

      if(unmaskedEmail !== '') {
        if(process.env.NODE_ENV === 'production') {
          console.log('Sending MFA code to email', { unmaskedEmail, code:postedMfa.Code });
          await postEmail({
            Name: token?.name ?? '',
            MfaCode: postedMfa.Code,
            Email: unmaskedEmail
          })
          .then((response) => {
            console.log('Email sent successfully', response);
          })
          .catch((error) => {
            console.error('Error sending email', error);
          });
        } else {
          console.log('[dev/test] Sending MFA code to email', { unmaskedEmail, code:postedMfa.Code });
          await postEmail({
            Name: token?.firstName ?? '',
            MfaCode: postedMfa.Code,
            Email: "mellono01@dow.catholic.edu.au" // Replace with actual email sending logic,
          })
          .then((response) => {
            console.log('Email sent successfully', response);
          })
          .catch((error) => {
            console.error('Error sending email', error);
          });
        }
      }

      if(unmaskedPhone !== '') {
        // TODO: send code to phone using unmaskedPhone
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mfa verification error', error);
    return NextResponse.json({
      success: false,
      error: 'An error occurred during verification'
    });
  }
}