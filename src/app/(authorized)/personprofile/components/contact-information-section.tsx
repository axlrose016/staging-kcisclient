"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { FormDropDown } from "@/components/forms/form-dropdown";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { FormValues } from "@/app/sign-up/guest/page";
import { dxFetchData } from "@/components/_dal/external-apis/dxcloud";
import { LibrariesService } from "@/components/services/LibrariesService";
import { useOnlineStatus } from "@/hooks/use-network";
import { getOfflineLibBrgy, getOfflineLibCity, getOfflineLibProvince, getOfflineLibRegion } from "@/components/_dal/offline-options";
import { RegionSelector } from "@/components/forms/region-selector";


export const ContactInformationSection = () => {
    const [region, setRegion] = useState<LibraryOption[]>([]);
    const [province, setProvince] = useState<LibraryOption[]>([]);
    const [city, setCity] = useState<LibraryOption[]>([]);
    const [brgy, setBrgy] = useState<LibraryOption[]>([]);
    const [presentRegion, setPresentRegion] = useState<LibraryOption[]>([]);
    const [presentProvince, setPresentProvince] = useState<LibraryOption[]>([]);
    const [presentCity, setPresentCity] = useState<LibraryOption[]>([]);
    const [presentBrgy, setPresentBrgy] = useState<LibraryOption[]>([]);
    const libService = new LibrariesService();

  const { control, setValue, setError, clearErrors, watch } = useFormContext<FormValues>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isOnline = useOnlineStatus()

  useEffect(() => {
    (async () => {
      try {
        let data: any[] = [];

       if (isOnline) {
          try {
            await dxFetchData("regions", "/api-libs/psgc/regions", async (fetchedData) => {
              data = fetchedData;
              await libService.saveOfflineLibRegionBulk(data);
            });
          } catch (error) {
            console.warn("dxFetchData failed, loading offline regions instead.", error);
            data = await getOfflineLibRegion();
          }
        } else {
          data = await getOfflineLibRegion();
        }
        
        const regionOptions = data.map((item: any) => ({
          id: isOnline ? item.code : item.id,
          name: item.name,
          label: item.name
        }));
        setRegion(regionOptions);
        setPresentRegion(regionOptions);

      } catch (error) {
        console.error("Failed to fetch library regions:", error);
      }
    })();
  }, []);


const regionCode = watch("contactInformation.region_code");
const provinceCode = watch("contactInformation.province_code");
const cityCode = watch("contactInformation.city_code");
const presentRegionCode = watch("contactInformation.region_code_present_address");
const presentProvinceCode = watch("contactInformation.province_code_present_address");
const presentCityCode = watch("contactInformation.city_code_present_address");


  useEffect(() => {
    if (regionCode) {
      setValue("contactInformation.province_code", ""); 
      setValue("contactInformation.city_code", "");
      setValue("contactInformation.brgy_code", "");
      setProvince([]); 
      (async () => {
      try {
        let data: any[] = [];
        if (isOnline) {
          try {
            await dxFetchData("provinces-" + regionCode, "/api-libs/psgc/provincesByRegion?region=" + regionCode, async (fetchedData) => {
            data = fetchedData.provinces;
            await libService.saveOfflineLibProvinceBulk(data);
            });
          } catch (error) {
            console.warn("dxFetchData failed, loading offline regions instead.", error);
            data = await getOfflineLibProvince(row => row.region === regionCode);
          }
        } else {
          data = await getOfflineLibProvince(row => row.region === regionCode);
        }
        
        const provinceOptions = data.map((item: any) => ({
          id: isOnline ? item.code : item.id,
          name: item.name,
          label: item.name
        }));
        setProvince(provinceOptions);
        setPresentProvince(provinceOptions);

      } catch (error) {
        console.error("Failed to fetch library regions:", error);
      }
    })();
    }
  }, [regionCode]);

  useEffect(() => {
    if (provinceCode) {
      setValue("contactInformation.city_code", ""); 
      setValue("contactInformation.brgy_code", "");
      setCity([]); 
      (async () => {
      try {
        let data: any[] = [];
        if (isOnline) {
          try { 
            await dxFetchData("cities-" + provinceCode, "/api-libs/psgc/municipalityByProvince?province=" + provinceCode, async (fetchedData) => {
            data = fetchedData.municipalities;
            await libService.saveOfflineLibCityBulk(data);
          });
          } catch (error) {
            console.warn("dxFetchData failed, loading offline regions instead.", error);
            data = await getOfflineLibCity(row => row.province === provinceCode);
          }
          } else {
            data = await getOfflineLibCity(row => row.province === provinceCode);
          }

        const cityOptions = data.map((item: any) => ({
          id: isOnline ? item.code : item.id,
          name: item.name,
          label: item.name
        }));
        setCity(cityOptions);
        setPresentCity(cityOptions);

      } catch (error) {
        console.error("Failed to fetch library regions:", error);
      }
    })();
    }
  }, [provinceCode]);

  useEffect(() => {
    if (provinceCode) {
      setValue("contactInformation.brgy_code", ""); 
      setBrgy([]); 
      (async () => {
      try {
        let data: any[] = [];
        if (isOnline) {
          try {
          await dxFetchData("barangays-" + cityCode, "/api-libs/psgc/barangayByMunicipality?municipality=" + cityCode, async (fetchedData) => {
            data = fetchedData.barangay;
            await libService.saveOfflineLibBrgyBulk(data);
          });
          } catch (error) {
            console.warn("dxFetchData failed, loading offline regions instead.", error);
          data = await getOfflineLibBrgy(row => row.city === cityCode);
          } 
        }else {
          data = await getOfflineLibBrgy(row => row.city === cityCode);
        }
          
        const brgyOptions = data.map((item: any) => ({
          id: isOnline ? item.code : item.id,
          name: item.name,
          label: item.name
        }));
        setBrgy(brgyOptions);
        setPresentBrgy(brgyOptions);

      } catch (error) {
        console.error("Failed to fetch library regions:", error);
      }
    })();
    }
  }, [cityCode]);

  useEffect(() => {
    if (presentRegionCode) {
      setValue("contactInformation.province_code_present_address", ""); 
      setValue("contactInformation.city_code_present_address", "");
      setValue("contactInformation.brgy_code_present_address", "");
      setPresentProvince([]); 
      (async () => {
      try {
        let data: any[] = [];
        if (isOnline) {
          await dxFetchData("provinces-" + presentRegionCode, "/api-libs/psgc/provincesByRegion?region=" + presentRegionCode, async (fetchedData) => {
            data = fetchedData.provinces;
            await libService.saveOfflineLibProvinceBulk(data);
          });
        } else {
          data = await getOfflineLibProvince(row => row.region === presentRegionCode);
        }

        const provinceOptions = data.map((item: any) => ({
          id: isOnline ? item.code : item.id,
          name: item.name,
          label: item.name
        }));
        setPresentProvince(provinceOptions);

      } catch (error) {
        console.error("Failed to fetch library regions:", error);
      }
    })();
    }
  }, [presentRegionCode]);

  useEffect(() => {
    if (presentProvinceCode) {
      setValue("contactInformation.city_code_present_address", ""); 
      setValue("contactInformation.brgy_code_present_address", "");
      setPresentCity([]); 
      (async () => {
      try {
        let data: any[] = [];
        if (isOnline) {
          await dxFetchData("cities-" + presentProvinceCode, "/api-libs/psgc/municipalityByProvince?province=" + presentProvinceCode, async (fetchedData) => {
            data = fetchedData.municipalities;
            await libService.saveOfflineLibCityBulk(data);
          });
        } else {
          data = await getOfflineLibCity(row => row.province === presentProvinceCode);
        }

        const cityOptions = data.map((item: any) => ({
          id: isOnline ? item.code : item.id,
          name: item.name,
          label: item.name
        }));
        setPresentCity(cityOptions);

      } catch (error) {
        console.error("Failed to fetch library regions:", error);
      }
    })();
    }
  }, [presentProvinceCode]);

  useEffect(() => {
    if (presentCityCode) {
      setValue("contactInformation.brgy_code_present_address", ""); 
      setPresentBrgy([]); 
      (async () => {
      try {
        let data: any[] = [];
        if (isOnline) {
          await dxFetchData("barangays-" + presentCityCode, "/api-libs/psgc/barangayByMunicipality?municipality=" + presentCityCode, async (fetchedData) => {
            data = fetchedData.barangay;
            await libService.saveOfflineLibBrgyBulk(data);
          });
        } else {
          data = await getOfflineLibBrgy(row => row.city === presentCityCode);
        }

        const brgyOptions = data.map((item: any) => ({
          id: isOnline ? item.code : item.id,
          name: item.name,
          label: item.name
        }));
        setPresentBrgy(brgyOptions);

      } catch (error) {
        console.error("Failed to fetch library regions:", error);
      }
    })();
    }
  }, [presentCityCode]);


  return (
        <div className="p-5 col-span-full">
            <div className={`grid sm:grid-cols-4 sm:grid-rows-1 bg-cfw_bg_color text-white p-3 mb-0`}>
                Permanent Address
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="contactInformation.region_code"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Region</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="contactInformation.region_code"
                            options={region}
                            selectedOption={region.find(r => r.id === field.value)?.id || null}
                            onChange={(selected) => {
                            field.onChange(selected); 
                            }}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="contactInformation.province_code"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="contactInformation.province_code"
                            options={province}
                            selectedOption={province.find(r => r.id === field.value)?.id || null}
                            onChange={(selected) => {
                                field.onChange(selected); 
                            }}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="contactInformation.city_code"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="contactInformation.city_code"
                            options={city}
                            selectedOption={city.find(r => r.id === field.value)?.id || null}
                            onChange={(selected) => {
                            field.onChange(selected); 
                            }}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="contactInformation.brgy_code"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Barangay</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="contactInformation.brgy_code"
                            options={brgy}
                            selectedOption={brgy.find(r => r.id === field.value)?.id || null}
                            onChange={(selected) => {
                                field.onChange(selected); 
                            }}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="contactInformation.sitio"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>House No./ Street/ Purok</FormLabel>
                        <FormControl>
                        <Input placeholder="ENTER YOUR HOUSE NO/STREET/PUROK" className="normal-case" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <div className={`grid sm:grid-cols-4 sm:grid-rows-1 bg-cfw_bg_color text-black p-3 bg-black text-white mt-3`}>
                Present Address
            </div>
            <div className="flex items-center gap-2 p-3">
                <FormField
                    control={control}
                    name="contactInformation.is_permanent_same_as_current_address"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                        <FormControl>
                            <input
                            type="checkbox"
                            id="contactInformation.is_permanent_same_as_current_address"
                            checked={field.value ?? false}
                            onChange={field.onChange}
                            className="w-4 h-4 cursor-pointer"
                            />
                        </FormControl>
                        <FormLabel htmlFor="contactInformation.is_permanent_same_as_current_address" className="cursor-pointer">
                            Same as Permanent Address
                        </FormLabel>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="contactInformation.region_code_present_address"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Region</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="contactInformation.region_code_present_address"
                            options={presentRegion}
                            selectedOption={presentRegion.find(r => r.id === field.value)?.id || null}
                            onChange={(selected) => {
                            field.onChange(selected); 
                            }}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="contactInformation.province_code_present_address"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="contactInformation.province_code_present_address"
                            options={presentProvince}
                            selectedOption={presentProvince.find(r => r.id === field.value)?.id || null}
                            onChange={(selected) => {
                            field.onChange(selected); 
                            }}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="contactInformation.city_code_present_address"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="contactInformation.city_code_present_address"
                            options={presentCity}
                            selectedOption={presentCity.find(r => r.id === field.value)?.id || null}
                            onChange={(selected) => {
                            field.onChange(selected); 
                            }}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="contactInformation.brgy_code_present_address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Barangay</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="contactInformation.brgy_code_present_address"
                            options={presentBrgy}
                            selectedOption={presentBrgy.find(r => r.id === field.value)?.id || null}
                            onChange={(selected) => {
                                field.onChange(selected); 
                            }}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="contactInformation.sitio_present_address"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>House No./ Street/ Purok</FormLabel>
                        <FormControl>
                        <Input placeholder="ENTER YOUR HOUSE NO/STREET/PUROK" className="normal-case" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <div className={`grid sm:grid-cols-4 sm:grid-rows-1 bg-cfw_bg_color text-black p-3 bg-black text-white mt-3`}>
                Contact Numbers and Email
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <FormField
          control={control}
          name="contactInformation.cellphone_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number (Primary)</FormLabel>
              <FormControl>
                <Input
                  placeholder="ENTER CELLPHONE NUMBER"
                  inputMode="numeric"
                  maxLength={11}
                  {...field}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, ""); // remove non-digits
                    if (!value.startsWith("09")) {
                      value = "09" + value.replace(/^0+/, ""); // force start with 09
                    }
                    value = value.slice(0, 11); // enforce max length
                    field.onChange(value);
                  }}
                  className="normal-case"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      <FormField
        control={control}
        name="contactInformation.cellphone_no_secondary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Number (Secondary)</FormLabel>
            <FormControl>
              <Input
                placeholder="ENTER CELLPHONE NUMBER"
                inputMode="numeric"
                maxLength={11}
                {...field}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (!value.startsWith("09")) {
                    value = "09" + value.replace(/^0+/, "");
                  }
                  value = value.slice(0, 11);
                  field.onChange(value);
                }}
                className="normal-case"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
        </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={control}
                name="contactInformation.email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Active Email Address</FormLabel>
                    <FormControl>
                    <Input placeholder="ENTER YOUR ACTIVE EMAIL ADDRESS" className="normal-case" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
    </div>
  )
}