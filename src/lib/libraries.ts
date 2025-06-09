const api_base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getLibrary(api_url : string, library_name? : string, params? : string){
    let url = api_base_url + api_url;
    if(params != undefined){
        url = url + params;
    }
    const response = await fetch(url);
    if(!response.ok){
        throw new Error("Failed to fetch "+ library_name);
    }
    return await response.json();
}

export async function getPIMSLibrary(api_url : string, library_name? : string, params? : string){
    let url = "https://ncddpdb.dswd.gov.ph/" + api_url;
    if(params != undefined){
        url = url + params;
    }
    const response = await fetch(url);
    if(!response.ok){
        throw new Error("Failed to fetch "+ library_name);
    }
    return await response.json();
}

