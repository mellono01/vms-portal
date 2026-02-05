import { headers, cookies } from 'next/headers';
import { AuthOptions } from 'next-auth'
import { getToken } from "next-auth/jwt";
import CredentialsProvider from 'next-auth/providers/credentials'

// API
import getEntityForms from '@/lib/api/requests/getEntityForms';
import postEntityExists from '@/lib/api/requests/postEntityExists';
import postMfaVerify from '@/lib/api/requests/postMfaVerify';

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
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
          const result = await getEntityForms({
            CedowToken: credentials?.CedowToken || '',
            LastName: credentials?.LastName || '',
          });
          
          if(result.length > 0) {
            // Extract email addresses from Forms
            const emailData = result[0].Forms.map((
              { EmailAddress }: {EmailAddress: string}, index: number
            ) => ({ 
              masked: maskEmail(EmailAddress), 
              unmasked: EmailAddress, // Store unmasked for server-side use
              id: index
            }));
            console.log('Extracted email data:', emailData);
            return {
              ...result[0],
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
      async authorize(credentials, req) {
        try {
          const result = await getEntityForms({
            CedowToken: credentials?.CedowToken || '',
            LastName: credentials?.LastName || '',
          });
          
          if(result.length > 0) {
            // Get the token from the request to access unmasked emails
            const req = {
              headers: Object.fromEntries(headers()),
              cookies: Object.fromEntries(cookies().getAll().map((c) => [c.name, c.value])),
            };
            const token = await getToken({ req, secret: process.env.AUTH_SECRET });

            const unmaskedEmail = token?.emails?.find((e: any) => e.id === Number(credentials?.EmailId))?.unmasked;

            console.log('Verifying MFA code:', credentials?.MfaCode, 'to email:', unmaskedEmail);
            
            const mfaValid = await postMfaVerify({
              Email: unmaskedEmail,
              MfaCode: credentials?.MfaCode ?? '',
            });

            if(mfaValid.valid) {
              console.log('MFA code valid, signing in user');
              return {
                ...result[0],
                mfaVerified: true, // Mark as MFA verified
              };
            }

            if (!mfaValid.valid) {
              console.log('Invalid MFA code');
              return null;
            }
            return null;
          }
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
        console.log('credentials:', credentials);
        try {
          // Step 1: Check if user already exists
          const response = await postEntityExists({
            FirstName: credentials?.FirstName || '',
            LastName: credentials?.LastName || '',
            Email: credentials?.Email || '',
          });
          
          if (response.exists) {
            // User already exists, don't allow sign up
            return null;
          }

          // Step 2: Create new user object (no API call to create yet)
          // Return the user data to create a session
          const newUser = {
            id: `temp-${Date.now()}`, // Temporary ID or generate one
            Email: credentials?.Email || '',
            FirstName: credentials?.FirstName || '',
            LastName: credentials?.LastName || '',
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
    async jwt({ token, user, trigger, session }) {
      // Store user data in the token when they first sign in
      if (user) {
        // Add any properties from API response
        token = { ...user };
      }
      
      // Handle MFA verification update
      if (trigger === "update" && session?.mfaVerified) {
        token.mfaVerified = true;
      }
      
      return token;
    },
    async session({ session, token }) {
      // Pass token data to the session
      if (session.user) {
        if (token.mfaVerified) {
          console.log('[session] mfa verified');
          session.user = { ...token } as any;
        } else {
          console.log('[session] mfa NOT verified');
          session.user.mfaVerified = false;
          session.user.emails = (token.emails as any)?.map((email: any) => ({
            masked: email.masked,
            id: email.id,
          }));
          // Store token data for server-side access (not sent to client)
          session.user.cedowToken = token.CedowToken as string;
          session.user.lastName = token.LastName as string;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}