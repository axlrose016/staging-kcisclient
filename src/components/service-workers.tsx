"use client"; // ✅ Ensures this runs on the client side

import { useEffect } from "react";

export default function ServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const registerServiceWorker = async () => {
        try {
          const customSW = await navigator.serviceWorker.register("/custom-sw.js");
          console.log("✅ Custom Service Worker registered with scope:", customSW.scope);

          // // Only register sw.js if it's necessary
          // const defaultSW = await navigator.serviceWorker.register("/sw.js");
          // console.log("✅ Default Service Worker registered with scope:", defaultSW.scope);

          // Check for updates
          customSW.onupdatefound = () => {
            const installingWorker = customSW.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === "installed") {
                  console.log("⚡ New version of Custom SW available!");
                }
              };
            }
          };
        } catch (error) {
          console.error("❌ Service Worker registration failed:", error);
        }
      };

      registerServiceWorker();
    }
  }, []);

  return null; // No UI needed
}
