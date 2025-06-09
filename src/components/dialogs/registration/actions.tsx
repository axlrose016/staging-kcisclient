"use server";
import { useraccess, users } from "@/db/schema/users";
import { randomUUID } from "crypto";
import { z } from "zod";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/sessions";
import { redirect } from "next/navigation";
import { fetchModules, fetchOfflineModules, fetchOfflinePermissions, fetchOfflineRoles, fetchPermissions, fetchRoles } from "@/components/_dal/libraries";
import { IModules, IPermissions, IRoles } from "@/components/interfaces/library-interface";
import { IUser, IUserData } from "@/components/interfaces/iuser";
import UsersOfflineService from "@/db/offline/Pouch/users-service";
import { db } from "@/db";


const formSchema = z.object({
  username: z
    .string()
    .min(8, { message: "Username must be at least 8 characters"}),
  email: z
    .string()
    .email({ message: "Invalid Email Address" })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});
 
export async function submit(prevState: any, formData: FormData) {
 // const { users, fetchUsers, addUser } = UsersOfflineService();

  const formObject = Object.fromEntries(formData.entries());

  const result = formSchema.safeParse(formObject);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

    const { username, email, password } = result.data
    const id = randomUUID();  // Generates a new unique UUID
    
    const hashedPassword = await bcrypt.hash(password, 10)

    const _roles = await fetchOfflineRoles();
    const _modules = await fetchOfflineModules();
    const _permission = await fetchOfflinePermissions();
    const defaultRole = _roles.filter((w:IRoles) => w.role_description.includes("Guest"))
    const defaultModule = _modules.filter((w:IModules) => w.module_description.includes("Person Profile"))
    const defaultPermission = _permission.filter((w:IPermissions) => w.permission_description.includes("Can Add"))


    await db.transaction(async (trx) => {

      const data = await trx
      .insert(users)
      .values({
        id,
        role_id: defaultRole[0].id,
        username,email,password: hashedPassword, 
        created_by:id
      })
      .returning({id: users.id})

      const user = data[0]
      const access_id = randomUUID();  

      const access = await trx
      .insert(useraccess)
      .values({
        id: access_id,
        user_id: user.id,
        module_id: defaultModule[0].id,
        permission_id:defaultPermission[0].id,
        created_by:user.id,
      }).returning({id: useraccess.id})
  
      const role = defaultRole[0].role_description ?? "Guest";
      const permission: IUserData = {
        name: username,
        email:email,
        photo:"",
        role: role,
        userAccess:[{
          module: defaultModule[0].module_description,
          module_path: defaultModule[0].module_path,
          permission: defaultPermission[0].permission_description
        }]
      }
      
      await createSession(user.id,permission);
    });
    
    redirect('/');
}
