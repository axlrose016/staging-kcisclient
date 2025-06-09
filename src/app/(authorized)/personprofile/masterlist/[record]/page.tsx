"use client";
import { FormTabs } from "@/components/forms/form-tabs"
import Person_profile from "./person_profile"
import React, { useEffect, useState } from "react"
import Assessment from "./assessment";
import WorkshiftAssignment from "./workshift_assignment";
import WorkPlan from "./work_plan";
import PersonProfileForm from "../../form/page";
import { usePathname } from 'next/navigation';
function newAbortSignal(timeoutMs: number) {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs || 0);
    return abortController.signal;
}
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import axios from 'axios';
import LoginService from "@/app/login/LoginService";
import { IPersonProfile, IPersonProfileCfwFamProgramDetails, IPersonProfileFamilyComposition, IPersonProfileSector } from "@/components/interfaces/personprofile";

import { ILibSectors } from "@/components/interfaces/library-interface";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { IAttachments } from "@/components/interfaces/general/attachments";
import SectorDetails from "../../form/sectors";
import FamilyComposition from "../../form/family_composition";
import Attachments from "../../form/attachments";
export default function person_profile() {
    const [profiles, setProfiles] = useState<IPersonProfile[]>([]);
    const [profilesSector, setProfilesSector] = useState<IPersonProfileSector[]>([]);
    const [profilesFamCom, setProfilesFamCom] = useState<IPersonProfileFamilyComposition[]>([]);
    const [profilesAttachments, setProfilesAttachments] = useState<IAttachments[]>([]);
    const [profilesCfwFamProgramDetails, setProfileCfwFamProgramDetails] = useState<IPersonProfileCfwFamProgramDetails[]>([]);
    
    // const [sectors, setSectors] = useState<ILibSectors[]>([]);
    const [activeTab, setActiveTab] = React.useState("person_profile");
    const pathname = usePathname(); // e.g. "/personprofile/masterlist/8a892894-9570-43db-8edd-6008761318a2"
    const segments = pathname ? pathname.split('/') : [];
    const id = segments[segments.length - 1];
    // const [loading, setLoading] = useState(true);
   

    // useEffect(() => {
    //     const urlstring = "https://kcnfms.dswd.gov.ph/api/person_profile/view/" + id;
    //     async function loadProfiles() {
    //         try {
             
    //             const fetchData = async (endpoint: string) => {

                  

    //                 const signal = newAbortSignal(5000);
    //                 try {
    //                     debugger;
    //                     const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");
    //                     const response = await fetch(endpoint, {

    //                         method: "GET",
    //                         headers: {
    //                             Authorization: `bearer ${onlinePayload.token}`,
    //                             "Content-Type": "application/json",
    //                         },
    //                     });
                       
    //                     if (!response.ok) {
    //                         console.log("Person profile > view > error ", response);

    //                     } else {
    //                         debugger;
    //                         const data = await response.json();
    //                         console.log("Person profile > view > success ", data)
    //                         setProfiles(data);
    //                         console.log("Last Name: ", data.last_name)

    //                         // save to dexiedb
    //                         dexieDb.open();
    //                         dexieDb.transaction('rw', [dexieDb.person_profile], async () => {
    //                             try {
    //                                 const existingRecord = await dexieDb.person_profile.get(data.id);
    //                                 if (existingRecord) {
    //                                     await dexieDb.person_profile.update(data.id, data);
    //                                     console.log("Record updated in DexieDB:", data.id);
    //                                 } else {
    //                                     await dexieDb.person_profile.add(data);
    //                                     console.log("New record added to DexieDB:", data.id);
    //                                 }
    //                             } catch (error) {
    //                                 console.log("Error saving to DexieDB:", error);
    //                             }
    //                         });
                            
    //                     }
                       

    //                 } catch (error: any) {
    //                     console.log("Error fetching data:", error);
    //                     if (error.name === "AbortError") {
    //                         console.log("Request canceled", error.message);
    //                         alert("Request canceled" + error.message);
    //                     } else {
    //                         console.error("Error fetching data:", error);
    //                         alert("Error fetching data:" + error);
    //                     }
    //                 }
    //             }
    //             fetchData(urlstring);
    //         } catch (error: any) {
    //             console.error(error);
    //         }
    //     }
    //     loadProfiles();
    // },[])
   

    return (

        <div className="p-3 col-span-full">
        
            {/* <p>ID From URL: http://10.10.10.162:9000/api/person_profiles/view/{id}</p> */}
            {/* <p>ID: {id}</p> */}
            {/* alert(`ID: ${id}`) */}
            {/* <p>Viewing of person profile by id {id}</p> */}
            <PersonProfileForm user_id_viewing={id} />
            {/* <SectorDetails errors={null} capturedData={null} user_id_viewing={id} />
            <FamilyComposition user_id_viewing={id} />
            <Attachments user_id_viewing={id} /> */}

            {/* <div className="flex items-center space-x-4 p-4 bg-card rounded-lg">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0">
           
                    <img 
                        src="/path/to/image.jpg"
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-lg font-semibold">John Doe</h2>
                    <p className="text-sm text-gray-600">Email: john.doe@example.com</p>
                    <p className="text-sm text-gray-600">Phone: +123456789</p>
                    <p className="text-sm text-gray-600">Address: 123 Main St, City, Country</p>
                </div>
            </div> */}

            {/* <FormTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} /> */}
            {/* <FormTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className={formData.modality_id !== undefined ? "" : "hidden"} /> */}
        </div>


    )

}