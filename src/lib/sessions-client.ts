"use client"

import Cookie from 'js-cookie';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { IUserData } from '@/components/interfaces/iuser';
import { redirect } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

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
  const sessionExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day expiration

  const session = await encrypt({ id, userData, sessionExpiration, token });

  Cookie.set('session', session, {
    expires: sessionExpiration, // ⏰ 1 day expiration
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
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
    .setExpirationTime('12h') // Token expires in 24 hours
    .sign(encodedKey);
}

// Function to decrypt the session (verify JWT)
export async function decrypt(
  session: string | undefined,
  onSessionExpired?: () => void
): Promise<SessionPayload | null> {
  try {
    if (!session) return null;

    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });

    console.log('Client Session is verified');
    return payload as SessionPayload;
  } catch (error: any) {
    if (error.code === 'ERR_JWT_EXPIRED') {
        deleteSession();
      if (onSessionExpired) {
        onSessionExpired(); // trigger modal
      } else {
        // fallback toast
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "For your security, your session has ended. Please sign in again to continue.",
        });
        window.location.href = '/login';
      }
    } else {
      toast({
        variant: "destructive",
        title: "Authentication Failed.",
        description: "Failed to verify session. Please sign in again to continue.",
      });
    }
    return null;
  }
}


// Function to get the session from the cookie
// export function getSession(): Promise<SessionPayload | null> {
//   const sessionCookie = Cookie.get('session');
//   if (sessionCookie) {
//     return decrypt(sessionCookie);
//   }
//   return Promise.resolve(null); // No session cookie found
// }

export function getSession(onSessionExpired?: () => void): Promise<SessionPayload | null> {
  const sessionCookie = Cookie.get('session');
  if (sessionCookie) {
    return decrypt(sessionCookie, onSessionExpired);
  }
  return Promise.resolve(null); // No session cookie found
}
