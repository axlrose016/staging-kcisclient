// hooks/useFetchAndSyncProfile.ts
import { useEffect, useState } from 'react';
import { dexieDb } from '../db/offline/Dexie/databases/dexieDb'; // adjust the relative path as necessary
// import { dexieDb } from '@/lib/db'; // make sure your dexieDb is exported from here
import { IPersonProfile, IPersonProfileSector, IPersonProfileFamilyComposition } from '../components/interfaces/personprofile'; // adjust the relative path as necessary
import { IAttachments } from '../components/interfaces/general/attachments'; // adjust the relative path as necessary
// import { IAttachment } from '../components/interfaces/attachments'; // adjust the relative path as necessary

interface UseProfileData {
    profile: IPersonProfile | null;
    sectors: IPersonProfileSector[];
    family: IPersonProfileFamilyComposition[];
    attachments: IAttachments[];
    loading: boolean;
    error: string | null;
}
// import { getSession } from '@/lib/sessions-client';
// import { SessionPayload } from '@/types/globals';
// import axios from 'axios';
import LoginService from "../components/services/LoginService"; // Adjusted the relative path
export function useFetchAndSyncProfile(userId: string): UseProfileData {
    const [profile, setProfile] = useState<IPersonProfile | null>(null);
    const [sectors, setSectors] = useState<IPersonProfileSector[]>([]);
    const [family, setFamily] = useState<IPersonProfileFamilyComposition[]>([]);
    const [attachments, setAttachments] = useState<IAttachments[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAndSync = async () => {
            try {
                debugger;
                setLoading(true);
                setError(null);
                const urlFetchData = process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "person_profile/view/" + userId + "/";
                // const urlFetchData = "http://10.10.10.162:9000/api/person_profile/view/" + userId;
                const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");
                // alert("Token: " + onlinePayload.token)
                const response = await fetch(urlFetchData, {

                    method: "POST",
                    headers: {
                        Authorization: `bearer ${onlinePayload.token}`,
                        "Content-Type": "application/json",
                    },
                });
                const res = await fetch(urlFetchData);
                if (!res.ok) throw new Error('Failed to fetch profile from API');

                const data = await res.json();
                // return;

                await dexieDb.transaction('rw', [
                    dexieDb.person_profile,
                    // dexieDb.person_profile_sector,
                    // dexieDb.person_profile_family_composition,
                    // dexieDb.attachments
                ], async () => {
                    await dexieDb.person_profile.put(data.data.profile);
                    // await dexieDb.person_profile_sector.bulkPut(data.sectors);
                    // await dexieDb.person_profile_family_composition.bulkPut(data.family);
                    // await dexieDb.attachments.bulkPut(data.attachments);
                });

                setProfile(data.profile);
                // setSectors(data.sectors);
                // setFamily(data.family);
                // setAttachments(data.attachments);
            } catch (e: any) {
                setError(e.message);

                // fallback to Dexie if available
                const fallbackProfile = await dexieDb.person_profile.where('user_id').equals(userId).first();
                const fallbackSectors = await dexieDb.person_profile_sector.where('person_profile_id').equals(fallbackProfile?.id ?? '').toArray();
                const fallbackFamily = await dexieDb.person_profile_family_composition.where('person_profile_id').equals(fallbackProfile?.id ?? '').toArray();
                const fallbackAttachments = await dexieDb.attachments.where('record_id').equals(fallbackProfile?.id ?? '').toArray();

                setProfile(fallbackProfile || null);
                setSectors(fallbackSectors);
                setFamily(fallbackFamily);
                setAttachments(fallbackAttachments);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchAndSync();
    }, [userId]);

    return {
        profile,
        sectors,
        family,
        attachments,
        loading,
        error
    };
}
