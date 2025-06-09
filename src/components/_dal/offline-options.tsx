import { cache } from "react";
import { LibraryOption } from "../interfaces/library-interface";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { libDb } from "@/db/offline/Dexie/databases/libraryDb";
import { hrDb } from "@/db/offline/Dexie/databases/hrDb";

// const getOfflineLibraryOptions = (library: string, descriptionField: string): () => Promise<LibraryOption[]> => {
//     return cache(async () => {
//         await dexieDb.open();
//         const results = await dexieDb.table(library).toArray();
//         return results.map((row: any) => ({
//             id: row.id,
//             name: row[descriptionField],
//             label: row[descriptionField]
//         }));
//     });
// }
const getOfflineLibraryOptions = (library: string, descriptionField: string, p0?: string[]): () => Promise<LibraryOption[]> => {
    return cache(async () => {
        await dexieDb.open();
        const results = await dexieDb.table(library).toArray();
        return results.map((row: any) => ({
            id: row.id,
            name: row[descriptionField],
            label: row[descriptionField],
            short_name: row.short_name // 👈 add this field            
        }));
    });
}

export const getOfflineLibOptions = (library: string, descriptionField: string, p0?: string[]): () => Promise<LibraryOption[]> => {
    return cache(async () => {
        await libDb.open();
        const results = await libDb.table(library).toArray();
        return results.map((row: any) => ({
            id: row.id,
            name: row[descriptionField],
            label: row[descriptionField],
            short_name: row.short_name // 👈 add this field            
        }));
    });
}

export const getOfflineHROptions = (library: string, descriptionField: string, p0?: string[]): () => Promise<LibraryOption[]> => {
    return cache(async () => {
        await libDb.open();
        const results = await hrDb.table(library).toArray();
        return results.map((row: any) => ({
            id: row.id,
            name: row[descriptionField],
            label: row[descriptionField],
            short_name: row.short_name // 👈 add this field            
        }));
    });
}

export const getOfflineLibModalityOptions = getOfflineLibraryOptions('lib_modality', 'modality_name');
export const getOfflineLibModalitySubCategoryOptions = getOfflineLibraryOptions('lib_modality_sub_category', 'modality_sub_category_name');
export const getOfflineLibSexOptions = getOfflineLibraryOptions('lib_sex', 'sex_description');
export const getOfflineCivilStatusLibraryOptions = getOfflineLibraryOptions('lib_civil_status', 'civil_status_description');
export const getOfflineExtensionLibraryOptions = getOfflineLibraryOptions('lib_extension_name', 'extension_name');
export const getOfflineLibSectorsLibraryOptions = getOfflineLibraryOptions('lib_sectors', 'sector_name');
export const getOfflineLibIdCard = getOfflineLibraryOptions('lib_id_card', 'id_card_name');
export const getOfflineLibEducationalAttainment = getOfflineLibraryOptions('lib_educational_attainment', 'educational_attainment_description');
export const getOfflineLibRelationshipToBeneficiary = getOfflineLibraryOptions('lib_relationship_to_beneficiary', 'relationship_name');
export const getOfflineLibTypeOfDisability = getOfflineLibraryOptions('lib_type_of_disability', 'disability_name');
export const getOfflineLibCFWType = getOfflineLibraryOptions('lib_cfw_type', 'cfw_type_name');
export const getOfflineLibYearLevel = getOfflineLibraryOptions('lib_year_level', 'year_level_name');
export const getOfflineLibCourses = getOfflineLibraryOptions('lib_school_programs', 'program_name');
export const getOfflineLibSchools = getOfflineLibraryOptions('lib_school_profiles', 'school_name', ['short_name']);
export const getOfflineLibDeploymentArea = getOfflineLibraryOptions('lib_deployment_area', 'deployment_name');
export const getOfflineLibTypeOfWork = getOfflineLibraryOptions('lib_type_of_work', 'work_name');
export const getOfflineLibFilesToUpload = getOfflineLibraryOptions('lib_files_to_upload', 'file_name');
export const getOfflineLibYearServed = getOfflineLibraryOptions('lib_year_served', 'year_served');
export const getOfflineLibProgramTypes = getOfflineLibraryOptions('lib_program_types', 'program_type_name');
export const getOfflineLibIPGroup = getOfflineLibraryOptions('lib_ip_group', 'name');
export const getOfflineLibStatuses = getOfflineLibraryOptions('lib_statuses', 'status_name');
export const getOfflineLibDeploymentAreaCategories = getOfflineLibraryOptions('lib_deployment_area_categories', 'category_name');
export const getOfflineRoles = getOfflineLibraryOptions('roles','role_description');
export const getOfflineModules = getOfflineLibraryOptions('modules','module_description');
export const getOfflinePermissions = getOfflineLibraryOptions('permissions','permission_description');
export const getOfflineLibLevel = getOfflineLibOptions('lib_level','level_description');
export const getOfflineLibBudgetYear = getOfflineLibOptions('lib_budget_year', 'budget_year_description');
export const getOfflineLibPAP = getOfflineLibOptions('lib_pap', 'pap_description');
export const getOfflineLibAppropriationSource = getOfflineLibOptions('lib_appropriation_source','appropriation_source_description');
export const getOfflineLibAppropriationType = getOfflineLibOptions('lib_appropriation_type', 'appropriation_type_description');
export const getOfflineLibComponent = getOfflineLibOptions('lib_component','component_description');
export const getOfflineLibAllotmentClass = getOfflineLibOptions('lib_allotment_class', 'allotment_class_description');
export const getOfflineLibExpense = getOfflineLibOptions('lib_expense','expense_description');
export const getOfflineLibPosition = getOfflineLibOptions('lib_position','position_description');
export const getOfflineLibEmploymentStatus = getOfflineLibOptions('lib_employment_status','employment_status_description');
export const getOfflineLibOffice = getOfflineLibOptions('lib_office','office_description');
export const getOfflineLibDivision = getOfflineLibOptions('lib_division','division_description');
export const getOfflineLibHiringProcedures = getOfflineLibOptions('lib_hiring_procedure','hiring_procedure_description');
// export const getOfflineLibIPGroup = getOfflineLibraryOptions('lib_i','file_name');