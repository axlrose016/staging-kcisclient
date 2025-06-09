import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogPortal } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Edit, Trash } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getCFWTypeLibraryOptions, getEducationalAttainmentLibraryOptions, getRelationshipToFamilyMemberTypeLibraryOptions, getYearLevelLibraryOptions } from "@/components/_dal/options";
import FamilyCompositionForm from "@/components/dialogs/personprofile/frmfamilycomposition";
import HighestEducationalAttainment from "./highest_educational_attainment";
import { toast } from "@/hooks/use-toast";

export default function FamilyComposition({ errors, capturedData, updateCapturedData, selectedModalityId }: { errors: any; capturedData: any; updateCapturedData: any, selectedModalityId: any }) {
    const [cfwTypeOptions, setcfwTypeOptions] = useState<LibraryOption[]>([]);
    const [selectedRelation, setSelectedRelation] = useState("");
    const [SelectedIsCFWBene, setSelectedIsCFWBene] = useState("");

    const [relationshipToFamilyMemberOptions, setRelationshipToFamilyMemberOptions] = useState<LibraryOption[]>([]);
    const [selectedRelationshipToFamilyMember, setSelectedRelationshipToFamilyMember] = useState("");
    const [selectedRelationshipToFamilyMemberId, setSelectedRelationshipToFamilyMemberId] = useState<number | null>(null);

    const [yearLevelOptions, setYearLevelOptions] = useState<LibraryOption[]>([]);
    const [selectedYearLevel, setSelectedYearLevel] = useState("");
    const [selectedYearLevelId, setSelectedYearLevelId] = useState<number | null>(null);

    const [CFWTypeOptions, setCFWTypeOptions] = useState<LibraryOption[]>([]);
    const [selectedCFWType, setSelectedCFWType] = useState("");
    const [selectedCFWTypeId, setSelectedCFWTypeId] = useState<number | null>(null);

    const [EducationalAttainmentOptions, setEducationalAttainmentOptions] = useState<LibraryOption[]>([]);
    const [selectedEducationalAttainment, setSelectedEducationalAttainment] = useState("");
    const [selectedEducationalAttainmentId, setSelectedEducationalAttainmentId] = useState<number | null>(null);

    const [dob, setDob] = useState<string>("");
    const [age, setAge] = useState<string>("");

    const [familyMemberName, setFamilyMemberName] = useState("");



    const [familyMemberWork, setfamilyMemberWork] = useState("");
    const [familyMemberMonthlyIncome, setfamilyMemberMonthlyIncome] = useState("");
    const [familyMemberContactNumber, setfamilyMemberContactNumber] = useState("");

    // const [capturedData1, setCapturedData] = useState([]);
    const [capturedData1, setCapturedData] = useState<CapturedData>({ cfw: [{ family_composition: [] }] });


    const [form_Data, setForm_Data] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const relationship_to_family_member = await getRelationshipToFamilyMemberTypeLibraryOptions();
                setRelationshipToFamilyMemberOptions(relationship_to_family_member);

                const year_level = await getYearLevelLibraryOptions();
                setYearLevelOptions(year_level);

                const cfw_type = await getCFWTypeLibraryOptions();
                setCFWTypeOptions(cfw_type);

                const educational_attainment = await getEducationalAttainmentLibraryOptions();
                setEducationalAttainmentOptions(educational_attainment);


                const fd = localStorage.getItem("formData");
                if (fd) {
                    setCapturedData(JSON.parse(fd));
                } else {
                    console.log("No data from formdata");
                }



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
    const handlYearLevelChange = (id: number) => {
        console.log("Selected Year Level ID:", id);
        setSelectedYearLevelId(id);
    };

    const handlCFWTypeChange = (id: number) => {
        console.log("Selected CFW Type ID (ADD):", id);
        setSelectedCFWTypeId(id);
    };

    const handlEducationalAttainmentChange = (id: number) => {
        console.log("Selected Family Member Educational attainment ID (ADD):", id);
        setSelectedEducationalAttainmentId(id);
    };
    const handleRelationshipToFamilyMember = (id: number) => {
        console.log("Selected Relationship to family member id:", id);
        setSelectedRelationshipToFamilyMemberId(id);
    };

    const handlbtnOnChange = (id: number) => {
        console.log("submitted", id);
        // setSelectedEducationalAttainmentId(id);
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm_Data((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            localStorage.setItem('formData', JSON.stringify(updatedData)); // Save to localStorage
            return updatedData;
        });
    };

    const handleSaveFamMemberData = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent default button behavior

        console.log("Family Member Name: " + familyMemberName);

        console.log(typeof localStorage.getItem("formData"));
        const formData = localStorage.getItem("formData");
        console.log("Form Data from localStorage: ", formData);
        // return;
        const prevData = formData ? JSON.parse(formData) : { cfw: [{ family_composition: [] }] };
        console.log("Parsed prevData: ", prevData);

        // return;

        console.log("Before: ", prevData);

        // Find the selected relationship to family member
        const selectedTextRelationshipToFamilyMember = relationshipToFamilyMemberOptions.find(option => option.id === selectedRelationshipToFamilyMemberId)?.name;
        console.log("Selected Relationship to bene: " + selectedTextRelationshipToFamilyMember);

        // Find the selected highest educational attainment
        const selectedTextHighestEducationalAttainment = EducationalAttainmentOptions.find(option => option.id === selectedEducationalAttainmentId)?.name;
        console.log("Selected Highest Educational Attainment: " + selectedTextHighestEducationalAttainment);

        // Update the cfw array
        const updatedData = {
            ...prevData,
            cfw: prevData.cfw.map((cfwItem: any, index: number) => {
                if (index !== 3) return cfwItem; // Only modify the fourth element (index 3)

                // Extract existing family composition or initialize it if empty
                const familyComposition = cfwItem.family_composition || [];

                // Check for duplicate family member by name (case insensitive)
                const famMemberExists = familyComposition.some((member: any) =>
                    member.name.toLowerCase() === familyMemberName.toLowerCase()
                );

                if (famMemberExists) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "This Family Member already exists.",
                    })
                    alert("This Family Member already exists.");
                    return cfwItem; // Return unchanged item if duplicate is found
                }

                // validations
                if (familyMemberName === "") {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Family member's name required!",
                    })
                }
                else if (selectedRelationshipToFamilyMemberId === 0) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Relationship to Family member is required!",
                    })
                }
                else if (dob === "") {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Family member's birthday is required!",
                    })
                }
                else if (selectedEducationalAttainmentId === 0) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Highest educational attainment is required!",
                    })
                }
                else if (familyMemberContactNumber === "") {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Family Member's Contact number is required!",
                    })
                } else {
                    // Create the new family member object
                    const newFamilyMember = {
                        name: familyMemberName,
                        relationship_to_the_beneficiary: selectedTextRelationshipToFamilyMember,
                        relationship_to_the_beneficiary_id: selectedRelationshipToFamilyMemberId,
                        birthdate: dob,
                        age: age,
                        highest_educational_attainment: selectedTextHighestEducationalAttainment,
                        highest_educational_attainment_id: selectedEducationalAttainmentId,
                        work: familyMemberWork,
                        monthly_income: familyMemberMonthlyIncome,
                        contact_number: familyMemberContactNumber,
                    };

                    // Append the new family member to the existing family composition
                    const updatedFamilyComposition = [...familyComposition, newFamilyMember];
                    toast({
                        variant: "green",
                        title: "Success",
                        description: "Family Member data has been added!",
                    })
                    // Return the updated cfwItem with the new family composition
                    return { ...cfwItem, family_composition: updatedFamilyComposition };
                }



            }),
        };

        // Save the updated data to localStorage (remember to stringify it)
        localStorage.setItem("formData", JSON.stringify(updatedData));

        // Update the state with the new data
        setCapturedData(updatedData); // Update state if needed
        console.log("Updated Family Composition:", updatedData.cfw[3].family_composition);
    };







    const handleFamilyMemberDOBChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.value;

        setDob(selectedDate);
        computeAge(selectedDate);

    };

    const computeAge = (dob: string) => {
        if (!dob) {
            setAge("0");
            return;
        }

        const birthDate = new Date(dob);
        const today = new Date();

        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        // Adjust age if birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            calculatedAge--;
        }
        // Ensure age is a number (in case of negative or invalid age)
        const ageNumber = Math.max(0, Number(calculatedAge)); // Ensure it's never negative

        setAge(ageNumber.toString());
    };

    type FamilyMember = {
        age: number;
        birthdate: string;
        contact_number: string;
        highest_educational_attainment: string;
        highest_educational_attainment_id: number;
        monthly_income: number;
        name: string;
        relationship_to_the_beneficiary: string;
        relationship_to_the_beneficiary_id: number;
        work: string;
    };
    type CFWItem = {
        family_composition?: FamilyMember[];
    };
    type CapturedData = {
        cfw: CFWItem[];
    };

    return (
        <>
            <div className="w-full overflow-x-auto " >
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 ">
                    <div className="p-2 col-span-4 ">
                        <div className="flex justify-start">

                            <Dialog modal={false}>
                                <DialogTrigger asChild>
                                    <p className="ml-2 border px-3 py-3">Add Record</p>
                                </DialogTrigger>
                                <DialogPortal>
                                    <DialogContent className="sm:max-w-[425px] max-h-full overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle className="text-left">Add Family Members</DialogTitle>
                                            <DialogDescription className="text-left">
                                                Please complete the fields below and click "Save."
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid sm:grid-cols-4 sm:grid-rows-1 mb-2">
                                            {/* // { 
                                        // name: "", 
                                        // relationship_to_the_beneficiary_id: 0, 
                                        // birthdate: "", 
                                        // age: 0, 
                                        // highest_educational_attainment_id: 0, 
                                        // work: "", 
                                        // monthly_income: "", 
                                        // contact_number: "" } */}
                                            <div className="p-2 col-span-1">
                                                <Label htmlFor="family_member_name" className="block text-sm font-medium">Name of Family Member<span className='text-red-500'> *</span></Label>
                                                <Input
                                                    type="text"
                                                    id="family_member_name"
                                                    name="family_member_name"
                                                    className="mt-1 block w-full mb-2"
                                                    onChange={(e) => setFamilyMemberName(e.target.value)}

                                                />
                                                {errors?.family_member_name && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.family_member_name}</p>
                                                )}
                                            </div>
                                            <div className="p-2">
                                                <Label htmlFor="relationship_to_family_member" className="block text-sm font-medium">Relationship to Family Member<span className='text-red-500'> *</span></Label>
                                                <FormDropDown

                                                    id="relationship_to_family_member"
                                                    options={relationshipToFamilyMemberOptions}
                                                    selectedOption={selectedRelationshipToFamilyMemberId}
                                                    onChange={handlRelationshipToFamilyMemberChange}

                                                />
                                                {errors?.relationship_to_family_member && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.relationship_to_family_member}</p>
                                                )}
                                            </div>
                                            <div className="p-2">
                                                <Label htmlFor="family_member_birthdate" className="block text-sm font-medium">Birth Date<span className='text-red-500'> *</span></Label>
                                                <Input
                                                    //  onChange={(e) => updateCommonData('first_name', e.target.value)}
                                                    id="family_member_birthdate"
                                                    name="family_member_birthdate"
                                                    type="date"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    onChange={handleFamilyMemberDOBChange}
                                                />
                                                {errors?.family_member_birthdate && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.family_member_birthdate}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-1">
                                                <Label htmlFor="family_member_age" className="block text-sm font-medium">Age</Label>
                                                <Input
                                                    type="text"
                                                    id="family_member_age"
                                                    name="family_member_age"
                                                    className="mt-1 block w-full mb-2"
                                                    value={age}
                                                    readOnly

                                                />
                                                {errors?.family_member_age && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.family_member_age}</p>
                                                )}
                                            </div>
                                            <div className="p-2">
                                                <Label htmlFor="family_highest_educational_attainment_id" className="block text-sm font-medium">Highest Educational Attainment</Label>
                                                <FormDropDown

                                                    id="family_highest_educational_attainment_id"
                                                    options={EducationalAttainmentOptions}
                                                    selectedOption={selectedEducationalAttainmentId}
                                                    onChange={handlEducationalAttainmentChange}

                                                />
                                                {errors?.family_highest_educational_attainment_id && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.family_highest_educational_attainment_id}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-1">
                                                <Label htmlFor="family_member_work" className="block text-sm font-medium">Work</Label>
                                                <Input
                                                    type="text"
                                                    id="family_member_work"
                                                    name="family_member_work"
                                                    className="mt-1 block w-full mb-2"
                                                    // readOnly
                                                    onChange={(e) => setfamilyMemberWork(e.target.value)}

                                                />
                                                {errors?.family_member_work && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.family_member_work}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-1">
                                                <Label htmlFor="family_member_monthly_income" className="block text-sm font-medium">Monthly Income</Label>
                                                <Input
                                                    type="text"
                                                    id="family_member_monthly_income"
                                                    name="family_member_monthly_income"
                                                    className="mt-1 block w-full mb-2"
                                                    onChange={(e) => setfamilyMemberMonthlyIncome(e.target.value)}

                                                />
                                                {errors?.family_member_monthly_income && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.family_member_monthly_income}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-1">
                                                <Label htmlFor="family_member_contact_number" className="block text-sm font-medium">Contact Number<span className='text-red-500'> *</span></Label>
                                                <Input
                                                    type="text"
                                                    id="family_member_contact_number"
                                                    name="family_member_contact_number"
                                                    className="mt-1 block w-full mb-2"
                                                    onChange={(e) => setfamilyMemberContactNumber(e.target.value)}

                                                />
                                                {errors?.family_member_contact_number && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.family_member_contact_number}</p>
                                                )}
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleSaveFamMemberData}>Save</Button>
                                        </DialogFooter>

                                    </DialogContent>
                                </DialogPortal>
                            </Dialog>
                        </div>
                        <div className="p-2 col-span-4">

                            <Table className="min-w-[1000px] border">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Relationship</TableHead>
                                        <TableHead>Birthday</TableHead>
                                        <TableHead>Age</TableHead>
                                        <TableHead>Educational level</TableHead>
                                        <TableHead>Occupation</TableHead>
                                        <TableHead>Monthly Income</TableHead>
                                        <TableHead>Contact Number</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>

                                    {capturedData1.cfw[3]?.family_composition !== undefined && capturedData1.cfw[3]?.family_composition?.length > 0 ? (
                                        capturedData1.cfw[3].family_composition?.map((familyMember: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>{familyMember.name}</TableCell>
                                                <TableCell>{familyMember.relationship_to_the_beneficiary}</TableCell>
                                                <TableCell>{familyMember.birthdate}</TableCell>
                                                <TableCell>{familyMember.age}</TableCell>
                                                <TableCell>{familyMember.highest_educational_attainment}</TableCell>
                                                <TableCell>{familyMember.work}</TableCell>
                                                <TableCell>{familyMember.monthly_income}</TableCell>
                                                <TableCell>{familyMember.contact_number}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <Edit className="w-4 h-4" />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Edit Record</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <Trash className="w-4 h-4" />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Delete Record</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={2}>No Family Members available </TableCell>
                                        </TableRow>
                                    )}
                                    {/* <TableRow>
                                        <TableCell>John Doe</TableCell>
                                        <TableCell>Father</TableCell>
                                        <TableCell>1980-01-01</TableCell>
                                        <TableCell>43</TableCell>
                                        <TableCell>College</TableCell>
                                        <TableCell>Engineer</TableCell>
                                        <TableCell>$5000</TableCell>
                                        <TableCell>None</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Edit className="w-4 h-4" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Edit Record</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Trash className="w-4 h-4" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Delete Record</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </TableCell>
                                    </TableRow> */}
                                </TableBody>
                            </Table>

                        </div>

                    </div>



                </div>

            </div >
            <div className="p-2">
                <Label htmlFor="no_of_children" className="block text-sm font-medium">Number of Children</Label>
                <Input
                    id="no_of_children"
                    name="no_of_children"
                    type="number"
                    placeholder="Enter the number of children"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors?.no_of_children && (
                    <p className="mt-2 text-sm text-red-500">{errors.no_of_children}</p>
                )}
            </div>
        </>
    )
}