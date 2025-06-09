"use client"
import { fetchProfiles } from "@/components/_dal/profiles";
import { fetchReviewApproveDecline } from "@/components/_dal/review_approve_decline";
import { ButtonDelete } from "@/components/actions/button-delete";
import { ButtonDialog } from "@/components/actions/button-dialog";
import { ButtonView } from "@/components/actions/button-view";
import { AppTable } from "@/components/app-table";
import { ICFWAssessment, IPersonProfile, IPersonProfileCfwFamProgramDetails, IPersonProfileDisability, IPersonProfileFamilyComposition, IPersonProfileSector, IWorkPlan } from "@/components/interfaces/personprofile";
import LoadingScreen from "@/components/general/loading-screen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { useRouter } from "next/navigation";
// import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
const baseUrl = '/personprofile/work-plan'
const cache: Record<string, any> = {};
function newAbortSignal(timeoutMs: number) {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs || 0);
    return abortController.signal;
}
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import axios from 'axios';
import LoginService from "@/app/login/LoginService";
import { IAttachments } from "@/components/interfaces/general/attachments";
import WorkPlan from "../masterlist/[record]/work_plan";

const _session = await getSession() as SessionPayload;

// "raw_id": 0,
// "created_date": "2025-05-06T07:51:31.946Z", ✅
// "created_by": "string",
// "last_modified_date": "2025-05-06T07:51:31.946Z",
// "last_modified_by": "string",
// "deleted_date": "2025-05-06T07:51:31.946Z",
// "deleted_by": "string",
// "remarks": "string",
// "synced_date": "2025-05-06T07:51:31.946Z",
// "is_deleted": true,
// "_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
// "immedidiate_supervisor_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",✅
// "alternative_supervisor_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",✅
// "area_focal_person_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",✅
// "objectives": "string",✅
// "no_of_days_program_engagement": 2147483647, ✅
// "approved_work_schedule_from": "2025-05-06",✅
// "approved_work_schedule_to": "2025-05-06",✅
// "status_id": 2147483647, ✅
// "push_status_id": 2147483647,
const columnsWorkPlan = [

    // {
    //     id: 'status',
    //     header: 'Status',
    //     accessorKey: 'status_id',
    //     filterType: 'select',
    //     filterOptions: [null, 2, 15, 10],
    //     sortable: true,
    //     align: "center",
    //     cell: (value: any) => <Badge variant={value == 2 ? "green" :
    //         value == null ? "warning" :
    //             value == 15 ? "destructive" : "default"
    //     } >{value}</Badge>
    // },
    {
        id: 'objectives',
        header: 'Objectives',
        accessorKey: 'objectives',
        filterType: 'text',
        sortable: true,
        align: "left",
        cell: null,
    },
    {
        id: 'no_of_days_program_engagement',
        header: '# of Days Program Engagement',
        accessorKey: 'no_of_days_program_engagement',
        filterType: 'text',
        sortable: true,
        align: "center",
        cell: null,
    },
    {
        id: 'approved_work_schedule_from',
        header: 'Approved Work Schedule From',
        accessorKey: 'approved_work_schedule_from',
        filterType: 'text',
        sortable: true,
        align: "center",
        cell: null,
    },
    {
        id: 'approved_work_schedule_to',
        header: 'Approved Work Schedule To',
        accessorKey: 'approved_work_schedule_to',
        filterType: 'text',
        sortable: true,
        align: "center",
        cell: null,
    },
    {
        id: 'created_date',
        header: 'Created At',
        accessorKey: 'created_date',
        filterType: 'text',
        sortable: true,
        align: "left",
        cell: null,
    },
    // {
    //     id: 'area_focal_person_id',
    //     header: 'Focal Person',
    //     accessorKey: 'area_focal_person_id',
    //     filterType: 'text',
    //     sortable: true,
    //     align: "left",
    //     cell: null,
    // },
    // {
    //     id: 'immedidiate_supervisor_id',
    //     header: 'Immediate Supervisor',
    //     accessorKey: 'immedidiate_supervisor_id',
    //     filterType: 'text',
    //     sortable: true,
    //     align: "left",
    //     cell: null,
    // },
    // {
    //     id: 'alternative_supervisor_id',
    //     header: 'Alternate Supervisor',
    //     accessorKey: 'alternative_supervisor_id',
    //     filterType: 'text',
    //     sortable: true,
    //     align: "left",
    //     cell: null,
    // },

];
export default function WorkPlanMasterList({ page }: { page: number }) {
    const [dataWorkPlan, setDataWorkPlan] = useState<IWorkPlan[]>([]);
    const [selectedPWorkPlan, setSelectedWorkPlan] = useState<IWorkPlan[]>([]);



    const [profilesSector, setProfilesSector] = useState<IPersonProfileSector[]>([]);
    const [profilesFamCom, setProfilesFamCom] = useState<IPersonProfileFamilyComposition[]>([]);
    const [profilesAttachments, setProfilesAttachments] = useState<IAttachments[]>([]);
    const [profilesCfwFamProgramDetails, setProfileCfwFamProgramDetails] = useState<IPersonProfileCfwFamProgramDetails[]>([]);
    const [profilesDisabilities, setProfileCfwDisabilities] = useState<IPersonProfileDisability[]>([]);
    const [assessmentDetails, setAssessmentDetials] = useState<ICFWAssessment[]>([]);

    const [reviewApproveDecline, setReviewApproveDecline] = useState([]);
    const [approvalStatuses, setApprovalStatus] = useState<{ [key: string]: string }>({})
    const [loading, setLoading] = useState(true);
    const [forReviewApprove, setForReviewApprove] = useState(false);
    const [selectedCFWID, setSetSelectedCFWID] = useState("");
    const [pageNo, setPageNo] = useState(1);
    const router = useRouter();
    // const [data, setData] = useState([]);
    const handleEligible = (id: string) => {

    }

    const handleCreateNewWorkPlan = () => {
        router.push(baseUrl + "/new");
    }

    useEffect(() => {

        
        async function loadWorkPlan() {
            try {
                const fetchData = async (endpoint: string) => {
                    const cacheKey = `${endpoint}_page_${page}`;
                    if (cache[cacheKey]) {
                        console.log("Using cached data for:", cacheKey);
                        setDataWorkPlan(cache[cacheKey]);
                        return;
                    }

                    const signal = newAbortSignal(5000);
                    try {
                        debugger;
                        const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");

                        const response = await fetch(endpoint, {
                            method: "GET",
                            headers: {
                                Authorization: `bearer ${onlinePayload.token}`,
                                "Content-Type": "application/json",
                            },
                            // body: JSON.stringify({
                            //     "page_number": 1,
                            //     "page_size": 1000
                            // })
                        });

                        if (!response.ok) {
                            console.log(response);
                        } else {
                            debugger;
                            const data = await response.json();

                            console.log("🗣️Work Plan from API ", data?.data);
                            console.log("🗣️Work Plan from API ", data.length);

                            cache[cacheKey] = data?.data; // Cache the data
                            if (data.length == 0 || data == undefined) {
                                setDataWorkPlan([])
                            } else {

                                setDataWorkPlan(data?.data);
                            }
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

                fetchData(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "work_plan/view/");
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadWorkPlan();
    }, []);

    if (loading) {
        return <>
            <LoadingScreen
                isLoading={loading}
                text={"Loading... Please wait."}
                style={"dots"}
                fullScreen={true}
                progress={0}
                timeout={0}
                onTimeout={() => console.log("Loading timed out")}
            />
        </>
    }
    const handleApprove = (id: string) => {

    }
    const handleForReview = (id: string) => {
        setForReviewApprove(!forReviewApprove);
        // alert(id + forReviewApprove);
    }
    const handleDisapprove = (id: string) => {
        alert(id);
    }
    const handleDecline = (id: string) => {
        alert(id);
    }


    const handleEdit = (row: any) => {
        console.log('Edit:', row);
    };

    const handleDelete = (row: any) => {
        console.log('Delete:', row);
    };

    const handleRowClick = (row: any) => {
        console.log('Row clicked:', row);
        return;

        // dexieD
        // try {

        //     const fetchSelectedData = async (endpoint: string) => {
        //         const signal = newAbortSignal(5000);
        //         try {
        //             debugger;
        //             const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");
        //             const response = await fetch(endpoint, {

        //                 method: "GET",
        //                 headers: {
        //                     Authorization: `bearer ${onlinePayload.token}`,
        //                     "Content-Type": "application/json",
        //                 },
        //             });

        //             if (!response.ok) {
        //                 console.log("Work Plan > view > error ", response);

        //             } else {
        //                 const lsUserIdViewOnly = localStorage.getItem("userIdViewOnly");
        //                 if (lsUserIdViewOnly) {
        //                     const parsedUserIdViewOnly = JSON.parse(lsUserIdViewOnly);
        //                 }
        //                 localStorage.setItem("userIdViewOnly", JSON.stringify(row.id));
        //                 debugger;
        //                 const data = await response.json();
        //                 console.log("Person profile > view > success ", data)
        //                 setSelectedWorkPlan(data);
        //                 setProfilesSector(data.person_profile_sector);
        //                 setProfileCfwDisabilities(data.person_profile_disability ?? []);
        //                 setProfilesFamCom(data.person_profile_family_composition);
        //                 setProfilesAttachments(data.attachments);
        //                 setAssessmentDetials(data.cfw_assessment);
        //                 setProfileCfwFamProgramDetails(data.person_profile_cfw_fam_program_details);
        //                 console.log("😘Person Profile Family Composition: ", data.person_profile_family_composition);
        //                 console.log("😊Person Profile Attachments: ", data.attachments);
        //                 console.log("😂Person Profile CFW Family Program Details: ", data.person_profile_cfw_fam_program_details);
        //                 console.log("❤️Person Profile ID: ", data.id);


        //                 console.log("✅✅Person Profile Sector: ", data.person_profile_sector);
        //                 console.log("Last Name: ", data.last_name)


        //                 // save to dexiedb
        //                 dexieDb.open();
        //                 dexieDb.transaction('rw', [
        //                     dexieDb.person_profile,
        //                     dexieDb.person_profile_sector,
        //                     dexieDb.person_profile_disability,
        //                     dexieDb.person_profile_family_composition,
        //                     dexieDb.attachments,
        //                     dexieDb.cfwassessment,
        //                     dexieDb.person_profile_cfw_fam_program_details], async () => {
        //                         try {
        //                             const existingRecord = await dexieDb.person_profile.get(data.id);
        //                             if (existingRecord) {
        //                                 await dexieDb.person_profile.update(data.id, data);
        //                                 await dexieDb.person_profile_sector.update(data.id, data.person_profile_sector);
        //                                 await dexieDb.person_profile_disability.update(data.id, data.person_profile_disability ?? []);
        //                                 await dexieDb.person_profile_family_composition.update(data.id, data.person_profile_family_composition ?? []);
        //                                 await dexieDb.attachments.update(data.id, data.attachments ?? []);
        //                                 await dexieDb.cfwassessment.update(data.id, data.cfw_assessment ?? []);
        //                                 await dexieDb.person_profile_cfw_fam_program_details.update(data.id, data.person_profile_cfw_fam_program_details ?? []);
        //                                 console.log("Record updated in DexieDB:", data.id);
        //                             } else {
        //                                 await dexieDb.person_profile.add(data);
        //                                 await dexieDb.cfwassessment.add(data.cfw_assessment);
        //                                 if (data.person_profile_disability.length !== 0) {
        //                                     await dexieDb.person_profile_disability.bulkAdd(data.person_profile_disability);
        //                                 }
        //                                 if (data.person_profile_family_composition.length !== 0) {
        //                                     for (let i = 0; i < data.person_profile_family_composition.length; i++) {
        //                                         const family = data.person_profile_family_composition[i];
        //                                         await dexieDb.person_profile_family_composition.add(family); // Save the object without raw_id
        //                                     }
        //                                 }
        //                                 if (data.person_profile_sector.length !== 0) {
        //                                     for (let i = 0; i < data.person_profile_sector.length; i++) {
        //                                         await dexieDb.person_profile_sector.bulkAdd(data.person_profile_sector);
        //                                     }
        //                                 }
        //                                 if (data.attachments.length !== 0) {
        //                                     for (let i = 0; i < data.attachments.length; i++) {
        //                                         await dexieDb.attachments.bulkAdd(data.attachments);
        //                                     }

        //                                 }
        //                                 if (data.person_profile_cfw_fam_program_details) {
        //                                     for (let i = 0; i < data.person_profile_cfw_fam_program_details.length; i++) {
        //                                         await dexieDb.person_profile_cfw_fam_program_details.bulkAdd(data.person_profile_cfw_fam_program_details);
        //                                     }
        //                                 }
        //                                 console.log("➕New record added to DexieDB:", data.id);
        //                             }
        //                         } catch (error) {
        //                             console.log("Error saving to DexieDB:", error);
        //                         }
        //                     });

        //                 router.push(`/${baseUrl}/${row.id}`);
        //             }


        //         } catch (error: any) {
        //             console.log("Error fetching data:", error);
        //             if (error.name === "AbortError") {
        //                 console.log("Request canceled", error.message);
        //                 alert("Request canceled" + error.message);
        //             } else {
        //                 console.error("Error fetching data:", error);
        //                 alert("Error fetching data:" + error);
        //             }
        //         }
        //     }
        //     fetchSelectedData("https://kcnfms.dswd.gov.ph/api/person_profile/view/" + row.id);
        // }
        // catch (error) {
        //     console.log("Error fetching data:", error);
        // }
        // router.push(`/${baseUrl}/${row.user_id}`);
        // router.push(`/${baseUrl}/${row.id}`);
    };

    const handleAddNewRecord = (newRecord: any) => {
        alert("hi")
        console.log('handleAddNewRecord', newRecord)
    };

    const fetchCFWMasterlist = () => {

    }


    return (
        <div className="p-2">
            Work Plans: {JSON.stringify(dataWorkPlan)}
            <Dialog open={forReviewApprove} onOpenChange={setForReviewApprove}>
                <DialogContent className="w-[400px] shadow-lg z-50 pb-[50px]">
                    <DialogTitle>Approval Confirmation</DialogTitle>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Approval Confirmation</DialogTitle>
                        </DialogHeader>
                        <Textarea placeholder="Input Assessment" className="mt-5" />
                        {/* <p>Record ID: { } has been approved.</p> */}
                        <DialogFooter>

                            <Button variant={"outline"}>Close</Button>
                            <Button onClick={() => handleEligible(selectedCFWID)} variant={"default"}>Eligible</Button>
                        </DialogFooter>
                    </DialogContent>

                </DialogContent>
            </Dialog>
            {/* {!forReviewApprove ?
                (
                    <Card className="w-[400px] shadow-lg z-50">
                        <CardHeader>
                            <CardTitle>Approval Confirmation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea placeholder="Input Assessment"></Textarea>
                            <p>Record ID: { } has been approved.</p>
                        </CardContent>
                        <CardFooter>
                            <Button  >Close</Button>
                        </CardFooter>
                    </Card>
                )
                        columns={profiles[0] ? Object.keys(profiles[0])
                            .filter(key => !['id', 'modality'].includes(key)) // Simplified hiding logic
                            .map(key => ({

                : null
            } */}


            <div className="min-h-screen">
                <div className="min-h-screen">
                    {/* <Button onClick={(e) => fetchData("http://10.10.10.162:9000/api/person_profiles/view/pages/")}>Test</Button> */}

                    <AppTable
                        data={[]}
                        // data={dataWorkPlan != undefined ? dataWorkPlan : []}
                        columns={columnsWorkPlan}
                        onEditRecord={handleEdit}
                        onClickAddNew={handleCreateNewWorkPlan}
                        onRowClick={handleRowClick}

                    />

                </div>
            </div>





        </div >
    )

}