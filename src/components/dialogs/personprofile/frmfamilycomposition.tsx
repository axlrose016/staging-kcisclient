import { DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DialogClose, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { useActionState, useEffect, useState } from "react";
import { submit } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input";
import { FormDropDown } from "@/components/forms/form-dropdown";
import { getLibrary } from "@/lib/libraries";
import { LibraryOption } from "@/components/interfaces/library-interface";
import PasswordFields from "@/components/forms/form-password";
import { ButtonSubmit } from "@/components/actions/button-submit";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { getEducationalAttainmentLibraryOptions, getRelationshipToFamilyMemberTypeLibraryOptions } from "@/components/_dal/options";
export default function FamilyCompositionForm({
    className,
    ...props
}: React.ComponentProps<"div">, errors: any) {
    const [state, submitAction] = useActionState(submit, undefined)
    const { pending } = useFormStatus();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const relationship_to_family_member = await getRelationshipToFamilyMemberTypeLibraryOptions();
                setRelationshipToFamilyMemberOptions(relationship_to_family_member);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const [relationshipToFamilyMemberOptions, setRelationshipToFamilyMemberOptions] = useState<LibraryOption[]>([]);
    const [selectedRelationshipToFamilyMember, setSelectedRelationshipToFamilyMember] = useState("");
    const [selectedRelationshipToFamilyMemberId, setSelectedRelationshipToFamilyMemberId] = useState<number | null>(null);

    const [educationalAttainmentOptions, setEducationalAttainmentOptions] = useState<LibraryOption[]>([]);
    const [selectedEducationalAttainment, setSelectedEducationalAttainment] = useState("");
    const [selectedEducationalAttainmentId, setSelectedEducationalAttainmentId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const educational_attainment = await getEducationalAttainmentLibraryOptions();
                setEducationalAttainmentOptions(educational_attainment);


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    const handlRelationshipToFamilyMemberChange = (id: number) => {
        console.log("Selected Relationship to Family Member ID:", id);
        setSelectedRelationshipToFamilyMemberId(id);
    };

    const handleEducationalAttainmentChange = (id: number) => {
        console.log("Selected Educational Attainment ID:", id);
        setSelectedEducationalAttainmentId(id);
    };
    return (
        <>
            <form action={submitAction} className="p-6 md:p-8">
                <DialogHeader>
                    <DialogTitle>
                        Add Family Member
                    </DialogTitle>
                    <DialogDescription>
                        <div className="p-2 col-span-1">
                            <Label htmlFor="family_member_name" className="block text-sm font-medium mb-2">Name</Label>
                            <Input
                                id="family_member_name"
                                name="family_member_name"
                                type="text"
                                placeholder="Enter the name"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {errors?.family_member_name && (
                                <p className="mt-2 text-sm text-red-500">{errors.family_member_name[0]}</p>
                            )}
                        </div>
                        <div className="p-2 col-span-1">
                            <Label htmlFor="relationship_to_family_member" className="block text-sm font-medium mb-2">Relationship</Label>
                            <FormDropDown
                                id="relationship_to_family_member"
                                options={relationshipToFamilyMemberOptions}
                                selectedOption={selectedRelationshipToFamilyMemberId}
                                onChange={handlRelationshipToFamilyMemberChange}
                            />
                            {errors?.relationship_to_family_member && (
                                <p className="mt-2 text-sm text-red-500">{errors.relationship_to_family_member[0]}</p>
                            )}
                        </div>
                        <div className="p-2 col-span-2 flex space-x-4">
                            <div className="w-1/2">
                                <Label htmlFor="family_member_birthday" className="block text-sm font-medium mb-2">Birthday</Label>
                                <Input id="family_member_birthday" name="family_member_birthday" type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                                {errors?.family_member_birthday && (
                                    <p className="mt-2 text-sm text-red-500">{errors.family_member_birthday[0]}</p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <Label htmlFor="family_member_age" className="block text-sm font-medium mb-2">Age</Label>
                                <Input id="family_member_age" name="family_member_age" type="number" disabled className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                                {errors?.family_member_age && (
                                    <p className="mt-2 text-sm text-red-500">{errors.family_member_age[0]}</p>
                                )}
                            </div>
                        </div>
                        <div className="p-2 col-span-1">
                            <Label htmlFor="family_member_educational_level" className="block text-sm font-medium mb-2">Educational Level</Label>
                            <FormDropDown
                                id="family_member_educational_level"
                                options={educationalAttainmentOptions}
                                selectedOption={selectedEducationalAttainmentId}
                                onChange={handleEducationalAttainmentChange}
                            />
                            {errors?.family_member_educational_level && (
                                <p className="mt-2 text-sm text-red-500">{errors.family_member_educational_level[0]}</p>
                            )}
                        </div>
                        <div className="p-2 col-span-1">
                            <Label htmlFor="family_member_occupation" className="block text-sm font-medium mb-2">Occupation</Label>
                            <Input
                                id="family_member_occupation"
                                name="family_member_occupation"
                                type="text"
                                placeholder="Enter the occupation"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {errors?.family_member_occupation && (
                                <p className="mt-2 text-sm text-red-500">{errors.family_member_occupation[0]}</p>
                            )}
                        </div>
                        <div className="p-2 col-span-1">
                            <Label htmlFor="family_member_monthly_income" className="block text-sm font-medium mb-2">Monthly Income</Label>
                            <Input
                                id="family_member_monthly_income"
                                name="family_member_monthly_income"
                                type="number"
                                placeholder="Enter the monthly income"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {errors?.family_member_monthly_income && (
                                <p className="mt-2 text-sm text-red-500">{errors.family_member_monthly_income[0]}</p>
                            )}
                        </div>
                        <div className="p-2 col-span-1">
                            <Label htmlFor="family_member_contact_number" className="block text-sm font-medium mb-2">Contact Number</Label>
                            <Input
                                id="family_member_contact_number"
                                name="family_member_contact_number"
                                type="number"
                                placeholder="Enter the monthly income"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {errors?.family_member_contact_number && (
                                <p className="mt-2 text-sm text-red-500">{errors.family_member_contact_number[0]}</p>
                            )}
                        </div>
                        <div className="p-2 col-span-1 flex justify-end">
                            <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                                <span className="mr-1">+</span> Add Family Member
                            </Button>
                        </div>

                    </DialogDescription>
                </DialogHeader>
            </form>
        </>
    )
}
