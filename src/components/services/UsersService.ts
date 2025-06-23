import { IUser, IUserAccess } from '@/components/interfaces/iuser';
import { IPersonProfile } from '@/components/interfaces/personprofile';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { getModules, getPermissions, getRoles } from '@/db/offline/Dexie/schema/library-service';
import { toast } from '@/hooks/use-toast';
import { cleanArray, encryptJsonAsync, hashPassword } from '@/lib/utils';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

class UsersService {
  private userApi = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + 'auth_users/create/';

  async syncUserData(userData: IUser,userAccess: IUserAccess[]): Promise<any> {
    const payload = {
      user: userData,
      user_access: cleanArray(userAccess)
    }
    console.log("User payload!", Array(payload));
    try {
      debugger;
      const response = await axios.post(this.userApi, Array(payload), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("User successfully synchronized!", response.data);
      return true;
    } catch (error) {
      console.error('Error syncing user data:', error);
      return false;
    }
  }

  async saveUser(userProfileData: any): Promise<any | undefined> {
  try {
    // PRE-CHECK LIBRARIES
    const [roles, modules, permissions] = await Promise.all([
      getRoles(),
      getModules(),
      getPermissions(),
    ]);

    const _role = roles.find(w => w.role_description === "Guest");
    const _module = modules.find(w => w.module_description === "Person Profile");
    const _permission = permissions.find(w => w.permission_description === "Can Add");

    if (!_role || !_module || !_permission) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong with your Library.",
        description: "Please refresh the page and try again!",
      });
      return;
    }

    // PREPARE USER DATA
    let userData: IUser = userProfileData?.userCredential;
    let isNewUser = !userData?.id;

    const salt = crypto.getRandomValues(new Uint8Array(16)); // Generate a random salt
    console.log('salt', salt)
    const hashedPassword: string = await hashPassword(userData.password, salt);
    console.log('hashedPassword', hashedPassword)

    const saltObject: Record<string, number> = salt.reduce((acc, val, idx) => {
      acc[idx] = val;
      return acc;
    }, {} as Record<string, number>);
    
    let _id = uuidv4();
    if (isNewUser) {
      userData = {
        ...userData,
        id: _id,
        password: hashedPassword,
        salt: saltObject,
        role_id: _role.id,
        created_date: new Date().toISOString(),
        created_by: _id,
        push_status_id: 2,
        remarks: `Record Created by ${userData.email}`,
      };
    } else {
      const existing = await dexieDb.users.get(userData.id);
      if (!existing) throw new Error("User record not found for update.");

      userData = {
        ...existing,
        ...userData,
        last_modified_by: userData.email,
        last_modified_date: new Date().toISOString(),
        push_status_id: 2,
        remarks: `Record Updated by ${userData.email}`,
      };
    }

    // PREPARE USER ACCESS IF NEW
    let userAccess: IUserAccess | undefined;
    if (isNewUser) {
      userAccess = {
        id: uuidv4(),
        user_id: _id,
        module_id: _module.id,
        permission_id: _permission.id,
        created_date: new Date().toISOString(),
        created_by: userData.id,
        last_modified_by: null,
        last_modified_date: null,
        push_date: null,
        push_status_id: 2,
        deleted_by: null,
        deleted_date: null,
        is_deleted: false,
        remarks: `Record Saved by ${userData.email}`,
      };
    }

    // PREPARE USER PROFILE
    let userProfile: IPersonProfile = {
      ...userProfileData?.basicInformation,
      ...userProfileData?.contactInformation,
    };

    const isNewProfile = !userProfile.id;
    if (isNewProfile) {
      userProfile = {
        ...userProfile,
        id: uuidv4(),
        first_name: await encryptJsonAsync(userProfile.first_name),
        middle_name: await encryptJsonAsync(userProfile.middle_name),
        last_name:await  encryptJsonAsync(userProfile.last_name),
        birthdate: await encryptJsonAsync(userProfile.birthdate),
        birthplace: await encryptJsonAsync(userProfile.birthplace),
        sitio: await encryptJsonAsync(userProfile.sitio || ""),
        sitio_present_address: await encryptJsonAsync(userProfile.sitio_present_address || ""),
        cellphone_no: await encryptJsonAsync(userProfile.cellphone_no || ""),
        cellphone_no_secondary: await encryptJsonAsync(userProfile.cellphone_no_secondary || ""),
        created_date: new Date().toISOString(),
        created_by: _id,
        push_status_id: 2,
        remarks: `Record Created by ${userData.email}`,
        user_id: userData.id,
      };
    } else {
      const existing = await dexieDb.person_profile.get(userProfile.id);
      if (!existing) throw new Error("Person profile record not found for update.");

      userProfile = {
        ...existing,
        ...userProfile,
        last_modified_by: userData.email,
        last_modified_date: new Date().toISOString(),
        push_status_id: 2,
        remarks: `Record Updated by ${userData.email}`,
      };
    }

    // START TRANSACTION
    let savedUser: IUser | undefined;
    let savedProfile: IPersonProfile | undefined;

    await dexieDb.transaction('rw', [dexieDb.users, dexieDb.useraccess, dexieDb.person_profile], async (trans) => {
      trans.meta = { needsAudit: true };

      await dexieDb.users.put(userData);
      savedUser = userData;

      if (userAccess) {
        await dexieDb.useraccess.put(userAccess);
      }

      await dexieDb.person_profile.put(userProfile);
      savedProfile = userProfile;
    });
    console.log(savedProfile);
    return { savedUser, savedProfile };
  } catch (error) {
    console.error("Save user failed:", error);
    return undefined;
  }
  }
}


export default new UsersService();
