'use server'

import { z } from 'zod'
import { db } from "@/db";
import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto';
import { person_profile_cfw_fam_program_details, person_profile, person_profile_family_composition, person_profile_sector } from '@/db/schema/personprofile';
import { resourceUsage } from 'process';
import { error } from 'console';
import { errors } from 'jose';
import axios from 'axios';
import PersonProfileService from '../PersonProfileService';
// import { person_profile_sector } from '@/db/schema/person_profile_sector';
import { cachedDataVersionTag } from 'v8';
// import { useState } from 'react';

// Define the data structure using TypeScript interface
interface PersonProfile {
  cwf_category_id: number;
  cfwp_id_no: string;
  person_profile_id: number | null;
  philsys_id_no: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  extension_name: number;
  sex_id: number;
  civil_status_id: number;
  birthdate: string;
  age: number;
  no_of_children: number;
  birthplace: string;
  is_pantawid: boolean;
  is_pantawid_leader: boolean;
  is_slp: boolean;
  has_immediate_health_concern: boolean;
  address: string;
  sitio: string;
  brgy_code: string;
  sitio_current: string;
  brgy_code_current: string;
  cellphone_no: string;
  cellphone_no_secondary: string;
  email: string;
  current_occupation: string;
  is_lgu_official: boolean;
  is_mdc: boolean;
  is_bdc: boolean;
  is_bspmc: boolean;
  is_bdrrmc_bdc_twg: boolean;
  is_bdrrmc_expanded_bdrrmc: boolean;
  is_mdrrmc: boolean;
  is_hh_head: boolean;
  academe: number;
  business: number;
  differently_abled: number;
  farmer: number;
  fisherfolks: number;
  government: number;
  ip: number;
  ip_group_id: number;
  ngo: number;
  po: number;
  religious: number;
  senior_citizen: number;
  women: number;
  solo_parent: number;
  out_of_school_youth: number;
  children_and_youth_in_need_of_special_protection: number;
  family_heads_in_need_of_assistance: number;
  affected_by_disaster: number;
  persons_with_disability: number;
  others: string;
  school_name: string;
  campus: string;
  school_address: string;
  course_id: number;
  year_graduated: string;
  year_level_id: number;
  skills: string;
  family_member_name: string;
  relationship_to_family_member: string;
  created_by: string;
  last_modified_by: string;
  push_status_id: number;
  deleted_date: string | null;
  deleted_by: string | null;
  is_deleted: boolean;
  remarks: string;
}

const generalSchema = z.object({
  modality_id: z.coerce.number().min(1, "Modality is required"),
  sex_id: z.coerce.number().min(1, "Sex is required"),
  civil_status_id: z.coerce.string().min(1, "Civil Status is required"),
  first_name: z.string().min(2, 'First name must be at least 2 characters long'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters long'),
  birthdate: z
    .string()
    .nonempty('Birthdate is required') // Ensures it's not an empty string
    .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), { message: 'Invalid date format (YYYY-MM-DD)' }),
  age: z.coerce.number().int().min(21, 'Age must be 21 or older'),
  sitio: z.string().min(2, 'Invalid Sitio/ House number/ Purok '),
  barangay_code: z.string().min(2, 'Barangay is required'),
  email: z.string().min(2, 'Email is required'),

})

// for validation for cfw
const schemaCFW = z.object({
  modality_sub_category_id: z.coerce.string().min(1, "Modality Sub Category ID is required"),
  has_immediate_health_concern: z.coerce.string().min(1, "Please answer the health condition (Basic Information Tab > Health Condition)"),
})

export async function submit(prevState: any, formData: any) {
  // const [modalityId, setModalityId] = useState(0);
  // console.log("Received formData:", formData);
  const modality_id = formData["common_data"]["modality_id"];
  let hasError = false;


  console.log("Modality ID: ", modality_id);
  if (modality_id === 25) {
    // const cfw4 = formData["cfw"][4]["has_immediate_health_concern"];
    // console.log("has_immediate_health_concern: " , cfw4);
    const modality_sub_category_id_test = formData["cfw"][4]["modality_sub_category_id"];
    if (modality_sub_category_id_test === 0) {
      return { errors: { modality_sub_category_id: 'Modality Sub Category required!' } };
    }

    const has_immediate_health_concern = formData["cfw"][4]["has_immediate_health_concern"];
    const immediate_health_concern = formData["cfw"][4]["immediate_health_concern"];
    if (has_immediate_health_concern === 1) {
      if (immediate_health_concern === "") {
        return { errors: { immediate_health_concern: 'Immediate health concern should not be empty!' } };
      }
    }
    const combinedSchema = generalSchema.merge(schemaCFW);

    const data = formData["common_data"];
    const fd = new FormData();
    for (const [key, value] of Object.entries(data)) {
      fd.append(key, value instanceof File || typeof value === "string" ? value : String(value));
      // console.log("KEY:", key, "VALUE:", value);
    }

    let errors: Record<string, string[]> = {};
    const validateFormData = (fd: FormData) => {
      const formObject: Record<string, any> = {};

      // Convert FormData to a regular object for validation
      for (const [key, value] of fd.entries()) {
        formObject[key] = value;
      }

      // Validate using Zod
      const result = combinedSchema.safeParse(formObject);







      if (!result.success) {
        errors = result.error.flatten().fieldErrors;
        console.log("Validation Errors:", errors);
        hasError = true;
        return {
          success: false,
          errors,  // Send the whole errors object to the client
        };

      } else {
        console.log("Validation Passed:", result.data);
        return result.data;
      }

    };

    const validationResult = validateFormData(fd);
    // if (!validationResult) {
    //   console.error("Validation failed", validationResult);

    // } else {
    //   console.log("Form data is valid:", validationResult);
    //   return;
    // }

    console.log(hasError);
    if (hasError) {
      console.log(errors);
      return {
        success: false,
        errors,  // Send the whole errors object to the client
      };
    } else {
      const sex_id = formData["common_data"]["sex_id"];
      const first_name = formData["common_data"]["first_name"];
      const last_name = formData["common_data"]["last_name"];
      const civil_status_id = formData["common_data"]["civil_status_id"];
      const birthdate = formData["common_data"]["birthdate"];
      const age = formData["common_data"]["age"];
      const email = formData["common_data"]["email"];


      try {

        await db.transaction(async (trx) => {
          const dataToInsert: any = {
            id: randomUUID(),
            modality_id,
            sex_id,
            first_name,
            last_name,
            civil_status_id,
            birthdate,
            age,
            email,
            created_by: "00000000-0000-0000-0000-000000000000",
          };



          dataToInsert.extension_name = formData["common_data"]["extension_name"];
          dataToInsert.middle_name = formData["common_data"]["middle_name"];
          dataToInsert.birthplace = formData["common_data"]["birthplace"];
          dataToInsert.philsys_id_no = formData["common_data"]["philsys_id_no"];
          dataToInsert.cellphone_no = formData["common_data"]["cellphone_no"];
          dataToInsert.cellphone_no_secondary = formData["common_data"]["cellphone_no_secondary"];

          // cfw[4]
          const formCFWIndex4 = formData["cfw"][4];

          dataToInsert.modality_sub_category_id = formCFWIndex4["modality_sub_category_id"];
          dataToInsert.current_occupation = formCFWIndex4["current_occupation"];
          dataToInsert.id_card = formCFWIndex4["id_card"];
          dataToInsert.occupation_id_card_number = formCFWIndex4["occupation_id_card_number"];
          dataToInsert.school_name = formCFWIndex4["school_name"];
          dataToInsert.campus = formCFWIndex4["campus"];
          dataToInsert.school_address = formCFWIndex4["school_address"];
          dataToInsert.course_id = formCFWIndex4["course_id"];
          dataToInsert.year_graduated = formCFWIndex4["year_graduated"];
          dataToInsert.year_level_id = formCFWIndex4["year_level_id"];
          dataToInsert.skills = formCFWIndex4["skills"];
          dataToInsert.deployment_area_id = formCFWIndex4["deployment_area_id"];
          dataToInsert.deployment_area_address = formCFWIndex4["deployment_area_address"];
          dataToInsert.preffered_type_of_work_id = formCFWIndex4["preffered_type_of_work_id"];
          dataToInsert.is_need_pwd_id = formCFWIndex4["is_need_pwd_id"];
          dataToInsert.pwd_id_no = formCFWIndex4["pwd_id_no"];
          dataToInsert.representative_last_name = formCFWIndex4["representative_last_name"];
          dataToInsert.representative_first_name = formCFWIndex4["representative_first_name"];
          dataToInsert.representative_middle_name = formCFWIndex4["representative_middle_name"];
          dataToInsert.representative_extension_name_id = formCFWIndex4["representative_extension_name_id"];
          dataToInsert.representative_sitio = formCFWIndex4["representative_sitio"];
          dataToInsert.representative_brgy_code = formCFWIndex4["representative_brgy_code"];
          dataToInsert.representative_relationship_to_beneficiary = formCFWIndex4["representative_relationship_to_beneficiary"];
          dataToInsert.representative_birthdate = formCFWIndex4["representative_birthdate"];
          dataToInsert.representative_age = formCFWIndex4["representative_age"];
          dataToInsert.representative_occupation = formCFWIndex4["representative_occupation"];
          dataToInsert.representative_monthly_salary = formCFWIndex4["representative_monthly_salary"];
          dataToInsert.representative_educational_attainment_id = formCFWIndex4["representative_educational_attainment_id"];
          dataToInsert.representative_sex_id = formCFWIndex4["representative_sex_id"];
          dataToInsert.representative_contact_number = formCFWIndex4["representative_contact_number"];
          dataToInsert.representative_id_card_id = formCFWIndex4["representative_id_card_id"];
          dataToInsert.representative_id_card_number = formCFWIndex4["representative_id_card_number"];
          dataToInsert.representative_civil_status_id = formCFWIndex4["representative_civil_status_id"];
          dataToInsert.representative_has_health_concern = formCFWIndex4["representative_has_health_concern"];
          dataToInsert.representative_health_concern_details = formCFWIndex4["representative_health_concern_details"];
          dataToInsert.representative_skills = formCFWIndex4["representative_skills"];
          // push status 1 = uploaded
          // push status id = 2 for uploading
          // push status id = 3 pending

          const result = await trx
            .insert(person_profile)
            .values(dataToInsert)
            .returning({ id: person_profile.id });

          // const idid = person_profile.id;
          // console.log(result[0].id);
          // return;
          dataToInsert.person_profile_id = result[0].id;
          console.log("Data insert: ", dataToInsert);

          // sector
          const formSectorIndex0 = formData["cfw"][0]['sectors'];
          const cnt = formSectorIndex0.length;
          console.log("The length of Sector is " + cnt);
          console.log("The sector index is ", formSectorIndex0);
          for (let x = 0; x < cnt; x++) {
            if (!formSectorIndex0[x]) continue;
            if (formSectorIndex0[x].answer === "Yes") {
              const dataToInsertSector: any = {
                person_profile_id: dataToInsert.person_profile_id,
                sector_id: formSectorIndex0[x].id,
                created_by: "00000000-0000-0000-0000-000000000000",
              };

              const resultSector = await trx
                .insert(person_profile_sector)
                .values(dataToInsertSector);
            }
          }


          // program details
          const formProgramDetails = formData["cfw"][1]['program_details'];
          const cntpd = formProgramDetails.length;
          console.log("The length of program details is " + cntpd);
          console.log("The program details index is ", formProgramDetails);
          for (let x = 0; x < cntpd; x++) {
            if (!formProgramDetails[x]) continue;
            // if (formProgramDetails[x].answer === "Yes") {
            const dataToInsertProgramDetails: any = {
              person_profile_id: dataToInsert.person_profile_id,
              cfw_type_id: formProgramDetails[x].cfw_type_id,
              year_served: Number(formProgramDetails[x].year_served),
              created_by: "00000000-0000-0000-0000-000000000000",
            };

            // person_profile_id
            // cfw_type_id
            // year_served
            const resultProgramDetails = await trx
              .insert(person_profile_cfw_fam_program_details)
              .values(dataToInsertProgramDetails);
            // }
          }

          // family composition
          const formFamilyComposition = formData["cfw"][3]['family_composition'];
          const cntfc = formFamilyComposition.length;
          console.log("The length of family composition is " + cntfc);
          console.log("The family composition index is ", formFamilyComposition);
          for (let x = 0; x < cntfc; x++) {
            if (!formFamilyComposition[x]) continue;
            // if (formFamilyComposition[x].answer === "Yes") {
            const dataToInsertFamilyComposition: any = {
              person_profile_id: dataToInsert.person_profile_id,            
              name: formFamilyComposition[x].name,
              birthdate: formFamilyComposition[x].birthdate,
              age: Number(formFamilyComposition[x].age),
              contact_number: formFamilyComposition[x].contact_number,
              highest_educational_attainment_id: formFamilyComposition[x].highest_educational_attainment_id,
              monthly_income: formFamilyComposition[x].monthly_income,
              relationship_to_the_beneficiary_id: formFamilyComposition[x].relationship_to_the_beneficiary_id,
              work: formFamilyComposition[x].work,
              created_by: "00000000-0000-0000-0000-000000000000",
            };

            // person_profile_id
            // cfw_type_id
            // year_served
            const resultFamilyComposition = await trx
              .insert(person_profile_family_composition)
              .values(dataToInsertFamilyComposition);
            // }
          }


          // person_profile_id
          // sector_id
          // const result = "dfsdafsd";

          if (result.length > 0) {


            // synch
            // const syncData = async () => {
            try {

              const response = await PersonProfileService.syncBulkData(dataToInsert);
              console.log('Sync successful:', response);
            } catch (error) {
              console.error('Sync failed:', error);
            }
            // };


            // console.log(formData);
            console.log(`Record saved successfully! ID: ${result[0].id}`);
          } else {
            console.log("Failed to save the record.");
          }


        });

      }
      catch (error) {
        console.error("Transaction error:", error);
      }
    }


  }








  await new Promise(resolve => setTimeout(resolve, 1000))


  return { success: true, message: 'User registered successfully!' }

}