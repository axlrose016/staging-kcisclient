import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormValues } from "../formv2/page";

export default function HealthInformationSection() {
  const { control, setValue, setError, clearErrors, watch } = useFormContext<FormValues>();
    return(
        <div className="space-y-3 pt-3">
            <FormField
                control={control}
                name="healthInformation.has_immediate_health_concern"
                render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                    <FormControl>
                        <input
                        type="checkbox"
                        id="healthInformation.has_immediate_health_concern"
                        checked={field.value ?? false}
                        onChange={field.onChange}
                        className="w-4 h-4 cursor-pointer"
                        />
                    </FormControl>
                    <FormLabel htmlFor="healthInformation.has_immediate_health_concern" className="cursor-pointer">
                        Do you have any immediate health concerns that you think may affect your work?
                    </FormLabel>
                    <FormMessage />
                    </FormItem>
                )}
            />
            {watch("healthInformation.has_immediate_health_concern") && (
            <FormField
                control={control}
                name="healthInformation.immediate_health_concern"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Health Condition</FormLabel>
                    <FormControl>
                    <Textarea placeholder="Enter your health condition" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            )}
        </div>
    )
}