import { IAttachments } from '@/components/interfaces/general/attachments';
import { IPersonProfile, IPersonProfileCfwFamProgramDetails, IPersonProfileDisability, IPersonProfileFamilyComposition, IPersonProfileSector } from '@/components/interfaces/personprofile';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import axios from 'axios';

const _session = await getSession() as SessionPayload;

class PersonProfileService {
  private apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + 'person_profile/create/';//process.env.NEXT_PUBLIC_API_PIMS_BASE_URL;
  private apiUrlDisabilities = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + 'person_profile_disability/create/'
  private apiUrlSectors = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + 'person_profile_sector/create/'
  private apiUrlFamilyComposition = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + 'person_profile_family_composition/create/'
  private apiUrlProgramDetails = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + 'person_profile_engagement_history/create/'
  // Method to sync data in bulk
  async syncBulkData(formPersonProfile?: IPersonProfile): Promise<{ success: number; failed: number }> {
    try {
      const unsyncedData = await dexieDb.person_profile
        .where("push_status_id")
        .equals(2)
        .toArray();
  
      if (unsyncedData.length === 0) {
        console.log("No data to sync.");
        return { success: 0, failed: 0 };
      }
      
      const results = await Promise.allSettled(
        unsyncedData.map((record) => {

          const formattedDate = new Date(record.created_date).toISOString().split("T")[0];

          const formattedRecord = {
            ...record,
            created_date: formattedDate,
          };

          console.log("Record", JSON.stringify(formattedRecord));
  
          console.log("Syncing record:", formattedRecord);
  
          return axios.post(this.apiUrl, formattedRecord, {
            headers: {
              Authorization: `bearer ${_session.token}`,
              "Content-Type": "application/json",
            },
          });
        })
      );
  
      let success = 0;
      let failed = 0;
  
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const record = unsyncedData[i];
  
        if (result.status === "fulfilled") {
          success++;
          // mark as synced
          await dexieDb.person_profile.update(record.id, { push_status_id: 1 });
        } else {
          failed++;
          console.error("Failed to sync record:", record.id, result.reason);
        }
      }
  
      return { success, failed };
    } catch (error) {
      console.error("Error syncing bulk data:", error);
      throw error;
    }
  }
  
  async syncBulkDisabilities(): Promise<{ success: number; failed: number }> {
    const unsyncedData = await dexieDb.person_profile_disability
    .where("push_status_id")
    .equals(2)
    .toArray();

    try {
      if (unsyncedData.length === 0) {
        console.log("No data to sync.");
        return { success: 0, failed: 0 };
      }
  
      // Format all records
      // Temporarily removed the time from created_date to be accepted from API
      const formattedData = unsyncedData.map((record) => ({
        ...record,
        created_date: new Date(record.created_date).toISOString().split("T")[0],
      }));
  
      console.log("Bulk Syncing Records:", JSON.stringify(formattedData));
  
      // Send in bulk
      const response = await axios.post(this.apiUrlDisabilities, formattedData, {
        headers: {
          Authorization: `bearer ${_session.token}`,
          "Content-Type": "application/json",
        },
      });
  
      // If backend responds with success
      if (response.status === 200 || response.status === 201) {
        // mark all as synced
        const updatePromises = unsyncedData.map((record) =>
          dexieDb.person_profile_disability.update(record.id, { push_status_id: 1 })
        );
        await Promise.all(updatePromises);
  
        return { success: unsyncedData.length, failed: 0 };
      } else {
        console.error("Unexpected response:", response.status, response.data);
        return { success: 0, failed: unsyncedData.length };
      }
    } catch (error) {
      console.error("Error syncing bulk data:", error);
      return { success: 0, failed: unsyncedData.length };
    }
  }
  

  async syncBulkSectors(): Promise<{success: number; failed: number}> {
    const unsyncedData = await dexieDb.person_profile_sector
    .where("push_status_id")
    .equals(2)
    .toArray();

    try{
      if( unsyncedData.length === 0) {
        console.log("No data to sync.");
        return { success: 0, failed: 0 };
      }
      
       // Format all records
      // Temporarily removed the time from created_date to be accepted from API
      const formattedData = unsyncedData.map((record) => ({
        ...record,
        created_date: new Date(record.created_date).toISOString().split("T")[0],
      }));
  
      console.log("Bulk Syncing Records:", JSON.stringify(formattedData));

      const response = await axios.post(this.apiUrlSectors, formattedData, {
        headers: {
          Authorization: `bearer ${_session.token}`,
          "Content-Type": "application/json",
        },
      })

      if(response.status === 200 || response.status === 201){
          const updatePromises = unsyncedData.map((record) => 
          dexieDb.person_profile_sector.update(record.id, {push_status_id: 1})
        );
        await Promise.all(updatePromises);

        return {success: unsyncedData.length, failed: 0};
      }else{
        console.error("Unexpected response:", response.status, response.data);
        return {success: 0, failed:unsyncedData.length};
      }
    }
    catch (error) {
      console.error("Error syncing bulk data:", error);
      return { success: 0, failed: unsyncedData.length };
    }
  }

  async syncBulkFamilyComposition(): Promise<{success: number; failed: number}> {
    const unsyncedData = await dexieDb.person_profile_family_composition
    .where("push_status_id")
    .equals(2)
    .toArray();

    try{
      if( unsyncedData.length === 0) {
        console.log("No data to sync.");
        return { success: 0, failed: 0 };
      }
      
       // Format all records
      // Temporarily removed the time from created_date to be accepted from API
      const formattedData = unsyncedData.map((record) => ({
        ...record,
        created_date: new Date(record.created_date).toISOString().split("T")[0],
      }));
  
      console.log("Bulk Syncing Records:", JSON.stringify(formattedData));

      const response = await axios.post(this.apiUrlFamilyComposition, formattedData, {
        headers: {
          Authorization: `bearer ${_session.token}`,
          "Content-Type": "application/json",
        },
      })

      if(response.status === 200 || response.status === 201){
          const updatePromises = unsyncedData.map((record) => 
          dexieDb.person_profile_family_composition.update(record.id, {push_status_id: 1})
        );
        await Promise.all(updatePromises);

        return {success: unsyncedData.length, failed: 0};
      }else{
        console.error("Unexpected response:", response.status, response.data);
        return {success: 0, failed:unsyncedData.length};
      }
    }
    catch (error) {
      console.error("Error syncing bulk data:", error);
      return { success: 0, failed: unsyncedData.length };
    }
  }

  async syncBulkProgramDetails(): Promise<{success: number; failed: number}> {
    debugger;
    const unsyncedData = await dexieDb.person_profile_cfw_fam_program_details
    .where("push_status_id")
    .equals(2)
    .toArray();

    try{
      if( unsyncedData.length === 0) {
        console.log("No data to sync.");
        return { success: 0, failed: 0 };
      }
      
       // Format all records
      // Temporarily removed the time from created_date to be accepted from API
      const formattedData = unsyncedData.map((record) => ({
        ...record,
        created_date: new Date(record.created_date).toISOString().split("T")[0],
      }));
  
      console.log("Bulk Syncing Records:", JSON.stringify(formattedData));

      const response = await axios.post(this.apiUrlProgramDetails, formattedData, {
        headers: {
          Authorization: `bearer ${_session.token}`,
          "Content-Type": "application/json",
        },
      })

      if(response.status === 200 || response.status === 201){
          const updatePromises = unsyncedData.map((record) => 
          dexieDb.person_profile_cfw_fam_program_details.update(record.id, {push_status_id: 1})
        );
        await Promise.all(updatePromises);

        return {success: unsyncedData.length, failed: 0};
      }else{
        console.error("Unexpected response:", response.status, response.data);
        return {success: 0, failed:unsyncedData.length};
      }
    }
    catch (error) {
      console.error("Error syncing bulk data:", error);
      return { success: 0, failed: unsyncedData.length };
    }
  }
}



export default new PersonProfileService();
