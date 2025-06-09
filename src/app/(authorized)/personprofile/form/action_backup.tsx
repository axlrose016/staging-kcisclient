'use server'

import { z } from 'zod'
import { db } from "@/db";
import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto';
import { person_profile } from '@/db/schema/personprofile';
import { resourceUsage } from 'process';


// for validation
const schema = z.object({

  modality_id: z.coerce.number().min(1, "Modality is required"),
  sex_id: z.coerce.number().min(1, "Sex is required"),
  civil_status_id: z.coerce.number().min(1, "Civil Status is required"),
  first_name: z.string().min(2, 'First name must be at least 2 characters long'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters long'),
  birthdate: z
    .string()
    .nonempty('Birthdate is required') // Ensures it's not an empty string
    .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), { message: 'Invalid date format (YYYY-MM-DD)' }),
  age: z.coerce.number().int().min(21, 'Age must be 21 or older'),


})

export async function submit(prevState: any, formData: FormData) {


  const formObject = Object.fromEntries(formData.entries());

  const result = schema.safeParse(formObject);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  // Here you would typically save the user to your database
  // For this example, we'll just simulate a delay
  const {
    modality_id,
    sex_id,
    first_name,
    last_name,
    civil_status_id,
    birthdate,
    age
  } = result.data;


  // console.log("formData ---------------------", formObject);
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
        created_by: "00000000-0000-0000-0000-000000000000",
      };


      if (formObject.middle_name) {
        dataToInsert.middle_name = formObject.middle_name;
      }
      if (formObject.modality_id) {
        dataToInsert.modality_id = Number(formObject.modality_id);
      }
      if (formObject.extension_name) {
        dataToInsert.extension_name = formObject.extension_name;
      }
      if (formObject.philsys_id_no) {
        dataToInsert.philsys_id_no = formObject.philsys_id_no;
      }

      // console.log("PhilsysID: " + formObject.philsys_id_no);
      if (formObject.age) {
        dataToInsert.age = formObject.age;
      }
      if (formObject.immediate_health_concern) {
        dataToInsert.immediate_health_concern = formObject.immediate_health_concern;
      }


      const ageNumber = Number(formData.get('age'));

      if (isNaN(ageNumber)) {
        return { errors: { age: 'Age must be a valid number' } };
      }

      if (ageNumber < 21) {
        return { errors: { age: 'Age must be 21 or older' } };
      }

      const result = await trx
        .insert(person_profile)
        .values(dataToInsert)
        .returning({ id: person_profile.id });

      // const result = "dfsdafsd";

      if (result.length > 0) {
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

  // const result =  await trx
  //   .insert(person_profile)
  //   .values({
  //     id: randomUUID(),
  //     // modality_id,
  //     // cwf_category_id,
  //     first_name, last_name, created_by: "00000000-0000-0000-0000-000000000000",

  //   }).returning({ id: person_profile.id });

  //   if (result.length > 0) {
  //     console.log(`Record saved successfully! ID: ${result[0].id}`);
  //   } else {
  //     console.log("Failed to save the record.");
  //   }


  await new Promise(resolve => setTimeout(resolve, 1000))

  return { success: true, message: 'User registered successfully!' }
}