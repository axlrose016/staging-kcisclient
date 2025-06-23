"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4, validate } from 'uuid';
import {
    User,
    Lock,
    AlertTriangle,
    LogIn,
    LogOut,
    Calendar,
    Building2,
    ShieldCheck,
    Fingerprint,
    Timer,
    Clock4,
    CalendarClock,
    Wifi,
    WifiOff,
    RefreshCw,
    Eye,
    EyeOff
} from "lucide-react";

import React, { useState, useEffect, useRef } from "react";
import LoginService from "../../components/services/LoginService";
import { ICFWTimeLogs, IUserData } from "@/components/interfaces/iuser";
import { endOfDay, startOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { hashPassword, hasOnlineAccess } from "@/lib/utils";
import { useBulkSyncStore } from "@/lib/state/bulksync-store";
import { syncTask } from "@/lib/bulksync";
import FloatingPWAStatusAvatar from "@/components/general/floating-sw-status";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import { getUserByEmail, getUserData } from "@/db/offline/Dexie/schema/user-service";


interface User {
    id: string;
    userData: {
        email: string;
        name: string;
    };
}

export default function ClockInOut() {


    const {
        setTasks,
        resetAllTasks,
        startSync
    } = useBulkSyncStore();

    const [currentTime, setCurrentTime] = useState(new Date());
    const [isInternetTime, setIsInternetTime] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isLoading, setIsLoading] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
    const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | ''>("");
    const [user, setUser] = useState<User | null>(null);
    const [activeLog, setActiveLog] = useState<ICFWTimeLogs | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isTimeBtnDisabled, setIsTimeBtnDisabled] = useState(false);
    const [isConfirmBtnDisabled, setIsConfirmBtnDisabled] = useState(true);
    const usernameRef = useRef<HTMLInputElement>(null);
    const hasSyncedRef = useRef(false);
    const wasOfflineRef = useRef(false);

    // Set time based on network status
    const updateTime = async (forceSync: boolean = false) => {
        try {
            if (navigator.onLine && (!hasSyncedRef.current || forceSync || wasOfflineRef.current)) {
                setSyncStatus("syncing");
                // Try to fetch time from a reliable time server
                const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Manila');
                const data = await response.json();

                console.log('gettime from internet', {
                    syncStatus,
                    online: navigator.onLine,
                    isInternetTime,
                    data,
                    date: new Date(data.dateTime).toISOString()
                });

                setCurrentTime(new Date(data.dateTime));
                setIsOnline(true);
                setIsInternetTime(true);
                setLastSyncTime(new Date());
                setSyncStatus("synced");
                hasSyncedRef.current = true;
                wasOfflineRef.current = false;
            }
        } catch (error) {
            // If time server request fails, fallback to local time
            console.error('Failed to fetch internet time:', error);
            setIsOnline(false);
            setIsInternetTime(false);
            setSyncStatus("error");
            hasSyncedRef.current = false;
        }
    };

    useEffect(() => {
        resetAllTasks()
        setTasks(syncTask.filter(i => i.tag == 'Person Profile > CFW attendance log'))
    }, [setTasks, resetAllTasks])



    useEffect(() => {
        // Initial update with local time
        setCurrentTime(new Date());

        // Check internet access and sync time if available
        const checkAndSyncTime = async () => {
            const hasAccess = await hasOnlineAccess();
            if (hasAccess) {
                await updateTime(true);
            } else {
                setIsOnline(false);
                wasOfflineRef.current = true;
            }
        };

        checkAndSyncTime();

        // Listen for online/offline events
        const handleOnline = async () => {
            setIsOnline(true);
            wasOfflineRef.current = true;
            const session = await getSession() as SessionPayload;
            await startSync(session!, "Person Profile > CFW attendance log")
            await updateTime(true);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setIsInternetTime(false);
            setSyncStatus("error");
            hasSyncedRef.current = false;
            wasOfflineRef.current = true;
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Add network status change listener
        const handleNetworkChange = async () => {
            const hasAccess = await hasOnlineAccess();
            if (hasAccess) {
                await handleOnline();
            } else {
                handleOffline();
            }
        };
        // Check network status periodically
        const networkCheckInterval = setInterval(handleNetworkChange, 60000); //1min

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(networkCheckInterval);
        };
    }, []); // Empty dependency array since we only want this to run on mount

    useEffect(() => {
        // Time update interval
        const timeInterval = setInterval(() => {
            setCurrentTime(prev => new Date(prev.getTime() + 1000));
        }, 1000);

        return () => {
            clearInterval(timeInterval);
        };
    }, []); // Empty dependency array since we only want this to run on mount

    // Success Toast
    function successToast(msg: string) {
        toast({
            variant: "green",
            title: "Success!",
            description: msg,
            duration: 3000
        });

        setTimeout(() => {
            setUsername("");   // Clear username
            setPassword("");   // Clear password
            setIsTimeBtnDisabled(false); // Enable Time button
            setIsConfirmBtnDisabled(true); // Disable Confirm button
            setIsOpen(false); // Close dialog
        }, 3000);
    }
    // const handleTimeInOut = () => {
    //     setIsConfirmBtnDisabled(!isConfirmBtnDisabled);
    //     successToast("Time in/ out has been recorded!");
    // }
    // Error Toast
    function errorToast(msg: string) {
        toast({
            variant: "destructive",
            title: "Missing Required Fields",
            description: msg,
        });
    }

    const getTodayLatestLog = async (data: User | any) => {
        console.log('getTodayLatestLog > data', data)
        const now = new Date();
        const timeZone = 'Asia/Manila';

        const startPH = startOfDay(now);
        const endPH = endOfDay(now);

        const startUtc = toZonedTime(startPH, timeZone).toISOString();
        const endUtc = toZonedTime(endPH, timeZone).toISOString();

        console.log('results  > user', user)

        const results = await dexieDb.cfwtimelogs
            .where('created_date')
            .between(startUtc, endUtc, true, true)
            .and(e => e.created_by === data.userData.email)
            .sortBy('created_date');

        console.log('results  > results', results)

        return results.length > 0 ? results[results.length - 1] : null;
    };

    const handleTimeClick = async () => {
        if (username === "" || password === "") {
            errorToast("Username and/or Password required!");
            return;
        }

        setIsLoading(true);
        const email = username.toLowerCase()
        try {
            if (isOnline) {
                const user = await LoginService.onlineLogin(email, password);
                console.log('handleTimeClick > user', { user, email })
                if (user) {
                    const userlog = await getTodayLatestLog(user.user);
                    setActiveLog(userlog);
                    setUser(user.user);
                    setIsOpen(true);
                    setIsTimeBtnDisabled(true);
                    setIsConfirmBtnDisabled(false);
                } else {
                    oflineProcess()
                }
            } else {
                oflineProcess()
            }
        } catch (err) {
            console.error('Login error:', err);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred during login",
            });
        } finally {
            setIsLoading(false);
        }
    };


    const oflineProcess = async () => {
        const email = username.toLowerCase()
        const userdevice = await getUserByEmail(email);
        console.log('Login error:', { username, userdevice });
        if (!userdevice) {
            setIsLoading(false)
            return toast({
                variant: "destructive",
                title: "Incorrect Email and/or Password!",
                description: "The email and/or password you entered is incorrect. Please try again!",
            });
        }

        const decryptedPassword = await hashPassword(password, userdevice.salt);
        if (
            userdevice.password !== decryptedPassword ||
            (userdevice.email !== email && userdevice.username !== email)
        ) {
            return toast({
                variant: "destructive",
                title: "Invalid Credentials!",
                description: "The email or password is incorrect. Please try again!",
            });
        }

        const userData: IUserData | null = await getUserData(userdevice.id);

        if (!userData) {
            return toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Please check your credentials",
            });
        } else {
            const useroffline = {
                id: userdevice.id,
                userData: {
                    email: userdevice.email,
                    name: userdevice.username,
                }
            } as User

            const userlog = await getTodayLatestLog({ user: useroffline });
            setActiveLog(userlog);
            setUser(useroffline);
            setIsOpen(true);
            setIsTimeBtnDisabled(true);
            setIsConfirmBtnDisabled(false);
        }
    }

    const createLogs = async (type: string) => {
        if (!user) return;

        setIsLoading(true);
        try {
            const logs: ICFWTimeLogs = type === "in" ? {
                id: uuidv4(),
                record_id: user.id,
                log_type: type,
                log_in: currentTime.toISOString(),
                log_out: "",
                work_session: 1,
                status: "Pending",
                total_work_hours: 0,
                created_date: currentTime.toISOString(),
                created_by: user.userData.email,
                push_status_id: 2,
                is_deleted: false,
                remarks: "",
                last_modified_date: null,
                last_modified_by: null,
                push_date: null,
                deleted_date: null,
                deleted_by: null
            } : {
                ...activeLog!,
                log_type: type,
                log_out: currentTime.toISOString()
            };

            await dexieDb.cfwtimelogs.put(logs);
            successToast("Time in/out has been recorded!");
            setIsOpen(false);
            setUsername("");
            setPassword("");
            setIsTimeBtnDisabled(false);
            setIsConfirmBtnDisabled(true);
        } catch (err) {
            console.error('Time log error:', err);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to record time in/out",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Confirm Handler
    const handleTimeInOut = (type: string) => {
        (async () => {
            if (!activeLog || activeLog && activeLog.log_in == "" || activeLog?.log_out == "") {
                createLogs(type)
            } else {
                toast({
                    variant: "default",
                    title: "Time-in",
                    description: "Are you sure you want to Time-in again?",
                    action: (
                        <button
                            onClick={() => {
                                createLogs(type)
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Yes
                        </button>
                    ),
                });
            }
        })();
    };


    const formatDateTime = (time: Date | null) => {
        return time
            ? time.toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            })
            : "--/--/---- --:--:--";
    };


    return (
        <>
            <AnimatedBackground />
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="p-8 rounded-2xl shadow-2xl bg-white/90 w-full max-w-6xl border border-gray-100 backdrop-blur-sm">
                    <div className="w-full flex justify-center mb-6">
                        <Image width={300} height={300} src="/images/logos.png" alt="DSWD KC BAGONG PILIPINAS" className="h-24 w-auto hover:scale-105 transition-transform duration-300" />
                    </div>

                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-2 flex items-center justify-center gap-2">
                        <Building2 className="h-8 w-8 text-cfw_bg_color" />
                        KAPIT BISIG LABAN SA KAHIRAPAN
                    </h1>
                    <h2 className="text-xl font-semibold text-center text-gray-700 mb-6 flex items-center justify-center gap-2">
                        <CalendarClock className="h-6 w-6 text-cfw_bg_color" />
                        TIME IN/OUT
                    </h2>

                    <div className="text-center mb-8 bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-xl border border-gray-200 shadow-inner">
                        <p className="text-4xl font-mono text-cfw_bg_color flex items-center justify-center gap-3">
                            <Timer className="h-10 w-10" />
                            {formatDateTime(currentTime)}
                        </p>
                        <div className="flex flex-col items-center justify-center gap-3 mt-4">
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isOnline
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                    {isOnline ? (
                                        <Wifi className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <WifiOff className="h-5 w-5 text-red-500" />
                                    )}
                                    <span className="text-sm font-medium">
                                        {isOnline ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${syncStatus === 'synced'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : syncStatus === 'syncing'
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                    }`}>
                                    {syncStatus === 'synced' && (
                                        <ShieldCheck className="h-5 w-5 text-green-500" />
                                    )}
                                    {syncStatus === 'syncing' && (
                                        <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
                                    )}
                                    {(!isOnline || syncStatus === 'error') && (
                                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                    )}
                                    <span className="text-sm font-medium">
                                        {syncStatus === 'synced' && 'Time Synchronized'}
                                        {syncStatus === 'syncing' && 'Syncing Time...'}
                                        {(!isOnline || syncStatus === 'error') && 'Using Local Time'}
                                    </span>
                                </div>
                            </div>
                            {lastSyncTime && isOnline && syncStatus === 'synced' && (
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock4 className="h-3 w-3" />
                                    Last synchronized: {lastSyncTime.toLocaleTimeString()}
                                </div>
                            )}
                            {!isOnline && (
                                <div className="text-xs text-yellow-600 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    Time may not be accurate while offline
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="max-w-md mx-auto">
                        <div className="space-y-6">
                            <div className="relative">
                                <Label htmlFor="username" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Fingerprint className="h-4 w-4 text-cfw_bg_color" />
                                    Email<span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    ref={usernameRef}
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="mt-1 pl-10 bg-gray-50 border-gray-200 focus:border-cfw_bg_color focus:ring-cfw_bg_color lowercase"
                                    placeholder="Enter your Email"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="relative">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-cfw_bg_color" />
                                    Password<span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-1 pl-10 pr-10 bg-gray-50 border-gray-200 focus:border-cfw_bg_color focus:ring-cfw_bg_color normal-case"
                                        placeholder="Enter your Password"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                onClick={handleTimeClick}
                                disabled={isTimeBtnDisabled || isLoading}
                                className="w-full bg-cfw_bg_color hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Clock4 className="h-6 w-6" />
                                        Record Time
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    <Dialog modal={false} open={isOpen} onOpenChange={(open) => {
                        setIsOpen(open);
                        if (!open) {
                            setTimeout(() => {
                                usernameRef.current?.focus();
                            }, 100);
                            setIsTimeBtnDisabled(false);
                            setIsConfirmBtnDisabled(true);
                        }
                    }}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-center text-2xl font-bold text-cfw_bg_color mb-4 flex items-center justify-center gap-2">
                                    <Calendar className="h-7 w-7" />
                                    Confirm Time Record
                                </DialogTitle>
                                <DialogDescription className="text-center mt-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded-md flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                                    <div>
                                        <strong>Verification Required:</strong> Please confirm your identity before proceeding with the time record.
                                    </div>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex flex-col items-center justify-center gap-4 mt-6">
                                <Avatar className="h-36 w-36 border-4 border-cfw_bg_color hover:scale-105 transition-transform duration-300 shadow-lg">
                                    <AvatarImage src={user?.userData.name} alt={user?.userData.name} />
                                    <AvatarFallback className="text-4xl bg-cfw_bg_color text-white">
                                        {user?.userData.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-gray-800">{user?.userData.name}</p>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        CFW ID: {user?.id}
                                    </p>
                                </div>
                            </div>

                            <DialogFooter className="flex flex-col gap-3 mt-6">
                                <Button
                                    onClick={() => handleTimeInOut("in")}
                                    disabled={activeLog ? activeLog.log_in !== "" && activeLog.log_out === "" : isConfirmBtnDisabled}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="h-6 w-6" />
                                            Time In
                                        </>
                                    )}
                                </Button>

                                <Button
                                    onClick={() => handleTimeInOut("out")}
                                    disabled={activeLog ? activeLog.log_in !== "" && activeLog.log_out !== "" : true}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <LogOut className="h-6 w-6" />
                                            Time Out
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <FloatingPWAStatusAvatar />
        </>
    );
}
