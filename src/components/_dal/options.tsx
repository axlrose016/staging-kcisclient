"use server";

import { db } from "@/db";
import { LibraryOption } from "../interfaces/library-interface";
import { lib_ip_group, lib_program_types, modules, permissions, roles } from "@/db/schema/libraries";
import { lib_cfw_category, lib_cfw_type, lib_civil_status, lib_course, lib_cycle, lib_deployment_area, lib_educational_attainment, lib_extension_name, lib_files_to_upload, lib_fund_source, lib_id_card, lib_modality, lib_modality_sub_category, lib_mode, lib_province, lib_relationship_to_beneficiary, lib_sectors, lib_sex, lib_type_of_disability, lib_type_of_work, lib_volunteer_committee, lib_volunteer_committee_position, lib_year_level, lib_year_served, lib_deployment_area_categories } from "@/db/schema/libraries";
import { and, eq } from "drizzle-orm";
import { cache } from "react";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";

const getLibraryOptions = (library: any, descriptionField: string, additionalCondition?: any): () => Promise<LibraryOption[]> => {
    return cache(async () => {
        const whereCondition = additionalCondition
            ? and(eq(library.is_deleted, false), additionalCondition)
            : eq(library.is_deleted, false);

        const results = await db.select().from(library).where(whereCondition).execute();
        return results.map((row: any) => ({
            id: row.id,
            name: row[descriptionField],
            label: row[descriptionField]
        }));
    });
};
export const getSexLibraryOptions = getLibraryOptions(lib_sex, 'sex_description');
export const getCivilStatusLibraryOptions = getLibraryOptions(lib_civil_status, 'civil_status_description');
export const getRoleLibraryOptions = getLibraryOptions(roles, "role_description");
export const getModuleLibraryOptions = getLibraryOptions(modules, 'module_description');
export const getPermissionLibraryOptions = getLibraryOptions(permissions, 'permission_description');
export const getModalityLibraryOptions = getLibraryOptions(lib_modality, 'modality_name', eq(lib_modality.is_active, true));
export const getExtensionNameLibraryOptions = getLibraryOptions(lib_extension_name, 'extension_name');
export const getCFWCatLibraryOptions = getLibraryOptions(lib_cfw_category, 'category_name');
export const getEducationalAttainmentLibraryOptions = getLibraryOptions(lib_educational_attainment, 'educational_attainment_description');
export const getIDCardLibraryOptions = getLibraryOptions(lib_id_card, 'id_card_name');
export const getRelationshipToBeneficiaryLibraryOptions = getLibraryOptions(lib_relationship_to_beneficiary, 'relationship_name');
export const getRelationshipWithGuardianLibraryOptions = getLibraryOptions(lib_relationship_to_beneficiary, 'relationship_name');
export const getTypeOfDisabilityLibraryOptions = getLibraryOptions(lib_type_of_disability, 'disability_name');
export const getFundSourceLibraryOptions = getLibraryOptions(lib_fund_source, 'fund_source_description');
export const getCycleLibraryOptions = getLibraryOptions(lib_cycle, 'cycle_description');
export const getModeLibraryOptions = getLibraryOptions(lib_mode, 'mode_description');
export const getVolunteerCommitteLibraryOptions = getLibraryOptions(lib_volunteer_committee, 'name');
export const getVolunteerCommittePositionLibraryOptions = getLibraryOptions(lib_volunteer_committee_position, 'name');
export const getCFWTypeLibraryOptions = getLibraryOptions(lib_cfw_type, 'cfw_type_name');
export const getRelationshipToFamilyMemberTypeLibraryOptions = getLibraryOptions(lib_relationship_to_beneficiary, 'relationship_name');
export const getYearLevelLibraryOptions = getLibraryOptions(lib_year_level, 'year_level_name');
export const getCourseLibraryOptions = getLibraryOptions(lib_course, 'course_name');
export const getDeploymentAreaLibraryOptions = getLibraryOptions(lib_deployment_area, 'deployment_name');
export const getTypeOfWorkLibraryOptions = getLibraryOptions(lib_type_of_work, 'work_name');
export const getProvinceLibraryOptions = getLibraryOptions(lib_province, 'prov_name');
export const getModalitySubCategoryLibraryOptions = getLibraryOptions(lib_modality_sub_category, 'modality_sub_category_name');
export const getSectorsLibraryOptions = getLibraryOptions(lib_sectors, 'sector_name');
export const getFileToUploadLibraryOptions = getLibraryOptions(lib_files_to_upload, 'file_name', eq(lib_files_to_upload.is_deleted, false));
export const getIPGroupLibraryOptions = getLibraryOptions(lib_ip_group, 'ip_group_name');
export const getYearServedLibraryOptions = getLibraryOptions(lib_year_served, 'year_served');
export const getProgramTypesLibraryOptions = getLibraryOptions(lib_program_types, 'program_type_name');
export const getDeploymentAreaCategoriesOptions = getLibraryOptions(lib_deployment_area_categories, 'category_name');


export const getLibraryDescription = async (
    library: any,
    id: number
  ): Promise<string> => {
    if (!id) return ''; // Early return if id is 0 or undefined
    const [result] = await db
      .select(library.description)
      .from(library)
      .where(library.id.eq(id))
      .execute();
  
    return result?.[library.description] ?? ''; // Handle undefined result
  };