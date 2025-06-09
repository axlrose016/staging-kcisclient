import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getRelationshipWithGuardianLibraryOptions } from "@/components/_dal/options";
export default function GuardianInformation({ errors }: ErrorProps) {
    const [relationOptions, setRelationOptions] = useState<LibraryOption[]>([]);
    const [selectedRelation, setSelectedRelation] = useState("");

    const [relationshipWithGuardianOptions, setRelationshipWithGuardianOptions] = useState<LibraryOption[]>([]);
    const [selectedRelationshipWithGuardian, setSelectedRelationshipWithGuardian] = useState("");
    const [selectedRelationshipWithGuardianId, setSelectedRelationshipWithGuardianId] = useState<number | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const sex = await getRelationshipWithGuardianLibraryOptions();
                setRelationshipWithGuardianOptions(sex);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleRelationshipWithGuardianChange = (id: number) => {
        console.log("Selected Sex ID:", id);
        setSelectedRelationshipWithGuardianId(id);
    };
    return (
        <>
            <div  >
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 ">
                    <div className="p-2 sm:col-span-2">
                        <Label htmlFor="guardian_name" className="block text-sm font-medium">Guardian Name</Label>
                        <Input
                            id="guardian_name"
                            name="guardian_name"
                            type="text"
                            placeholder="Enter Guardian's Name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.guardian_name && (
                            <p className="mt-2 text-sm text-red-500">{errors.guardian_name[0]}</p>
                        )}
                    </div>
                    <div className="p-2">
                        <Label htmlFor="guardian_contact" className="block text-sm font-medium">Guardian Contact Number</Label>
                        <Input
                            id="guardian_contact"
                            name="guardian_contact"
                            type="text"
                            placeholder="Enter Guardian's Contact Number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.guardian_contact && (
                            <p className="mt-2 text-sm text-red-500">{errors.guardian_contact[0]}</p>
                        )}
                    </div>
                    <div className="p-2">
                        <Label htmlFor="guardian_relationship" className="block text-sm font-medium">Relationship with Guardian</Label>

                        <FormDropDown
                            options={relationshipWithGuardianOptions}
                            selectedOption={selectedRelationshipWithGuardianId}
                            onChange={handleRelationshipWithGuardianChange}

                        />

                        {errors?.guardian_relationship && (
                            <p className="mt-2 text-sm text-red-500">{errors.guardian_relationship[0]}</p>
                        )}
                    </div>


                </div>
                <div className="grid sm:grid-cols-1 sm:grid-rows-1 mb-2">
                    <div className="p-2 sm:col-span-2">
                        <Label htmlFor="guardian_address" className="block text-sm font-medium">Guardian Address</Label>
                        <Textarea
                            id="guardian_address"
                            name="guardian_address"
                            placeholder="Enter Guardian's Address"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows={4}
                        />
                        {errors?.guardian_address && (
                            <p className="mt-2 text-sm text-red-500">{errors.guardian_address[0]}</p>
                        )}
                    </div>
                </div>
            </div >


        </>
    )
}