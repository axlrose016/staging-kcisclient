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
import LoginService from "@/app/login/LoginService";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb"
import { ICFWAssessment, IWorkPlan, IWorkPlanTasks } from "@/components/interfaces/personprofile"
import { useRouter } from "next/navigation"
import { cleanArray, cn } from "@/lib/utils";
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

// type WorkPlanTasksCollected = {
//     id: string;
//     work_plan_id: string;
//     expected_output: string;
//     work_plan_category_id: string; // "General" or "Specific"
//     activities_tasks: string;
//     timeline_from: string;
//     timeline_to: string;
//     assigned_person_id: string;

//     // assigned_person_name: string;

// };
export default function Wizard({ title, description, beneficiariesData, workPlanDetails, workPlanTasks, noOfSelectedBeneficiaries, noOfTasks, deploymentAreaName, mode }: WizardProps) {
    const [formMode, setFormMode] = useState(mode)

    const [currentStep, setCurrentStep] = useState(0)
    const router = useRouter()
    const [totalNoOfTasks, setTotalNoOfTasks] = useState(0)

    const [deploymentAreaNameSup, setDeploymentAreaNameSup] = useState(deploymentAreaName)
    const [workPlanTitle, setWorkPlanTitle] = useState<string>("")
    const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<any[]>(beneficiariesData || []);
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
        const lsWP = localStorage.getItem("work_plan")
        if (lsWP) {
            const parsedWP = JSON.parse(lsWP)

            const { immediate_supervisor_id, work_plan_title } = parsedWP;
            // Specify only the fields you want to save
            // parsedWP is expected to be an object, not an array
            const existing = await dexieDb.work_plan
                .where('immediate_supervisor_id')
                .equals(parsedWP.immediate_supervisor_id)
                .filter(wp => wp.work_plan_title === parsedWP.work_plan_title)
                .first();


            const workPlanToSave = {
                id: existing?.id || workplanid, // reuse ID if updating
                work_plan_title,
                immediate_supervisor_id,
                office_name: parsedWP.office_name,
                objectives: parsedWP.objectives,
                no_of_days_program_engagement: parsedWP.no_of_days_program_engagement,
                approved_work_schedule_from: parsedWP.approved_work_schedule_from,
                approved_work_schedule_to: parsedWP.approved_work_schedule_to,
                remarks: existing ? "Work Plan updated in DexieDB" : "Work Plan created in DexieDB",
                status_id: 0,
                created_date: existing?.created_date || new Date().toISOString(),
                created_by: _session?.userData?.email ?? "",
                last_modified_date: new Date().toISOString(),
                last_modified_by: _session?.userData?.email ?? "",
                push_status_id: 2,
                push_date: new Date().toISOString(),
                deleted_date: null,
                deleted_by: null,
                is_deleted: false,
                alternate_supervisor_id: null,
                area_focal_person_id: null,
                total_number_of_bene: totalNumberOfSelectedBenes(),
            };

            const wpres = await dexieDb.work_plan.put(workPlanToSave)
            // await dexieDb.work_plan.clear();
            // const data = await wpres.json()
            console.log("🧔 work plan created", wpres);

            return
            const email = "dsentico@dswd.gov.ph";
            const password = "Dswd@123";
            const onlinePayload = await LoginService.onlineLogin(email, password);
            const token = onlinePayload.token;
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
    }
    const saveWorkPlanTasksToDexieDb = async (workplanid: string) => {
        debugger
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
            // const email = "dsentico@dswd.gov.ph";
            // const password = "Dswd@123";
            // const onlinePayload = await LoginService.onlineLogin(email, password);
            // const token = onlinePayload.token;
            // debugger
            // await fetch(
            //     `${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}work_plan_task/create/`,
            //     {
            //         method: "POST",
            //         headers: {
            //             Authorization: `bearer ${token}`,
            //             "Content-Type": "application/json",
            //         },
            //         body: JSON.stringify(
            //             collectedTasks.map(ct => ({
            //                 id: uuidv4(),
            //                 work_plan_id: workplanid,
            //                 work_plan_category_id: ct.work_plan_category_id,
            //                 activities_tasks: ct.activities_tasks,
            //                 expected_output: ct.expected_output,
            //                 timeline_from: ct.timeline_from,
            //                 timeline_to: ct.timeline_to,
            //                 assigned_person_id: ct.assigned_person_id === "all" ? null : ct.assigned_person_id,
            //                 created_date: new Date().toISOString(),
            //                 created_by: _session.userData?.email,
            //                 last_modified_date: null,
            //                 last_modified_by: null,
            //                 deleted_date: null,
            //                 deleted_by: null,
            //                 remarks: "Work Plan Task Created",
            //                 is_deleted: false,
            //                 status_id: 0,
            //                 push_status_id: 2,
            //                 push_date: new Date().toISOString(),
            //             }))
            //         ),
            //     }
            // );
            console.log("All tasks saved successfully.");

        }
    }

    const saveWorkPlanSelectedBenes = async (workplanid: string) => {
        debugger
        const workPlanSelectedBenes = localStorage.getItem("selectedBeneficiaries");
        if (workPlanSelectedBenes) {
            const email = "dsentico@dswd.gov.ph";
            const password = "Dswd@123";
            const onlinePayload = await LoginService.onlineLogin(email, password);
            const token = onlinePayload.token;
            debugger
            const parsedWPSB = JSON.parse(workPlanSelectedBenes)
            // get the bene data from api
            // save it to dexiedb
            // update the data immediate_supervisor_id, division_office_name, work_plan_id
            // /cfw_assessment/view/01f98bb8-8d91-4416-8e6d-3a35decf39ab/
            localStorage.removeItem("selected_benes_cfw_assessment")

            const lsWP = localStorage.getItem("work_plan")
            let newImmediateSupervisorId = ""
            let newDivisionOfficeName = "";
            let newRemarks = "Bene has been tagged in Work Plan";
            let number_of_days_program_engagement = ""
            if (lsWP) {
                const parsedWP = JSON.parse(lsWP)
                newImmediateSupervisorId = parsedWP.immediate_supervisor_id
                newDivisionOfficeName = parsedWP.office_name
                number_of_days_program_engagement = parsedWP.no_of_days_program_engagement
            }

            const newWorkPlanId = workplanid;
            const resultsArray: any[] = [];
            await Promise.all(
                parsedWPSB.map(async (sb: any) => {
                    try {
                        const res = await fetch(
                            `${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}cfw_assessment/view/${sb.ID}/`,
                            {
                                method: "GET",
                                headers: {
                                    Authorization: `bearer ${token}`,
                                    "Content-Type": "application/json",
                                },
                            }
                        );

                        if (!res.ok) {
                            console.error(`Failed to fetch data for ID ${sb.ID}`);
                            return;
                        }


                        // "division_office_name": "Compliance",
                        // "immediate_supervisor_id": "02af6e24-1bec-4568-b9bf-8133e7faa3dc",
                        // "last_modified_by": null,
                        // last_modified_date //✨ pls add
                        // "number_of_days_program_engagement": null,

                        // "area_focal_person_id": null, 
                        // "assessment": null, 
                        // "cfw_category_id": null, 
                        // "created_by": "server",
                        // "deleted_by": null,
                        // "deleted date": null,
                        // "deployment_area_category_id": 1,
                        // "deployment_area_id": 21,
                        // "division_office_name": "Compliance",
                        // id //✨ pls add
                        // "immediate_supervisor_id": "02af6e24-1bec-4568-b9bf-8133e7faa3dc",
                        // "is_deleted": null,
                        // "last_modified_by": null,
                        // last_modified_date //✨ pls add
                        // log type ❌
                        // "number_of_days_program_engagement": null,
                        // "person_profile_id": "951128ca-6295-4ba6-9562-30e59b7cfc6a",
                        // "push_date": null
                        // "push_status_id": null,
                        // raw_id❌
                        // "remarks": "Bene tagged in Work Plan",
                        // "status_id": 1,
                        // user_id //✨ pls add
                        // created_date //✨ pls add
                        // "work_plan_id": "59ee36fa-a194-4f63-88e9-c7f74b210cc4",
                        // alternate_supervisor_id//✨ pls add


                        const result = await res.json();
                        // ✅ Inject new values here
                        const modifiedResult = {
                            ...result,
                            id: uuidv4(),
                            immediate_supervisor_id: newImmediateSupervisorId,
                            division_office_name: newDivisionOfficeName,
                            work_plan_id: workplanid,
                            remarks: newRemarks,
                            push_status_id: 2,
                            push_date: new Date().toISOString(),
                            last_modified_by: _session.userData.email,
                            last_modified_date: new Date().toISOString(),
                            number_of_days_program_engagement: number_of_days_program_engagement

                        };

                        resultsArray.push(modifiedResult);

                    } catch (err) {
                        console.error(`Error fetching ID ${sb.ID}:`, err);
                    }
                })
            );

            // Save all results at once
            localStorage.setItem("selected_benes_cfw_assessment", JSON.stringify(resultsArray));


            const localData = localStorage.getItem("selected_benes_cfw_assessment");
            if (!localData) {
                console.error("No data found in localStorage for selected_benes_cfw_assessment");
                return;
            }
            const parsedData = JSON.parse(localData);


            await dexieDb.cfwassessment.bulkPut(parsedData);
            console.log("cfw_assessment updated in Dexie successfully.");
            console.log("All tasks saved successfully.");
            // const parsed = JSON.parse(workPlanSelectedBenes);
            // await dexieDb.transaction("rw", [dexieDb.cfwassessment], async () => {
            //     try {
            //         let data: ICFWAssessment = cfwassessment;
            //         if(cfwass)

            //     }
            //     catch (e) {
            //         console.log(e)
            //     }
            // })

            // const collectedSelectedBene: ICFWAssessment[] = Array.isArray(parsed)
            //     ? parsed.map((item: any) => ({
            //         id: uuidv4(),
            //         person_profile_id: item.ID,
            //         deployment_area_category_id: null,
            //         deployment_area_id: null,
            //         division_office_name: null,
            //         assessment: null,
            //         number_of_days_program_engagement: null,
            //         area_focal_person_id: null,
            //         immediate_supervisor_id: null,
            //         alternate_supervisor_id: null,
            //         cfw_category_id: null,
            //         work_plan_id: workplanid,
            //         status_id: null,
            //         user_id: null,
            //         created_date: null,
            //         created_by: null,
            //         last_modified_date: null,
            //         last_modified_by: null,
            //         push_status_id: null,
            //         push_date: null,
            //         deleted_date: null,
            //         deleted_by: null,
            //         is_deleted: null,
            //         remarks: null,
            //     }))
            //     : [];

            // // await db.tasks.bulkPut(collectedTasks);
            // await dexieDb.cfwassessment.bulkPut(collectedSelectedBene)
        }
    }

    const submitWorkPlanWPTaskSelectedBenes = async () => {
        let workplanid = uuidv4()
        saveWorkPlanToDexieDb(workplanid)
        saveWorkPlanTasksToDexieDb(workplanid)
        saveWorkPlanSelectedBenes(workplanid)
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
        debugger;

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
            debugger
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
            debugger
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
    const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<any[]>([])


    useEffect(() => {
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

            setSelectedBeneficiaries(parsedBenes);

        }
    }, [listOfBeneficiaries])

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
        debugger;
        // Always get the selected row (whether array or single object)
        const selectedRow = Array.isArray(selectedRows) ? selectedRows[0] : selectedRows;
        if (!selectedRow || selectedRow["STATUS/DEPLOYED AT"] !== "Available") {
            return; // Do not select if not available
        }
        // setSelectedBeneficiaries(selectedRows)
        // const selectedRow = JSON.stringify(selectedRows)
        // alert(selectedRow)
        const selectedBenes = localStorage.getItem("selectedBeneficiaries");
        let parsedBenes: Beneficiary[] = [];
        if (selectedBenes) {
            try {
                parsedBenes = JSON.parse(selectedBenes);
                if (!Array.isArray(parsedBenes)) {
                    parsedBenes = [];
                }
            } catch {
                parsedBenes = [];
            }
        }
        // const selectedRow = Array.isArray(selectedRows) ? selectedRows[0] : selectedRows;
        if (parsedBenes.length === 0) {
            // If empty, insert the selected row
            parsedBenes.push(selectedRow);
            toast({
                title: "Beneficiary added",
                description: `${selectedRow["FULL NAME"]} has been added to the selected beneficiaries.`,
                variant: "green",
            });
        } else {
            const existingIndex = parsedBenes.findIndex((bene: Beneficiary) => bene.ID === selectedRow?.ID);
            if (existingIndex !== -1) {
                // If already there, remove it
                parsedBenes.splice(existingIndex, 1);
                toast({
                    title: "Beneficiary removed",
                    description: `${selectedRow["FULL NAME"]} has been removed from the selected beneficiaries.`,
                    variant: "destructive",
                });
            } else {
                // Else, add new
                parsedBenes.push(selectedRow);
                toast({
                    title: "Beneficiary added",
                    description: `${selectedRow["FULL NAME"]} has been added to the selected beneficiaries.`,
                    variant: "green",
                });
            }
        }
        localStorage.setItem("selectedBeneficiaries", JSON.stringify(parsedBenes));
        const lst = localStorage.getItem("selectedBeneficiaries");
        if (lst) {
            const parsedList = JSON.parse(lst);
            totalNumberOfSelectedBeneficiaries = parsedList.length;
            setSelectedBeneficiaries(parsedList);
        }


    }
    useEffect(() => {
        debugger;
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
    const handleRemoveBene = (e: any) => {
        // alert(e)
        console.log("Selected BENE", e)
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

                {selectedBeneficiaries.map((bene) => {
                    return (
                        <div key={bene.ID} className="inline-flex items-center mr-2 mb-2">
                            <Badge variant="green" className="flex items-center gap-2 pr-2" onClick={(e) => handleRemoveBene(bene)}>
                                {bene["FULL NAME"]}
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="ml-1 h-4 w-4 p-0"
                                    onClick={() => {
                                        // Remove this beneficiary from selectedBeneficiaries and localStorage
                                        const updated = selectedBeneficiaries.filter((b: any) => b.ID !== bene.ID);
                                        setSelectedBeneficiaries(updated);
                                        localStorage.setItem("selectedBeneficiaries", JSON.stringify(updated));
                                        totalNumberOfSelectedBeneficiaries = updated.length
                                        toast({
                                            title: "Beneficiary removed",
                                            description: `${bene["FULL NAME"]} has been removed from the selected beneficiaries.`,
                                            variant: "destructive",
                                        });

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
                    data={beneficiariesData as any[]}
                    columns={columnsMasterlist}

                    // enableRowSelection={true}
                    onRowClick={(row) => handleBeneficiarySelection(row)}
                // customActions={[
                //     {
                //         // id: 'add',
                //         icon: <CheckCircle className="h-5 w-5" />,
                //         label: 'Add',
                //         onClick: (row) => console.log('Add clicked', row),
                //     },
                // ]}
                // onEdit={handleEdit}
                // onDelete={handleDelete}
                // onRowClick={handleRowClick}
                // onAddNewRecord={handleAddNewRecord}
                />
            </div>
        </div>
    )
}


function WorkPlanStep({ workPlanDetails }: WizardProps) {
    const [workPlanData, setWorkPlanData] = useState<any>({})
    const [deploymentAreaName, setDeploymentAreaName] = useState("")
    debugger
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

        const taskId = Date.now().toString()
        const taskToSave = { ...newTask, id: taskId }
        // const { toast } = useToast()
        debugger;
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
                                    value={newTask.assigned_person_id}
                                    onValueChange={(value) => {
                                        if (value === "all") {
                                            setNewTask({
                                                ...newTask,
                                                assigned_person_id: "all",
                                                assigned_person_name: "All",
                                            });
                                            return;
                                        }

                                        const selected = selectedBeneficiariesOptions.find((bene) => bene.ID === value);
                                        const selectedName = selected ? selected["FULL NAME"] : "";

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


                                        {selectedBeneficiariesOptions.map((bene) => (
                                            <SelectItem key={bene.ID} value={bene.ID}>
                                                {bene["FULL NAME"]}
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
                                {tasks.map((task) => (
                                    <tr key={task.id} className="border-b hover:bg-muted/50">
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
        debugger;
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
                    {selectedBenes.map((bene) => (
                        <p key={bene.ID}>
                            {bene["FULL NAME"]}
                            {bene.COURSE ? ` – ${bene.COURSE}` : ""}
                            {bene["SCHOOL NAME"] ? `, ${bene["SCHOOL NAME"]}` : ""}
                        </p >
                    ))}
                    {/* <ul className="list-disc list-inside space-y-1">
                        {selectedBenes.map((bene: any) => (
                            <li key={bene.id}>
                                ✅ {bene["FULL NAME"]}
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