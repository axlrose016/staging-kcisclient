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
import { RefreshCw, Info, Loader2, Download, Search, ChevronUp, ChevronDown } from 'lucide-react';
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
import LoginService from '@/components/services/LoginService';
import { useOnlineStatus } from '@/hooks/use-network';
import { isValidTokenString } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

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
    const [isLoading, setIsLoading] = useState(false);
    const [expandedErrors, setExpandedErrors] = useState<Record<string, boolean>>({});
    const [showAllTables, setShowAllTables] = useState(true);
    const [syncingState, setSyncingState] = useState<Record<string, boolean>>({});
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const isOnline = useOnlineStatus();

    const {
        progressStatus,
        summary,
        startSync,
        resetAllTasks,
        resetSummary,
        forceSync,
        setForceSync,
        tasks,
        setTasks,
        setProgressStatus,
    } = useBulkSyncStore();

    useEffect(() => {
        const fetchUser = async () => {
            const _session = await getSession();
            setSession(_session as SessionPayload);
        };
        fetchUser();
    }, [open]);

    const toggleErrors = (tag: string) => {
        setExpandedErrors(prev => ({
            ...prev,
            [tag]: !prev[tag]
        }));
    };

    const handleShowAllTables = async () => {
        if (!session || !loadingTag) return;
        
        setLoadingAll(true);
        setSyncingState(prev => ({ ...prev, [loadingTag]: true }));
        
        try {
            // Reset the specific module's progress
            const currentProgress = { ...progressStatus };
            currentProgress[loadingTag] = {
                ...currentProgress[loadingTag],
                success: 0,
                failed: 0,
                errors: [],
                state: "in progress",
                totalRecords: 0,
            };
            setProgressStatus(loadingTag, currentProgress[loadingTag]);
            
            // Reload the specific module's data
            await startSync(session, loadingTag);
        } finally {
            setLoadingAll(false);
            setSyncingState(prev => ({ ...prev, [loadingTag]: false }));
            setShowAllTables(true);
            setLoadingTag(null);
        }
    };

    const handleResync = async (tag?: string) => {
        if (!session) return;

        if (tag) {
            setLoadingTag(tag);
            setShowAllTables(false);
            const currentProgress = { ...progressStatus };
            currentProgress[tag] = {
                ...currentProgress[tag],
                success: 0,
                failed: 0,
                errors: [],
                state: "in progress",
                totalRecords: 0,
                isSyncing: true,
            };
            setProgressStatus(tag, currentProgress[tag]);
            await startSync(session, tag);
            setLoadingTag(null);
            setShowAllTables(true);
        } else {
            setLoadingAll(true);
            setShowAllTables(true);
            resetAllTasks();
            await startSync(session);
            setLoadingAll(false);
        }
    };

    const progressTasks = Object.values(progressStatus);
    const filteredTasks = progressTasks.filter((task) => {
        const matchesSearch = task.tag.toLowerCase().includes(searchTerm.toLowerCase());
        return showAllTables ? matchesSearch : (matchesSearch && (loadingTag === task.tag || task.state === "in progress"));
    });

    const totalSynced = summary.totalSynced;
    const totalErrors = summary.totalErrors;
    const totalRecords = summary.totalRecords;
    const totalForceSync = tasks.filter(t => t.force).length;
    const overallPercentage = summary.overallPercentage;

    const lastSyncedAt = progressTasks.length
        ? Math.max(
            ...progressTasks.map((t) =>
                new Date(t.created_date || summary.lastSyncedAt || Date.now()).getTime()
            )
        )
        : null;

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
        try {
            if (!verified) {
                toast({
                    variant: "destructive",
                    title: "Captcha Error!",
                    description: "Invalid Captcha, Please try again!",
                });
                setIsLoading(false)
                return;
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
            <DrawerContent className="px-4 pb-6">
                <DrawerHeader className="border-b pb-4">
                    <DrawerTitle className="text-center text-lg font-semibold flex items-center justify-center gap-2">
                        {!session?.token ? (
                            "Credential Login"
                        ) : (
                            <>
                                <span>Sync Summary</span>
                                {loadingAll && (
                                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                )}
                            </>
                        )}
                    </DrawerTitle>
                </DrawerHeader>

                {isValidTokenString(session?.token) ? (
                    <>
                        <div className="mt-4 mb-4">
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Search sync tags..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-8"
                                />
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>

                        <ScrollArea className="h-[calc(100vh-280px)]">
                            <div className="space-y-4 px-2">
                                {filteredTasks.map((task) => {
                                    const { tag, success, failed, state, totalRecords } = task;
                                    const total = success + failed;
                                    const percentage = total ? Math.floor((success / total) * 100) : 0;
                                    const taskErrors = summary.errorList?.filter((e) => e.tag === tag);
                                    const taskConfig = tasks.find(t => t.tag === tag);
                                    const isExpanded = expandedErrors[tag] || false;
                                    const isSyncing = loadingTag === tag;

                                    return (
                                        <div
                                            key={tag}
                                            className={`border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors ${
                                                isSyncing ? 'ring-2 ring-primary/20' : ''
                                            }`}
                                        >
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <span className={`w-2 h-2 rounded-full ${getStateColor(state)}`} />
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <span className="font-medium truncate max-w-[380px] block" title={tag}>
                                                                        {tag}
                                                                    </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent>{tag}</TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        disabled={progressStatus[tag]?.isSyncing}
                                                                        onClick={() => handleResync(tag)}
                                                                        className={progressStatus[tag]?.isSyncing ? 'animate-pulse' : ''}
                                                                    >
                                                                        {progressStatus[tag]?.isSyncing ? (
                                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                                        ) : (
                                                                            <RefreshCw className="w-4 h-4" />
                                                                        )}
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Resync</TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-muted-foreground">Progress:</span>
                                                            <span className="font-medium">{percentage}%</span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-muted-foreground">Synced:</span>
                                                                <span className="font-medium text-green-600">{success}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-muted-foreground">Total:</span>
                                                                <span className="font-medium">{totalRecords || total}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Progress
                                                            value={percentage}
                                                            className="h-2 flex-1"
                                                            color={
                                                                percentage === 100
                                                                    ? 'bg-green-400'
                                                                    : taskErrors?.length
                                                                        ? 'bg-red-400'
                                                                        : 'bg-green-200'
                                                            }
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`forceSync-${tag}`}
                                                                checked={taskConfig?.force}
                                                                onCheckedChange={(checked) => {
                                                                    const updatedTasks = tasks.map(t => 
                                                                        t.tag === tag ? { ...t, force: checked as boolean } : t
                                                                    );
                                                                    setTasks(updatedTasks);
                                                                }}
                                                            />
                                                            <label
                                                                htmlFor={`forceSync-${tag}`}
                                                                className="text-xs text-muted-foreground"
                                                            >
                                                                Force
                                                            </label>
                                                        </div>

                                                        {failed > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-4 px-1 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                    onClick={() => toggleErrors(tag)}
                                                                >
                                                                    <Info className="w-2.5 h-2.5 mr-0.5" />
                                                                    {failed} Errors
                                                                    {isExpanded ? (
                                                                        <ChevronUp className="w-2.5 h-2.5 ml-0.5" />
                                                                    ) : (
                                                                        <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="h-4 px-1 text-[10px]"
                                                                    onClick={() => handleExportErrors(taskErrors || [], tag)}
                                                                >
                                                                    <Download className="w-2.5 h-2.5 mr-0.5" />
                                                                    Export
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {failed > 0 && isExpanded && (
                                                        <div className="text-[10px] text-red-500 bg-red-50 p-1.5 rounded-md mt-1">
                                                            {taskErrors?.map((e, i) => (
                                                                <div key={i} className="mb-0.5 last:mb-0">
                                                                    <span className="font-medium">ID {e.record.id}:</span> {e.error_message}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>

                        <Separator className="my-4" />

                        <div className="space-y-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">Overall Progress</p>
                                            <p className="text-sm font-medium">{overallPercentage}</p>
                                        </div>
                                        <Progress
                                            value={parseInt(overallPercentage)}
                                            className="h-2"
                                            color="bg-green-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="space-y-1 text-center">
                                            <p className="text-xs text-muted-foreground">Total Records</p>
                                            <p className="text-lg font-semibold">{totalRecords}</p>
                                        </div>
                                        <div className="space-y-1 text-center">
                                            <p className="text-xs text-muted-foreground">Synced</p>
                                            <p className="text-lg font-semibold text-green-600">{totalSynced}</p>
                                        </div>
                                        <div className="space-y-1 text-center">
                                            <p className="text-xs text-muted-foreground">Errors</p>
                                            <p className="text-lg font-semibold text-red-600">{totalErrors}</p>
                                        </div>
                                        <div className="space-y-1 text-center">
                                            <p className="text-xs text-muted-foreground">Force Sync</p>
                                            <p className="text-lg font-semibold text-blue-600">{totalForceSync}</p>
                                        </div>
                                    </div>

                                    {lastSyncedAt && (
                                        <p className="text-xs text-muted-foreground text-center">
                                            Last synced: {formatDistanceToNow(new Date(lastSyncedAt), { addSuffix: true })}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {!showAllTables && (
                                    <Button
                                        className="flex-1"
                                        variant="outline"
                                        onClick={handleShowAllTables}
                                        disabled={loadingAll}
                                    >
                                        {loadingAll ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <Search className="w-4 h-4 mr-2" />
                                        )}
                                        Show All Tables
                                    </Button>
                                )}
                                <Button
                                    className={showAllTables ? "w-full" : "flex-1"}
                                    disabled={loadingAll}
                                    onClick={() => handleResync()}
                                >
                                    {loadingAll ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                    )}
                                    Sync All
                                </Button>
                            </div>
                        </div>
                    </>
                ) : <div className='min-w-[450px]'>

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