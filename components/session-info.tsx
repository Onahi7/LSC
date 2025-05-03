"use client";

import { useSession } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function SessionInfo() {
  const { data: session, update } = useSession();
  const [expiresIn, setExpiresIn] = useState<string | null>(null);
  
  useEffect(() => {
    if (!session?.expires) return;
    
    // Calculate time to expiry and format it
    const calculateExpiryTime = () => {
      const expiryTime = new Date(session.expires).getTime();
      const now = Date.now();
      const diffMs = expiryTime - now;
      
      if (diffMs <= 0) {
        return "Expired";
      }
      
      const diffMins = Math.floor(diffMs / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);
      
      return `${diffMins}m ${diffSecs}s`;
    };
    
    // Set initial expiry time
    setExpiresIn(calculateExpiryTime());
    
    // Update every second
    const intervalId = setInterval(() => {
      setExpiresIn(calculateExpiryTime());
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [session]);
  
  if (!session) return null;
  
  const isSessionExpiringSoon = expiresIn && 
    expiresIn !== "Expired" && 
    parseInt(expiresIn.split("m")[0]) < 5;
  
  return (
    <>
      {isSessionExpiringSoon && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Session Expiring Soon</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Your session will expire in {expiresIn}.</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => update()}
            >
              Extend Session
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
