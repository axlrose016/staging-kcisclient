import { dxFetchData } from "@/components/_dal/external-apis/dxcloud";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { personProfileFormSchema } from "./page";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormDropDown } from "@/components/forms/form-dropdown";
import { Input } from "@/components/ui/input";

type FormValues = z.infer<typeof personProfileFormSchema>

type Props = {
  form: UseFormReturn<FormValues>;
};

export default function PersonProfileContactDetails({ form }: Props) {
const [region, setRegion] = useState<LibraryOption[]>([]);
const [province, setProvince] = useState<LibraryOption[]>([]);
const [city, setCity] = useState<LibraryOption[]>([]);
const [brgy, setBrgy] = useState<LibraryOption[]>([]);
const [presentRegion, setPresentRegion] = useState<LibraryOption[]>([]);
const [presentProvince, setPresentProvince] = useState<LibraryOption[]>([]);
const [presentCity, setPresentCity] = useState<LibraryOption[]>([]);
const [presentBrgy, setPresentBrgy] = useState<LibraryOption[]>([]);

useEffect(() => {
    async function fetchLibrary(){
    await dxFetchData("regions", "/api-libs/psgc/regions", data => {
        const regionOptions = data.map((item: any) => ({
            id: item.code,
            name: item.name,
        }));
        setRegion(regionOptions);
        setPresentRegion(regionOptions);
        });
    }
    fetchLibrary();
}, []);

const regionCode = form.watch("region_code");
const provinceCode = form.watch("province_code");
const cityCode = form.watch("city_code");
const presentRegionCode = form.watch("region_code_present_address");
const presentProvinceCode = form.watch("province_code_present_address");
const presentCityCode = form.watch("city_code_present_address");


  useEffect(() => {
    if (regionCode) {
      form.setValue("province_code", ""); 
      form.setValue("city_code", "");
      form.setValue("brgy_code", "");
      setProvince([]); 
      const fetchData = async () => {
        await dxFetchData(
          "provinces-" + regionCode, // use dynamic key to avoid cache/stale data
          "/api-libs/psgc/provincesByRegion?region=" + regionCode,
          (data) => {
            const provinceOptions = data.provinces.map((item: any) => ({
              id: item.code,
              name: item.name,
            }));
            setProvince(provinceOptions); // ✅ set as array directly
          }
        );
      };
      fetchData();
    }
  }, [regionCode]);

  useEffect(() => {
    if (presentRegionCode) {
      form.setValue("province_code_present_address", ""); 
      form.setValue("city_code_present_address", "");
      form.setValue("brgy_code_present_address", "");
      setPresentProvince([]); 
      const fetchData = async () => {
        await dxFetchData(
          "provinces-" + presentRegionCode, // use dynamic key to avoid cache/stale data
          "/api-libs/psgc/provincesByRegion?region=" + presentRegionCode,
          (data) => {
            const provinceOptions = data.provinces.map((item: any) => ({
              id: item.code,
              name: item.name,
            }));
            setPresentProvince(provinceOptions); // ✅ set as array directly
          }
        );
      };
      fetchData();
    }
  }, [presentRegionCode]);

  useEffect(() => {
    if (provinceCode) {
      form.setValue("city_code", ""); 
      form.setValue("brgy_code", "");
      setCity([]); 
      const fetchData = async () => {
        await dxFetchData(
          "cities-" + provinceCode, // use dynamic key to avoid cache/stale data
          "/api-libs/psgc/municipalityByProvince?province=" + provinceCode,
          (data) => {
            const cityOptions = data.municipalities.map((item: any) => ({
              id: item.code,
              name: item.name,
            }));
            setCity(cityOptions); // ✅ set as array directly
          }
        );
      };
      fetchData();
    }
  }, [provinceCode]);

  useEffect(() => {
    if (presentProvinceCode) {
      form.setValue("city_code_present_address", ""); 
      form.setValue("brgy_code_present_address", "");
      setPresentCity([]); 
      const fetchData = async () => {
        await dxFetchData(
          "cities-" + presentProvinceCode, // use dynamic key to avoid cache/stale data
          "/api-libs/psgc/municipalityByProvince?province=" + presentProvinceCode,
          (data) => {
            const cityOptions = data.municipalities.map((item: any) => ({
              id: item.code,
              name: item.name,
            }));
            setPresentCity(cityOptions); // ✅ set as array directly
          }
        );
      };
      fetchData();
    }
  }, [presentProvinceCode]);

  useEffect(() => {
    if (provinceCode) {
      form.setValue("brgy_code", ""); 
      setBrgy([]); 
      const fetchData = async () => {
        await dxFetchData(
          "barangays-" + cityCode, // use dynamic key to avoid cache/stale data
          "/api-libs/psgc/barangayByMunicipality?municipality=" + cityCode,
          (data) => {
            const brgyOptions =  data.barangay.map((item: any) => ({
              id: item.code,
              name: item.name,
            }));
            setBrgy(brgyOptions); // ✅ set as array directly
          }
        );
      };
      fetchData();
    }
  }, [cityCode]);

  useEffect(() => {
    if (presentCityCode) {
      form.setValue("brgy_code_present_address", ""); 
      setPresentBrgy([]); 
      const fetchData = async () => {
        await dxFetchData(
          "barangays-" + presentCityCode, // use dynamic key to avoid cache/stale data
          "/api-libs/psgc/barangayByMunicipality?municipality=" + presentCityCode,
          (data) => {
            const brgyOptions =  data.barangay.map((item: any) => ({
              id: item.code,
              name: item.name,
            }));
            setPresentBrgy(brgyOptions); // ✅ set as array directly
          }
        );
      };
      fetchData();
    }
  }, [presentCityCode]);

    return (
        <div className="space-y-3 pt-3">
            <div className={`grid sm:grid-cols-4 sm:grid-rows-1 bg-cfw_bg_color text-white p-3 mb-0`}>
                Permanent Address
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="region_code"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Region</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="region_code"
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
                    control={form.control}
                    name="province_code"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="province_code"
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
                    control={form.control}
                    name="city_code"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="city_code"
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
                    control={form.control}
                    name="brgy_code"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Barangay</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="brgy_code"
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
                    control={form.control}
                    name="sitio"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>House No./ Street/ Purok</FormLabel>
                        <FormControl>
                        <Input placeholder="ENTER YOUR HOUSE NO/STREET/PUROK" {...field} />
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
                    control={form.control}
                    name="is_permanent_same_as_current_address"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                        <FormControl>
                            <input
                            type="checkbox"
                            id="copy_permanent_address"
                            checked={field.value ?? false}
                            onChange={field.onChange}
                            className="w-4 h-4 cursor-pointer"
                            />
                        </FormControl>
                        <FormLabel htmlFor="copy_permanent_address" className="cursor-pointer">
                            Same as Permanent Address
                        </FormLabel>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="region_code_present_address"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Region</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="region_code_present_address"
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
                    control={form.control}
                    name="province_code_present_address"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="province_code_present_address"
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
                    control={form.control}
                    name="city_code_present_address"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="city_code_present_address"
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
                    control={form.control}
                    name="brgy_code_present_address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Barangay</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="brgy_code_present_address"
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
                    control={form.control}
                    name="sitio_present_address"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>House No./ Street/ Purok</FormLabel>
                        <FormControl>
                        <Input placeholder="ENTER YOUR HOUSE NO/STREET/PUROK" {...field} />
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
          control={form.control}
          name="cellphone_no"
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      <FormField
        control={form.control}
        name="cellphone_no_secondary"
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
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Active Email Address</FormLabel>
                        <FormControl>
                        <Input placeholder="ENTER YOUR ACTIVE EMAIL ADDRESS" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
        </div>
    )
}