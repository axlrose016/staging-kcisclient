import { cache } from "react";

const api_base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchUserLogin = cache(async () => {
    const response = await fetch(api_base_url + "/api/modules/");
    if (!response.ok) {
        throw new Error("Failed to fetch modules");
    }
    return await response.json();
});
