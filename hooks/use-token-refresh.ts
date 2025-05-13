"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Custom hook to handle JWT refresh token strategy
 * This hook checks if the session has an error and signs out the user if needed
 */
export function useTokenRefresh() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check if session has a refresh token error
    if (session?.error === "RefreshTokenExpired") {
      // Sign out the user and redirect to sign in
      signOut({ callbackUrl: "/auth/signin?error=session_expired" });
    }
  }, [session, router]);

  return session;
}

/**
 * Checks if a session is about to expire and triggers a refresh
 * @param expiryThresholdMinutes - Minutes before expiry to refresh the token (default: 5)
 */
export function useSessionRefresh(expiryThresholdMinutes = 5) {
  const { data: session, update } = useSession();
  
  useEffect(() => {
    if (!session?.expires) return;
    
    const expiryTime = new Date(session.expires).getTime();
    const timeToExpiry = expiryTime - Date.now();
    const thresholdMs = expiryThresholdMinutes * 60 * 1000;
    
    // If token is about to expire within the threshold, refresh it
    if (timeToExpiry > 0 && timeToExpiry < thresholdMs) {
      // This will call the jwt callback in [...nextauth]/route.ts
      update();
      console.log("Session refreshed proactively");
    }
    
    // Set up a timer to check expiry regularly
    const intervalId = setInterval(() => {
      if (!session?.expires) return;
      
      const newExpiryTime = new Date(session.expires).getTime();
      const newTimeToExpiry = newExpiryTime - Date.now();
      
      if (newTimeToExpiry > 0 && newTimeToExpiry < thresholdMs) {
        update();
        console.log("Session refreshed during interval check");
      }
    }, Math.min(timeToExpiry / 2, 5 * 60 * 1000)); // Check at half the time to expiry or every 5 minutes, whichever is smaller
    
    return () => clearInterval(intervalId);
  }, [session, update, expiryThresholdMinutes]);
  
  return session;
}
