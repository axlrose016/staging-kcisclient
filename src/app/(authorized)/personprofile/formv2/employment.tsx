import { z } from "zod";
import { personProfileFormSchema } from "./page";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormDropDown } from "@/components/forms/form-dropdown";
import { useEffect, useState } from "react";
import { getOfflineLibIdCard } from "@/components/_dal/offline-options";
import { LibraryOption } from "@/components/interfaces/library-interface";

type FormValues = z.infer<typeof personProfileFormSchema>

type Props = {
  form: UseFormReturn<FormValues>;
};

export default function PersonProfileEmployment({ form }: Props) {
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
                control={form.control}
                name="hasoccupation"
                render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                    <FormControl>
                        <Input
                        type="checkbox"
                        id="hasoccupation"
                        checked={field.value ?? false}
                        onChange={field.onChange}
                        className="w-4 h-4 cursor-pointer"
                        />
                    </FormControl>
                    <FormLabel htmlFor="hasoccupation" className="cursor-pointer">
                        With Current Occupation?
                    </FormLabel>
                    <FormMessage />
                    </FormItem>
                )}
            />
           <FormField
                control={form.control}
                name="current_occupation"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="ENTER CURRENT OCCUPATION"
                        readOnly={!form.watch("hasoccupation")}
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="id_card"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Valid ID</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="id_card"
                            options={idCardOption}
                            readOnly={!form.watch("hasoccupation")}
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