import React, { useEffect, useState } from 'react'
import { Textarea } from './ui/textarea'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { Button } from './ui/button'
import { AlertCircle, CheckCircle, Clock, FileCheck, FileClock, FileSearch2, FileWarning, History, MessageSquare, Save, X } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { format, formatDistance } from 'date-fns'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ScrollArea } from './ui/scroll-area'
import { ISubmissionLog } from './interfaces/cfw-payroll'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { SessionPayload } from '@/types/globals'
import { IRoles } from './interfaces/library-interface'
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb'
import { libDb } from '@/db/offline/Dexie/databases/libraryDb'


interface IReview {
    id: string | undefined,
    record_id: string | undefined,
    bene_id: string | undefined | null,
    module: string | undefined,
    comment: string | undefined,
    status_id: number | string | undefined,
    status_date: string | null | undefined,
    created_date: string | null | undefined,
    created_by: string | undefined
}

export interface LibraryOption {
    id: string;
    name: string;
}

export interface IAppSubmitReviewProps {
    openHistory?: boolean;
    session: SessionPayload;
    title?: string;
    review_logs: ISubmissionLog[];
    review: IReview;
    options: LibraryOption[];
    onSubmit: (review: any) => void;
    onChange?: (review: any) => void;
}

function AppSubmitReview(props: IAppSubmitReviewProps) {
    const {
        openHistory = false,
        session,
        title = "General Remarks",
        options,
        review,
        review_logs,
        onSubmit,
        onChange
    } = props;

    const [roles, setRoles] = useState<IRoles[]>([]);
    const [currentReview, setCurrentReview] = useState<IReview>(review);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showHistory, setShowHistory] = useState(true);
    const [activeSession, setSession] = useState<SessionPayload>();
    const logs = review_logs.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())

    useEffect(() => {
        (async () => {
            const r = await libDb.roles.toArray();
            setRoles(r)
        })();

        setCurrentReview(review);
        setSession(session)

        if (["Guest", "CFW Beneficiary"].includes(session?.userData.role!)) {
            setShowHistory(true)
        } else {
            setShowHistory(false)
        }
    }, [review, session]);

    const handleReviewChange = (updatedReview: Partial<IReview>) => {
        const newReview = { ...currentReview, ...updatedReview };
        setCurrentReview(newReview);
        onChange?.(newReview);
    };

    const handleSubmit = () => {
        onSubmit(currentReview);
        setIsDialogOpen(false);
        setCurrentReview({
            ...currentReview,
            comment: "",
            status_id: 0
        })
    };

    const hasStatus = Boolean(currentReview.status_id);
    // console.log('Appsubmission > session', session, !session, activeSession?.userData.role == "Guest", showHistory)

    if (!session || !activeSession?.userData?.role || (["Guest", "CFW Beneficiary"].includes(activeSession.userData.role) && review_logs.length === 0)) {
        return <></>
    }

    return (
        <div className="space-y-3 animate-in gap-0 fade-in-50 duration-500">
            <hr className='h-1/5 my-6 bg-black' />
            <div className="flex justify-between items-start md:items-center">
                <div className="flex flex-col md:flex-row items-center gap-3">
                    <h3 className="text-lg self-start font-semibold">{title}</h3>
                </div>


                {openHistory ? null : activeSession?.userData.role !== "Guest" && review_logs.length !== 0 && <>
                    {!showHistory ? <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHistory(!showHistory)}
                        className={cn(
                            "text-muted-foreground hover:text-foreground",
                            showHistory && "bg-secondary"
                        )}
                    >
                        <History className="h-4 w-4 mr-2" />
                        History
                    </Button> : <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHistory(!showHistory)}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Add Review
                    </Button>}
                </>}

            </div>

            {(openHistory || (showHistory && review_logs && review_logs.length > 0)) && (
                <ReviewLogs options={options} logs={logs} />
            )}

            {/* {review.comment !== "" && !showHistory && <Alert>
                <AlertDescription>
                    <b>{options.find(i => i.id == review.status)?.name}</b>:  {review.comment}
                </AlertDescription>
            </Alert>} */}

            {(openHistory || (activeSession?.userData.role !== "Guest" && !showHistory)) && <>
                <Textarea
                    value={currentReview.comment}
                    onChange={(e) => handleReviewChange({ comment: e.target.value })}
                    placeholder="Enter your Feedback/Response or Comments here..."
                    className="min-h-[120px] resize-none transition-all duration-200 mb-4"
                />

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="w-full sm:w-auto transition-all duration-200 hover:shadow-md"
                    >
                        <Save className="mr-1.5 h-4 w-4" />
                        Submit Review
                    </Button>

                    <div className="relative w-full sm:w-[200px]">
                        <Select
                            
                            value={currentReview.status_id || 0 || ''}
                            
                            onValueChange={(value) => handleReviewChange({
                                status_id: value,
                                status_date: new Date().toISOString()
                            })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((option) => (
                                    <SelectItem
                                        key={option.id}
                                        value={option.id}
                                        className="flex items-center"
                                    >
                                        <div className="flex items-center">
                                            {option.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </>}

            {currentReview.status_id !== 0 && <ReviewDialog
                options={options}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                review={currentReview}
                onConfirm={handleSubmit}
            />}
        </div>
    )
}


interface StatusBadgeProps {
    status: string | undefined;
    className?: string;
}

const statusConfig = {
    Approved: {
        color: 'bg-green-50 text-green-700 border-green-200',
        icon: CheckCircle,
        label: 'Approved'
    },
    Completed: {
        color: 'bg-green-50 text-green-700 border-green-200',
        icon: FileCheck,
        label: 'Completed'
    },
    Rejected: {
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: X,
        label: 'Rejected'
    },
    'For Review': {
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: FileSearch2,
        label: 'For Review'
    },
    'For Compliance': {
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        icon: FileWarning,
        label: 'For Compliance'
    },
    'Revised': {
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: FileClock,
        label: 'Revised'
    },
    default: {
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: AlertCircle,
        label: 'Unknown'
    }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.default;
    const Icon = config.icon;

    return (
        <div className={cn(
            'inline-flex items-center px-3 py-1 rounded-full border transition-all duration-200',
            config.color,
            className
        )}>
            <Icon className="h-4 w-4 mr-1.5 animate-in fade-in-50" />
            <span className="text-sm font-medium">{config.label}</span>
        </div>
    );
}


interface TimeDisplayProps {
    date: string | null | undefined;
    prefix?: string;
}

export function TimeDisplay({ date, prefix = "Updated" }: TimeDisplayProps) {
    if (!date) return null;

    const formattedDate = new Date(date);
    const relativeTime = formatDistance(formattedDate, new Date(), { addSuffix: true });
    const absoluteTime = format(formattedDate, 'PPpp'); // Format: Mar 14, 2023, 2:30 PM

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Clock className="h-3.5 w-3.5 mr-1 opacity-70" />
                    <span>{prefix}: {relativeTime}</span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{absoluteTime}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}


interface ReviewLogsProps {
    options: LibraryOption[];
    logs: ISubmissionLog[];
}

export function ReviewLogs({ logs, options }: ReviewLogsProps) {

    if (!logs || logs.length === 0) return null;

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-bolds">Review History</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <ScrollArea>
                    <div className="space-y-4">
                        {logs.map((log, index) => {
                            const status = options.find(i => Number(i.id) == Number(log.status_id))
                            return <div key={log.id || index} className="border-b pb-3 last:border-b-0 last:pb-0">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center">
                                        {log.status_id && <StatusBadge status={status?.name ?? ""} className="mr-2" />}
                                        {log.created_by && (
                                            <span className="text-sm font-medium">{log.created_by}</span>
                                        )}
                                    </div>
                                    {log.created_date && (
                                        <TimeDisplay date={log.created_date} prefix="Submitted" />
                                    )}
                                </div>
                                {log.comment && (
                                    <div className="flex items-start mt-1.5">
                                        <MessageSquare className="h-4 w-4 mx-2 mt-0.5 text-muted-foreground" />
                                        <p className="text-sm">{log.comment}</p>
                                    </div>
                                )}
                            </div>
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}


interface ReviewDialogProps {
    options: any[],
    open: boolean;
    onOpenChange: (open: boolean) => void;
    review: IReview;
    onConfirm: () => void;
}

export function ReviewDialog({ open, onOpenChange, review, onConfirm, options }: ReviewDialogProps) {
    const status = options.find(i => i.id == review.status_id)
    const dialogTitle = `Confirm Submission`;

    const dialogDescription = status.name
        ? `You're about to mark this record as "${status.name}". This action will be logged and timestamped.`
        : 'Please review your comments before submitting.';

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        {dialogTitle}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                        {dialogDescription}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {review.comment && (
                    <div className="mt-2 mb-4">
                        <div className="text-sm font-medium mb-1">Comment:</div>
                        <div className="bg-muted p-3 rounded-md text-sm max-h-[150px] overflow-y-auto">
                            {review.comment}
                        </div>
                    </div>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel className="transition-all duration-200">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="transition-all duration-200"
                    >
                        Confirm & Submit
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
export default AppSubmitReview