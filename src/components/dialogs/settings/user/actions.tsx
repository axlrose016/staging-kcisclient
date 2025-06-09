"use server";

import { db } from "@/db";
import { users } from "@/db/schema/users";
import { upsertData, upsertIndividualData } from "@/db/utils/offline_crud";
import { z } from "zod";

const formSchema = z.object({
    id: z.string().uuid("Invalid ID").optional(),
    username: z.string().min(8, "Username is required and must be at 8 character"),
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    role_id: z.string().min(1, "Role is required"),
  });

export async function submit(prevState: any, formData: FormData){
  try
  {
    console.log("Form Data : ", formData)
    const formObject = Object.fromEntries(formData.entries());
    console.log("Form Object: ", formObject)

    const result = formSchema.safeParse(formObject);
    console.log("RESULT: ", result.error)

    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
      };
    }

    const user = result.data;
    await db.transaction(async (trx) => {
      await upsertIndividualData(trx, users, user);
      console.log("Record Successfully Saved!", user);
      return { success: true, message: "User Profile Successfully updated!", result };
    })
  }catch(error){
    return { success: false, message: "Failed to update User Profile.", error: error };
  }
}