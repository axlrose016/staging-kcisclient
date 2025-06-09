'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from '@/components/ui/tooltip';
import { RefreshCw, Info, Loader2, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useBulkSyncStore, ISummary } from '@/lib/state/bulksync-store';
import { useMediaQuery } from '@/hooks/use-media-query';
import { SessionPayload } from '@/types/globals';
import { createSession, getSession } from '@/lib/sessions-client';
import Captcha from './general/captcha';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import LoginService from '@/app/login/LoginService';
import { useOnlineStatus } from '@/hooks/use-network';
import { isValidTokenString } from '@/lib/utils';

type Props = {
    children: ReactNode;
};

const formSchema = z.object({
    email: z.string().email({ message: "Invalid Email Address" }).trim(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .trim(),
});

type FormData = z.infer<typeof formSchema>;

type SyncError = {
    tag: string;
    record_id: number | string;
    error_message: string;
};

export function SyncSummaryDrawer({ children }: Props) {
    const [open, setOpen] = useState(false);
    const [loadingTag, setLoadingTag] = useState<string | null>(null);
    const [loadingAll, setLoadingAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [session, setSession] = useState<SessionPayload | null>(null);
    const [verified, setVerified] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false)
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const isOnline = useOnlineStatus()

    const {
        progressStatus,
        summary,
        startSync,
        resetAllTasks,
        resetSummary,
    } = useBulkSyncStore();

    useEffect(() => {
        const fetchUser = async () => {
            const _session = await getSession();
            setSession(_session as SessionPayload);
        };
        fetchUser();
    }, [open]);

    const tasks = Object.values(progressStatus);
    const filteredTasks = tasks.filter((task) =>
        task.tag.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const overallPercentage = summary.overallPercentage;
    const totalSynced = tasks.reduce((acc, cur) => acc + cur.success, 0);
    const totalErrors = tasks.reduce((acc, cur) => acc + cur.failed, 0);
    const totalRecords = totalSynced + totalErrors;

    const lastSyncedAt = tasks.length
        ? Math.max(
            ...tasks.map((t: any) =>
                new Date(t.created_date || summary.lastSyncedAt || Date.now()).getTime()
            )
        )
        : null;

    const handleResync = async (tag?: string) => {
        if (!session) return;

        if (tag) {
            setLoadingTag(tag);
            resetSummary();
            await startSync(session, tag);
            setLoadingTag(null);
        } else {
            setLoadingAll(true);
            resetAllTasks();
            await startSync(session);
            setLoadingAll(false);
        }
    };

    const getStateColor = (state: string) => {
        switch (state) {
            case 'completed':
                return 'bg-green-500';
            case 'in-progress':
                return 'bg-yellow-400';
            case 'failed':
                return 'bg-red-500';
            default:
                return 'bg-gray-300';
        }
    };


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>({

        resolver: zodResolver(formSchema),
    })

    const handleLogin = () => {
        console.log('handleLogin')
    }

    const onSubmit = async (data: FormData) => {

        setIsLoading(true);
        // debugger;
        try {
            if (!verified) {
                toast({
                    variant: "destructive",
                    title: "Captcha Error!",
                    description: "Invalid Captcha, Please try again!",
                });

                setIsLoading(false)
                return;
                console.log('onSubmit', data)
            }

            if (isOnline) {
                const onlinePayload = await LoginService.onlineLogin(data.email, data.password);
                await createSession(onlinePayload.user.id, onlinePayload.user.userData, onlinePayload.token);
                toast({
                    variant: "green",
                    title: "Success!",
                    description: "Please procceed and sycning your data!",
                });
                setOpen(false)
            }
        } catch (ee) {
            console.log('onSubmit > ee', ee)
        }
    }

    const handleExportErrors = (taskErrors: any[], tag: string) => {
        const errorData = {
            tag,
            timestamp: new Date().toISOString(),
            errors: taskErrors,
            syncStats: {
                totalSynced: summary.totalSynced,
                totalUnsynced: summary.totalUnsynced,
                totalRecords: summary.totalRecords,
                totalErrors: summary.totalErrors,
                overallPercentage: summary.overallPercentage,
                lastSyncedAt: summary.lastSyncedAt
            }
        };

        const blob = new Blob([JSON.stringify(errorData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sync-errors-${tag}-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Drawer
            direction={isDesktop ? 'right' : 'bottom'}
            open={open}
            onOpenChange={setOpen}

        >
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent className="px-4 pb-6 ">
                <DrawerHeader>
                    <DrawerTitle className="text-center text-lg font-semibold">
                        {!session?.token ? "Credential Login" : "Sync Summary"}
                    </DrawerTitle>
                </DrawerHeader>

                {isValidTokenString(session?.token) ?
                    <>
                        <div className="mt-2 mb-4 px-2">
                            <input
                                type="text"
                                placeholder="Search sync tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            />
                        </div>

                        <div className="space-y-4 sm:h-[100vh] h-[60vh] overflow-y-auto px-2">
                            {filteredTasks.map((task) => {
                                const { tag, success, failed, state } = task;
                                const total = success + failed;
                                const percentage = total ? Math.floor((success / total) * 100) : 0;
                                const taskErrors = summary.errorList?.filter((e) => e.tag === tag);

                                return (
                                    <div
                                        key={tag}
                                        className="border rounded-md p-4 bg-muted flex items-center justify-between gap-4"
                                    >
                                        <div className="flex-1 space-y-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${getStateColor(state)}`} />

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span
                                                                className="font-medium truncate max-w-[380px] block"
                                                                title={tag}
                                                            >
                                                                {tag}
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>{tag}</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                {failed > 0 && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Info className="w-4 h-4 text-destructive" />
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top">
                                                                <div className="text-sm text-red-500 max-w-sm">
                                                                    {taskErrors?.map((e, i) => (
                                                                        <div key={i} className="mb-2">
                                                                            <strong>ID:</strong> {e.record.id}
                                                                            <br />
                                                                            <strong>Error:</strong> {e.error_message}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                            </div>

                                            <Progress
                                                value={percentage}
                                                className="bg-gray-200"
                                                color={
                                                    percentage === 100
                                                        ? 'bg-green-400'
                                                        : taskErrors?.length
                                                            ? 'bg-red-400'
                                                            : 'bg-green-200'
                                                }
                                            />

                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <div className="flex items-center gap-2  w-full">
                                                    <p className='w-full'>
                                                        Synced: {success} / {total} • Errors: {failed}
                                                    </p>
                                                    {failed > 0 && (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        className="h-6 px-2"
                                                                        onClick={() => handleExportErrors(taskErrors || [], tag)}
                                                                    >
                                                                        <Download className="w-3 h-3 mr-1" />
                                                                        Export
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Export error details as JSON</TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                </div>
                                                <span
                                                    className={`
                                                    inline-block font-medium px-2 py-0.5 rounded-full
                                                    ${state === 'completed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : state === 'in progress'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : state == "error"
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-gray-100 text-gray-700'}
                                                                    `}
                                                >
                                                    {state}
                                                </span>
                                            </div>
                                        </div>

                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        disabled={loadingTag === tag}
                                                        onClick={() => handleResync(tag)}
                                                    >
                                                        <RefreshCw
                                                            className={`w-4 h-4 ${task.state === 'in progress' ? 'animate-spin' : ''
                                                                }`}
                                                        />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Resync</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-2 space-y-2 text-sm text-muted-foreground mt-4">
                            <p className="text-base">
                                Overall Progress: <strong>{overallPercentage}</strong>
                            </p>
                            <Progress
                                value={parseInt(overallPercentage)}
                                className="bg-gray-200"
                                color="bg-green-500"
                            />

                            <p>
                                Total Records: <strong>{totalRecords}</strong> | Synced:{' '}
                                <strong>{totalSynced}</strong> | Errors: <strong>{totalErrors}</strong>
                            </p>

                            {lastSyncedAt && (
                                <p className="text-xs">
                                    Last synced: {formatDistanceToNow(new Date(lastSyncedAt), { addSuffix: true })}
                                </p>
                            )}
                        </div>

                        <div className="mt-6 px-2">
                            <Button
                                className="w-full"
                                disabled={loadingAll}
                                onClick={() => handleResync()}
                            >
                                <RefreshCw
                                    className={`w-4 h-4 mr-2 ${loadingAll ? 'animate-spin' : ''}`}
                                />
                                Sync All
                            </Button>
                        </div>
                    </> : <div className='min-w-[450px]'>

                        <div className="w-full max-w-md">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="flex flex-col items-center text-center mb-6">
                                    <h1 className="text-2xl font-bold">Login</h1>
                                    <p className="text-balance text-muted-foreground"></p>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register("email")}
                                            name="email"
                                            placeholder="m@example.com"
                                            className="lowercase"
                                            required
                                        />
                                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">Password</Label>
                                            <a href="#" className="text-sm text-primary underline-offset-2 hover:underline">
                                                Forgot your password?
                                            </a>
                                        </div>
                                        <Input id="password" type="password" {...register("password")} name="password" required />
                                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                                    </div>

                                    {(!verified && <Captcha verified={setVerified} />)}

                                    <div className="mt-6 px-2">
                                        <Button
                                            className="w-full"
                                            disabled={isLoading}
                                            type='submit'

                                        >
                                            {isLoading && <Loader2 className="animate-spin" />}
                                            Login
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>}


            </DrawerContent>
        </Drawer>
    );
}