"use client"

import { useEffect, useState, useCallback } from "react";

const DEFAULT_PING_URL = "https://www.google.com/favicon.ico"; 
export function useOnlineStatus(pingUrl = DEFAULT_PING_URL) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const checkConnection = useCallback(async () => {
    if (!navigator.onLine) {
      setIsOnline(false);
      return false;
    }

    try {
      await fetch(pingUrl, {
        method: "HEAD",
        mode: "no-cors",
        cache: "no-store"
      });
      setIsOnline(true);
      return true;
    } catch {
      setIsOnline(false);
      return false;
    }
  }, [pingUrl]);

  useEffect(() => {
    // Initial check
    checkConnection();

    // Event listeners for real-time changes
    const handleOnline = () => checkConnection();
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [checkConnection]);

  return isOnline
}