import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import PWDRepresentative from "./pwd_representative";

export default function HealthDeclaration({ errors }: ErrorProps) {
    const [cfwOptions, setCfwOptions] = useState<LibraryOption[]>([]);
    const [selectedCfwCategory, setSelectedCfwCategory] = useState("");
    const handleCfwCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedCfwCategory(event.target.value);
        if (event.target.value === "no") {
            (document.getElementById("health_concerns_details") as HTMLTextAreaElement).value = "";
        }
    };
    return (
        <>
            <div className="">
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 mb-2">
                    <div className="p-2 col-span-4">
                        <Label htmlFor="health_concerns" className="block text-sm font-medium">Do you have any immediate health concerns that you think may affect your work?</Label>
                        <div className="mt-2">
                            <div className="flex items-center">
                                <input
                                    id="health_concerns_yes"
                                    name="health_concerns"
                                    type="radio"
                                    value="yes"
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    onChange={handleCfwCategoryChange}
                                />
                                <Label htmlFor="health_concerns_yes" className="ml-3 block text-sm font-medium text-gray-700">
                                    Yes
                                </Label>
                            </div>
                            <div className="flex items-center mt-2">
                                <input
                                    id="health_concerns_no"
                                    name="health_concerns"
                                    type="radio"
                                    value="no"
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    onChange={handleCfwCategoryChange}
                                />
                                <Label htmlFor="health_concerns_no" className="ml-3 block text-sm font-medium text-gray-700">
                                    No
                                </Label>
                            </div>
                        </div>
                        {errors?.health_concerns && (
                            <p className="mt-2 text-sm text-red-500">{errors.health_concerns[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-4">
                        <Label htmlFor="health_concerns_details" className="block text-sm font-medium">If yes, please provide details:</Label>
                        <div className="mt-2">
                            <Textarea
                                id="health_concerns_details"
                                name="health_concerns_details"
                                rows={4}
                                className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                disabled={selectedCfwCategory !== "yes"}
                            />
                        </div>
                        {errors?.health_concerns_details && (
                            <p className="mt-2 text-sm text-red-500">{errors.health_concerns_details[0]}</p>
                        )}
                    </div>
                </div>

            </div >


        </>
    )
}