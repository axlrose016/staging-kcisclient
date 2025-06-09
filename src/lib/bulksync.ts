import { IAttachments } from "@/components/interfaces/general/attachments";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { IBulkSync } from "./state/bulksync-store";

export const syncTask: IBulkSync[] = [
  {
    tag: "Person Profile",
    url: process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + `person_profile/create/`,
    module: await dexieDb.person_profile,
    force: true,
  },
  {
    tag: "Person Profile > CFW attendance log",
    url: process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + `cfwtimelogs/create/`,
    module: await dexieDb.cfwtimelogs,
    force: true,
  },
  {
    tag: "Person Profile > person_profile_disability",
    url:
      process.env.NEXT_PUBLIC_API_BASE_URL_KCIS +
      `person_profile_disability/create/`,
    module: await dexieDb.person_profile_disability,
    force: true,
  },
  {
    tag: "Person Profile > person_profile_family_composition",
    url:
      process.env.NEXT_PUBLIC_API_BASE_URL_KCIS +
      `person_profile_family_composition/create/`,
    module: await dexieDb.person_profile_family_composition,
    force: true,
  },
  {
    tag: "Person Profile > person_profile_sector",
    url:
      process.env.NEXT_PUBLIC_API_BASE_URL_KCIS +
      `person_profile_sector/create/`,
    module: await dexieDb.person_profile_sector,
    force: true,
  },
  {
    tag: "Person Profile > person_profile_cfw_fam_program_details",
    url:
      process.env.NEXT_PUBLIC_API_BASE_URL_KCIS +
      `person_profile_engagement_history/create/`,
    module: await dexieDb.person_profile_cfw_fam_program_details,
    force: true,
  },
  {
    tag: "Person Profile > attachments",
    url: process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + `attachments/create/`,
    module: await dexieDb.attachments,
    force: true,
    formdata: (record) => {
      console.log("Person Profile > attachments > record", record);
      return {
        [`${record.record_id}##${record.file_id}##${record.module_path}##${record.user_id == "" ? record.record_id : record.user_id}##${record.created_by == "" ? "error" : record.created_by}##${record.created_date}##${record.remarks}##${record.file_type}`]:
          record.file_path, // should be a File or Blob
      };
    },
    onSyncRecordResult: (record, result) => {
      if (result.success) {
        console.log("✅ attachments synced:", { record, result });

        if (result.response.length !== 0) {
          (result.response as []).forEach((file: any) => {
            (async () => {
              const newRecord = {
                ...(record as IAttachments),
                file_id: file.file_id,
                file_path: file.file_path,
                push_status_id: 1,
                push_date: new Date().toISOString(),
              };
              console.log("✅ attachments synced:", { record, result });
              await dexieDb.attachments.put(newRecord, "id");
            })();
          });
        }
      } else {
        console.error("❌ Order failed:", record.id, "-", result.error);
      }
    },
  },
  {
    tag: "Person Profile > Accomplishment Report",
    url:
      process.env.NEXT_PUBLIC_API_BASE_URL_KCIS +
      `accomplishment_report/create/`,
    module: await dexieDb.accomplishment_report,
    force: true,
  },
  {
    tag: "Person Profile > Accomplishment Report Task",
    url:
      process.env.NEXT_PUBLIC_API_BASE_URL_KCIS +
      `accomplishment_report_task/create/`,
    module: await dexieDb.accomplishment_actual_task,
    force: true,
  },
  {
    tag: "CFW Immediate Supervisor > Work Plan",
    url: process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + `work_plan/create/`,
    module: await dexieDb.work_plan,
    force: true,
  },
  {
    tag: "CFW Immediate Supervisor > Work Plan Tasks",
    url: process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + `work_plan_task/create/`,
    module: await dexieDb.work_plan_tasks,
    force: true,
  },
  {
    tag: "CFW Immediate Supervisor > Work Plan Selected Beneficiaries",
    url:
      process.env.NEXT_PUBLIC_API_BASE_URL_KCIS +
      `cfw_assessment/update/`,
    module: await dexieDb.cfwassessment,
    force: true,
  },
];
