"use client"; // Needed for Next.js App Router (Client Component)
import { PDFDocument, rgb, degrees } from "pdf-lib";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";  // Import your Dexie instance
import { use, useState } from "react";
import { getOfflineCivilStatusLibraryOptions, getOfflineExtensionLibraryOptions, getOfflineLibCFWType, getOfflineLibCourses, getOfflineLibEducationalAttainment, getOfflineLibIdCard, getOfflineLibProgramTypes, getOfflineLibRelationshipToBeneficiary,getOfflineLibSchools, getOfflineLibSectorsLibraryOptions, getOfflineLibSexOptions, getOfflineLibTypeOfDisability, getOfflineLibTypeOfWork, getOfflineLibYearServed } from "../_dal/offline-options";
import { IPersonProfile } from "../interfaces/personprofile";
import { Button } from "../ui/button";
import person_profile from "@/app/personprofile/masterlist/[record]/page";
const GeneratePDF = () => {
  const [extensionNames, setExtensionNames] = useState<Record<number, string>>({});
  const [schoolNames, setSchoolNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [isGenerated, setGenerated] = useState(false);
  const [profile, setProfile] = useState<IPersonProfile | null>(null);
  const reg = useState(false);

    const KeyToken = process.env.NEXT_PUBLIC_DXCLOUD_KEY;
    const cache: Record<string, any> = {};
    const [options, setOptions] = useState<Options>({ regions: [], provinces: [], municipalities: [], barangays: [] });
    
    interface Location {
      label: any;
      id: any,
      name: string
    }

    interface Options {
      regions: Location[];
      provinces: Location[];
      municipalities: Location[];
      barangays: Location[];
    }
    
    function newAbortSignal(timeoutMs: number) {
      const abortController = new AbortController();
      setTimeout(() => abortController.abort(), timeoutMs || 0);
      return abortController.signal;
    }
    
    const fetchData = async (key: string, endpoint: string,updateOptions: (data: any) => void): Promise<any> => {
      if (cache[key]) {
        return cache[key]; // Return cached data
      }
    
      try {
        const response = await fetch(endpoint, {
          // signal,
          headers: {
              Authorization: `Bearer ${KeyToken}`,
              "Content-Type": "application/json",
          }
        });
        if (!response.ok) throw new Error("Failed to fetch data");
    
        const data = await response.json();
        console.log("PSGC" + endpoint, data);
        cache[key] = data; // Cache the result
        return data;
      } catch (error) {
        console.error(`Error fetching ${key}:`, error);
        return null;
      }
      
    };


  const generatePdf = async () => {
    setGenerated(true);
    setLoading(true);
    
try {
        // Fetch data from Dexie.js
        const personProfile = await dexieDb.person_profile.toArray();
        const firstProfile = personProfile[0]; // Use the first record for this example
        // person profile sector
        const person_profile_sectors = await dexieDb.person_profile_sector.toArray();
        const person_prosect = [];
        for (let i = 0; i < person_profile_sectors.length; i++){
          person_prosect[i] = person_profile_sectors[i];
        }

        //Partisipasyon sa CFWF
        const cfw_fam_program = await dexieDb.person_profile_cfw_fam_program_details.toArray();
        const cfw_fam1 = cfw_fam_program[0];
        const cfw_fam2 = cfw_fam_program[1];
        const cfw_fam3 = cfw_fam_program[2];
        
        //Family member relationship
        const family_relation = await dexieDb.person_profile_family_composition.toArray();
        const family_relationProfile1 = family_relation[0];
        const family_relationProfile2 = family_relation[1];
        const family_relationProfile3 = family_relation[2];
        const family_relationProfile4 = family_relation[3];
        const family_relationProfile5 = family_relation[4];
        const family_relationProfile6 = family_relation[5];
        const family_relationProfile7 = family_relation[6];
        const family_relationProfile8 = family_relation[7];
        const family_relationProfile9 = family_relation[8];
        const family_relationProfile10 = family_relation[9];


        //with disability
        const pwd_person_profile = await dexieDb.person_profile_disability.toArray();
        const pwd = [];
        for (let i = 0; i < pwd_person_profile.length; i++){
          pwd[i] = pwd_person_profile[i]
        }

        // const pwd_profile1 = pwd__person_profile[0];
        // const pwd_profile2 = pwd__person_profile[0];
        // const pwd_profile3 = pwd__person_profile[0];
        // const pwd_profile4 = pwd__person_profile[0];


    

        console.log(firstProfile);
        if (!firstProfile) {
          alert("No profile data found!");
          setLoading(false);
          return;
        }

        // setProfile(personProfile[0]);
        //debugger;



  //--------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------
  const region_list = await fetchData("region", "/api-libs/psgc/regions", (data) => {
    if (data?.status) {
        const filteredRegions = data.data
            .map((item: any) => ({
                id: item.code,
                name: item.name
            }));

        //console.log("Filtered Regions:", filteredRegions);

        // ✅ Update state with filtered regions
        setOptions((prev) => ({ ...prev, regions: filteredRegions }));

        // Assign filtered regions for returning
        return filteredRegions
    } else {
        console.error("No data found or invalid response.");
    }
  });

  if (region_list?.data) {
    const filteredRegion = region_list.data.filter((w: any) => w.code === firstProfile?.region_code);
    // console.log("REGION:", filteredRegion[0].name);
  } else {
      console.error("No data found or invalid response.");
  }
          
//--------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------

var profileProvince;
const province_list = await fetchData(`provinces-${firstProfile.province_code}`, `/api-libs/psgc/provincesByRegion?region=${firstProfile.region_code}`, (data) => {
  if (data?.status) {
    const filteredProvinces = data.data
        .map((item: any) => ({
            id: item.code,
            name: item.name
        }));

    //console.log("Filtered Provinces:", filteredProvinces);

    // ✅ Update state with filtered province
    setOptions((prev) => ({ ...prev, provinces: filteredProvinces }));

    // Assign filtered province for returning
    return filteredProvinces
} else {
    console.error("No data found or invalid response.");
}
});

if (province_list?.data) {
  const filteredProvince = province_list.data.provinces.filter((w: any) => w.code === firstProfile?.province_code);
 // console.log("Province:", filteredProvince[0].name);
  profileProvince = filteredProvince[0].name;
} else {
    console.error("No data found or invalid response.");
}

  var profileCity;
  const city_list = await fetchData(`muni-${firstProfile.city_code}`, `/api-libs/psgc/municipalityByProvince?province=${firstProfile.province_code}`, (data) => {
  if (data?.status) {
      const filteredCities = data.data
          .map((item: any) => ({
              id: item.code,
              name: item.name
          }));

      //console.log("Filtered city:", filteredCities);

      // ✅ Update state with filtered regions
      setOptions((prev) => ({ ...prev, municipalities: filteredCities }));

      // Assign filtered province for returning
      return filteredCities
    
  } else {
      console.error("No data found or invalid response.");
  }
  });

  if (city_list?.data) {
    const filteredCity = city_list.data.municipalities.filter((w: any) => w.code === firstProfile?.city_code);
   // console.log("City:", filteredCity[0].name);
    profileCity = filteredCity[0].name;
  } else {
      console.error("No data found or invalid response.");
  }

var profileBrgy;
const brgy_list = await fetchData(`barangays-${firstProfile?.brgy_code}`, `/api-libs/psgc/barangayByMunicipality?municipality=${firstProfile?.city_code}`, (data) => {
if (data?.status) {
    const filteredBrgys = data.data
        .map((item: any) => ({
            id: item.code,
            name: item.name
        }));
        debugger;
    //console.log("Filtered Brgy:", filteredBrgys);

    // ✅ Update state with filtered regions
    setOptions((prev) => ({ ...prev, barangays: filteredBrgys }));

    // Assign filtered province for returning
    return filteredBrgys
  
} else {
    console.error("No data found or invalid response.");
}
});


if (brgy_list?.data) {
 const filteredCity = brgy_list.data.barangay.filter((w: any) => w.code === firstProfile.brgy_code);
 //console.log("barangay:", filteredCity[0].name);
 profileBrgy = filteredCity[0].name;
} else {
    console.error("No data found or invalid response.");
}

// Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const pages = Array.from({ length: 11 }, () => pdfDoc.addPage([842, 595]));
  const { width, height } = pages[0].getSize();

  // Embed images
  const imagePaths = [
    "/images/Page1.png",
    "/images/Page2.png",
    "/images/Page3.png",
    "/images/Page4.png",
    "/images/Page5.png",
    "/images/Page6.png",
    "/images/Page7.png",
    "/images/Page8.png",
    "/images/Page9.png",
    "/images/Page10.png",
    "/images/Page11.png"
  ];

  const images = await Promise.all(
    imagePaths.map(async (path) => {
      const imageBytes = await fetch(path).then((res) => res.arrayBuffer());
      return pdfDoc.embedPng(imageBytes);
    })
  );

  // Draw images on each page
  pages.forEach((page, index) => {
    page.drawImage(images[index], {
      x: 0,
      y: height - 595,
      width,
      height,
    });
  });

  // Draw text from Dexie data on the PDF
  let full_name = `${firstProfile.first_name}` + ` ` + `${firstProfile.middle_name}` + ` ` + `${firstProfile.last_name}`;
  let count_full_name_1 = (full_name.length);
  const date = new Date();
  const formatted = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  const options = { year: "numeric" as const, month: "long" as const, day: "numeric" as const };
  const dateString = date.toLocaleDateString('en-US', options);  // "March 26, 2025"
  let civil = firstProfile.civil_status_id;
  let date_spilt = dateString.split(/,/);

//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------

  // PAGE 4 AND 7 OF THE PDF FILE =======================================================================================================
  const  get_id_card = await getOfflineLibIdCard();
  const id_map = Object.fromEntries(get_id_card.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
  setExtensionNames(id_map);
  const id_ext = id_map[firstProfile.id_card ?? 0] || ""; 
    
  //fullname
  pages[0].drawText(full_name.toUpperCase() , {
    x: 632.5 - (count_full_name_1 * 3),
    y: 122,
    size: 9,
    color: rgb(0, 0, 0),
  });

  let cfwp_id = 'KC25-00000001';
  let cfwp_id_count = (cfwp_id.length * 7) / 2;

  //cfwp_id
  pages[0].drawText(cfwp_id, {
    x: 645 - cfwp_id_count,
    y: 80,
    size: 9,
    color: rgb(0, 0, 0),
  });

  //date 
  pages[2].drawText(formatted.toString(), {
    x: 260,
    y: 540,
    size: 7,
    color: rgb(0, 0, 0),
  });

  pages[2].drawText(date_spilt[0].toString(), {
    x: 115,
    y: 425,
    size: 7,
    color: rgb(0, 0, 0),
  });
  const two_digit_year = date_spilt[1].toString().replace('20', ''); 
  pages[2].drawText(two_digit_year, {
    x: 173,
    y: 425,
    size: 7,
    color: rgb(0, 0, 0),
  });

  pages[2].drawText(`N/A`, {
    x: 270,
    y: 509,
    size: 7,
    color: rgb(0, 0, 0),
  });

  const count_full_name_3 = full_name.length;
  pages[2].drawText(full_name.toString().toLocaleUpperCase() , {
    x: 115 - (count_full_name_3 * 1.9),
    y: 307,
    size: 6,
    color: rgb(0, 0, 0),
  });

  pages[2].drawText(cfwp_id, {
    x: 278 - cfwp_id_count,
    y: 13,
    size: 6,
    color: rgb(0, 0, 0),
  });

  //---------------------------------------------------------Page 4-------------------------------------------------------------------


  pages[3].drawText(cfwp_id, {
    x: 138 - cfwp_id_count,
    y: 540,
    size: 7,
    color: rgb(0, 0, 0),
  });
  
  pages[3].drawText(formatted.toString(), {
    x: 224,
    y: 540,
    size: 5,
    color: rgb(0, 0, 0),
  });
  // CFWP FOR HIGHER EDUCATION INSTITUTION
  pages[3].drawText('X', {
    x: 33,
    y: 492.5,
    size: 5,
    color: rgb(0, 0, 0),
  });
  // CFWP FOR ECONOMICALLY VULNERABLE COMMUNITIES AND SECTOR
  pages[3].drawText('', {
    x: 155,
    y: 491,
    size: 5,
    color: rgb(0, 0, 0),
  });

  pages[3].drawText(`${firstProfile.last_name.toString().toUpperCase()}`, {
    x: 29,
    y: 436,
    size: 5,
    color: rgb(0, 0, 0),
  });

  pages[3].drawText(`${firstProfile.first_name.toString().toUpperCase()}`, {
    x: 141,
    y: 436,
    size: 5,
    color: rgb(0, 0, 0),
  });

  pages[3].drawText(`${firstProfile.middle_name.toString().toUpperCase()}`, {
    x: 257,
    y: 436,
    size: 5,
    color: rgb(0, 0, 0),
  });

  // NAME EXTENSION
  const extension_name = await getOfflineExtensionLibraryOptions();
  const ext_map = Object.fromEntries(extension_name.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
  setExtensionNames(ext_map);
  const name_ext = ext_map[firstProfile.extension_name_id ?? 0] || ""; 
  
  pages[3].drawText(`${name_ext}`, {
    x: 363,
    y: 436,
    size: 5,
    color: rgb(0, 0, 0),
  });
  
  //ADDRESS

  const str_address =  firstProfile.sitio + ', ' + profileBrgy + ', ' + profileCity + ', ' + profileProvince;
  const Address_charSize = 121;
  const address_result = [];

  for (let i = 0; i < str_address.length; i += Address_charSize) {
      address_result.push(str_address.slice(i, i + Address_charSize));
  }
  //SITIO ADRRESS
  for(let i = 0; i < address_result.length; i++){
    pages[3].drawText(`${address_result[i].toString().toUpperCase()}`, {
      x:29,
      y: 377 - (9 * i),
      size: 5,
      color: rgb(0, 0, 0),
    });
  }
  //SITIO ADRRESS
  for(let i = 0; i < address_result.length; i++){
    pages[3].drawText(`${address_result[i].toString().toUpperCase()}`, {
      x:29,
      y: 329 - (9 * i),
      size: 5,
      color: rgb(0, 0, 0),
    });
  }
  


  const str = firstProfile.birthplace;
  const chunkSize = 21;
  const result = [];

  for (let i = 0; i < str.length; i += chunkSize) {
      result.push(str.slice(i, i + chunkSize));
  }
  for(let i = 0; i < result.length; i++){
    pages[3].drawText(result[i].toString().toUpperCase(), {
      x: 29,
      y: 242 - (9 * i),
      size: 5,
      color: rgb(0, 0, 0),
    });
  }

  let occupation = firstProfile.current_occupation.toString().toUpperCase();
  let occupation_split = occupation.split(" ");
  //TRABAHO
  if(occupation_split[0] !== undefined){
  pages[3].drawText(`${occupation_split[0]}`, {
    x: 116,
    y: 242,
    size: 5,
    color: rgb(0, 0, 0),
  });
  }
  if(occupation_split[1] !== undefined){
  pages[3].drawText(`${occupation_split[1]}`, {
    x: 116,
    y: 233,
    size: 5,
    color: rgb(0, 0, 0),
  });
  }

  if(occupation_split[2] !== undefined){
    pages[3].drawText(`${occupation_split[2]}`, {
      x: 116,
      y: 224,
      size: 5,
      color: rgb(0, 0, 0),
    });
    }

    if(occupation_split[3] !== undefined){
    pages[3].drawText(`${occupation_split[3]}`, {
      x: 116,
      y: 215,
      size: 5,
      color: rgb(0, 0, 0),
    });
    }


  //IDENTIFICATION CARD
  let ID_INFO = id_ext + ' / ' +  firstProfile.occupation_id_card_number;
  pages[3].drawText(`${ID_INFO.toString().toUpperCase()}`, {
    x: 175,
    y: 242,
    size: 5,
    color: rgb(0, 0, 0),
  });
  
  let bdate = `${firstProfile.birthdate}`;
  let res = bdate.split(/-/);

  pages[3].drawText(res[1], { 
    x: 39,
    y: 290,
    size: 5,
    color: rgb(0, 0, 0),
  });

  pages[3].drawText(res[2], { 
    x: 74,
    y: 290,
    size: 5,
    color: rgb(0, 0, 0),
  });

  pages[3].drawText(res[0], { 
    x: 105,
    y: 290,
    size: 5,
    color: rgb(0, 0, 0),
  });

  //AGE
  pages[3].drawText(`${firstProfile.age}`, { 
    x: 144,
    y: 282,
    size: 5,
    color: rgb(0, 0, 0),
  });
  
  const get_sex = await getOfflineLibSexOptions();
  const sex_map = Object.fromEntries(get_sex.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
  setExtensionNames(sex_map);
  const sex_ext = sex_map[firstProfile.sex_id ?? 0] || ""; 
  const sex_count = sex_ext.length;

  use

  pages[3].drawText(sex_ext.toString().toUpperCase(), { 
    x: 195 - (sex_count * 1.9),
    y: 282,
    size: 5,
    color: rgb(0, 0, 0),
  });

  pages[3].drawText(`${firstProfile.cellphone_no}`, { 
    x: 231,
    y: 293,
    size: 5,
    color: rgb(0, 0, 0),
  });

  let email_a = `${firstProfile.email}`;
  let email_split = email_a.split("@");

  pages[3].drawText(email_split[0], { 
    x: 316,
    y: 292,
    size: 5,
    color: rgb(0, 0, 0),

  });
  pages[3].drawText('@' + email_split[1], { 
    x: 316,
    y: 285,
    size: 5,
    color: rgb(0, 0, 0),
  });
  console.log(email_split[0])

  // CIVIL STATUS 
  const get_civil_status = await getOfflineCivilStatusLibraryOptions();
  const civil_map = Object.fromEntries(get_civil_status.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
  setExtensionNames(civil_map);
  const civil_ext = civil_map[firstProfile.civil_status_id ?? 0] || "";
  pages[3].drawText(civil_ext.toString().toUpperCase(), { 
    x: 283,
    y: 242,
    size: 5,
    color: rgb(0, 0, 0),
  });

  // 4PS BENEFICIARIES
  pages[3].drawText('', { 
    x: 35,
    y: 158,
    size: 5,
    color: rgb(0, 0, 0),
  });

  //SEKTOR
    let get_sector_status = [];
    let sector_map = [];
    let sector_ext = [];

    for(let i = 0; i < person_prosect.length; i ++ ){
      get_sector_status[i] = await getOfflineLibSectorsLibraryOptions();
      sector_map[i] = Object.fromEntries(get_sector_status[i].map((ext: { id: number; name: string }) => [ext.id, ext.name]));
      setExtensionNames(sector_map[i]);
      sector_ext[i] = sector_map[i][person_prosect[i].sector_id ?? 0] || "";
        pages[3].drawText(sector_ext[i].toString().toUpperCase(), { 
          x: 32,
          y: 119 - (10 * i),
          size: 5,
          color: rgb(0, 0, 0),
        });
        if(i == 7)break; 
    }
  
  //TYPE OF DISABILITY
  //URI NG KAPANSANAN
    const get_disability_type = [];
    const disability_map = [];
    const disability_ext = [];

    for(let i = 0; i < pwd_person_profile.length; i++){
      get_disability_type[i] = await getOfflineLibTypeOfDisability();
      disability_map[i] = Object.fromEntries(get_disability_type[i].map((ext: { id: number; name: string }) => [ext.id, ext.name]));
      setExtensionNames(disability_map[1]);
      disability_ext[i] = disability_map[i][pwd[i].type_of_disability_id ?? 0] || ""; 
      pages[3].drawText(`${disability_ext[i]}`, { 
        x: 232,
        y: 120.5 - (10 * i),
        size: 5, 
        color: rgb(0, 0, 0),
      });
      if(i == 5)break
    }

  // LEFT
  pages[3].drawText(cfwp_id, {
    x: 278 - cfwp_id_count,
    y: 13,
    size: 5,
    color: rgb(0, 0, 0),
  });

  //RIGHT
  pages[3].drawText(cfwp_id, {
    x: 699 - cfwp_id_count,
    y: 13,
    size: 5,
    color: rgb(0, 0, 0),
  });       

//----------------------------------------------------------------------------------------------------------------Page 5-------------------------------------------------------------------------------------------------------------
//===================================================================================================================================================================================================================================
// family_relationProfile1

  if(family_relationProfile1 !== undefined){
    const get_name_extension1 = await getOfflineExtensionLibraryOptions();
    const get_name_extension_map1 = Object.fromEntries(get_name_extension1.map((ext: { id: number; name: string }) => [ext.id, ext.name]));     
    setExtensionNames(get_name_extension_map1);
    var name_ext_1 = get_name_extension_map1[family_relationProfile1.extension_name_id ?? 0] || "";
  
    if(name_ext_1 == "N/A"){
      name_ext_1 = ""
    }


    //BUONG PANGALAN 1
    let family_member_name1 = family_relationProfile1.first_name + "  " + family_relationProfile1.middle_name + "  " + family_relationProfile1.last_name + "  " + name_ext_1;
    pages[4].drawText(family_member_name1.toString().toUpperCase(), {
      x: 510,
      y: 26,
      size: 5,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });

    const get_family_relation = await getOfflineLibRelationshipToBeneficiary();
    const family_relation_map = Object.fromEntries(get_family_relation.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
    setExtensionNames(family_relation_map);
    const family_relation_ext1 = family_relation_map[family_relationProfile1.relationship_to_the_beneficiary_id ?? 0] || ""; 
  
     //RELASYON 1
     pages[4].drawText(`${family_relation_ext1.toUpperCase()}`, {
      x: 510,
      y: 148,
      size: 5,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });


    //KAPANGANAKAN 1
    pages[4].drawText(`${family_relationProfile1.birthdate.toUpperCase()}`, {
      x: 510,
      y: 208,
      size: 5,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });

    //EDAD 1
    pages[4].drawText(`${family_relationProfile1.age?.toString().toUpperCase()}`, {
      x: 510,
      y: 270,
      size: 5,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });

    const  get_educational_attainment = await getOfflineLibEducationalAttainment();
    const educational_attainment_map = Object.fromEntries(get_educational_attainment.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
    setExtensionNames(educational_attainment_map);
    const educational_attainment = educational_attainment_map[family_relationProfile1.highest_educational_attainment_id ?? 0] || ""; 

    //ANTAS NG EDUKASYON 1
    pages[4].drawText(`${educational_attainment.toString().toUpperCase()}`, {
      x: 510,
      y: 304,
      size: 5,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });

    //TRABAHO 1
    const work_cfw1 = `${family_relationProfile1.work?.toString().toUpperCase()}`;
    const worK_charSize1 = 15;
    const work_cfw_result1 = [];
    for (let i = 0; i < work_cfw1.toString().toUpperCase().length; i += worK_charSize1) {
      work_cfw_result1.push(work_cfw1.slice(i, i + worK_charSize1));
    }
    for(let i = 0; i < work_cfw_result1.length; i++){
    pages[4].drawText(`${work_cfw_result1[i].toString().toUpperCase()}`, {
      x:510 - (9 * i),
      y: 374,
      size: 5,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });
    }

    //BUWANANG KITA 1
    pages[4].drawText(`${family_relationProfile1.monthly_income}`, {
      x: 510,
      y: 438,
      size: 5,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });

    //NUMBER NG TELEPONO 1
    pages[4].drawText(`${family_relationProfile1.contact_number?.toUpperCase()}`, {
      x: 510,
      y: 504,
      size: 5,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });

  }

//===================================================================================================================================================================================================
//===================================================================================================================================================================================================
// family_relationProfile2

  if(family_relationProfile2 !== undefined){
    const get_name_extension2 = await getOfflineExtensionLibraryOptions();
    const get_name_extension_map2 = Object.fromEntries(get_name_extension2.map((ext: { id: number; name: string }) => [ext.id, ext.name]));     
    setExtensionNames(get_name_extension_map2);
    var name_ext_2 = get_name_extension_map2[family_relationProfile2.extension_name_id ?? 0] || "";

    if(name_ext_2 == "N/A"){
      name_ext_2 = ""
    }
    
    let family_member_name2 = family_relationProfile2.first_name + "  " +  family_relationProfile2.middle_name + "  " + family_relationProfile2.last_name + "  " + name_ext_2;
    //BUONG PANGALAN 2
    pages[4].drawText(`${family_member_name2.toString().toUpperCase()}`, {
      x: 542,
      y: 26,
      size: 5,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });

    const get_family_relation2 = await getOfflineLibRelationshipToBeneficiary();
    const family_relation_map2 = Object.fromEntries(get_family_relation2.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
    setExtensionNames(family_relation_map2);
    const family_relation_ext2 = family_relation_map2[family_relationProfile2.relationship_to_the_beneficiary_id ?? 0] || ""; 
  
    //RELASYON 2
    pages[4].drawText(`${family_relation_ext2.toUpperCase()}`, {
      x: 542,
      y: 148,
      size: 5,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });

    //KAPANGANAKAN 2
    pages[4].drawText(`${family_relationProfile2.birthdate.toUpperCase()}`, {
      x: 542,
      y: 208,
      size: 5,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });

    //EDAD 2 
    pages[4].drawText(`${family_relationProfile2.age?.toString().toUpperCase()}`, {
      x: 542,
      y: 270,
      size: 5,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });
    
    const  get_educational_attainment2 = await getOfflineLibEducationalAttainment();
    const educational_attainment_map2 = Object.fromEntries(get_educational_attainment2.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
    setExtensionNames(educational_attainment_map2);
    const educational_attainment2 = educational_attainment_map2[family_relationProfile2.highest_educational_attainment_id ?? 0] || ""; 

          
    //ANTAS NG EDUKASYON 2
    pages[4].drawText(`${educational_attainment2.toString().toUpperCase()}`, {
      x: 542,
      y: 304,
      size: 5,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });

    //TRABAHO 2
    const work_cfw2 = `${family_relationProfile2.work?.toString().toUpperCase()}`;
    const worK_charSize2 = 15;
    const work_cfw_result2 = [];
    for (let i = 0; i < work_cfw2.toString().toUpperCase().length; i += worK_charSize2) {
      work_cfw_result2.push(work_cfw2.slice(i, i + worK_charSize2));
    }
    for(let i = 0; i < work_cfw_result2.length; i++){
    pages[4].drawText(`${work_cfw_result2[i].toString().toUpperCase()}`, {
      x: 542 - (-9 * i),
      y: 374,
      size: 5,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });
    }


    //BUWANANG KITA 2
    pages[4].drawText(`${family_relationProfile2.monthly_income}`, {
      x: 542,
      y: 438,
      size: 5,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });

    //NUMBER NG TELEPONO 2
    pages[4].drawText(`${family_relationProfile2.contact_number?.toUpperCase()}`, {
      x: 542,
      y: 504,
      size: 5,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });

  }

//===================================================================================================================================================================================================
//===================================================================================================================================================================================================
// family_relationProfile3

  if(family_relationProfile3 !== undefined){
    const get_name_extension3 = await getOfflineExtensionLibraryOptions();
    const get_name_extension_map3 = Object.fromEntries(get_name_extension3.map((ext: { id: number; name: string }) => [ext.id, ext.name]));     
    setExtensionNames(get_name_extension_map3);
    var name_ext_3 = get_name_extension_map3[family_relationProfile3.extension_name_id ?? 0] || "";

    if(name_ext_3 == "N/A"){
      name_ext_3 = ""
    }

    let family_member_name3 = family_relationProfile3.first_name + "  " +  family_relationProfile3.middle_name + "  " + family_relationProfile3.last_name + "  " + name_ext_3;
    //BUONG PANGALAN 3
    pages[4].drawText(`${family_member_name3.toString().toUpperCase()}`, {
      x: 572,
      y: 26,
      size: 5,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });
  
  const get_family_relation3 = await getOfflineLibRelationshipToBeneficiary();
  const family_relation_map3 = Object.fromEntries(get_family_relation3.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
  setExtensionNames(family_relation_map3);
  const family_relation_ext3 = family_relation_map3[family_relationProfile3.relationship_to_the_beneficiary_id ?? 0] || ""; 

  //RELASYON 3
  pages[4].drawText(`${family_relation_ext3.toUpperCase()}`, {
    x: 572,
    y: 148,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  //KAPANGANAKAN 3
  pages[4].drawText(`${family_relationProfile3.birthdate.toUpperCase()}`, {
    x: 572,
    y: 208,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  //EDAD 3
  pages[4].drawText(`${family_relationProfile3.age}`, {
    x: 572,
    y: 270,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });
  
  const  get_educational_attainment3 = await getOfflineLibEducationalAttainment();
  const educational_attainment_map3 = Object.fromEntries(get_educational_attainment3.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
  setExtensionNames(educational_attainment_map3);
  const educational_attainment3 = educational_attainment_map3[family_relationProfile3.highest_educational_attainment_id ?? 0] || ""; 

  //ANTAS NG EDUKASYON 3
  pages[4].drawText(`${educational_attainment3.toString().toUpperCase()}`, {
    x: 572,
    y: 304,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });
  
  //TRABAHO 3
  const work_cfw3 = `${family_relationProfile3.work?.toString().toUpperCase()}`;
  const worK_charSize3 = 15;
  const work_cfw_result3 = [];
  for (let i = 0; i < work_cfw3.toString().toUpperCase().length; i += worK_charSize3) {
    work_cfw_result3.push(work_cfw3.slice(i, i + worK_charSize3));
  }
  for(let i = 0; i < work_cfw_result3.length; i++){
  pages[4].drawText(`${work_cfw_result3[i].toString().toUpperCase()}`, {
    x: 572 - (-9 * i),
    y: 374,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });
  }
   
  //BUWANANG KITA 3
  pages[4].drawText(`${family_relationProfile3.monthly_income}`, {
    x: 572,
    y: 438,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });
  
  //NUMBER NG TELEPONO 3
  pages[4].drawText(`${family_relationProfile3.contact_number?.toUpperCase()}`, {
    x: 572,
    y: 504,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  }

//==================================================================================================================================================================================================
//==================================================================================================================================================================================================
// family_relationProfile4

  if(family_relationProfile4 !== undefined){
  const get_name_extension4 = await getOfflineExtensionLibraryOptions();
  const get_name_extension_map4 = Object.fromEntries(get_name_extension4.map((ext: { id: number; name: string }) => [ext.id, ext.name]));     
  setExtensionNames(get_name_extension_map4);
  var name_ext_4 = get_name_extension_map4[family_relationProfile4.extension_name_id ?? 0] || "";

  if(name_ext_4 == "N/A"){
    name_ext_4 = ""
  }

  let family_member_name4 = family_relationProfile4.first_name + "  " +  family_relationProfile4.middle_name + "  " + family_relationProfile4.last_name + "  " + name_ext_4;
  //BUONG PANGALAN 4
  pages[4].drawText(`${family_member_name4.toString().toUpperCase()}`, {
    x: 603,
    y: 26,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  const get_family_relation4 = await getOfflineLibRelationshipToBeneficiary();
  const family_relation_map4 = Object.fromEntries(get_family_relation4.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
  setExtensionNames(family_relation_map4);
  const family_relation_ext4 = family_relation_map4[family_relationProfile4.relationship_to_the_beneficiary_id ?? 0] || ""; 
  
  //RELASYON 4
  pages[4].drawText(`${family_relation_ext4.toUpperCase()}`, {
    x: 603,
    y: 148,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  //KAPANGANAKAN 4
  pages[4].drawText(`${family_relationProfile4.birthdate.toUpperCase()}`, {
    x: 603,
    y: 208,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });
  
  //EDAD 4
  pages[4].drawText(`${family_relationProfile4.age}`, {
    x: 603,
    y: 270,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  const  get_educational_attainment4 = await getOfflineLibEducationalAttainment();
  const educational_attainment_map4 = Object.fromEntries(get_educational_attainment4.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
  setExtensionNames(educational_attainment_map4);
  const educational_attainment4 = educational_attainment_map4[family_relationProfile4.highest_educational_attainment_id ?? 0] || ""; 

  //ANTAS NG EDUKASYON 4
  pages[4].drawText(`${educational_attainment4.toString().toUpperCase()}`, {
    x: 603,
    y: 304,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  //TRABAHO 4
  const work_cfw4 = `${family_relationProfile4.work?.toString().toUpperCase()}`;
  const worK_charSize4 = 15;
  const work_cfw_result4 = [];
  for (let i = 0; i < work_cfw4.toString().toUpperCase().length; i += worK_charSize4) {
    work_cfw_result4.push(work_cfw4.slice(i, i + worK_charSize4));
  }
  for(let i = 0; i < work_cfw_result4.length; i++){
  pages[4].drawText(`${work_cfw_result4[i].toString().toUpperCase()}`, {
    x: 603 - (-9 * i),
    y: 374,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });
  }

  //BUWANANG KITA 4
  pages[4].drawText(`${family_relationProfile4.monthly_income}`, {
    x: 603,
    y: 438,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  //NUMBER NG TELEPONO 4
  pages[4].drawText(`${family_relationProfile4.contact_number?.toUpperCase()}`, {
    x: 603,
    y: 504,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });
  }


//===================================================================================================================================================================================================
//===================================================================================================================================================================================================
// family_relationProfile5

if(family_relationProfile5 !== undefined){
  const get_name_extension5 = await getOfflineExtensionLibraryOptions();
  const get_name_extension_map5 = Object.fromEntries(get_name_extension5.map((ext: { id: number; name: string }) => [ext.id, ext.name]));     
  setExtensionNames(get_name_extension_map5);
  var name_ext_5 = get_name_extension_map5[family_relationProfile5.extension_name_id ?? 0] || "";

  if(name_ext_5 == "N/A"){
    name_ext_5 = ""
  }


  let family_member_name5 = family_relationProfile5.first_name + "  " +  family_relationProfile5.middle_name + "  " + family_relationProfile5.last_name + "  " + name_ext_5;
    //BUONG PANGALAN 5
    pages[4].drawText(`${family_member_name5.toString().toUpperCase()}`, {
    x: 636,
    y: 26,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  const get_family_relation5 = await getOfflineLibRelationshipToBeneficiary();
  const family_relation_map5 = Object.fromEntries(get_family_relation5.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
  setExtensionNames(family_relation_map5);
  const family_relation_ext5 = family_relation_map5[family_relationProfile5.relationship_to_the_beneficiary_id ?? 0] || ""; 
  
  //RELASYON 5
  pages[4].drawText(`${family_relation_ext5.toUpperCase()}`, {
    x: 636,
    y: 148,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  //KAPANGANAKAN 5
  pages[4].drawText(`${family_relationProfile5.birthdate.toUpperCase()}`, {
    x: 636,
    y: 208,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  //EDAD 5
  pages[4].drawText(`${family_relationProfile5.age}`, {
    x: 636,
    y: 270,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  const  get_educational_attainment5 = await getOfflineLibEducationalAttainment();
  const educational_attainment_map5 = Object.fromEntries(get_educational_attainment5.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
  setExtensionNames(educational_attainment_map5);
  const educational_attainment5 = educational_attainment_map5[family_relationProfile5.highest_educational_attainment_id ?? 0] || ""; 

  //ANTAS NG EDUKASYON 5
  pages[4].drawText(`${educational_attainment5.toString().toUpperCase()}`, {
    x: 636,
    y: 304,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

    //TRABAHO 5
    const work_cfw5 = `${family_relationProfile5.work?.toString().toUpperCase()}`;
    const worK_charSize5 = 15;
    const work_cfw_result5 = [];
    for (let i = 0; i < work_cfw5.toString().toUpperCase().length; i += worK_charSize5) {
      work_cfw_result5.push(work_cfw5.slice(i, i + worK_charSize5));
    }
    for(let i = 0; i < work_cfw_result5.length; i++){
    pages[4].drawText(`${work_cfw_result5[i].toString().toUpperCase()}`, {
      x: 636 - (-9 * i),
      y: 374,
      size: 5,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });
    }

  //BUWANANG KITA 5
  pages[4].drawText(`${family_relationProfile5.monthly_income}`, {
    x: 636,
    y: 438,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  //NUMBER NG TELEPONO 5
  pages[4].drawText(`${family_relationProfile5.contact_number?.toUpperCase()}`, {
    x: 636,
    y: 504,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

}
//===================================================================================================================================================================================================
//===================================================================================================================================================================================================
// family_relationProfile6

if(family_relationProfile6 !== undefined){
  const get_name_extension6 = await getOfflineExtensionLibraryOptions();
  const get_name_extension_map6 = Object.fromEntries(get_name_extension6.map((ext: { id: number; name: string }) => [ext.id, ext.name]));     
  setExtensionNames(get_name_extension_map6);
  var name_ext_6 = get_name_extension_map6[family_relationProfile6.extension_name_id ?? 0] || "";

  if(name_ext_6 == "N/A"){
    name_ext_6 = ""
  }

  //BUONG PANGALAN 6
  let family_member_name6 = family_relationProfile6.first_name + "  " +  family_relationProfile6.middle_name + "  " + family_relationProfile6.last_name + "  " + name_ext_6;
  pages[4].drawText(`${family_member_name6.toString().toUpperCase()}`, {
    x: 668,
    y: 26,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  const get_family_relation6 = await getOfflineLibRelationshipToBeneficiary();
  const family_relation_map6 = Object.fromEntries(get_family_relation6.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
  setExtensionNames(family_relation_map6);
  const family_relation_ext6 = family_relation_map6[family_relationProfile6.relationship_to_the_beneficiary_id ?? 0] || ""; 

  //RELASYON 6
  pages[4].drawText(`${family_relation_ext6.toUpperCase()}`, {
    x: 668,
    y: 148,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  //KAPANGANAKAN 6
  pages[4].drawText(`${family_relationProfile6.birthdate.toUpperCase()}`, {
    x: 668,
    y: 208,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

    
  //EDAD 6
  pages[4].drawText(`${family_relationProfile6.age}`, {
    x: 668,
    y: 270,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });
    
  const  get_educational_attainment6 = await getOfflineLibEducationalAttainment();
  const educational_attainment_map6 = Object.fromEntries(get_educational_attainment6.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
  setExtensionNames(educational_attainment_map6);
  const educational_attainment6 = educational_attainment_map6[family_relationProfile6.highest_educational_attainment_id ?? 0] || ""; 
  
  //ANTAS NG EDUKASYON 6
  pages[4].drawText(`${educational_attainment6.toString().toUpperCase()}`, {
    x: 668,
    y: 304,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });
  
  //TRABAHO 6
  const work_cfw6 = `${family_relationProfile6.work?.toString().toUpperCase()}`;
  const worK_charSize6 = 15;
  const work_cfw_result6 = [];
  for (let i = 0; i < work_cfw6.toString().toUpperCase().length; i += worK_charSize6) {
    work_cfw_result6.push(work_cfw6.slice(i, i + worK_charSize6));
  }
  for(let i = 0; i < work_cfw_result6.length; i++){
  pages[4].drawText(`${work_cfw_result6[i].toString().toUpperCase()}`, {
    x: 668 - (-9 * i),
    y: 374,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });
  }

    //BUWANANG KITA 6
    pages[4].drawText(`${family_relationProfile6.monthly_income}`, {
    x: 668,
    y: 438,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });
  //NUMBER NG TELEPONO 6
  pages[4].drawText(`${family_relationProfile6.contact_number?.toUpperCase()}`, {
    x: 668,
    y: 504,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

}

//===================================================================================================================================================================================================
//===================================================================================================================================================================================================
// family_relationProfile7

if(family_relationProfile7 !== undefined){
  const get_name_extension7 = await getOfflineExtensionLibraryOptions();
  const get_name_extension_map7 = Object.fromEntries(get_name_extension7.map((ext: { id: number; name: string }) => [ext.id, ext.name]));     
  setExtensionNames(get_name_extension_map7);
  var name_ext_7 = get_name_extension_map7[family_relationProfile7.extension_name_id ?? 0] || "";

  if(name_ext_7 == "N/A"){
    name_ext_7 = ""
  }

  let family_member_name7 = family_relationProfile7.first_name + "  " +  family_relationProfile7.middle_name + "  " + family_relationProfile7.last_name + "  " + name_ext_7;
  //BUONG PANGALAN 7
  pages[4].drawText(`${family_member_name7.toString().toUpperCase()}`, {
    x: 699,
    y: 26,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  const get_family_relation7 = await getOfflineLibRelationshipToBeneficiary();
  const family_relation_map7 = Object.fromEntries(get_family_relation7.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
  setExtensionNames(family_relation_map7);
  const family_relation_ext7 = family_relation_map7[family_relationProfile7.relationship_to_the_beneficiary_id ?? 0] || "";

  //RELASYON 7
  pages[4].drawText(`${family_relation_ext7.toUpperCase()}`, {
    x: 699,
    y: 148,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });
  
  //KAPANGANAKAN 7
  pages[4].drawText(`${family_relationProfile7.birthdate.toUpperCase()}`, {
    x: 699,
    y: 208,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  
 
  //EDAD 7
pages[4].drawText(`${family_relationProfile7.age}`, {
  x: 699,
  y: 270,
  size: 5,
  color: rgb(0, 0, 0),
  rotate: degrees(90)
});

const  get_educational_attainment7 = await getOfflineLibEducationalAttainment();
const educational_attainment_map7 = Object.fromEntries(get_educational_attainment7.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
setExtensionNames(educational_attainment_map7);
const educational_attainment7 = educational_attainment_map7[family_relationProfile7.highest_educational_attainment_id ?? 0] || ""; 



//ANTAS NG EDUKASYON 7
pages[4].drawText(`${educational_attainment7.toString().toUpperCase()}`, {
  x: 699,
  y: 304,
  size: 5,
  color: rgb(0, 0, 0),
  rotate: degrees(90)
});
  


  //TRABAHO 7
  const work_cfw7 = `${family_relationProfile7.work?.toString().toUpperCase()}`;
  const worK_charSize7 = 15;
  const work_cfw_result7 = [];
  for (let i = 0; i < work_cfw7.toString().toUpperCase().length; i += worK_charSize7) {
    work_cfw_result7.push(work_cfw7.slice(i, i + worK_charSize7));
  }
  for(let i = 0; i < work_cfw_result7.length; i++){
  pages[4].drawText(`${work_cfw_result7[i].toString().toUpperCase()}`, {
    x: 699 - (-9 * i),
    y: 374,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });
  }

  //BUWANANG KITA 7
  pages[4].drawText(`${family_relationProfile7.monthly_income}`, {
    x: 699,
    y: 438,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

    
  //NUMBER NG TELEPONO 7
  pages[4].drawText(`${family_relationProfile7.contact_number?.toUpperCase()}`, {
    x: 699,
    y: 504,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

}
//===================================================================================================================================================================================================
//===================================================================================================================================================================================================
// family_relationProfile8


if(family_relationProfile8 !== undefined){
  const get_name_extension8 = await getOfflineExtensionLibraryOptions();
  const get_name_extension_map8 = Object.fromEntries(get_name_extension8.map((ext: { id: number; name: string }) => [ext.id, ext.name]));     
  setExtensionNames(get_name_extension_map8);
  var name_ext_8 = get_name_extension_map8[family_relationProfile8.extension_name_id ?? 0] || "";

  if(name_ext_8 == "N/A"){
    name_ext_8 = ""
  }

  let family_member_name8 = family_relationProfile8.first_name + "  " +  family_relationProfile8.middle_name + "  " + family_relationProfile8.last_name  + "  " + name_ext_8;
    //BUONG PANGALAN 8
  pages[4].drawText(`${family_member_name8.toString().toUpperCase()}`, {
    x: 731,
    y: 26,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  
  const get_family_relation8 = await getOfflineLibRelationshipToBeneficiary();
  const family_relation_map8 = Object.fromEntries(get_family_relation8.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
  setExtensionNames(family_relation_map8);
  const family_relation_ext8 = family_relation_map8[family_relationProfile8.relationship_to_the_beneficiary_id ?? 0] || "";

  //RELASYON 8
  pages[4].drawText(`${family_relation_ext8.toUpperCase()}`, {
    x: 731,
    y: 148,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  //KAPANGANAKAN 8
  pages[4].drawText(`${family_relationProfile8.birthdate.toUpperCase()}`, {
    x: 731,
    y: 208,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  //EDAD 8
  pages[4].drawText(`${family_relationProfile8.age}`, {
    x: 731,
    y: 270,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });
  
  const  get_educational_attainment8 = await getOfflineLibEducationalAttainment();
  const educational_attainment_map8 = Object.fromEntries(get_educational_attainment8.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
  setExtensionNames(educational_attainment_map8);
  const educational_attainment8 = educational_attainment_map8[family_relationProfile8.highest_educational_attainment_id ?? 0] || ""; 
  


  //ANTAS NG EDUKASYON 8
  pages[4].drawText(`${educational_attainment8.toString().toUpperCase()}`, {
    x: 731,
    y: 304,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  //TRABAHO 8
  const work_cfw8 = `${family_relationProfile8.work?.toString().toUpperCase()}`;
  const worK_charSize8 = 15;
  const work_cfw_result8 = [];
  for (let i = 0; i < work_cfw8.toString().toUpperCase().length; i += worK_charSize8) {
    work_cfw_result8.push(work_cfw8.slice(i, i + worK_charSize8));
  }
  for(let i = 0; i < work_cfw_result8.length; i++){
  pages[4].drawText(`${work_cfw_result8[i].toString().toUpperCase()}`, {
    x: 731 - (-9 * i),
    y: 374,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });
  }

  //BUWANANG KITA 8
  pages[4].drawText(`${family_relationProfile8.monthly_income}`, {
    x: 731,
    y: 438,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  //NUMBER NG TELEPONO 8
  pages[4].drawText(`${family_relationProfile8.contact_number?.toUpperCase()}`, {
    x: 731,
    y: 504,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

}

//===================================================================================================================================================================================================
//===================================================================================================================================================================================================
//family_relationProfile9


if(family_relationProfile9 !== undefined){

  const get_name_extension9 = await getOfflineExtensionLibraryOptions();
  const get_name_extension_map9 = Object.fromEntries(get_name_extension9.map((ext: { id: number; name: string }) => [ext.id, ext.name]));     
  setExtensionNames(get_name_extension_map9);
  var name_ext_9 = get_name_extension_map9[family_relationProfile9.extension_name_id ?? 0] || "";

  if(name_ext_9 == "N/A"){
    name_ext_9 = ""
  }
 
  let family_member_name9 = family_relationProfile9.first_name + "  " +  family_relationProfile9.middle_name + "  " + family_relationProfile9.last_name + "  " + name_ext_9;
  //BUONG PANGALAN 9
  pages[4].drawText(`${family_member_name9.toString().toUpperCase()}`, {
    x: 763,
    y: 26,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

const get_family_relation9 = await getOfflineLibRelationshipToBeneficiary();
const family_relation_map9 = Object.fromEntries(get_family_relation9.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
setExtensionNames(family_relation_map9);
const family_relation_ext9 = family_relation_map9[family_relationProfile9.relationship_to_the_beneficiary_id ?? 0] || "";

//RELASYON 9
pages[4].drawText(`${family_relation_ext9.toUpperCase()}`, {
  x: 763,
  y: 148,
  size: 5,
  color: rgb(0, 0, 0),
  rotate: degrees(90)
});

//KAPANGANAKAN 9
pages[4].drawText(`${family_relationProfile9.birthdate.toUpperCase()}`, {
  x: 763,
  y: 208,
  size: 5,
  color: rgb(0, 0, 0),
  rotate: degrees(90)
});

//EDAD 9
pages[4].drawText(`${family_relationProfile9.age}`, {
  x: 763,
  y: 270,
  size: 5,
  color: rgb(0, 0, 0),
  rotate: degrees(90)
});


const  get_educational_attainment9 = await getOfflineLibEducationalAttainment();
const educational_attainment_map9 = Object.fromEntries(get_educational_attainment9.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
setExtensionNames(educational_attainment_map9);
const educational_attainment9 = educational_attainment_map9[family_relationProfile9.highest_educational_attainment_id ?? 0] || ""; 


  //ANTAS NG EDUKASYON 9
  pages[4].drawText(`${educational_attainment9.toString().toUpperCase()}`, {
    x: 763,
    y: 304,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });
//TRABAHO 9
const work_cfw9 = `${family_relationProfile9.work?.toString().toUpperCase()}`;
const worK_charSize9 = 15;
const work_cfw_result9 = [];
for (let i = 0; i < work_cfw9.toString().toUpperCase().length; i += worK_charSize9) {
  work_cfw_result9.push(work_cfw9.slice(i, i + worK_charSize9));
}
for(let i = 0; i < work_cfw_result9.length; i++){
pages[4].drawText(`${work_cfw_result9[i].toString().toUpperCase()}`, {
  x: 763 - (-9 * i),
  y: 374,
  size: 5,
  color: rgb(0, 0, 0),
  rotate: degrees(90)
});
}
  //BUWANANG KITA 9
  pages[4].drawText(`${family_relationProfile9.monthly_income}`, {
  x: 763,
  y: 438,
  size: 5,
  color: rgb(0, 0, 0),
  rotate: degrees(90)
});

//NUMBER NG TELEPONO 9
pages[4].drawText(`${family_relationProfile9.contact_number?.toUpperCase()}`, {
  x: 763,
  y: 504,
  size: 5,
  color: rgb(0, 0, 0),
  rotate: degrees(90)
});

}

//===================================================================================================================================================================================================
//===================================================================================================================================================================================================
// family_relationProfile10
   
if(family_relationProfile10 !== undefined){

  const get_name_extension10 = await getOfflineExtensionLibraryOptions();
  const get_name_extension_map10 = Object.fromEntries(get_name_extension10.map((ext: { id: number; name: string }) => [ext.id, ext.name]));     
  setExtensionNames(get_name_extension_map10);
  var name_ext_10 = get_name_extension_map10[family_relationProfile10.extension_name_id ?? 0] || "";

  if(name_ext_10 == "N/A"){
    name_ext_10 = ""
  }
  let family_member_name10 = family_relationProfile10.first_name + " " +  family_relationProfile10.middle_name + " " + family_relationProfile10.last_name + "  " + name_ext_10;
  //BUONG PANGALAN 10
  pages[4].drawText(`${family_member_name10.toString().toUpperCase()}`, {
    x: 795,
    y: 26,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  const get_family_relation10 = await getOfflineLibRelationshipToBeneficiary();
  const family_relation_map10 = Object.fromEntries(get_family_relation10.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
  setExtensionNames(family_relation_map10);
  const family_relation_ext10 = family_relation_map10[family_relationProfile10.relationship_to_the_beneficiary_id ?? 0] || "";

  //RELASYON 10
  pages[4].drawText(`${family_relation_ext10.toUpperCase()}`, {
    x: 795,
    y: 148,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  //KAPANGANAKAN 10
  pages[4].drawText(`${family_relationProfile10.birthdate.toUpperCase()}`, {
    x: 795,
    y: 208,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });
  
  //EDAD 10
  pages[4].drawText(`${family_relationProfile10.age}`, {
    x: 795,
    y: 270,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  const  get_educational_attainment10 = await getOfflineLibEducationalAttainment();
  const educational_attainment_map10 = Object.fromEntries(get_educational_attainment10.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
  setExtensionNames(educational_attainment_map10);
  const educational_attainment10 = educational_attainment_map10[family_relationProfile10.highest_educational_attainment_id ?? 0] || ""; 

  //ANTAS NG EDUKASYON 10
  pages[4].drawText(`${educational_attainment10.toString().toUpperCase()}`, {
    x: 795,
    y: 304,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });


  //TRABAHO 10
  const work_cfw10 = `${family_relationProfile10.work?.toString().toUpperCase()}`;
  const worK_charSize10 = 15;
  const work_cfw_result10 = [];
  for (let i = 0; i < work_cfw10.toString().toUpperCase().length; i += worK_charSize10) {
    work_cfw_result10.push(work_cfw10.slice(i, i + worK_charSize10));
  }
  for(let i = 0; i < work_cfw_result10.length; i++){
  pages[4].drawText(`${work_cfw_result10[i].toString().toUpperCase()}`, {
    x: 795 - (-9 * i),
    y: 374,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });
  }
       
  //BUWANANG KITA 10
  pages[4].drawText(`${family_relationProfile10.monthly_income}`, {
    x: 795,
    y: 438,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

  //NUMBER NG TELEPONO 9
  pages[4].drawText(`${family_relationProfile9.contact_number?.toUpperCase()}`, {
    x: 795,
    y: 504,
    size: 5,
    color: rgb(0, 0, 0),
    rotate: degrees(90)
  });

}

//===================================================================================================================================================================================================
//===================================================================================================================================================================================================

  //left
  pages[4].drawText(cfwp_id, {
    x: 275 - cfwp_id_count,
    y: 11,
    size: 6,
    color: rgb(0, 0, 0),
  });

  //right 
  pages[4].drawText(cfwp_id, {
    x: 695 - cfwp_id_count,
    y: 11,
    size: 6,
    color: rgb(0, 0, 0),
  });
          
            let has_health_concern = firstProfile.has_immediate_health_concern;
            console.log("has_health_concern", has_health_concern);
            if(has_health_concern == true){
                pages[5].drawText('X', {
                  x: 33.5,
                  y: 522,
                  size: 6,
                  color: rgb(0, 0, 0),
                });
                pages[5].drawText(`${firstProfile.immediate_health_concern}`, {
                  x: 174,
                  y: 527.5,
                  size: 6,
                  color: rgb(0, 0, 0),
                });
            }else{        
                pages[5].drawText('X', {
                  x: 33.5,
                  y: 500.5,
                  size: 6,
                  color: rgb(0, 0, 0),
                });
            }

  //CFW TYPE 1
if(cfw_fam1 !== undefined){
  const get_cfw_type1 = await getOfflineLibProgramTypes();
  const get_cfw_map1 = Object.fromEntries(get_cfw_type1.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
  setExtensionNames(get_cfw_map1);
  const cfw_familty_type1 = get_cfw_map1[cfw_fam1.program_type_id ?? 0] || ""; 
  
  console.log('CFWP:',  get_cfw_type1);

  const str_cfw1 = cfw_familty_type1;
  const charSize1 = 38;
  const cfw_result1 = [];
 

  for (let i = 0; i < str_cfw1.length; i += charSize1) {
      cfw_result1.push(str_cfw1.slice(i, i + charSize1));
  }
  
  for(let i = 0; i < cfw_result1.length; i++){
    if(cfw_result1[i] !== undefined){
    pages[5].drawText(`${cfw_result1[i].toString().toUpperCase()}`, {
      x:29,
      y: 411 - (5 * i),
      size: 4,
      color: rgb(0, 0, 0),
    });
    }
  }

  
  // MIYEMBRO NG PAMILYA 1
  pages[5].drawText(`${family_relationProfile1.first_name.concat("  ", family_relationProfile1.middle_name, "  ", family_relationProfile1.last_name).toUpperCase()}`, {
    x: 133,
    y: 410,
    size: 5,
    color: rgb(0, 0, 0),
  });

  const get_year_serverd1 = await getOfflineLibYearServed();
  const year_served_map1 = Object.fromEntries(get_year_serverd1.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
  setExtensionNames(year_served_map1);
  const year_server_profiele1 = year_served_map1[cfw_fam1.year_served_id ?? 0] || ""; 

  // TAON 1
  pages[5].drawText(`${year_server_profiele1}`, {
    x: 331,
    y: 410,
    size: 5,
    color: rgb(0, 0, 0),
  });

  }
 // CFW TYPE 2-----------------------

 
if(cfw_fam2 !== undefined){
  const get_cfw_type2 = await getOfflineLibProgramTypes();
  const get_cfw_map2 = Object.fromEntries(get_cfw_type2.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
  setExtensionNames(get_cfw_map2);
  const cfw_familty_type2 = get_cfw_map2[cfw_fam2.program_type_id ?? 0] || ""; 

  const str_cfw2 = cfw_familty_type2;
  const charSize2 = 38;
  const cfw_result2 = [];

  for (let i = 0; i < str_cfw2.length; i += charSize2) {
      cfw_result2.push(str_cfw2.slice(i, i + charSize2));
  }
  
  for(let i = 0; i < cfw_result2.length; i++){
    if(cfw_result2[i] !== undefined){
    pages[5].drawText(`${cfw_result2[i].toString().toUpperCase()}`, {
      x:29,
      y: 393 - (5 * i),
      size: 4,
      color: rgb(0, 0, 0),
    });
    }
  }

  //MIYEMBRO NG PAMILYA 2
    pages[5].drawText(`${family_relationProfile2.first_name.concat("  ", family_relationProfile2.middle_name, "  ", family_relationProfile2.last_name).toUpperCase()}`, {
    x: 133,
    y: 392,
    size: 5,
    color: rgb(0, 0, 0),
  });

  const get_year_serverd2 = await getOfflineLibYearServed();
  const year_served_map2 = Object.fromEntries(get_year_serverd2.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
  setExtensionNames(year_served_map2);
  const year_server_profiele2 = year_served_map2[cfw_fam2.year_served_id ?? 0] || ""; 
      
  //TAON 2
  pages[5].drawText(`${year_server_profiele2}`, {
    x: 331,
    y: 392,
    size: 5,
    color: rgb(0, 0, 0),
  });
  

}
// CFW TYPE 3

if(cfw_fam3 !== undefined){
  const get_cfw_type3 = await getOfflineLibProgramTypes();
  const get_cfw_map3 = Object.fromEntries(get_cfw_type3.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
  setExtensionNames(get_cfw_map3);
  const cfw_familty_type3 = get_cfw_map3[cfw_fam3.program_type_id ?? 0] || ""; 
  const str_cfw3 = cfw_familty_type3;
  const charSize3 = 38;
  const cfw_result3 = [];

  for (let i = 0; i < str_cfw3.length; i += charSize3) {
      cfw_result3.push(str_cfw3.slice(i, i + charSize3));
  }
  
  for(let i = 0; i < cfw_result3.length; i++){
    if(cfw_result3[i] !== undefined){
    pages[5].drawText(`${cfw_result3[i].toString().toUpperCase()}`, {
      x:29,
      y: 374 - (5 * i),
      size: 4,
      color: rgb(0, 0, 0),
    });
    }
  }

  //MIYEMBRO NG PAMILYA 3
  pages[5].drawText(`${family_relationProfile3.first_name.concat("  ", family_relationProfile3.middle_name, "  ", family_relationProfile3.last_name).toUpperCase()}`, {
    x: 133,
    y: 374,
    size: 5,
    color: rgb(0, 0, 0),
  });

  const get_year_serverd3 = await getOfflineLibYearServed();
  const year_served_map3 = Object.fromEntries(get_year_serverd3.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
  setExtensionNames(year_served_map3);
  const year_server_profiele3 = year_served_map3[cfw_fam3.year_served_id ?? 0] || ""; 

  //TAON 3
  pages[5].drawText(`${year_server_profiele3}`, {
    x: 331,
    y: 374,
    size: 5,
    color: rgb(0, 0, 0),
  });
}

  // URI NG CFWP 1

  // pages[5].drawText(``, {
  //   x:29,
  //   y: 400,
  //   size: 5,
  //   color: rgb(0, 0, 0),
  // });

  // //URI NG CFWP 2
  // pages[5].drawText('N/A', {
  //   x:29,
  //   y: 392,
  //   size: 5,
  //   color: rgb(0, 0, 0),
  // });

    //PAARALAN
    const get_school = await getOfflineLibSchools();
    const school_map = Object.fromEntries(get_school.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
    setSchoolNames(school_map);
    const schoolName = school_map[firstProfile.school_id ?? 0] || "";
    pages[5].drawText(`${schoolName.toUpperCase()}`, {
      x: 29,
      y: 342,
      size: 6,
      color: rgb(0, 0, 0),
    });

  // //MAIN CAMPUS
  // pages[5].drawText('X', {
  //   x: 311,
  //   y: 338,
  //   size: 6,
  //   color: rgb(0, 0, 0),
  // });

  // //OTHER CAMPUS
  // pages[5].drawText('X', {
  //   x: 311,
  //   y: 322,
  //   size: 6,
  //   color: rgb(0, 0, 0),
  // });
            
  //ADDRESS NG PAARALAN
  pages[5].drawText(`${firstProfile.school_address.toUpperCase()}`, {
  x: 29,
  y: 291,
  size: 6,
  color: rgb(0, 0, 0),
});

//KURSO
const get_course = await getOfflineLibCourses();
const course_map = Object.fromEntries(get_course.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
setExtensionNames(course_map);
            console.log("Course", course_map);
const course_ext = course_map[firstProfile.course_id ?? 0] || ""; 
pages[5].drawText(`${course_ext.toUpperCase()}`, {
  x: 29,
  y: 245,
  size: 6,
  color: rgb(0, 0, 0),
});

  //YEAR GRADUATED
  pages[5].drawText(`${firstProfile.year_graduated}`, {
  x: 219,
  y: 245,
  size: 6,
  color: rgb(0, 0, 0),
});

  //YEAR LEVEL
  pages[5].drawText('N/A', {
  x: 306,
  y: 245,
  size: 6,
  color: rgb(0, 0, 0),
});

  //let skills[5];
  let skills = firstProfile.skills.toString().toUpperCase().split(",");
  //MGA KAKAYAHAN 1
  if(skills[0] !== undefined){
  pages[5].drawText(`${skills[0].toString()}`, {
    x: 29,
    y: 181.5,
    size: 6,
    color: rgb(0, 0, 0),
  });
  }

  //MGA KAKAYAHAN 2
  if(skills[1] !== undefined){
    pages[5].drawText(`${skills[1].toString()}`, {
      x: 29,
      y: 161,
      size: 6,
      color: rgb(0, 0, 0),
    });
  }
               
  //MGA KAKAYAHAN 3
  if(skills[2] !== undefined){
    pages[5].drawText(`${skills[2]}`, {
    x: 29,
    y: 139.5,
    size: 6,
    color: rgb(0, 0, 0),
  });
  }

  //MGA KAKAYAHAN 4
  if(skills[3] !== undefined){
  pages[5].drawText(`${skills[3]}`, {
    x: 148,
    y: 181.5,
    size: 6,
    color: rgb(0, 0, 0),
  });
  }

  //MGA KAKAYAHAN 5
  if(skills[4] !== undefined){
  pages[5].drawText(`${skills[4]}`, {
    x: 148,
    y: 161,
    size: 6,
    color: rgb(0, 0, 0),
  });
  }
  //MGA KAKAYAHAN 6
  if(skills[5] !== undefined){
  pages[5].drawText(`${skills[5]}`, {
    x: 148,
    y: 139.5,
    size: 6,
    color: rgb(0, 0, 0),
  });
  }
                
  //CERTIFICATE OF ELIGIBILITY
  pages[5].drawText('', {
    x: 386.5,
    y: 151.5,
    size: 6,
    color: rgb(0, 0, 0),
  });

  //CERTIFICATE OF INDIGENCY
  pages[5].drawText('X', {
    x: 386.5,
    y: 123.5,
    size: 6,
    color: rgb(0, 0, 0),
  });

    //PROOF OF GRADUATION 
    pages[5].drawText('', {
      x: 386.5,
      y: 93.5,
      size: 6,
      color: rgb(0, 0, 0),
    });

    //PROOF OF ENROLLMENT
    pages[5].drawText('', {
      x: 386.5,
      y: 65.5,
      size: 6,
      color: rgb(0, 0, 0),
    });

    //VALID OF IDENTIFICATION CARD
    pages[5].drawText('X', {
      x: 386.5,
      y: 37.5,
      size: 6,
      color: rgb(0, 0, 0),
    });
          
          //NAME OF OFFICER AND ADDRESS
          let deployment_name_address = firstProfile.deployment_area_name + ' / ' + firstProfile.deployment_area_address
          pages[5].drawText(deployment_name_address.toUpperCase(), {
            x: 29,
            y: 107.5,
            size: 6,
            color: rgb(0, 0, 0),
          });

          const get_type_of_work = await getOfflineLibTypeOfWork();
          const type_of_work_map = Object.fromEntries(get_type_of_work.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
          setExtensionNames(type_of_work_map);
          console.log("Type of Work", type_of_work_map);
          const type_of_work_ext = type_of_work_map[firstProfile.preffered_type_of_work_id ?? 0] || ""; 
          //PREFERRED TYPE OF WORK 

          
          pages[5].drawText(`${type_of_work_ext.toUpperCase()}`, {
            x: 29,
            y: 63.5,
            size: 6,
            color: rgb(0, 0, 0),
          });
              
            pages[5].drawText(cfwp_id, {
              x: 699 - cfwp_id_count,
              y: 12,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[5].drawText(cfwp_id, {
              x: 275 - cfwp_id_count,
              y: 12,
              size: 6,
              color: rgb(0, 0, 0),
            });

            console.log("Page 5 Done");
          /*

            // PAGE 6
            //MONTH
            pages[6].drawText(res[1], { 
              x: 451,
              y: 418,
              size: 6,
              color: rgb(0, 0, 0),
            });
            //DAY
            pages[6].drawText(res[2], { 
              x: 482,
              y: 418,
              size: 6,
              color: rgb(0, 0, 0),
            });
            //YEAR
            pages[6].drawText(res[0], { 
              x: 517,
              y: 418,
              size: 6,
              color: rgb(0, 0, 0),
            });
            //AGE
            pages[6].drawText(`${firstProfile.age}`, { 
              x: 563,
              y: 402,
              size: 6,
              color: rgb(0, 0, 0),
            });
            let gender = firstProfile.sex_id;
            //LALAKE
            if(gender == 2){
              pages[6].drawText('x', { 
                x: 590.5,
                y: 413.5,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }
            else{
              pages[6].drawText('', { 
                x: 590.5,
                y: 413.5,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }

            //BABAE
            if(gender == 1){
              pages[6].drawText('x', { 
                x: 590.5,
                y: 394,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }else{
              pages[6].drawText('', { 
                x: 590.5,
                y: 394,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }

            //CONTACT NUMBER
            pages[6].drawText(`${firstProfile.cellphone_no}`, { 
              x: 651,
              y: 417,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //RELASYON SA BENEPISYARYO
            pages[6].drawText('N/A', { 
              x: 723,
              y: 417,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //KASALUKUYANG TIRAHAN
            pages[6].drawText(`${firstProfile.sitio_present_address}`, { 
              x: 451,
              y: 452,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //LAST NAME
            pages[6].drawText(`${firstProfile.last_name.toUpperCase()}`, { 
              x: 451,
              y: 526,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //FIRST NAME
            pages[6].drawText(`${firstProfile.first_name.toUpperCase()}`, { 
              x: 562,
              y: 526,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //MIDDLE NAME
            pages[6].drawText(`${firstProfile.middle_name.toUpperCase()}`, { 
              x: 678,
              y: 526,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //NAME EXT
            pages[6].drawText(`${name_ext}`, { 
              x: 784,
              y: 526,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //ANTAS NG EDUKASYON
            pages[6].drawText(`n`, {
              x: 451,
              y: 352,
              size: 6,
              color: rgb(0, 0, 0),
            });

              //TRABAHO
              pages[6].drawText('N/A', {
                x: 651,
                y: 352,
                size: 6,
                color: rgb(0, 0, 0),
              });

              //BUWANANG KITA
              pages[6].drawText('N/A', {
                x: 722,
                y: 352,
                size: 6,
                color: rgb(0, 0, 0),
              });

            //SINGLE
            if(civil == 4){
              pages[6].drawText('x', {
                x: 466,
                y: 277.5,
                size: 6,
                color: rgb(0, 0, 0),
              });

            }
            else{
              pages[6].drawText('', {
                x: 466,
                y: 277.5,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }
            

            //ANNULLED
            if(civil == 1)
            {
              pages[6].drawText('x', {
                x: 553.5,
                y: 277.5,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }else{
              pages[6].drawText('', {
                x: 553.5,
                y: 277.5,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }
            

            //MARREID
            if(civil == 3){
              pages[6].drawText('x', {
                x: 466,
                y: 265,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }else{
              pages[6].drawText('', {
                x: 466,
                y: 265,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }
            

            //SEPARATED
            if(civil == 2){
              pages[6].drawText('x', {
                x: 553.5,
                y: 265,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }else{
              pages[6].drawText('', {
                x: 553.5,
                y: 265,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }
            //WIDOW / WIDOWER
            if(civil == 5){ 
              pages[6].drawText('x', {
                x: 466,
                y: 251.5,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }else{
              pages[6].drawText('', {
                x: 466,
                y: 251.5,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }
              

            //COMMON LAW
            pages[6].drawText('', {
              x: 553.5,
              y: 251.5,
              size: 6,
              color: rgb(0, 0, 0),
            });
            
            //IDENTIFICATION CARD
              pages[6].drawText(`${ID_INFO.toString().toUpperCase()}`, {
                x: 651,
                y: 282,
                size: 6,
                color: rgb(0, 0, 0),
              });

            // Use the mapped name directly when drawing the PDF
              pages[6].drawText(`${firstProfile.representative_id_card_number}`, {
                x: 638,
                y: 282,
                size: 6,
                color: rgb(0, 0, 0),
              });
        
        
            // KAKAYAHAN NG KINATAWAN 1
            pages[6].drawText('N/A', {
              x: 451.5,
              y: 208,
              size: 6,
              color: rgb(0, 0, 0),
            });

              // KAKAYAHAN NG KINATAWAN 2
              pages[6].drawText('N/A', {
                x: 451.5,
                y: 187.5,
                size: 6,
                color: rgb(0, 0, 0),
              });

              // KAKAYAHAN NG KINATAWAN 3
              pages[6].drawText('N/A', {
                x: 451.5,
                y: 165.5,
                size: 6,
                color: rgb(0, 0, 0),
              });

              // KAKAYAHAN NG KINATAWAN 4
              pages[6].drawText('N/A', {
                x: 570,
                y: 208,
                size: 6,
                color: rgb(0, 0, 0),
              });

                // KAKAYAHAN NG KINATAWAN 5
                pages[6].drawText('N/A', {
                  x: 570,
                  y: 187.5,
                  size: 6,
                  color: rgb(0, 0, 0),
                });

                // KAKAYAHAN NG KINATAWAN 6
                pages[6].drawText('N/A', {
                  x: 570,
                  y: 165,
                  size: 6,
                  color: rgb(0, 0, 0),
                });
              
            // oo
            pages[6].drawText('X', {
              x: 455.5,
              y: 98,
              size: 6,
              color: rgb(0, 0, 0),
            });

            // hindi
            pages[6].drawText('X', {
              x: 573,
              y: 98,
              size: 6,
              color: rgb(0, 0, 0),
            });

            // please specify
            pages[6].drawText('N/A', {
              x: 535,
              y: 86,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //L/C/MSWDO
            pages[6].drawText('X', {
              x: 807.5,
              y: 150,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //BLGU
            pages[6].drawText('X', {
              x: 807.5,
              y: 123,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //valid id of beneficiaries
            pages[6].drawText('X', {
              x: 807.5,
              y: 93,
              size: 6,
              color: rgb(0, 0, 0),
            }); 

            //valid id of representative
            pages[6].drawText('X', {
              x: 807.5,
              y: 64.5,
              size: 6,
              color: rgb(0, 0, 0),
            });
          

            //other submitted documents
            pages[6].drawText('X', {
              x: 807.5,
              y: 36.5,
              size: 6,
              color: rgb(0, 0, 0),
            });*/

            pages[6].drawText(cfwp_id, {
              x: 699 - cfwp_id_count,
              y: 12,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[6].drawText(cfwp_id, {
              x: 275 - cfwp_id_count,
              y: 12,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //eligible
            pages[7].drawText('X', {
              x: 38.5,
              y: 532,
              size: 9,
              color: rgb(0, 0, 0),
            });

            //ineligible
            pages[7].drawText('', {
              x: 223,
              y: 532,
              size: 9,
              color: rgb(0, 0, 0),
            });

            pages[7].drawText(cfwp_id, {
              x: 699 - cfwp_id_count,
              y: 12,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[7].drawText(cfwp_id, {
              x: 275 - cfwp_id_count,
              y: 12,
              size: 6,
              color: rgb(0, 0, 0),
            });

            console.log("Page 7 Done");

            let full_name_count_9 = full_name.length;
            pages[8].drawText( full_name.toString().toUpperCase(), {
              
              x: 535 - (full_name_count_9 * 1.9) ,
              y: 271,
              size: 6,
              color: rgb(0, 0, 0),

            });

            pages[8].drawText(cfwp_id, {
              x: 699 - cfwp_id_count,
              y: 15,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[8].drawText(cfwp_id, {
              x: 275 - cfwp_id_count,
              y: 15,
              size: 6,
              color: rgb(0, 0, 0),
            });
            
            console.log("Page 8 Done");

            pages[9].drawText(cfwp_id, {
              x: 280 - cfwp_id_count,
              y: 13,
              size: 6,
              color: rgb(0, 0, 0),
            });

              //eligible
              pages[10].drawText('X', {
                x: 38.5,
                y: 532,
                size: 9,
                color: rgb(0, 0, 0),
              });
  
              //ineligible
              pages[10].drawText('', {
                x: 223,
                y: 532,
                size: 9,
                color: rgb(0, 0, 0),
              });
  
              pages[10].drawText(cfwp_id, {
                x: 699 - cfwp_id_count,
                y: 13,
                size: 6,
                color: rgb(0, 0, 0),
              });
  
              pages[10].drawText(cfwp_id, {
                x: 275 - cfwp_id_count,
                y: 13,
                size: 6,
                color: rgb(0, 0, 0),
              });

            console.log("Page 9 Done");

            
          /// Fetch data from Dexie.js
            // const lib_card = await dexieDb.lib_relationship_to_beneficiary.toArray();
            // const lcard = lib_card[0]; // Use the first record for this example
            // console.log(lcard);

            // Save the document
            const pdfBytes = await pdfDoc.save();
            console.log("PDF generated successfully");

            // Convert to Blob and create a downloadable link
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            console.log("Blob created successfully");
            // Create a Blob and open it in a new tab
            const blobUrl = URL.createObjectURL(blob);
            console.log("Blob URL created successfully");
          // Auto-open the PDF
            window.open(blobUrl, '_blank');
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "profile.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating PDF:", error);
      console.log("Error generating PDF:", error);
    } finally {
      setLoading(false);
      setGenerated(false);
    }
  };

    return (
      <div>
        {/* <button onClick={generatePdf} disabled={loading} className="btn btn-primary">
          {loading ? "Generating Booklet..." : "Download Booklet"}
        </button> */}
        <Button variant="outline" onClick={generatePdf} disabled={loading}>
          {loading ? "Generating PDF..." : "Download PDF"}
        </Button>
      </div>
    )
};
export default GeneratePDF;
