import { EntityTable } from 'dexie';
import { dexieDb } from '../databases/dexieDb'; // Assuming dexieDb is properly initialized elsewhere
import { ICFWSchedules, ICFWTimeLogs, IUser, IUserAccess, IUserData, IUserDataAccess } from '@/components/interfaces/iuser';
import { toast } from '@/hooks/use-toast';
import { hashPassword } from '@/lib/utils';
import { libDb } from '../databases/libraryDb';

// Ensure you're using a single instance for interacting with the users table
const tblUsers = dexieDb.table('users') as EntityTable<IUser, 'id'>;
const tblUserAccess = dexieDb.table('useraccess') as EntityTable<IUserAccess, 'id'>;

// Add user function
export async function addUser(user: IUser) {
    try {
        return await tblUsers.add(user);
    } catch (error) {
        console.error("Error adding user:", error);
        return null;
    }
}
export async function bulkAddUser(users: IUser[]) {
    try {
        return await tblUsers.bulkPut(users);
    } catch (error) {
        console.error("Error adding bulk users:", error);
        return null;
    }
}
export async function trxAddUserWithAccess(user: IUser, useraccess: IUserAccess) {
    try {
        dexieDb.transaction('rw', [tblUsers, tblUserAccess], async () => {
            await tblUsers.add(user);
            await tblUserAccess.add(useraccess);
        });
    } catch (error) {
        console.error("Error adding user and access:", error);
        return null;
    }
}
export async function getUsers() {
    try {
        const users = await tblUsers.toArray();
        console.log('Users:', users);
        return users;
    } catch (error) {
        console.error('Error retrieving users:', error);
        return [];
    }
}

export async function getUserById(id: string) {
    try {
        return await tblUsers.where("id").equals(id).first();
    } catch (error) {
        return null;
    }
}

export async function getUserByEmail(email: string) {
    try {
        return await tblUsers.where("email").equals(email).first();
    } catch (error) {
        return null;
    }
}

// Add user access
export async function addUserAccess(useraccess: IUserAccess) {
    try {
        return await tblUserAccess.add(useraccess);
    } catch (error) {
        console.error("Error adding user access:", error);
        return null;
    }
}
export async function bulkAddUserAccess(useraccess: IUserAccess[]) {
    try {
        return await tblUserAccess.bulkPut(useraccess);
    } catch (error) {
        console.error("Error adding bulk user access:", error);
        return null;
    }
}
export async function getUserAccessById(id: string) {
    try {
        const useraccess = await tblUserAccess.where('user_id').equals(id).toArray();
        console.log('User Access:', useraccess);
        return useraccess;
    } catch (error) {
        console.error('Error retrieving user access:', error);
        return [];
    }
}
export async function getUserData(id: string): Promise<IUserData | null> {
    try {
        const user = await tblUsers.get(id);
        if (user == null) {
            return null;
        }
        const userrole = await dexieDb.roles.where('id').equals(user.role_id).first();
        const useraccess = await tblUserAccess.where('user_id').equals(id).toArray();
        const userlevel = await libDb.lib_level.where('id').equals(user.level_id ?? 0).first();
        console.log("User Access: ", useraccess);
        const userDataAccess: IUserDataAccess[] = [];
        for (const access of useraccess) {
            const module = await dexieDb.modules.where('id').equals(access.module_id).first();
            const permission = await dexieDb.permissions.where('id').equals(access.permission_id).first();

            userDataAccess.push({
                role: userrole?.role_description,
                module: module?.module_description,
                module_path: module?.module_path,
                permission: permission?.permission_description
            });
        }
        const userData: IUserData = {
            name: user?.username,
            email: user?.email,
            photo: "",
            role: userrole?.role_description,
            level: userlevel?.level_description,
            userAccess: userDataAccess
        }
        debugger;
        return userData;
    } catch (error) {
        console.log('Failed to Get User Data:', error);
        return null;
    }
}

export async function checkUserExists(email: string, username: string) {
    const isExist = await tblUsers.where('email').equals(email)
        .or('username').equals(username)
        .count() > 0;
    return isExist;
}




const saltObj = {
    "0": 86,
    "1": 57,
    "2": 55,
    "3": 56,
    "4": 50,
    "5": 43,
    "6": 121,
    "7": 200,
    "8": 151,
    "9": 255,
    "10": 140,
    "11": 219,
    "12": 85,
    "13": 63,
    "14": 158,
    "15": 105
}
const saltArray = new Uint8Array(Object.values(saltObj));

export const seedUser: IUser[] = [
    // {
    //     "id": "e9840dec-f388-418c-b5c9-c5cf295df9d7",
    //     "username": "kcadmin123",
    //     "email": "kcadmin@gmail.com",
    //     "password": "Svk7OMYHydnYeJIlCzG9MnhlBb7SSQ7c1E3zvx4KWsM=",
    //     "salt": Array.from(saltArray),
    //     "role_id": "d4003a01-36c6-47af-aae5-13d3f04e110f",
    //     "level_id": 0,
    //     "created_date": "2025-03-11T06:18:58.077Z",
    //     "created_by": "e9840dec-f388-418c-b5c9-c5cf295df9d7",
    //     "last_modified_date": "",
    //     "last_modified_by": "",
    //     "push_status_id": 2,
    //     "push_date": "",
    //     "deleted_date": "",
    //     "deleted_by": "",
    //     "is_deleted": false,
    //     "remarks": ""
    // },
    {
        "id": "17eb1f81-83d3-4642-843d-24ba3e40f45c",
        "username": "finance123",
        "email": "financeadmin@gmail.com",
        "password": "Svk7OMYHydnYeJIlCzG9MnhlBb7SSQ7c1E3zvx4KWsM=",
        "salt": Array.from(saltArray),
        "role_id": "17eb1f81-83d3-4642-843d-24ba3e40f45c",
        "level_id": 0,
        "created_date": "2025-03-11T06:18:58.077Z",
        "created_by": "e9840dec-f388-418c-b5c9-c5cf295df9d7",
        "last_modified_date": "",
        "last_modified_by": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_date": "",
        "deleted_by": "",
        "is_deleted": false,
        "remarks": ""
    },
    {
        "id": "7e5d9d82-101a-4c5c-ab4e-86bd2169c348",
        "username": "odnpm123",
        "email": "odnpm@gmail.com",
        "password": "Svk7OMYHydnYeJIlCzG9MnhlBb7SSQ7c1E3zvx4KWsM=",
        "salt": Array.from(saltArray),
        "role_id": "7e5d9d82-101a-4c5c-ab4e-86bd2169c348",
        "level_id": 0,
        "created_date": "2025-03-11T06:18:58.077Z",
        "created_by": "e9840dec-f388-418c-b5c9-c5cf295df9d7",
        "last_modified_date": "",
        "last_modified_by": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_date": "",
        "deleted_by": "",
        "is_deleted": false,
        "remarks": ""
    },
    {
        "id": "ebaea47e-df5e-463a-b9f8-aa3636db5fff",
        "username": "kccfwadmin",
        "email": "kccfwadmin@gmail.com",
        "password": "Svk7OMYHydnYeJIlCzG9MnhlBb7SSQ7c1E3zvx4KWsM=",
        "salt": Array.from(saltArray),
        "role_id": "cf05023f-b2dc-46be-ab08-d82dfc8d8cd5",
        "level_id": 0,
        "created_date": "2025-03-11T06:18:58.077Z",
        "created_by": "e9840dec-f388-418c-b5c9-c5cf295df9d7",
        "last_modified_date": "",
        "last_modified_by": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_date": "",
        "deleted_by": "",
        "is_deleted": false,
        "remarks": ""
    },
    {
        "id": "23db4fc3-038d-4ebc-8688-f35a1cf5f24a",
        "username": "Juan Dela Cruz",
        "email": "immediatesupervisor@gmail.com",
        "password": "Svk7OMYHydnYeJIlCzG9MnhlBb7SSQ7c1E3zvx4KWsM=",
        "salt": Array.from(saltArray),
        "role_id": "3d735b9c-f169-46e0-abd1-59f66db1943c",
        "level_id": 0,
        "created_date": "2025-03-11T06:18:58.077Z",
        "created_by": "e9840dec-f388-418c-b5c9-c5cf295df9d7",
        "last_modified_date": "",
        "last_modified_by": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_date": "",
        "deleted_by": "",
        "is_deleted": false,
        "remarks": ""
    },
    {
        "id": "35c1f7f3-03be-4277-99cd-3b78dad9722a",
        "username": "Uncle Sam",
        "email": "alternatesupervisor@gmail.com",
        "password": "Svk7OMYHydnYeJIlCzG9MnhlBb7SSQ7c1E3zvx4KWsM=",
        "salt": Array.from(saltArray),
        "role_id": "eed84e85-cd50-49eb-ab19-a9d9a2f3e374",
        "level_id": 0,
        "created_date": "2025-03-11T06:18:58.077Z",
        "created_by": "e9840dec-f388-418c-b5c9-c5cf295df9d7",
        "last_modified_date": "",
        "last_modified_by": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_date": "",
        "deleted_by": "",
        "is_deleted": false,
        "remarks": ""
    }
    ,
    {
        "id": "8a9eb495-cb87-4ebc-b2cc-be1b186bb7ea",
        "username": "HEI FOCAL PERSON TEST",
        "email": "heifocaltest@gmail.com",
        "password": "Svk7OMYHydnYeJIlCzG9MnhlBb7SSQ7c1E3zvx4KWsM=",
        "salt": Array.from(saltArray),
        "role_id": "e2ebba79-7134-4ddb-838f-9350a89c2a0e",
        "level_id": 0,
        "created_date": "2025-03-11T06:18:58.077Z",
        "created_by": "8a9eb495-cb87-4ebc-b2cc-be1b186bb7ea",
        "last_modified_date": "",
        "last_modified_by": "",
        "push_status_id": 2,
        "push_date": "",
        "deleted_date": "",
        "deleted_by": "",
        "is_deleted": false,
        "remarks": ""
    }
];

export const seedUserAccess: IUserAccess[] = [
    // person profile
    {
        "created_by": "78636dd9-bca4-46d1-b6aa-75168e7009f1",
        "created_date": "2025-03-11T06:18:58.077Z",
        "deleted_by": "",
        "deleted_date": "",
        "id": "7e5d9d82-101a-4c5c-ab4e-86bd2169c348",
        "is_deleted": false,
        "last_modified_by": "",
        "last_modified_date": "",
        "module_id": "4e658b02-705a-43eb-a051-681d54e22e2a",
        "permission_id": "f38252b5-cc46-4cc1-8353-a49a78708739",
        "push_date": "",
        "push_status_id": 2,
        "remarks": "",
        "user_id": "7e5d9d82-101a-4c5c-ab4e-86bd2169c348"
    },
    {
        "created_by": "78636dd9-bca4-46d1-b6aa-75168e7009f1",
        "created_date": "2025-03-11T06:18:58.077Z",
        "deleted_by": "",
        "deleted_date": "",
        "id": "17eb1f81-83d3-4642-843d-24ba3e40f45c",
        "is_deleted": false,
        "last_modified_by": "",
        "last_modified_date": "",
        "module_id": "4e658b02-705a-43eb-a051-681d54e22e2a",
        "permission_id": "f38252b5-cc46-4cc1-8353-a49a78708739",
        "push_date": "",
        "push_status_id": 2,
        "remarks": "",
        "user_id": "17eb1f81-83d3-4642-843d-24ba3e40f45c"
    },
    // {
    //     "created_by": "78636dd9-bca4-46d1-b6aa-75168e7009f1",
    //     "created_date": "2025-03-11T06:18:58.077Z",
    //     "deleted_by": "",
    //     "deleted_date": "",
    //     "id": "c4976bbd-8d88-48b2-80eb-e62d9ebaf144",
    //     "is_deleted": false,
    //     "last_modified_by": "",
    //     "last_modified_date": "",
    //     "module_id": "4e658b02-705a-43eb-a051-681d54e22e2a",
    //     "permission_id": "f38252b5-cc46-4cc1-8353-a49a78708739",
    //     "push_date": "",
    //     "push_status_id": 2,
    //     "remarks": "",
    //     "user_id": "e9840dec-f388-418c-b5c9-c5cf295df9d7"
    // },
    // {
    //     "created_by": "78636dd9-bca4-46d1-b6aa-75168e7009f1",
    //     "created_date": "2025-03-11T06:18:58.077Z",
    //     "deleted_by": "",
    //     "deleted_date": "",
    //     "id": "b666b58c-b47e-450b-a21e-71951854b7b7",
    //     "is_deleted": false,
    //     "last_modified_by": "",
    //     "last_modified_date": "",
    //     "module_id": "9bb8ab82-1439-431d-b1c4-20630259157a",
    //     "permission_id": "5568ea7d-6f12-4ce9-b1e9-adb256e5b057",
    //     "push_date": "",
    //     "push_status_id": 2,
    //     "remarks": "",
    //     "user_id": "e9840dec-f388-418c-b5c9-c5cf295df9d7"
    // },
    // {
    //     "created_by": "78636dd9-bca4-46d1-b6aa-75168e7009f1",
    //     "created_date": "2025-03-11T06:18:58.077Z",
    //     "deleted_by": "",
    //     "deleted_date": "",
    //     "id": "3f7fd931-6c08-4706-9847-f5c7bf663807",
    //     "is_deleted": false,
    //     "last_modified_by": "",
    //     "last_modified_date": "",
    //     "module_id": "866e6bcb-041f-4d58-94bf-6c54e4855f85",
    //     "permission_id": "5568ea7d-6f12-4ce9-b1e9-adb256e5b057",
    //     "push_date": "",
    //     "push_status_id": 2,
    //     "remarks": "",
    //     "user_id": "e9840dec-f388-418c-b5c9-c5cf295df9d7"
    // },
    {
        "created_by": "78636dd9-bca4-46d1-b6aa-75168e7009f1",
        "created_date": "2025-03-11T06:18:58.077Z",
        "deleted_by": "",
        "deleted_date": "",
        "id": "1d23ace1-0562-4274-ab6a-467704b94fed",
        "is_deleted": false,
        "last_modified_by": "",
        "last_modified_date": "",
        "module_id": "4e658b02-705a-43eb-a051-681d54e22e2a",
        "permission_id": "5568ea7d-6f12-4ce9-b1e9-adb256e5b057",
        "push_date": "",
        "push_status_id": 2,
        "remarks": "",
        "user_id": "ebaea47e-df5e-463a-b9f8-aa3636db5fff"
    },
    // {
    //     "created_by": "78636dd9-bca4-46d1-b6aa-75168e7009f1",
    //     "created_date": "2025-03-11T06:18:58.077Z",
    //     "deleted_by": "",
    //     "deleted_date": "",
    //     "id": "17d4a50f-fda6-43e9-a059-37672dfb28fa",
    //     "is_deleted": false,
    //     "last_modified_by": "",
    //     "last_modified_date": "",
    //     "module_id": "19a18164-3a26-4ec3-ac6d-755df1d3b980",
    //     "permission_id": "5568ea7d-6f12-4ce9-b1e9-adb256e5b057",
    //     "push_date": "",
    //     "push_status_id": 2,
    //     "remarks": "",
    //     "user_id": "e9840dec-f388-418c-b5c9-c5cf295df9d7"
    // },

];

export const seedCFWSchedules: ICFWSchedules[] = [
    {
        id: "1",                              // Unique schedule ID
        record_id: "emp_123",                  // Links to employee record
        cfw_type_id: "Student",                // "Student" or "Graduate"
        shift_type: "Fixed",                   // "Fixed", "Flexi", "Rotational"
        date_start: new Date("2025-04-01"),    // Schedule start date
        date_end: null,                        // Schedule end date (nullable for ongoing schedules)
        time_in_1: "08:00:00",                 // First morning IN time (HH:MM:SS)
        time_out_1: "12:00:00",                // First morning OUT time (HH:MM:SS)
        time_in_2: "13:00:00",                 // Second morning IN time (HH:MM:SS)
        time_out_2: "17:00:00",                // Second morning OUT time (HH:MM:SS)
        time_in_3: "",                         // No afternoon session for Fixed schedule
        time_out_3: "",
        time_in_4: "",
        time_out_4: "",
        total_hours_required: 8,               // Total required hours for Fixed Graduate
        status_id: 1,                           // Active status
        "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded"
    },
    {
        id: "2",
        record_id: "emp_124",
        cfw_type_id: "Graduate",
        shift_type: "Flexi",                   // "Flexi" shift type
        date_start: new Date("2025-04-01"),
        date_end: null,
        time_in_1: "09:00:00",                 // Flexible morning IN
        time_out_1: "12:00:00",                // Flexible morning OUT
        time_in_2: "13:00:00",
        time_out_2: "17:00:00",
        time_in_3: "",                         // No afternoon session for Flexi schedule
        time_out_3: "",
        time_in_4: "",
        time_out_4: "",
        total_hours_required: 4,               // 4 hours for Flexi-Student
        status_id: 1                           // Active status
        , "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded"
    },
    {
        id: "3",
        record_id: "emp_125",
        cfw_type_id: "Graduate",
        shift_type: "Fixed",                   // "Fixed" shift type
        date_start: new Date("2025-04-01"),
        date_end: null,
        time_in_1: "08:00:00",                 // Fixed shift start time
        time_out_1: "12:00:00",                // Fixed shift break
        time_in_2: "13:00:00",                 // Fixed shift post-break IN time
        time_out_2: "17:00:00",                // Fixed shift end time
        time_in_3: "",
        time_out_3: "",
        time_in_4: "",
        time_out_4: "",
        total_hours_required: 8,               // 8 hours for Fixed Graduate
        status_id: 1                           // Active status
        , "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded"
    },



];

export const seedCFWTimeLogs: ICFWTimeLogs[] = [
    // {
    //     id: "log_001",                               // Unique log entry ID
    //     record_id: "emp_123",                         // Employee ID (links to schedules)
    //     log_type: "IN",                               // "IN" log type
    //     log_datetime: "2025-04-03 08:00:00",         // Timestamp of the log (YYYY-MM-DD HH:MM:SS)
    //     work_session: 1,                              // First session of the day (1st IN/OUT)
    //     status: "Pending"                             // Status can be "Pending" or "Completed"
    //     , "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded"
    // },
    // {
    //     id: "log_002",
    //     record_id: "emp_123",
    //     log_type: "OUT",
    //     log_datetime: "2025-04-03 12:00:00",
    //     work_session: 1,
    //     total_work_hours: 4,                         // Optional total work hours after OUT log
    //     status: "Completed", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded"
    // },
    // {
    //     id: "log_003",
    //     record_id: "emp_123",
    //     log_type: "IN",
    //     log_datetime: "2025-04-03 13:00:00",
    //     work_session: 2,                              // Second session of the day (2nd IN/OUT)
    //     status: "Pending", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded"
    // },
    // {
    //     id: "log_004",
    //     record_id: "emp_123",
    //     log_type: "OUT",
    //     log_datetime: "2025-04-03 17:00:00",
    //     work_session: 2,
    //     total_work_hours: 4,                         // Optional total work hours after OUT log
    //     status: "Completed", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded"
    // },
    // {
    //     id: "log_005",
    //     record_id: "emp_124",
    //     log_type: "IN",
    //     log_datetime: "2025-04-03 09:00:00",
    //     work_session: 1,
    //     status: "Pending", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded"
    // },
    // {
    //     id: "log_006",
    //     record_id: "emp_124",
    //     log_type: "OUT",
    //     log_datetime: "2025-04-03 12:00:00",
    //     work_session: 1,
    //     total_work_hours: 3,                         // Optional total work hours after OUT log
    //     status: "Completed", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded"
    // },
    // {
    //     id: "log_007",
    //     record_id: "emp_124",
    //     log_type: "IN",
    //     log_datetime: "2025-04-03 13:00:00",
    //     work_session: 2,
    //     status: "Pending", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded"
    // },
    // {
    //     id: "log_008",
    //     record_id: "emp_124",
    //     log_type: "OUT",
    //     log_datetime: "2025-04-03 16:00:00",
    //     work_session: 2,
    //     total_work_hours: 3,                         // Optional total work hours after OUT log
    //     status: "Completed", "created_date": new Date().toISOString(), "created_by": "00000000-0000-0000-0000-000000000000", "last_modified_by": "", "last_modified_date": "", "push_status_id": 2, "push_date": "", "deleted_by": "", "deleted_date": "", "is_deleted": false, "remarks": "Seeded"
    // }
];


export async function seedUserData() {
    try {
        await tblUsers.bulkPut(seedUser);
        await tblUserAccess.bulkPut(seedUserAccess);
        return "User and User Access seeded successfully!!!";
    } catch (error) {
        console.error("Error User seed:", error);
        return [];
    }
}