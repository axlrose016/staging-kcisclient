'use server'

import { z } from 'zod'
import { db } from "@/db";
import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto';
import { person_profile_cfw_fam_program_details, person_profile, person_profile_disability, person_profile_engagement_history, person_profile_family_composition, person_profile_file_upload, person_profile_sector } from '@/db/schema/personprofile';
import { resourceUsage } from 'process';
import { error } from 'console';
import { errors } from 'jose';
import axios from 'axios';
import PersonProfileService from '../../../../components/services/PersonProfileService';
// import { person_profile_sector } from '@/db/schema/person_profile_sector';
import { cachedDataVersionTag } from 'v8';
// import { useState } from 'react';

// Define the data structure using TypeScript interface


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

  if (!formData || Object.keys(formData).length === 0) {
    return { error: "No data provided!" }; // Return an object instead of a string
  }

  // const fd = JSON.parse(formData);
  // const fdrep = fd.contact_details.is_same_as_permanent_address;
  // return fdrep;
  // // Convert object values into an array
  // const disabilitiesArray = fd.disabilities ? Object.values(fd.disabilities) : [];

  try {
    const fd = JSON.parse(formData);

    const modality_id = fd.common_data.modality_id;

    if (modality_id === 25) {

      // saving the following in sequence
      // commondata                          
      // cfwGeneralInfo                     
      // contactDetails                    
      // healthConcern                       
      // employment                         
      // cfwPWDRepresentative  - optional            
      // sectors                            
      // ---- disabilities                       
      // ---- ipgroup_id                         
      // hasProgramDetails                  
      // ---- programDetails/ cfw_type - optional           
      // family_composition                 
      // educational_attainment            
      // preferred_deployment                
      // attachments                         

      let id = null;
      await db.transaction(async (trx) => {
        const dataToInsert: any = {
          id: randomUUID(),
          modality_id: fd.common_data?.modality_id || null,
          extension_name: fd.common_data?.extension_name || null,
          birthplace: fd.common_data?.birthplace || null,
          sex_id: fd.common_data?.sex_id || null,
          first_name: fd.common_data?.first_name || null,
          last_name: fd.common_data?.last_name || null,
          middle_name: fd.common_data?.middle_name || null,
          civil_status_id: fd.common_data?.civil_status_id || null,
          birthdate: fd.common_data?.birthdate || null,
          age: fd.common_data?.age || null,
          philsys_id_no: fd.common_data?.philsys_id_no || null,

          sitio: fd.contact_details?.sitio || null,
          brgy_code: fd.contact_details?.barangay_code || null,
          cellphone_no: fd.contact_details?.cellphone_no || null,
          cellphone_no_secondary: fd.contact_details?.cellphone_no_secondary || null,
          email: fd.contact_details?.email || null,

          sitio_current_address: fd.contact_details?.sitio_present_address || null,
          barangay_code_current: fd.contact_details?.barangay_code_present_address || null,



          is_permanent_same_as_current_address: fd.contact_details.is_same_as_permanent_address === true ? 1 : 0 || null, // Boolean
          // sitio_current_address: fd.current_address?.sitio_current_address || null,
          // barangay_code_current: fd.current_address?.barangay_code_current || null,


          has_immediate_health_concern: fd.health_concerns?.has_immediate_health_concern ?? null, // Boolean
          immediate_health_concern: fd.health_concerns?.immediate_health_concern || null,

          school_name: fd.educational_attainment?.school_name || null,
          campus: fd.educational_attainment?.campus || null,
          school_address: fd.educational_attainment?.school_address || null,
          course_id: fd.educational_attainment?.course_id ?? 0, // Integer defaulting to 0
          year_graduated: fd.educational_attainment?.year_graduated || null,
          year_level_id: fd.educational_attainment?.year_level_id ?? 0,

          current_occupation: fd.employment?.current_occupation || null,
          id_card: fd.employment?.id_card ?? 0, // Integer defaulting to 0
          occupation_id_card_number: fd.employment?.occupation_id_card_number || null,
          skills: fd.employment?.skills || null,

          deployment_area_id: fd.preferred_deployment?.deployment_area_id ?? 0, // Integer defaulting to 0
          deployment_area_address: fd.preferred_deployment?.deployment_area_address || null,
          preffered_type_of_work_id: fd.preferred_deployment?.preffered_type_of_work_id ?? 0, // Integer defaulting to 0

          modality_sub_category_id: fd.cfw_general_info?.modality_sub_category_id || null,


          is_pwd_representative: fd.cfw_representative?.is_cfw_representative === true ? 1 : 0 || null,



          ip_group_id: fd.ip_group_id || null,

          created_by: "00000000-0000-0000-0000-000000000000",
        };

        dataToInsert.representative_last_name = fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_last_name || null;
        dataToInsert.representative_first_name = fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_first_name || null;
        dataToInsert.representative_middle_name = fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_middle_name || null;
        dataToInsert.representative_extension_name_id = fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_extension_name_id || null;
        dataToInsert.representative_sitio = fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_sitio || null;
        dataToInsert.representative_brgy_code = fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_brgy_code || null;
        dataToInsert.representative_relationship_to_beneficiary = fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_relationship_to_beneficiary || null;
        dataToInsert.representative_birthdate = fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_birthdate || null;
        dataToInsert.representative_age = fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_age || null;
        dataToInsert.representative_occupation = fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_occupation || null;
        dataToInsert.representative_monthly_salary = (fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_monthly_salary) ?? 0;
        dataToInsert.representative_educational_attainment_id = (fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_educational_attainment_id) ?? 0;
        dataToInsert.representative_sex_id = (fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_sex_id) ?? 0;
        dataToInsert.representative_contact_number = fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_contact_number || null;
        dataToInsert.representative_id_card_id = (fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_id_card_id) ?? 0;
        dataToInsert.representative_id_card_number = fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_id_card_number || null;
        dataToInsert.representative_civil_status_id = (fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_civil_status_id) ?? 0;
        dataToInsert.representative_has_health_concern = fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_has_health_concern || null;
        dataToInsert.representative_health_concern_details = fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_health_concern_details || null;
        dataToInsert.representative_skills = fd.cfw_representative?.is_cfw_representative && fd.cfw_representative?.representative_skills || null;




        console.log("Inserting Data:", dataToInsert); // Debugging

        const resultInsertCommonData = await trx
          .insert(person_profile)
          .values(dataToInsert)
          .returning({ id: person_profile.id });

        console.log("Insert Result:", resultInsertCommonData); // Debugging

        if (resultInsertCommonData.length > 0) {
          id = resultInsertCommonData[0].id;
          try {
            // synch of person profile
            const response = await PersonProfileService.syncBulkData(dataToInsert);
            console.log('Sync successful:', response);
          } catch (error) {
            console.error('Sync failed:', error);
          }



          

          // junction table      
          const cnt = fd.sectors.length;
          for (let x = 0; x < cnt; x++) {
            if (fd.sectors[x].answer === "Yes") {
              const dataToInsertSector: any = {
                person_profile_id: id,
                sector_id: fd.sectors[x].id,
                created_by: "00000000-0000-0000-0000-000000000000",
              };

              const resultSector = await trx
                .insert(person_profile_sector)
                .values(dataToInsertSector);

              // console.log("Sector: " + JSON.stringify(resultSector));
            }


          }

          // for disabilities
          if (fd.sectors[2]?.answer === "Yes") {

            if (fd.disabilities) {
              // Convert object values into an array
              const disabilitiesArray = fd.disabilities ? Object.values(fd.disabilities) : [];

              // Check the length
              const discnt = disabilitiesArray.length;
              // console.log("Bilang: " + discnt);              
              // console.log("DISCOUNT " + discnt);
              for (let i = 0; i < discnt; i++) {

                const dataToInsertDisabs: any = {
                  person_profile_id: id,
                  type_of_disability_id: fd.disabilities["disability_id_" + (i + 1)],
                  created_by: "00000000-0000-0000-0000-000000000000",
                };

                const resultDisabs = await trx
                  .insert(person_profile_disability)
                  .values(dataToInsertDisabs);

                console.log("Disabs: " + JSON.stringify(resultDisabs));

              }
            } else {
              console.log("No disabilities selected");
            }

          }

          const fccount = fd.family_composition.family_composition.length;
          for (let i = 0; i < fccount; i++) {
            const dataToInsertFamCom: any = {
              person_profile_id: id,

              name: fd.family_composition.family_composition[i].name || null,
              birthdate: fd.family_composition.family_composition[i].birthdate || null,
              age: fd.family_composition.family_composition[i].age || 0,
              contact_number: fd.family_composition.family_composition[i].contact_number || null,
              highest_educational_attainment_id: fd.family_composition.family_composition[i].highest_educational_attainment_id || null,
              monthly_income: fd.family_composition.family_composition[i].monthly_income || null,
              relationship_to_the_beneficiary_id: fd.family_composition.family_composition[i].relationship_to_the_beneficiary_id || null,
              work: fd.family_composition.family_composition[i].work || null,

              created_by: "00000000-0000-0000-0000-000000000000",
            };

            const resultFamCom = await trx
              .insert(person_profile_family_composition)
              .values(dataToInsertFamCom);

            console.log("Family Composition: " + JSON.stringify(resultFamCom));
          }

          // attachments



          if (fd.disabilities) {
            // Convert object values into an array

            // Check the length
            const attachmentCnt = fd.attachments.length;
            for (let i = 0; i < attachmentCnt; i++) {
              if (fd.attachments[i].file_name) {

                const dataToInsertAttachments: any = {
                  person_profile_id: id,
                  file_id: fd.attachments[i].id,
                  file_name: fd.attachments[i].file_name,
                  created_by: "00000000-0000-0000-0000-000000000000",
                };

                const resultAttachments = await trx
                  .insert(person_profile_file_upload)
                  .values(dataToInsertAttachments);

                console.log("Attachments: " + JSON.stringify(resultAttachments));
              }

            }
          } else {
            console.log("No disabilities selected");
          }


          if (fd.program_details) {
            const pdcnt = fd.program_details.length;
            for (let i = 0; i < pdcnt; i++) {
              const dataToInsertProgramDetails: any = {
                person_profile_id: id,
                cfw_type_id: fd.program_details[i].cfw_type_id,
                year_served: fd.program_details[i].year_served,
                created_by: "00000000-0000-0000-0000-000000000000",
              };

              const resultProgramDetails = await trx
                .insert(person_profile_cfw_fam_program_details)
                .values(dataToInsertProgramDetails);

              console.log("Program Details: " + JSON.stringify(resultProgramDetails));
            }
          }



          return { success: true, id: resultInsertCommonData[0].id + " success!" };
        } else {
          return { success: false, error: "Insert failed" };
        }


      });



      // return "Goods"; // ✅ Return parsed object directly
    }


  } catch (error) {
    console.error("Transaction Error:", error);
    return { success: false, error: "Database transaction failed" };
  }



  return;
  const modality_idd = formData["common_data"]["modality_id"];
  let hasError = false;


  console.log("Modality ID: ", modality_idd);
  if (modality_idd === 25) {
    // const cfw4 = formData["cfw"][4]["has_immediate_health_concern"];
    // console.log("has_immediate_health_concern: " , cfw4);
    const modality_sub_category_id_test = formData["cfw"][4]["modality_sub_category_id"];
    if (modality_sub_category_id_test === 0) {
      return { errors: { modality_sub_category_id: 'Modality Sub Category required!' } };
    }

    const has_immediate_health_concern = formData["cfw"][4]["has_immediate_health_concern"];
    const immediate_health_concern = formData["cfw"][4]["immediate_health_concern"];
    if (has_immediate_health_concern === 1) {
      if (immediate_health_concern === null) {
        return { errors: { immediate_health_concern: 'Immediate health concern should not be empty!' } };
      }
    }
    const combinedSchema = generalSchema.merge(schemaCFW);

    const data = formData["common_data"];
    const fd = new FormData();
    for (const [key, value] of Object.entries(data)) {
      // fd.append(key, value instanceof File || typeof value === "string" ? value : String(value));
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
            modality_idd,
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
          // push status id = 2 for uploading

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