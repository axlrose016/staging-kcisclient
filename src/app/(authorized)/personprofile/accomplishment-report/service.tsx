import { ICFWTimeLogs } from "@/components/interfaces/iuser";
import { IAccomplishmentReport, IPersonProfile } from "@/components/interfaces/personprofile";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import axios from 'axios';
import { cloneDeep } from "lodash";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS;

export class ARService {


  async syncDLARs(url: string, filter?: any): Promise<IAccomplishmentReport[] | undefined> {
    try {
      const session = await getSession() as SessionPayload

      const headers = {
        'Authorization': `bearer ${session.token}`,
        'Content-Type': 'application/json',
      };

      const dtr = filter
        ? await axios.post<IAccomplishmentReport[]>(apiUrl + url, filter, { headers })
        : await axios.get<IAccomplishmentReport[]>(apiUrl + url, { headers });

      const data = dtr.data;

      for (const item of data) {
        const p = cloneDeep(item) as any
        if (p.accomplishment_report_task && p.accomplishment_report_task.length > 0) {
          await dexieDb.accomplishment_actual_task.bulkPut(p.accomplishment_report_task)
        }
        delete p.accomplishment_report_task
        await dexieDb.accomplishment_report.put(p)
      }

      console.log('syncDLARs > data', data)
      // await dexieDb.transaction('rw', [dexieDb.accomplishment_report],
      //   async () => {
      //     await dexieDb.accomplishment_report.bulkPut(data);
      //   }
      // )

      console.log(`data synced to Dexie > ${url} :`, data.length);
      return data;
    } catch (error) {
      console.error('Failed to sync auth users to Dexie:', error);
      return undefined;
    }
  }


  async syncDLWorkplan(url: string, filter?: any): Promise<any> {
    try {
      const session = await getSession() as SessionPayload
      const headers = {
        'Authorization': `bearer ${session.token}`,
        'Content-Type': 'application/json',
      };
      const dr = filter
        ? await axios.post<any[]>(apiUrl + url, filter, { headers })
        : await axios.get<any[]>(apiUrl + url, { headers });

      const data = dr.data;
      (data || []).forEach(element => {
        (async () => {
          const p = cloneDeep(element) as any
          console.log('syncDLWorkplan > p', p)
          console.log('syncDLWorkplan > work_plan > p', p.work_plan)
          await dexieDb.work_plan.bulkPut(p.work_plan)
          console.log('syncDLWorkplan > work_plan_tasks > p', p.work_plan_task)
          await dexieDb.work_plan_tasks.bulkPut(p.work_plan_task)

          if (p.alternate_supervisor != null) {
            await dexieDb.person_profile.put(p.alternate_supervisor)
          }
          if (p.immediate_supervisor != null) {
            await dexieDb.person_profile.put(p.immediate_supervisor)
          }

          delete p.work_plan
          delete p.work_plan_task
          delete p.immediate_supervisor
          delete p.alternate_supervisor

          await dexieDb.cfwassessment.put(p)

        })()
      });

      console.log(`data synced to Dexie > ${url} :`, data.length);
      return data;
    } catch (error) {
      console.error('Failed to sync auth users to Dexie:', error);
      return undefined;
    }
  }


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
