import { IUser, IUserAccess } from "@/components/interfaces/iuser";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { libDb } from "@/db/offline/Dexie/databases/libraryDb";
import { softDelete } from "@/db/utils/softDelete";
import { getSession } from "@/lib/sessions-client";
import { cleanArray } from "@/lib/utils";
import { SessionPayload } from "@/types/globals";
import axios from 'axios';
import Dexie from "dexie";

const _session = await getSession() as SessionPayload;
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS;

export class SettingsService {
    
    async getOfflineUsers(): Promise<IUser[]>{
        try{
            const roleList = await libDb.roles.toArray();
            const roleMap = new Map(roleList.map(r => [r.id, r.role_description || ""]));

            const levelList = await libDb.lib_level.toArray();
            const levelMap = new Map(levelList.map(l => [l.id, l.level_description || ""]));

            const userList = await dexieDb.transaction('r', [dexieDb.users],
                async () => {
                    return await dexieDb.users.filter(f => f.is_deleted !== true).toArray();
                }
            );

            const result = userList.map(ul => ({
                ...ul,
                role_description: roleMap.get(ul.role_id),
                level_description: levelMap.get(ul.level_id ?? 0)
            }))

            return result;
        }catch(error){
            console.error('Fetch Record Failed: ', error);
            return [];
        }
    }
    
    async syncDownloadUsers(): Promise<IUser[] | undefined> {
        try {
        const user_response = await axios.get<IUser[]>(apiUrl+'/auth_users/view/', {
            headers: {
            'Authorization': `bearer ${_session.token}`,
            'Content-Type': 'application/json',
            },
        });
        
        const access_response = await axios.get<IUserAccess[]>(apiUrl+'/auth_user_access/view/', {
              headers: {
            'Authorization': `bearer ${_session.token}`,
            'Content-Type': 'application/json',
            },
        })

        const user_data = user_response.data;
        const access_data = access_response.data;

        // Bulk insert into Dexie
        await dexieDb.transaction('rw',[dexieDb.users, dexieDb.useraccess],
            async () => {
                await dexieDb.users.bulkPut(user_data);
                await dexieDb.useraccess.bulkPut(access_data);
            }
        )

        console.log('Auth users synced to Dexie:', user_data.length);
        return user_data;
        } catch (error) {
        console.error('Failed to sync auth users to Dexie:', error);
        return undefined;
        }
    }

    async syncBulkUserData(): Promise<boolean | false> {
    const unsynchedData = await dexieDb.users
        .where("push_status_id")
        .equals(2)
        .toArray();

        const unsynchedAccessData = await dexieDb.useraccess
        .where("push_status_id")
        .equals(2)
        .toArray();

        if (unsynchedData.length === 0 && unsynchedAccessData.length === 0) {
        return false; // No data to sync
        }

        try {
        const headers = {
            "Authorization": `bearer ${_session.token}`,
            "Content-Type": "application/json",
        };

        debugger;
        const x = JSON.stringify(cleanArray(unsynchedData));
        const [userResponse] = await Promise.all([
            unsynchedData.length > 0
            ? axios.post(`${apiUrl}auth_users/update/user_bulk/`, cleanArray(unsynchedData), { headers })
            : Promise.resolve({ status: 200 }),
            unsynchedAccessData.length > 0
            ? axios.post(`${apiUrl}auth_user_access/update/bulk/`,cleanArray(unsynchedAccessData) , { headers })
            : Promise.resolve({ status: 200 }),
        ]);

        if (userResponse.status === 200) {
            const today = new Date().toISOString().split("T")[0];

            await dexieDb.transaction('rw', [dexieDb.users, dexieDb.useraccess], async (trans) => {
            trans.meta = {
                needsAudit: true,
            };

            await Promise.all([
                ...unsynchedData.map((record) =>
                dexieDb.users.update(record.id, {
                    push_status_id: 1,
                    push_date: today,
                })
                ),
                ...unsynchedAccessData.map((record) =>
                dexieDb.useraccess.update(record.id, {
                    push_status_id: 1,
                    push_date: today,
                })
                ),
            ]);
        });
        }

        return true;
        } catch (error) {
        console.error("Sync error:", error);
        return false;
        }
    }

    async deleteData(db: Dexie,tableName: string,row: any, child?: any): Promise<boolean> {
        return await softDelete(db, tableName, row, child);
    }
}
