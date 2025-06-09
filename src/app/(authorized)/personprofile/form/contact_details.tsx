import { fetchPIMS } from "@/components/_dal/libraries"; //region to
import { fetchPIMSProvince } from "@/components/_dal/libraries";
import { fetchPIMSCity } from "@/components/_dal/libraries";
import { fetchPIMSBrgy } from "@/components/_dal/libraries";
import { getProvinceLibraryOptions } from "@/components/_dal/options";
import { FormDropDown } from "@/components/forms/form-dropdown";
import LocationAreaSelections from "@/components/forms/LocationAreaSelections";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { IPersonProfile } from "@/components/interfaces/personprofile";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { number } from "zod";

export default function ContactDetails({ errors, capturedData, updateCapturedData, modality_id_global, updateFormData, userIdViewing }: { errors: any; capturedData: Partial<IPersonProfile>; updateCapturedData: any, modality_id_global: any, updateFormData: (newData: Partial<IPersonProfile>) => void, userIdViewing: string }) {
    //const [localData, setLocalData] = useState<Partial<IPersonProfile>>(capturedData);

    const [regionOptions, setRegionOptions] = useState<LibraryOption[]>([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedRegionId, setSelectedRegionId] = useState<string>();

    const [provinceOptions, setProvinceOptions] = useState<LibraryOption[]>([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);

    const [BarangayOptions, setBarangayOptions] = useState<LibraryOption[]>([]);
    const [selectedBarangay, setSelectedBarangay] = useState("");
    const [selectedBarangayId, setSelectedBarangayId] = useState<string | null>(null);

    const [cityOptions, setCityOptions] = useState<LibraryOption[]>([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

    const [municipalityOptions, setMunicipalityOptions] = useState<LibraryOption[]>([]);
    const [selectedMunicipality, setSelectedMunicipality] = useState("");

    const [userIdForViewing_, setUserIdForViewing] = useState(userIdViewing);
    const initialContactDetails = {
        sitio: "",
        cellphone_no: "",
        cellphone_no_secondary: "",
        email: "",
        region_code: "",
        province_code: "",
        city_code: "",
        brgy_code: "",
        sitio_present_address: "",
        region_code_present_address: "",
        province_code_present_address: "",
        city_code_present_address: "",
        brgy_code_present_address: "",
        is_same_as_permanent_address: false,
    };

    const [contactDetails, setContactDetails] = useState(initialContactDetails);


    const updatingContactDetails = (field: any, value: any) => {
        // debugger;
        console.log("The valus is ", value);
        console.log(isSameAddress);
        if (isSameAddress) {
            if (field === "sitio") {
                contactDetails.sitio_present_address = value;
            } else if (field === "region_code") {
                contactDetails.region_code_present_address = value;

            } else if (field === "province_code") {
                contactDetails.province_code_present_address = value;
            } else if (field === "city_code") {
                contactDetails.city_code_present_address = value;
            } else if (field === "brgy_code") {
                contactDetails.brgy_code_present_address = value;
            }
        }

        updateFormData({ [field]: value });
        setContactDetails((prev: any) => {

            // console.log(initialContactDetails);
            const updatedData = { ...prev, [field]: value };

            // Update localStorage
            // localStorage.setItem("contactDetails", JSON.stringify(updatedData));

            return updatedData;
        });

    }

    const [selectedModalityID, setSelectedModalityID] = useState<number | null>(null);

    const [commonData, setCommonData] = useState(() => {
        if (globalThis.window) {
            const storedCommonData = localStorage.getItem("common_data");
            if (storedCommonData !== null) {
                return storedCommonData ? JSON.parse(storedCommonData) : {};
            }
        }

        return {};

    });




    const [selectedRegionIDPresentAddress, setSelectedRegionIDPresentAddress] = useState<string>();


    const [selectedCityIDPresentAddress, setSelectedCityIDPresentAddress] = useState<string>();

    const [selectedProvinceIDPresentAddress, setSelectedProvinceIDPresentAddress] = useState<string>();
    const handleProvincePresentAddressChange = (province_code_present_address: string) => {
        console.log("Selected  Province ID:", province_code_present_address);
        setSelectedProvinceIDPresentAddress(province_code_present_address);
        updatingContactDetails("province_code_present_address", province_code_present_address);
        updateFormData({ province_code_present_address: province_code_present_address });

    };


    const [selectedBarangayIDPresentAddress, setSelectedBarangayIDPresentAddress] = useState<string>();

    const [isSameAddress, setIsSameAddress] = useState(false);
    const handleCheckSameAddress = () => {
        // debugger;
        console.log(!isSameAddress);
        setIsSameAddress(!isSameAddress);
        capturedData.is_permanent_same_as_current_address = !isSameAddress;
        if (!isSameAddress) {
            capturedData.sitio_present_address = capturedData?.sitio;
            capturedData.region_code_present_address = capturedData?.region_code;
            capturedData.province_code_present_address = capturedData?.province_code;
            capturedData.city_code_present_address = capturedData?.city_code;
            capturedData.brgy_code_present_address = capturedData?.brgy_code;
            updateFormData({ region_code_present_address: capturedData?.region_code });
            updateFormData({ province_code_present_address: capturedData?.province_code });
            updateFormData({ city_code_present_address: capturedData?.city_code });
            updateFormData({ brgy_code_present_address: capturedData?.brgy_code });
        }
        updateFormData({ is_permanent_same_as_current_address: !isSameAddress });
        updatingContactDetails("is_permanent_same_as_current_address", !isSameAddress);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { id, value } = e.target;  // Destructure name and value from e.target
        // setLocalData((prevData) => ({
        //     ...prevData,
        //     [id]: value,  // Dynamically update the state
        // }));
        // Update parent component's state by sending the new data
        updateFormData({ [id]: value });
    };
    // readonly when admin viewing 
    useEffect(() => {
        if (userIdViewing) {
            const form = document.getElementById("contact_details_form") as HTMLFormElement;
            if (form) {
                form.querySelectorAll("input, select, textarea, button, label").forEach((el) => {
                    el.setAttribute("disabled", "true");
                });
            }
        }
    }, [userIdViewing]);


    return (
        <div id="contact_details_form">
            <div className="space-y-3 pt-3">
                <div className={`grid sm:grid-cols-4 sm:grid-rows-1 ${modality_id_global === 25 ? "bg-cfw_bg_color " : "bg-black"} text-white p-3 mb-0`}>
                    Permanent Address
                </div>
                <div className="grid sm:grid-cols-4 sm:grid-rows-2 mb-2 mt-0">

                    <LocationAreaSelections
                        selectedOption={{
                            region_code: capturedData.region_code ?? "",
                            province_code: capturedData.province_code ?? "",
                            city_code: capturedData.city_code ?? "",
                            brgy_code: capturedData.brgy_code ?? "",
                        }}
                        onChange={(e) => {
                            console.log('LocationAreaSelections > onChange', e)
                            setSelectedRegion(e.region_code || "");
                            updatingContactDetails("region_code", e.region_code || null);

                            setSelectedProvince(e.province_code || "");
                            updatingContactDetails("province_code", e.province_code || null);

                            setSelectedCity(e.city_code || "");
                            updatingContactDetails("city_code", e.city_code || null);

                            setSelectedBarangay(e.brgy_code || "");
                            updatingContactDetails("brgy_code", e.brgy_code || null);
                        }}
                        ids={{
                            region: "region_contact_details_permanent_address",
                            province: "province_contact_details_permanent_address",
                            city: "municipality_contact_details_permanent_address",
                            barangay: "barangay_contact_details_permanent_address",
                        }}
                        errors={{
                            region_error: errors?.region_contact_details,
                            province_error: errors?.province_contact_details,
                            municipality_error: errors?.municipality_contact_number,
                            barangay_error: errors?.barangay_contact_details,
                        }}
                    />

                    <div className="p-2 col-span-2">
                        <Label htmlFor="sitio" className="block text-sm font-medium">House No./ Street/ Purok<span className='text-red-500'> *</span></Label>
                        <Input
                            // value={capturedData.common_data.sitio}
                            value={capturedData.sitio || ""}
                            onChange={(e) => updatingContactDetails("sitio", e.target.value.toUpperCase())}
                            // onChange={(e) => updateCapturedData("common_data", 'sitio', e.target.value)}
                            id="sitio"
                            name="sitio"
                            type="text"
                            placeholder="Enter your House No/Street/Purok"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.sitio && (
                            <p className="mt-2 text-sm text-red-500">{errors.sitio}</p>
                        )}
                    </div>
                </div>
                <div className={`grid sm:grid-cols-4 sm:grid-rows-1  ${modality_id_global === 25 ? "bg-cfw_bg_color text-black" : ""}  p-3 bg-black text-white mt-3`}>
                    Present Address
                </div>
                <div className="flex items-center gap-2 p-3">
                    <Input
                        type="checkbox"
                        id="copy_permanent_address"
                        checked={capturedData?.is_permanent_same_as_current_address ?? false}
                        onChange={handleCheckSameAddress}
                        className="w-4 h-4 cursor-pointer" />
                    <label
                        htmlFor="copy_permanent_address"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70  cursor-pointer"
                    >
                        Same as Permanent Address
                    </label>
                </div>
                <div className={`grid sm:grid-cols-4 sm:grid-rows-2 mb-2   ${capturedData?.is_permanent_same_as_current_address ? "opacity-50 pointer-events-none" : ""}`}>
                    <LocationAreaSelections

                        selectedOption={{
                            region_code: capturedData.region_code_present_address ?? "",
                            province_code: capturedData.province_code_present_address ?? "",
                            city_code: capturedData.city_code_present_address ?? "",
                            brgy_code: capturedData.brgy_code_present_address ?? "",
                        }}
                        onChange={(e) => {
                            console.log('LocationAreaSelections > onChange', e)
                            setSelectedRegionIDPresentAddress(e.region_code || undefined);
                            updatingContactDetails("region_code_present_address", e.region_code || null);

                            setSelectedProvinceIDPresentAddress(e.province_code || undefined);
                            updatingContactDetails("province_code_present_address", e.province_code || null);

                            setSelectedCityIDPresentAddress(e.city_code || undefined);
                            updatingContactDetails("city_code_present_address", e.city_code || null);

                            setSelectedBarangayIDPresentAddress(e.brgy_code || undefined);
                            updatingContactDetails("brgy_code_present_address", e.brgy_code || null);
                        }}
                        ids={{
                            region: "region_contact_details_present_address",
                            province: "province_contact_details_present_address",
                            city: "municipality_contact_details_present_address",
                            barangay: "barangay_contact_details_present_address",
                        }}
                        errors={{
                            region_error: errors?.region_contact_details_present_address,
                            province_error: errors?.province_contact_details_present_address,
                            municipality_error: errors?.municipality_contact_details_present_address,
                            barangay_error: errors?.barangay_contact_details_present_address,
                        }}


                    />

                    <div className="p-2 col-span-2">
                        <Label htmlFor="sitio_present_address" className="block text-sm font-medium">House No./ Street/ Purok<span className='text-red-500'> *</span></Label>
                        <Input
                            // value={capturedData?.common_data.sitio}
                            value={capturedData?.sitio_present_address || ""}
                            onChange={handleChange}
                            // onChange={(e) => updateCapturedData("common_data", 'sitio', e.target.value)}
                            id="sitio_present_address"
                            name="sitio_present_address"
                            type="text"
                            placeholder="Enter your Present House No/Street/Purok"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            readOnly={isSameAddress}
                        />
                        {errors?.sitio_present_address && (
                            <p className="mt-2 text-sm text-red-500">{errors.sitio_present_address}</p>
                        )}
                    </div>
                </div>
                <div className={`grid sm:grid-cols-4 sm:grid-rows-1  p-3 ${modality_id_global === 25 ? "bg-cfw_bg_color text-white" : "bg-black text-white"}  `}>
                    Contact Numbers and Email
                </div>
                <div className="grid sm:grid-cols-4 sm:grid-rows-2 mb-2">
                    <div className="p-2 col-span-2">
                        <Label htmlFor="cellphone_no" className="block text-sm font-medium">Contact Number (Primary)<span className='text-red-500'> *</span></Label>
                        <Input
                            value={capturedData?.cellphone_no?.trim() ? capturedData?.cellphone_no : "09"}
                            id="cellphone_no"
                            name="cellphone_no"
                            type="text" // Keep it as "text" to allow formatting
                            placeholder="Enter your primary contact number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            maxLength={13} // Account for the dashes (XXXX-XXX-XXXX = 13 characters)
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

                                if (!value.startsWith("09")) {
                                    value = "09" + value.replace(/^09/, "");
                                }

                                // Apply formatting (XXXX-XXX-XXXX)
                                if (value.length > 4) value = value.slice(0, 4) + "-" + value.slice(4);
                                if (value.length > 8) value = value.slice(0, 8) + "-" + value.slice(8);

                                // Limit to 13 characters (including dashes)
                                if (value.length > 13) value = value.slice(0, 13);
                                // alert(value)
                                // Update state
                                setContactDetails((prev) => ({
                                    ...prev,
                                    cellphone_no: value,
                                }));
                                updatingContactDetails('cellphone_no', value)
                                updateFormData({ cellphone_no: value });

                            }}
                        />

                        {errors?.cellphone_no && (
                            <p className="mt-2 text-sm text-red-500">{errors.cellphone_no}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="cellphone_no_secondary" className="block text-sm font-medium">Contact Number (Secondary)</Label>
                        <Input
                            value={capturedData?.cellphone_no_secondary?.trim() ? capturedData?.cellphone_no_secondary : "09"}
                            // value={contactDetails.cellphone_no_secondary}
                            id="cellphone_no_secondary"
                            name="cellphone_no_secondary"
                            type="text" // Keep it as "text" to allow formatting
                            placeholder="Enter your secondary contact number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            maxLength={13} // Account for the dashes (XXXX-XXX-XXXX = 13 characters)
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

                                if (!value.startsWith("09")) {
                                    value = "09" + value.replace(/^09/, "");
                                }

                                // Apply formatting (XXXX-XXX-XXXX)
                                if (value.length > 4) value = value.slice(0, 4) + "-" + value.slice(4);
                                if (value.length > 8) value = value.slice(0, 8) + "-" + value.slice(8);

                                // Limit to 13 characters (including dashes)
                                if (value.length > 13) value = value.slice(0, 13);
                                updatingContactDetails('cellphone_no_secondary', value)
                                // Update state
                                setContactDetails((prev) => ({
                                    ...prev,
                                    cellphone_no_secondary: value,
                                }));
                                updateFormData({ cellphone_no_secondary: value });

                            }}
                        />


                        {/* <Input
                            value={contactDetails.cellphone_no_secondary}
                            // value={capturedData?.common_data.cellphone_no_secondary}
                            id="cellphone_no_secondary"
                            name="cellphone_no_secondary"
                            type="text"
                            placeholder="Enter your secondary contact number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={handleChange}
                        // onChange={(e) => updateCapturedData("common_data", "cellphone_no_secondary", e.target.value)}
                        /> */}
                        {errors?.cellphone_no_secondary && (
                            <p className="mt-2 text-sm text-red-500">{errors.cellphone_no_secondary}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="email" className="block text-sm font-medium">Active Email Address<span className='text-red-500'> *</span></Label>
                        <Input
                            value={capturedData?.email?.toLowerCase() || ""}
                            // value={capturedData?.common_data.email}
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your active email address"
                            className="mt-1 block w-full lowercase rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={handleChange}
                        // onChange={(e) => updateCapturedData("common_data", 'email', e.target.value)}
                        />
                        {errors?.email && (
                            <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>
                </div>

            </div>


        </div>
    )
}