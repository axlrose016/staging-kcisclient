"use server"
import { sub } from "date-fns";
import {z} from "zod";

const formSchema = z.object({
    sub_project_name: z.string()
    .max(128, {message:"Sub Project name should at least less than 100 characters"})
    .trim(),
})

export async function onSubmit(formData: FormData){
    const validatedFields = formSchema.safeParse({
        sub_project_name: formData.get("sub_project_name"),
    })

    if(!validatedFields.success){
        return {success: false, errors: validatedFields.error.flatten().fieldErrors}
    }

    await new Promise(resolve => setTimeout(resolve, 1000))

    return {success: true, message: "Sub Project registered successfully!"}
}