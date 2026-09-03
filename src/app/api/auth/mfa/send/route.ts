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
    console.log('*** token: ', token.emails)

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
        } else if (!!body.SendEmail) {
          console.log('[dev/test] Sending MFA code to email', { SendPhone: body.SendPhone, code:postedMfa.Code });
          await postMfaEmail({
            Name: token?.firstName ?? '',
            MfaCode: postedMfa.Code,
            Email: body.SendEmail + '@dow.catholic.edu.au'
          })
          .then((response) => {
            console.log('Email sent successfully', response);
          })
          .catch((error) => {
            console.error('Error sending email', error);
          });
        } else {
          console.log('Email sending skipped (SendEmail is false)', { unmaskedEmail, code:postedMfa.Code });
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
        } else if (!!body.SendPhone) {
          console.log('[dev/test] Sending MFA code to phone', { SendPhone: body.SendPhone, code:postedMfa.Code });
          await postMfaSms({
            MfaCode: postedMfa.Code,
            Phone: body.SendPhone
          })
          .then((response) => {
            console.log('Sms sent successfully', {
              MfaCode: postedMfa.Code,
              Phone: body.SendPhone,
              response
            });
          })
          .catch((error) => {
            console.error('Error sending sms', error);
          });
        } else {
          console.log('Sms sending skipped (SendPhone is false)', { unmaskedPhone, code:postedMfa.Code });
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