import { NextRequest, NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

// API
import postMfa from '@/lib/api/requests/postMfa';
import postMfaEmail from '@/lib/api/requests/postMfaEmail';
import postMfaSms from '@/lib/api/requests/postMfaSms';

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
          await postMfaEmail({
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
          const testEmail = "mellono01@dow.catholic.edu.au"; // Replace with actual email sending logic,
          console.log('[dev/test] Sending MFA code to email', { testEmail, code:postedMfa.Code });
          await postMfaEmail({
            Name: token?.firstName ?? '',
            MfaCode: postedMfa.Code,
            Email: testEmail
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
        if(process.env.NODE_ENV === 'production') {
          console.log('Sending MFA code via sms', { unmaskedPhone, code:postedMfa.Code });
          await postMfaSms({
            MfaCode: postedMfa.Code,
            Phone: unmaskedPhone
          })
          .then((response) => {
            console.log('Sms sent successfully', {
              MfaCode: postedMfa.Code,
              Phone: unmaskedPhone,
              response
            });
          })
          .catch((error) => {
            console.error('Error sending sms', error);
          });
        } else {
          let testPhone = "0429505737"; // Olivia Mobile
          console.log('[dev/test] Sending MFA code to phone', { testPhone, code:postedMfa.Code });
          await postMfaSms({
            MfaCode: postedMfa.Code,
            Phone: testPhone
          })
          .then((response) => {
            console.log('Sms sent successfully', {
              MfaCode: postedMfa.Code,
              Phone: testPhone,
              response
            });
          })
          .catch((error) => {
            console.error('Error sending sms', error);
          });
        }
      }
    }

    return NextResponse.json({ success: true, expiresAt: postedMfa?.Expiry ?? null });
  } catch (error) {
    console.error('Mfa verification error', error);
    return NextResponse.json({
      success: false,
      error: 'An error occurred during verification'
    });
  }
}