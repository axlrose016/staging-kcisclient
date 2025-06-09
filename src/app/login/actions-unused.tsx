"use server"

import { db } from "@/db";
import { useraccess, users } from "@/db/schema/users";
import { createSession, deleteSession } from "@/lib/sessions";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcrypt";
import { modules, permissions, roles } from "@/db/schema/libraries";
import { IUserData } from "@/components/interfaces/iuser";


const debugUser = {
    id: "1",
    role: "Administrator",
    permissions: [
        {"Module":"Sub-Project","Permission":"Can Delete"},
        {"Module":"Settings","Permission":"Can Delete"},
        {"Module":"Procurement","Permission":"Can View"}
    ],
    email: "argvillanueva@dswd.gov.ph",
    password: "Fipifosux#",
};

const loginSchema = z.object({
    email: z.string().email({message:"Invalid Email Address"}).trim(),
    password: z
        .string()
        .min(8, {message:"Password must be at least 8 characters"})
        .trim(),
});

export async function login(prevState: any, formData: FormData){
    const result = loginSchema.safeParse(Object.fromEntries(formData));
    if(!result.success){
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const {email,password} = result.data;


    
    const user = await db.select().from(users).where(eq(users.email, email)).get();
    
    if(!user){
        return{
            errors:{
                email: ["No record found!"],
            },
        };
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(email !== user.email || !isPasswordCorrect){
        return{
            errors:{
                email: ["Invalid email or Password"],
            },
        };
    }

    if((email === user.email && isPasswordCorrect) || (email === debugUser.email && password === debugUser.password)){
        const access = await db.select().from(useraccess)
        .leftJoin(users, eq(useraccess.user_id, users.id))
        .leftJoin(roles, eq(users.role_id, roles.id))
        .leftJoin(permissions, eq(useraccess.permission_id, permissions.id))
        .leftJoin(modules, eq(useraccess.module_id, modules.id))
        .where(eq(useraccess.user_id, user.id)).all();

        if (access) {
            const useraccessArray: IUserData[] = [];
    
            access.forEach((acc) => {
                useraccessArray.push({
                    email: acc.users?.email,
                    name: acc.users?.username,
                    role: acc.roles?.role_description,
                    userAccess: [{
                        module: acc.modules?.module_description,
                        module_path: acc.modules?.module_path,
                        permission: acc.permissions?.permission_description
                    }]
                });
            });
            
            const useraccess = useraccessArray;

            await createSession(user.id, useraccess[0]);
            redirect("personprofile/form"); //change it to /
        }

    }

    
}

export async function logout() {
    await deleteSession();
    redirect("/login");
}