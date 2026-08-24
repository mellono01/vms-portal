import { NextRequest, NextResponse } from 'next/server';

// API
import postRecovery from '@/lib/api/requests/postRecovery';
import postRecoveryEmail from '@/lib/api/requests/postRecoveryEmail';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received recovery request', { body });

    let response = {
      success: false,
      message: ''
    }

    await postRecovery({
      FirstName: body?.FirstName ?? '',
      LastName: body?.LastName ?? '',
      Email: body?.Email ?? '',
    })
    .then(async (res) => {
      console.log('[POST][Route] Recovery request successful', res);

      if(res.exists && res.multipleMatches === false) {
        if(process.env.NODE_ENV === 'production') {
          await postRecoveryEmail({
            Email: body?.Email ?? '',
            Name: body?.FirstName ?? '',
            CedowToken: res.token ?? '',
          })
          .then((emailRes) => {
            console.log('[POST][Route] Recovery email sent successfully', emailRes);
            response.success = true;
            response.message = 'An email has been sent to you with recovery information. Please check your inbox and spam/junk folder.';
          })
          .catch((error) => {
            console.error('[POST][Route] Error sending recovery email', error);
            response.success = false;
            response.message = 'An error occurred while sending the recovery email. Please try again later.';
          });
        } else {
          await postRecoveryEmail({
            Email: "mellono01@dow.catholic.edu.au",
            Name: body?.FirstName ?? '',
            CedowToken: res.token ?? '',
          })
          .then((emailRes) => {
            console.log('[POST][Route] Recovery email sent successfully', emailRes);
            response.success = true;
            response.message = 'An email has been sent to you with recovery information. Please check your inbox and spam/junk folder.';
          })
          .catch((error) => {
            console.error('[POST][Route] Error sending recovery email', error);
            response.success = false;
            response.message = 'An error occurred while sending the recovery email. Please try again later.';
          });
        }
      }

      if((res.exists && res.multipleMatches ) || res.exists === false) {
        response.message = 'We could not find an exact match for the details provided. Please get in contact with us to recover your CEDoW Token.';
      }

    })
    .catch((error) => {
      console.error('[POST][Route] Recovery request failed', error);
      throw error;
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Recovery request error', error);
    return NextResponse.json({
      success: false,
      error: true,
      message: 'An error occurred while processing your recovery request. Please try again later.'
    });
  }
}
