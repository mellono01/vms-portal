import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { compare } from 'bcryptjs';

// API
import getEntityForms from '@/lib/api/requests/getEntityForms';

export async function POST(request: Request) {
  const { CedowToken, LastName } = await request.json();

  const result = await getEntityForms({
    CedowToken,
    LastName,
  });
  
  if(result.length > 0) {
    // User found
    // Generate JWT
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    const token = jwt.sign(
      { CedowToken, LastName }, // The payload contains userid and username
      process.env.JWT_SECRET!,
      { expiresIn: expiresIn as string }
    );

    // Set an HttpOnly Cookie (security attribute)
    const response = NextResponse.json({ message: 'Login successful' });
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Enable HTTPS in the production environment
      sameSite: 'lax', // Prevent CSRF attacks
      maxAge: expiresIn === '1h' ? 3600 : Number(expiresIn),
      path: '/'
    });

    return response;
  } else {
    if (result.length === 0) {
      // User not found
      throw new Error('The details entered do not match our records. Please try again or select "Forgot your Cedow Token?".');
    }
  }

  
}