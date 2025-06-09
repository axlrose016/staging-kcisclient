import React, { useState, useEffect, useCallback } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormDropDown } from "./form-dropdown";
import { LibraryOption } from "../interfaces/library-interface";

const KeyToken = process.env.NEXT_PUBLIC_DXCLOUD_KEY;

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

interface SelectedOption {
    region_code: string;
    province_code: string;
    city_code: string;
    brgy_code: string;
}

interface LocationAreaSelectionsProps {
    selectedOption?: SelectedOption;
    onChange: (selection: SelectedOption) => void;
    ids?: { region?: string, province?: string, city?: string, barangay?: string };
    errors?: any;
}

const cache: Record<string, any> = {};

function newAbortSignal(timeoutMs: number) {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs || 0);
    return abortController.signal;
}

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function LocationAreaSelections({
    selectedOption = { region_code: "", province_code: "", city_code: "", brgy_code: "" },
    onChange,
    ids = {},
    errors
}: LocationAreaSelectionsProps) {
    const [options, setOptions] = useState<Options>({ regions: [], provinces: [], municipalities: [], barangays: [] });
    const [selectedRegion, setSelectedRegion] = useState(selectedOption.region_code);
    const [selectedProvince, setSelectedProvince] = useState<string>(selectedOption.province_code);
    const [selectedMunicipality, setSelectedMunicipality] = useState<string>(selectedOption.city_code);
    const [selectedBarangay, setSelectedBarangay] = useState<string>(selectedOption.brgy_code);

    // Debounced values
    const debouncedRegion = useDebounce(selectedRegion, 500);
    const debouncedProvince = useDebounce(selectedProvince, 500);
    const debouncedMunicipality = useDebounce(selectedMunicipality, 500);

    const fetchData = useCallback(async (key: string, endpoint: string, updateOptions: (data: any) => void) => {
        if (cache[key]) {
            updateOptions(cache[key]);
            return;
        }

        const signal = newAbortSignal(5000);
        try {
            const response = await fetch(endpoint, {
                // signal,
                headers: {
                    Authorization: `Bearer ${KeyToken}`,
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            if (data?.status) {
                cache[key] = data;
                updateOptions(data);
            }

        } catch (error: any) {
            if (error.name === "AbortError") {
                console.log("Request canceled", error.message);
            } else {
                console.error("Error fetching data:", error);
            }
        }
    }, []);

    useEffect(() => {
        // console.log('LocationAreaSelections > selectedOption', {
        //     selectedOption,
        //     selectedRegion,
        //     selectedProvince,
        //     selectedMunicipality,
        //     selectedBarangay
        // })
        setSelectedRegion(selectedOption.region_code);
        setSelectedProvince(selectedOption.province_code)
        setSelectedMunicipality(selectedOption.city_code);
        setSelectedBarangay(selectedOption.brgy_code);
    }, [selectedOption])

    useEffect(() => {
        fetchData("regions", "/api-libs/psgc/regions", (data) => {
            if (data?.status) {
                const mappedRegions: LibraryOption[] = data.data.map((item: any) => ({
                    id: item.code_correspondence,
                    name: item.name,
                }));
                setOptions((prev) => ({ ...prev, regions: mappedRegions }))
            }
        });
    }, [fetchData]);

    useEffect(() => {
        if (debouncedRegion) {
            fetchData(`provinces-${debouncedRegion}`, `/api-libs/psgc/provincesByRegion?region=${debouncedRegion}`, (data) => {
                if (data?.status) {
                    const mappedProvince: LibraryOption[] = data.data.provinces.map((item: any) => ({
                        id: item.code_correspondence,
                        name: item.name,
                    }));
                    setOptions((prev) => ({ ...prev, provinces: mappedProvince }))
                }
            });
        }
    }, [debouncedRegion, fetchData]);

    useEffect(() => {
        if (debouncedProvince) {
            fetchData(`muni-${debouncedProvince}`, `/api-libs/psgc/municipalityByProvince?province=${debouncedProvince}`, (data) => {
                if (data?.status) {
                    const mappedCity: LibraryOption[] = data.data.municipalities.map((item: any) => ({
                        id: item.code_correspondence,
                        name: item.name,
                    }));
                    setOptions((prev) => ({ ...prev, municipalities: mappedCity }))
                }
            });
        }
    }, [debouncedProvince, fetchData]);

    useEffect(() => {
        if (debouncedMunicipality) {
            fetchData(`barangays-${debouncedMunicipality}`, `/api-libs/psgc/barangayByMunicipality?municipality=${debouncedMunicipality}`, (data) => {
                if (data?.status) {
                    const mappedBarangay: LibraryOption[] = data.data.barangay.map((item: any) => ({
                        id: item.code_correspondence,
                        name: item.name,
                    }));
                    setOptions((prev) => ({ ...prev, barangays: mappedBarangay }))
                }
            });
        }
    }, [debouncedMunicipality, fetchData]);

    const handleRegionChange = (id: string) => {
        // console.log("Selected Region ID:", id);
        setSelectedRegion(id);
        setSelectedProvince("")
        setSelectedMunicipality("");
        setSelectedBarangay("");
        setOptions({ ...options, provinces: [], municipalities: [], barangays: [] })
        onChange({
            region_code: id,
            province_code: "",
            city_code: "",
            brgy_code: ""
        });
    };

    const handleProvinceChange = (id: string) => {
        // console.log("Selected Province ID:", id);
        setSelectedProvince(id);
        setSelectedMunicipality("");
        setSelectedBarangay("");
        setOptions({ ...options, municipalities: [], barangays: [] })
        onChange({
            region_code: selectedRegion,
            province_code: id,
            city_code: "",
            brgy_code: ""
        });
    };

    const handleCityChange = (id: string) => {
        // console.log("Selected City ID:", { id, options });
        // updateCapturedData("common_data", "city_code", id);
        setSelectedMunicipality(id);
        setSelectedBarangay("");
        setOptions({ ...options, barangays: [] })
        onChange({
            region_code: selectedRegion,
            province_code: selectedProvince,
            city_code: id,
            brgy_code: ""
        });


    };

    const handleBarangayChange = (id: string) => {
        // console.log("Selected Barangay ID:", id);
        // updateCapturedData("common_data", "brgy_code", id);
        setSelectedBarangay(id);
        onChange({
            region_code: selectedRegion,
            province_code: selectedProvince,
            city_code: selectedMunicipality,
            brgy_code: id
        })
    };

    return (
        <>
            <div className="p-2 col-span-2">
                <Label htmlFor={ids.region || "region_contact_details_permanent_address"} className="block text-sm font-medium mb-[5px]">Region<span className='text-red-500'> *</span></Label>

                <FormDropDown
                    selectedOption={selectedOption.region_code}
                    onChange={handleRegionChange}
                    id={ids.region || "region_contact_details_permanent_address"}
                    options={options.regions}
                />
                {errors?.region_error && (
                    <p className="mt-2 text-sm text-red-500">{errors.region_error}</p>
                )}
            </div >
            <div className="p-2 col-span-2">
                <Label htmlFor={ids.province || "province_contact_details_permanent_address"} className="block text-sm font-medium mb-[5px]">Province<span className='text-red-500'> *</span></Label>
                <FormDropDown
                    id={ids.province || "province_contact_details_permanent_address"}
                    options={options.provinces}
                    selectedOption={selectedOption.province_code}
                    onChange={handleProvinceChange}
                />
                {errors?.province_error && (
                    <p className="mt-2 text-sm text-red-500">{errors.province_error}</p>
                )}
            </div>
            <div className="p-2 col-span-2">
                <Label htmlFor={ids.city || "municipality_contact_details_permanent_address"} className="block text-sm font-medium mb-[5px]">Municipality<span className='text-red-500'> *</span></Label>
                <FormDropDown
                    id={ids.city || "municipality_contact_details_permanent_address"}
                    options={options.municipalities}
                    selectedOption={selectedOption.city_code}
                    onChange={handleCityChange}
                />
                {errors?.municipality_error && (
                    <p className="mt-2 text-sm text-red-500">{errors.municipality_error}</p>
                )}
            </div >
            <div className="p-2 col-span-2 mb-3">
                <Label htmlFor={ids.barangay || "barangay_contact_details_permanent_address"} className="block text-sm font-medium mb-[5px]">Barangay<span className='text-red-500'> *</span></Label>
                <FormDropDown
                    id={ids.barangay || "barangay_contact_details_permanent_address"}
                    options={options.barangays}
                    selectedOption={selectedOption.brgy_code}
                    onChange={handleBarangayChange}
                />
                {errors?.barangay_error && (
                    <p className="mt-2 text-sm text-red-500">{errors.barangay_error}</p>
                )}
            </div >
        </>
    );
}
