import Dexie, { Table } from 'dexie';
import { ILibAllotmentClass, ILibAppropriationSource, ILibAppropriationType, ILibBrgy, ILibBudgetYear, ILibCFWType, ILibCity, ILibCivilStatus, ILibComponent, ILibCourses, ILibDeploymentArea, ILibDeploymentAreaCategories, ILibDivision, ILibEducationalAttainment, ILibEmploymentStatus, ILibExpense, ILibExtensionName, ILibFilesToUpload, ILibFundSource, ILibHiringProcedure, ILibIdCard, ILibIPGroup, ILibLevel, ILibModality, ILibModalitySubCategory, ILibOffice, ILibPosition, ILibProvince, ILibRegion, ILibRelationshipToBeneficiary, ILibSchoolProfiles, ILibSchoolPrograms, ILibSectors, ILibSex, ILibStatuses, ILibTypeOfDisability, ILibTypeOfWork, ILibYearLevel, ILibYearServed, IModules, IPermissions, IRoles } from '@/components/interfaces/library-interface';
import { _registerAuditHooks } from '@/hooks/use-audit';
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import { lib_fund_source } from '@/db/schema/libraries';

const commonFields = 'user_id, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks';
const _session = await getSession() as SessionPayload;

class LibDatabase extends Dexie {
    roles!: Table<IRoles, string>;
    modules!: Table<IModules, string>;
    permissions!: Table<IPermissions, string>;
    lib_fund_source!: Table<ILibFundSource, string>;
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
    lib_level!: Table<ILibLevel, string>;
    lib_employment_status!: Table<ILibEmploymentStatus, string>;
    lib_position!: Table<ILibPosition, string>;
    lib_budget_year!: Table<ILibBudgetYear, string>;
    lib_appropriation_source!: Table<ILibAppropriationSource, string>;
    lib_appropriation_type!: Table<ILibAppropriationType, string>;
    lib_allotment_class!: Table<ILibAllotmentClass, string>;
    lib_expense!: Table<ILibExpense, string>;
    lib_component!: Table<ILibComponent, string>;
    lib_office!: Table<ILibOffice, string>;
    lib_division!: Table<ILibDivision, string>;
    lib_hiring_procedure!: Table<ILibHiringProcedure, string>; 
    lib_year_served!: Table<ILibYearServed, string>;
    lib_ip_group!: Table<ILibIPGroup, string>;
    lib_region!: Table<ILibRegion, string>;
    lib_province!: Table<ILibProvince, string>;
    lib_city!: Table<ILibCity, string>;
    lib_brgy!: Table<ILibBrgy, string>;


    constructor() {
        super('libdb');
        this.version(1).stores({
            roles: `id, role_description, ${commonFields}`,
            modules: `id, module_description, module_path, ${commonFields}`,
            permissions: `id, permission_description, ${commonFields}`,
            lib_fund_source: `++id, fund_source_name, is_active, ${commonFields}`,
            lib_modality: `id, modality_name, finance_code, is_active, ${commonFields}`,
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
            lib_level: `++id, level_description, ${commonFields}`,
            lib_employment_status: `++id, employment_status_description, ${commonFields}`,
            lib_position: `++id, position_description, ${commonFields}`,
            lib_budget_year: `++id, budget_year_description, ${commonFields}`,
            lib_appropriation_source: `++id, appropriation_source_description, ${commonFields}`,
            lib_appropriation_type: `++id, appropriation_type_description, ${commonFields}`,
            lib_allotment_class: `++id, allotment_class_description, ${commonFields}`,
            lib_expense: `++id, expense_code, expense_description, ${commonFields}`,
            lib_component: `++id, component_description, ${commonFields}`,
            lib_office: `++id, office_description, ${commonFields}`,
            lib_division: `++id, division_description, ${commonFields}`,
            lib_hiring_procedure: `++id, hiring_procedure_description, ${commonFields}`,
            lib_region: `reg_id, code_correspondence, name, altName, code, geo_level, ${commonFields}`,
            lib_province: `prov_id, code_correspondence, name, code, geo_level, old_name, income_classification, region, region_correspondence, reg_id, ${commonFields}`,
            lib_city: `city_id, code_correspondence, name, code, classification, old_name, city_class, income_classification, province, province_correspondence, prov_id, ${commonFields}`,
            lib_brgy: `brgy_id, code_correspondence, name, code, geo_level, old_name, city_class, urb_rur, city, city_correspondence, city_id, ${commonFields}`
        })
        _registerAuditHooks(this, "Library", _session?.userData.email || "unknown");
    }
}
export const libDb = new LibDatabase();
