import { fetchPIMS } from "@/components/_dal/libraries"; //region to
import { fetchPIMSProvince } from "@/components/_dal/libraries";
import { fetchPIMSCity } from "@/components/_dal/libraries";
import { fetchPIMSBrgy } from "@/components/_dal/libraries";

import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getCivilStatusLibraryOptions, getEducationalAttainmentLibraryOptions, getExtensionNameLibraryOptions, getIDCardLibraryOptions, getRelationshipToBeneficiaryLibraryOptions, getSexLibraryOptions } from "@/components/_dal/options";
import { getOfflineCivilStatusLibraryOptions, getOfflineExtensionLibraryOptions, getOfflineLibEducationalAttainment, getOfflineLibIdCard, getOfflineLibRelationshipToBeneficiary, getOfflineLibSexOptions } from "@/components/_dal/offline-options";
import { IPersonProfile } from "@/components/interfaces/personprofile";


export default function PWDRepresentative({ errors, capturedData }: { errors: any; capturedData: Partial<IPersonProfile>; }) {

    const [cfwPWDRepresentative, setCfwPWDRepresentative] = useState(() => {
        if (globalThis.window) {
            const storedCFWPWDRepresentative = localStorage.getItem("cfwPWDRepresentative");
            return storedCFWPWDRepresentative ? JSON.parse(storedCFWPWDRepresentative) : {};
        }
        return {};
    })

    useEffect(() => {
        localStorage.setItem("cfwPWDRepresentative", JSON.stringify(cfwPWDRepresentative));
    }, [cfwPWDRepresentative]);

    const updatingCfwPWDRepresentative = (field: any, value: any) => {
        setCfwPWDRepresentative((prev: any) => ({
            ...prev, [field]: value
        }));
    }



    const [cfwOptions, setCfwOptions] = useState<LibraryOption[]>([]);
    const [selectedCfwCategory, setSelectedCfwCategory] = useState("");
    const [selectedHealthConcern, setSelectedHealthConcern] = useState("");

    const [extensionNameOptions, setExtensionNameOptions] = useState<LibraryOption[]>([]);
    const [selectedExtensionNameId, setSelectedExtensionNameId] = useState<number | null>(null);
    const [selectedExtensionName, setSelectedExtensionName] = useState("");

    const [civilStatusOptions, setCivilStatusOptions] = useState<LibraryOption[]>([]);
    const [selectedCivilStatus, setSelectedCivilStatus] = useState("");
    const [selectedCivilStatusId, setSelectedCivilStatusId] = useState<number | null>(null);

    const [educationalAttainmentOptions, setEducationalAttainmentOptions] = useState<LibraryOption[]>([]);
    const [selectedEducationalAttainment, setSelectedEducationalAttainment] = useState("");
    const [selectedEducationalAttainmentId, setSelectedEducationalAttainmentId] = useState<number | null>(null);

    const [iDCardOptions, setIDCardOptions] = useState<LibraryOption[]>([]);
    const [selectedIDCard, setSelectedIDCard] = useState("");
    const [selectedIDCardId, setSelectedIDCardId] = useState<number | null>(null);

    const [regionOptions, setRegionOptions] = useState<LibraryOption[]>([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

    const [provinceOptions, setProvinceOptions] = useState<LibraryOption[]>([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);

    const [BarangayOptions, setBarangayOptions] = useState<LibraryOption[]>([]);
    const [selectedBarangay, setSelectedBarangay] = useState("");
    const [selectedBarangayId, setSelectedBarangayId] = useState<string | null>(null);

    const [cityOptions, setCityOptions] = useState<LibraryOption[]>([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

    const [sexOptions, setSexOptions] = useState<LibraryOption[]>([]);
    const [selectedSex, setSelectedSex] = useState("");
    const [selectedSexId, setSelectedSexId] = useState<number | null>(null);

    const [relationshipToBeneficiaryOptions, setRelationshipToBeneficiaryOptions] = useState<LibraryOption[]>([]);
    const [selectedRelationshipToBeneficiary, setSelectedRelationshipToBeneficiary] = useState("");
    const [selectedRelationshipToBeneficiaryId, setSelectedRelationshipToBeneficiaryId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sex = await getOfflineLibSexOptions();//await getSexLibraryOptions();
                setSexOptions(sex);

                const representative_civil_status_id = await getOfflineCivilStatusLibraryOptions();//await getCivilStatusLibraryOptions();
                setCivilStatusOptions(representative_civil_status_id);

                // const modality = await getModalityLibraryOptions();
                // setModalityOptions(modality);

                const representative_extension_name_id = await getOfflineExtensionLibraryOptions();//await getExtensionNameLibraryOptions();
                setExtensionNameOptions(representative_extension_name_id);

                const educational_attainment = await getOfflineLibEducationalAttainment();//await getEducationalAttainmentLibraryOptions();
                setEducationalAttainmentOptions(educational_attainment);

                const id_card = await getOfflineLibIdCard();//await getIDCardLibraryOptions();
                setIDCardOptions(id_card);

                const relationship_to_beneficiary_id = await getOfflineLibRelationshipToBeneficiary(); //await getRelationshipToBeneficiaryLibraryOptions();
                setRelationshipToBeneficiaryOptions(relationship_to_beneficiary_id);

                // const region = await fetchPIMS();
                // // Ensure the response has data and map it to LibraryOption format
                // const mappedRegions: LibraryOption[] = region.map((item: any) => ({
                //     id: item.Id,         // Assuming 'id' exists in fetched data
                //     name: item.Name,     // Assuming 'name' exists in fetched data
                // }));

                //setRegionOptions(mappedRegions); // Update state with mapped data

                // 
                // const province = await fetchPIMSProvince();

                // const mappedProvince: LibraryOption[] = province.map((item: any) => ({
                //     id: item.Id,
                //     name: item.Name,
                // }));

                //setProvinceOptions(mappedProvince);

                // const city = await fetchPIMSCity();

                // const mappedCity: LibraryOption[] = city.map((item: any) => ({
                //     id: item.Id,
                //     name: item.Name,
                // }));

                //setCityOptions(mappedCity);

                // const barangay = await fetchPIMSBrgy();

                // const mappedBarangay: LibraryOption[] = barangay.map((item: any) => ({
                //     id: item.Id,
                //     name: item.Name,
                // }));

                // setBarangayOptions(mappedBarangay);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    // 



    const handlRelationshipToBeneficiaryChange = (id: number) => {
        console.log("Selected Relationship to beneficiary ID:", id);
        updatingCfwPWDRepresentative("representative_relationship_to_beneficiary", id);
        setSelectedRelationshipToBeneficiaryId(id);
    };
    const handlExtensionNameChange = (id: number) => {
        console.log("Selected Extension name ID:", id);
        updatingCfwPWDRepresentative("representative_extension_name_id", id);
        setSelectedExtensionNameId(id);
    };
    const handleCivilStatusChange = (id: number) => {
        console.log("Selected Civil Status ID:", id);
        updatingCfwPWDRepresentative("representative_civil_status_id", id);
        setSelectedCivilStatusId(id);
    };
    const handleRegionChange = (id: string) => {
        console.log("Selected Region ID:", id);
        updatingCfwPWDRepresentative("representative_region_code", id);
        setSelectedRegionId(id);
    };
    const handleProvinceChange = (id: string) => {
        console.log("Selected Province ID:", id);
        updatingCfwPWDRepresentative("representative_province_code", id);
        setSelectedProvinceId(id);
    };
    const handleCityChange = (id: string) => {
        console.log("Selected City ID:", id);
        updatingCfwPWDRepresentative("representative_city_code", id);
        setSelectedCityId(id);
    };
    const handleBarangayChange = (id: string) => {
        console.log("Selected Barangay ID:", id);
        updatingCfwPWDRepresentative("representative_brgy_code", id);
        setSelectedBarangayId(id);
    };
    const handleSexChange = (id: number) => {
        console.log("Selected Sex ID:", id);
        updatingCfwPWDRepresentative("representative_sex_id", id);
        setSelectedSexId(id);
    };
    const handleEducationalAttainmentChange = (id: number) => {
        console.log("Selected Educational Attainment ID:", id);
        updatingCfwPWDRepresentative("representative_educational_attainment_id", id);
        setSelectedEducationalAttainmentId(id);
    };
    const [dob, setDob] = useState<string>("");
    const [age, setAge] = useState<number | "">("");
    const handleDOBChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.value;
        updatingCfwPWDRepresentative("representative_birthdate", selectedDate);
        setDob(selectedDate);
        computeAge(selectedDate);
    };
    const computeAge = (dob: string) => {
        if (!dob) {
            setAge(0);
            return;
        }

        const birthDate = new Date(dob);
        const today = new Date();

        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        // Adjust age if birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            calculatedAge--;
        }

        updatingCfwPWDRepresentative("representative_age", calculatedAge);
        setAge(calculatedAge);
    };
    const handleCfwCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedCfwCategory(event.target.value);
        if (event.target.value === "no") {
            (document.getElementById("health_concerns_details") as HTMLTextAreaElement).value = "";
        }
    };
    const handleHealthConcernChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSelectedHealthConcern(value);

        if (value === "no") {
            // updatingCfwPWDRepresentative( "representative_has_health_concern", 0);
            // updatingCfwPWDRepresentative( "immediate_health_concern_details", ""); // Clear health concern details
            updatingCfwPWDRepresentative('representative_health_concern_details', "")
            updatingCfwPWDRepresentative("representative_has_health_concern", 0);
        } else {
            // updatingCfwPWDRepresentative( "has_immediate_health_concern", 1);
            // Updating cfw at index 4
            updatingCfwPWDRepresentative("representative_has_health_concern", 1);
        }
        setSelectedHealthConcern(value);
        console.log("representative health concern?: " + value);
        if (event.target.value === "no") {
            (document.getElementById("representative_health_concern_details") as HTMLTextAreaElement).value = "";
        }
    };
    const handleIDCardChange = (id: number) => {
        console.log("Selected ID Card ID:", id);
        updatingCfwPWDRepresentative("representative_id_card_id", id);
        setSelectedIDCardId(id);
    };

    const [isPWDRepresentative, setIsPWDRepresentative] = useState(false);
    const handleCheckIsPWDRepresentative = () => {
        updatingCfwPWDRepresentative("is_cfw_representative", !isPWDRepresentative);
        // const cfwGeneralInfo = localStorage.getItem("cfwGeneralInfo");
        // if (cfwGeneralInfo) {

        //     const parsedcfwGeneralInfo = JSON.parse(cfwGeneralInfo);

        // }

        setIsPWDRepresentative(!isPWDRepresentative);
        // console.log("is PWD Rep? ", !isPWDRepresentative);
    }
    return (
        <>
            <div className="">
                <div className="flex items-center gap-2 p-3">
                    <Input
                        type="checkbox"
                        id="is_cfw_pwd_representative"
                        checked={cfwPWDRepresentative.is_cfw_representative}
                        onChange={handleCheckIsPWDRepresentative}
                        className="w-4 h-4 cursor-pointer" />
                    <label
                        htmlFor="is_cfw_pwd_representative"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70  cursor-pointer"
                    >
                        Are you the CFW PWD Representative?
                    </label>
                </div>

                <div className={`grid sm:grid-cols-4 sm:grid-rows-1 mb-2   ${cfwPWDRepresentative.is_cfw_representative === true ? "" : "hidden"}`}>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_last_name" className="block text-sm font-medium">Last Name</Label>
                        <Input
                            value={cfwPWDRepresentative.representative_last_name.toUpperCase() || ""}
                            // value={cfwPWDRepresentative.representative_last_name}
                            onChange={(e) => updatingCfwPWDRepresentative('representative_last_name', e.target.value)}
                            // onChange={(e) => updatingCfwPWDRepresentative( 'representative_last_name', e.target.value)}
                            id="representative_last_name"
                            name="representative_last_name"
                            className="mt-1 block w-full"
                        />
                        {errors?.representative_last_name && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_last_name}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_first_name" className="block text-sm font-medium">First Name</Label>
                        <Input
                            value={cfwPWDRepresentative.representative_first_name.toUpperCase() || ""}
                            // value={cfwPWDRepresentative.representative_first_name}
                            onChange={(e) => updatingCfwPWDRepresentative('representative_first_name', e.target.value)}
                            // onChange={(e) => updatingCfwPWDRepresentative( 'representative_first_name', e.target.value)}
                            id="representative_first_name"
                            name="representative_first_name"
                            className="mt-1 block w-full"
                        />
                        {errors?.representative_first_name && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_first_name}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_middle_name" className="block text-sm font-medium">Middle Name</Label>
                        <Input
                            value={cfwPWDRepresentative.representative_middle_name.toUpperCase() || ""}
                            id="representative_middle_name"
                            name="representative_middle_name"
                            className="mt-1 block w-full"
                            onChange={(e) => updatingCfwPWDRepresentative('representative_middle_name', e.target.value)}
                        />
                        {errors?.representative_middle_name && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_middle_name}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_extension_name_id" className="block text-sm font-medium mb-1 ">Extension Name</Label>
                        <FormDropDown
                            options={extensionNameOptions}
                            selectedOption={cfwPWDRepresentative.representative_extension_name_id || ""}
                            onChange={handlExtensionNameChange}
                            
                        />
                        {errors?.representative_extension_name_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_extension_name_id}</p>
                        )}
                    </div>

                    <div className="p-2 col-span-1">
                        <Label htmlFor="region_representative" className="block text-sm font-medium mt-1">Region</Label>
                        <FormDropDown
                            selectedOption={cfwPWDRepresentative.representative_region_code || ""}
                            onChange={handleRegionChange}
                            id="region_representative"
                            options={regionOptions}
                        />
                        {errors?.region_representative && (
                            <p className="mt-2 text-sm text-red-500">{errors.region_representative}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="province_representative" className="block text-sm font-medium  mt-1 ">Province</Label>
                        <FormDropDown
                            selectedOption={cfwPWDRepresentative.representative_province_code || ""}
                            id="province_representative"
                            options={provinceOptions}
                            // selectedOption={selectedProvinceId}
                            onChange={handleProvinceChange}
                        />
                        {errors?.province && (
                            <p className="mt-2 text-sm text-red-500">{errors.province}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="municipality_representative" className="block text-sm font-medium mt-1 ">Municipality</Label>
                        <FormDropDown
                            id="municipality_representative"
                            options={cityOptions}
                            selectedOption={cfwPWDRepresentative.representative_city_code || ""}
                            onChange={handleCityChange}
                        />
                        {errors?.municipality_representative && (
                            <p className="mt-2 text-sm text-red-500">{errors.municipality_representative}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_brgy_code" className="block text-sm font-medium mt-1 ">Barangay</Label>
                        <FormDropDown
                            id="representative_brgy_code"
                            options={BarangayOptions}
                            // selectedOption={selectedBarangayId}
                            selectedOption={cfwPWDRepresentative.representative_brgy_code || ""}
                            onChange={handleBarangayChange}
                        />
                        {errors?.representative_brgy_code && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_brgy_code}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_sitio" className="block text-sm font-medium">House No/Street/Purok</Label>
                        <Input
                            value={cfwPWDRepresentative.representative_sitio || ""}
                            onChange={(e) => updatingCfwPWDRepresentative('representative_sitio', e.target.value)}
                            id="representative_sitio"
                            name="representative_sitio"
                            
                        />
                        {errors?.representative_sitio && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_sitio}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_relationship_to_beneficiary" className="block text-sm font-medium">Relationship to Beneficiary</Label>
                        <FormDropDown
                            options={relationshipToBeneficiaryOptions}
                            selectedOption={cfwPWDRepresentative.representative_relationship_to_beneficiary}
                            onChange={handlRelationshipToBeneficiaryChange}
                            id="representative_relationship_to_beneficiary"
                        />


                        {errors?.representative_relationship_to_beneficiary && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_relationship_to_beneficiary}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_birthdate" className="block text-sm font-medium">Birthday</Label>
                        <Input
                            value={cfwPWDRepresentative.representative_birthdate || ""}
                            onChange={handleDOBChange}
                            id="representative_birthdate"
                            name="representative_birthdate"
                            type='date'  
                        />
                        {errors?.representative_birthdate && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_birthdate}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_age" className="block text-sm font-medium">Age</Label>
                        <Input
                            value={cfwPWDRepresentative.representative_age || ""}
                            id="representative_age"
                            name="representative_age"
                            type="number"
                            placeholder="0"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-center"
                            // value={age}
                            disabled

                        />
                        {errors?.representative_age && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_age}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_occupation" className="block text-sm font-medium">Work (if available)</Label>
                        <Input
                            value={cfwPWDRepresentative.representative_occupation || ""}
                            onChange={(e) => updatingCfwPWDRepresentative('representative_occupation', e.target.value.toUpperCase())}
                            id="representative_occupation"
                            name="representative_occupation"
                            className="mt-1 block w-full"
                        />
                        {errors?.representative_occupation && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_occupation}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_monthly_salary" className="block text-sm font-medium">Monthly Salary</Label>
                        <Input
                            value={cfwPWDRepresentative.representative_monthly_salary || ""}
                            type="number"
                            id="representative_monthly_salary"
                            name="monthly_salary"
                            className="mt-1 block w-full"
                            onChange={(e) => updatingCfwPWDRepresentative('representative_monthly_salary', e.target.value)}
                        />
                        {errors?.representative_monthly_salary && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_monthly_salary}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_educational_attainment_id" className="block text-sm font-medium">Highest Educational Attainment</Label>

                        <FormDropDown
                            selectedOption={cfwPWDRepresentative.representative_educational_attainment_id || ""}
                            id="representative_educational_attainment_id"
                            options={educationalAttainmentOptions}
                            // selectedOption={selectedEducationalAttainmentId}
                            onChange={handleEducationalAttainmentChange}
                        />

                        {errors?.representative_educational_attainment_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_educational_attainment_id}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_sex_id" className="block text-sm font-medium">Sex</Label>
                        <FormDropDown

                            id="representative_sex_id"
                            options={sexOptions}
                            selectedOption={cfwPWDRepresentative.representative_sex_id || ""}
                            onChange={handleSexChange}
                        />
                        {errors?.representative_sex_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_sex_id}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_contact_number" className="block text-sm font-medium">Contact Number</Label>
                        <Input
                            value={cfwPWDRepresentative.representative_contact_number || ""}
                            id="representative_contact_number"
                            name="representative_contact_number"
                            className="mt-1 block w-full"
                            onChange={(e) => updatingCfwPWDRepresentative('representative_contact_number', e.target.value)} />
                        {errors?.representative_contact_number && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_contact_number}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_id_card_id" className="block text-sm font-medium">ID Card</Label>
                        <FormDropDown
                            id="representative_id_card_id"
                            options={iDCardOptions}
                            selectedOption={cfwPWDRepresentative.representative_id_card_id || ""}
                            onChange={handleIDCardChange}
                        />
                        {errors?.representative_id_card_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_id_card_id}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_id_card_number" className="block text-sm font-medium">ID Card Number</Label>
                        <Input
                            value={cfwPWDRepresentative.representative_id_card_number || ""}
                            id="representative_id_card_number"
                            name="representative_id_card_number"
                            className="mt-1 block w-full"
                            onChange={(e) => updatingCfwPWDRepresentative('representative_id_card_number', e.target.value)}
                        />
                        {errors?.representative_id_card_number && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_id_card_number}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_civil_status_id" className="block text-sm font-medium">Civil Status</Label>
                        <FormDropDown
                            options={civilStatusOptions}
                            selectedOption={cfwPWDRepresentative.representative_civil_status_id || ""}
                            onChange={handleCivilStatusChange}
                        />
                        {errors?.representative_civil_status_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_civil_status_id}</p>
                        )}
                    </div>

                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_has_health_concern" className="block text-sm font-medium">Do you have any immediate health concerns that you think may affect your work?</Label>
                        <div className="mt-2">
                            <div className="flex items-center">
                                <input
                                    id="health_concerns_yes"
                                    name="representative_has_health_concern"
                                    type="radio"
                                    value="yes"
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    checked={cfwPWDRepresentative.representative_has_health_concern === 1}
                                    onChange={handleHealthConcernChange}
                                />
                                <Label htmlFor="health_concerns_yes" className="ml-3 block text-sm font-medium text-gray-700">
                                    Yes
                                </Label>
                            </div>
                            <div className="flex items-center mt-2">
                                <input
                                    id="health_concerns_no"
                                    name="representative_has_health_concern"
                                    type="radio"
                                    value="no"
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    checked={cfwPWDRepresentative.representative_has_health_concern === 0}
                                    onChange={handleHealthConcernChange}
                                />
                                <Label htmlFor="health_concerns_no" className="ml-3 block text-sm font-medium text-gray-700">
                                    No
                                </Label>
                            </div>
                        </div>
                        {errors?.representative_has_health_concern && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_has_health_concern}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_health_concern_details" className="block text-sm font-medium">If yes, please provide details:</Label>
                        <div className="mt-2">
                            <Textarea
                                id="representative_health_concern_details"
                                name="representative_health_concern_details"
                                rows={4}
                                className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                value={cfwPWDRepresentative.representative_health_concern_details || ""}
                                disabled={cfwPWDRepresentative.representative_has_health_concern === 0}
                                onChange={(e) => updatingCfwPWDRepresentative('representative_health_concern_details', e.target.value.toUpperCase())}
                            />
                        </div>
                        {errors?.representative_health_concern_details && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_health_concern_details}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_skills" className="block text-sm font-medium">Skills Assessment of the Representative</Label>
                        <Textarea
                            id="representative_skills"
                            name="representative_skills"
                            rows={4}
                            className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={cfwPWDRepresentative.representative_skills || ""}
                            onChange={(e) => updatingCfwPWDRepresentative('representative_skills', e.target.value.toUpperCase())} />
                        {errors?.representative_skills && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_skills}</p>
                        )}
                    </div>
                </div>

            </div >


        </>
    )
}