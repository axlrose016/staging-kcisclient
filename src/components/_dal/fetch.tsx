import { db } from "@/db";
import { eq } from "drizzle-orm";
import { cache } from "react";
const api_base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetchData = cache(async (endpoint: string, errorMessage: string, offline_table: any = null) => {
    try {
        const response = await fetch(api_base_url + endpoint);
        if (!response.ok) { 
            if (offline_table) {
                const offlineData = await db.select().from(offline_table).all();
                return offlineData; 
            } else {
                throw new Error(errorMessage);
            }
        }
        return await response.json();
    } catch (error) {
        if (offline_table) {
            const offlineData = await db.select().from(offline_table).all();
            return offlineData;
        }
        throw new Error(errorMessage); 
    }
});

const fetchDataById = cache(async(endpoint: string, errorMessage: string, record_id: any, matching_id: any, offline_table: any = null) => {
    try{
        const response = await fetch(api_base_url + endpoint);
        if(!response.ok){
            if(offline_table){
                const offlineData = (await db.select().from(offline_table).where(eq(offline_table[matching_id], record_id)))
                return offlineData;
            } else {
                throw new Error(errorMessage);
            }
        }
        return await response.json();
    }catch(error){
        if(offline_table){
            const offlineData = (await db.select().from(offline_table).where(eq(offline_table[matching_id], record_id)))
            return offlineData;
        }
        throw new Error(errorMessage);
    }
})

export const createFetchFunction = (endpoint: string, errorMessage: string, offline_table?: any) => {
    return async () => fetchData(endpoint, errorMessage, offline_table);
};

export const createFetchFunctionWithExpression = (endpoint: string, errorMessage: string, offline_table?: any) => {
    return async (record_id: any, matching_id: any) => fetchDataById(endpoint, errorMessage, record_id, matching_id, offline_table);
}