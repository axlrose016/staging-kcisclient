'use client';  // Mark this as a client-side component

import React, { useEffect, useState } from 'react';
import { getSession } from '@/lib/sessions-client';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/general/loading-screen';
import LoginPage from './login/page';
import { SessionPayload } from '@/types/globals';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { IAttachments } from '@/components/interfaces/general/attachments';
import { useBulkSyncStore } from '@/lib/state/bulksync-store';
import { syncTask } from '@/lib/bulksync';
import FloatingPWAStatusAvatar from '@/components/general/floating-sw-status';

const ClientSessionCheck = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const router = useRouter();

  const { state, summary, setTasks, resetAllTasks } = useBulkSyncStore();

  useEffect(() => {
    resetAllTasks()
    setTasks(syncTask)
  }, [setTasks, resetAllTasks])

  useEffect(() => {
    console.log('summary', summary)
  }, [state])

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const session = await getSession();

        setSession(session)

        // Update the authentication state
        setIsAuthenticated(session != null);
      } catch (error) {
        console.error('Error fetching session:', error);
        setIsAuthenticated(false); // Set to false if there's an error
      } finally {
        setLoading(false); // Stop loading once session is checked
      }
    };
    checkSession();
  }, []); // Empty dependency array means this only runs once when component mounts

  if (loading) {
    return <div>
      <LoadingScreen
        isLoading={loading}
        text={"Loading... Please wait."}
        style={"dots"}
        fullScreen={true}
        progress={0}
        timeout={0}
        onTimeout={() => console.log("Loading timed out")}
      />
    </div>; // Show loading state until session is checked
  }

  console.log('Current isAuthenticated state:', isAuthenticated); // Debugging state changes

  // Render based on authentication state
  return isAuthenticated ? (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-x-hidden">
          <header className="flex h-16 items-center border-b px-4 no-print">
            <SidebarTrigger className="mr-2" />
            {/* <h1 className="text-lg font-medium">Beneficiary Profile Form</h1> */}
          </header>
          <main className="flex-1 overflow-x-hidden p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <FloatingPWAStatusAvatar />
    </>
  ) : (
    <LoginPage />
  );
};

export default ClientSessionCheck;
