import { ICFWTimeLogs } from "@/components/interfaces/iuser";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS;

export class DTRService {

  async syncDownload(filter?: any): Promise<ICFWTimeLogs[] | undefined> {
    try {
      const session = await getSession() as SessionPayload
      const dtr = await axios.post<ICFWTimeLogs[]>(apiUrl + '/cfwtimelogs/view/multiple/', filter, {
        headers: {
          'Authorization': `bearer ${session.token}`,
          'Content-Type': 'application/json',
        }, 
      })
      const data = dtr.data;
      await dexieDb.transaction('rw', [dexieDb.cfwtimelogs],
        async () => {
          await dexieDb.cfwtimelogs.bulkPut(data);
        }
      )

      console.log('data synced to Dexie:', data.length);
      return data;
    } catch (error) {
      console.error('Failed to sync auth users to Dexie:', error);
      return undefined;
    }
  }


}
