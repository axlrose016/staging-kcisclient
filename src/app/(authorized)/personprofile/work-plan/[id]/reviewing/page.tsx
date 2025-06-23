"use client"
// import beneficiaries from './beneficiaries.json'
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from "react"
import { Save, Edit, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
// import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { Toast } from "@/components/ui/toast"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion";
import Wizard from "../wizard"
import { formatDistanceToNow, format } from "date-fns";
import { useRouter } from "next/navigation"
// Define the task type
interface WorkPlanTasks {
    id: string
    work_plan_id: string
    category_id: string //task type: 1 general, 2 specific
    activities_tasks: string
    expected_output: string
    timeline_from: string
    timeline_to: string
    assigned_person_id: string
    assigned_person_name?: string
}

interface WorkPlanProps {
    id: string;
    work_plan_title: string;
    immediate_supervisor_id: string;
    deployment_area_name: string;
    office_name: string;
    no_of_days_program_engagement: number;
    approved_work_schedule_from: string;
    approved_work_schedule_to: string;
    objectives: string;
    created_date: string;
    immediate_supervisor_name: string;

}

type Beneficiary = {
    id: string
    full_name: string
    course_name: string
    school_name: string
    status_name: string
    // is_selected: string
}
import { SessionPayload } from '@/types/globals';
import { getSession } from '@/lib/sessions-client'
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb"
import AppSubmitReview, { LibraryOption } from "@/components/app-submit-review"
import { ISubmissionLog } from "@/components/interfaces/cfw-payroll"
import { getOfflineLibStatuses } from "@/components/_dal/offline-options"
import LoginService from '@/components/services/LoginService';

const _session = await getSession() as SessionPayload;
export default function ReviewingWorkPlanPage() {
    const router = useRouter()
    const [officeName, setOfficeName] = useState("")
    const [deploymentAreaName, setDeploymentAreaName] = useState("")
    const [submissionLogs, setSubmissionLogs] = useState<ISubmissionLog[]>([]);
    const [statusesOptions, setStatusesOptions] = useState<LibraryOption[]>([]);


    const [lastStatus, setLastStatus] = useState<ISubmissionLog>({
        id: "",
        record_id: "",
        bene_id: "",
        module: "",
        comment: "",
        status_id: 0,
        status_date: "",
        created_date: "",
        created_by: ""
    });
    const [selectedStatus, setSelectedStatus] = useState<ISubmissionLog>({
        id: "",
        record_id: "",
        bene_id: "",
        module: "",
        comment: "",
        status_id: 0,
        status_date: "",
        created_date: "",
        created_by: ""
    });
    const params = useParams();
    const idParam = params && 'id' in params ? params.id : undefined;

    const stringWorkPlanId = Array.isArray(idParam) ? idParam[0] : idParam || '';
    const [immediateSupervisorId, setImmediateSupervisorId] = useState("")
    const [personProfileId, setPersonProfileId] = useState<string>("")
    const [remarks, setRemarks] = useState("")
    const [statusId, setStatusId] = useState(0)
    const [deploymentAreaId, setDeploymentAreaId] = useState(0)
    const [deploymentAreaCategoryId, setDeploymentAreaCategoryId] = useState<string>("")
    // Load beneficiaries from JSON
    // const [beneficiariesData, setBeneficiariesData] = useState<Beneficiary[]>(beneficiaries) //default using json file
    const [beneficiariesData, setBeneficiariesData] = useState<any[]>([])
    // const [beneficiariesData, setBeneficiariesData] = useState<Beneficiary[]>([])
    // const [beneficiariesData, setBeneficiariesData] = useState<Beneficiary[]>([])
    // const [deploymentAreaName, setDeploymentAreaName] = useState("")
    const [workPlanData, setWorkPlanData] = useState<WorkPlanProps>({
        id: "",
        work_plan_title: "",
        immediate_supervisor_id: _session.id,
        deployment_area_name: deploymentAreaName,
        office_name: "",
        no_of_days_program_engagement: 0,
        approved_work_schedule_from: "",
        approved_work_schedule_to: "",
        objectives: "",
        created_date: "",
        immediate_supervisor_name: ""

    })


    const handleStatusChange = (review: any) => {
        setStatusId(review.status)
        // setRemarks(JSON.stringify(review))
        setRemarks(
            review.status === 2 ? "Work Plan has been approved." :
                review.status === 10 ? "Work Plan is for compliance." :
                    review.status === 15 ? "Work Plan has been rejected." : "Work Plan has been updated"
        )
        // console.log("review data" , review)
        // alert(review.status)
    }

    useEffect(() => {
        localStorage.removeItem("selectedBeneficiaries")

        const fetchLib = async () => {

            const statuses = await getOfflineLibStatuses();
            const filteredStatuses = statuses.filter(status => [2, 10, 15].includes(status.id));
            console.log('filteredStatuses', filteredStatuses)
            setStatusesOptions(filteredStatuses);

        }

        fetchLib()
        let supervisorId = ""
        const lsWorkPlanData = localStorage.getItem("work_plan")
        if (lsWorkPlanData) {
            const parsedTM = JSON.parse(lsWorkPlanData) as WorkPlanProps
            supervisorId = parsedTM.immediate_supervisor_id
            setImmediateSupervisorId(parsedTM.immediate_supervisor_id)
            setWorkPlanData(parsedTM)
        } else {
            localStorage.setItem("work_plan", JSON.stringify(workPlanData))
        }


        // get work plan task in api work_plan_task/view/
        async function fetchDataWorkPlanTasks() {
            try {
                const fetchData = async (endpoint: string) => {


                    try {
                        debugger;
                        const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");

                        const response = await fetch(endpoint, {
                            method: "GET",
                            headers: {
                                Authorization: `bearer ${onlinePayload.token}`,
                                "Content-Type": "application/json",
                            },

                        });

                        if (!response.ok) {
                            const data = await response.json();

                            console.log("Error message ", data)
                            toast({
                                variant: "destructive",
                                title: "Invalid Password",
                                description: data.error,
                            });
                            // setIsLoading(false)
                            // console.log(response);

                        } else {

                            // list of work plan tasks + bene name
                            const data = await response.json()


                            localStorage.removeItem("work_plan_tasks")
                            let person_profile_id_sample = ""
                            // Helper to fetch person info
                            async function fetchPersonName(id: string) {
                                debugger
                                if (!id) return null;
                                person_profile_id_sample = id
                                const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");

                                const resPersonProf = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "person_profile/view/" + id + "/", {
                                    method: "GET",
                                    headers: {
                                        Authorization: `bearer ${onlinePayload.token}`,
                                        "Content-Type": "application/json",
                                    },

                                });

                                const person = await resPersonProf.json();
                                console.log("Person profile ", person)
                                return `${person.first_name} ${person.last_name}`;
                            }

                            // Map with enriched names
                            const enrichedTasks = await Promise.all(
                                data.map(async (task: any) => {
                                    const name = await fetchPersonName(task.assigned_person_id);
                                    return {
                                        ...task,
                                        assigned_person_name: name || "Unassigned",
                                    };
                                })
                            );


                            localStorage.setItem("work_plan_tasks", JSON.stringify(enrichedTasks))
                            setTasks(enrichedTasks)


                            // cfw_assessment/view/bene person_profile id
                            // get office name
                            // get the deployment area id and category id

                            // get deployment area name 
                            let deployment_area_id = 0
                            let deployment_category_area_id = 0

                            async function fetchDeploymentAreaAndOfficeName(id: string) {
                                debugger
                                if (!id) return null;
                                const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");

                                const resDepAreaCatIdOffName = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "cfw_assessment/view/" + id + "/", {
                                    method: "GET",
                                    headers: {
                                        Authorization: `bearer ${onlinePayload.token}`,
                                        "Content-Type": "application/json",
                                    },

                                });

                                const resDeploymentAreaIdCatIdOfficeName = await resDepAreaCatIdOffName.json();
                                setOfficeName(resDeploymentAreaIdCatIdOfficeName.division_office_name)

                                deployment_area_id = resDeploymentAreaIdCatIdOfficeName.deployment_area_id
                                deployment_category_area_id = resDeploymentAreaIdCatIdOfficeName.deployment_area_category_id

                                const resDepAreaName = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "cfw_assessment/view/cfw_assessment_by_deployment_category/", {
                                    method: "POST",
                                    headers: {
                                        Authorization: `bearer ${onlinePayload.token}`,
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        "deployment_area_category_id": deployment_category_area_id,
                                        "deployment_area_id": deployment_area_id
                                    })

                                });

                                const resDepAreaNameData = await resDepAreaName.json();
                                const depAreaName = resDepAreaNameData[0]?.["DEPLOYMENT AREA"] ?? "Unknown";
                                setDeploymentAreaName(depAreaName)
                                console.log("Dep area", depAreaName)
                                console.log("Deployment Area ID, Category ID, Office name ", deployment_area_id, " dep cat id ", deployment_category_area_id)


                                const resSelectedBenes = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "work_plan/view/by_supervisor_and_work_plan/" + supervisorId + "/" + stringWorkPlanId + "/", {
                                    method: "GET",
                                    headers: {
                                        Authorization: `bearer ${onlinePayload.token}`,
                                        "Content-Type": "application/json",
                                    },
                                    // body: JSON.stringify({
                                    //     "deployment_area_category_id": deployment_category_area_id,
                                    //     "deployment_area_id": deployment_area_id
                                    // })

                                });

                                const resSelBenes = await resSelectedBenes.json();

                                localStorage.setItem("selectedBeneficiaries", JSON.stringify(resSelBenes))
                                // return `${person.first_name} ${person.last_name}`;
                            }

                            fetchDeploymentAreaAndOfficeName(person_profile_id_sample)








                        }
                    } catch (error: any) {
                        if (error.name === "AbortError") {
                            console.log("Request canceled", error.message);
                            alert("Request canceled" + error.message);
                        } else {
                            console.error("Error fetching data:", error);
                            alert("Error fetching data:" + error);
                        }
                    }
                };

                fetchData(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "work_plan_task/view/" + stringWorkPlanId + "/");
            } catch (error) {
                console.error(error);
            } finally {

            }
        }
        fetchDataWorkPlanTasks();


        // const lsWPTasks = localStorage.getItem("work_plan_tasks")
        // if (lsWPTasks) {
        //     const parsedTasks = JSON.parse(lsWPTasks) as WorkPlanTasks[]
        //     setTasks(parsedTasks)
        // } else {
        //     localStorage.setItem("work_plan_tasks", JSON.stringify([]))
        //     setTasks([])
        // }


        const lsWPChosenBenes = localStorage.getItem("selectedBeneficiaries")
        if (lsWPChosenBenes) {
            const parsedChosenBene = JSON.parse(lsWPChosenBenes)
            setBeneficiariesData(parsedChosenBene)
        }




    }, []);



    useEffect(() => {
        const lsWPChosenBenes = localStorage.getItem("selectedBeneficiaries")
        if (lsWPChosenBenes) {
            const parsedChosenBene = JSON.parse(lsWPChosenBenes)
            setBeneficiariesData(parsedChosenBene)
        }
    }, [])
    const { toast } = useToast()



    // State for tasks
    const [tasks, setTasks] = useState<WorkPlanTasks[]>([])

    // State for the new task form
    // const [newTask, setNewTask] = useState<WorkPlanTasks>({
    //     id: "",
    //     work_plan_id: "",
    //     category_id: "",
    //     activities_tasks: "",
    //     expected_output: "",
    //     timeline_from: "",
    //     timeline_to: "",
    //     assigned_person_id: "",
    // })

    // State to track which task is being edited
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
    const handleSubmitUpdateStatusOfWorkPlan = (data: any) => {
        // const ss = JSON.stringify(selectedStatus)

        // alert(remarks)
        // console.log("Selected Status", selectedStatus)
        // console.log("Data", data)
        // alert("Comment" + selectedStatus.comment)
        // alert("status" + selectedStatus.status)
        // return

        // alert(stringWorkPlanId) 
        // 2 = approved, 10 = for compliance, 15 = rejected

        if (
            data.status_id == null || data.status_id == undefined
        ) {
            console.log("Deyta", data)
            toast({
                variant: "destructive",
                title: "Action Required",
                description: "Please select a valid Work Plan status to continue.",
            });
            return;
        }
        if (statusId == 10 || statusId == 15) {
            if (!data.comment) {
                toast({
                    variant: "destructive",
                    title: "Comments/ Feedback Required",
                    description: "Please input a comment or feedback to continue.",
                });
                return;
            }
        }

        // alert(statusId)
        try {
            // update dexiedb
            let updatedCount = 0;
            // alert(stringWorkPlanId)
            const saveToDexieDb = async () => {

                updatedCount = await dexieDb.work_plan.update(stringWorkPlanId, {
                    status_id: 2,
                    push_date: new Date().toISOString(),
                    last_modified_by: _session.userData.email,
                    last_modified_date: new Date().toISOString(),
                    remarks: remarks

                });
            }
            saveToDexieDb()
            // alert("Dexie saved")
            // debugger    
            // directly synch the updated data
            async function syncUpUpdatedWorkPlan() {
                try {
                    const fetchData = async (endpoint: string) => {


                        try {
                            debugger;
                            const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");

                            const response = await fetch(endpoint, {
                                method: "POST",
                                headers: {
                                    Authorization: `bearer ${onlinePayload.token}`,
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify([{
                                    "id": stringWorkPlanId,
                                    "last_modified_by": _session.userData.email,
                                    "last_modified_date": new Date().toISOString(),
                                    "push_date": new Date().toISOString(),
                                    "push_status_id": "1",
                                    remarks: remarks,
                                    "status_id": statusId,
                                }])
                            });

                            if (!response.ok) {
                                const data = await response.json();
                                console.log("Error message ", data)
                                toast({
                                    variant: "destructive",
                                    title: "Invalid Password",
                                    description: data.error,
                                });
                                // setIsLoading(false)
                                // console.log(response);

                            } else {


                                const review_logs = {
                                    id: uuidv4(),
                                    module: "work plan reviewing",

                                }



                                const submissionLog: ISubmissionLog = {
                                    id: uuidv4(),
                                    record_id: stringWorkPlanId,
                                    bene_id: null,
                                    module: "Work Plan",
                                    comment: data.comment,
                                    status_id: data.status_id,
                                    status_date: new Date().toISOString(),
                                    created_date: new Date().toISOString(),
                                    created_by: _session.userData.email || "",
                                    last_modified_date: new Date().toISOString(),
                                    last_modified_by: _session.userData.email,
                                    push_status_id: 1,
                                    push_date: new Date().toISOString(),
                                    deleted_date: null,
                                    deleted_by: null,
                                    is_deleted: false,
                                    remarks: remarks,
                                    user_id: _session.id
                                };
                                // Upsert into Dexie
                                await dexieDb.submission_log.put(submissionLog);
                                setSubmissionLogs([submissionLog])
                                // alert("Submission logs saved")


                                // update the localstorage
                                // const targetId = "b06b097f-486e-4f26-9ef2-5e31c563beca";

                                // Step 1: Get data from localStorage
                                const wpExtendedRaw = localStorage.getItem("work_plan_extended");
                                if (!wpExtendedRaw) return;

                                const wpExtended = JSON.parse(wpExtendedRaw);

                                // Step 2: Update the item with matching ID
                                const updated = wpExtended.map((item: any) =>
                                    item.id === stringWorkPlanId
                                        ? {
                                            ...item,
                                            status_id: 2,
                                            push_date: new Date().toISOString(),
                                            last_modified_by: _session.userData.email,
                                            last_modified_date: new Date().toISOString(),
                                            remarks: remarks,
                                        }
                                        : item
                                );

                                // Step 3: Save back to localStorage
                                localStorage.setItem("work_plan_extended", JSON.stringify(updated));





                                toast({
                                    variant: "green",
                                    title: "Submit Review",
                                    description: "Your review has been submitted!",
                                });
                                // Delay a bit to let the toast be visible before redirect
                                setTimeout(() => {
                                    router.back();
                                }, 1500);

                            }
                        } catch (error: any) {
                            if (error.name === "AbortError") {
                                console.log("Request canceled", error.message);
                                alert("Request canceled" + error.message);
                            } else {
                                console.error("Error fetching data:", error);
                                alert("Error fetching data:" + error);
                            }
                        }
                    };

                    fetchData(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "work_plan/create/");
                } catch (error) {
                    console.error(error);
                } finally {

                }
            }
            syncUpUpdatedWorkPlan();




            console.log("Work plan status updated successfully.");
        } catch (error) {
            console.error("Error updating work plan status:", error);
        }



    }
    const handleForComplianceWorkPlan = () => {

    }
    const handleDeclineWorkPlan = () => {

    }
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full p-0"
        >

            {/* <main className="max-h-screen w-full bg-background py-10">
        <Wizard
          title='Work Plan Creation'
          description='Create a work plan for the beneficiaries'
        />
      </main> */}
            <div className="mx-auto px-0 py-8 mt-0">
                <Card className="w-full">
                    <CardHeader>
                        <div className="flex flex-row justify-between items-start mb-5">
                            {/* Left side: title and description */}
                            <div className="flex flex-col">
                                <CardTitle className="text-xl md:text-2xl">Work Plan Reviewing</CardTitle>
                                <CardDescription className="mt-1 text-sm text-muted-foreground">
                                    Reviewing the submitted Work Plan for approval.
                                </CardDescription>
                            </div>

                            {/* Right side: mode label */}
                            <div className="flex items-center">
                                <span className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md bg-yellow-100 text-yellow-700">
                                    <Search size={16} className="text-yellow-700" />
                                    Reviewing
                                </span>
                            </div>
                        </div>

                        {/* Work Plan Title */}
                        <div >
                            <p className="text-sm text-muted-foreground mb-1">Work Plan Title</p>
                            <div className="text-lg font-semibold text-gray-900">
                                {/* Replace this with actual value */}
                                {workPlanData?.work_plan_title || "Loading..."}
                            </div>

                        </div>

                        <div className="pt-5">
                            <p className="text-sm text-muted-foreground mb-1">Deployment Area Name</p>
                            <div className="text-lg font-semibold text-gray-900">
                                {/* Replace this with actual value */}
                                {deploymentAreaName.toUpperCase() || "Loading..."}
                                {/* {workPlanData?.deployment_area_name || "Loading..."} */}
                            </div>
                        </div>
                        <div className="pt-5">
                            <p className="text-sm text-muted-foreground mb-1">Office/Division/Section/Unit Name</p>
                            <div className="text-lg font-semibold text-gray-900">
                                {/* Replace this with actual value */}
                                {officeName.toUpperCase() || "Loading..."}
                                {/* {workPlanData?.office_name || "Loading..."} */}
                            </div>
                        </div>

                        {/* Selected Beneficiaries */}
                        <div className="pt-3 pb-3">
                            <p className="text-sm text-muted-foreground mb-1">Selected Beneficiaries ({beneficiariesData.length})</p>
                            <div className="flex flex-wrap gap-2">
                                {beneficiariesData.length == 0 ? "Loading..." : ""}
                                {beneficiariesData.map((bene, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm border border-gray-300 shadow-sm"
                                    >
                                        {bene.full_name} – {bene.course} – {bene.school_name}
                                    </span>
                                ))}
                            </div>
                        </div>




                        {/* Work Plan Details */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm pb-3">
                            <div>
                                <span className="text-muted-foreground">Supervisor</span>
                                <p className="font-medium">{workPlanData?.immediate_supervisor_name.toUpperCase() || "Loading..."}</p>
                                {/* <p className="font-medium">{workPlanData?.immediate_supervisor_id || "N/A"}</p> */}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Schedule</span>
                                <p className="font-medium">
                                    {workPlanData?.approved_work_schedule_from && workPlanData?.approved_work_schedule_to ? (
                                        `${format(new Date(workPlanData.approved_work_schedule_from), "MMMM d, yyyy")} - ${format(new Date(workPlanData.approved_work_schedule_to), "MMMM d, yyyy")}`
                                    ) : (
                                        "Schedule not available"
                                    )}

                                    {/* `${format(new Date(workPlanData.approved_work_schedule_from), "MMMM d, yyyy")} - ${format(new Date(workPlanData.approved_work_schedule_to), "MMMM d, yyyy")}` */}
                                    {/* {workPlanData?.approved_work_schedule_from} → {workPlanData?.approved_work_schedule_to} */}
                                    {/* {workPlanData?.approved_work_schedule_from} → {workPlanData?.approved_work_schedule_to} */}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">No. of Engagement Days</span>
                                <p className="font-medium">{workPlanData?.no_of_days_program_engagement ?? 0}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Date Created</span>
                                <p className="font-medium">
                                    {workPlanData?.created_date
                                        ? `${format(new Date(workPlanData.created_date), "MMMM d, yyyy")} (${formatDistanceToNow(new Date(workPlanData.created_date), { addSuffix: true })})`
                                        : "Loading..."}
                                    {/* {workPlanData?.created_date ?? "Loading..."} */}
                                </p>
                            </div>
                        </div>
                        <div className="mt-5">
                            <span className="text-muted-foreground">Objectives</span>
                            <p className="font-medium">{workPlanData?.objectives || "None"}</p>
                        </div>
                    </CardHeader>

                    {/* Task List Section */}
                    <CardContent >
                        <span className="text-muted-foreground">Tasks ({tasks.length})</span>
                        {/* <div className="mb-2 font-semibold text-gray-800">Tasks ({tasks.length})</div> */}
                        <div className="space-y-4">
                            {tasks && tasks.length > 0 ? (
                                tasks.map((task, index) => (
                                    <div
                                        key={index}
                                        className="p-4 border rounded-lg shadow-sm bg-white flex flex-col gap-1 text-sm text-gray-800"
                                    >
                                        <div className="font-large text-base text-primary">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                                    task.category_id === "1"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-purple-100 text-purple-800"
                                                )}
                                            >
                                                {task.category_id == "1" ? "General" : "Specific"}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="font-semibold">Task:</span> {task.activities_tasks || "N/A"}
                                        </div>

                                        <div>
                                            <span className="font-semibold">Outputs:</span> {task.expected_output || "N/A"}
                                        </div>

                                        <div>
                                            <span className="font-semibold">Duration:</span>
                                            {task?.timeline_from && task?.timeline_to ? (
                                                `${format(new Date(task.timeline_from), "MMMM d, yyyy")} - ${format(new Date(task.timeline_to), "MMMM d, yyyy")}`
                                            ) : (
                                                "Schedule not available"
                                            )}

                                            {/* {task.timeline_from} -  {task.timeline_to} */}
                                        </div>

                                        <div>
                                            <span className="font-semibold">Assigned to:</span> {task.assigned_person_id == null ? "All" : task.assigned_person_name?.toUpperCase()}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No tasks available.</p>
                            )}
                        </div>
                        <div className="w-full">
                            {/* {remarks} */}
                            <AppSubmitReview
                                session={_session!}
                                review_logs={submissionLogs}
                                options={statusesOptions}
                                review={selectedStatus}
                                onChange={(review) => {
                                    handleStatusChange(review);
                                    console.log("Review", review)
                                }}
                                // onChange={(review) => setSelectedStatus(review)}
                                onSubmit={(data) => handleSubmitUpdateStatusOfWorkPlan(data)}
                            />
                        </div>
                    </CardContent>


                    {/* <CardFooter className="flex justify-between border-t p-6"> */}
                    {/* Footer content such as action buttons */}
                    {/* <div className="text-sm text-muted-foreground">Last updated: {workPlanData?.last_modified_date ?? "—"}</div> */}
                    {/* <div className="no-print">

                        </div> */}

                    {/* <div className="space-x-2"> */}


                    {/* <Button
                                variant={"destructive"}
                                onClick={handleDeclineWorkPlan}
                            // className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                            >Reject</Button>
                            <Button
                                variant={"destructive"}
                                onClick={handleForComplianceWorkPlan} //10-for compliance
                            // className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                            >For Compliance</Button>
                            <Button
                                variant={"default"}
                                // className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm"
                                onClick={handleApproveWorkPlan}>Approve</Button> */}
                    {/* </div> */}
                    {/* </CardFooter> */}
                </Card>

            </div>
        </motion.div >

    )
}
