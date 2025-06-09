"use server"
import {z} from "zod";

const formSchema = z.object({
    sub_project_name: z.string()
    .max(128, {message:"Sub Project name should less than 100 characters"})
    .trim(),
})

export async function submit(prevState: any, formData: FormData){
    const result = formSchema.safeParse(Object.fromEntries(formData));
    if(!result.success){
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    console.log("Form Submitted");
}