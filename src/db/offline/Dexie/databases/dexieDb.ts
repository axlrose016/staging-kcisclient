import { ICFWPayroll, ICFWPayrollBene, 
    // ICFWPayrollLog, 
    ISubmissionLog } from '@/components/interfaces/cfw-payroll';
import { IAttachments } from '@/components/interfaces/general/attachments';
import { ICFWSchedules, ICFWTimeLogs, IUser, IUserAccess } from '@/components/interfaces/iuser';
// ICity, 
import { ILibCFWType, ILibCivilStatus, ILibCourses, ILibDeploymentArea, ILibDeploymentAreaCategories, ILibEducationalAttainment, ILibExtensionName, ILibFilesToUpload, ILibIdCard, ILibIPGroup, ILibModality, ILibModalitySubCategory, ILibRelationshipToBeneficiary, ILibSchoolProfiles, ILibSchoolPrograms, ILibSectors, ILibSex, ILibStatuses, ILibTypeOfDisability, ILibTypeOfWork, ILibYearLevel, ILibYearServed, IModules, IPermissions, IRoles } from '@/components/interfaces/library-interface';
import { IAccomplishmentActualTask, IAccomplishmentReport, ICFWAssessment, IPersonProfile, IPersonProfileCfwFamProgramDetails, IPersonProfileDisability, IPersonProfileFamilyComposition, IPersonProfileSector, IWorkPlan, IWorkPlanCfw, IWorkPlanTasks } from '@/components/interfaces/personprofile';
import { IReportColumn, IReportDesigner } from '@/components/interfaces/reportdesigner';
import { lib_deployment_area_categories } from '@/db/schema/libraries';
import { person_profile_disability, person_profile_family_composition } from '@/db/schema/personprofile';
import { _registerAuditHooks } from '@/hooks/use-audit';
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import Dexie, { Table } from 'dexie';

// Extend Dexie to include table definitions
const commonFields = 'user_id, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks';
const _session = await getSession() as SessionPayload;

class MyDatabase extends Dexie {
    users!: Table<IUser, string>;
    useraccess!: Table<IUserAccess, string>;
    roles!: Table<IRoles, string>;
    modules!: Table<IModules, string>;
    permissions!: Table<IPermissions, string>;
    // lib_city!: Table<ICity, string>;
    lib_modality!: Table<ILibModality, string>;
    lib_modality_sub_category!: Table<ILibModalitySubCategory, string>;
    lib_sex!: Table<ILibSex, string>;
    lib_civil_status!: Table<ILibCivilStatus, string>;
    lib_extension_name!: Table<ILibExtensionName, string>;
    lib_sectors!: Table<ILibSectors, string>;
    lib_id_card!: Table<ILibIdCard, string>;
    lib_educational_attainment!: Table<ILibEducationalAttainment, string>;
    lib_relationship_to_beneficiary!: Table<ILibRelationshipToBeneficiary, string>;
    lib_type_of_disability!: Table<ILibTypeOfDisability, string>;
    lib_cfw_type!: Table<ILibCFWType, string>;
    lib_year_level!: Table<ILibYearLevel, string>;
    lib_courses!: Table<ILibCourses, string>;
    lib_deployment_area!: Table<ILibDeploymentArea, string>;
    lib_deployment_area_categories!: Table<ILibDeploymentAreaCategories, string>;
    lib_type_of_work!: Table<ILibTypeOfWork, string>;
    lib_files_to_upload!: Table<ILibFilesToUpload, string>;
    lib_school_profiles!: Table<ILibSchoolProfiles, string>;
    lib_school_programs!: Table<ILibSchoolPrograms, string>;
    lib_statuses!: Table<ILibStatuses, string>;
    person_profile!: Table<IPersonProfile, string>;
    person_profile_sector!: Table<IPersonProfileSector, string>;
    person_profile_disability!: Table<IPersonProfileDisability, string>;
    person_profile_family_composition!: Table<IPersonProfileFamilyComposition, string>;
    person_profile_cfw_fam_program_details!: Table<IPersonProfileCfwFamProgramDetails, string>;
    attachments!: Table<IAttachments, string>;
    lib_ip_group!: Table<ILibIPGroup, string>;
    lib_year_served!: Table<ILibYearServed, string>;
    cfwschedules!: Table<ICFWSchedules, string>;
    cfwtimelogs!: Table<ICFWTimeLogs, string>;
    cfwassessment!:Table<ICFWAssessment, string>;
    work_plan!:Table<IWorkPlan, string>;
    work_plan_tasks!:Table<IWorkPlanTasks, string>;
    work_plan_cfw!:Table<IWorkPlanCfw, string>;
    accomplishment_report!:Table<IAccomplishmentReport, string>;
    accomplishment_actual_task!:Table<IAccomplishmentActualTask, string>;
    report_designer!:Table<IReportDesigner, string>;
    report_column!:Table<IReportColumn, string>;
    cfwpayroll!:Table<ICFWPayroll, string>;
    cfwpayroll_bene!:Table<ICFWPayrollBene, string>;
    submission_log!:Table<ISubmissionLog, string>;
    


    constructor() {
        super('kcisdb');
        this.version(1).stores({
            users: `id, username, email, password, role_id, level_id, ${commonFields}`,
            useraccess: `id, module_id, permission_id, ${commonFields}`,
            roles: `id, role_description, ${commonFields}`,
            modules: `id, module_description, module_path, ${commonFields}`,
            permissions: `id, permission_description, ${commonFields}`,
            lib_modality: `id, modality_name, is_active, ${commonFields}`,
            lib_modality_sub_category: `id, modality_id,modality_sub_category_name, is_active, ${commonFields}`,
            lib_sex: `id, sex_description, ${commonFields}`,
            lib_civil_status: `id, civil_status_description, ${commonFields}`,
            lib_extension_name: `id, extension_name, is_active, ${commonFields}`,
            lib_sectors: `id, sector_name, ${commonFields}`,
            lib_id_card: `id, id_card_name, ${commonFields}`,
            lib_educational_attainment: `id, educational_attainment_description, ${commonFields}`,
            lib_relationship_to_beneficiary: `id, relationship_name, ${commonFields}`,
            lib_type_of_disability: `id, disability_name, ${commonFields}`,
            lib_cfw_type: `id, cfw_type_name, ${commonFields}`,
            lib_year_level: `id, year_level_name, ${commonFields}`,
            lib_courses: `id, course_code,course_name,course_description, ${commonFields}`,
            lib_deployment_area: `id, deployment_name, ${commonFields}`,
            lib_deployment_area_categories: `id, category_name, ${commonFields}`,
            lib_type_of_work: `id, work_name, ${commonFields}`,
            lib_files_to_upload: `id, file_name, ${commonFields}`,
            lib_ip_group: `id, name, ${commonFields}`,
            lib_year_served: `id, year_served, ${commonFields}`,
            lib_program_types: `id, program_type_name, ${commonFields}`,
            lib_school_profiles: `id, school_name,short_name, school_code, address, city_code, province_code, region_code, barangay_code, email, contact_number, school_head, school_head_position, website_url, established_year, logo_url, type, level, ${commonFields}`,
            lib_school_programs: `id, program_name, program_code, ${commonFields}`,
            lib_statuses: `id, status_name, ${commonFields}`,
            cfwschedules: ` id , record_id, cfw_type_id, shift_type, date_start, date_end, time_in_1, time_out_1, time_in_2, time_out_2, time_in_3, time_out_3, time_in_4, time_out_4, total_hours_required, status_id, ${commonFields}`,
            cfwtimelogs: `id,  record_id,  log_type,  log_in, log_out,  work_session,  total_work_hours,  status,  ${commonFields}`,
            attachments: `id, record_id, file_id, file_name, file_path,file_type, module_path, ${commonFields}`,
            person_profile: 'id, modality_id, cwf_category_id, cfwp_id_no, philsys_id_no, first_name, middle_name, last_name, extension_name, sex_id, civil_status_id, birthdate, age,' +
                'no_of_children, birthplace, is_pantawid, is_pantawid_leader, is_slp, has_immediate_health_concern, immediate_health_concern, address, sitio, brgy_code, sitio_current, ' +
                'brgy_code_current, cellphone_no, cellphone_no_secondary, email, current_occupation, is_lgu_official, is_mdc, is_bdc, is_bspmc, is_bdrrmc_bdc_twg, ' +
                'is_bdrrmc_expanded_bdrrmc, is_mdrrmc, is_hh_head, academe, business, differently_abled, farmer, fisherfolks, government, ip, ip_group_id, ngo, po, religious, ' +
                'senior_citizen, women, solo_parent, out_of_school_youth, children_and_youth_in_need_of_special_protection, family_heads_in_need_of_assistance, affected_by_disaster, ' +
                'persons_with_disability, others, is_graduate,school_name, campus, school_address, course_id, year_graduated, year_level_id, skills, family_member_name_id, ' +
                'relationship_to_family_member_id, sitio_current_address, barangay_code_current, is_permanent_same_as_current_address, id_card, occupation_id_card_number,deployment_area_name, deployment_area_id, deployment_area_address, ' +
                'representative_last_name, representative_first_name, representative_middle_name, representative_extension_name_id, representative_sitio, representative_brgy_code, ' +
                'representative_relationship_to_beneficiary, representative_birthdate, representative_age, representative_occupation, representative_monthly_salary, ' +
                'representative_educational_attainment_id, representative_sex_id, representative_contact_number, representative_id_card_id, representative_id_card_number, ' +
                'representative_address, representative_civil_status_id, representative_has_health_concern, representative_health_concern_details, representative_skills, ' +
                `preffered_type_of_work_id, modality_sub_category_id, is_pwd_representative,is_pwd,is_ip, ${commonFields}`,
            person_profile_sector: `id, person_profile_id, sector_id, ${commonFields}`,
            person_profile_disability: `id, person_profile_id, type_of_disability_id, ${commonFields}`,
            person_profile_family_composition: `id, person_profile_id, first_name, middle_name, last_name, extension_name_id, birthdate, age, contact_number, highest_educational_attainment_id, monthly_income, relationship_to_the_beneficiary_id, work, ${commonFields}`,
            person_profile_cfw_fam_program_details: `id, person_profile_id,family_composition_id,program_type_id, year_served_id, ${commonFields}`,
            cfwassessment: `id, person_profile_id,deployment_area_id,deployment_area_category_id,division_office_name,assessment,number_of_days_program_engagement, area_focal_person_id,  immediate_supervisor_id,alternate_supervisor_id,cfw_category_id,status_id,work_plan_id, ${commonFields}`,
            work_plan: `id, immediate_supervisor_id,alternate_supervisor_id,objectives, area_focal_person_id,no_of_days_program_engagement,approved_work_schedule,status_id, ${commonFields}`,
            work_plan_tasks: `id, work_plan_id,activities_tasks,expected_output, work_plan_category_id, timeline_from, timeline_to, assigned_person_id,status_id, ${commonFields}`,
            work_plan_cfw: `id, work_plan_id,cfw_id,status_id, ${commonFields}`,
            accomplishment_report: `id, person_id, period_cover_from, work_plan_id,accomplishment_actual_task, status_id, ${commonFields}`,
            accomplishment_actual_task: `id, accomplishment_report_id,task,category_id, accomplishment, mov, status_id, ${commonFields}`,
            report_designer: `id, name, columns, ${commonFields}`,
            report_column: `id, report_designer_id, label, value, type, description, visible, options,${commonFields}`,
            cfwpayroll: `id, period_cover_from, period_cover_to, status, status_date,mov_path,${commonFields}`,
            cfwpayroll_bene: `id ,bene_id,daily_time_record_id ,daily_time_record_reviewed_date,accomplishment_report_id ,accomplishment_report_reviewed_date ,period_cover_from, period_cover_to, operation_status,operation_reviewed_by, operation_status_date, odnpm_status, odnpm_reviewed_by, odnpm_status_date, finance_status,finance_reviewed_by ,finance_status_date,date_released,date_received,${commonFields}`,
            submission_log: `id, record_id ,bene_id ,module ,comment,status , status_date,${commonFields}`,
        }); 
        _registerAuditHooks(this, "Person Profile", _session?.userData.email || "unknown");
    } 
}
 

// Transaction Modes in Dexie
// "rw" (Read/Write): Allows both reading and writing.
// "r" (Read-only): Only allows reading.
// "rw!" (Read/Write, Exclusive): Ensures exclusive access to the database.

// Export the database instance
export const dexieDb = new MyDatabase();
