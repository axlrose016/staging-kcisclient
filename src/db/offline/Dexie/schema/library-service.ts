import Dexie, { EntityTable } from "dexie";
import { dexieDb } from "../databases/dexieDb";
import { libDb } from "../databases/libraryDb";
import { ILibAllotmentClass, ILibAppropriationSource, ILibAppropriationType, ILibBudgetYear, ILibCFWType, ILibCivilStatus, ILibCourses, ILibDeploymentArea, ILibDeploymentAreaCategories, ILibEducationalAttainment, ILibExpense, ILibExtensionName, ILibFilesToUpload, ILibIdCard, ILibIPGroup, ILibLevel, ILibModality, ILibModalitySubCategory, ILibPAP, ILibProgramTypes, ILibRelationshipToBeneficiary, ILibSchoolProfiles, ILibSchoolPrograms, ILibSectors, ILibSex, ILibStatuses, ILibTypeOfDisability, ILibTypeOfWork, ILibWorkPlanTaskCategory, ILibYearLevel, ILibYearServed, IModules, IPermissions, IRoles } from "@/components/interfaces/library-interface";
import { ICFWSchedules, ICFWTimeLogs, IUser, IUserAccess } from "@/components/interfaces/iuser";
import { seedCFWSchedules, seedCFWTimeLogs } from "./user-service";

const tblRoles = dexieDb.table('roles') as EntityTable<IRoles, 'id'>;
const tblModules = dexieDb.table('modules') as EntityTable<IModules, 'id'>;
const tblPermissions = dexieDb.table('permissions') as EntityTable<IPermissions, 'id'>;
const tblLibModality = dexieDb.table('lib_modality') as EntityTable<ILibModality, 'id'>;
const tblLibModalitySubCategory = dexieDb.table('lib_modality_sub_category') as EntityTable<ILibModalitySubCategory, 'id'>;
const tblLibSex = dexieDb.table('lib_sex') as EntityTable<ILibSex, 'id'>;
const tblLibCivilStatus = dexieDb.table('lib_civil_status') as EntityTable<ILibCivilStatus, 'id'>;
const tblLibExtensionName = dexieDb.table('lib_extension_name') as EntityTable<ILibExtensionName, 'id'>;
const tblLibSectors = dexieDb.table('lib_sectors') as EntityTable<ILibSectors, 'id'>;
const tblLibIdCard = dexieDb.table('lib_id_card') as EntityTable<ILibIdCard, 'id'>;
const tblLibEducationalAttainment = dexieDb.table('lib_educational_attainment') as EntityTable<ILibEducationalAttainment, 'id'>;
const tblLibRelationshipToBeneficiary = dexieDb.table('lib_relationship_to_beneficiary') as EntityTable<ILibRelationshipToBeneficiary, 'id'>;
const tblLibTypeOfDisability = dexieDb.table('lib_type_of_disability') as EntityTable<ILibTypeOfDisability, 'id'>;
const tblLibCFWType = dexieDb.table('lib_cfw_type') as EntityTable<ILibCFWType, 'id'>;
const tblLibYearLevel = dexieDb.table('lib_year_level') as EntityTable<ILibYearLevel, 'id'>;
const tblLibCourses = dexieDb.table('lib_courses') as EntityTable<ILibCourses, 'id'>;
const tblLibDeploymentArea = dexieDb.table('lib_deployment_area') as EntityTable<ILibDeploymentArea, 'id'>;
const tblLibTypeOfWork = dexieDb.table('lib_type_of_work') as EntityTable<ILibTypeOfWork, 'id'>;
const tblLibFilesToUpload = dexieDb.table('lib_files_to_upload') as EntityTable<ILibFilesToUpload, 'id'>;
const tblLibIPGroup = dexieDb.table('lib_ip_group') as EntityTable<ILibIPGroup, 'id'>;
const tblLibYearServed = dexieDb.table('lib_year_served') as EntityTable<ILibYearServed, 'id'>;
const tblLibProgramTypes = dexieDb.table('lib_program_types') as EntityTable<ILibProgramTypes, 'id'>;
const tblCFWSchedules = dexieDb.table('cfwschedules') as EntityTable<ICFWSchedules, 'id'>;
const tblCFWTimeLogs = dexieDb.table('cfwtimelogs') as EntityTable<ICFWTimeLogs, 'id'>;
const tblLibSchoolProfiles = dexieDb.table('lib_school_profiles') as EntityTable<ILibSchoolProfiles, 'id'>;
const tblLibSchoolPrograms = dexieDb.table('lib_school_programs') as EntityTable<ILibSchoolPrograms, 'id'>;
const tblLibStatuses = dexieDb.table('lib_statuses') as EntityTable<ILibStatuses, 'id'>;
const tblLibDeploymentAreaCategories = dexieDb.table('lib_deployment_area_categories') as EntityTable<ILibDeploymentAreaCategories, 'id'>;


//Library DB
const tblBudgetYear = libDb.table('lib_budget_year') as EntityTable<ILibBudgetYear, 'id'>;
const tblPAP = libDb.table('lib_pap') as EntityTable<ILibPAP, 'id'>;
const tblAllotmentClass = libDb.table('lib_allotment_class') as EntityTable<ILibAllotmentClass, 'id'>;
const tblAppropriationSource = libDb.table('lib_appropriation_source') as EntityTable<ILibAppropriationSource, 'id'>;
const tblAppropriationType = libDb.table('lib_appropriation_type') as EntityTable<ILibAppropriationType,'id'>;
const tblExpense = libDb.table('lib_expense') as EntityTable<ILibExpense, 'id'>;
const tblLibLevel = libDb.table('lib_level') as EntityTable<ILibLevel, 'id'>;

//Roles Service
export async function addRole(role: IRoles) {
    try {
        return await tblRoles.add(role);
    } catch (error) {
        return null;
    }
}
export async function bulkAddRole(roles: IRoles[]) {
    try {
        return await tblRoles.bulkAdd(roles);
    } catch (error) {
        return null;
    }
}
export async function getRoles() {
    try {
        return await tblRoles.toArray();
    } catch (error) {
        console.error('Error retrieving roles:', error);
        return [];
    }
}
export const seedRoles: IRoles[] = [
    {
        "id": "d4003a01-36c6-47af-aae5-13d3f04e110f",
        "role_description": "Administrator",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "cae2b943-9b80-45ea-af2a-823730f288ac",
        "role_description": "Guest",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "17eb1f81-83d3-4642-843d-24ba3e40f45c",
        "role_description": "Finance",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "1c99504f-ad53-4151-9a88-52e0cffdbb6d",
        "role_description": "Engineer",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "37544f59-f3ba-45df-ae0b-c8fa4e4ce446",
        "role_description": "CFW Beneficiary",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "3d735b9c-f169-46e0-abd1-59f66db1943c",
        "role_description": "CFW Immediate Supervisor",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "eed84e85-cd50-49eb-ab19-a9d9a2f3e374",
        "role_description": "CFW Alternate Supervisor",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"

    },
    {
        "id": "e2ebba79-7134-4ddb-838f-9350a89c2a0e",
        "role_description": "CFW HEI Focal Person",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    }
    ,
    {
        "id": "cf05023f-b2dc-46be-ab08-d82dfc8d8cd5",
        "role_description": "CFW Administrator",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    }
]

//Modules Service
export async function addModule(module: IModules) {
    try {
        return await tblModules.add(module);
    } catch (error) {
        return null;
    }
}
export async function bulkAddModule(modules: IModules[]) {
    try {
        return await tblModules.bulkAdd(modules);
    } catch (error) {
        return null;
    }
}
export async function getModules() {
    try {
        return await tblModules.toArray();
    } catch (error) {
        console.error('Error retrieving modules:', error);
        return [];
    }
}
export const seedModules: IModules[] = [
    {
        "id": "9bb8ab82-1439-431d-b1c4-20630259157a",
        "module_description": "Sub-Project",
        "module_path": "subproject",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "4e658b02-705a-43eb-a051-681d54e22e2a",
        "module_description": "Person Profile",
        "module_path": "personprofile",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "19a18164-3a26-4ec3-ac6d-755df1d3b980",
        "module_description": "Human Resource and Development",
        "module_path": "hr-development",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "78ac69e0-19b6-40d0-8b07-135df9152bd8",
        "module_description": "Procurement",
        "module_path": "procurement",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "ce67be45-b5aa-4272-bcf4-a32abc9d7068",
        "module_description": "Engineering",
        "module_path": "engineering",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "866e6bcb-041f-4d58-94bf-6c54e4855f85",
        "module_description": "Settings",
        "module_path": "settings",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "f8446068-385e-461c-9417-5caf086f103e",
        "module_description": "Finance",
        "module_path": "finance",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    }
]

//Permissions Service
export async function addPermission(permission: IPermissions) {
    try {
        return await tblPermissions.add(permission);
    } catch (error) {
        return null;
    }
}
export async function bulkAddPermission(permissions: IPermissions[]) {
    try {
        return await tblPermissions.bulkAdd(permissions);
    } catch (error) {
        return null;
    }
}
export async function getPermissions() {
    try {
        return await tblPermissions.toArray();
    } catch (error) {
        console.error('Error retrieving permissions:', error);
        return [];
    }
}
export const seedPermissions: IPermissions[] = [
    {
        "id": "f38252b5-cc46-4cc1-8353-a49a78708739",
        "permission_description": "Can Add",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "98747f00-76e5-497d-beac-ba4255db066f",
        "permission_description": "Can Update",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": "5568ea7d-6f12-4ce9-b1e9-adb256e5b057",
        "permission_description": "Can Delete",
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_date": new Date().toISOString(),
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    }
]

//Modality Service
export async function addModality(modality: ILibModality) {
    try {
        return await tblLibModality.add(modality);
    } catch (error) {
        return null;
    }
}
export async function bulkAddModality(modalities: ILibModality[]) {
    try {
        return await tblLibModality.bulkAdd(modalities);
    } catch (error) {
        return null;
    }
}
export async function getModalities() {
    try {
        return await tblLibModality.toArray();
    } catch (error) {
        console.error('Error retrieving modalities:', error);
        return [];
    }
}
export const seedLibModalities: ILibModality[] = [
    {
        "id": 1,
        "modality_name": "KC1",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 2,
        "modality_name": "PAMANA (2016 and earlier)",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 3,
        "modality_name": "MCC",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 4,
        "modality_name": "AF (Old)",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 5,
        "modality_name": "AUSAid",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 6,
        "modality_name": "PODER",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 7,
        "modality_name": "NCDDP",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 8,
        "modality_name": "BUB",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 9,
        "modality_name": "JFPR",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 10,
        "modality_name": "DFAT",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 11,
        "modality_name": "GIG",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 12,
        "modality_name": "CCL",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 13,
        "modality_name": "GOP",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 14,
        "modality_name": "L&E",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 15,
        "modality_name": "IP-CDD",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 16,
        "modality_name": "MAKILAHOK",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 17,
        "modality_name": "KKB",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 18,
        "modality_name": "KSB",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 19,
        "modality_name": "PAMANA (2020 onwards)",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 20,
        "modality_name": "KKB 2020",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 21,
        "modality_name": "NCDDP-AF",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 22,
        "modality_name": "PMNP",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 23,
        "modality_name": "KKB-CDD",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 24,
        "modality_name": "PAG-ABOT",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    },
    {
        "id": 25,
        "modality_name": "CFW",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
        "is_active": true
    }
]
export const seedModalitySubCategory: ILibModalitySubCategory[] = [
    {
        "id": 1,
        "modality_id": 25,
        "modality_sub_category_name": "CFW - HEI",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 2,
        "modality_id": 25,
        "modality_sub_category_name": "CFW - PWD",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    }
]
export const seedLibSex: ILibSex[] = [
    {
        "id": 1,
        "sex_description": "Female",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 2,
        "sex_description": "Male",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
]
export const seedLibCivilStatus: ILibCivilStatus[] = [
    {
        "id": 1,
        "civil_status_description": "Annulled",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 2,
        "civil_status_description": "Legally Separated",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 3,
        "civil_status_description": "Married",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 4,
        "civil_status_description": "Single",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 5,
        "civil_status_description": "Widowed",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    }
]
export const seedLibExtensionName: ILibExtensionName[] = [
    {
        "id": 1,
        "extension_name": "Jr.",
        "is_active": true,
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 2,
        "extension_name": "Sr.",
        "is_active": true,
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 3,
        "extension_name": "II",
        "is_active": true,
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 4,
        "extension_name": "III",
        "is_active": true,
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 5,
        "extension_name": "IV",
        "is_active": true,
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 6,
        "extension_name": "N/A",
        "is_active": true,
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
]
export const seedLibSectors: ILibSectors[] = [
    { "id": 1, "sector_name": "Women", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 2, "sector_name": "Out of School Youth (15-25 yrs old)", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 3, "sector_name": "Persons with Disabilities (PWD)", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 4, "sector_name": "Indigenous People (IP)", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 5, "sector_name": "4Ps Beneficiary", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 6, "sector_name": "Senior Citizen", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 7, "sector_name": "Solo Parent", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 8, "sector_name": "Children (below 14 yrs old)", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 9, "sector_name": "Children and Youth in Need of Special Protection", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 10, "sector_name": "LGBTQIA+", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 11, "sector_name": "Youth (15-30 yrs old )", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 12, "sector_name": "Family Heads in Need of Assistance", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 13, "sector_name": "Pregnant Women", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 14, "sector_name": "Farmer", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 15, "sector_name": "Fisherfolk", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 16, "sector_name": "Urban Poor", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 17, "sector_name": "Laborers", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
    { "id": 18, "sector_name": "Migrant Workers", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded", },
]
export const seedLibIdCard: ILibIdCard[] = [
    {
        "id": 1,
        "id_card_name": "National ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 2,
        "id_card_name": "Passport",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 3,
        "id_card_name": "Driver's License",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 4,
        "id_card_name": "SSS ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 5,
        "id_card_name": "GSIS ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 6,
        "id_card_name": "PRC ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 7,
        "id_card_name": "Philhealth ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 8,
        "id_card_name": "Voter's ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 9,
        "id_card_name": "Senior Citizen ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 10,
        "id_card_name": "PWD ID",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 11,
        "id_card_name": "N/A",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
]
export const seedLibEducationalAttainment: ILibEducationalAttainment[] = [
    {
        "id": 1,
        "educational_attainment_description": "N/A",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 2,
        "educational_attainment_description": "NO FORMAL EDUCATION",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 3,
        "educational_attainment_description": "DAYCARE",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 4,
        "educational_attainment_description": "KINDERGARTEN",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 5,
        "educational_attainment_description": "ELEMENTARY LEVEL",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 6,
        "educational_attainment_description": "ELEMENTARY GRADUATE",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 7,
        "educational_attainment_description": "HIGH SCHOOL LEVEL",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 8,
        "educational_attainment_description": "HIGH SCHOOL GRADUATE",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 9,
        "educational_attainment_description": "COLLEGE LEVEL",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 10,
        "educational_attainment_description": "COLLEGE GRADUATE",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 11,
        "educational_attainment_description": "WITH UNITS IN MASTERS DEGREE",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    },
    {
        "id": 12,
        "educational_attainment_description": "MASTERS DEGREE",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    }
    ,
    {
        "id": 13,
        "educational_attainment_description": "DOCTORATE DEGREE",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    }
    ,
    {
        "id": 14,
        "educational_attainment_description": "TECHNICAL-VOCATIONAL EDUCATION AND TRAINING",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    }
    ,
    {
        "id": 15,
        "educational_attainment_description": "MASTERS DEGREE",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded",
    }
];

export const seedLibRelationshipToBeneficiary: ILibRelationshipToBeneficiary[] = [
    { "id": 1, "relationship_name": "Father", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "relationship_name": "Mother", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "relationship_name": "Son", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "relationship_name": "Daughter", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 5, "relationship_name": "Spouse", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 6, "relationship_name": "Sibling", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 7, "relationship_name": "Grandfather", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 8, "relationship_name": "Grandmother", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 9, "relationship_name": "Uncle", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 10, "relationship_name": "Aunt", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 11, "relationship_name": "Cousin", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 12, "relationship_name": "Nephew", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 13, "relationship_name": "Niece", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 14, "relationship_name": "Guardian", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 15, "relationship_name": "Friend", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 16, "relationship_name": "Others", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" }
]
export const seedTypeofDisability: ILibTypeOfDisability[] = [
    { "id": 1, "disability_name": "Visual Impairment", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "disability_name": "Hearing Impairment", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "disability_name": "Speech Impairment", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "disability_name": "Physical Disability", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 5, "disability_name": "Intellectual Disability", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 6, "disability_name": "Psychosocial Disability", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 7, "disability_name": "Autism Spectrum Disorder", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 8, "disability_name": "Multiple Disabilities", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 9, "disability_name": "Chronic Illness-related Disability", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" }
];
export const seedCFWType: ILibCFWType[] = [
    { "id": 1, "cfw_type_name": "CFW for Disaster", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "cfw_type_name": "Tara Basa", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
];
export const seedYearLevel: ILibYearLevel[] = [
    { "id": 1, "year_level_name": "First Year", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "year_level_name": "Second Year", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "year_level_name": "Third Year", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "year_level_name": "Fourth Year", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 5, "year_level_name": "Fifth Year", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 6, "year_level_name": "More than Fifth Year", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 7, "year_level_name": "N/A", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" }
];
export const seedLibCourses: ILibCourses[] = [
    {
        "id": 1,
        "course_code": "BSA",
        "course_name": "BACHELOR OF SCIENCE IN ACCOUNTANCY",
        "course_description": "A program focused on accounting principles, financial reporting, and auditing.",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": 2,
        "course_code": "BSECE",
        "course_name": "BACHELOR OF SCIENCE IN ELECTRONICS ENGINEERING",
        "course_description": "A program that focuses on electronics, circuit design, and communication systems.",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": 3,
        "course_code": "BSIE",
        "course_name": "BACHELOR OF SCIENCE IN INDUSTRIAL ENGINEERING",
        "course_description": "Focuses on optimizing complex processes and systems for efficiency and productivity.",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": 4,
        "course_code": "BSENT",
        "course_name": "BACHELOR OF SCIENCE IN ENTREPRENEURSHIP",
        "course_description": "A program designed to equip students with skills for starting and managing businesses.",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": 5,
        "course_code": "BSIT",
        "course_name": "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY",
        "course_description": "A program focused on the study of computer systems, software development, and network administration.",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": 6,
        "course_code": "BSMA",
        "course_name": "BACHELOR OF SCIENCE IN MANAGEMENT ACCOUNTING",
        "course_description": "A program emphasizing financial management, cost analysis, and strategic planning.",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    },
    {
        "id": 7,
        "course_code": "BSECE",
        "course_name": "BACHELOR OF SCIENCE IN EARLY CHILDHOOD EDUCATION",
        "course_description": "A program preparing students for teaching young children in educational settings.",
        "created_date": new Date().toISOString(),
        "created_by": "00000000-0000-0000-0000-000000000000",
        "last_modified_by": "",
        "last_modified_date": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_by": "",
        "deleted_date": "",
        "is_deleted": false,
        "remarks": "Seeded"
    }
];

export const seedLibDeploymentArea: ILibDeploymentArea[] = [
    { "id": 1, "deployment_name": "Armed Forces of the Philippines", "deployment_area_short_name": "AFP", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "deployment_name": "Barangay Local Government Unit", "deployment_area_short_name": "BLGU", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "deployment_name": "Biodiversity Management Bureau", "deployment_area_short_name": "BMB", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "deployment_name": "Bureau of Fire Protection", "deployment_area_short_name": "BFP", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 5, "deployment_name": "Bureau of Jail Management and Penology", "deployment_area_short_name": "BJMP", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 6, "deployment_name": "Commission on Elections", "deployment_area_short_name": "COMELEC", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 7, "deployment_name": "Commission on Higher Education", "deployment_area_short_name": "CHED", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 8, "deployment_name": "Commission on Population and Development", "deployment_area_short_name": "POPCOM", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 9, "deployment_name": "Department of Agrarian Reform", "deployment_area_short_name": "DAR", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 10, "deployment_name": "Department of Agriculture", "deployment_area_short_name": "DA", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 11, "deployment_name": "Department of Budget and Management", "deployment_area_short_name": "DBM", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 12, "deployment_name": "Department of Education", "deployment_area_short_name": "DepEd", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 13, "deployment_name": "Department of Energy", "deployment_area_short_name": "DOE", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 14, "deployment_name": "Department of Environment and Natural Resources", "deployment_area_short_name": "DENR", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 15, "deployment_name": "Department of Health", "deployment_area_short_name": "DOH", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 16, "deployment_name": "Department of Human Settlements and Urban Development", "deployment_area_short_name": "DHSUD", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 17, "deployment_name": "Department of Justice", "deployment_area_short_name": "DOJ", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 18, "deployment_name": "Department of Public Works and Highways", "deployment_area_short_name": "DPWH", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 19, "deployment_name": "Department of Science and Technology", "deployment_area_short_name": "DOST", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 20, "deployment_name": "Department of the Interior and Local Government", "deployment_area_short_name": "DILG", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 21, "deployment_name": "Department of Social Welfare and Development - National Program Management Office", "deployment_area_short_name": "DSWD NPMO", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 22, "deployment_name": "Department of Social Welfare and Development - Regional Program Management Office", "deployment_area_short_name": "DSWD RPMO", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 23, "deployment_name": "Department of Social Welfare and Development - Satellite Offices", "deployment_area_short_name": "DSWD Satellite", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 24, "deployment_name": "Elementary School", "deployment_area_short_name": "Elementary", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 25, "deployment_name": "Higher Education Institution / State University and College / Local University and College", "deployment_area_short_name": "HEI/SUC/LUC", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 26, "deployment_name": "Junior High School", "deployment_area_short_name": "JHS", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 27, "deployment_name": "Kapit-Bisig Laban sa Kahirapan-Comprehensive and Integrated Delivery of Social Services Areas", "deployment_area_short_name": "KALAHI-CIDSS", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 28, "deployment_name": "Land Transportation Office", "deployment_area_short_name": "LTO", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 29, "deployment_name": "Local Government Hospitals", "deployment_area_short_name": "LGH", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 30, "deployment_name": "Local Government Units", "deployment_area_short_name": "LGU", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 31, "deployment_name": "Mines and Geosciences Bureau", "deployment_area_short_name": "MGB", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 32, "deployment_name": "National Irrigation Administration", "deployment_area_short_name": "NIA", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 33, "deployment_name": "National Labor Relations Commission", "deployment_area_short_name": "NLRC", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 34, "deployment_name": "National Privacy Commission", "deployment_area_short_name": "NPC", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 35, "deployment_name": "National Telecommunications Commission", "deployment_area_short_name": "NTC", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 36, "deployment_name": "National Youth Commission", "deployment_area_short_name": "NYC", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 37, "deployment_name": "National Bureau of Investigation", "deployment_area_short_name": "NBI", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 38, "deployment_name": "Philippine National Police", "deployment_area_short_name": "PNP", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 39, "deployment_name": "Philippine Coconut Authority", "deployment_area_short_name": "PCA", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 40, "deployment_name": "Philippine Information Agency", "deployment_area_short_name": "PIA", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 41, "deployment_name": "Philippine Statistics Authority", "deployment_area_short_name": "PSA", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 42, "deployment_name": "Science and Technology Information Institute", "deployment_area_short_name": "STII", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 43, "deployment_name": "Senate of the Philippines", "deployment_area_short_name": "Senate", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 44, "deployment_name": "Senior High School", "deployment_area_short_name": "SHS", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 45, "deployment_name": "Social Security System", "deployment_area_short_name": "SSS", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" }
];
export const seedLibTypeOfWork: ILibTypeOfWork[] = [
    { "id": 1, "work_name": "Office Work", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "work_name": "Field Work", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "work_name": "Clerical Work", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "work_name": "Mixed Work", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" }
];
export const seedFilesToUpload: ILibFilesToUpload[] = [
    { "id": 1, "file_name": "Primary ID (Front)", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "file_name": "Primary ID (Back)", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "file_name": "Secondary ID (Front)", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "file_name": "Secondary ID (Back)", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 5, "file_name": "PWD ID (Front)", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 6, "file_name": "PWD ID (Back)", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 7, "file_name": "School ID (Front)", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 8, "file_name": "School ID (Back)", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 9, "file_name": "Certificate of Registration from School", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 10, "file_name": "TOR/Diploma/Certification from the School Registrar", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 11, "file_name": "Certificate of Indigency", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 12, "file_name": "1x1 Picture", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 13, "file_name": "Profile Picture", "module_path": "personprofile", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" }
];
export const seedIPGroup: ILibIPGroup[] = [
    ...Array.from({ length: 101 }, (_, i) => ({
        id: i + 1,
        name: [
            "Aeta", "Agta/Aeta", "Agta-Tabangnon", "Agutaynen", "Ata-Manobo", "Badjao", "Bajao", "Banwaon", "Batak", "B'laan",
            "Bukidnon", "Cagayanen", "Cuyonin", "Dibawanon", "Dumagat", "Eskaya", "Higaonon", "Iyakan", "Kabihug", "Kalibugan",
            "Katabagan", "Lambangian", "Maguindanao", "Mandaya", "Mangyan", "Manobo", "Mansaka", "Sabanon", "Samal", "Subanen",
            "Suludnon", "Tagbanua", "Talaandig", "Tao'tbato", "Tboli", "Teduray", "Tribo Aeta", "Others", "Kankanaey", "Bago",
            "Itneg", "Ibaloy", "Tinguian", "Kalanguya", "Aplau", "Ableg", "Adasen", "Agta", "Applai", "Ayangan", "Balangao",
            "Balatoc", "Banao", "Binongan", "Bontok", "Calaoan", "Gubang", "Ibaloi", "Ibanag", "Inlaud", "Isnag", "Itawis",
            "Kalanguya", "Kalinga", "Kankanaey", "Mabaka", "Maeng", "Malanag", "Malaweg", "Masadiit", "Muyadan", "Tingguian",
            "Tuwali", "Ata", "Bagobo", "Tagabawa", "Ubo Manuvu", "Klata", "Dibabaonon", "Manguangan", "Matigsalog", "Tagakaulo",
            "Kagan / Kalagan (Muslim)", "Maranao", "Ati", "Tausug", "Bantuanon", "Cimaron", "Molbog", "Palaw An",
            "Sibuyan Manyan Tagabukid", "Ivatan", "Ibatan", "Akeanon-Bukidnon", "Umayamnon", "Panay-Bukidnon", "Mamanwa"
        ][i],
        created_date: new Date().toISOString(),
        created_by: "00000000-0000-0000-0000-000000000000",
        last_modified_by: "",
        last_modified_date: "",
        push_status_id: 2,
        push_date: "",
        deleted_by: "",
        deleted_date: "",
        is_deleted: false,
        remarks: "Seeded"
    }))
];

export const seedYearServed: ILibYearServed[] = [
    { "id": 1, "year_served": 2022, "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "year_served": 2023, "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "year_served": 2024, "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "year_served": 2025, "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
];

export const seedProgramTypes: ILibProgramTypes[] = [
    { "id": 1, "program_type_name": "DRMB-FarmAralan", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 2, "program_type_name": "DRMB-LAWA (Local Adaptation to Water Access)", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 3, "program_type_name": "DRMB-BINHI (Breaking Insufficiency through Nutritious Harvest for the Impoverished)", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 4, "program_type_name": "STB-Tara Basa Tutoring Program", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 5, "program_type_name": "KC-Cash-for-Work Program for College Graduates and Students", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { "id": 6, "program_type_name": "KC-Cash-for-Work Program for Economically Poor and Vulnerable Communities/Sectors", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },

];



export const seedLibSchoolProfiles: ILibSchoolProfiles[] = [
    { id: 1, school_name: "QUEZON CITY UNIVERSITY", short_name: "QCU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 2, school_name: "PARAÑAQUE CITY COLLEGE", short_name: "PCC", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 3, school_name: "COLEGIO DE MUNTINLUPA", short_name: "CDMun", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 4, school_name: "TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES", short_name: "TUP", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 5, school_name: "RIZAL TECHNOLOGICAL UNIVERSITY", short_name: "RTU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 6, school_name: "BENGUET STATE UNIVERSITY", short_name: "BSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 7, school_name: "KALINGA STATE  UNIVERSITY", short_name: "KSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 8, school_name: "IFUGAO STATE UNIVERSITY", short_name: "IFSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 9, school_name: "ILOCOS SUR POLYTECHNIC STATE COLLEGE  - MAIN CAMPUS", short_name: "ISPSC", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 10, school_name: "URDANETA CITY UNIVERSITY", short_name: "UCU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 11, school_name: "BINALATONGAN COMMUNITY COLLEGE", short_name: "BCC", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 12, school_name: "ISABELA STATE UNIVERSITY", short_name: "ISU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 13, school_name: "CAGAYAN STATE UNIVERSITY", short_name: "CSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 14, school_name: "DON HONORIO VENTURA STATE UNIVERSITY", short_name: "DHVSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 15, school_name: "BULACAN POLYTECHNIC COLLEGE", short_name: "BPC", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 16, school_name: "POLYTECHNIC COLLEGE OF THE CITY OF MEYCAUAYAN", short_name: "PCM", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 17, school_name: "BULACAN AGRICULTURAL STATE COLLEGE", short_name: "BASC", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 18, school_name: "CITY COLLEGE OF SAN JOSE DEL MONTE", short_name: "CCSJDM", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 19, school_name: "PRESIDENT RAMON MAGSAYSAY STATE UNIVERSITY", short_name: "PRMSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 20, school_name: "GAPAN CITY COLLEGE", short_name: "GCC", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 21, school_name: "EDUARDO L. JOSON  MEMORIAL COLLEGE", short_name: "ELJMC", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 22, school_name: "CENTRAL LUZON STATE UNIVERSITY", short_name: "CLSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 23, school_name: "KOLEHIYO NG LUNSOD NG DASMARIÑAS", short_name: "KLD", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 24, school_name: "TRECE MARTIRES CITY COLLEGE", short_name: "TMCC", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 25, school_name: "LAGUNA STATE POLYTECHNIC UNIVERSITY", short_name: "LSPU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 26, school_name: "DALUBHASAN NG LUNGSOD NG SAN PABLO", short_name: "DLSP", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 27, school_name: "CITY COLLEGE OF CALAMBA", short_name: "CCC", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 28, school_name: "BATANGAS STATE UNIVERSITY", short_name: "BSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 29, school_name: "COLEGIO NG LUNGSOD NG BATANGAS", short_name: "CLB", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 30, school_name: "KOLEHIYO NG LUNSOD NG LIPA", short_name: "KLL", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 31, school_name: "TANAUAN CITY COLLEGE", short_name: "TCC", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 32, school_name: "UNIVERSITY OF RIZAL SYSTEM", short_name: "URS", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 33, school_name: "ANTIPOLO INSTITUTE OF TECHNOLOGY", short_name: "AITECH", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 34, school_name: "COLEGIO DE MONTALBAN", short_name: "CDM", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 35, school_name: "COLEGIO DE LA CIUDAD DE TAYABAS", short_name: "CCT", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 36, school_name: "DALUBHASAN NG LUNGSOD NG LUCENA", short_name: "DLL", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 37, school_name: "SOUTHERN LUZON STATE UNIVERSITY", short_name: "SLSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 38, school_name: "PALAWAN STATE UNIVERSITY", short_name: "PSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 39, school_name: "DARAGA COMMUNITY COLLEGE", short_name: "DComC", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 40, school_name: "IlOILO CITY COMMUNITY  COLLEGE", short_name: "ICCC", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 41, school_name: "NEGROS ORIENTAL STATE UNIVERSITY", short_name: "NORSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 42, school_name: "BOHOL ISLAND STATE UNIVERSITY", short_name: "BISU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 43, school_name: "CEBU NORMAL UNIVERSITY", short_name: "CNU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 44, school_name: "EASTERN SAMAR STATE UNIVERSITY", short_name: "ESSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 45, school_name: "NORTHWESTERN SAMAR STATE UNIVERSITY", short_name: "NwSSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 46, school_name: "VISAYAS STATE UNIVERSITY", short_name: "VSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 47, school_name: "JOSE RIZAL MEMORIAL STATE UNIVERSITY", short_name: "JRMSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 48, school_name: "WESTERN MINDANAO STATE UNIVERSITY", short_name: "WMSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 49, school_name: "UNIVERSITY OF SCIENCE AND TECHNOLOGY OF SOUTHERN PHILIPPINES", short_name: "USTP", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 50, school_name: "BUKIDNON STATE UNIVERSITY", short_name: "BukSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 51, school_name: "DAVAO ORIENTAL STATE UNIVERSITY", short_name: "DOrSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 52, school_name: "DAVAO DEL NORTE STATE UNIVERSITY", short_name: "DNSC", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 53, school_name: "DAVAO DEL SUR STATE COLLEGE - MAIN", short_name: "DSSC", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 54, school_name: "COTABATO FOUNDATION COLLEGE OF SCIENCE AND TECHNOLOGY", short_name: "CFCST", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 55, school_name: "CARAGA STATE UNIVERSITY - MAIN CAMPUS", short_name: "CarSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 56, school_name: "NORTH EASTERN MINDANAO STATE UNIVERSITY", short_name: "NEMSU", school_code: "", address: "", city_code: "", province_code: "", region_code: "", barangay_code: "", email: "", contact_number: "", school_head: "", school_head_position: " ", website_url: " ", established_year: 0, logo_url: "", type: "Public", level: "College", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" }
]

export const seedLibStatuses: ILibStatuses[] = [
    { id: 1, status_name: "Eligible", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 2, status_name: "Approved", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 3, status_name: "Archived", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 4, status_name: "Cancelled", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 5, status_name: "Completed", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 6, status_name: "Declined", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 7, status_name: "Ended", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 8, status_name: "Endorsed", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 9, status_name: "Escalated", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 10, status_name: "For Compliance", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 11, status_name: "For Review", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 12, status_name: "In Progress", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 13, status_name: "On Hold", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 14, status_name: "Pending", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 15, status_name: "Rejected", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 16, status_name: "Reviewed", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 17, status_name: "Revised", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 18, status_name: "Stopped", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 19, status_name: "Transferred", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 20, status_name: "Not Eligible", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 21, status_name: "To be Hired", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 22, status_name: "Regret", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },

];

export const seedLibSchoolPrograms: ILibSchoolPrograms[] = [
    { id: 1, program_name: "BACHELOR OF ARTS IN COMMUNICATION", program_code: "ABCOMM", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 2, program_name: "BACHELOR OF ARTS IN POLITICAL SCIENCE", program_code: "ABPOLSCI", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 3, program_name: "BACHELOR OF ARTS MAJOR IN PSYCHOLOGY", program_code: "ABPSY", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 4, program_name: "BACHELOR OF EARLY CHILDHOOD EDUCATION", program_code: "BECED", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 5, program_name: "BACHELOR OF ELEMENTARY EDUCATION", program_code: "BEED", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 6, program_name: "BACHELOR OF PHYSICAL EDUCATION", program_code: "BPED", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 7, program_name: "BACHELOR OF SCIENCE IN ACCOUNTANCY", program_code: "BSACCT", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 8, program_name: "BACHELOR OF SCIENCE IN EARLY CHILDHOOD EDUCATION", program_code: "BSECE", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 9, program_name: "BACHELOR OF SCIENCE IN ELECTRONICS ENGINEERING", program_code: "BSECEENG", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 10, program_name: "BACHELOR OF SCIENCE IN ENTREPENEURSHIP", program_code: "BSENTREP", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 11, program_name: "BACHELOR OF SCIENCE IN INDUSTRIAL ENGINEERING", program_code: "BSIE", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 12, program_name: "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY", program_code: "BSIT", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 13, program_name: "BACHELOR OF SCIENCE IN MANAGEMENT ACCOUNTING", program_code: "BSMA", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 14, program_name: "BACHELOR OF SCIENCE IN REAL ESTATE MANAGEMENT", program_code: "BSREM", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 15, program_name: "BACHELOR OF SCIENCE IN TOURISM MANAGEMENT", program_code: "BSTM", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 16, program_name: "HOSPITALITY MANAGEMENT SERVICES", program_code: "HMS", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 17, program_name: "BACHELOR OF SCIENCE IN ARCHITECTURE", program_code: "BSA", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 18, program_name: "BACHELOR OF SCIENCE IN CIVIL ENGINEERING", program_code: "BSCE", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 19, program_name: "BACHELOR OF SCIENCE IN COMPUTER ENGINEERING", program_code: "BSCE", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 20, program_name: "BACHELOR OF SCIENCE IN ELECTRICAL ENGINEERING", program_code: "BSEE", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 21, program_name: "BACHELOR OF SCIENCE IN ENVIRONMENT AND SANITARY ENGINEERING", program_code: "BSESE", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 23, program_name: "BACHELOR OF SCIENCE IN MECHANICAL ENGINEERING", program_code: "BSME", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 24, program_name: "BACHELOR IN GRAPHIC TECHNOLOGY MAJOR IN INDUSTRIAL DESIGN", program_code: "BIGTMID", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 25, program_name: "BACHELOR IN GRAPHIC TECHNOLOGY MAJOR IN MECHANICAL DRAFTING TECHNOLOGY", program_code: "BIGTMMDT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 26, program_name: "BACHELOR OF APPLIED SCIENCE IN LABORATORY TECHNOLOGY", program_code: "BASLT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 27, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY MAJOR IN CIVIL TECHNOLOGY", program_code: "BETCT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 28, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY MAJOR IN COMPUTER ENGINEERING TECHNOLOGY", program_code: "BETCET", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 29, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY MAJOR IN ELECTRICAL TECHNOLOGY", program_code: "BETET", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 30, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY MAJOR IN ELECTRONIC COMMUNICATION TECHNOLOGY", program_code: "BETECT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 31, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY MAJOR IN ELECTRONICS TECHNOLOGY", program_code: "BETETC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 32, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY MAJOR IN INSTRUMENTATION AND CONTROL TECHNOLOGY", program_code: "BETICT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 33, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY MAJOR IN MECHANICAL ENGINEERING TECHNOLOGY OPTION IN  HEATING VENTILATING & AIR-CONDITIONING", program_code: "BETMETHVAC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 34, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY MAJOR IN MECHANICAL ENGINEERING TECHNOLOGY OPTION IN AUTOMOTIVE TECHNOLOGY", program_code: "BETMETAT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 35, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY MAJOR IN MECHANICAL TECHNOLOGY", program_code: "BETMT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 36, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY MAJOR IN MECHATRONICS TECHNOLOGY", program_code: "BETMCT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 37, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY MAJOR IN RAILWAY TECHNOLOGY", program_code: "BETRT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 38, program_name: "BACHELOR OF FINE ARTS", program_code: "BFA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 39, program_name: "BACHELOR OF TECHNOLOGY IN CULINARY TECHNOLOGY", program_code: "BTCT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 40, program_name: "BACHELOR OF SCIENCE IN BUSINESS MANAGEMENT MAJOR IN INDUSTRIAL MANAGEMENT", "program_code": "BSIBMIM", "created_date": "2025-04-10T15:41:53.144005", "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 41, program_name: "BACHELOR OF TECHNOLOGY IN PRINT MEDIA TECHNOLOGY", program_code: "BTPMT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 42, program_name: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE", "program_code": "BSCS", "created_date": "2025-04-10T15:41:53.144005", "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 43, program_name: "POWER PLANT TECHNOLOGY", program_code: "PPT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 44, program_name: "DIES AND MOULDS TECHNOLOGY", program_code: "DMT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 45, program_name: "BACHELOR OF SCIENCE IN ENTREPRENEURSHIP", "program_code": "BSE", "created_date": "2025-04-10T15:41:53.144005", "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 46, program_name: "BACHELOR OF SCIENCE IN ENVIRONMENTAL SCIENCE", "program_code": "BSES", "created_date": "2025-04-10T15:41:53.144005", "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 47, program_name: "BACHELOR OF SCIENCE IN FOOD TECHNOLOGY", program_code: "BSFT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 48, program_name: "BACHELOR OF SCIENCE IN HOSPITALITY MANAGEMENT", program_code: "BSHM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 49, program_name: "BACHELOR OF SCIENCE IN INFORMATION SYSTEM", program_code: "BSIS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 50, program_name: "REFRIGERATION TECHNOLOGY", program_code: "RFT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 51, program_name: "BACHELOR OF SCIENCE INDUSTRIAL EDUCATION MAJOR IN HOME ECONOMICS", program_code: "BSIEHE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 52, program_name: "BACHELOR OF SCIENCE INDUSTRIAL EDUCATION MAJOR IN INDUSTRIAL ARTS", program_code: "BSIEIA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 53, program_name: "BACHELOR OF SCIENCE INDUSTRIAL EDUCATION MAJOR IN INFORMATION AND COMMUNICATION TECHNOLOGY", program_code: "BSIEICT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 54, program_name: "WELDING TECHNOLOGY", program_code: "WDT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 55, program_name: "BACHELOR OF TECHNICAL VOCATIONAL TEACHERS EDUCATION MAJOR IN ANIMATION", program_code: "BTVTEDA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 56, program_name: "BACHELOR OF TECHNICAL VOCATIONAL TEACHERS EDUCATION MAJOR IN AUTOMOTIVE", program_code: "BTVTEDAU", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 57, program_name: "BACHELOR OF TECHNICAL VOCATIONAL TEACHERS EDUCATION MAJOR IN BEAUTY CARE AND WELLNESS", program_code: "BTVTEDBCW", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 58, program_name: "BACHELOR OF TECHNICAL VOCATIONAL TEACHERS EDUCATION MAJOR IN COMPUTER PROGRAMMING", program_code: "BTVTEDCP", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 59, program_name: "BACHELOR OF TECHNICAL VOCATIONAL TEACHERS EDUCATION MAJOR IN ELECTRICAL", program_code: "BTVTEDEL", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 60, program_name: "BACHELOR OF TECHNICAL VOCATIONAL TEACHERS EDUCATION MAJOR IN ELECTRONICS", program_code: "BTVTEDEC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 61, program_name: "BACHELOR OF TECHNICAL VOCATIONAL TEACHERS EDUCATION MAJOR IN FASHION AND GARMENT", program_code: "BTVTEDFG", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 62, program_name: "BACHELOR OF TECHNICAL VOCATIONAL TEACHERS EDUCATION MAJOR IN FOOD SERVICE MANAGEMENT", program_code: "BTVTEDFSM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 63, program_name: "BACHELOR OF TECHNICAL VOCATIONAL TEACHERS EDUCATION MAJOR IN HEAT VENTILLATION & AIR CONDITIONING", program_code: "BTVTEDHVAC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 64, program_name: "BACHELOR OF TECHNOLOGY IN APPAREL AND FASHION", program_code: "BTAPF", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 65, program_name: "ASSOCIATE IN ACCOUNTING", program_code: "AA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 66, program_name: "ASSOCIATE IN COMPUTER TECHNOLOGY", program_code: "ACT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 67, program_name: "ASSOCIATE IN HOTEL AND RESTAURANT MANAGEMENT", program_code: "AHRM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 68, program_name: "ASSOCIATE IN INDUSTRIAL TECHNOLOGY MAJOR IN ARCHITECTURAL DRAFTING", program_code: "AIT-ARCHDRAFT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 69, program_name: "ASSOCIATE IN INDUSTRIAL TECHNOLOGY MAJOR IN AUTOMOTIVE", program_code: "AIT-AUTO", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 70, program_name: "ASSOCIATE IN INDUSTRIAL TECHNOLOGY MAJOR IN CIVIL", program_code: "AIT-CIVIL", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 71, program_name: "ASSOCIATE IN INDUSTRIAL TECHNOLOGY MAJOR IN ELECTRICAL", program_code: "AIT-ELEC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 72, program_name: "ASSOCIATE IN INDUSTRIAL TECHNOLOGY MAJOR IN ELECTRONICS", program_code: "AIT-ELECTRO", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 73, program_name: "ASSOCIATE IN INDUSTRIAL TECHNOLOGY MAJOR IN FOOD", program_code: "AIT-FOOD", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 74, program_name: "ASSOCIATE IN INDUSTRIAL TECHNOLOGY MAJOR IN GARMENTS", program_code: "AIT-GARMENTS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 75, program_name: "ASSOCIATE IN INDUSTRIAL TECHNOLOGY MAJOR IN REFRIGERATION & AIR-CONDITIONING", program_code: "AIT-RAC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 76, program_name: "ASSOCIATE IN MANAGEMENT", program_code: "AM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 77, program_name: "ASSOCIATE IN MEDICAL-DENTAL-NURSING ASSISTANT", program_code: "MDNA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 78, program_name: "ASSOCIATE IN SECRETARIAL EDUCATION", program_code: "ASE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 79, program_name: "ASSOCIATE IN TOURISM MANAGEMENT", program_code: "ATM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 80, program_name: "BACHELOR IN GRAPHIC TECHNOLOGY MAJOR IN ARCHITECTURE TECHNOLOGY", program_code: "BGT-ARCHTECH", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 81, program_name: "BACHELOR IN PUBLIC ADMINISTRATION", program_code: "BPA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 82, program_name: "BACHELOR OF ARTS IN CRIMINOLOGY", program_code: "ABCRIM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 83, program_name: "BACHELOR OF ARTS IN ECONOMICS", program_code: "ABECO", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 84, program_name: "BACHELOR OF ARTS IN ENGLISH LANGUAGE", program_code: "ABENG", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 85, program_name: "BACHELOR OF ARTS IN FILIPINO LANGUAGE", program_code: "ABFIL", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 86, program_name: "BACHELOR OF ARTS IN FINE ARTS", program_code: "ABFA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 87, program_name: "BACHELOR OF ARTS IN HISTORY", program_code: "ABHIS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 88, program_name: "BACHELOR OF ARTS IN LITERATURE", program_code: "ABLIT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 89, program_name: "BACHELOR OF ARTS IN MASS COMMUNICATION", program_code: "ABMC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 90, program_name: "BACHELOR OF ARTS IN PHILIPPINE STUDIES", program_code: "ABPHILSTUD", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 91, program_name: "BACHELOR OF ARTS IN PHILOSOPHY", program_code: "ABPHILO", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 92, program_name: "BACHELOR OF ARTS IN PSYCHOLOGY", program_code: "ABPSY", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 93, program_name: "BACHELOR OF ARTS IN PUBLIC ADMINISTRATION", program_code: "ABPA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 94, program_name: "BACHELOR OF ARTS IN SOCIAL SCIENCE", program_code: "ABSS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 95, program_name: "BACHELOR OF ARTS IN SOCIAL SERVICES", program_code: "ABSOCSERV", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 96, program_name: "BACHELOR OF ARTS IN SOCIOLOGY", program_code: "ABSOCIO", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 97, program_name: "BACHELOR OF ARTS MAJOR IN LITERATURE", program_code: "ABLIT-MAJ", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 98, program_name: "BACHELOR OF ARTS MAJOR IN MASS COMMUNICATION", program_code: "ABMC-MAJ", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 99, program_name: "BACHELOR OF ARTS MAJOR IN MATHEMATICS", program_code: "ABMATH-MAJ", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 100, program_name: "BACHELOR OF ARTS MAJOR IN PUBLIC ADMINISTRATION", program_code: "ABPA-MAJ", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 101, program_name: "BACHELOR OF CONSTRUCTION ENGINEERING TECHNOLOGY AND MANAGEMENT", program_code: "BCETM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 102, program_name: "BACHELOR OF CULTURE AND ARTS EDUCATION", program_code: "BCAE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 103, program_name: "BACHELOR OF ELEMENTARY EDUCATION MAJOR IN EARLY CHILDHOOD EDUCATION (ECE)", program_code: "BEED-ECE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 104, program_name: "BACHELOR OF ELEMENTARY EDUCATION MAJOR IN GENERAL EDUCATION (GEN ED)", program_code: "BEED-GENED", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 105, program_name: "BACHELOR OF ELEMENTARY EDUCATION MAJOR IN SPECIAL EDUCATION (SPED)", program_code: "BEED-SPED", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 106, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY MAJOR IN MECHANICAL ENGINEERING TECHNOLOGY OPTION IN: AUTOMOTIVE", program_code: "BET-MET-AUTO", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 107, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY MAJOR IN MECHANICAL ENGINEERING TECHNOLOGY OPTION IN: DIES AND MOLDS TECHNOLOGY", program_code: "BET-MET-DMT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 108, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY MAJOR IN MECHANICAL ENGINEERING TECHNOLOGY OPTION IN: HEATING VENTILATING & AIR-CONDITIONING", program_code: "BET-MET-HVAC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 109, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY MAJOR IN MECHANICAL ENGINEERING TECHNOLOGY OPTION IN: POWER PLANT TECHNOLOGY", program_code: "BET-MET-PPT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 110, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY MAJOR IN MECHANICAL ENGINEERING TECHNOLOGY OPTION IN: REFRIGERATION TECHNOLOGY", program_code: "BET-MET-REF", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 111, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY MAJOR IN MECHANICAL ENGINEERING TECHNOLOGY OPTION IN: WELDING TECHNOLOGY", program_code: "BET-MET-WELD", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 112, program_name: "BACHELOR OF FINE ARTS MAJOR IN VISUAL COMMUNICATION", program_code: "BFA-VC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 113, program_name: "BACHELOR OF INDUSTRIAL TECHNOLOGY", program_code: "BIT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 114, program_name: "BACHELOR OF LIBRARY AND INFORMATION SCIENCE (BLIS)", program_code: "BLIS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 115, program_name: "BACHELOR OF MUSIC MAJOR IN MUSIC EDUCATION", program_code: "BM-ME", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 116, program_name: "BACHELOR OF PUBLIC ADMINISTRATION", program_code: "BPA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 117, program_name: "BACHELOR OF SCIENCE IN ACCOUNTING INFORMATION SYSTEM", program_code: "BSAIS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 118, program_name: "BACHELOR OF SCIENCE IN AGRI-BUSINESS", program_code: "BSAB", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 119, program_name: "BACHELOR OF SCIENCE IN AGRIBUSINESS MAJOR IN FINANCE", program_code: "BSAB-FIN", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 120, program_name: "BACHELOR OF SCIENCE IN AGRIBUSINESS MAJOR IN MARKETING", program_code: "BSAB-MKT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 121, program_name: "BACHELOR OF SCIENCE IN AGRICULTURAL AND BIOSYSTEMS ENGINEERING", program_code: "BSABE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 122, program_name: "BACHELOR OF SCIENCE IN AGRICULTURAL BUSINESS", program_code: "BSAGRBUS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 123, program_name: "BACHELOR OF SCIENCE IN AGRICULTURAL ENGINEERING", program_code: "BSAE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 124, program_name: "BACHELOR OF SCIENCE IN AGRICULTURAL TECHNOLOGY", program_code: "BSAT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 125, program_name: "BACHELOR OF SCIENCE IN AGRICULTURE", program_code: "BSA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 126, program_name: "BACHELOR OF SCIENCE IN AGRICULTURE MAJOR IN AGRICULTURAL", program_code: "BSA-AGRI", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 127, program_name: "BACHELOR OF SCIENCE IN AGRICULTURE MAJOR IN AGROFORESTRY", program_code: "BSA-AGRO", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 128, program_name: "BACHELOR OF SCIENCE IN AGRICULTURE MAJOR IN AGRONOMY", program_code: "BSA-AGRO", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 129, program_name: "BACHELOR OF SCIENCE IN AGRICULTURE MAJOR IN ANIMAL SCIENCE", program_code: "BSA-AS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 130, program_name: "BACHELOR OF SCIENCE IN AGRICULTURE MAJOR IN CROP SCIENCE", program_code: "BSA-CS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 131, program_name: "BACHELOR OF SCIENCE IN AGRICULTURE MAJOR IN ECONOMICS", program_code: "BSA-ECON", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 132, program_name: "BACHELOR OF SCIENCE IN AGRICULTURE MAJOR IN ENTOMOLOGY", program_code: "BSA-ENTO", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 133, program_name: "BACHELOR OF SCIENCE IN AGRICULTURE MAJOR IN EXTENSION EDUCATION", program_code: "BSA-EXTED", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 134, program_name: "BACHELOR OF SCIENCE IN AGRICULTURE MAJOR IN HORTICULTURE", program_code: "BSA-HORT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 135, program_name: "BACHELOR OF SCIENCE IN AGRICULTURE MAJOR IN ORGANIC AGRICULTURE", program_code: "BSA-OA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 136, program_name: "BACHELOR OF SCIENCE IN AGRICULTURE MAJOR IN PLANT BREEDING", program_code: "BSA-PB", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 137, program_name: "BACHELOR OF SCIENCE IN AGRICULTURE MAJOR IN PLANT PATHOLOGY", program_code: "BSA-PP", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 138, program_name: "BACHELOR OF SCIENCE IN AGRICULTURE MAJOR IN SOIL SCIENCE", program_code: "BSA-SS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 139, program_name: "BACHELOR OF SCIENCE IN AGROFORESTRY", program_code: "BSAF", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 140, program_name: "BACHELOR OF SCIENCE IN ANIMAL HUSBANDRY", program_code: "BSAH", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 141, program_name: "BACHELOR OF SCIENCE IN APPLIED ECONOMICS", program_code: "BSAECO", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 142, program_name: "BACHELOR OF SCIENCE IN APPLIED MATHEMATICS", program_code: "BSAMATH", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 143, program_name: "BACHELOR OF SCIENCE IN APPLIED PHYSICS", program_code: "BSAPHYS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 144, program_name: "BACHELOR OF SCIENCE IN ASTRONOMY", program_code: "BSASTRO", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 145, program_name: "BACHELOR OF SCIENCE IN AUTOMOTIVE TECHNOLOGY", program_code: "BSAT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 146, program_name: "BACHELOR OF SCIENCE IN AUTOTRONICS", program_code: "BSAUTO", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 147, program_name: "BACHELOR OF SCIENCE IN AVIATION MANAGEMENT MAJOR IN AIRFRAME & POWER PLANT", program_code: "BSAVM-APP", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 148, program_name: "BACHELOR OF SCIENCE IN BIOLOGY", program_code: "BSBIO", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 149, program_name: "BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION MAJOR IN BUSINESS ECONOMICS", program_code: "BSBA-BE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 150, program_name: "BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION MAJOR IN FINANCIAL MANAGEMENT", program_code: "BSBA-FM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 151, program_name: "BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION MAJOR IN HUMAN RESOURCE MANAGEMENT", program_code: "BSBA-HRM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 152, program_name: "BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION MAJOR IN MARKETING MANAGEMENT", program_code: "BSBA-MM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 153, program_name: "BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION MAJOR IN OPERATIONS MANAGEMENT", program_code: "BSBA-OM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 154, program_name: "BACHELOR OF SCIENCE IN CHEMISTRY", program_code: "BSCHEM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 155, program_name: "BACHELOR OF SCIENCE IN COMMUNITY DEVELOPMENT", program_code: "BSCD", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 156, program_name: "BACHELOR OF SCIENCE IN COOPERATIVE MANAGEMENT", program_code: "BSCM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 157, program_name: "BACHELOR OF SCIENCE IN CRIMINOLOGY", program_code: "BSCRIM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 158, program_name: "BACHELOR OF SCIENCE IN CUSTOMS ADMINISTRATION", program_code: "BSCA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 159, program_name: "BACHELOR OF SCIENCE IN DATA SCIENCE", program_code: "BSDS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 160, program_name: "BACHELOR OF SCIENCE IN DEVELOPMENT COMMUNICATION", program_code: "BSDC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 161, program_name: "BACHELOR OF SCIENCE IN DISASTER RESILIENCY AND MANAGEMENT", program_code: "BSDRM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 162, program_name: "BACHELOR OF SCIENCE IN ECONOMICS", program_code: "BSECON", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 163, program_name: "BACHELOR OF SCIENCE IN ELECTRO-MECHANICAL TECHNOLOGY MAJOR IN INDUSTRIAL AUTOMATION", program_code: "BSEMT-IA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 164, program_name: "BACHELOR OF SCIENCE IN ELECTRO-MECHANICAL TECHNOLOGY MAJOR IN MECHATRONICS & ROBOTICS", program_code: "BSEMT-MR", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 165, program_name: "BACHELOR OF SCIENCE IN ELECTRONICS AND COMMUNICATION ENGINEERING", program_code: "BSECE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 166, program_name: "BACHELOR OF SCIENCE IN ELECTRONICS TECHNOLOGY", program_code: "BSET", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 167, program_name: "BACHELOR OF SCIENCE IN ELECTRONICS TECHNOLOGY MAJOR IN ELECTRONICS SYSTEMS", program_code: "BSET-ES", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 168, program_name: "BACHELOR OF SCIENCE IN ELECTRONICS TECHNOLOGY MAJOR IN MULTIMEDIA SYSTEM TECHNOLOGY", program_code: "BSET-MST", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 169, program_name: "BACHELOR OF SCIENCE IN ELECTRONICS TECHNOLOGY MAJOR IN TELECOMMUNICATIONS & NETWORKS", program_code: "BSET-TN", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 170, program_name: "BACHELOR OF SCIENCE IN ENERGY SYSTEMS AND MANAGEMENT MAJOR IN ELECTRICAL MACHINES CONTROL & MAINTENANCE", program_code: "BSESM-EMCM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 171, program_name: "BACHELOR OF SCIENCE IN ENERGY SYSTEMS AND MANAGEMENT MAJOR IN POWER SYSTEM DISTRIBUTION WITH ECO-DESIGN", program_code: "BSESM-PSDED", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 172, program_name: "BACHELOR OF SCIENCE IN ENTERTAINMENT AND MULTIMEDIA COMPUTING", program_code: "BSEMC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 173, program_name: "BACHELOR OF SCIENCE IN EXERCISE AND SPORTS SCIENCE MAJOR IN FITNESS AND SPORTS COACHING", program_code: "BSESS-FSC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 174, program_name: "BACHELOR OF SCIENCE IN EXERCISE AND SPORTS SCIENCE MAJOR IN FITNESS AND SPORTS MANAGEMENT", program_code: "BSESS-FSM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 175, program_name: "BACHELOR OF SCIENCE IN FASHION AND TEXTILE TECHNOLOGY", program_code: "BSFTT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 176, program_name: "BACHELOR OF SCIENCE IN FORENSIC SCIENCE", program_code: "BSFS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 177, program_name: "BACHELOR OF SCIENCE IN FORESTRY", program_code: "BSFOR", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 178, program_name: "BACHELOR OF SCIENCE IN GEOLOGY", program_code: "BSGEO", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 179, program_name: "BACHELOR OF SCIENCE IN GEOTHERMAL ENGINEERING", program_code: "BSGE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 180, program_name: "BACHELOR OF SCIENCE IN HOSPITAL MANAGEMENT", program_code: "BSHMGT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 181, program_name: "BACHELOR OF SCIENCE IN HUMAN SERVICES", program_code: "BSHS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 182, program_name: "BACHELOR OF SCIENCE IN INDUSTRIAL SECURITY MANAGEMENT", program_code: "BSISM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 183, program_name: "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY", program_code: "BSIT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 184, program_name: "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY MAJOR IN AUTOMOTIVE TECHNOLOGY", program_code: "BSIT-AT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 185, program_name: "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY MAJOR IN CIVIL TECHNOLOGY", program_code: "BSIT-CT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 186, program_name: "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY MAJOR IN GARMENT TECHNOLOGY", program_code: "BSIT-GT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 187, program_name: "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY WITH SPECIALIZATION IN BEAUTY CARE AND WELLNESS", program_code: "BSIT-BCW", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 188, program_name: "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY WITH SPECIALIZATION IN ELECTRICAL TECHNOLOGY", program_code: "BSIT-ET", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 189, program_name: "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY WITH SPECIALIZATION IN ELECTRONICS TECHNOLOGY", program_code: "BSIT-ELT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 190, program_name: "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY WITH SPECIALIZATION IN FOOD AND SERVICE MANAGEMENT", program_code: "BSIT-FSM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 191, program_name: "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY WITH SPECIALIZATION IN GRAPHICS TECHNOLOGY", program_code: "BSIT-GRT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 192, program_name: "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY WITH SPECIALIZATION IN INSTRUMENTATION AND CONTROL TECHNOLOGY", program_code: "BSIT-ICT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 193, program_name: "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY WITH SPECIALIZATION IN MECHANICAL TECHNOLOGY", program_code: "BSIT-MT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 194, program_name: "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY WITH SPECIALIZATION IN MECHATRONICS TECHNOLOGY", program_code: "BSIT-MECT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 195, program_name: "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY WITH SPECIALIZATION IN WELDING TECHNOLOGY", program_code: "BSIT-WT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 196, program_name: "BACHELOR OF SCIENCE IN INDUSTRIAL TECHNOLOGY WITH SPECIALIZATION IN WOODWORKING TECHNOLOGY", program_code: "BSIT-WWT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 197, program_name: "BACHELOR OF SCIENCE IN INSTRUMENTATION AND CONTROL ENGINEERING", program_code: "BSICE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 198, program_name: "BACHELOR OF SCIENCE IN INTERNAL AUDIT", program_code: "BSIA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 199, program_name: "BACHELOR OF SCIENCE IN LAW ENFORCEMENT ADMINISTRATION", program_code: "BSLEA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 200, program_name: "BACHELOR OF SCIENCE IN LEGAL MANAGEMENT", program_code: "BSLM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 201, program_name: "BACHELOR OF SCIENCE IN LOGISTICS AND SUPPLY CHAIN MANAGEMENT", program_code: "BSLSCM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 202, program_name: "BACHELOR OF SCIENCE IN MANUFACTURING ENGINEERING TECHNOLOGY MAJOR IN MECHANICAL DESIGN & FABRICATION", program_code: "BSMET-MDF", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 203, program_name: "BACHELOR OF SCIENCE IN MARINE BIOLOGY", program_code: "BSMB", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 204, program_name: "BACHELOR OF SCIENCE IN MECHATRONICS", program_code: "BSMEC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 205, program_name: "BACHELOR OF SCIENCE IN MEDICAL BIOLOGY", program_code: "BSMBIO", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 206, program_name: "BACHELOR OF SCIENCE IN MEDICAL LABORATORY SCIENCE", program_code: "BSMLS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 207, program_name: "BACHELOR OF SCIENCE IN METEOROLOGY", program_code: "BSMETEO", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 208, program_name: "BACHELOR OF SCIENCE IN MIDWIFERY", program_code: "BSMW", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 209, program_name: "BACHELOR OF SCIENCE IN MINING ENGINEERING", program_code: "BSME", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 210, program_name: "BACHELOR OF SCIENCE IN NURSING", program_code: "BSN", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 211, program_name: "BACHELOR OF SCIENCE IN NUTRITION AND DIETETICS", program_code: "BSND", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 212, program_name: "BACHELOR OF SCIENCE IN OFFICE ADMINISTRATION", program_code: "BSOA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 213, program_name: "BACHELOR OF SCIENCE IN OFFICE MANAGEMENT", program_code: "BSOM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 214, program_name: "BACHELOR OF SCIENCE IN PETROLEUM ENGINEERING", program_code: "BSPE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 215, program_name: "BACHELOR OF SCIENCE IN PHARMACY", program_code: "BSPH", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 216, program_name: "BACHELOR OF SCIENCE IN PSYCHOLOGY", program_code: "BSP", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 217, program_name: "BACHELOR OF SCIENCE IN PUBLIC ADMINISTRATION", program_code: "BSPA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 218, program_name: "BACHELOR OF SCIENCE IN PUBLIC HEALTH", program_code: "BSPH-H", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 219, program_name: "BACHELOR OF SCIENCE IN SPECIAL NEEDS EDUCATION", program_code: "BSSNE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 220, program_name: "BACHELOR OF SCIENCE IN STATISTICS", program_code: "BSSTAT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 221, program_name: "BACHELOR OF SCIENCE IN VETERINARY TECHNOLOGY", program_code: "BSVT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 222, program_name: "BACHELOR OF SCIENCE MAJOR IN MATHEMATICS", program_code: "BSMATH", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 223, program_name: "BACHELOR OF SECONDARY EDUCATION MAJOR IN ENGLISH", program_code: "BSED-ENG", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 224, program_name: "BACHELOR OF SECONDARY EDUCATION MAJOR IN FILIPINO", program_code: "BSED-FIL", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 226, program_name: "BACHELOR OF SECONDARY EDUCATION MAJOR IN MATHEMATICS", program_code: "BSED-MATH", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 227, program_name: "BACHELOR OF SECONDARY EDUCATION MAJOR IN SCIENCE", program_code: "BSED-SCI", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 228, program_name: "BACHELOR OF SECONDARY EDUCATION MAJOR IN SOCIAL STUDIES", program_code: "BSED-SS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 229, program_name: "BACHELOR OF SECONDARY EDUCATION MAJOR IN VALUES EDUCATION", program_code: "BSED-VE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 230, program_name: "BACHELOR OF TECHNICAL-VOCATIONAL TEACHER EDUCATION", program_code: "BTVTE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 231, program_name: "BACHELOR OF TECHNICAL-VOCATIONAL TEACHER EDUCATION MAJOR IN ANIMATION", program_code: "BTVTE-ANI", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 232, program_name: "BACHELOR OF TECHNICAL-VOCATIONAL TEACHER EDUCATION MAJOR IN AUTOMOTIVE", program_code: "BTVTE-AUT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 233, program_name: "BACHELOR OF TECHNICAL-VOCATIONAL TEACHER EDUCATION MAJOR IN COMPUTER PROGRAMMING", program_code: "BTVTE-CP", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 234, program_name: "BACHELOR OF TECHNICAL-VOCATIONAL TEACHER EDUCATION MAJOR IN COMPUTER SYSTEM SERVICING", program_code: "BTVTE-CSS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 235, program_name: "BACHELOR OF TECHNICAL-VOCATIONAL TEACHER EDUCATION MAJOR IN ELECTRICAL", program_code: "BTVTE-EL", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 236, program_name: "BACHELOR OF TECHNICAL-VOCATIONAL TEACHER EDUCATION MAJOR IN ELECTRONICS", program_code: "BTVTE-ELC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 237, program_name: "BACHELOR OF TECHNICAL-VOCATIONAL TEACHER EDUCATION MAJOR IN ELECTRONICS TECHNOLOGY", program_code: "BTVTE-ET", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 238, program_name: "BACHELOR OF TECHNICAL-VOCATIONAL TEACHER EDUCATION MAJOR IN FASHION GARMENTS AND DESIGN", program_code: "BTVTE-FGD", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 239, program_name: "BACHELOR OF TECHNICAL-VOCATIONAL TEACHER EDUCATION MAJOR IN FOOD SERVICE MANAGEMENT", program_code: "BTVTE-FSM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 240, program_name: "BACHELOR OF TECHNICAL-VOCATIONAL TEACHER EDUCATION MAJOR IN HEAT VENTILLATION AND AIR CONDITIONING", program_code: "BTVTE-HVAC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 241, program_name: "BACHELOR OF TECHNICAL-VOCATIONAL TEACHER EDUCATION MAJOR IN VISUAL GRAPHIC DESIGN", program_code: "BTVTE-VGD", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 242, program_name: "BACHELOR OF TECHNICAL-VOCATIONAL TEACHER EDUCATION MAJOR IN WELDING AND FABRICATIONS TECHNOLOGY", program_code: "BTVTE-WFT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 243, program_name: "BACHELOR OF TECHNICAL-VOCATIONAL TEACHERS EDUCATION MAJOR IN BEAUTY CARE AND WELLNESS", program_code: "BTVTE-BCW", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 244, program_name: "BACHELOR OF TECHNOLOGY AND LIVELIHOOD EDUCATION MAJOR IN AGRI-FISHERIES", program_code: "BTLE-AF", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 245, program_name: "BACHELOR OF TECHNOLOGY AND LIVELIHOOD EDUCATION MAJOR IN HOME ECONOMICS", program_code: "BTLE-HE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 246, program_name: "BACHELOR OF TECHNOLOGY AND LIVELIHOOD EDUCATION MAJOR IN INDUSTRIAL ARTS", program_code: "BTLE-IA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 247, program_name: "CERTIFICATE IN AGRICULTURAL SCIENCE", program_code: "CAGRI-SCI", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 248, program_name: "CERTIFICATE IN COMPUTER PROGRAMMING AND SERVICING", program_code: "CCPS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 249, program_name: "CERTIFICATE OF TEACHING", program_code: "CT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 250, program_name: "DIPLOMA FOR PROFESSIONAL EDUCATION", program_code: "DPE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 251, program_name: "DIPLOMA IN ARTS AND SCIENCES", program_code: "DAS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 252, program_name: "DIPLOMA IN HOTEL AND RESTAURANT MANAGEMENT", program_code: "DHRM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 253, program_name: "DIPLOMA IN INFORMATION TECHNOLOGY", program_code: "DIT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 254, program_name: "DIPLOMA IN MIDWIFERY (2 YEARS)", program_code: "DM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 255, program_name: "DIPLOMA IN TECHNOLOGY MAJOR IN AUTOMOTIVE", program_code: "DTA-AUT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 256, program_name: "DIPLOMA IN TECHNOLOGY MAJOR IN COMPUTER", program_code: "DTC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 257, program_name: "DIPLOMA IN TECHNOLOGY MAJOR IN ELECTRICAL AND MECHANICAL", program_code: "DTE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 258, program_name: "DIPLOMA IN TECHNOLOGY MAJOR IN ELECTRONICS", program_code: "DTE-ELC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 259, program_name: "ONE-YEAR SEAFARER’S RATING CERTIFICATE – STEWARDING (SRC)", program_code: "SRC-STW", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 260, program_name: "TEACHER CERTIFICATE PROGRAM", program_code: "TCP", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 261, program_name: "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION WITH SPECIALIZATION IN COMPUTER HARDWARE SERVICING", program_code: "TEC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 262, program_name: "BACHELOR OF SCIENCE IN ENGINEERING PROGRAM", program_code: "BSE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 263, program_name: "BACHELOR OF SCIENCE IN CIVIL ENGINEERING", program_code: "BSCE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 264, program_name: "BACHELOR OF SCIENCE IN ELECTRICAL ENGINEERING", program_code: "BSEE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 265, program_name: "BACHELOR OF SCIENCE IN ELECTRONICS ENGINEERING", program_code: "BSECE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 266, program_name: "BACHELOR OF SCIENCE IN MECHANICAL ENGINEERING", program_code: "BSME", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 267, program_name: "BACHELOR OF SCIENCE IN DEGREE PROGRAM", program_code: "BSDP", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 268, program_name: "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION WITH SPECIALIZATION IN ELECTRICAL TECHNOLOGY", program_code: "TEE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 269, program_name: "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION WITH SPECIALIZATION IN ELECTRICAL TECHNOLOGY", program_code: "TEE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 270, program_name: "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION WITH SPECIALIZATION IN COMPUTER HARDWARE SERVICING", program_code: "TEC", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 271, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY PROGRAM MAJOR IN CHEMICAL TECHNOLOGY", program_code: "BETCT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 272, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY PROGRAM MAJOR IN CIVIL TECHNOLOGY", program_code: "BETCIV", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 273, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY PROGRAM MAJOR IN ELECTROMECHANICAL TECHNOLOGY", program_code: "BETEM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 274, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY PROGRAM MAJOR IN NON-DESTRUCTIVE TESTING TECHNOLOGY", program_code: "BETNDT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 275, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY PROGRAM MAJOR IN DIES & MOULDS TECHNOLOGY", program_code: "BETDM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 276, program_name: "BACHELOR OF ENGINEERING TECHNOLOGY PROGRAM MAJOR IN HEATING, VENTILATION, AND AIRCONDITIONING/REFRIGERATION TECHNOLOGY", program_code: "BETHVACR", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 277, program_name: "BACHELOR IN ELEMENTARY EDUCATION", program_code: "BEE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 278, program_name: "BACHELOR IN PHYSICAL EDUCATION", program_code: "BPE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 279, program_name: "BACHELOR OF AGRICULTURAL TECHNOLOGY", program_code: "BAT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 280, program_name: "BACHELOR OF ARTS AND LANGUAGE STUDIES", program_code: "BALS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 281, program_name: "BACHELOR OF ARTS IN ASIAN STUDIES", program_code: "BAAS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 282, program_name: "BACHELOR OF ARTS IN BROADCASTING", program_code: "BABR", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 283, program_name: "BACHELOR OF ARTS IN ENGLISH LANGUAGE STUDIES", program_code: "BAELS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 284, program_name: "BACHELOR OF ARTS IN FILIPINO", program_code: "BAFIL", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 285, program_name: "BACHELOR OF ARTS IN ISLAMIC STUDIES", program_code: "BAIS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 286, program_name: "BACHELOR OF ARTS IN ISLAMIC STUDIES MAJOR IN POLITICAL ECONOMY", program_code: "BAISP", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 287, program_name: "BACHELOR OF ARTS IN JOURNALISM", program_code: "BAJRN", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 288, program_name: "BACHELOR OF PUBLIC ADMINISTRATION AND DEVELOPMENT STUDIES", program_code: "BPADS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 289, program_name: "BACHELOR OF SCIENCE IN ACCOUNTING MANAGEMENT", program_code: "BSAM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 290, program_name: "BACHELOR OF SCIENCE IN AGRIBUSINESS", program_code: "BSA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 291, program_name: "BACHELOR OF SCIENCE IN AGRIBUSINESS MANAGEMENT", program_code: "BSAMG", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 292, program_name: "BACHELOR OF SCIENCE IN AGRICULTURAL EDUCATION", program_code: "BSAE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 293, program_name: "BACHELOR OF SCIENCE IN AGRICULTURE TECHNOLOGY", program_code: "BSAT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 294, program_name: "BACHELOR OF SCIENCE IN AGRIFORESTRY", program_code: "BSAF", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 295, program_name: "BACHELOR OF SCIENCE IN ASIAN AND ISLAMIC STUDIES", program_code: "BSAIS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 296, program_name: "BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION", program_code: "BSBA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 297, program_name: "BACHELOR OF SCIENCE IN COMPUTER TECHNOLOGY", program_code: "BSCT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 298, program_name: "BACHELOR OF SCIENCE IN COMPUTING STUDIES", program_code: "BSCS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 299, program_name: "BACHELOR OF SCIENCE IN ENVIRONMENTAL ENGINEERING", program_code: "BSEE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 300, program_name: "BACHELOR OF SCIENCE IN EXERCISE AND SPORTS SCIENCE", program_code: "BSESS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 301, program_name: "BACHELOR OF SCIENCE IN GEODETIC ENGINEERING", program_code: "BSGE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 302, program_name: "BACHELOR OF SCIENCE IN HOME ECONOMICS", program_code: "BSHE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 303, program_name: "BACHELOR OF SCIENCE IN HOTEL AND RESTAURANT MANAGEMENT", program_code: "BSHRM", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 304, program_name: "BACHELOR OF SCIENCE IN INTERNAL AUDITING", program_code: "BSIA", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 305, program_name: "BACHELOR OF SCIENCE IN ISLAMIC STUDIES", program_code: "BSIS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 306, program_name: "BACHELOR OF SCIENCE IN MARINE ENGINEERING", program_code: "BSME", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 307, program_name: "BACHELOR OF SCIENCE IN MARINE TRANSPORTATION", program_code: "BSMT", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 308, program_name: "BACHELOR OF SCIENCE IN PHYSICS", program_code: "BSPHY", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 309, program_name: "BACHELOR OF SCIENCE IN POLITICAL SCIENCE", program_code: "BSPOLS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 310, program_name: "BACHELOR OF SCIENCE IN SECONDARY EDUCATION", program_code: "BSSE", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 311, program_name: "BACHELOR OF SCIENCE IN SOCIAL WORK", program_code: "BSSW", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 312, program_name: "COLLEGE OF COMPUTING STUDIES", program_code: "CCS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 313, program_name: "DIPLOMA IN ARABIC LANGUAGE", program_code: "DIPLAR", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },
    { id: 314, program_name: "MASTER OF ARTS IN POLITICAL SCIENCE", program_code: "MAPOLS", created_date: new Date().toISOString(), created_by: "00000000-0000-0000-0000-000000000000", last_modified_by: "", last_modified_date: "", push_status_id: 2, push_date: "", deleted_by: "", deleted_date: "", is_deleted: false, remarks: "Seeded" },




];

export const seedLibDeploymentAreaCategories: ILibDeploymentAreaCategories[] = [
    { id: 1, category_name: "Company/ LGU", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 2, category_name: "School", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 3, category_name: "N/A", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
]

export const seedLibWorkPlanTaskCategories: ILibWorkPlanTaskCategory[] = [
    { id: 1, work_plan_category_name: "General", status_id: 1, "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 2, work_plan_category_name: "Specific", status_id: 1, "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },

]

export const seedLibLevel: ILibLevel[] = [
    { id: 1, level_description: "NPMO", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 2, level_description: "RPMO", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 3, level_description: "MCT", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 4, level_description: "ACT", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
]

export const seedBudgetYear: ILibBudgetYear[] = [
    { id: 1, budget_year_description: "2025", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
]

export const seedPAP: ILibPAP[] = [
    { id: 1, pap_description: "310100-20000-2000 KKB CDD", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 2, pap_description: "310100-20000-2000 KKB CFW PWD", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 3, pap_description: "310100-20000-2000 KKB CFW SUC", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 4, pap_description: "PAGKILOS", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 5, pap_description: "310100-30000-5000 PMNP", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
]

export const seedAllotmentClass: ILibAllotmentClass[] = [
    { id: 1, allotment_class_description: "MOOE", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 2, allotment_class_description: "CO", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 3, allotment_class_description: "PS", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 4, allotment_class_description: "FINEX", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
]

export const seedAppropriationSource: ILibAppropriationSource[] = [
    { id: 1, appropriation_source_description: "Programmed Appropriation", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 2, appropriation_source_description: "Unprogrammed Appropriation", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
]

export const seedAppropriationType: ILibAppropriationType[] = [
    { id: 1, appropriation_type_description: "Current Appropriation", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 2, appropriation_type_description: "Continuing Appropriation (CO)", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 3, appropriation_type_description: "Continuing Appropriation (FO)", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
]

export const seedExpense: ILibExpense[] = [
    { id: 1, expense_code: "50101010-01", expense_description: "Salaries and Wages - Regular", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 2, expense_code: "50101020-00", expense_description: "Salaries and Wages - Casual/Contractual", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 3, expense_code: "50102010-01", expense_description: "Personnel Economic Relief Allowance (PERA)", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 4, expense_code: "50102020-00", expense_description: "Representation Allowance (RA)", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 5, expense_code: "50102030-01", expense_description: "Transportation Allowance (TA)", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 6, expense_code: "50102040-01", expense_description: "Clothing/Uniform Allowance", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 7, expense_code: "50102050-03", expense_description: "Subsistence Allowance-Magna Carta Benefits for Public Social Workers under R.A. 9432", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 8, expense_code: "50102050-04", expense_description: "Public Social Workers under R.A. 9432 ", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 9, expense_code: "50102060-01", expense_description: "Laundry Allowance-Civilian", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
    { id: 10, expense_code: "50102060-04", expense_description: "Health Workers under R.A. 7305", "created_date": new Date().toISOString(), "created_by": "kcadmin@gmail.com", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded" },
]

export async function seedData() {
    try {
        await tblBudgetYear.bulkPut(seedBudgetYear);
        await tblPAP.bulkPut(seedPAP);
        await tblAllotmentClass.bulkPut(seedAllotmentClass);
        await tblAppropriationSource.bulkPut(seedAppropriationSource);
        await tblAppropriationType.bulkPut(seedAppropriationType);
        await tblExpense.bulkPut(seedExpense);
        await tblRoles.bulkPut(seedRoles);
        await tblModules.bulkPut(seedModules);
        await tblPermissions.bulkPut(seedPermissions);
        await tblLibModality.bulkPut(seedLibModalities);
        await tblLibModalitySubCategory.bulkPut(seedModalitySubCategory);
        await tblLibSex.bulkPut(seedLibSex);
        await tblLibCivilStatus.bulkPut(seedLibCivilStatus);
        await tblLibExtensionName.bulkPut(seedLibExtensionName);
        await tblLibSectors.bulkPut(seedLibSectors);
        await tblLibIdCard.bulkPut(seedLibIdCard);
        await tblLibEducationalAttainment.bulkPut(seedLibEducationalAttainment);
        await tblLibRelationshipToBeneficiary.bulkPut(seedLibRelationshipToBeneficiary);
        await tblLibTypeOfDisability.bulkPut(seedTypeofDisability);
        await tblLibCFWType.bulkPut(seedCFWType);
        await tblLibYearLevel.bulkPut(seedYearLevel);
        await tblLibCourses.bulkPut(seedLibCourses);
        await tblLibDeploymentArea.bulkPut(seedLibDeploymentArea);
        await tblLibTypeOfWork.bulkPut(seedLibTypeOfWork);
        await tblLibFilesToUpload.bulkPut(seedFilesToUpload);
        await tblLibIPGroup.bulkPut(seedIPGroup);
        await tblLibYearServed.bulkPut(seedYearServed);
        await tblLibProgramTypes.bulkPut(seedProgramTypes);
        await tblCFWSchedules.bulkPut(seedCFWSchedules);
        await tblCFWTimeLogs.bulkPut(seedCFWTimeLogs);
        await tblLibSchoolProfiles.bulkPut(seedLibSchoolProfiles);
        await tblLibSchoolPrograms.bulkPut(seedLibSchoolPrograms);
        await tblLibStatuses.bulkPut(seedLibStatuses);
        await tblLibDeploymentAreaCategories.bulkPut(seedLibDeploymentAreaCategories);
        await tblLibLevel.bulkPut(seedLibLevel);
        return "Library seeded successfully!!!";
        // try {
        //     await dexieDb.roles.bulkPut(seedRoles);
        //     await dexieDb.modules.bulkPut(seedModules);
        //     await dexieDb.permissions.bulkPut(seedPermissions);
        //     await dexieDb.lib_modality.bulkPut(seedLibModalities);
        //     await dexieDb.lib_modality_sub_category.bulkPut(seedModalitySubCategory);
        //     await dexieDb.lib_sex.bulkPut(seedLibSex);
        //     await dexieDb.lib_civil_status.bulkPut(seedLibCivilStatus);
        //     await dexieDb.lib_extension_name.bulkPut(seedLibExtensionName);
        //     await dexieDb.lib_sectors.bulkPut(seedLibSectors);
        //     await dexieDb.lib_id_card.bulkPut(seedLibIdCard);
        //     await dexieDb.lib_educational_attainment.bulkPut(seedLibEducationalAttainment);
        //     await dexieDb.lib_relationship_to_beneficiary.bulkPut(seedLibRelationshipToBeneficiary);
        //     await dexieDb.lib_type_of_disability.bulkPut(seedTypeofDisability);
        //     await dexieDb.lib_cfw_type.bulkPut(seedCFWType);
        //     await dexieDb.lib_year_level.bulkPut(seedYearLevel);
        //     await dexieDb.lib_courses.bulkPut(seedLibCourses);
        //     await dexieDb.lib_deployment_area.bulkPut(seedLibDeploymentArea);
        //     await dexieDb.lib_type_of_work.bulkPut(seedLibTypeOfWork);
        //     await dexieDb.lib_files_to_upload.bulkPut(seedFilesToUpload);
        //     console.log("Library seeded successfully!!!");
        // } catch (error) {
        //     console.error('Transaction failed: ', error);
        //     throw error; 
        // }
    } catch (error) {
        console.error("Error library seed:", error);
        return [];
    }
}


