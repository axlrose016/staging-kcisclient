"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, FileEditIcon, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
// Mock data or replace with props/state/fetch
const workPlans = [
    { id: 1, status_id: "2" },
    { id: 2, status_id: "0" },
    { id: 3, status_id: "15" },
];
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/general/loading-screen";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import { IWorkPlan } from "@/components/interfaces/personprofile";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import LoginService from "@/components/services/LoginService";
interface IWorkPlanWithSupervisor extends IWorkPlan {
    immediate_supervisor_name: string;
}
const _session = (await getSession()) as SessionPayload;
export default function WorkPlansDashboard() {
    const [isLoadingCounts, setIsLoadingCounts] = useState(true);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [WPs, setWPs] = useState<IWorkPlan[]>([])
    const [WPwithSup, setWPWithSup] = useState<IWorkPlanWithSupervisor[]>([])

    const countByStatuses = (status_ids: (string | number | null)[]) =>
        WPs.filter((wp) => status_ids.includes(wp.status_id?.toString() ?? null)).length;

    // const countByStatus = (status_id: string) => WPs.filter((wp) => wp.status_id?.toString() === status_id.toString()).length;
    // const countByStatus = (status_id: string) => workPlans.filter((plan) => plan.status_id.toString() === status_id.toString()).length;

    const statusInfo = {
        approved: {
            label: "Approved Work Plans",
            icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            color: "text-green-600",
            description: "Ready for implementation",
            count: countByStatuses(["2", 2])
        },
        pending: {
            label: "Pending Work Plans",
            icon: <Clock className="h-4 w-4 text-yellow-600" />,
            color: "text-yellow-600",
            description: "Awaiting review",
            count: countByStatuses(["0", 0, null])
        },
        rejected: {
            label: "Rejected Work Plans",
            icon: <XCircle className="h-4 w-4 text-red-600" />,
            color: "text-red-600",
            description: "Needs work plan recreation",
            count: countByStatuses(["15", 15])
        },
        "for compliance": {
            label: "For Compliance Work Plans",
            icon: <FileEditIcon className="h-4 w-4 text-orange-600" />,
            color: "text-orange-600",
            description: "Needs revision",
            count: countByStatuses(["10", 10])
        },
    };


    const statuses = ["approved", "pending", "rejected", "for compliance"];


    const fetchData = async () => {
        try {
            const fetchData = async (endpoint: string) => {
                try {
                    debugger;
                    const onlinePayload = await LoginService.onlineLogin(
                        "dsentico@dswd.gov.ph",
                        "Dswd@123"
                    );

                    const response = await fetch(endpoint, {
                        method: "GET",
                        headers: {
                            Authorization: `bearer ${onlinePayload.token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response.ok) {
                        console.log(response);
                    } else {
                        debugger;
                        const data = await response.json();

                        const formatted = data.map((item: any) => ({
                            ...item,
                            created_date: item.created_date
                                ? format(new Date(item.created_date), "MMMM d, yyyy") + " (" + formatDistanceToNow(new Date(item.created_date), { addSuffix: true }) + ")"
                                : null,

                            last_modified_date: item.last_modified_date
                                ? format(new Date(item.last_modified_date), "MMMM d, yyyy")
                                : null,

                            approved_work_schedule_from: item.approved_work_schedule_from
                                ? format(new Date(item.approved_work_schedule_from), "MMMM d, yyyy")
                                : null,

                            approved_work_schedule_to: item.approved_work_schedule_to
                                ? format(new Date(item.approved_work_schedule_to), "MMMM d, yyyy")
                                : null,

                            push_date: item.push_date
                                ? format(new Date(item.push_date), "MMMM d, yyyy")
                                : null,
                        }));


                        setWPWithSup(formatted);


                        // setWPWithSup(data)
                        localStorage.setItem("work_plan_extended", JSON.stringify(formatted))
                        console.log("Work Plans", data)

                        const workPlans: IWorkPlan[] = data
                            .filter((item: any) => item.is_deleted === false) // 👈 only include non-deleted
                            .map((item: any) => ({

                                id: item.id,
                                alternate_supervisor_id: item.alternate_supervisor_id ?? null, // ✔️
                                approved_work_schedule_from: item.approved_work_schedule_from, //format(new Date(item.approved_work_schedule_from), "MMMM d, yyyy"), //item.approved_work_schedule_from, // ✔️
                                approved_work_schedule_to: item.approved_work_schedule_to, //format(new Date(item.approved_work_schedule_to), "MMMM d, yyyy"), //item.approved_work_schedule_to, // ✔️
                                area_focal_person_id: item.area_focal_person_id ?? null, // ✔️
                                created_by: item.created_by,     // ✔️
                                created_date: item.created_date, // format(new Date(item.created_date), "MMMM d, yyyy"), //item.created_date, // ✔️
                                deleted_by: item.deleted_by ?? null,
                                deleted_date: item.deleted_date ?? null,
                                immediate_supervisor_id: item.immediate_supervisor_id, // ✔️
                                is_deleted: item.is_deleted ?? false, // ✔️
                                last_modified_by: item.last_modified_by ?? null, // ✔️
                                last_modified_date: item.last_modified_date ?? null, // ✔️
                                no_of_days_program_engagement: item.no_of_days_program_engagement, // ✔️
                                objectives: item.objectives, // ✔️
                                push_date: item.push_date ?? null, // ✔️
                                push_status_id: item.push_status_id ?? null, // ✔️
                                remarks: item.remarks ?? null, // ✔️
                                status_id: item.status_id ?? null, // ✔️
                                work_plan_title: item.work_plan_title, // ✔️

                                // office_name: item.division_office_name ?? null, // optional
                                // total_number_of_bene: item.total_number_of_bene ?? 0, // optional
                            }));

                        setWPs(workPlans)
                        await dexieDb.work_plan.bulkPut(workPlans)

                        // const countStatusZero = await dexieDb.work_plan
                        //     .where('status_id')
                        //     .equals(0)
                        //     .count();
                        // const workPlans: IWorkPlan[] = data.map(mapApiToDexieWorkPlan);
                        // await dexieDb.work_plan.bulkPut(workPlans);

                        // setDataWorkPlan(data);

                        // console.log("🗣️Work Plan from API ", data);
                        // console.log("🗣️Work Plan from API ", data.length);

                        // if (data.length == 0 || data == undefined) {
                        //   setDataWorkPlan([]);
                        // } else {
                        //   setDataWorkPlan(data);
                        // }
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

            // alert(_session.id)

            fetchData(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "work_plan/view/");
            setLoading(false)
            setIsLoadingCounts(false)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // if (loading) {
    //     return (
    //         <>
    //             <LoadingScreen
    //                 isLoading={loading}
    //                 text={"Loading... Please wait."}
    //                 style={"dots"}
    //                 fullScreen={true}
    //                 progress={0}
    //                 timeout={0}
    //                 onTimeout={() => console.log("Loading timed out")}
    //             />
    //         </>
    //     );
    // }

    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div className="min-h-screen p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Work Plans Dashboard</h1>
                <p className="text-gray-600">
                    Manage and track all work plan submissions and their approval status
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 w-full mx-auto">
                {statuses.map((status) => {
                    const info = statusInfo[status as keyof typeof statusInfo];
                    return (
                        <Card
                            key={status}
                            className="cursor-pointer hover:shadow-lg transition"
                            onClick={() => router.push(`/personprofile/work-plan/${status}`)}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className={`text-sm font-medium ${info.color}`}>{info.label.toUpperCase()}</CardTitle>
                                {info.icon}
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold mb-3 ${info.color}`}>
                                    {isLoadingCounts ? (
                                        <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                                    ) : (
                                        <div className={`text-2xl font-bold mb-3 ${info.color}`}>
                                            {info.count}
                                        </div>
                                    )}
                                    {/* {info.count} */}
                                </div>
                                <p className="text-xs text-muted-foreground">{info.description}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
