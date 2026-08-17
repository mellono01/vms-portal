import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// API
import { vmsApi } from '@/lib/api/vmsApiRequestor';
import postEntityExists from '@/lib/api/requests/postEntityExists';
import postMfaVerify from '@/lib/api/requests/postMfaVerify';
import deleteMfa from './lib/api/requests/deleteMfa';

function maskEmail(email?: string): string {
  if (!email || !email.includes('@')) {
    return '';
  }
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

/**
 * Internal helper used only during authentication, before a session exists.
 * Accepts credentials explicitly — this is the authentication boundary itself.
 * Not exported; not a server action.
 */
async function fetchEntityFormsByCredentials(CedowToken: string, LastName: string) {
  const logPrefix = '[GET][EntityForms][Auth]';

  if (!process.env.VMS_API_BASE_PATH) {
    throw new Error(`${logPrefix} VMS API base path is not defined`);
  }

  const queryParams = new URLSearchParams();
  queryParams.append('token', CedowToken.trim());
  queryParams.append('lastName', LastName.trim());

  const response = await vmsApi({
    endpointUrl: `/entity/forms?${queryParams.toString()}`,
    method: 'GET',
  });

  return response;
}

export const authOptions: AuthOptions = {
  providers: [
    // For initial sign in pre-mfa verification
    CredentialsProvider({
      id: 'sign-in',
      name: 'Sign In',
      credentials: {
        CedowToken: { label: 'CedowToken', type: 'text' },
        LastName: { label: 'Last Name', type: 'text' }
      },
      async authorize(credentials) {
        try {
          const result = await fetchEntityFormsByCredentials(
            credentials?.CedowToken || '',
            credentials?.LastName || '',
          );
          console.log('Authorize result:', result);

          if(result.length > 0) {
            // Extract email addresses from Forms
            const emailData = result[0].Forms.map((
              { EmailAddress, _id }: {EmailAddress?: string, _id: string},
            ) => ({
              masked: maskEmail(EmailAddress), 
              unmasked: EmailAddress, // Store unmasked for server-side use
              id: _id
            }));

            return {
              method: 'sign-in',
              id: credentials?.CedowToken || '', // Use CedowToken as a unique id
              cedowToken: credentials?.CedowToken || '',
              lastName: credentials?.LastName || '',
              emails: emailData, // Unmasked emails stored in token
              mfaVerified: false, // Mark as pending MFA verification
            };
          }
          return null;
        } catch (err) {
          console.error('Error in authorize function:', err);
          return null;
        }
      }
    }),
    // MFA Sign In Provier
    CredentialsProvider({
      id: 'mfa-sign-in',
      name: 'MFA Sign In',
      credentials: {
        CedowToken: { label: 'Cedow Token', type: 'text' },
        LastName: { label: 'Last Name', type: 'text' },
        EmailId: { label: 'Email Id', type: 'text' },
        MfaCode: { label: 'MFA Code', type: 'text' },
      },
      async authorize(credentials, _req) {
        try {
          const result = await fetchEntityFormsByCredentials(
            credentials?.CedowToken || '',
            credentials?.LastName || '',
          );

          if(result.length > 0) {
            // Extract unmasked email from the freshly fetched Forms data
            const emailId = credentials?.EmailId;
            const unmaskedEmail = result[0].Forms.find((form: any) => form._id === emailId)?.EmailAddress;
            
            const mfaValid = await postMfaVerify({
              Email: unmaskedEmail,
              MfaCode: credentials?.MfaCode ?? '',
            });

            if(mfaValid.valid) {
              const id = mfaValid.id;

              // Remove email/mfaCode from db
              await deleteMfa({ id })
               .catch((err) => console.error('Error deleting MFA code:', err));

              // Add refs to forms
              const forms = result[0].Forms.map((form: any, index: number) => ({ ...form, ref: index }));
              
              return {
                id: id,
                method: 'mfa-sign-in',
                mfaVerified: true, // Mark as MFA verified
                cedowToken: credentials?.CedowToken || '',
                lastName: credentials?.LastName || '',
                details: {...result[0], Forms: forms}, // Include all user details and forms
                email: unmaskedEmail,
              };
            }

            if (!mfaValid.valid) {
              console.warn('Invalid MFA code', { email: unmaskedEmail, enteredMfaCode: credentials?.MfaCode });
              return null;
            }
            return null;
          }
          return null;
        } catch (err) {
          console.error('[mfa-sign-in] Error in authorize function:', err);
          return null;
        }
      }
    }),
    // Sign Up Provider
    CredentialsProvider({
      id: 'sign-up',
      name: 'Sign Up',
      credentials: {
        FirstName: { label: 'First Name', type: 'text' },
        LastName: { label: 'Last Name', type: 'text' },
        Email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials) {
        try {
          // Check if user already exists
          const response = await postEntityExists({
            FirstName: credentials?.FirstName || '',
            LastName: credentials?.LastName || '',
            Email: credentials?.Email || '',
          });

          console.log("[sign-up] Entity exists response:", response);
          
          if (response.exists) {
            // User already exists, don't allow sign up
            return null;
          }

          // Return the user data to create a session
          const newUser = {
            method: 'sign-up',
            id: `temp-${Date.now()}`, // Temporary ID or generate one
            Email: credentials?.Email || '',
            firstName: credentials?.FirstName || '',
            lastName: credentials?.LastName || '',
            // Add any other fields
          };

          return newUser;
        } catch (err) {
          console.error('Error in sign-up authorize:', err);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Store user data in the token when they first sign in
      if (user) {
        // Add any properties from API response and ensure required JWT fields exist
        token = {
          ...token,
          ...user,
          mfaVerified: (user as any).mfaVerified ?? false,
          method: (user as any).method ?? 'unknown',
          cedowToken: (user as any).cedowToken ?? (user as any).cedowToken ?? '',
          lastName: (user as any).lastName ?? (user as any).lastName ?? '',
          emails: (user as any).emails ?? [],
        };
      }
      
      return token;
    },
    async session({ session, token }) {
      // Pass token data to the session
      if (session.user) {
        if (token.mfaVerified) {
          session.user = { ...token } as any;
        } else {
          session.user.mfaVerified = false;
          session.user.method = token.method;
            session.user.cedowToken = token.cedowToken as string;
            session.user.firstName = (token as any).firstName as string;
            session.user.lastName = token.lastName as string;
          
          if(token.method === 'sign-up') {
              session.user.email = (token as any).Email as string;
          } else if (token.method === 'sign-in') {
            // Store token data for server-side access (not sent to client)
            session.user.emails = (token.emails as any)?.map((email: any) => ({
              masked: email.masked,
              id: email.id,
            }));
          }
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}