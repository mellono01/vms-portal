import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// API
import getEntityForms from '@/lib/api/requests/getEntityForms';
import postEntityExists from '@/lib/api/requests/postEntityExists';
import postMfaVerify from '@/lib/api/requests/postMfaVerify';
import deleteMfa from './lib/api/requests/deleteMfa';

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
              { EmailAddress, _id }: {EmailAddress: string, _id: string},
            ) => ({ 
              masked: maskEmail(EmailAddress), 
              unmasked: EmailAddress, // Store unmasked for server-side use
              id: _id
            }));
            return {
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
      async authorize(credentials, req) {
        try {
          const result = await getEntityForms({
            CedowToken: credentials?.CedowToken || '',
            LastName: credentials?.LastName || '',
          });
          
          if(result.length > 0) {
            // Extract unmasked email from the freshly fetched Forms data
            const emailId = credentials?.EmailId;
            const unmaskedEmail = result[0].Forms.find((form: any) => form._id === emailId)?.EmailAddress;
            
            const mfaValid = await postMfaVerify({
              Email: unmaskedEmail,
              MfaCode: credentials?.MfaCode ?? '',
            });

            if(mfaValid.valid) {
              console.log('MFA code valid, signing in user');
              const id = mfaValid.id;

              // Remove email/mfaCode from db
              await deleteMfa({ id })
               .then(() => console.log('MFA code deleted successfully'))
               .catch((err) => console.error('Error deleting MFA code:', err));
              
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
        try {
          // Check if user already exists
          const response = await postEntityExists({
            FirstName: credentials?.FirstName || '',
            LastName: credentials?.LastName || '',
            Email: credentials?.Email || '',
          });
          
          if (response.exists) {
            // User already exists, don't allow sign up
            return null;
          }

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
    async jwt({ token, user }) {
      // Store user data in the token when they first sign in
      if (user) {
        // Add any properties from API response
        token = { ...user };
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