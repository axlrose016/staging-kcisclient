import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
export default function Ers_work_record({ errors }: ErrorProps) {
    const [relationOptions, setRelationOptions] = useState<LibraryOption[]>([]);
    const [selectedRelation, setSelectedRelation] = useState("");
    return (
        <>
            <div  >
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 ">
                    <div className="p-2 sm:col-span-1">
                        <Label htmlFor="date_reported" className="block text-sm font-medium">Date Reported</Label>
                        <Input
                            id="date_reported"
                            name="date_reported"
                            type="date"
                            placeholder="Enter Date Reported"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.date_reported && (
                            <p className="mt-2 text-sm text-red-500">{errors.date_reported[0]}</p>
                        )}
                    </div>
                    <div className="p-2 sm:col-span-4">
                        <Label htmlFor="work_name" className="block text-sm font-medium">Work</Label>
                        <Input
                            id="work_name"
                            name="work_name"
                            type="text"
                            placeholder="Enter Work"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.work_name && (
                            <p className="mt-2 text-sm text-red-500">{errors.work_name[0]}</p>
                        )}
                    </div>
                    <div className="p-2 sm:col-span-1">
                        <Label htmlFor="work_start" className="block text-sm font-medium">Start</Label>
                        <Input
                            id="work_start"
                            name="work_start"
                            type="date"
                            placeholder="Enter Start Date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.work_start && (
                            <p className="mt-2 text-sm text-red-500">{errors.work_start[0]}</p>
                        )}
                    </div>
                    <div className="p-2 sm:col-span-1">
                        <Label htmlFor="work_end" className="block text-sm font-medium">End</Label>
                        <Input
                            id="work_end"
                            name="work_end"
                            type="date"
                            placeholder="Enter End Date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.work_end && (
                            <p className="mt-2 text-sm text-red-500">{errors.work_end[0]}</p>
                        )}
                    </div>
                    <div className="p-2 sm:col-span-1">
                        <Label htmlFor="actual_cash" className="block text-sm font-medium">Actual Cash</Label>
                        <Input
                            id="actual_cash"
                            name="actual_cash"
                            type="number"
                            placeholder="Enter Actual Cash"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.actual_cash && (
                            <p className="mt-2 text-sm text-red-500">{errors.actual_cash[0]}</p>
                        )}
                    </div>
                    <div className="p-2 sm:col-span-1">
                        <Label htmlFor="actual_lcc" className="block text-sm font-medium">Actual LCC</Label>
                        <Input
                            id="actual_lcc"
                            name="actual_lcc"
                            type="number"
                            placeholder="Enter Actual LCC"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.actual_lcc && (
                            <p className="mt-2 text-sm text-red-500">{errors.actual_lcc[0]}</p>
                        )}
                    </div>
                </div>
            </div >


        </>
    )
}