/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { v4 as uuidv4 } from 'uuid';
import { AppTable } from "@/components/app-table";
import {
  ICFWAssessment,
  IPersonProfileCfwFamProgramDetails,
  IPersonProfileDisability,
  IPersonProfileFamilyComposition,
  IPersonProfileSector,
  IWorkPlan,
} from "@/components/interfaces/personprofile";
import LoadingScreen from "@/components/general/loading-screen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { useRouter } from "next/navigation";
// import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
const baseUrl = "/personprofile/work-plan";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import { IAttachments } from "@/components/interfaces/general/attachments";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Ban,
  HelpCircle,
  BookMarkedIcon,
} from "lucide-react";
const _session = (await getSession()) as SessionPayload;

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
  {
    id: "status",
    header: "Status",
    accessorKey: "status_id",
    filterType: "select",
    filterOptions: [null, 0, 2, 15, 10],
    sortable: true,
    align: "center",
    cell: (value: any) => {
      let icon: JSX.Element;
      let variant: "green" | "warning" | "secondary" | "destructive" | "default" | "outline";

      if (value === 2) {
        icon = <CheckCircle className="w-4 h-4 mr-1" />;
        variant = "green";
      } else if (value === null || value === 0) {
        icon = <Clock className="w-4 h-4 mr-1" />;
        variant = "warning";
      } else if (value === 10) {
        icon = <AlertCircle className="w-4 h-4 mr-1" />;
        variant = "secondary";
      } else if (value === 15) {
        icon = <Ban className="w-4 h-4 mr-1" />;
        variant = "destructive";
      }
      else if (value === 22) {
        icon = <BookMarkedIcon className="w-4 h-4 mr-1" />;
        variant = "outline";
      } else {
        icon = <HelpCircle className="w-4 h-4 mr-1" />;
        variant = "default";
      }

      return (
        <Badge variant={variant} className="flex items-center gap-1">
          {icon}
          {value === 2
            ? "Approved"
            : value === null || value === 0
              ? "Pending"
              : value === 10
                ? "For Compliance"
                : value === 15
                  ? "Rejected"
                  : value == 22
                    ? "Draft"
                    : "Unknown"}
        </Badge>
      );
    }
  },
  {
    id: "work_plan_title",
    header: "Title",
    accessorKey: "work_plan_title",
    sortable: true,
    align: "left",
  },
  {
    id: "objectives",
    header: "Objectives",
    accessorKey: "objectives",
    filterType: "text",
    sortable: true,
    align: "left",
    cell: null,
  },
  {
    id: "no_of_days_program_engagement",
    header: "# of Days Program Engagement",
    accessorKey: "no_of_days_program_engagement",
    filterType: "text",
    sortable: true,
    align: "center",
    cell: null,
  },
  {
    id: "approved_work_schedule_from",
    header: "Approved Work Schedule From",
    accessorKey: "approved_work_schedule_from",
    filterType: "text",
    sortable: true,
    align: "center",
    cell: null,
  },
  {
    id: "approved_work_schedule_to",
    header: "Approved Work Schedule To",
    accessorKey: "approved_work_schedule_to",
    filterType: "text",
    sortable: true,
    align: "center",
    cell: null,
  },
  {
    id: "no_of_beneficiaries",
    header: "Number of Beneficiaries",
    accessorKey: "no_of_beneficiaries",
    filterType: "text",
    sortable: true,
    align: "center",
    cell: null,
  },
  {
    id: "created_date",
    header: "Created At",
    accessorKey: "created_date",
    filterType: "text",
    sortable: true,
    align: "left",
    cell: null,
  },
  {
    id: "last_modified_date",
    header: "Modified At",
    accessorKey: "last_modified_date",
    filterType: "text",
    sortable: true,
    align: "left",
    cell: null,
  },

];
import WorkPlansDashboard from "./dashboard/page";
import { formatDistanceToNow, format } from "date-fns";
import LoginService from "@/components/services/LoginService";
export default function WorkPlanMasterList() {
  const [dataWorkPlan, setDataWorkPlan] = useState<IWorkPlan[]>([]);
  const [selectedPWorkPlan, setSelectedWorkPlan] = useState<IWorkPlan[]>([]);

  const [profilesSector, setProfilesSector] = useState<IPersonProfileSector[]>(
    []
  );
  const [profilesFamCom, setProfilesFamCom] = useState<
    IPersonProfileFamilyComposition[]
  >([]);
  const [profilesAttachments, setProfilesAttachments] = useState<
    IAttachments[]
  >([]);
  const [profilesCfwFamProgramDetails, setProfileCfwFamProgramDetails] =
    useState<IPersonProfileCfwFamProgramDetails[]>([]);
  const [profilesDisabilities, setProfileCfwDisabilities] = useState<
    IPersonProfileDisability[]
  >([]);
  const [assessmentDetails, setAssessmentDetials] = useState<ICFWAssessment[]>(
    []
  );

  const [reviewApproveDecline, setReviewApproveDecline] = useState([]);
  const [approvalStatuses, setApprovalStatus] = useState<{
    [key: string]: string;
  }>({});
  const [loading, setLoading] = useState(true);
  const [forReviewApprove, setForReviewApprove] = useState(false);
  const [selectedCFWID, setSetSelectedCFWID] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const router = useRouter();
  // const [data, setData] = useState([]);
  const handleEligible = (selectedCFWID?: string) => { };

  const handleCreateNewWorkPlan = () => {
    localStorage.removeItem("work_plan")
    localStorage.removeItem("selectedBeneficiaries")

    const work_plan_details = {
      "id": uuidv4(),
      "work_plan_title": "",
      "immediate_supervisor_id": _session.id,
      "deployment_area_name": "",
      "office_name": "",
      "no_of_days_program_engagement": "",
      "approved_work_schedule_from": "",
      "approved_work_schedule_to": "",
      "objectives": ""
    }

    localStorage.setItem("work_plan", JSON.stringify(work_plan_details))


    router.push(baseUrl + "/new");
  };

  function mapApiToDexieWorkPlan(data: any): IWorkPlan {
    debugger
    return {
      id: data.id,
      work_plan_title: data.work_plan_title,
      immediate_supervisor_id: data.immediate_supervisor_id,
      office_name: data.division_office_name ?? "",
      objectives: data.objectives,
      no_of_days_program_engagement: data.no_of_days_program_engagement,
      approved_work_schedule_from: data.approved_work_schedule_from,
      approved_work_schedule_to: data.approved_work_schedule_to,
      status_id: data.status_id ?? null,
      created_date: data.created_date,
      created_by: data.created_by,
      last_modified_date: data.last_modified_date ?? null,
      last_modified_by: data.last_modified_by ?? null,
      push_status_id: data.push_status_id,
      push_date: data.push_date ?? null,
      deleted_date: data.deleted_date ?? null,
      deleted_by: data.deleted_by ?? null,
      is_deleted: data.is_deleted ?? null,
      remarks: data.remarks ?? null,
      alternate_supervisor_id: data.alternate_supervisor_id,
      area_focal_person_id: data.area_focal_person_id,
      // total_number_of_bene: data.total_of_beneficiaries ?? 0,
    }
  }



  const loadWorkPlan = async () => {
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

            const formatted = data.map((item: any) => {
              const createdAt = new Date(item.created_date);
              const modifiedAt = new Date(item.last_modified_date);
              return {
                ...item,
                created_date: `${format(createdAt, "MMMM d, yyyy")} (${formatDistanceToNow(createdAt, { addSuffix: true })})`,
                last_modified_date: `${format(modifiedAt, "MMMM d, yyyy")} (${formatDistanceToNow(modifiedAt, { addSuffix: true })})`,
              };
            });

            setDataWorkPlan(formatted);
            console.log("Work Plan with Created Date", formatted)
            // setDataWorkPlan(data);
            const workPlans: IWorkPlan[] = data.map(mapApiToDexieWorkPlan);
            await dexieDb.work_plan.bulkPut(workPlans);



            console.log("🗣️Work Plan from API ", data);
            console.log("🗣️Work Plan from API ", data.length);

            if (data.length == 0 || data == undefined) {
              setDataWorkPlan([]);
            } else {
              setDataWorkPlan(formatted);
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
      // alert(_session.id)
      fetchData(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "work_plan/view/by_id/" + _session.id + "/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataWorkPlanFromDexieDb = async () => {
    loadWorkPlan();


  };
  useEffect(() => {
    setLoading(false);
    fetchDataWorkPlanFromDexieDb();

  }, []);

  if (loading) {
    return (
      <>
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
    );
  }
  const handleRefresh = async () => {
    loadWorkPlan()
  }
  const handleRowClick = (row: any) => {
    // check if mayroon sa dexiedb n record ng supervisor
    // if yes, load it
    // if no then get from api
    localStorage.removeItem("selectedBeneficiaries")
    console.log("Row clicked:", row);

    const workPlanId = row.id;
    // alert(workPlanId)
    if (row.status_id == 0 || row.status_id == 10 || row.status_id == 22 || row.status_id == null) {
      // 0=edit (url: url: /personprofile/workplan/uuid), 1=approved (viewing - url: /personprofile/workplan/uuid)

      router.push("/personprofile/work-plan/" + workPlanId + "/edit");
    } else if (row.status_id == 1) {
      // viewing 1=approved (viewing - url: /personprofile/workplan/uuid)
      router.push("/personprofile/work-plan/" + workPlanId);
    }
    return;

  };

  return (
    <div className="p-2">
      {/* Person Profile ID{_session.id}  */}
      {/* //02af6e24-1bec-4568-b9bf-8133e7faa3dc */}
      {/* Work Plans: {JSON.stringify(dataWorkPlan)} */}


      <div className="min-h-screen">
        <div className="min-h-screen">
          {/* <Button onClick={(e) => fetchData("http://10.10.10.162:9000/api/person_profiles/view/pages/")}>Test</Button> */}
          {/* role {_session.userData.role} */}
          {_session.userData.role == "CFW Immediate Supervisor" ? (
            <AppTable
              // data={[]}
              data={dataWorkPlan != undefined ? dataWorkPlan : []}
              columns={columnsWorkPlan}
              // onEditRecord={handleEdit}
              onClickAddNew={handleCreateNewWorkPlan}
              onRowClick={handleRowClick}
              onRefresh={handleRefresh}
            />

          ) : (

            <WorkPlansDashboard />
          )}

        </div>
      </div>
    </div>
  );
}
