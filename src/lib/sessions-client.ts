"use client"

import Cookie from 'js-cookie';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { IUserData } from '@/components/interfaces/iuser';
import { redirect } from 'next/navigation';

// Define types for session and user data
interface SessionPayload extends JWTPayload {
  id: string;
  userData: IUserData;
  sessionExpiration: Date;
  token: string;
}

// Use environment variable for the session secret key
const secretKey = process.env.NEXT_SESSION_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

// Function to create session
export async function createSession(id: string, userData: IUserData, token: string): Promise<void> {
  const sessionExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week expiration
  const session = await encrypt({ id, userData, sessionExpiration, token });

  // Set the session cookie
  Cookie.set('session', session, {
    expires: 7, // 7 days expiration time
    secure: process.env.NODE_ENV === 'production', // Set secure flag for production
    sameSite: 'Strict', // CSRF protection
  });
}

// Function to delete session
export function deleteSession(): void {

  // Delete the session cookie
  Cookie.remove('session');
  localStorage.removeItem("userIdViewOnly");
}

// Function to encrypt the payload (create JWT)
export async function encrypt(payload: SessionPayload): Promise<string> {
  //debugger;
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Token expires in 7 days
    .sign(encodedKey);
}

// Function to decrypt the session (verify JWT)
export async function decrypt(session: string | undefined): Promise<SessionPayload | null> {
  try {
    if (!session) return null;

    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });

    console.log('Client Session is verified');
    return payload as SessionPayload;
  } catch (error) {
    console.log('Failed to verify session', error);
    return null;
  }
}

// Function to get the session from the cookie
export function getSession(): Promise<SessionPayload | null> {
  const sessionCookie = Cookie.get('session');
  if (sessionCookie) {
    return decrypt(sessionCookie);
  }
  return Promise.resolve(null); // No session cookie found
}
