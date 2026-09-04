import { NextRequest, NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

// API
import postMfa from '@/lib/api/requests/postMfa';
import postMfaEmail from '@/lib/api/requests/postMfaEmail';
import postMfaSms from '@/lib/api/requests/postMfaSms';

// Test settings (read from the HttpOnly cookie, validated against the allowlist)
import { getTestSettingsFromRequest } from '@/lib/testSettings/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    const testSettings = getTestSettingsFromRequest(req);

    console.log('Test settings: ', testSettings);

    console.log('Received MFA send request', { body, token });

    // Unmask values
    let unmaskedEmail = Array.isArray(token?.emails) ? token.emails.find((e: any) => e.id === body?.Email)?.unmasked ?? '' : '';
    let unmaskedPhone = Array.isArray(token?.phones) ? token.phones.find((p: any) => p.id === body?.Phone)?.unmasked ?? '' : '';

    console.log('Generating MFA code', { unmaskedEmail, unmaskedPhone });
    const postedMfa = await postMfa({
      Email: unmaskedEmail,
      Phone: unmaskedPhone,
    });

    if(postedMfa) {
      console.log('MFA code created in DB', postedMfa);

      if(unmaskedEmail !== '') {
        if((process.env.NEXT_PUBLIC_ENVIRONMENT_NAME_SHORT ?? '').toUpperCase() === "PROD") {
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
        } else if (testSettings.sendEmails && !!testSettings.email) {
          const fullEmail = testSettings.email + '@dow.catholic.edu.au';
          console.log('[dev/test] Sending MFA code to email', { SendEmail: fullEmail, code:postedMfa.Code });
          await postMfaEmail({
            Name: token?.firstName ?? '',
            MfaCode: postedMfa.Code,
            Email: fullEmail
          })
          .then((response) => {
            console.log('Email sent successfully', response);
          })
          .catch((error) => {
            console.error('Error sending email', error);
          });
        } else {
          console.log('Email sending skipped (test settings disabled)', { unmaskedEmail, code:postedMfa.Code });
        }
      }

      if(unmaskedPhone !== '') {
        if((process.env.NEXT_PUBLIC_ENVIRONMENT_NAME_SHORT ?? '').toUpperCase() === "PROD") {
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
        } else if (testSettings.sendSms && !!testSettings.mobile) {
          console.log('[dev/test] Sending MFA code to phone', { SendPhone: testSettings.mobile, code:postedMfa.Code });
          await postMfaSms({
            MfaCode: postedMfa.Code,
            Phone: testSettings.mobile
          })
          .then((response) => {
            console.log('Sms sent successfully', {
              MfaCode: postedMfa.Code,
              Phone: testSettings.mobile,
              response
            });
          })
          .catch((error) => {
            console.error('Error sending sms', error);
          });
        } else {
          console.log('Sms sending skipped (test settings disabled)', { unmaskedPhone, code:postedMfa.Code });
        }
      }
    }

    let response = { 
      success: true, 
      expiresAt: postedMfa?.Expiry ?? null,
      mfaCode: null
    }

    if(["DEV", "TEST"].includes((process.env.NEXT_PUBLIC_ENVIRONMENT_NAME_SHORT ?? '').toUpperCase())) {
      response.mfaCode = postedMfa?.Code ?? null;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Mfa verification error', error);
    return NextResponse.json({
      success: false,
      error: 'An error occurred during verification'
    });
  }
}