import { cache } from "react";
import { LibraryOption, LibraryOptions } from "../interfaces/library-interface";
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
            short_name: row.short_name, // 👈 add this field    
            // icon: row[iconField || ""],
        }));
    });
}

export const getOfflineLibOptions = (library: string, descriptionField: string, idField?: string, p0?: string[]): () => Promise<LibraryOption[]> => {
    return cache(async () => {
        await libDb.open();
        const results = await libDb.table(library).toArray();
        return results.map((row: any) => ({
            id: idField ? row[idField] : row.id,
            name: row[descriptionField],
            label: row[descriptionField],
            short_name: row.short_name, // 👈 add this field            

        }));
    });
}

export const getOfflineLibFilteredOptions = (library: string,descriptionField: string,idField?: string,p0?: string[], filterFn?: (row: any) => boolean): () => Promise<LibraryOption[]> => {
  return cache(async () => {
    await libDb.open();
    let results = await libDb.table(library).toArray();
    if (filterFn) {
      results = results.filter(filterFn);
    }

    return results.map((row: any) => ({
      id: idField ? row[idField] : row.id,
      name: row[descriptionField],
      label: row[descriptionField],
      short_name: row.short_name,
    }));
  });
};

export const getOfflineLibFundSourceOptions = getOfflineLibOptions('lib_fund_source','fund_source_name');
export const getOfflineLibModalityOptions = getOfflineLibOptions('lib_modality', 'modality_name');
export const getOfflineLibModalitySubCategoryOptions = getOfflineLibOptions('lib_modality_sub_category', 'modality_sub_category_name');
export const getOfflineLibSexOptions = getOfflineLibOptions('lib_sex', 'sex_description');
export const getOfflineCivilStatusLibraryOptions = getOfflineLibOptions('lib_civil_status', 'civil_status_description');
export const getOfflineExtensionLibraryOptions = getOfflineLibOptions('lib_extension_name', 'extension_name');
export const getOfflineLibSectorsLibraryOptions = getOfflineLibOptions('lib_sectors', 'sector_name');
export const getOfflineLibIdCard = getOfflineLibOptions('lib_id_card', 'id_card_name');
export const getOfflineLibEducationalAttainment = getOfflineLibOptions('lib_educational_attainment', 'educational_attainment_description');
export const getOfflineLibRelationshipToBeneficiary = getOfflineLibOptions('lib_relationship_to_beneficiary', 'relationship_name');
export const getOfflineLibTypeOfDisability = getOfflineLibOptions('lib_type_of_disability', 'disability_name');
export const getOfflineLibCFWType = getOfflineLibOptions('lib_cfw_type', 'cfw_type_name');
export const getOfflineLibYearLevel = getOfflineLibOptions('lib_year_level', 'year_level_name');
export const getOfflineLibCourses = getOfflineLibOptions('lib_school_programs', 'program_name');
export const getOfflineLibSchools = getOfflineLibOptions('lib_school_profiles', 'school_name', "id", ['short_name']);
export const getOfflineLibDeploymentArea = getOfflineLibOptions('lib_deployment_area', 'deployment_name');
export const getOfflineLibTypeOfWork = getOfflineLibOptions('lib_type_of_work', 'work_name');
export const getOfflineLibFilesToUpload = getOfflineLibOptions('lib_files_to_upload', 'file_name');
export const getOfflineLibYearServed = getOfflineLibOptions('lib_year_served', 'year_served');
export const getOfflineLibProgramTypes = getOfflineLibOptions('lib_program_types', 'program_type_name');
export const getOfflineLibIPGroup = getOfflineLibOptions('lib_ip_group', 'name');
export const getOfflineLibStatuses = getOfflineLibOptions('lib_statuses', 'status_name');
export const getOfflineLibDeploymentAreaCategories = getOfflineLibOptions('lib_deployment_area_categories', 'category_name');
export const getOfflineRoles = getOfflineLibOptions('roles','role_description');
export const getOfflineModules = getOfflineLibOptions('modules','module_description');
export const getOfflinePermissions = getOfflineLibOptions('permissions','permission_description');
export const getOfflineLibLevel = getOfflineLibOptions('lib_level','level_description');
export const getOfflineLibBudgetYear = getOfflineLibOptions('lib_budget_year', 'budget_year_description');
export const getOfflineLibAppropriationSource = getOfflineLibOptions('lib_appropriation_source','appropriation_source_description');
export const getOfflineLibAppropriationType = getOfflineLibOptions('lib_appropriation_type', 'appropriation_type_description');
export const getOfflineLibComponent = getOfflineLibOptions('lib_component', 'component_description');
export const getOfflineLibAllotmentClass = getOfflineLibOptions('lib_allotment_class', 'allotment_class_description');
export const getOfflineLibExpense = getOfflineLibOptions('lib_expense', 'expense_description');
export const getOfflineLibPosition = getOfflineLibOptions('lib_position', 'position_description');
export const getOfflineLibEmploymentStatus = getOfflineLibOptions('lib_employment_status', 'employment_status_description');
export const getOfflineLibOffice = getOfflineLibOptions('lib_office', 'office_description');
export const getOfflineLibDivision = getOfflineLibOptions('lib_division', 'division_description');
export const getOfflineLibHiringProcedures = getOfflineLibOptions('lib_hiring_procedure', 'hiring_procedure_description');
export const getOfflineLibRegion = (filterFn?: (row: any) => boolean) : Promise<LibraryOption[]> => getOfflineLibFilteredOptions('lib_region', 'name', "code", undefined, filterFn)();
export const getOfflineLibProvince = (filterFn?: (row: any) => boolean) : Promise<LibraryOption[]> => getOfflineLibFilteredOptions('lib_province', 'name', "code", undefined, filterFn)();
export const getOfflineLibCity = (filterFn?: (row: any) => boolean) : Promise<LibraryOption[]> => getOfflineLibFilteredOptions('lib_city','name', "code", undefined, filterFn)();
export const getOfflineLibBrgy = (filterFn?: (row: any) => boolean) : Promise<LibraryOption[]> => getOfflineLibFilteredOptions('lib_brgy','name', "code", undefined, filterFn)();
