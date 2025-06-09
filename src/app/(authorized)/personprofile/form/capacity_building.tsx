import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
export default function CapacityBuilding({ errors }: ErrorProps) {
    const [relationOptions, setRelationOptions] = useState<LibraryOption[]>([]);
    const [selectedRelation, setSelectedRelation] = useState("");
    return (
        <>
            <div  >
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 ">
                    <div className="p-2 sm:col-span-4">
                        <Label htmlFor="seminar_title" className="block text-sm font-medium">Title of Seminar/Conference/Workshop/Short Courses (Write in Full)</Label>
                        <Input
                            id="seminar_title"
                            name="seminar_title"
                            type="text"
                            placeholder="Enter Title"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.seminar_title && (
                            <p className="mt-2 text-sm text-red-500">{errors.seminar_title[0]}</p>
                        )}
                    </div>
                    <div className="p-2 sm:col-span-1">
                        <Label htmlFor="seminar_from" className="block text-sm font-medium">From</Label>
                        <Input
                            id="seminar_from"
                            name="seminar_from"
                            type="date"
                            placeholder="Enter From Date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.seminar_from && (
                            <p className="mt-2 text-sm text-red-500">{errors.seminar_from[0]}</p>
                        )}
                    </div>
                    <div className="p-2 sm:col-span-1">
                        <Label htmlFor="seminar_to" className="block text-sm font-medium">To</Label>
                        <Input
                            id="seminar_to"
                            name="seminar_to"
                            type="date"
                            placeholder="Enter To Date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.seminar_to && (
                            <p className="mt-2 text-sm text-red-500">{errors.seminar_to[0]}</p>
                        )}
                    </div>
                    <div className="p-2 sm:col-span-1">
                        <Label htmlFor="seminar_hours" className="block text-sm font-medium">Number of Hours</Label>
                        <Input
                            id="seminar_hours"
                            name="seminar_hours"
                            type="number"
                            placeholder="Enter Number of Hours"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.seminar_hours && (
                            <p className="mt-2 text-sm text-red-500">{errors.seminar_hours[0]}</p>
                        )}
                    </div>
                    <div className="p-2 sm:col-span-4">
                        <Label htmlFor="seminar_conducted_by" className="block text-sm font-medium">Conducted by (write in full)</Label>
                        <Input
                            id="seminar_conducted_by"
                            name="seminar_conducted_by"
                            type="text"
                            placeholder="Enter Conducted by"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.seminar_conducted_by && (
                            <p className="mt-2 text-sm text-red-500">{errors.seminar_conducted_by[0]}</p>
                        )}
                    </div>
                </div>
            </div >


        </>
    )
}