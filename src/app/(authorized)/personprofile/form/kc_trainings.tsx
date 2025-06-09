import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
export default function KCTrainings({ errors }: ErrorProps) {
    const [relationOptions, setRelationOptions] = useState<LibraryOption[]>([]);
    const [selectedRelation, setSelectedRelation] = useState("");
    return (
        <>
            <div  >
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 ">
                    <div className="p-2 sm:col-span-4">
                        <Label htmlFor="training_title" className="block text-sm font-medium">Training Title</Label>
                        <Input
                            id="training_title"
                            name="training_title"
                            type="text"
                            placeholder="Enter Training Title"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.training_title && (
                            <p className="mt-2 text-sm text-red-500">{errors.training_title[0]}</p>
                        )}
                    </div>
                    <div className="p-2 sm:col-span-1">
                        <Label htmlFor="training_start" className="block text-sm font-medium">Date Start</Label>
                        <Input
                            id="training_start"
                            name="training_start"
                            type="date"
                            placeholder="Enter Date Start of Training"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.training_start && (
                            <p className="mt-2 text-sm text-red-500">{errors.training_start[0]}</p>
                        )}
                    </div>
                    <div className="p-2 sm:col-span-1">
                        <Label htmlFor="training_end" className="block text-sm font-medium">Date End</Label>
                        <Input
                            id="training_end"
                            name="training_end"
                            type="date"
                            placeholder="Enter Date End of Training"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.training_end && (
                            <p className="mt-2 text-sm text-red-500">{errors.training_end[0]}</p>
                        )}
                    </div>
                </div>
            </div >


        </>
    )
}