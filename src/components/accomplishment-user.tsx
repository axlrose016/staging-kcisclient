import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/app-daterange';
import { cn } from '@/lib/utils';
import { Download, ExternalLinkIcon, File, Printer, Trash2 } from 'lucide-react';
import { IAccomplishmentActualTask, ICFWAssessment, IPersonProfile, IWorkPlan, IWorkPlanTasks } from '@/components/interfaces/personprofile';
import { IUser } from '@/components/interfaces/iuser';
import { SessionPayload } from '@/types/globals';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { v4 as uuidv4 } from 'uuid';
import { sanitizeHTML } from '@/lib/utils';
import { ILibSchoolProfiles } from './interfaces/library-interface';
import { EditableCell } from './editable-cell';
import AppSubmitReview from './app-submit-review';
import { IAttachments } from './interfaces/general/attachments';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { v5 as uuidv5 } from 'uuid';

export type UserTypes = IPersonProfile & ILibSchoolProfiles;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5
interface AccomplishmentReportFormProps {
    assessment: ICFWAssessment;
    disabled?: boolean
    user: UserTypes | any;
    date: DateRange | undefined;
    setDate?: (date: DateRange | undefined) => void;
    session?: SessionPayload;
    accomplishmentReportId?: string;
    onChangeTask?: (task: IAccomplishmentActualTask[]) => void;
    onChangeAttachments?: (attachment: IAttachments[]) => void;
    supervisorType?: 'supervisor' | 'alternate';
    onSupervisorTypeChange?: (type: 'supervisor' | 'alternate') => void;
}

export function AccomplishmentUser({
    assessment,
    onChangeTask,
    onChangeAttachments,
    disabled = false,
    user,
    date,
    setDate,
    session,
    accomplishmentReportId,
    supervisorType = 'supervisor',
    onSupervisorTypeChange
}: AccomplishmentReportFormProps) {
    const [supervisor, setSupervisor] = useState<IPersonProfile>();
    const [alternateSupervisor, setAlternateSupervisor] = useState<IPersonProfile>();
    const [generalTasks, setGeneralTasks] = useState<IWorkPlanTasks[]>([]);
    const [specificTask, setSpecificTask] = useState<IWorkPlanTasks[]>([]);
    const [otherTask, setOtherTask] = useState<IAccomplishmentActualTask[]>([]);
    const [tasksLoder, setTaskLoader] = useState<IAccomplishmentActualTask[]>([]);
    const [tasks, setTasks] = useState<IAccomplishmentActualTask[]>([]);

    const [attachments, setAttachments] = useState<IAttachments[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!dexieDb.isOpen()) await dexieDb.open();
                // Get work plan for the user

                if (assessment) {
                    const workPlan = await dexieDb.work_plan.where("id").equals(assessment?.work_plan_id || "").first();
                    if (workPlan) {
                        // Get supervisors
                        const supervisor = await dexieDb.person_profile.where("user_id").equals(assessment?.immediate_supervisor_id || "").first();
                        const alternateSupervisor = await dexieDb.person_profile.where("user_id").equals(workPlan?.alternate_supervisor_id || "").first();
                        setSupervisor(supervisor);
                        setAlternateSupervisor(alternateSupervisor);

                        // Get tasks
                        const allTasks = await dexieDb.work_plan_tasks.where("work_plan_id").equals(workPlan.id).toArray();
                        setGeneralTasks(allTasks.filter(i => i.work_plan_category_id == 1));
                        setSpecificTask(allTasks.filter(i => i.work_plan_category_id == 2));

                        console.log('AccomplishmentUser > ', { supervisor_id: assessment?.immediate_supervisor_id, alternate_supervisor_id: workPlan?.alternate_supervisor_id, workPlan, supervisor, alternateSupervisor })
                    }
                }

                // Get other tasks and actual tasks 
                if (accomplishmentReportId) {
                    const otherTask = await dexieDb.accomplishment_actual_task.where({
                        category_id: '99',
                        accomplishment_report_id: accomplishmentReportId
                    }).toArray();

                    setOtherTask(otherTask);
                    const alltask = await dexieDb.accomplishment_actual_task.where("accomplishment_report_id").equals(accomplishmentReportId).toArray()
                    console.log('AccomplishmentUser > alltask', { alltask, otherTask, accomplishmentReportId })
                    setTasks(alltask);
                    setTaskLoader(alltask);
                    onChangeTask?.(alltask)

                    const attachments = await dexieDb.attachments.where("record_id").equals(accomplishmentReportId).toArray()

                    setAttachments(attachments)
                    onChangeAttachments?.(attachments)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [user?.id, accomplishmentReportId]);

    const handleContentEdit = (task: IAccomplishmentActualTask | any, value: string, type: string) => {


        const sanitizedValue = sanitizeHTML(value);
        const index = tasks.findIndex(i => i.remarks == task.id);

        console.log('handleContentEdit', task, value, type, tasks, index)


        if (index > -1) {
            const item = tasks[index];
            const updates = {
                ...item,
                category_id: task.category_id,
                accomplishment: type == "accomplishment" ? sanitizedValue : item.accomplishment,
                mov: type == "movs" ? sanitizedValue : item.mov,
                task: type == "task" ? sanitizedValue : item.task,
            };
            console.log('handleContentEdit > updates', { updates })
            const r = [...tasks.map((t, i) => i === index ? updates : t)]
            setTasks(r)
            onChangeTask?.(r)
            onChangeAttachments?.(attachments)
        } else {
            const newTask: IAccomplishmentActualTask = {
                id: uuidv5(accomplishmentReportId || "", task.id),
                category_id: task?.category_id || 0,
                accomplishment_report_id: accomplishmentReportId || "",
                accomplishment: type == "accomplishment" ? sanitizedValue : "",
                mov: type == "movs" ? sanitizedValue : "",
                task: type == "task" ? sanitizedValue : "",
                status_id: 0,
                created_date: new Date().toString(),
                created_by: session!.userData!.email!,
                last_modified_date: null,
                last_modified_by: "",
                push_status_id: 0,
                push_date: null,
                deleted_date: null,
                deleted_by: "",
                is_deleted: false,
                remarks: task.id,
            };

            const r = [...tasks, newTask]

            console.log('handleContentEdit > newTask', { newTask, r })
            setTasks(r);
            onChangeTask?.(r)
            onChangeAttachments?.(attachments)
        }
    };

    const handleOtherTask = () => {
        const newTask: IAccomplishmentActualTask = {
            id: uuidv4(),
            category_id: '99',
            accomplishment_report_id: accomplishmentReportId || "",
            accomplishment: "",
            mov: "",
            task: "",
            status_id: 0,
            created_date: new Date().toString(),
            created_by: session!.userData!.email!,
            last_modified_date: null,
            last_modified_by: "",
            push_status_id: 0,
            push_date: null,
            deleted_date: null,
            deleted_by: "",
            is_deleted: false,
            remarks: "",
        };
        setOtherTask([...otherTask, newTask]);
        onChangeTask?.(otherTask)
        onChangeAttachments?.(attachments)
    };

    const handleOpenFileOnNewTab = (task: any, idx: number, e: any   , key = 'remarks' , idKey = 'id') => {
        const attachment = attachments.find((i: any) => i[key] == task[idKey])
        // console.log('handleOpenFileOnNewTab', { e, attachment, attachments, task, idx });
        if (attachment) {
            if (attachment.file_path instanceof Blob) {
                window.open(URL.createObjectURL(attachment.file_path), '_blank')
            } else {
                window.open(attachment.file_path as string, '_blank')
            }
        }
    }

    const handleDeleteAttachment = (task: any, idx: number, e: any , key = 'remarks' , idKey = 'id') => { 
        (async () => {

            const updatedTasks = [...tasks];
            const attachment = attachments.find((i: any) => i[key] == task[idKey])
            // console.log('handleDeleteAttachment > attachment', { task, idx, attachment })
            if (attachment) {
                await dexieDb.attachments.put({
                    ...attachment,
                    is_deleted: true,
                    deleted_date: new Date().toISOString(),
                    deleted_by: session!.userData!.email!,
                    last_modified_date: new Date().toISOString(),
                    last_modified_by: session!.userData!.email!,
                    push_status_id: 0,
                })
            }

            const taskIndex = updatedTasks.findIndex(t => t.id === task.id);
            if (taskIndex !== -1) {
                updatedTasks[taskIndex] = {
                    ...updatedTasks[taskIndex],
                    mov: "",
                }
            }
            setTasks(updatedTasks)
            onChangeTask?.(updatedTasks)
            setAttachments(attachments.filter(i => i.remarks != task.id))
            onChangeAttachments?.(attachments)
        })();
    }


    const handleAddAttachment = (task: any, idx: number, e: any , key = 'remarks' , idKey = 'id') => {
        // console.log('handleAddAttachment', { e, task, idx });
        (async () => {
            if (e && e.target.files && e.target.files[0]) {
                const file = e.target.files[0];

                if (file.size > MAX_FILE_SIZE) {
                    toast({
                        title: "File size must be less than 5MB",
                        variant: "destructive",
                    });
                    return;
                }

                // Create a Blob for the file
                const fileBlob = new Blob([file], { type: file.type });
                const taskId = task.id;
                const module_path = "accomplishment report";
                const attachmentId = uuidv5(module_path + "-" + taskId, accomplishmentReportId || "");
                console.log('handleAddAttachment > attachmentId', { taskId, attachmentId, accomplishmentReportId })
                const raw: IAttachments = {
                    id: attachmentId,
                    record_id: accomplishmentReportId!,
                    file_name: file.name,
                    file_type: file.type,
                    file_path: fileBlob,
                    file_id: 100,
                    module_path: module_path,
                    user_id: session!.id,
                    created_date: new Date().toISOString(),
                    created_by: session!.userData.email ?? "",
                    last_modified_date: null,
                    last_modified_by: null,
                    push_status_id: 0,
                    push_date: null,
                    deleted_date: null,
                    deleted_by: null,
                    is_deleted: false,
                    remarks: taskId,
                }

                // Remove any existing attachment for this task
                const filteredAttachments = attachments.filter((a: any) => a[key] !== task[idKey]);
                const newAttachments = [...filteredAttachments, raw];

                setAttachments(newAttachments);
                onChangeAttachments?.(newAttachments);
                setTasks(tasks);
                onChangeTask?.(tasks);
            }
        })();
    }

    const checkImageAttachment = (task: IWorkPlanTasks | IAccomplishmentActualTask | any, idx: number, key = 'remarks' , idKey = 'id') => {
        const attachment = attachments.find((i: any) => i[key] === task[idKey]);
        console.log('checkImageAttachment', { attachment, task, key , attachments   })
        if (!attachment?.file_path) return null;

        if (attachment.file_path instanceof Blob) {
            return URL.createObjectURL(attachment.file_path);
        }
        return null;
    }

    const handleDeleteOtherTask = (task: IAccomplishmentActualTask, idx: number) => {
        setOtherTask(otherTask.filter((_, i) => i !== idx));
    };

    const isCategory = (task: IWorkPlanTasks | IAccomplishmentActualTask): boolean => {
        return 'activities_tasks' in task ?
            task.activities_tasks === "General Activities/Tasks" || task.activities_tasks === "Specific Activities/Tasks" :
            task.task === "General Activities/Tasks" || task.task === "Specific Activities/Tasks";
    };

    return (
        <>
            <div className='flex flex-col gap-2 mb-8 mt-3'>
                <div className="grid grid-cols-1 sm:grid-cols-4  gap-2 md:grid-cols-4">
                    <div className="col-span-1 font-bold leading-none">FULL NAME (Last Name, First Name, Middle Name, Ext)</div>
                    <div className="col-span-1 text-gray-900 leading-none">{user?.first_name} {user?.last_name}</div>
                    <div className="col-span-1 font-bold leading-none">Period Cover:<span className='text-red-600'>*</span></div>
                    <div className="col-span-1 text-gray-900 leading-none">
                        <DatePickerWithRange className='cursor-pointer' value={date} onChange={setDate!} />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 md:grid-cols-4">
                    <div className="col-span-1 font-bold leading-none">SCHOOL GRADUATED/ENROLLED:</div>
                    <div className="col-span-1 text-gray-900 leading-none">{user?.school_name}</div>
                    <div className="col-span-1 font-bold leading-none">CFWP ID NO.</div>
                    <div className="col-span-1 text-gray-900 leading-none">{user?.cfwp_id_no}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 md:grid-cols-4">
                    <div className="col-span-1 font-bold leading-none">AREA OF ASSIGNMENT (Office and Address):</div>
                    <div className="col-span-1 text-gray-900 leading-none">{user?.school_address}</div>
                    <div className="col-span-1 font-bold leading-none"></div>
                    <div className="col-span-1 text-gray-900 leading-none"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 md:grid-cols-4">
                    <div className="col-span-1 font-bold leading-none">NAME OF IMMEDIATE SUPERVISOR:</div>
                    <div className="col-span-1 text-gray-900 leading-none">{supervisor?.first_name} {supervisor?.last_name}</div>
                    <div className="col-span-1 font-bold leading-none"></div>
                    <div className="col-span-1 text-gray-900 leading-none"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 md:grid-cols-4">
                    <div className="col-span-1 font-bold leading-none">NAME OF ALTERNATE IMMEDIATE SUPERVISOR:</div>
                    <div className="col-span-1 text-gray-900 leading-none">{alternateSupervisor?.first_name} {alternateSupervisor?.last_name}</div>
                    <div className="col-span-1 font-bold leading-none"></div>
                    <div className="col-span-1 text-gray-900 leading-none"></div>
                </div>
            </div>

            <div className="mb-6">
                <div className="relative rounded-md border shadow-sm overflow-x-auto max-w-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[275px] border-r font-bold text-black">Task/Deliverables based on the approved Work Plan</TableHead>
                                <TableHead className="w-[300px] border-r min-w-[450px] text-center font-bold text-black">Accomplishments</TableHead>
                                <TableHead className="w-[300px] min-w-[300px] text-center font-bold text-black">MOVs (if any)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {generalTasks.length !== 0 ? <>
                                <TableRow
                                    key={"general"}
                                    className={cn({
                                        "bg-muted/50 font-semibold": true,
                                    })}
                                >
                                    <TableCell className={cn("align-top!w-[275px]", {
                                        "text-primary font-semibold": true,
                                        "text-muted-foreground": false,
                                    })}>
                                        General Activities/Tasks
                                    </TableCell>
                                    <TableCell
                                        className="align-top"
                                    />
                                    <TableCell
                                        className="align-top"
                                    />
                                </TableRow>

                                {generalTasks.map((task, idx) => (
                                    <TableRow
                                        key={task.id}
                                        className={cn({
                                            "bg-muted/50 font-semibold": false,
                                        })}
                                    >
                                        <TableCell
                                            className={cn("align-top border-r w-[275px]", {
                                                "text-primary font-semibold": isCategory(task),
                                                "text-muted-foreground": false,
                                            })}>
                                            {task.activities_tasks}
                                        </TableCell>


                                        <EditableCell
                                            disabled={disabled}
                                            key={(tasksLoder.find(i => i.remarks == task.id)?.id ?? "genAccom2") + "genAccom" + idx}
                                            placeholder={["CFW Beneficiary", "Guest"].includes(session?.userData.role!) ? "Write Actual Tasks..." : ""}
                                            value={tasksLoder.find(i => i.remarks == task.id)?.accomplishment ?? ""}
                                            onDebouncedChange={(val) => handleContentEdit(task, val || "", "accomplishment")}
                                        />

                                        <EditableCell
                                            disabled={disabled}
                                            key={task.id + "genMov" + idx}
                                            placeholder={["CFW Beneficiary", "Guest"].includes(session?.userData.role!) ? "Attachment Links here..." : ""}
                                            value={tasksLoder.find(i => i.remarks == task.id)?.mov || ""}
                                            onDebouncedChange={(val) => handleContentEdit(task, val || "", "movs")}
                                            beforeInput={<div className='flex flex-row gap-2'>
                                                {checkImageAttachment(task, idx) && (
                                                    <div className="relative">
                                                        <Image
                                                            className='my-2'
                                                            src={checkImageAttachment(task, idx) || ""}
                                                            alt="attachment"
                                                            width={300}
                                                            height={300}
                                                        />

                                                        <div className='absolute top-2 right-2'>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                                                                onClick={(e: any) => handleOpenFileOnNewTab(task, idx, e)}
                                                            >
                                                                <ExternalLinkIcon className="h-4 w-4" />
                                                                <span className="sr-only">open attachment</span>
                                                            </Button>
                                                            {session?.userData.role == "CFW Beneficiary" &&
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                                                                    onClick={(e: any) => handleDeleteAttachment(task, idx, e)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                    <span className="sr-only">Delete attachment</span>
                                                                </Button>
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                            </div>}
                                            element={<div id="no-print" className="text-right flex justify-right items-end">
                                                <div className="items-center">
                                                    <input
                                                        id={`gen-file-input-${task.id}`}
                                                        type="file"
                                                        className="hidden"
                                                        onChange={(e: any) => handleAddAttachment(task, idx, e)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        accept="image/*"
                                                    />
                                                    {session?.userData.role == "CFW Beneficiary" &&
                                                        <Button
                                                            variant="outline"
                                                            size="lg"
                                                            className="h-10 w-10 p-0 text-destructive hover:text-destructive/90"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                const fileInput = document.getElementById(`gen-file-input-${task.id}`) as HTMLInputElement;
                                                                if (fileInput) {
                                                                    fileInput.value = '';
                                                                    fileInput.click();
                                                                }
                                                            }}
                                                        >
                                                            <File className="h-6 w-6" />
                                                            <span className="sr-only">Upload</span>
                                                        </Button>
                                                    }
                                                </div>
                                            </div>}
                                        />
                                    </TableRow>
                                ))}
                            </> : null}

                            {specificTask.length !== 0 ? <>
                                <TableRow
                                    key={"specific"}
                                    className={cn({
                                        "bg-muted/50 font-semibold": true,
                                    })}
                                >
                                    <TableCell className={cn("align-top w-[275px]", {
                                        "text-primary font-semibold": true,
                                        "text-muted-foreground": false,
                                    })}>
                                        Specific Activities/Tasks
                                    </TableCell>
                                    <TableCell
                                        className="align-top"
                                    />
                                    <TableCell
                                        className="align-top"
                                    />
                                </TableRow>

                                {specificTask.map((task, idx) => (
                                    <TableRow
                                        key={task.id}
                                        className={cn({
                                            "bg-muted/50 font-semibold": false,
                                        })}
                                    >
                                        <TableCell className={cn("align-top border-r w-[275px]", {
                                            "text-primary font-semibold": isCategory(task),
                                            "text-muted-foreground": false,
                                        })}>
                                            {task.activities_tasks}
                                        </TableCell>

                                        <EditableCell
                                            disabled={disabled}
                                            key={(tasksLoder.find(i => i.remarks == task.id)?.id ?? "specAccom2") + "specAccom" + idx}
                                            placeholder={["CFW Beneficiary", "Guest"].includes(session?.userData.role!) ? "Write Actual Tasks..." : ""}
                                            value={tasksLoder.find(i => i.remarks == task.id)?.accomplishment ?? ""}
                                            onDebouncedChange={(val) => handleContentEdit(task, val || "", "accomplishment")}
                                        />

                                        <EditableCell
                                            disabled={disabled}
                                            key={task.id + "specMov" + idx}
                                            placeholder={["CFW Beneficiary", "Guest"].includes(session?.userData.role!) ? "Attachments Link here..." : ""}
                                            value={tasksLoder.find(i => i.remarks == task.id)?.mov ?? ""}
                                            onDebouncedChange={(val) => handleContentEdit(task, val || "", "movs")}
                                            beforeInput={<div className='flex flex-row gap-2'>
                                                {checkImageAttachment(task, idx) && (
                                                    <div className="relative">
                                                        <Image
                                                            className='my-2'
                                                            src={checkImageAttachment(task, idx) || ""}
                                                            alt="attachment"
                                                            width={300}
                                                            height={300}
                                                        />

                                                        <div className='absolute top-2 right-2'>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                                                                onClick={(e: any) => handleOpenFileOnNewTab(task, idx, e)}
                                                            >
                                                                <ExternalLinkIcon className="h-4 w-4" />
                                                                <span className="sr-only">open attachment</span>
                                                            </Button>
                                                            {session?.userData.role == "CFW Beneficiary" &&
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                                                                    onClick={(e: any) => handleDeleteAttachment(task, idx, e)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                    <span className="sr-only">Delete attachment</span>
                                                                </Button>
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                            </div>}
                                            element={<div id="no-print" className="text-right flex justify-right items-end">
                                                <div className="items-center">
                                                    <input
                                                        id={`spec-file-input-${task.id}`}
                                                        type="file"
                                                        className="hidden"
                                                        onChange={(e: any) => handleAddAttachment(task, idx, e)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        accept="image/*"
                                                    />
                                                    {session?.userData.role == "CFW Beneficiary" &&
                                                        <Button
                                                            variant="outline"
                                                            size="lg"
                                                            className="h-10 w-10 p-0 text-destructive hover:text-destructive/90"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                const fileInput = document.getElementById(`spec-file-input-${task.id}`) as HTMLInputElement;
                                                                if (fileInput) {
                                                                    fileInput.value = '';
                                                                    fileInput.click();
                                                                }
                                                            }}
                                                        >
                                                            <File className="h-6 w-6" />
                                                            <span className="sr-only">Upload</span>
                                                        </Button>
                                                    }
                                                </div>
                                            </div>}
                                        />
                                    </TableRow>
                                ))}
                            </> : null}
 
                            {otherTask.length !== 0 ? <>
                                <TableRow
                                    key={"othertask"}
                                    className={cn({
                                        "bg-muted/50 font-semibold": true,
                                    })}
                                >
                                    <TableCell className={cn("align-top w-[275px]", {
                                        "text-primary font-semibold": true,
                                        "text-muted-foreground": false,
                                    })}>
                                        Other Tasks
                                    </TableCell>
                                    <TableCell
                                        className="align-top"
                                    />
                                    <TableCell
                                        className="align-top"
                                    />
                                </TableRow>

                                {otherTask.map((task, idx) => (
                                    <TableRow
                                        key={task.id}
                                        className={cn({
                                            "bg-muted/50 font-semibold": false,
                                        })}
                                    >
                                        <EditableCell
                                            disabled={disabled}
                                            placeholder={["CFW Beneficiary", "Guest"].includes(session?.userData.role!) ? "Write Activity or Task title" : ""}
                                            className={cn("align-top border-r w-[250px]", {
                                                "text-primary font-semibold": isCategory(task),
                                                "text-muted-foreground": false,
                                            })}
                                            value={task.task}
                                            onDebouncedChange={(val) => handleContentEdit(task, val || "", "task")}
                                        />

                                        <EditableCell
                                            disabled={disabled}
                                            placeholder={["CFW Beneficiary", "Guest"].includes(session?.userData.role!) ? "Write Actual Tasks..." : ""}
                                            value={task.accomplishment}
                                            onDebouncedChange={(val) => handleContentEdit(task, val || "", "accomplishment")}
                                        />

                                        <EditableCell
                                            disabled={disabled}
                                            placeholder={["CFW Beneficiary", "Guest"].includes(session?.userData.role!) ? "Attachments Link here..." : ""}
                                            value={task.mov}
                                            onDebouncedChange={(val) => handleContentEdit(task, val || "", "movs")}
                                            beforeInput={<div className='flex flex-row gap-2'>
                                                {checkImageAttachment(task, idx , 'remarks' , 'remarks') && (
                                                    <div className="relative">
                                                        <Image
                                                            className='my-2'
                                                            src={checkImageAttachment(task, idx , 'remarks' , 'remarks' ) || ""}
                                                            alt="attachment"
                                                            width={300}
                                                            height={300}
                                                        />

                                                        <div className='absolute top-2 right-2'>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                                                                onClick={(e: any) => handleOpenFileOnNewTab(task, idx, e , 'remarks' , 'remarks')}
                                                            >
                                                                <ExternalLinkIcon className="h-4 w-4" />
                                                                <span className="sr-only">open attachment</span>
                                                            </Button>
                                                            {session?.userData.role == "CFW Beneficiary" &&
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                                                                    onClick={(e: any) => handleDeleteAttachment(task, idx, e , 'remarks' , 'remarks')}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                    <span className="sr-only">Delete attachment</span>
                                                                </Button>
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                            </div>}
                                            element={<div id="no-print" className="text-right flex justify-right items-end">
                                                <div onClick={() => handleDeleteOtherTask(task, idx)} className="flex gap-2 items-center">
                                                    <input
                                                        id={`other-file-input-${task.id}`}
                                                        type="file"
                                                        className="hidden"
                                                        onChange={(e: any) => handleAddAttachment(task, idx, e)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        accept="image/*"
                                                    />
                                                    {session?.userData.role == "CFW Beneficiary" &&
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="lg"
                                                                className="h-10 w-10 p-0 text-destructive hover:text-destructive/90"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    const fileInput = document.getElementById(`other-file-input-${task.id}`) as HTMLInputElement;
                                                                    if (fileInput) {
                                                                        fileInput.value = '';
                                                                        fileInput.click();
                                                                    }
                                                                }}
                                                            >
                                                                <File className="h-6 w-6" />
                                                                <span className="sr-only">Del</span>
                                                            </Button>

                                                            <Button
                                                                variant="outline"
                                                                size="lg"
                                                                className="h-10 w-10 p-0 text-destructive hover:text-destructive/90"
                                                            >
                                                                <Trash2 className="h-6 w-6" />
                                                                <span className="sr-only">Del</span>
                                                            </Button>
                                                        </>
                                                    }
                                                </div>
                                            </div>}
                                        />
                                    </TableRow>
                                ))}
                            </> : null}

                            <TableRow
                                id="no-print"
                                key={"others"}
                                className={cn({
                                    "bg-muted/50 font-semibold h-6 cursor-pointer": true,
                                })}
                            >
                                <TableCell className={cn("align-top w-[275px] text-center flex justify-center items-center", {
                                    "text-primary font-semibold": true,
                                    "text-muted-foreground": false,
                                })}
                                    colSpan={3} >
                                    <div onClick={() => handleOtherTask()} className="left-0 right-0 absolute">
                                        <span>Click to Add Other Task</span>
                                    </div>
                                </TableCell>
                                <TableCell
                                    className="align-top"
                                />
                                <TableCell
                                    className="align-top"

                                />
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className='flex flex-col my-6'>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="col-span-1">
                        <p className='font-bold'>Prepared by:</p>
                        <p className='mt-8'>{user?.first_name} {user?.last_name}</p>
                        <p className='font-bold'>Beneficiary</p>
                    </div>
                    <div className="col-span-1">
                        <p className='font-bold'>Signed and Approved by:</p>

                        {supervisorType === 'supervisor' ? (
                            <p className='mt-8'>
                                {supervisor ? (
                                    <>
                                        {supervisor.first_name} {supervisor.last_name}
                                    </>
                                ) : (
                                    <span style={{
                                        display: 'inline-block',
                                        borderBottom: '2px solid #000',
                                        minWidth: '220px',
                                        height: '1.2em',
                                        verticalAlign: 'bottom'
                                    }}>&nbsp;</span>
                                )}
                            </p>
                        ) : (
                            <p className='mt-8'>
                                {alternateSupervisor ? (
                                    <>
                                        {alternateSupervisor.first_name} {alternateSupervisor.last_name}
                                    </>
                                ) : (
                                    <span style={{
                                        display: 'inline-block',
                                        borderBottom: '2px solid #000',
                                        minWidth: '220px',
                                        height: '1.2em',
                                        verticalAlign: 'bottom'
                                    }}>&nbsp;</span>
                                )}
                            </p>
                        )}
                        <div className="flex items-center gap-2">
                            <select
                                className="border rounded py-1 font-bold print:border-0 print:appearance-none print:hidden"
                                value={supervisorType}
                                onChange={(e) => {
                                    onSupervisorTypeChange?.(e.target.value as 'supervisor' | 'alternate');
                                }}
                            >
                                <option value="supervisor">Immediate Supervisor</option>
                                <option value="alternate">Alternate Supervisor</option>
                            </select>
                            <span className="hidden print:block font-bold">
                                {supervisorType === 'supervisor' ? 'Immediate Supervisor' : 'Alternate Supervisor'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 