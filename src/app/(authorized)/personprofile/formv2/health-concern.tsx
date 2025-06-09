import { z } from "zod";
import { personProfileFormSchema } from "./page";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

type FormValues = z.infer<typeof personProfileFormSchema>

type Props = {
  form: UseFormReturn<FormValues>;
};

export default function PersonProfileHealthConcern({ form }: Props) {

    return(
        <div className="space-y-3 pt-3">
            <FormField
                control={form.control}
                name="has_immediate_health_concern"
                render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                    <FormControl>
                        <input
                        type="checkbox"
                        id="has_immediate_health_concern"
                        checked={field.value ?? false}
                        onChange={field.onChange}
                        className="w-4 h-4 cursor-pointer"
                        />
                    </FormControl>
                    <FormLabel htmlFor="has_immediate_health_concern" className="cursor-pointer">
                        Do you have any immediate health concerns that you think may affect your work?
                    </FormLabel>
                    <FormMessage />
                    </FormItem>
                )}
            />
            {form.watch("has_immediate_health_concern") && (
            <FormField
                control={form.control}
                name="immediate_health_concern"
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