"use client"
import { Pencil, FilePlus, Cross, FilePlus2 } from "lucide-react";
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ChevronLeft, ChevronRight, Users, ClipboardList, ListTodo, Eye, Save, Edit, Trash2 } from "lucide-react"
import { AppTable } from "@/components/app-table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { SessionPayload } from '@/types/globals';
import { getSession } from '@/lib/sessions-client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { v4 as uuidv4 } from 'uuid';
import LoginService from "@/components/services/LoginService";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb"
import { ICFWAssessment, IWorkPlan, IWorkPlanTasks } from "@/components/interfaces/personprofile"
import { useParams, useRouter } from "next/navigation"
import { cleanArray, cn } from "@/lib/utils";
import { getParsedLocalStorage } from "@/components/utils/utils";
// checklist
// deployment_area_short_name_supervisor ✅
// deployment_area_supervisor ✅
// selectedBeneficiaries✅
// work plan
// title


const columnsMasterlist = [

    {
        id: 'status_name',
        header: 'Status',
        accessorKey: 'STATUS/DEPLOYED AT',
        filterType: 'text',
        sortable: true,
        align: "center",
        cell: (value: any) => <Badge variant={value == "Available" ? "green" : "default"
        } >{value}</Badge>
    },
    {
        id: 'full_name',
        header: 'Full Name',
        accessorKey: 'FULL NAME',
        filterType: 'text',
        sortable: true,
        align: "left",


    },

    {
        id: 'course_name',
        header: 'Course Name',
        accessorKey: 'COURSE',
        filterType: 'text',
        sortable: true,
        align: "left",

    },
    {
        id: 'school_name',
        header: 'School Name',
        accessorKey: 'SCHOOL NAME',
        filterType: 'text',
        sortable: true,
        align: "left",

    },

];
let totalNumberOfSelectedBeneficiaries = 0
let totalNumberOfTasks = 0

const _session = await getSession() as SessionPayload;
type WizardProps = {
    title?: string
    description?: string
    beneficiariesData?: any[]
    workPlanDetails?: any
    workPlanTasks?: any[]
    noOfSelectedBeneficiaries?: number
    noOfTasks?: number
    deploymentAreaName?: string
    mode?: any

}



export default function Wizard({ title, description, beneficiariesData, workPlanDetails, workPlanTasks, noOfSelectedBeneficiaries, noOfTasks, deploymentAreaName, mode }: WizardProps) {
    const params = useParams();
    const id = params?.id as string;

    const [formMode, setFormMode] = useState(mode)

    const [currentStep, setCurrentStep] = useState(0)
    const router = useRouter()
    const [totalNoOfTasks, setTotalNoOfTasks] = useState(0)

    const [deploymentAreaNameSup, setDeploymentAreaNameSup] = useState(deploymentAreaName)
    const [workPlanTitle, setWorkPlanTitle] = useState<string>("")
    const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<any[]>(
        (beneficiariesData || []).filter(
            (b) => b?.full_name?.trim() !== ""
        )
    );
    // const [workPlanData, setWorkPlanData] = useState<any>(workPlanDetails || {});
    const [workPlanData, setWorkPlanData] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("work_plan");
            return stored ? JSON.parse(stored) : {};
        }
        return {};
    });

    const [workPlanTasksData, setWorkPlanTasksData] = useState<IWorkPlanTasks[]>([]);


    // {
    //     "DB ID": 295,
    //     "ID": "01f98bb8-8d91-4416-8e6d-3a35decf39ab",
    //     "STATUS/DEPLOYED AT": "Available",
    //     "FULL NAME": "FN33 MN3 LN33",
    //     "SCHOOL NAME": "QUEZON CITY UNIVERSITY",
    //     "DEPLOYMENT AREA": "Department of Social Welfare and Development - National Program Management Office",
    //     "COURSE": "BACHELOR OF SCIENCE IN ACCOUNTANCY"
    // }
    useEffect(() => {
        localStorage.setItem("current_work_plan_id", id)
    }, [id])

    const steps = [
        {
            id: "beneficiaries",
            name: "Beneficiaries" + " (" + totalNumberOfSelectedBeneficiaries + ")",
            icon: <Users className="h-5 w-5" />,
            component: <BeneficiariesStep beneficiariesData={beneficiariesData} />,
        },
        {
            id: "workplan",
            name: "Work Plan Details",
            icon: <ClipboardList className="h-5 w-5" />,
            component: <WorkPlanStep workPlanDetails={workPlanDetails} />,
        },
        {
            id: "tasks",
            name: "Tasks" + " (" + totalNumberOfTasks + ")",
            icon: <ListTodo className="h-5 w-5" />,
            component: <TasksStep workPlanTasks={workPlanTasks} />,
        },
        {
            id: "preview",
            name: "Preview",
            icon: <Eye className="h-5 w-5" />,
            component: <PreviewStep setCurrentStep={setCurrentStep} />,
        },
        {
            id: "submitted",
            name: "Submitted",
            icon: <CheckCircle className="h-5 w-5" />,
            component: <SubmittedStep />,
        },
    ]

    function totalNumberOfSelectedBenes() {
        const lsSB = localStorage.getItem("selectedBeneficiaries");
        if (lsSB) {
            const parsedlsSB = JSON.parse(lsSB);
            return parsedlsSB.length;
        }
        return 0;
    }

    const saveWorkPlanToDexieDb = async (workplanid: string) => {

        const lsWP = localStorage.getItem("work_plan");

        if (!lsWP) {
            console.warn("⚠️ No work_plan found in localStorage.");
            return;
        }

        const parsedWP = JSON.parse(lsWP);

        await dexieDb.transaction("rw", dexieDb.work_plan, async () => {
            const existing = await dexieDb.work_plan.get(workplanid);

            if (!existing) {
                console.warn("❌ Work plan not found in Dexie, can't update.");
                return;
            }

            // Only override specific fields from localStorage
            const updatedWorkPlan = {
                ...existing,
                work_plan_title: parsedWP.work_plan_title ?? existing.work_plan_title,
                immediate_supervisor_id: parsedWP.immediate_supervisor_id ?? existing.immediate_supervisor_id,
                // deployment_area_name: parsedWP.deployment_area_name ?? existing.deployment_area_name,
                office_name: parsedWP.office_name ?? existing.office_name,
                no_of_days_program_engagement: parsedWP.no_of_days_program_engagement ?? existing.no_of_days_program_engagement,
                approved_work_schedule_from: parsedWP.approved_work_schedule_from ?? existing.approved_work_schedule_from,
                approved_work_schedule_to: parsedWP.approved_work_schedule_to ?? existing.approved_work_schedule_to,
                objectives: parsedWP.objectives ?? existing.objectives,
                last_modified_date: new Date().toISOString(),
                last_modified_by: _session?.userData?.email ?? existing.last_modified_by,
                push_date: new Date().toISOString(),
                push_status_id: 2,
                status_id: 0,
                remarks: "Work Plan has been synch upon submission",
            };

            // await dexieDb.work_plan.put(updatedWorkPlan);
            debugger
            const email = "dsentico@dswd.gov.ph";
            const password = "Dswd@123";
            const onlinePayload = await LoginService.onlineLogin(email, password);
            const token = onlinePayload.token;
            await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}work_plan/create/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify([updatedWorkPlan]),

                }
            );
            await dexieDb.work_plan.put(updatedWorkPlan);


            console.log("📝 Saving work plan:", updatedWorkPlan);
            console.log("✅ Work plan updated in Dexie:", updatedWorkPlan);
        });

        // const lsWP = localStorage.getItem("work_plan")
        // if (!lsWP) return
        // debugger
        // const parsedWP = JSON.parse(lsWP)
        // await dexieDb.transaction("rw", dexieDb.work_plan, async () => {
        //     const existing = await dexieDb.work_plan.get(workplanid);

        //     if (!existing) {
        //         console.warn("❌ Work plan not found in Dexie, can't update.");
        //         return;
        //     }

        //     console.log("📦 Existing WP:", existing);
        //     console.log("📦 Parsed WP from localStorage:", parsedWP);

        //     const workPlanToSave = {
        //         ...existing,
        //         id: workplanid,
        //         approved_work_schedule_from: parsedWP.hasOwnProperty("approved_work_schedule_from")
        //             ? parsedWP.approved_work_schedule_from
        //             : existing.approved_work_schedule_from,
        //         approved_work_schedule_to: parsedWP.hasOwnProperty("approved_work_schedule_to")
        //             ? parsedWP.approved_work_schedule_to
        //             : existing.approved_work_schedule_to,
        //         created_by: _session?.userData?.email ?? existing.created_by,
        //         last_modified_by: _session?.userData?.email ?? existing.last_modified_by,
        //         last_modified_date: new Date().toISOString(),
        //         no_of_days_program_engagement: parsedWP.hasOwnProperty("no_of_days_program_engagement")
        //             ? parsedWP.no_of_days_program_engagement
        //             : existing.no_of_days_program_engagement,
        //         objectives: parsedWP.hasOwnProperty("objectives")
        //             ? parsedWP.objectives
        //             : existing.objectives,
        //         office_name: parsedWP.hasOwnProperty("office_name")
        //             ? parsedWP.office_name
        //             : existing.office_name,
        //         push_date: new Date().toISOString(),
        //         push_status_id: 2,
        //         remarks: "Work Plan updated in DexieDB",
        //         status_id: 0,
        //         work_plan_title: parsedWP.hasOwnProperty("work_plan_title")
        //             ? parsedWP.work_plan_title
        //             : existing.work_plan_title,
        //     };

        //     debugger
        //     const email = "dsentico@dswd.gov.ph";
        //     const password = "Dswd@123";
        //     const onlinePayload = await LoginService.onlineLogin(email, password);
        //     const token = onlinePayload.token;
        //     await dexieDb.work_plan.put(workPlanToSave);
        //     await fetch(
        //         `${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}work_plan/create/`,
        //         {
        //             method: "POST",
        //             headers: {
        //                 Authorization: `bearer ${token}`,
        //                 "Content-Type": "application/json",
        //             },
        //             body: JSON.stringify([workPlanToSave]),

        //         }
        //     );


        //     console.log("📝 Saving work plan:", workPlanToSave);

        // });

    }

    const saveWorkPlanTasksToDexieDb = async (workplanid: string) => {
        // debugger
        const workPlanTasksLS = localStorage.getItem("work_plan_tasks");
        if (workPlanTasksLS) {

            const parsed = JSON.parse(workPlanTasksLS || "");
            const collectedTasks: IWorkPlanTasks[] = Array.isArray(parsed)
                ? parsed.map((task: any) => ({
                    id: uuidv4(),
                    work_plan_id: workplanid, // task.work_plan_id || "",
                    activities_tasks: task.activities_tasks || "",
                    expected_output: task.expected_output || "",
                    work_plan_category_id: task.category_id || "",
                    timeline_from: task.timeline_from || "",
                    timeline_to: task.timeline_to || "",
                    assigned_person_id: task.assigned_person_id == "all" ? null : task.assigned_person_id,
                    created_date: new Date().toISOString(),
                    created_by: _session.userData.email || "",
                    last_modified_date: null,
                    last_modified_by: null,
                    deleted_date: null,
                    deleted_by: null,
                    remarks: "Work Plan Tasks has been created",
                    is_deleted: false,
                    status_id: 0,
                    push_status_id: 2,
                    push_date: new Date().toISOString(),
                    // work_plan_category_id: task.category_id || "",
                    // category_id: task.category_id || "",
                    // assigned_person_name: task.assigned_person_name || "",
                }))
                : [];

            // await db.tasks.bulkPut(collectedTasks);
            // await dexieDb.work_plan_tasks.clear();
            await dexieDb.work_plan_tasks.bulkPut(collectedTasks)
            const email = "dsentico@dswd.gov.ph";
            const password = "Dswd@123";
            const onlinePayload = await LoginService.onlineLogin(email, password);
            const token = onlinePayload.token;
            debugger
            await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}work_plan_task/create/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(
                        collectedTasks.map(ct => ({
                            id: uuidv4(),
                            work_plan_id: workplanid,
                            work_plan_category_id: ct.work_plan_category_id,
                            activities_tasks: ct.activities_tasks,
                            expected_output: ct.expected_output,
                            timeline_from: ct.timeline_from,
                            timeline_to: ct.timeline_to,
                            assigned_person_id: ct.assigned_person_id === "all" ? null : ct.assigned_person_id,
                            created_date: new Date().toISOString(),
                            created_by: _session.userData?.email,
                            last_modified_date: null,
                            last_modified_by: null,
                            deleted_date: null,
                            deleted_by: null,
                            remarks: "Work Plan Task Created",
                            is_deleted: false,
                            status_id: 0,
                            push_status_id: 2,
                            push_date: new Date().toISOString(),
                        }))
                    ),
                }
            );
            console.log("All tasks saved successfully.");

        }
    }

    const saveWorkPlanSelectedBenes = async (workplanid: string) => {
        // debugger
        const workPlanSelectedBenes = localStorage.getItem("selectedBeneficiaries");
        if (workPlanSelectedBenes) {
            const email = "dsentico@dswd.gov.ph";
            const password = "Dswd@123";

            try {
                const onlinePayload = await LoginService.onlineLogin(email, password);
                const token = onlinePayload.token;

                const WP = localStorage.getItem("work_plan");

                if (WP) {
                    const parsedWP = JSON.parse(WP);
                    const parsedWPSB = JSON.parse(workPlanSelectedBenes);

                    const payloads = parsedWPSB.map((sb: any) => ({
                        person_profile_id: sb.person_profile_id || sb.ID,
                        last_modified_date: new Date().toISOString(),
                        last_modified_by: _session.userData.email,
                        remarks: "Bene has been tagged in Work Plan",
                        division_office_name: parsedWP.office_name,
                        number_of_days_program_engagement: parsedWP.no_of_days_program_engagement,
                        immediate_supervisor_id: parsedWP.immediate_supervisor_id,
                        work_plan_id: parsedWP.id,
                        push_date: new Date().toISOString(),
                    }));

                    // 🔁 Loop with `for...of` to await each request
                    for (const payload of payloads) {
                        try {
                            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}cfw_assessment/update/`, {
                                method: "POST",
                                headers: {
                                    Authorization: `bearer ${token}`, // Capital B
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify([payload]), // still sent as an array
                            });

                            if (!res.ok) {
                                console.error(`❌ Failed to push person_profile_id ${payload.person_profile_id || payload.ID}`);
                            } else {
                                console.log(`✅ Synced person_profile_id ${payload.person_profile_id || payload.ID}`);
                            }
                        } catch (err) {
                            console.error("❌ Error syncing bene:", err);
                        }
                    }
                }
            } catch (err) {
                console.error("❌ Login failed or other error:", err);
            }
        }
    }

    const submitWorkPlanWPTaskSelectedBenes = async () => {
        let workplanid = ""
        const ls = localStorage.getItem("work_plan")
        if (ls) {
            const pLS = JSON.parse(ls)
            workplanid = pLS.id
        }
        // if (!params || !params.id) return; // 🚫 guard clause

        // const id = Array.isArray(params.id) ? params.id[0] : params.id;
        // if (id == "new") {
        //     workplanid = uuidv4()
        //     // localStorage.removeItem("selectedBeneficiaries")
        //     // return
        // } else {
        //     workplanid = id
        // }
        // let workplanid = uuidv4()
        saveWorkPlanToDexieDb(workplanid)
        saveWorkPlanTasksToDexieDb(workplanid)
        saveWorkPlanSelectedBenes(workplanid)
        return
        const timer = setTimeout(() => {
            router.push("/personprofile/work-plan"); // Relative path
            // or use full URL: router.push("http://localhost:3000/personprofile/work-plan");
        }, 3000);

        // synch

        return
        const email = "dsentico@dswd.gov.ph";
        const password = "Dswd@123";
        const onlinePayload = await LoginService.onlineLogin(email, password);
        const token = onlinePayload.token;

        // update the benes data from cfw_assessment
        // division_office_name, number_of_days_engagement, immediate_supervisor_id where _id, updated_at, last_modified_by
        const WorkPlanSelectedBene = localStorage.getItem("selectedBeneficiaries")


        // save work plan details



        const workPlanTasksLS = localStorage.getItem("work_plan_tasks");
        if (workPlanTasksLS) {
            try {
                saveWorkPlanTasksToDexieDb(workplanid)
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}work_plan_task/create/`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        // body: JSON.stringify(
                        // collectedTasks.map(ct => ({
                        //     id: uuidv4(),
                        //     work_plan_id: workplanid,
                        //     work_plan_category_id: ct.work_plan_category_id,
                        //     activities_tasks: ct.activities_tasks,
                        //     expected_output: ct.expected_output,
                        //     timeline_from: ct.timeline_from,
                        //     timeline_to: ct.timeline_to,
                        //     assigned_person_id: ct.assigned_person_id === "all" ? null : ct.assigned_person_id,
                        //     created_date: new Date().toISOString(),
                        //     created_by: _session.userData?.email,
                        //     last_modified_date: null,
                        //     last_modified_by: null,
                        //     deleted_date: null,
                        //     deleted_by: null,
                        //     remarks: "Work Plan Task Created",
                        //     is_deleted: false,
                        //     status_id: 0,
                        //     push_status_id: 2,
                        //     push_date: new Date().toISOString(),
                        // }))
                        // ),
                    }
                );
                debugger;
                // Save all tasks in parallel using Promise.all
                // await Promise.all(collectedTasks.map(async (ct) => {
                //     await fetch(
                //         `${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}work_plan_task/create/`,
                //         {
                //             method: "POST",
                //             headers: {
                //                 Authorization: `bearer ${token}`,
                //                 "Content-Type": "application/json",
                //             },
                //             body: JSON.stringify([{
                //                 id: uuidv4(),
                //                 work_plan_id: workplanid,
                //                 work_plan_category_id: ct.work_plan_category_id,
                //                 activities_tasks: ct.activities_tasks, //
                //                 expected_output: ct.expected_output, //
                //                 timeline_from: ct.timeline_from,
                //                 timeline_to: ct.timeline_to,
                //                 assigned_person_id: ct.assigned_person_id == "all" ? null : ct.assigned_person_id,
                //                 created_date: new Date().toISOString(),
                //                 created_by: _session.userData?.email,
                //                 last_modified_date: null, //
                //                 last_modified_by: null,
                //                 deleted_date: null,
                //                 deleted_by: null, //
                //                 remarks: "Work Plan Task Created",
                //                 is_deleted: false, //
                //                 status_id: 0,
                //                 push_status_id: 2,
                //                 push_date: new Date().toISOString(), //
                //             }])
                //         }
                //     );
                // }));

                console.log("All tasks saved successfully.");
                // work_plan ✅
                // work_plan_task ✅
                // cfw_assessment - update the immediate_supervisor_id, number_of_days_program_engagement, division_office_name
                // work_plan_cfw



                // setWorkPlanTasksData(collectedTasks);
                // console.log("WPTasks", collectedTasks)
            } catch {
                setWorkPlanTasksData([]);
            }
        }





        console.log("Work Plan Tasks", workPlanTasksData)
        return
        // work_plan/create/
        // alert("WOrk Plan Title: " + workPlanData.work_plan_title)

        // return
        // alert("Submitting the work plan" + workPlanData?.id)
        const lsWP = localStorage.getItem("work_plan")
        if (lsWP) {
            // const parsedWP = JSON.parse(lsWP)
            // setWorkPlanData(parsedWP)
        }


        if (!workPlanData.work_plan_title) {
            toast({
                title: "Saving",
                description: "Work Plan Title is missing",
                variant: "destructive"
            })
            return
        }





        const workPlanCreate = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}work_plan/create/`,
            {
                method: "POST",
                headers: {
                    Authorization: `bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([{
                    "id": workplanid,
                    "created_by": _session.userData?.email,
                    "remarks": "Work Plan Created",
                    "work_plan_title": workPlanData.work_plan_title,
                    "immediate_supervisor_id": _session.id,
                    "objectives": workPlanData.objectives,
                    "no_of_days_program_engagement": workPlanData.no_of_days_program_engagement,
                    "approved_work_schedule_from": workPlanData.approved_work_schedule_from,
                    "approved_work_schedule_to": workPlanData.approved_work_schedule_to,
                    "push_status_id": 2,
                    "created_date": new Date().toISOString(),


                }]),
            }
        );

        if (!workPlanCreate.ok) {
            const errormsg = await workPlanCreate.json();
            const errorBody = await workPlanCreate.text(); // safer than .json() in case of non-JSON error
            console.error("❌ Failed to create work plan:", errorBody);

            // alert("Work Plan creation failed because ", errormsg.te);
            return;
        }
        const result = await workPlanCreate.json();
        console.error("❌ Failed to create work plan:", result);

        // save the task details

        // save benes

        // const personData = await workPlanCreate.json();
        console.log("🧔 work plan created", result);
        alert("Work Plan Created Successfully");
    }

    const getWorkPlan_Tasks_Benes_data = () => {


        return;
        const dep_name = localStorage.getItem("deployment_area_supervisor");
        const dep_short_name = localStorage.getItem("deployment_area_short_name_supervisor");
        const workPlanDetailsLS = localStorage.getItem("work_plan");
        console.log("Deployment Area Name: ", dep_name, dep_short_name);
        let parsed: any = {};
        if (workPlanDetailsLS) {
            try {
                parsed = JSON.parse(workPlanDetailsLS || "");
                setWorkPlanData(parsed);
                // if (typeof parsed !== "object" || parsed === null) {
                //     parsed = {};
                // }
            } catch {
                parsed = {};
            }
        }
        if (dep_name) {
            parsed.deployment_area_name = dep_name;
            parsed.deployment_area_short_name = dep_short_name;
            parsed.work_plan_title = workPlanTitle;
        }
        setWorkPlanData(parsed);
        return;


        const selectedBeneficiariesLS = localStorage.getItem("selectedBeneficiaries");
        if (selectedBeneficiariesLS) {
            try {
                const parsed = JSON.parse(selectedBeneficiariesLS || "");
                setSelectedBeneficiaries(parsed);
            } catch {
                setSelectedBeneficiaries([]);
            }
        }
        console.log("Selected Beneficiaries: ", selectedBeneficiaries);
        return;




        const workPlanTasksLS = localStorage.getItem("work_plan_tasks");
        if (workPlanTasksLS) {
            try {
                const parsed = JSON.parse(workPlanTasksLS || "");
                setWorkPlanTasksData(Array.isArray(parsed) ? parsed : []);
            } catch {
                setWorkPlanTasksData([]);
            }
        }

        const workPlanTitleTo = localStorage.getItem("work_plan_title_preview");
        setWorkPlanTitle(workPlanTitleTo ?? "")

    }

    // useEffect(() => {
    //     localStorage.setItem("work_plan", JSON.stringify(workPlanData));
    // }, [workPlanData]);

    useEffect(() => {
        // debugger;

        console.log("Work Plan: ", workPlanData);
        console.log("Work Plan type: ", typeof workPlanData);

        console.log("Work Plan Title: ", workPlanTitle);
        console.log("Selected Beneficiaries: ", selectedBeneficiaries);

        const stored = localStorage.getItem("work_plan");
        if (stored) {
            setWorkPlanData(JSON.parse(stored));
        }

        // update the workPlanData 
        // setWorkPlanData((prevData: any) => ({
        //     ...prevData,
        //     deployment_area_name: deploymentAreaNameSup,
        //     work_plan_title: workPlanTitle,
        // }));

        // // update the localStorage
        // localStorage.setItem("work_plan", JSON.stringify({
        //     ...workPlanData,
        //     deployment_area_name: deploymentAreaNameSup,
        //     work_plan_title: workPlanTitle,
        // }));

        // localStorage.setItem("work_plan_title_preview", workPlanTitle);

        // // update the selectedBeneficiaries
        // localStorage.setItem("selectedBeneficiaries", JSON.stringify(selectedBeneficiaries));

        // // update the workPlanTasksData
        // localStorage.setItem("work_plan_tasks", JSON.stringify(workPlanTasksData));

    }, [selectedBeneficiaries, workPlanTasksData, workPlanTitle]);

    const nextStep = () => {

        if (currentStep == 0) {
            const selectedBenes = localStorage.getItem("selectedBeneficiaries")
            if (selectedBenes) {
                let parsedBenes: any[] = [];
                try {
                    parsedBenes = JSON.parse(selectedBenes);
                    if (!Array.isArray(parsedBenes)) {
                        parsedBenes = [];
                    }
                } catch {
                    parsedBenes = [];
                }

                totalNumberOfSelectedBeneficiaries = parsedBenes.length
            }
            if (totalNumberOfSelectedBeneficiaries == 0) {
                toast({
                    title: "Beneficiaries",
                    description: "Please select at least one beneficiary.",
                    variant: "destructive",
                })
                return;
            }


        }

        if (currentStep == 1) {
            // debugger
            const lsWorkPlanDetails = localStorage.getItem("work_plan")
            let parsedWorkPlanDetails: any = {};
            try {
                parsedWorkPlanDetails = JSON.parse(lsWorkPlanDetails ?? "{}");
                if (typeof parsedWorkPlanDetails !== "object") {
                    parsedWorkPlanDetails = {};
                }


                if (parsedWorkPlanDetails?.office_name == "" || parsedWorkPlanDetails?.no_of_days_program_engagement == "" || parsedWorkPlanDetails?.approved_work_schedule_from == "" || parsedWorkPlanDetails?.approved_work_schedule_to == "" || parsedWorkPlanDetails?.objectives == "") {
                    toast({
                        title: "Work Plan Details",
                        description: "Please fill in all required fields.",
                        variant: "destructive",
                    })
                    return;
                }
            } catch {
                parsedWorkPlanDetails = {};
            }



        }

        if (currentStep == 2) {
            // debugger
            const lsWorkPlanTasks = localStorage.getItem("work_plan_tasks")
            let parsedTasks: WorkPlanTasks[] = [];
            try {
                parsedTasks = JSON.parse(lsWorkPlanTasks ?? "[]");
                if (!Array.isArray(parsedTasks)) {
                    parsedTasks = [];
                }
            } catch {
                parsedTasks = [];
            }
            if (parsedTasks.length == 0) {
                toast({
                    title: "Tasks",
                    description: "Please add at least one task.",
                    variant: "destructive",
                })
                return;
            }


        }



        if (currentStep == 3) {
            // getWorkPlan_Tasks_Benes_data() //get everything or prepare before sending to the database
            submitWorkPlanWPTaskSelectedBenes()





            // alert("Submitting the work plan")
        }

        if (currentStep >= 0 && currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }
    // useEffect(() => {
    //     alert("Current Step: " + currentStep)
    // }, [currentStep])
    return (
        <div className="mx-auto px-0 py-8 mt-0">
            {/* Mode: {formMode} */}
            {/* {JSON.stringify(workPlanData)} */}
            {/* {JSON.stringify(beneficiariesData)} */}
            {/* {_session.id} */}
            {/* Deployment Area Name: {workPlanDetails?.deployment_area_name} */}
            {/* {JSON.stringify(workPlanDetails)} */}
            <Card className="w-full">
                <CardHeader>
                    <div className="flex flex-row justify-between items-start">


                        {/* Left side: title and description stacked vertically */}
                        <div className="flex flex-col">
                            <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
                            <CardDescription className="mt-1 text-sm text-muted-foreground">
                                {description}
                            </CardDescription>
                        </div>

                        {/* Right side: mode label */}

                        <div className="flex items-center">
                            <span
                                className={cn(
                                    "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md",
                                    formMode === "editing"
                                        ? "bg-blue-100 text-blue-800"
                                        : formMode === "viewing" || formMode === "new"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                )}
                            >
                                {formMode === "draft" && <FilePlus2 size={16} className="text-black-800" />}
                                {formMode === "editing" && <Pencil size={16} className="text-blue-800" />}
                                {formMode === "viewing" && <Eye size={16} className="text-green-800" />}
                                {!["editing", "viewing", "draft"].includes(formMode) && (
                                    <FilePlus size={16} className="text-gray-800" />
                                )}
                                {formMode.toUpperCase()}
                            </span>
                        </div>

                    </div>
                    <br />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 gap-y-6"><div className="w-full flex items-center">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center w-full">
                                <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {index < currentStep ? <CheckCircle className="h-5 w-5 " /> : step.icon}
                                </div>
                                <div
                                    className={`hidden md:block text-sm mx-2 ${index <= currentStep ? "text-foreground font-medium" : "text-muted-foreground"
                                        }`}
                                >
                                    {step.name}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-2 ${index < currentStep ? "bg-primary" : "bg-muted"}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">{steps[currentStep].component}</CardContent>
                <CardFooter className="flex justify-between border-t p-6">
                    <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        Step {currentStep + 1} of {steps.length}
                    </div>
                    <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
                        {currentStep === steps.length - 2 ? "Submit" : "Next"} <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

function BeneficiariesStep({ beneficiariesData }: WizardProps) {

    const [listOfBeneficiaries, setListOfBeneficiaries] = useState<any[]>(beneficiariesData || [])
    const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<Beneficiary[]>([])


    useEffect(() => {
        const fetchEligibleBenes = async () => {
            const lsWPDAI = getParsedLocalStorage("work_plan_deployment_area_id")
            const lsWPDACI = getParsedLocalStorage("work_plan_deployment_area_category_id")
            const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");

            const eligibleBenesResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}cfw_assessment/view/cfw_assessment_by_deployment_category/`,
                {
                    // const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        Authorization: `bearer ${onlinePayload.token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "deployment_area_category_id": lsWPDACI,
                        "deployment_area_id": lsWPDAI
                    })
                });

            if (!eligibleBenesResponse.ok) {
                const data = await eligibleBenesResponse.json();
                console.log("Error fetching data:", data);
            } else {
                const data = await eligibleBenesResponse.json();
                console.log("👨‍👩‍👧‍👦Eligible Beneficiaries  from api ", data);
                // save to local storage
                // update the cfwassessment from dexiedb
                // fetch the data from localstorage to apptable
                // everytime the table clicks, then update the localstorage, apptable, cfwassessment, database
                localStorage.removeItem("eligible_beneficiaries")
                localStorage.setItem("eligible_beneficiaries", JSON.stringify(data))

                setListOfBeneficiaries(data); //these are the eligible beneficiaries
            }
        }
        fetchEligibleBenes()

        // get the selectedbenes by supervisorid and work plan id
        const fetchSelectedBenes = async () => {

            const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");

            // const ls = getParsedLocalStorage("current_work_plan_id");
            const currentId = localStorage.getItem("current_work_plan_id");

            const workPlanId = currentId === "new" ? uuidv4() : currentId;


            const workPlanRaw = localStorage.getItem("work_plan")
            if (workPlanRaw) {
                const parsedWPRaw = JSON.parse(workPlanRaw)
                parsedWPRaw.id = workPlanId
                localStorage.setItem("work_plan", JSON.stringify(parsedWPRaw));
            }
            // const workPlanId = ls === "new" ? uuidv4() : ls;
            // alert(workPlanId)
            // // Get the existing work_plan object from localStorage
            // const lswp = getParsedLocalStorage("work_plan");

            // // Only proceed if it's a valid object
            // if (lswp && typeof lswp === "object" && lswp !== null) {
            //     lswp.id = workPlanId;
            //     localStorage.setItem("work_plan", JSON.stringify(lswp)); // ✅ Make sure we stringify
            // } else {
            //     console.warn("No valid work_plan object found in localStorage.");
            // }
            const selectedBenes = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}work_plan/view/by_supervisor_and_work_plan/` + _session.id + "/" + workPlanId + "/",
                {

                    method: "GET",
                    headers: {
                        Authorization: `bearer ${onlinePayload.token}`,
                        "Content-Type": "application/json",
                    },

                });

            if (!selectedBenes.ok) {
                const data = await selectedBenes.json();
                console.log("Error fetching data:", data);
            } else {
                const data = await selectedBenes.json();




                localStorage.setItem("selectedBeneficiaries", JSON.stringify(data))
                console.log("Selected Benes", data)
                setSelectedBeneficiaries(data)
            }
        }
        fetchSelectedBenes()

        // const lsWP = getParsedLocalStorage("current_work_plan_id")
        // let workPlanId = lsWP.id
        // alert("work plan id" + id)
        // alert("work plan id" + workPlanId)

    }, [])


    // useEffect(() => {
    //     if (!params || !params.id) return; // 🚫 guard clause

    //     const id = Array.isArray(params.id) ? params.id[0] : params.id;
    //     if (id == "new") {


    //         const ls = getParsedLocalStorage("selectedBeneficiaries")

    //         if (Array.isArray(ls)) {
    //             const filtered = ls.filter(
    //                 (item) =>
    //                     item.work_plan_id === id &&
    //                     item.immediate_supervisor_id === _session.id
    //             );
    //             return
    //             // console.log("Filtered Beneficiaries:", filtered);
    //         }


    //     }

    //     // search 
    //     // ✅ Now it's safe to use `id`
    //     console.log("Work Plan ID:", id);
    //     // alert("Work Plan ID:" + id);

    //     // perform your logic with `id` here

    // }, []);

    const updateLocalStorageBeneImmediateSupervisorId = async (id: string, isSelected: boolean) => {
        // debugger
        const lsEB = getParsedLocalStorage("eligible_beneficiaries")
        if (Array.isArray(lsEB)) {
            const updated = lsEB.map((item: any) =>
                item.ID === id
                    ? { ...item, ["STATUS/DEPLOYED AT"]: isSelected ? "Selected" : "Available" }
                    : item
            );

            localStorage.setItem("eligible_beneficiaries", JSON.stringify(updated));
            const ls = getParsedLocalStorage("eligible_beneficiaries")
            setListOfBeneficiaries(ls)
        }

        // if (Array.isArray(lsEB)) {
        //     for (const item of lsEB) {
        //         // Assuming each item has an ID to match on
        //         const id = item.id || item.bene_id;
        //         if (!id) continue;

        //         // Update only specific fields — customize as needed
        //         await dexieDb.cfwassessment.update(id, {
        //             last_modified_date: new Date().toISOString(),
        //             last_modified_by: _session.userData.email,
        //             remarks: "Selected Beneficiary for work plan",

        //         });
        //     }
        // }
    }


    // useEffect(() => {
    //     const selectedBenes = localStorage.getItem("eligible_beneficiaries")
    //     // const selectedBenes = localStorage.getItem("selectedBeneficiaries")
    //     if (selectedBenes) {
    //         let parsedBenes: any[] = [];
    //         try {
    //             parsedBenes = JSON.parse(selectedBenes);
    //             if (!Array.isArray(parsedBenes)) {
    //                 parsedBenes = [];
    //             }
    //         } catch {
    //             parsedBenes = [];
    //         }

    //         setListOfBeneficiaries(parsedBenes);

    //     }
    // }, [listOfBeneficiaries])

    type Beneficiary = {
        id: string;
        status_name: string;
        full_name: string;
        course_name?: string;
        school_name?: string;
        // is_selected?: string;
        [key: string]: any;
    };

    const handleBeneficiarySelection = (selectedRows: Beneficiary | Beneficiary[]) => {
        const selectedRow = Array.isArray(selectedRows) ? selectedRows[0] : selectedRows;
        if (!selectedRow || selectedRow["STATUS/DEPLOYED AT"] !== "Available") return;

        let parsedBenes: Beneficiary[] = [];
        const selectedBenes = localStorage.getItem("selectedBeneficiaries");

        try {
            parsedBenes = selectedBenes ? JSON.parse(selectedBenes) : [];
            if (!Array.isArray(parsedBenes)) parsedBenes = [];
        } catch {
            parsedBenes = [];
        }

        // debugger
        const existingIndex = parsedBenes.findIndex((bene) => bene.id === (selectedRow?.ID || selectedRow?.person_profile_id));
        if (existingIndex !== -1) {
            parsedBenes.splice(existingIndex, 1);
            toast({
                title: "Beneficiary removed",
                description: `${selectedRow.full_name} has been removed from the selected beneficiaries.`,
                variant: "destructive",
            });
        } else {
            parsedBenes.push(selectedRow);
            updateLocalStorageBeneImmediateSupervisorId(selectedRow.ID, true);
            toast({
                title: "Beneficiary added",
                description: `${selectedRow.full_name} has been added to the selected beneficiaries.`,
                variant: "green",
            });
        }

        // 🔒 Ensure workPlanId is generated or reused
        const currentId = localStorage.getItem("current_work_plan_id");
        const isNew = currentId === "new";
        const workPlanIdDraft = isNew ? uuidv4() : currentId;

        if (isNew) {
            localStorage.setItem("current_work_plan_id", workPlanIdDraft || ""); // ← it's already string
        }

        const workPlanRaw = localStorage.getItem("work_plan");
        if (workPlanRaw) {
            const parsedWPRaw = JSON.parse(workPlanRaw);
            parsedWPRaw.id = workPlanIdDraft;
            localStorage.setItem("work_plan", JSON.stringify(parsedWPRaw));
        }

        const fetchData = async (endpoint: string) => {
            // debugger
            try {
                const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");

                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        Authorization: `bearer ${onlinePayload.token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify([
                        {
                            person_profile_id: selectedRow?.ID,
                            immediate_supervisor_id: _session.id,
                            work_plan_id: workPlanIdDraft,
                            last_modified_date: new Date().toISOString(),
                            last_modified_by: _session.userData.email,
                            push_status_id: 1,
                            push_date: new Date().toISOString(),
                            remarks: "Selected by Supervisor",
                        },
                    ]),
                });

                if (!response.ok) console.error("Failed to update CFW assessment", await response.text());
            } catch (error) {
                console.error("Error sending to API:", error);
            }
        };

        const createDraftWorkPlan = async () => {
            try {
                const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}work_plan/create/`, {
                    method: "POST",
                    headers: {
                        Authorization: `bearer ${onlinePayload.token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify([
                        {
                            id: workPlanIdDraft,
                            created_date: new Date().toISOString(),
                            created_by: _session.userData.email,
                            remarks: "Work Plan Drafted",
                            immediate_supervisor_id: _session.id,
                            status_id: 22,
                            push_status_id: 1,
                            push_date: new Date().toISOString(),
                        },
                    ]),
                });

                if (!res.ok) {
                    console.error("Error creating draft work plan", await res.text());
                } else {
                    const data = await res.json();
                    console.log("Draft work plan created:", data);
                }
            } catch (error) {
                console.error("Draft creation error:", error);
            }
        };

        if (isNew) createDraftWorkPlan();
        fetchData(`${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}cfw_assessment/update/`);

        localStorage.setItem("selectedBeneficiaries", JSON.stringify(parsedBenes));
        setSelectedBeneficiaries(parsedBenes);
        totalNumberOfSelectedBeneficiaries = parsedBenes.length;
    };




    useEffect(() => {
        // debugger;
        const lst = localStorage.getItem("selectedBeneficiaries")
        if (lst) {
            const parsedList = JSON.parse(lst);
            totalNumberOfSelectedBeneficiaries = parsedList.length
            setSelectedBeneficiaries(parsedList);
        }

    }, [])
    // useEffect(() => {
    //     localStorage.setItem("selectedBeneficiaries", JSON.stringify(selectedBeneficiaries));

    // }, [selectedBeneficiaries])
    const handleRemoveBene = async (e: any) => {
        debugger
        // alert(e)
        console.log("👪 Selected BENE", e);
        const targetId = e.ID || e.person_profile_id;
        if (!targetId) {
            console.warn("❌ No valid person_profile_id found");
            return;
        }

        const now = new Date().toISOString();
        const remarks = "Untagged";

        try {
            // 🔐 Login once
            const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");
            const token = onlinePayload.token;

            // 📦 Payloads
            const cfwAssessmentPayload = [{
                person_profile_id: targetId,
                immediate_supervisor_id: null,
                work_plan_id: null,
                last_modified_date: now,
                last_modified_by: _session.userData.email,
                push_status_id: 1,
                push_date: now,
                remarks,
            }];

            const workPlanTaskPayload = [{
                person_profile_id: targetId,
                is_deleted: true,
                deleted_by: _session.userData.email,
                deleted_date: now,
                last_modified_date: now,
                last_modified_by: _session.userData.email,
                push_status_id: 1,
                push_date: now,
                remarks,
            }];

            // 🚀 API call: Update CFW Assessment
            const cfwRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}cfw_assessment/update/`, {
                method: "POST",
                headers: {
                    Authorization: `bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cfwAssessmentPayload),
            });

            if (!cfwRes.ok) {
                const errText = await cfwRes.text();
                console.error("❌ Failed to update CFW assessment:", errText);
            } else {
                console.log("✅ CFW assessment untagged successfully");
            }

            // 🚀 API call: Delete Work Plan Task
            // abang
            // const taskRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}work_plan_task/delete/response/`, {
            //     method: "DELETE",
            //     headers: {
            //         Authorization: `bearer ${token}`,
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(workPlanTaskPayload),
            // });

            // if (!taskRes.ok) {
            //     const errText = await taskRes.text();
            //     console.error("❌ Failed to untag work plan task:", errText);
            // } else {
            //     console.log("✅ Work plan task marked as deleted");
            // }

            // 🧹 Optionally update localStorage and Dexie here

        } catch (error) {
            console.error("❌ Error during untagging process:", error);
        }


        const targetPId = e.ID || e.person_profile_id;

        const updated = selectedBeneficiaries.filter((b: any) =>
            (b.ID || b.person_profile_id) !== targetPId
        );
        setSelectedBeneficiaries(updated);
        localStorage.setItem("selectedBeneficiaries", JSON.stringify(updated));
        totalNumberOfSelectedBeneficiaries = updated.length
        toast({
            title: "Beneficiary removed",
            description: `${e.full_name} has been removed from the selected beneficiaries.`,
            variant: "destructive",
        });
        return
        // if (!data) {
        //     console.warn("⚠️ No selected beneficiaries found in localStorage.");
        //     return null;
        // }

        // try {
        //     const parsed = JSON.parse(data);

        //     // Find matching bene by ID
        //     const match = parsed.find((item: any) =>
        //         item.person_profile_id === targetId || item.ID === targetId
        //     );

        //     if (!match) {
        //         console.warn(`❌ No beneficiary found with ID: ${targetId}`);
        //         return null;
        //     }

        //     // Return desired fields
        //     return {
        //         immediate_supervisor_id: match.immediate_supervisor_id,
        //         work_plan_id: match.work_plan_id,
        //     };
        // } catch (err) {
        //     console.error("❌ Error parsing selectedBeneficiaries from localStorage:", err);
        //     return null;
        // }
        // return;
        // // remove from the database
        // const selectedRow = Array.isArray(selectedRows) ? selectedRows[0] : selectedRows;
        // if (!selectedRow || selectedRow["STATUS/DEPLOYED AT"] !== "Available") return;

        // let parsedBenes: Beneficiary[] = [];
        // const selectedBenes = localStorage.getItem("selectedBeneficiaries");

        // try {
        //     parsedBenes = selectedBenes ? JSON.parse(selectedBenes) : [];
        //     if (!Array.isArray(parsedBenes)) parsedBenes = [];
        // } catch {
        //     parsedBenes = [];
        // }

        // // debugger
        // const existingIndex = parsedBenes.findIndex((bene) => bene.id === selectedRow?.ID);
        // if (existingIndex !== -1) {
        //     parsedBenes.splice(existingIndex, 1);
        //     toast({
        //         title: "Beneficiary removed",
        //         description: `${selectedRow.full_name} has been removed from the selected beneficiaries.`,
        //         variant: "destructive",
        //     });
        // } else {
        //     parsedBenes.push(selectedRow);
        //     updateLocalStorageBeneImmediateSupervisorId(selectedRow.ID, true);
        //     toast({
        //         title: "Beneficiary added",
        //         description: `${selectedRow.full_name} has been added to the selected beneficiaries.`,
        //         variant: "green",
        //     });
        // }

        // // 🔒 Ensure workPlanId is generated or reused
        // const currentId = localStorage.getItem("current_work_plan_id");
        // const isNew = currentId === "new";
        // const workPlanIdDraft = isNew ? uuidv4() : currentId;

        // if (isNew) {
        //     localStorage.setItem("current_work_plan_id", workPlanIdDraft || ""); // ← it's already string
        // }

        // const workPlanRaw = localStorage.getItem("work_plan");
        // if (workPlanRaw) {
        //     const parsedWPRaw = JSON.parse(workPlanRaw);
        //     parsedWPRaw.id = workPlanIdDraft;
        //     localStorage.setItem("work_plan", JSON.stringify(parsedWPRaw));
        // }

        // const fetchData = async (endpoint: string) => {
        //     // debugger
        //     try {
        //         const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");

        //         const response = await fetch(endpoint, {
        //             method: "POST",
        //             headers: {
        //                 Authorization: `bearer ${onlinePayload.token}`,
        //                 "Content-Type": "application/json",
        //             },
        //             body: JSON.stringify([
        //                 {
        //                     person_profile_id: selectedRow?.ID,
        //                     immediate_supervisor_id: _session.id,
        //                     work_plan_id: workPlanIdDraft,
        //                     last_modified_date: new Date().toISOString(),
        //                     last_modified_by: _session.userData.email,
        //                     push_status_id: 1,
        //                     push_date: new Date().toISOString(),
        //                     remarks: "Selected by Supervisor",
        //                 },
        //             ]),
        //         });

        //         if (!response.ok) console.error("Failed to update CFW assessment", await response.text());
        //     } catch (error) {
        //         console.error("Error sending to API:", error);
        //     }
        // };

        // const createDraftWorkPlan = async () => {
        //     try {
        //         const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");
        //         const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}work_plan/create/`, {
        //             method: "POST",
        //             headers: {
        //                 Authorization: `bearer ${onlinePayload.token}`,
        //                 "Content-Type": "application/json",
        //             },
        //             body: JSON.stringify([
        //                 {
        //                     id: workPlanIdDraft,
        //                     created_date: new Date().toISOString(),
        //                     created_by: _session.userData.email,
        //                     remarks: "Work Plan Drafted",
        //                     immediate_supervisor_id: _session.id,
        //                     status_id: 22,
        //                     push_status_id: 1,
        //                     push_date: new Date().toISOString(),
        //                 },
        //             ]),
        //         });

        //         if (!res.ok) {
        //             console.error("Error creating draft work plan", await res.text());
        //         } else {
        //             const data = await res.json();
        //             console.log("Draft work plan created:", data);
        //         }
        //     } catch (error) {
        //         console.error("Draft creation error:", error);
        //     }
        // };

        // if (isNew) createDraftWorkPlan();
        // fetchData(`${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}cfw_assessment/update/`);

        // localStorage.setItem("selectedBeneficiaries", JSON.stringify(parsedBenes));
        // setSelectedBeneficiaries(parsedBenes);
        // totalNumberOfSelectedBeneficiaries = parsedBenes.length;




    }
    return (
        <div >

            <div className="mb-4">
                <div className="flex items-start  bg-blue-50 border-l-4 border-yellow-400 p-4 rounded-md">
                    <span className="mr-3 mt-1 text-yellow-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                        </svg>
                    </span>
                    <div>
                        <h2 className="text-lg font-medium text-yellow-800">Select Beneficiaries</h2>
                        <p className="text-yellow-700">
                            Choose the beneficiaries who are going to deploy under you.
                        </p>
                        <ul className="list-disc list-inside mt-2 text-sm text-yellow-800 space-y-1">
                            <li>You can only select beneficiaries with <span className="font-semibold">Available</span> status.</li>
                            <li>Click on a beneficiary row to add or remove them from your selection.</li>
                            <li>Your selections are saved automatically and will be used in the next steps.</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-4">
                <p className="text-muted-foreground mr-2">Selected Beneficiaries:</p>

                {selectedBeneficiaries.map((bene, idx) => {

                    return (
                        <div key={idx} className="inline-flex items-center mr-2 mb-2">
                            <Badge variant="green" className="flex items-center gap-2 pr-2"  >
                                {bene["FULL NAME"] || bene.full_name}
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="ml-1 h-4 w-4 p-0"
                                    onClick={() => {
                                        handleRemoveBene(bene)
                                        // Remove this beneficiary from selectedBeneficiaries and localStorage
                                        // const updated = selectedBeneficiaries.filter((b: any) => b.ID !== bene.ID);
                                        // setSelectedBeneficiaries(updated);
                                        // localStorage.setItem("selectedBeneficiaries", JSON.stringify(updated));
                                        // totalNumberOfSelectedBeneficiaries = updated.length
                                        // toast({
                                        //     title: "Beneficiary removed",
                                        //     description: `${bene.full_name} has been removed from the selected beneficiaries.`,
                                        //     variant: "destructive",
                                        // });

                                    }}
                                >
                                    <span className="sr-only">Remove</span>
                                    ×
                                </Button>
                            </Badge>
                        </div>
                    )

                })}

            </div>
            {/* <div className="flex flex-wrap mb-4">
                <p className="text-muted-foreground mr-2">Total Number of Selected Beneficiaries: {selectedBeneficiaries.length}</p>
            </div> */}

            <div className="border rounded-md p-6 bg-muted/20">

                <AppTable
                    data={listOfBeneficiaries as any[]}
                    // data={beneficiariesData as any[]}
                    columns={columnsMasterlist}

                    onRowClick={(row) => handleBeneficiarySelection(row)}
                // onRefresh={()=>setSelectedBeneficiaries([])}

                />
            </div>
        </div>
    )
}


function WorkPlanStep({ workPlanDetails }: WizardProps) {
    const [workPlanData, setWorkPlanData] = useState<any>({})
    const [deploymentAreaName, setDeploymentAreaName] = useState("")
    // debugger
    // alert(typeof workPlanDetails)
    // Count the number of keys in the workPlanDetails object
    const workPlanDetailsCount = workPlanDetails ? Object.keys(workPlanDetails).length : 0;

    // alert(`Number of items in workPlanDetails: ${workPlanDetailsCount}`);

    useEffect(() => {

        // get the deployment area name from local storage
        const lsDAN = localStorage.getItem("deployment_area_supervisor")
        if (lsDAN) setDeploymentAreaName(lsDAN)

        // update the deployment area
        const wp = localStorage.getItem("work_plan")
        if (wp) {
            const lsWP = JSON.parse(wp)
            lsWP.deployment_area_name = lsDAN
            localStorage.setItem("work_plan", JSON.stringify(lsWP)) // Persist the change
        }

        // if (lsDAN) {
        //     setDeploymentAreaName(JSON.parse(lsDAN))
        // }


        const workPlanDetails = localStorage.getItem("work_plan")
        if (workPlanDetails) {
            setWorkPlanData(JSON.parse(workPlanDetails));
            // let parsedWorkPlanDetails: any = {};
            // try {
            //     parsedWorkPlanDetails = JSON.parse(workPlanDetails);
            //     if (typeof parsedWorkPlanDetails !== "object") {
            //         parsedWorkPlanDetails = {};
            //     }
            // } catch {
            //     parsedWorkPlanDetails = {};
            // }


        }


    }, [])

    const updateWorkPlanData = (field: string, value: any) => {
        setWorkPlanData((prevData: any) => ({
            ...prevData,
            [field]: value,
        }));

        localStorage.setItem("work_plan", JSON.stringify({
            ...workPlanData,
            [field]: value,
        }));

        // localStorage.setItem("work_plan", JSON.stringify({
        //     ...workPlanData,
        //     [field]: value,
        //     deployment_area_name: deploymentAreaNameSup,
        //     work_plan_title: workPlanTitle,
        // }));
    }
    // function WorkPlanStep({ workPlanDetails, deploymentAreaName }: WizardProps) {
    // const [workPlanDetailsData, setWorkPlanDetailsData] = useState<any>(workPlanDetails || "")
    // const [workPlanTitle, setWorkPlanTitle] = useState("")


    // const updateWorkPlanDetails = (field: string, value: any) => {
    //     // alert("Updating " + field + " to " + value + " in localStorage" + uuidv4())  
    //     const updated = {
    //         ...workPlanDetailsData,
    //         [field]: value,
    //         immediate_supervisor_id: _session.id,
    //         id: workPlanDetailsData?.id || uuidv4(), // Only assign a new ID if one doesn't exist
    //     };

    //     setWorkPlanDetailsData(updated);
    //     localStorage.setItem("work_plan", JSON.stringify(updated));
    // };


    return (
        <div >
            {/* Deployment Area name nato promise: {deploymentAreaName} */}
            {/* Data: {JSON.stringify(workPlanDetailsData)} */}
            <h2 className="text-lg font-medium">Work Plan Details</h2>
            <p className="text-muted-foreground ">Define the overall plan, timeline, and objectives for this program.</p>

            {/* deployment area short name - office - approved from and to - number of bene - number of days */}
            <div className="border rounded-md p-6 bg-muted/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1" htmlFor="deployment_area_name">
                            Deployment Area
                        </label>
                        <input
                            id="deployment_area_name"
                            name="deployment_area_name"
                            type="text"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            value={deploymentAreaName}
                            onChange={(e) => updateWorkPlanData("deployment_area_name", e.target.value)}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="office_name">
                            Name of Office
                        </label>
                        <input
                            id="office_name"
                            name="office_name"
                            type="text"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter office name"
                            value={workPlanData?.office_name || ""}
                            onChange={(e) => updateWorkPlanData("office_name", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="numDays">
                            No. of Days of Program Engagement
                        </label>
                        <input
                            id="no_of_days_program_engagement"
                            name="no_of_days_program_engagement"
                            type="number"
                            min={1}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="e.g. 30"
                            value={workPlanData?.no_of_days_program_engagement || ""}
                            onChange={(e) => updateWorkPlanData("no_of_days_program_engagement", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="scheduleFrom">
                            Approved Schedule (From)
                        </label>
                        <input
                            id="approved_work_schedule_from"
                            name="approved_work_schedule_from"
                            type="date"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            value={workPlanData?.approved_work_schedule_from || ""}
                            onChange={(e) => updateWorkPlanData("approved_work_schedule_from", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="scheduleTo">
                            Approved Schedule (To)
                        </label>
                        <input
                            id="approved_work_schedule_to"
                            name="approved_work_schedule_to"
                            type="date"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            value={workPlanData?.approved_work_schedule_to || ""}
                            onChange={(e) => updateWorkPlanData("approved_work_schedule_to", e.target.value)}
                        />
                    </div>
                    <div className="col-span-full">
                        <label className="block text-sm font-medium mb-1" htmlFor="objectives">
                            General Objectives
                        </label>
                        <textarea
                            id="objectives"
                            name="objectives"
                            rows={4}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Describe the general objectives of the program"
                            value={workPlanData?.objectives || ""}
                            onChange={(e) => updateWorkPlanData("objectives", e.target.value)}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}
type WorkPlanTasks = {
    id: string
    work_plan_id: string
    category_id: string //General, Specific, or Other
    activities_tasks: string
    expected_output: string
    timeline_from: string
    timeline_to: string
    assigned_person_id: string //person_profile_id = record_id
    assigned_person_name: string
}



// type TasksStepProps = {
//     updateWorkPlanData: (field: string, value: any) => void;
// }
function TasksStep({ workPlanTasks, noOfTasks }: WizardProps) {
    const [tasks, setTasks] = useState<WorkPlanTasks[]>([])
    const [newTask, setNewTask] = useState<WorkPlanTasks>({
        id: "",
        work_plan_id: "",
        category_id: "",
        activities_tasks: "",
        expected_output: "",
        timeline_from: "",
        timeline_to: "",
        assigned_person_id: "",
        assigned_person_name: "",
    })
    const [selectedBeneficiariesOptions, setSelectedBeneficiariesOptions] = useState<any[]>([])
    useEffect(() => {
        const lsSelectedBeneficiaries = localStorage.getItem("selectedBeneficiaries")
        if (lsSelectedBeneficiaries) {
            let parsedBenes: any[] = [];
            try {
                parsedBenes = JSON.parse(lsSelectedBeneficiaries);
                if (!Array.isArray(parsedBenes)) {
                    parsedBenes = [];
                }
            } catch {
                parsedBenes = [];
            }

            setSelectedBeneficiariesOptions(parsedBenes);
        }

        const lsWorkPlanTasks = localStorage.getItem("work_plan_tasks")
        if (lsWorkPlanTasks) {
            let parsedTasks: WorkPlanTasks[] = [];
            try {
                parsedTasks = JSON.parse(lsWorkPlanTasks);
                if (!Array.isArray(parsedTasks)) {
                    parsedTasks = [];
                }
            } catch {
                parsedTasks = [];
            }

            setTasks(parsedTasks);
        }
    }, [])
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

    useEffect(() => {
        totalNumberOfTasks = tasks.length
    }, [tasks])
    // Function to handle saving a new task
    const handleSaveTask = () => {
        if (!newTask.category_id || !newTask.activities_tasks || !newTask.expected_output || !newTask.timeline_from || !newTask.timeline_to || !newTask.assigned_person_id) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive",
            })
            return // Basic validation
        }

        const taskId = uuidv4()
        // const taskId = Date.now().toString()
        const taskToSave = { ...newTask, id: taskId }
        // const { toast } = useToast()
        // debugger;
        const isTaskExist = tasks.some((task) => task.activities_tasks.toLowerCase().trim() === newTask.activities_tasks.toLowerCase().trim() && task.category_id.toLowerCase().trim() === newTask.category_id.toLowerCase().trim())
        if (isTaskExist) {
            toast({
                variant: "destructive",
                description: "Task with the same type and name already exists!"

            })

            return;
        }
        setTasks([...tasks, taskToSave])

        localStorage.setItem("work_plan_tasks", JSON.stringify([...tasks, taskToSave]))
        // Reset the form
        setNewTask({
            id: "",
            work_plan_id: "",
            category_id: "",
            activities_tasks: "",
            expected_output: "",
            timeline_from: "",
            timeline_to: "",
            assigned_person_id: "",
            assigned_person_name: "",
        })
    }

    // Function to handle editing a task
    const handleEditTask = (taskId: string) => {
        setEditingTaskId(taskId)
        const taskToEdit = tasks.find((task) => task.id === taskId)
        if (taskToEdit) {
            setNewTask(taskToEdit)
        }
    }

    // Function to handle updating a task
    const handleUpdateTask = () => {
        const updatedTasks = tasks.map((task) => (task.id === editingTaskId ? newTask : task))
        setTasks(updatedTasks)
        localStorage.setItem("work_plan_tasks", JSON.stringify(updatedTasks))
        // Reset the form and editing state
        setNewTask({
            id: "",
            work_plan_id: "",
            category_id: "",
            activities_tasks: "",
            expected_output: "",
            timeline_from: "",
            timeline_to: "",
            assigned_person_id: "",
            assigned_person_name: "",
        })
        setEditingTaskId(null)
    }

    // Function to handle deleting a task
    const handleDeleteTask = (taskId: string) => {
        const deleteTask = tasks.filter((task) => task.id !== taskId)
        setTasks(deleteTask)
        localStorage.setItem("work_plan_tasks", JSON.stringify(deleteTask))
    }





    return (
        <div >
            <h2 className="text-lg font-medium">Define Tasks</h2>
            <p className="text-muted-foreground mb-5">Break down the work plan into specific tasks and assign responsibilities.</p>
            <div className="border rounded-md p-6 bg-muted/20 overflow-x-auto">
                {/* {JSON.stringify(newTask)} */}
                <h3 className="text-lg font-semibold mb-2">Add New Task</h3>

                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-muted">
                            <th className="p-2 text-left font-medium min-w-[120px] md:w-[15%] lg:w-[5%]">Task Type</th>
                            <th className="p-2 text-left font-medium min-w-[300px] w-full md:w-[30%] lg:w-[25%]">Tasks</th>
                            <th className="p-2 text-left font-medium min-w-[200px] w-full md:w-[20%] lg:w-[25%]">Expected Output</th>
                            <th className="p-2 text-left font-medium">Timeline (Start - End)</th>
                            <th className="p-2 text-left font-medium">Assigned Person</th>
                            <th className="p-2 text-left font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Input row */}
                        <tr className="border-b">
                            <td className="p-2">
                                <RadioGroup value={newTask.category_id} onValueChange={(value) => setNewTask({ ...newTask, category_id: value })}>

                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="1" id="general" />
                                        <Label htmlFor="general">General</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="2" id="specific" />
                                        <Label htmlFor="specific">Specific</Label>
                                    </div>
                                </RadioGroup>

                                {/* <Select value={newTask.category_id} onValueChange={(value) => setNewTask({ ...newTask, category_id: value })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">General</SelectItem>
                                        <SelectItem value="2">Specific</SelectItem>
                                    </SelectContent>
                                </Select> */}
                            </td>
                            <td className="p-2">
                                <Textarea
                                    rows={3}
                                    className="sm:w-[200px] md:w-full normal-case"
                                    placeholder="Enter task"
                                    value={newTask.activities_tasks}
                                    onChange={(e) => {

                                        setNewTask({ ...newTask, activities_tasks: e.target.value });
                                    }}
                                />
                            </td>
                            <td className="p-2">
                                <Textarea
                                    rows={3}
                                    className="sm:w-[200px] md:w-full normal-case"
                                    placeholder="Expected output"
                                    value={newTask.expected_output}
                                    onChange={(e) => setNewTask({ ...newTask, expected_output: e.target.value })} />
                            </td>
                            <td className="p-2">
                                <div className="flex flex-col w-full gap-2 md:flex-row md:items-center md:justify-between">
                                    <Input
                                        type="date"
                                        className="w-full md:w-[140px]"
                                        value={newTask.timeline_from}
                                        onChange={(e) => setNewTask({ ...newTask, timeline_from: e.target.value })}
                                    />
                                    <span className="text-center text-muted-foreground hidden md:inline">-</span>
                                    <Input
                                        type="date"
                                        className="w-full md:w-[140px]"
                                        value={newTask.timeline_to}
                                        min={newTask.timeline_from || undefined}
                                        onChange={(e) => setNewTask({ ...newTask, timeline_to: e.target.value })}
                                    />
                                </div>
                            </td>


                            <td className="p-2">
                                <Select
                                    value={newTask.assigned_person_id || ''}
                                    // value={Number(newTask.assigned_person_id) || 0 || ''}
                                    onValueChange={(value) => {
                                        if (value === "all") {
                                            setNewTask({
                                                ...newTask,
                                                assigned_person_id: "all",
                                                assigned_person_name: "All",
                                            });
                                            return;
                                        }

                                        const selected = selectedBeneficiariesOptions.find((bene) => bene.person_profile_id === value);
                                        const selectedName = selected ? selected.full_name : "";
                                        // const selectedName = selected ? selected.full_name : "";

                                        setNewTask({
                                            ...newTask,
                                            assigned_person_id: value,
                                            assigned_person_name: selectedName,
                                        });
                                    }}


                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Assign to" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {newTask.category_id === "1" && (
                                            <SelectItem value="all">All</SelectItem>
                                        )}


                                        {selectedBeneficiariesOptions.map((bene, idx) => (
                                            <SelectItem key={idx} value={bene.person_profile_id}>
                                                {bene.full_name}
                                                {/* {bene.full_name} */}
                                                {/* //{bene.ID} */}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </td>
                            <td className="p-2">
                                {editingTaskId ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleUpdateTask}
                                        className="flex items-center gap-1"
                                    >
                                        <Save className="h-4 w-4" />
                                        Update
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={handleSaveTask} className="flex items-center gap-1">
                                        <Save className="h-4 w-4" />
                                        Save
                                    </Button>
                                )}
                            </td>
                        </tr>


                    </tbody>
                </table>
                {tasks.length > 0 && (
                    <>

                        <h3 className="text-lg font-semibold mb-2 mt-3">List of Added Tasks</h3>
                        <table className="w-full border-collapse border ">
                            <thead>
                                <tr className="bg-muted">
                                    <th className="p-2 text-left font-medium min-w-[120px] md:w-[15%] lg:w-[5%]">Task Type</th>
                                    <th className="p-2 text-left font-medium min-w-[300px] w-full md:w-[30%] lg:w-[25%]">Tasks</th>
                                    <th className="p-2 text-left font-medium min-w-[200px] w-full md:w-[20%] lg:w-[25%]">Expected Output</th>
                                    <th className="p-2 text-left font-medium  min-w-[300px] w-full md:w-[20%] lg:w-[25%]">Timeline (Start - End)</th>
                                    <th className="p-2 text-left font-medium  min-w-[140px] w-full md:w-[20%] lg:w-[25%]">Assigned Person</th>
                                    <th className="p-2 text-left font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>

                                {/* Task rows */}
                                {tasks.map((task, idx) => (
                                    <tr key={idx} className="border-b hover:bg-muted/50">
                                        <td className="p-2">{task.category_id == "1" ? "General" : "Specific"}</td>
                                        <td className="p-2">{task.activities_tasks}</td>
                                        <td className="p-2">{task.expected_output}</td>
                                        <td className="p-2">
                                            {task.timeline_from && task.timeline_to ? (
                                                <span>
                                                    {task.timeline_from} - {task.timeline_to}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">No dates set</span>
                                            )}
                                        </td>
                                        <td className="p-2">{task.assigned_person_name}</td>
                                        <td className="p-2">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditTask(task.id)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </>

                )}


            </div>
        </div >
    )
}


function PreviewStep({ setCurrentStep }: any) {
    const [workPlanTitleGen, setWorkPlanTitleGen] = useState("")
    const [selectedBenes, setSelectedBenes] = useState<any[]>([])
    const [workPlanDataForReview, setWorkPlanDataForReview] = useState<WizardProps[]>([])
    const [officeName, setOfficeName] = useState("")
    const [noOfDaysEngagement, setNoOfDaysEngagement] = useState("")
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [objectives, setObjectives] = useState("")
    const [workPlanTasksData, setWorkPlanTasksData] = useState<any[]>([])
    // all data that will display is from localstorage
    // for title - deployment area short name - duration - number of days - number of bene
    const workPlanTitle = () => {
        // debugger;
        let title = ""
        const lsDASN = localStorage.getItem("deployment_area_short_name_supervisor")
        if (lsDASN) {
            title = lsDASN.replace(/\s+/g, '-');

        }
        const lswp = localStorage.getItem("work_plan")
        if (lswp) {
            const parsedWP = JSON.parse(lswp)
            setWorkPlanDataForReview(parsedWP)
            setOfficeName(parsedWP.office_name)
            setNoOfDaysEngagement(parsedWP.no_of_days_program_engagement)
            setDateFrom(parsedWP.approved_work_schedule_from)
            setDateTo(parsedWP.approved_work_schedule_to)
            setObjectives(parsedWP.objectives)
            title += '-' + parsedWP.office_name.slice(0, 3).toUpperCase();
            const rawFrom = parsedWP.approved_work_schedule_from;
            const rawTo = parsedWP.approved_work_schedule_to; // Adjusted: likely meant to use `approved_work_schedule_to`

            const formatDate = (dateStr: string) => {
                const date = new Date(dateStr);
                const yy = String(date.getFullYear()).slice(-2);
                const mm = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
                const dd = String(date.getDate()).padStart(2, '0');
                return `${yy}${mm}${dd}`;
            };

            const workFrom = formatDate(rawFrom);
            const workTo = formatDate(rawTo);
            title += "-" + workFrom + "-" + workTo + "-" + parsedWP.no_of_days_program_engagement

        }

        const lsNoSB = localStorage.getItem("selectedBeneficiaries")
        if (lsNoSB) {
            const parsedNoSB = JSON.parse(lsNoSB)
            title += "-" + parsedNoSB.length
            const lsWP = localStorage.getItem("work_plan");
            if (lsWP) {
                try {
                    const parsedWP = JSON.parse(lsWP);
                    parsedWP.work_plan_title = title;
                    localStorage.setItem("work_plan", JSON.stringify(parsedWP)); // ✅ save it back
                } catch (err) {
                    console.error("Error parsing work_plan from localStorage", err);
                }
            }
            setSelectedBenes(parsedNoSB)
            console.log("Selected Benes ", parsedNoSB)
        }
        setWorkPlanTitleGen(title)

    }



    // Use the props passed from parent for current data
    // If not available, fallback to localStorage (for backward compatibility)
    // const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<any[]>(beneficiariesData || []);
    // const [workPlanData, setworkPlanData] = useState<any>(workPlanData || {});
    // const [workPlanTasksData, setWorkPlanTasksData] = useState<any[]>(workPlanTasks || []);

    useEffect(() => {
        workPlanTitle()

        const workPlanTasks = localStorage.getItem("work_plan_tasks")
        if (workPlanTasks) {
            let parsedWorkPlanTasks: any = {};
            try {
                parsedWorkPlanTasks = JSON.parse(workPlanTasks);
                if (typeof parsedWorkPlanTasks !== "object") {
                    parsedWorkPlanTasks = {};
                }
            } catch {
                parsedWorkPlanTasks = {};
            }

            setWorkPlanTasksData(parsedWorkPlanTasks);

        }
        // If props are not provided, fallback to localStorage
        // if (!beneficiariesData) {
        //     const selectedBeneficiariesLS = localStorage.getItem("selectedBeneficiaries");
        //     if (selectedBeneficiariesLS) {
        //         try {
        //             const parsed = JSON.parse(selectedBeneficiariesLS);
        //             setSelectedBeneficiaries(Array.isArray(parsed) ? parsed : []);
        //         } catch {
        //             setSelectedBeneficiaries([]);
        //         }
        //     }
        // }
        // if (!workPlanData) {
        //     const dep_name = localStorage.getItem("deployment_area_supervisor");
        //     const dep_short_name = localStorage.getItem("deployment_area_short_name_supervisor");
        //     const workPlanDetailsLS = localStorage.getItem("work_plan");
        //     let parsed: any = {};
        //     if (workPlanDetailsLS) {
        //         try {
        //             parsed = JSON.parse(workPlanDetailsLS);
        //             if (typeof parsed !== "object" || parsed === null) {
        //                 parsed = {};
        //             }
        //         } catch {
        //             parsed = {};
        //         }
        //     }
        //     if (dep_name) {
        //         parsed.deployment_area_name = dep_name;
        //         parsed.deployment_area_short_name = dep_short_name;
        //     }
        //     setworkPlanData(parsed);
        // }
        // if (!workPlanTasks) {
        //     const workPlanTasksLS = localStorage.getItem("work_plan_tasks");
        //     if (workPlanTasksLS) {
        //         try {
        //             const parsed = JSON.parse(workPlanTasksLS);
        //             setWorkPlanTasksData(Array.isArray(parsed) ? parsed : []);
        //         } catch {
        //             setWorkPlanTasksData([]);
        //         }
        //     }
        // }
    }, []);
    // }, [beneficiariesData, workPlanTasks]);

    // Example: To modify the data, you should call a parent function via props (e.g., onEditBeneficiaries)
    // Here, we just show how to trigger edit (navigate to step)
    return (
        <div>
            {/* {JSON.stringify(workPlanDetailsData)} */}
            <h2 className="text-lg font-medium">Preview</h2>
            <p className="text-muted-foreground mb-3">Review all the information before submitting the Work Plan.</p>
            <div className="border rounded-md p-6 bg-muted/20">
                <p className="text-center text-2xl">Work Plan</p>
                <div className="text-center text-sm text-muted-foreground">
                    {workPlanTitleGen}
                </div>
                {/* {JSON.stringify(workPlanData)} */}
                {/* <p className="py-3">Work Plan Title :  deployment area short name - office - approved from and to - number of days - number of bene </p> */}

                <div className="text-center text-sm text-muted-foreground">
                    {
                        // Generate the work plan title
                        // (() => {
                        //     const deploymentArea = workPlanData?.deployment_area_short_name
                        //         ? workPlanData.deployment_area_short_name.replace(/\s+/g, "-")
                        //         : "";
                        //     if (!deploymentArea) return "";
                        //     const office = workPlanData?.office_name
                        //         ? workPlanData.office_name.substring(0, 3).toUpperCase()
                        //         : "";
                        //     const format = (dateStr: string) => {
                        //         if (!dateStr) return "";
                        //         const [y, m, d] = dateStr.split("-");
                        //         return `${m?.slice(-2) ?? ""}${d?.slice(-2) ?? ""}${y?.slice(-2) ?? ""}`;
                        //     };
                        //     const schedule =
                        //         workPlanData.approved_work_schedule_from
                        //             ? `${format(workPlanData.approved_work_schedule_from)}${workPlanData.approved_work_schedule_to
                        //                 ? format(workPlanData.approved_work_schedule_to)
                        //                 : ""
                        //             }`
                        //             : "";
                        //     const days = workPlanData.no_of_days_program_engagement || "";
                        //     const beneCount = selectedBeneficiaries.length;

                        //     // Compose the title
                        //     const title = `${deploymentArea}-${office}-${schedule}-${days}-${beneCount}`;

                        //     // Save to localStorage
                        //     if (typeof window !== "undefined") {
                        //         localStorage.setItem("work_plan_title_preview", title);
                        //     }
                        //     setWorkPlanTitle(title); // Update the global variable if needed
                        //     updateWorkPlanData("work_plan_title", title)
                        //     return title;
                        // })()
                    }

                </div>
                {/* <div className="text-center text-sm text-muted-foreground">
                    Work Plan ID  {workPlanData.id}
                </div> */}

                {/* Preview dynamic data */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center ">
                        Selected Beneficiaries
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        // className="bg-red-200 ml-0"
                                        onClick={() => {
                                            if (setCurrentStep) setCurrentStep(0); // Go back 3 steps, not below 0
                                            // if (setCurrentStep) setCurrentStep((prev: number) => Math.max(prev - 3, 0)); // Go back 3 steps, not below 0
                                        }}

                                    >
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Edit the list of selected beneficiaries
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                    </h3>
                    {/* {JSON.stringify(selectedBenes)} */}
                    {selectedBenes.map((bene, idx) => (
                        <p key={idx}>
                            {bene.full_name}
                            {bene.course ? ` – ${bene.course}` : ""}
                            {bene.school_name ? `, ${bene.school_name}` : ""}
                        </p >
                    ))}
                    {/* <ul className="list-disc list-inside space-y-1">
                        {selectedBenes.map((bene: any) => (
                            <li key={bene.id}>
                                ✅ {bene.full_name}
                                {bene.COURSE ? ` – ${bene.COURSE}` : ""}
                                {bene["SCHOOL NAME"] ? `, ${bene["SCHOOL NAME"]}` : ""}
                            </li>
                        ))}
                    </ul> */}



                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Work Plan Details

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        // className="bg-red-200 ml-0"
                                        onClick={() => {
                                            if (setCurrentStep) setCurrentStep(1);
                                            // if (setCurrentStep) setCurrentStep((prev: number) => Math.max(prev - 2, 1)); // Go back 3 steps, not below 1

                                        }}

                                    >
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Edit the Work Plan details
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <span className="font-medium">Office Name:</span>{" "}
                            {officeName || <span className="text-muted-foreground">N/A</span>}
                        </div>
                        <div>
                            <span className="font-medium">Days Engaged:</span>{" "}
                            {noOfDaysEngagement || <span className="text-muted-foreground">N/A</span>}
                        </div>
                        <div>
                            <span className="font-medium">Schedule:</span>{" "}
                            {dateFrom && dateTo
                                ? `${dateFrom} – ${dateTo}`
                                : <span className="text-muted-foreground">N/A</span>}
                        </div>
                        <div>
                            <span className="font-medium">Objectives:</span>{" "}
                            {objectives || <span className="text-muted-foreground">N/A</span>}
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Tasks
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        // className="bg-red-200 ml-0"
                                        onClick={() => {
                                            if (setCurrentStep) setCurrentStep(2); // Go to step 2 (Tasks)
                                            // if (setCurrentStep) setCurrentStep((prev: number) => Math.max(prev - 1, 2)); // Go back 3 steps, not below 2
                                        }}

                                    >
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Edit the Tasks
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </h3>
                    <div className="overflow-x-auto">
                        {/* {JSON.stringify(workPlanTasksData)} */}
                        <Table className="border border-gray-300">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Task</TableHead>
                                    <TableHead>Output</TableHead>
                                    <TableHead>Start</TableHead>
                                    <TableHead>End</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.isArray(workPlanTasksData) && workPlanTasksData.length > 0 ? (
                                    workPlanTasksData.map((task: any, idx: number) => (
                                        <TableRow key={task.id || idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                            <TableCell><span className="text-muted-foreground">{task.category_id == "1" ? "General" : "Specific"}</span></TableCell>
                                            <TableCell>{task.activities_tasks || <span className="text-muted-foreground">N/A</span>}</TableCell>
                                            <TableCell>{task.expected_output || <span className="text-muted-foreground">N/A</span>}</TableCell>
                                            <TableCell>{task.timeline_from || <span className="text-muted-foreground">N/A</span>}</TableCell>
                                            <TableCell>{task.timeline_to || <span className="text-muted-foreground">N/A</span>}</TableCell>
                                            <TableCell>{task.assigned_person_name || <span className="text-muted-foreground">N/A</span>}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            No tasks added.
                                        </TableCell>
                                    </TableRow>
                                )}

                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SubmittedStep() {
    const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<any[]>([])
    const [workPlanDetailsData, setWorkPlanDetailsData] = useState<any>({})
    const [workPlanTasksData, setWorkPlanTasksData] = useState<any[]>([])
    useEffect(() => {
        const selectedBeneficiaries = localStorage.getItem("selectedBeneficiaries")
        if (selectedBeneficiaries) {
            let parsedSelectedBeneficiaries: any = {};
            try {
                parsedSelectedBeneficiaries = JSON.parse(selectedBeneficiaries);
                if (typeof parsedSelectedBeneficiaries !== "object") {
                    parsedSelectedBeneficiaries = {};
                }
            } catch {
                parsedSelectedBeneficiaries = {};
            }

            setSelectedBeneficiaries(parsedSelectedBeneficiaries);


        }

        const workPlanDetails = localStorage.getItem("work_plan")
        if (workPlanDetails) {
            let parsedWorkPlanDetails: any = {};
            try {
                parsedWorkPlanDetails = JSON.parse(workPlanDetails);
                if (typeof parsedWorkPlanDetails !== "object") {
                    parsedWorkPlanDetails = {};
                }
            } catch {
                parsedWorkPlanDetails = {};
            }

            setWorkPlanDetailsData(parsedWorkPlanDetails);

        }

        const workPlanTasks = localStorage.getItem("work_plan_tasks")
        if (workPlanTasks) {
            let parsedWorkPlanTasks: any = {};
            try {
                parsedWorkPlanTasks = JSON.parse(workPlanTasks);
                if (typeof parsedWorkPlanTasks !== "object") {
                    parsedWorkPlanTasks = {};
                }
            } catch {
                parsedWorkPlanTasks = {};
            }

            setWorkPlanTasksData(parsedWorkPlanTasks);

        }

    }, [])

    return (
        <div>
            {/* <h2 className="text-lg font-medium">Preview</h2>
            <p className="text-muted-foreground mb-3">Review all the information before submitting the Work Plan.</p> */}
            <div className="border rounded-md p-6 bg-muted/20">
                {/* <p className="text-center text-2xl">Work Plan</p> */}
                <div className="flex flex-col items-center justify-center py-10">
                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                    <h3 className="text-2xl font-bold mb-2 text-green-700">Submitted Successfully!</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                        Your work plan has been submitted. You will be notified once it is reviewed. Thank you!
                    </p>
                </div>
            </div>
        </div>
    )
}


// {
//   "cfw_category_id": null, //✨
//   "deleted_date": null,//✨
//   "deployment_area_id": 21,//✨
// user_id - add
//   "deleted_by": null,//✨
//   "push_status_id": null,//✨
//   "created_by": "server",//✨
//   "area_focal_person_id": null,//✨
//   "is_deleted": null,//✨
//   "last_modified_by": null,//✨
//   "deployment_area_category_id": 1,//✨
//   "division_office_name": "Compliance",//✨
// last_modified_date - add
//   "assessment": null,//✨
// created_date - add
//   "number_of_days_program_engagement": null,//✨
//   "push_date": null//✨
// alternate_supervisor_id - add
//   "status_id": 1,//✨
//   "remarks": "Bene tagged in Work Plan",//✨
//   "person_profile_id": "951128ca-6295-4ba6-9562-30e59b7cfc6a",//✨
//   "work_plan_id": "59ee36fa-a194-4f63-88e9-c7f74b210cc4",//✨
//   "immediate_supervisor_id": "02af6e24-1bec-4568-b9bf-8133e7faa3dc",//✨

//   "raw_id": 1188,//🙉
//   "log_type": null,//🙉



// mga ilalagay
// id
// user_id
// last_modified_date
// created_date
// alternate_supervisor_id


// }
// 23