import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/app-daterange';
import { cn } from '@/lib/utils';
import { Download, Printer, Trash2 } from 'lucide-react';
import { IAccomplishmentActualTask, IPersonProfile, IWorkPlanTasks } from '@/components/interfaces/personprofile';
import { IUser } from '@/components/interfaces/iuser';
import { SessionPayload } from '@/types/globals';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { v4 as uuidv4 } from 'uuid';
import { sanitizeHTML } from '@/lib/utils';
import { ILibSchoolProfiles } from './interfaces/library-interface';
import { EditableCell } from './editable-cell';
import AppSubmitReview from './app-submit-review';

export type UserTypes = IPersonProfile & ILibSchoolProfiles;
interface AccomplishmentReportFormProps {
    disabled?: boolean
    user: UserTypes | any;
    date: DateRange | undefined;
    setDate?: (date: DateRange | undefined) => void;
    session?: SessionPayload;
    accomplishmentReportId?: string;
    onChangeTask?: (task: IAccomplishmentActualTask[]) => void;
    supervisorType?: 'supervisor' | 'alternate';
    onSupervisorTypeChange?: (type: 'supervisor' | 'alternate') => void;
}

export function AccomplishmentUser({
    onChangeTask,
    disabled = false,
    user,
    date,
    setDate,
    session,
    accomplishmentReportId,
    supervisorType = 'supervisor',
    onSupervisorTypeChange
}: AccomplishmentReportFormProps) {
    const [supervisor, setSupervisor] = useState<IUser>();
    const [alternateSupervisor, setAlternateSupervisor] = useState<IUser>();
    const [generalTasks, setGeneralTasks] = useState<IWorkPlanTasks[]>([]);
    const [specificTask, setSpecificTask] = useState<IWorkPlanTasks[]>([]);
    const [otherTask, setOtherTask] = useState<IAccomplishmentActualTask[]>([]);
    const [tasks, setTasks] = useState<IAccomplishmentActualTask[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!dexieDb.isOpen()) await dexieDb.open();
                // Get work plan for the user
                const userWorkPlan = await dexieDb.work_plan_cfw.where("cfw_id").equals(user?.id || "").first();
                if (userWorkPlan) {
                    const workPlan = await dexieDb.work_plan.where("id").equals(userWorkPlan.work_plan_id).first();
                    if (workPlan) {
                        // Get supervisors
                        setSupervisor(await dexieDb.users.where("id").equals(workPlan.immediate_supervisor_id).first());
                        setAlternateSupervisor(await dexieDb.users.where("id").equals(workPlan.alternate_supervisor_id).first());

                        // Get tasks
                        const allTasks = await dexieDb.work_plan_tasks.where("work_plan_id").equals(workPlan.id).toArray();
                        setGeneralTasks(allTasks.filter(i => i.work_plan_category_id == 1));
                        setSpecificTask(allTasks.filter(i => i.work_plan_category_id == 2));
                    }
                }

                // Get other tasks and actual tasks 
                if (accomplishmentReportId) {
                    setOtherTask(await dexieDb.accomplishment_actual_task.where({
                        category_id: "99",
                        accomplishment_report_id: accomplishmentReportId
                    }).toArray());
                    const alltask = await dexieDb.accomplishment_actual_task.where("accomplishment_report_id").equals(accomplishmentReportId).toArray()
                    setTasks(alltask);
                    onChangeTask?.(alltask)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [user?.id, accomplishmentReportId]);

    const handleContentEdit = (task: IAccomplishmentActualTask | any, value: string, type: string) => {
        const sanitizedValue = sanitizeHTML(value);
        const index = tasks.findIndex(i => i.id == task.id);

        if (index > -1) {
            const item = tasks[index];
            const updates = {
                ...item,
                category_id: task.category_id,
                accomplishment: type == "accomplishment" ? sanitizedValue : item.accomplishment,
                mov: type == "movs" ? sanitizedValue : item.mov,
                task: type == "task" ? sanitizedValue : item.task,
            };
            setTasks(tasks.map((t, i) => i === index ? updates : t));
        } else {
            const newTask: IAccomplishmentActualTask = {
                id: task.id,
                category_id: task?.category_id?.toString() || "",
                accomplishment_report_id: accomplishmentReportId || "",
                accomplishment: type == "accomplishment" ? sanitizedValue : "",
                mov: type == "movs" ? sanitizedValue : "",
                task: type == "task" ? sanitizedValue : "",
                status_id: 0,
                created_date: new Date().toString(),
                created_by: session!.userData!.email!,
                last_modified_date: "",
                last_modified_by: "",
                push_status_id: 0,
                push_date: "",
                deleted_date: "",
                deleted_by: "",
                is_deleted: false,
                remarks: "",
            };

            const r = [...tasks, newTask]
            setTasks(r);
            onChangeTask?.(r)
        }
    };

    const handleOtherTask = () => {
        const newTask: IAccomplishmentActualTask = {
            id: uuidv4(),
            category_id: "99",
            accomplishment_report_id: accomplishmentReportId || "",
            accomplishment: "",
            mov: "",
            task: "",
            status_id: 0,
            created_date: new Date().toString(),
            created_by: session!.userData!.email!,
            last_modified_date: "",
            last_modified_by: "",
            push_status_id: 0,
            push_date: "",
            deleted_date: "",
            deleted_by: "",
            is_deleted: false,
            remarks: "",
        };
        setOtherTask([...otherTask, newTask]);
    };

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
                        <DatePickerWithRange value={date} onChange={setDate} />
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
                    <div className="col-span-1 text-gray-900 leading-none">{supervisor?.username}</div>
                    <div className="col-span-1 font-bold leading-none"></div>
                    <div className="col-span-1 text-gray-900 leading-none"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 md:grid-cols-4">
                    <div className="col-span-1 font-bold leading-none">NAME OF ALTERNATE IMMEDIATE SUPERVISOR:</div>
                    <div className="col-span-1 text-gray-900 leading-none">{alternateSupervisor?.username}</div>
                    <div className="col-span-1 font-bold leading-none"></div>
                    <div className="col-span-1 text-gray-900 leading-none"></div>
                </div>
            </div>

            <div className="mb-6">
                <div className="relative rounded-md border shadow-sm overflow-x-auto max-w-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[350px] border-r min-w-[320px] font-bold text-black">Task/Deliverables based on the approved Work Plan</TableHead>
                                <TableHead className="w-[250px] border-r min-w-[350px] text-center font-bold text-black">Accomplishments</TableHead>
                                <TableHead className="w-[250px]  min-w-[250px] text-center font-bold text-black">MOVs (if any)</TableHead>
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
                                    <TableCell className={cn("align-top w-[400px]", {
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
                                            className={cn("align-top border-r w-[400px]", {
                                                "text-primary font-semibold": isCategory(task),
                                                "text-muted-foreground": false,
                                            })}>
                                            {task.activities_tasks}
                                        </TableCell>

                                        <EditableCell
                                            disabled={disabled}
                                            key={(tasks.find(i => i.id == task.id)?.accomplishment ?? "genAccom") + idx}
                                            placeholder={session?.userData.role == "Guest" ? "Write Actual Tasks..." : ""}
                                            value={tasks.find(i => i.id == task.id)?.accomplishment ?? ""}
                                            onDebouncedChange={(val) => handleContentEdit(task, val || "", "accomplishment")}
                                        />

                                        <EditableCell
                                            disabled={disabled}
                                            key={(tasks.find(i => i.id == task.id)?.mov ?? "genMov") + idx}
                                            placeholder={session?.userData.role == "Guest" ? "Attachments Link here..." : ""}
                                            value={tasks.find(i => i.id == task.id)?.mov ?? ""}
                                            onDebouncedChange={(val) => handleContentEdit(task, val || "", "movs")}
                                        />
                                    </TableRow>
                                ))}
                            </> : null}

                            {specificTask.length !== 0 ? <>
                                <TableRow
                                    key={"general"}
                                    className={cn({
                                        "bg-muted/50 font-semibold": true,
                                    })}
                                >
                                    <TableCell className={cn("align-top w-[400px]", {
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
                                        <TableCell className={cn("align-top border-r w-[400px]", {
                                            "text-primary font-semibold": isCategory(task),
                                            "text-muted-foreground": false,
                                        })}>
                                            {task.activities_tasks}
                                        </TableCell>
                                        <EditableCell
                                            disabled={disabled}
                                            key={(tasks.find(i => i.id == task.id)?.accomplishment ?? "specAccom") + idx}
                                            placeholder={session?.userData.role == "Guest" ? "Write Actual Tasks..." : ""}
                                            value={tasks.find(i => i.id == task.id)?.accomplishment ?? ""}
                                            onDebouncedChange={(val) => handleContentEdit(task, val || "", "accomplishment")}
                                        />

                                        <EditableCell
                                            disabled={disabled}
                                            key={(tasks.find(i => i.id == task.id)?.mov ?? "specMov") + idx}
                                            placeholder={session?.userData.role == "Guest" ? "Attachments Link here..." : ""}
                                            value={tasks.find(i => i.id == task.id)?.mov ?? ""}
                                            onDebouncedChange={(val) => handleContentEdit(task, val || "", "movs")}
                                        />
                                    </TableRow>
                                ))}
                            </> : null}

                            {otherTask.length !== 0 ? <>
                                <TableRow
                                    key={"general"}
                                    className={cn({
                                        "bg-muted/50 font-semibold": true,
                                    })}
                                >
                                    <TableCell className={cn("align-top w-[400px]", {
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
                                            key={(tasks.find(i => i.id == task.id)?.task ?? "task") + idx + 'title'}
                                            placeholder={session?.userData.role == "Guest" ? "Write Activity or Task title" : ""}
                                            className={cn("align-top border-r w-[400px]", {
                                                "text-primary font-semibold": isCategory(task),
                                                "text-muted-foreground": false,
                                            })}
                                            value={tasks.find(i => i.id == task.id)?.task ?? ""}
                                            onDebouncedChange={(val) => handleContentEdit(task, val || "", "task")}
                                        />

                                        <EditableCell
                                            disabled={disabled}
                                            key={(tasks.find(i => i.id == task.id)?.accomplishment ?? "accomTask") + idx}
                                            placeholder={session?.userData.role == "Guest" ? "Write Actual Tasks..." : ""}
                                            value={tasks.find(i => i.id == task.id)?.accomplishment ?? ""}
                                            onDebouncedChange={(val) => handleContentEdit(task, val || "", "accomplishment")}
                                        />

                                        <EditableCell
                                            disabled={disabled}
                                            key={((tasks.find(i => i.id == task.id)?.mov)?.toString() ?? "movTask") + idx}
                                            placeholder={session?.userData.role == "Guest" ? "Attachments Link here..." : ""}
                                            value={tasks.find(i => i.id == task.id)?.mov ?? ""}
                                            onDebouncedChange={(val) => handleContentEdit(task, val || "", "movs")}
                                            element={<div id="no-print" className={"text-right flex justify-right items-end"}>
                                                <div onClick={() => handleDeleteOtherTask(task, idx)} className="mt-[10px] mr-[10px]" style={{
                                                    'position': 'absolute',
                                                    'right': 0,
                                                }}>
                                                    <Button
                                                        variant="outline"
                                                        size="lg"
                                                        className="h-10 w-10 p-0 text-destructive hover:text-destructive/90"
                                                    >
                                                        <Trash2 className="h-6 w-6" />
                                                        <span className="sr-only">Del</span>
                                                    </Button>
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
                                <TableCell className={cn("align-top w-[400px] text-center flex justify-center items-center", {
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
                        <p className='mt-8'>{supervisorType === 'supervisor' ? supervisor?.username : alternateSupervisor?.username}</p>
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