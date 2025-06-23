import { z } from "zod";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormDropDown } from "@/components/forms/form-dropdown";
import { useEffect, useState } from "react";
import { getOfflineLibIdCard } from "@/components/_dal/offline-options";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { FormValues } from "../formv2/page";

export const EmploymentInformationSection = () => {
    const [region, setRegion] = useState<LibraryOption[]>([]);
    const { control, setValue, setError, clearErrors, watch } = useFormContext<FormValues>();
    const [idCardOption, setIdCardOption] = useState<LibraryOption[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try{
                const id_card = await getOfflineLibIdCard();
                setIdCardOption(id_card);
            }catch(error){
                console.error('Error fetching data: ', error);
            }
        };
        fetchData();
    }, []);

    return(
        <div className="space-y-3 pt-3">
            <FormField
                control={control}
                name="employmentInformation.hasoccupation"
                render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                    <FormControl>
                        <Input
                        type="checkbox"
                        id="employmentInformation.hasoccupation"
                        checked={field.value ?? false}
                        onChange={field.onChange}
                        className="w-4 h-4 cursor-pointer"
                        />
                    </FormControl>
                    <FormLabel htmlFor="employmentInformation.hasoccupation" className="cursor-pointer">
                        With Current Occupation?
                    </FormLabel>
                    <FormMessage />
                    </FormItem>
                )}
            />
           <FormField
                control={control}
                name="employmentInformation.current_occupation"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="ENTER CURRENT OCCUPATION"
                        readOnly={!watch("employmentInformation.hasoccupation")}
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="employmentInformation.id_card"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Valid ID</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="employmentInformation.id_card"
                            options={idCardOption}
                            readOnly={!watch("employmentInformation.hasoccupation")}
                            selectedOption={idCardOption.find(r => r.id === field.value)?.id || null}
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
        </div>
    )
}