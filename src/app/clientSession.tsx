'use client';

import React, { useEffect, useState } from 'react';
import { deleteSession, getSession } from '@/lib/sessions-client';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/general/loading-screen';
import { SessionPayload } from '@/types/globals';
import { useBulkSyncStore } from '@/lib/state/bulksync-store';
import { syncTask } from '@/lib/bulksync';
import FloatingPWAStatusAvatar from '@/components/general/floating-sw-status';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { SessionTimeoutModal } from '@/components/dialogs/sessionExpiredModal';
import LoginPage from './login/page'; // Ensure this import path is correct

const ClientSessionCheck = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionCount, setSessionCount] = useState<number>(0);
  const router = useRouter();

  const { state, summary, setTasks, resetAllTasks } = useBulkSyncStore();

  // Setup bulk sync task
  useEffect(() => {
    if (session!) {  
      setTasks(syncTask);
      resetAllTasks();
    }
  }, [session]);

  // Log summary state changes
  useEffect(() => {
    console.log('summary', summary);
  }, [state]);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const session = await getSession();
        setSession(session);

        const valid = session != null;
        setIsAuthenticated(valid);

        if (valid) {
          setSessionCount(prev => prev + 1); // Only increment if session is valid
        }
        else {
          setSessionCount(0);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleContinueSession = () => {
    console.log("Session continued");
    setSessionCount(prev => prev + 1);
  };

  const handleSignOut = () => {
    deleteSession();
    router.push('/login');
  };

  if (loading) {
    return (
      <LoadingScreen
        isLoading={true}
        text="Loading... Please wait."
        style="dots"
        fullScreen={true}
        progress={0}
        timeout={0}
        onTimeout={() => console.log("Loading timed out")}
      />
    );
  }

  // === Authenticated UI ===
  if (isAuthenticated) {
    return (
      <>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="overflow-x-hidden">
            <header className="flex h-16 items-center border-b px-4 no-print">
              <SidebarTrigger className="mr-2" />
            </header>
            <main className="flex-1 overflow-x-hidden p-4">{children}</main>
          </SidebarInset>
        </SidebarProvider>

        <FloatingPWAStatusAvatar />

        <SessionTimeoutModal
          onContinueSession={handleContinueSession}
          onSignOut={handleSignOut}
          sessionDuration={24 * 60 * 60 * 1000} // 24 hours
          idleTimeout={15 * 60 * 1000}           // 15 minutes idle
          warningTime={2 * 60 * 1000}           // 2 minute countdown
        />
      </>
    );
  }

  // === Session Expired UI ===
  if (sessionCount > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6" />
              Session Ended
            </CardTitle>
            <CardDescription>Your session has ended for security reasons</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                location.href = '/login';
              }}
              className="w-full"
            >
              Sign In Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // === First Visit or No Session Ever ===
  return <LoginPage />;
};

export default ClientSessionCheck;
