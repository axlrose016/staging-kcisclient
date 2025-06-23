"use client"
import { fetchProfiles } from "@/components/_dal/profiles";
import { fetchReviewApproveDecline } from "@/components/_dal/review_approve_decline";
import { ButtonDelete } from "@/components/actions/button-delete";
import { ButtonDialog } from "@/components/actions/button-dialog";
import { ButtonView } from "@/components/actions/button-view";
import { AppTable } from "@/components/app-table";
import { ICFWAssessment, IPersonProfile, IPersonProfileCfwFamProgramDetails, IPersonProfileDisability, IPersonProfileFamilyComposition, IPersonProfileSector } from "@/components/interfaces/personprofile";
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
const baseUrl = '/personprofile/masterlist'
const cache: Record<string, any> = {};
function newAbortSignal(timeoutMs: number) {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs || 0);
    return abortController.signal;
}
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import axios from 'axios';
import LoginService from "@/components/services/LoginService";
import { IAttachments } from "@/components/interfaces/general/attachments";

const _session = await getSession() as SessionPayload;
const columnsMasterlist = [

    {
        id: 'status',
        header: 'Status',
        accessorKey: 'STATUS',
        filterType: 'select',
        filterOptions: ['Pending', 'Eligible', 'Not Eligible', 'For Compliance'],
        sortable: true,
        align: "center",
        cell: (value: any) => <Badge variant={value == "Eligible" || value == "Active" ? "green" :
            value == "Pending" ? "warning" :
                value == "Not Eligible" ? "destructive" : "default"
        } >{value}</Badge>
    },
    {
        id: 'region',
        header: 'Region',
        accessorKey: 'REGION',
        filterType: 'text',
        sortable: true,
        align: "left",
        cell: null,
    },
    {
        id: 'school_name',
        header: 'School Name (HEI)',
        accessorKey: 'SCHOOL NAME',
        filterType: 'text',
        sortable: true,
        align: "left",
        cell: null,
    },
    {
        id: 'first_name',
        header: 'First Name',
        accessorKey: 'FIRST NAME',
        filterType: 'text',
        sortable: true,
        align: "left",
        cell: null,
    },
    {
        id: 'middle_name',
        header: 'Middle Name',
        accessorKey: 'MIDDLE NAME',
        filterType: 'text',
        sortable: true,
        align: "left",
        cell: null,
    },
    {
        id: 'last_name',
        header: 'Last Name',
        accessorKey: 'LAST NAME',
        filterType: 'text',
        sortable: true,
        align: "left",
        cell: null,
    },
    {
        id: 'sex',
        header: 'Sex Description',
        accessorKey: 'SEX DESCRIPTION',
        filterType: 'text',
        sortable: true,
        align: "center",
        cell: null,
    },
    {
        id: 'student_graduate',
        header: 'Student/ Graduate',
        accessorKey: 'STUDENT OR GRADUATE',
        filterType: 'text',
        sortable: true,
        align: "center",
        cell: null,
    },
    {
        id: 'province',
        header: 'Province',
        accessorKey: 'PROVINCE',
        filterType: 'text',
        sortable: true,
        align: "left",
        cell: null,
    },
    {
        id: 'city',
        header: 'City',
        accessorKey: 'CITY',
        filterType: 'text',
        sortable: true,
        align: "left",
        cell: null,
    },
    {
        id: 'brgy',
        header: 'Barangay',
        accessorKey: 'BRGY',
        filterType: 'text',
        sortable: true,
        align: "left",
        cell: null,
    },

    // {
    //   id: 'actions',
    //   header: 'Action',
    //   accessorKey: 'action',
    //   filterType: 'text',
    //   sortable: false,
    //   align: "center",
    //   cell: null,
    // },
];
export default function PersonProfileMasterlist({ page }: { page: number }) {
    const [profiles, setProfiles] = useState<IPersonProfile[]>([]);
    const [selectedProfiles, setSelectedProfiles] = useState<IPersonProfile[]>([]);
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



    useEffect(() => {

        async function loadProfiles() {
            try {
                const fetchData = async (endpoint: string) => {
                    const cacheKey = `${endpoint}_page_${page}`;
                    if (cache[cacheKey]) {
                        console.log("Using cached data for:", cacheKey);
                        setProfiles(cache[cacheKey]);
                        return;
                    }

                    const signal = newAbortSignal(5000);
                    try {
                        debugger;
                        const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");

                        const response = await fetch(endpoint, {
                            method: "POST",
                            headers: {
                                Authorization: `bearer ${onlinePayload.token}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                "page_number": 1,
                                "page_size": 10000
                            })
                        });

                        if (!response.ok) {
                            console.log(response);
                        } else {
                            const data = await response.json();
                            console.log("🗣️Person Profile masterlist from api ", data.data);
                            cache[cacheKey] = data.data; // Cache the data
                            setProfiles(data.data);
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

                fetchData(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "person_profile/view/pages/");
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadProfiles();
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

    // const handleOnRefresh = () => {
    //     alert("yw")
    // }
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

        // dexieD
        try {

            const fetchSelectedData = async (endpoint: string) => {
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
                    });

                    if (!response.ok) {
                        console.log("Person profile > view > error ", response);

                    } else {
                        const lsUserIdViewOnly = localStorage.getItem("userIdViewOnly");
                        if (lsUserIdViewOnly) {
                            const parsedUserIdViewOnly = JSON.parse(lsUserIdViewOnly);
                        }
                        localStorage.setItem("userIdViewOnly", JSON.stringify(row.id));
                        debugger;
                        const data = await response.json();
                        localStorage.setItem("personProfileFromAPI", JSON.stringify(data));
                        console.log("Person profile > view > success ", data)
                        setSelectedProfiles(data);
                        setProfilesSector(data.person_profile_sector as IPersonProfileSector[]);
                        setProfileCfwDisabilities(data.person_profile_disability ?? []);
                        setProfilesFamCom(data.person_profile_family_composition as IPersonProfileFamilyComposition[]);
                        const tempAttachments = data.attachments as IAttachments[]
                        setProfilesAttachments(tempAttachments);
                        setAssessmentDetials(data.cfw_assessment);
                        setProfileCfwFamProgramDetails(data.person_profile_cfw_fam_program_details as IPersonProfileCfwFamProgramDetails[]);
                        console.log("😘Person Profile Family Composition: ", data.person_profile_family_composition);
                        console.log("😊Person Profile Attachments: ", data.attachments);
                        console.log("😂Person Profile CFW Family Program Details: ", data.person_profile_cfw_fam_program_details);
                        console.log("❤️Person Profile ID: ", data.id);


                        console.log("✅✅Person Profile Sector: ", data.person_profile_sector);
                        console.log("Last Name: ", data.last_name)
                        localStorage.removeItem("attachments")
                        localStorage.setItem("attachments", JSON.stringify(data.attachments))

                        console.log("👨‍👩‍👧‍👦Family Composition: ", data.person_profile_family_composition);
                        // return;
                        // alert(data.attachments)
                        // save to dexiedb
                        dexieDb.open();
                        dexieDb.transaction('rw', [
                            dexieDb.person_profile,
                            dexieDb.person_profile_sector,
                            dexieDb.person_profile_disability,
                            dexieDb.person_profile_family_composition,
                            dexieDb.attachments,
                            dexieDb.cfwassessment,
                            dexieDb.person_profile_cfw_fam_program_details], async () => {
                                try {
                                    const existingRecord = await dexieDb.person_profile.get(data.id);
                                    if (existingRecord) {
                                        await dexieDb.person_profile.update(data.id, data);
                                        await dexieDb.person_profile_sector.update(data.id, data.person_profile_sector);
                                        await dexieDb.person_profile_disability.update(data.id, data.person_profile_disability ?? []);
                                        await dexieDb.person_profile_family_composition.update(data.id, data.person_profile_family_composition ?? []);
                                        await dexieDb.attachments.bulkPut(tempAttachments ?? []);
                                        await dexieDb.cfwassessment.update(data.id, data.cfw_assessment ?? []);
                                        await dexieDb.person_profile_cfw_fam_program_details.update(data.id, data.person_profile_cfw_fam_program_details ?? []);
                                        console.log("Record updated in DexieDB:", data.id);
                                    } else {
                                        await dexieDb.person_profile.add(data);
                                        await dexieDb.cfwassessment.add(data.cfw_assessment);
                                        if (data.person_profile_disability.length !== 0) {
                                            await dexieDb.person_profile_disability.bulkAdd(data.person_profile_disability);
                                        }
                                        if (data.person_profile_family_composition.length !== 0) {
                                            for (let i = 0; i < data.person_profile_family_composition.length; i++) {
                                                const family = data.person_profile_family_composition[i];
                                                await dexieDb.person_profile_family_composition.add(family); // Save the object without raw_id
                                            }
                                        }
                                        if (data.person_profile_sector.length !== 0) {
                                            for (let i = 0; i < data.person_profile_sector.length; i++) {
                                                await dexieDb.person_profile_sector.bulkAdd(data.person_profile_sector);
                                            }
                                        }
                                        if (data.attachments.length !== 0) {
                                            for (let i = 0; i < data.attachments.length; i++) {
                                                await dexieDb.attachments.bulkAdd(data.attachments);
                                            }

                                        }
                                        if (data.person_profile_cfw_fam_program_details) {
                                            for (let i = 0; i < data.person_profile_cfw_fam_program_details.length; i++) {
                                                await dexieDb.person_profile_cfw_fam_program_details.bulkAdd(data.person_profile_cfw_fam_program_details);
                                            }
                                        }
                                        console.log("➕New record added to DexieDB:", data.id);
                                    }
                                } catch (error) {
                                    console.log("Error saving to DexieDB:", error);
                                }
                            });

                        router.push(baseUrl + `/${row.id}`);
                    }

                } catch (error: any) {
                    console.log("Error fetching data:", error);
                    if (error.name === "AbortError") {
                        console.log("Request canceled", error.message);
                        alert("Request canceled" + error.message);
                    } else {
                        console.error("Error fetching data:", error);
                        alert("Error fetching data:" + error);
                    }
                }
            }
            fetchSelectedData(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "person_profile/view/" + row.id + "/");
        }
        catch (error) {
            console.log("Error fetching data:", error);
        }
        // router.push(`/${baseUrl}/${row.user_id}`);
        // router.push(`/${baseUrl}/${row.id}`);
    };

    const handleAddNewRecord = () => {
        router.push(baseUrl + "/new")
        // console.log('handleAddNewRecord', newRecord)
    };

    const fetchCFWMasterlist = () => {

    }


    return (
        <div className="p-2">
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
                        data={profiles}
                        columns={columnsMasterlist}
                        // onRefresh={handleOnRefresh}
                        // onEdit={handleEdit}
                        // onDelete={handleDelete}
                        onRowClick={handleRowClick}
                    // onAddNewRecord={handleAddNewRecord}
                    />
                </div>
            </div>





        </div >
    )

}