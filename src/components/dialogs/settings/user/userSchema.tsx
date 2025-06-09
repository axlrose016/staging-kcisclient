import { z } from "zod";

const formSchema = z.object({
    username: z.string().min(1),
    role_id: z.string().uuid(),
})

type FormSchema = z.infer<typeof formSchema>

const formDefaultValues: FormSchema = {
    username: "",
    role_id:""
};

export { formDefaultValues, formSchema, type FormSchema};