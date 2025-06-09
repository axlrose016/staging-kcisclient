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
// import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
// import { DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Edit, Trash } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getCFWTypeLibraryOptions } from "@/components/_dal/options";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Combobox } from "@/components/ui/combobox";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast";
import { year } from "drizzle-orm/mysql-core";

export default function CFWProgramDetails({ errors, capturedData, updateCapturedData, selectedModalityId }: { errors: any; capturedData: any; updateCapturedData: any, selectedModalityId: any }) {
    const [selectedRelation, setSelectedRelation] = useState("");
    const [SelectedIsCFWFamBene, setSelectedIsCFWFamBene] = useState("");

    const [cFWTypeOptions, setCFWTypeOptions] = useState<LibraryOption[]>([]);
    const [selectedCFWType, setSelectedCFWType] = useState("");
    const [selectedCFWTypeId, setSelectedCFWTypeId] = useState<number | null>(null);

    const [yearServed, setYearServed] = useState("");
    // const [capturedData1, setCapturedData] = useState([]);
    const [capturedData1, setCapturedData] = useState<CapturedData>({ cfw: [{ program_details: [] }] });
    const [parsedData1, setParsedData] = useState([]);
    const [SelectedCFWTypeName, setSelectedCFWTypeName] = useState<string | null>(null);

    const [formData, setFormData] = useState(() => {
        // Initialize formData from localStorage or set default structure
        const savedData = localStorage.getItem("formData");
        return savedData ? JSON.parse(savedData) : { cfw: [{ sectors: [] }] };
    });
    // const [selectedCFWTypeId, setSelectedCFWTypeId] = useState<number | null>(null);
    const [selectedCFWTypeText, setSelectedCFWTypeText] = useState<string | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const cfw_type = await getCFWTypeLibraryOptions();
                setCFWTypeOptions(cfw_type);

                const formDataLS = localStorage.getItem("formData");

                // First, check if formDataLS exists
                if (formDataLS) {
                    const parsedData = JSON.parse(formDataLS);
                    console.log("Parsed Data: ", parsedData);
                    setCapturedData(parsedData);
                    // setCapturedData(parsedData.cfw[1].program_details);
                    console.log("Final Parsed Data: ", parsedData1);
                    // Check if sectors array exists and is not empty
                    // if (Array.isArray(parsedData.cfw[1].program_details) && parsedData.cfw[1].program_details.length > 0) {
                    //     console.log("Program details array is not empty:", setFormData(parsedData.cfw[1].program_details));
                    // }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleCFWTypeChange2 = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(event.target.value); // Get the value as a number
        const selectedText = event.target.options[event.target.selectedIndex].text; // Get the text

        console.log("Selected CFW Type ID:", selectedId);
        console.log("Selected CFW Type Text:", selectedText);

        setSelectedCFWTypeId(selectedId);
    };


    const handleCFWTypeChange = (id: number) => {
        console.log("Selected CFW Type ID:", id);

        setSelectedCFWTypeId(id);
    };

    const handleIsCFWFamBene = (event: React.ChangeEvent<HTMLInputElement>) => {

        const value = event.target.value;
        // const values = event.target.value; 
        setSelectedIsCFWFamBene(value); //yes and no
        // console.log("is bene ", value);
        if (value === "no") {
            updateCapturedData("cfw", "is_family_beneficiary_of_cfw", 0, 4);
            // updateCapturedData("cfw", "immediate_health_concern_details", ""); // Clear health concern details
            // updateCapturedData("cfw", "has_immediate_health_concern", 0, 4);
            // updateCapturedData("cfw", "immediate_health_concern", "", 4);


        } else {
            // updateCapturedData("cfw", "has_immediate_health_concern", 1);
            // Updating cfw at index 4
            updateCapturedData("cfw", "is_family_beneficiary_of_cfw", 1, 4);
        }

        // if (event.target.value === "no") {
        //     (document.getElementById("immediate_health_concern") as HTMLTextAreaElement).value = "";
        // }



        // console.log("IS Fam bene? " + value);
        // if (value === "No") {
        //     updateCapturedData("cfw", "is_family_beneficiary_of_cfw", 0, 4);
        //     // updateCapturedData("cfw", "immediate_health_concern_details", ""); // Clear health concern details
        //     // updateCapturedData("cfw", "has_immediate_health_concern", 0, 4);
        // } else {
        //     // updateCapturedData("cfw", "has_immediate_health_concern", 1);
        //     // Updating cfw at index 4
        //     updateCapturedData("cfw", "is_family_beneficiary_of_cfw", 1, 4);
        // }
    };

    const handleSaveFamBeneData = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent default button behavior

        console.log("Selected Type is: " + selectedCFWTypeId);
        console.log("Year Served is: " + yearServed);

        const formData = localStorage.getItem("formData");
        const prevData = formData ? JSON.parse(formData) : { cfw: [{ program_details: [] }] };

        const selectedText = cFWTypeOptions.find(option => option.id === selectedCFWTypeId)?.name;
        console.log("Selected Program CFW Type: " + selectedText);

        if (selectedCFWTypeId !== null && Number(selectedCFWTypeId) > 0) {
            console.log("selectedCFWTypeId is a valid positive number");
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select a Program Type!",
            })
            return;
        }

        if (yearServed.length < 4) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please input a valid year served!",
            })
            return;
        }

        const updatedData = {
            ...prevData,
            cfw: prevData.cfw.map((cfwItem: any, index: number) => {
                if (index !== 1) return cfwItem; // Only modify the second element program details

                const programDetails = cfwItem.program_details || [];

                // Check for duplicate cfw_type_id and year_served
                const programExists = programDetails.some(
                    (program: any) => program.cfw_type_id === selectedCFWTypeId && program.year_served === yearServed
                );

                if (programExists) {
                    alert("This CFW Type and Year Served combination already exists.");
                    return cfwItem; // Return unchanged item
                }

                const updatedProgramDetails = [
                    ...programDetails,
                    { cfw_type_id: selectedCFWTypeId, cfw_type: selectedText, year_served: yearServed }
                ];

                return { ...cfwItem, program_details: updatedProgramDetails };
            }),
        };

        localStorage.setItem("formData", JSON.stringify(updatedData));
        setCapturedData(updatedData); // Optional: Update state if needed
        // console.log(localStorage.getItem("formData"));
        toast({
            variant: "green",
            title: "Success",
            description: "New entry has been saved!",
        })
    };


    type ProgramDetails = {
        cfw_type: string;
        year_served: number;
    };
    type CFWItem = {
        program_details?: ProgramDetails[];
    };
    type CapturedData = {
        cfw: CFWItem[];
    };
    return (
        <>
            <div>
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 ">
                    <div className="p-2 sm:col-span-4">
                        <Label htmlFor="cfw_program_details" className="block text-sm font-medium">Has your family ever been a beneficiary of the Cash-for-Work Program of DSWD? (e.g., Tara Basa Program, CFW for Disaster, etc.)</Label>
                        <div className="mt-2">
                            <div className="flex items-center">
                                <input
                                    checked={capturedData.cfw[4].is_family_beneficiary_of_cfw === 1}
                                    onChange={handleIsCFWFamBene}
                                    id="cfw_program_details"
                                    name="cfw_program_details"
                                    type="radio"
                                    value="yes"
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"

                                />
                                <Label htmlFor="cfw_program_details_yes" className="ml-3 block text-sm font-medium text-gray-700">
                                    Yes
                                </Label>
                            </div>
                            <div className="flex items-center mt-2">
                                <input
                                    checked={capturedData.cfw[4].is_family_beneficiary_of_cfw === 0}
                                    onChange={handleIsCFWFamBene}
                                    id="cfw_program_details"
                                    name="cfw_program_details"
                                    type="radio"
                                    value="no"
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                // onChange={(e) => updateCapturedData("common_data", "has_immediate_health_concern", e.target.value)}
                                />
                                <Label htmlFor="cfw_program_details_no" className="ml-3 block text-sm font-medium text-gray-700">
                                    No
                                </Label>
                            </div>
                        </div>


                        {errors?.cfw_program_details && (
                            <p className="mt-2 text-sm text-red-500">{errors.cfw_program_details[0]}</p>
                        )}
                    </div>


                    {capturedData.cfw[4].is_family_beneficiary_of_cfw === 1 && (
                        <div className="p-2 sm:col-span-4">

                            <div className="flex justify-end">
                                {/* <Button onClick={handleSaveFamBeneData}>Add New</Button> */}

                                <Dialog modal={false}>
                                    <DialogTrigger asChild>
                                        <p className="border px-2 py-3 mr-2">
                                            Add New Entry
                                        </p>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle className="text-left">Beneficiary History</DialogTitle>
                                            <DialogDescription className="text-left">
                                                Please indicate if your family has ever been a beneficiary of the Cash-for-Work Program of DSWD (e.g., Tara Basa Program, CFW for Disaster, etc.). Write the year served.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid sm:grid-cols-4 sm:grid-rows-1 mb-2">
                                            <div className="p-2 col-span-1">
                                                <Label htmlFor="representative_extension_name_id" className="block text-sm font-medium mb-2">Program Type</Label>
                                                {/* <FormDropDown
                                                    options={cFWTypeOptions}
                                                    selectedOption={selectedCFWTypeId}
                                                    onChange={(e) => handleCFWTypeChange(e)}

                                                /> */}
                                                <FormDropDown
                                                    options={cFWTypeOptions}
                                                    selectedOption={selectedCFWTypeId} // Pass the selected ID
                                                    label="Select CFW Type"
                                                    onChange={handleCFWTypeChange}
                                                    id="cfw-type-dropdown"
                                                />

                                                {errors?.representative_extension_name_id && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.representative_extension_name_id[0]}</p>
                                                )}
                                            </div>

                                            <div className="p-2 col-span-1">
                                                <Label htmlFor="year_served" className="block text-sm font-medium">Year Served</Label>
                                                <Input
                                                    type="number"
                                                    max={2025}
                                                    id="year_served"
                                                    name="year_served"
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setYearServed(e.target.value)}
                                                />
                                                {errors?.year_served && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.year_served}</p>
                                                )}
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            {/* <div>
                                                <p>New entry has been added!</p>
                                            </div> */}
                                            <Button onClick={handleSaveFamBeneData}>Save</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>


                            </div>
                            <div className="p-2 col-span-4">
                                <Table className="border">
                                    {/* <TableCaption>A list of families that have previously been beneficiaries of the DSWD's CFW Program.</TableCaption> */}
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Program Type</TableHead>
                                            <TableHead>Year Served</TableHead>
                                            <TableHead>Action</TableHead>

                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* {capturedData !== undefined ? "" : capturedData?.cfw[1].program_details[0].cfw_type_id} */}


                                        {capturedData1.cfw[1]?.program_details !== undefined && capturedData1.cfw[1]?.program_details?.length > 0 ? (
                                            capturedData1?.cfw?.[1]?.program_details?.map((programDetail: any, index: number) => (
                                                <TableRow key={index}>
                                                    <TableCell>{programDetail.cfw_type}</TableCell>
                                                    <TableCell>{programDetail.year_served}</TableCell>
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
                                                <TableCell colSpan={2}>No program details available</TableCell>
                                            </TableRow>
                                        )}

                                        {/* {capturedData1.length > 0 ? <p key={index}>{cd.year_served}</p> : "hello"} */}
                                        {/* {invoices.map((invoice) => (
                                            <TableRow key={invoice.invoice}>
                                                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                                                <TableCell>{invoice.paymentStatus}</TableCell>
                                                <TableCell>{invoice.paymentMethod}</TableCell>
                                                <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                                            </TableRow>
                                        ))} */}
                                    </TableBody>

                                </Table>
                            </div>

                        </div>

                    )}

                </div>

            </div >


        </>
    )
}