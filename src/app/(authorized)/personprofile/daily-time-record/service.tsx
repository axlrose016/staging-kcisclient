import { ICFWTimeLogs } from "@/components/interfaces/iuser";
import { IPersonProfile } from "@/components/interfaces/personprofile";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS;

export class DTRService {

  async syncDLTimeLogs(url: string, filter?: any): Promise<ICFWTimeLogs[] | undefined> {
    try {
      const session = await getSession() as SessionPayload

      const headers = {
        'Authorization': `bearer ${session.token}`,
        'Content-Type': 'application/json',
      };

      const dtr = filter
        ? await axios.post<ICFWTimeLogs[]>(apiUrl + url, filter, { headers })
        : await axios.get<ICFWTimeLogs[]>(apiUrl + url, { headers });

      const data = dtr.data;
      await dexieDb.transaction('rw', [dexieDb.cfwtimelogs],
        async () => {
          await dexieDb.cfwtimelogs.bulkPut(data);
        }
      )

      console.log(`data synced to Dexie > ${url} :`, data.length);
      return data;
    } catch (error) {
      console.error('Failed to sync auth users to Dexie:', error);
      return undefined;
    }
  }

  async syncDLProfile(url: string, filter?: any): Promise<IPersonProfile[] | undefined> {
    try {
      const session = await getSession() as SessionPayload
      const headers = {
        'Authorization': `bearer ${session.token}`,
        'Content-Type': 'application/json',
      };
      const dr = filter
        ? await axios.post<IPersonProfile[]>(apiUrl + url, filter, { headers })
        : await axios.get<IPersonProfile[]>(apiUrl + url, { headers });

      const data = dr.data;
      await dexieDb.transaction('rw', [dexieDb.person_profile],
        async () => {
          await dexieDb.person_profile.bulkPut(data);
        }
      )

      console.log(`data synced to Dexie > ${url} :`, data.length);
      return data;
    } catch (error) {
      console.error('Failed to sync auth users to Dexie:', error);
      return undefined;
    }
  }

}
