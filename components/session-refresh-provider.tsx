"use client";

import React, { useEffect, useState } from "react";
import { useTokenRefresh, useSessionRefresh } from "@/hooks/use-token-refresh";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export function SessionRefreshProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [refreshing, setRefreshing] = useState(false);
  
  // Use our custom hooks to handle token refresh
  const refreshedSession = useTokenRefresh();
  useSessionRefresh(5); // Refresh 5 minutes before expiry
  
  useEffect(() => {
    const checkSession = async () => {
      if (status === "authenticated" && session) {
        try {
          setRefreshing(true);
          const response = await fetch('/api/auth/session');
          const data = await response.json();
          
          if (data.isNearExpiry) {
            console.log("Session near expiry, refreshing...");
            // The useSessionRefresh hook will handle the actual refresh
          }
        } catch (error) {
          console.error("Error checking session status:", error);
        } finally {
          setRefreshing(false);
        }
      }
    };
    
    checkSession();
    
    // Set up regular checks
    const intervalId = setInterval(checkSession, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => clearInterval(intervalId);
  }, [session, status]);
  
  return <>{children}</>;
}
