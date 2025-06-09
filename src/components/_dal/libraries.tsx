"use client";

import { cache } from "react";
import { modules, permissions, roles } from "@/db/schema/libraries";
const api_base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
const api_pims_base_url = process.env.NEXT_PUBLIC_API_PIMS_BASE_URL;

const fetchOfflineLibrary = cache(async (endpoint: string, errorMessage: string, offline_table: any = null) => {
    try {
        const response = await fetch(api_base_url + endpoint);
        if (!response.ok) {
            if (offline_table) {
                //const offlineData = await sqliteDb.select().from(offline_table).all();
                //return offlineData;
            } else {
                throw new Error(errorMessage);
            }
        }
        return await response.json();
    } catch (error) {
        if (offline_table) {
            //const offlineData = await sqliteDb.select().from(offline_table).all();
            //return offlineData;
        } else {
            throw new Error(errorMessage);
        }
    }
});
const fetchData = cache(async (endpoint: string, errorMessage: string, offline_table: any = null) => {
    try {
        const response = await fetch(api_base_url + endpoint);
        if (!response.ok) {
            if (offline_table) {
                //const offlineData = await db.select().from(offline_table).all();
                //return offlineData; 
            } else {
                throw new Error(errorMessage);
            }
        }
        return await response.json();
    } catch (error) {
        if (offline_table) {
            //const offlineData = await db.select().from(offline_table).all();
            //return offlineData;
        }
        throw new Error(errorMessage);
    }
});
const fetchPIMSData = cache(async (endpoint: string, errorMessage: string, offline_table: any = null) => {
    try {
        const username = "dsentico@dswd.gov.ph";
        const password = "Dswd@123";
        const credentials = btoa(`${username}:${password}`); // Encode to Base64
        const burl = api_pims_base_url;
        console.log("The base api pims base url is " + api_pims_base_url);
        const response = await fetch(api_pims_base_url + endpoint, {
            method: "GET", // Or "POST", "PUT", etc.
            headers: {
                "Authorization": `Basic ${credentials}`, // Add Basic Auth header
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            console.log("goods!");
            // if (offline_table) {
            //     const offlineData = await db.select().from(offline_table).all();
            //     return offlineData; 
            // } else {
            //     throw new Error(errorMessage);
            // }
        }
        return await response.json();
    } catch (error) {
        // if (offline_table) {
        //     const offlineData = await db.select().from(offline_table).all();
        //     return offlineData;
        // }
        throw new Error(errorMessage);
    }
});
const createFetchFunction = (endpoint: string, errorMessage: string, offline_table?: any) => {
    return async () => fetchData(endpoint, errorMessage, offline_table);
};
const createFetchFunctionPIMS = (endpoint: string, errorMessage: string, offline_table?: any) => {

    return async () => fetchPIMSData(endpoint, errorMessage, offline_table);
};
const createFetchOfflineLibrary = (endpoint: string, errorMessage: string, offline_table?: any) => {
    return async () => fetchOfflineLibrary(endpoint, errorMessage, offline_table);
}

export const fetchModules = createFetchFunction("/api/modules/", "Failed to fetch modules", modules);
export const fetchPermissions = createFetchFunction("/api/permissions/", "Failed to fetch permissions", permissions);
export const fetchRoles = createFetchFunction("/api/roles/", "Failed to fetch roles", roles);
export const fetchLibAncestralDomain = createFetchFunction("/api/lib_ancestral_domain/", "Failed to fetch Library: Ancestral Domain");
export const fetchLibCity = createFetchFunction("/api/lib_city/", "Failed to fetch Library: City");
export const fetchLibCivilStatus = createFetchFunction("/api/lib_civil_status/", "Failed to fetch Library: Civil Status");
export const fetchLibEducationalAttainment = createFetchFunction("/api/lib_educational_attainment/", "Failed to fetch Library: Educational Attainment");
export const fetchLibFundSource = createFetchFunction("/api/lib_fund_source/", "Failed to fetch Library: Fund Source");
export const fetchLibLguLevel = createFetchFunction("/api/lib_lgu_level/", "Failed to fetch Library: Lgu Level");
export const fetchLibLguPosition = createFetchFunction("/api/lib_lgu_position/", "Failed to fetch Library: Lgu Position");
export const fetchLibMode = createFetchFunction("/api/lib_mode/", "Failed to fetch Library: Mode");
export const fetchLibOccupation = createFetchFunction("/api/lib_occupation/", "Failed to fetch Library: Occupation");
export const fetchLibProvince = createFetchFunction("/api/lib_province/", "Failed to fetch Library: Province");
export const fetchLibRegion = createFetchFunction("/api/lib_region/", "Failed to fetch Library: Region");
export const fetchLibSex = createFetchFunction("/api/lib_sex/", "Failed to fetch Library: Sex");
export const fetchLibAncestralDomainCoverage = createFetchFunction("/api/lib_ancestral_domain_coverage/", "Failed to fetch Library: Ancestral Domain Coverage");
export const fetchLibBarangay = createFetchFunction("/api/lib_brgy/", "Failed to fetch Library: Barangay");
export const fetchLibCycle = createFetchFunction("/api/lib_cycle/", "Failed to fetch Library: Cycle");
export const fetchOfflineRoles = createFetchOfflineLibrary("/api/roles/", "Failed to fetch Offline Data: Roles", roles);
export const fetchOfflineModules = createFetchOfflineLibrary("/api/modules/", "Failed to fetch Offline Data: Modules", modules);
export const fetchOfflinePermissions = createFetchOfflineLibrary("/api/permissions/", "Failed to fetch Offline Data: Permissions", permissions);
export const fetchPIMS = createFetchFunctionPIMS("/api/v2/intervention_library/get_lib_region", "Failed to fetch PIMS Data");
export const fetchPIMSProvince = createFetchFunctionPIMS("/api/online/lib_province/open_access?id=010000000", "Failed to fetch PIMS Region Data");
export const fetchPIMSCity = createFetchFunctionPIMS("/api/online/lib_city/open_access?id=012800000", "Failed to fetch PIMS Municipality Data");
export const fetchPIMSBrgy = createFetchFunctionPIMS("/api/online/lib_brgy/open_access?id=012801000", "Failed to fetch PIMS Barangay Data");
export const fetchPIMSIPGroup = createFetchFunctionPIMS("api/lib_ip_group", "Failed to fetch PIMS Data IP Group");