import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Children, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
// import { DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Edit, Terminal, Trash } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getCFWTypeLibraryOptions, getYearServedLibraryOptions } from "@/components/_dal/options";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Combobox } from "@/components/ui/combobox";
import {
    Alert, AlertDescription, AlertTitle
} from "@/components/ui/alert"
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
import { IPersonProfile, IPersonProfileCfwFamProgramDetails, IPersonProfileFamilyComposition } from "@/components/interfaces/personprofile";
import { getOfflineExtensionLibraryOptions, getOfflineLibCFWType, getOfflineLibProgramTypes, getOfflineLibYearServed } from "@/components/_dal/offline-options";


export default function CFWProgramDetails({ errors, capturedData, cfwFamComposition, familyComposition, updateFormData, updateCFWFormData, session, user_id_viewing }: {
    errors: any; capturedData: Partial<IPersonProfile>;
    cfwFamComposition: Partial<IPersonProfileCfwFamProgramDetails>[];
    familyComposition: Partial<IPersonProfileFamilyComposition>[];
    updateFormData: (newData: Partial<IPersonProfile>) => void;
    updateCFWFormData: (newData: Partial<IPersonProfileCfwFamProgramDetails>[]) => void;
    session: any; user_id_viewing: string
}) {
    //MAPPER
    const [familyMap, setFamilyMap] = useState<Record<string, string>>({});

    const [yearServed, setYearServed] = useState("");
    const [yearServeOptions, setYearServeOptions] = useState<LibraryOption[]>([]);
    const [selectedYearServedId, setSelectedYearServedId] = useState<number | null>(null);

    const [programTypes, setProgramTypes] = useState("");
    const [programTypesOptions, setProgramTypesOptions] = useState<LibraryOption[]>([]);
    const [selectedProgramTypeId, setSelectedProgramTypeId] = useState<number | null>(null);
    const [selectedFamilyMember, setSelectedFamilyMember] = useState("");
    const [familyOptions, setFamilyOptions] = useState<LibraryOption[]>([]);
    const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);

    const [formData, setFormData] = useState(() => {
        // Initialize formData from localStorage or set default structure
        const savedData = localStorage.getItem("formData");
        return savedData ? JSON.parse(savedData) : { cfw: [{ sectors: [] }] };
    });
    // const [selectedCFWTypeId, setSelectedCFWTypeId] = useState<number | null>(null);
    const [selectedCFWTypeText, setSelectedCFWTypeText] = useState<string | null>(null);

    const [hasProgramDetails, setHasProgramDetails] = useState("");
    const [programDetailsExtensionNameOptions, setprogramDetailsExtensionNameOptions] = useState<LibraryOption[]>([]);

    const [programTypeNames, setProgramTypeNames] = useState<Record<number, string>>({});
    const [yearServedNames, setYearServedNames] = useState<Record<number, string>>({});

    interface ProgramDetail {
        cfw_type_id: string; // Adjust the type as needed
        cfw_type: string;
        year_served: string;

    }
    const [programDetails, setProgramDetails] = useState<any[]>([]);

    // Function to add new entry
    const addProgramDetail = (newRecord: any) => {
        setProgramDetails((prev) => {
            const updatedList = [...prev, newRecord]; // ✅ Add new data properly
            localStorage.setItem("person_cfw_program_details", JSON.stringify(updatedList)); // ✅ Update localStorage
            // localStorage.setItem("programDetails", JSON.stringify(updatedList)); // ✅ Update localStorage
            return updatedList;
        });
    };

    const loadProgramDetails = () => {
        const storedProgramDetails = localStorage.getItem("programDetails");

        if (storedProgramDetails) {
            setProgramDetails(JSON.parse(storedProgramDetails)); // ✅ Ensures proper data setting
        } else {
            setProgramDetails([]);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                // const cfw_type = await getOfflineLibCFWType(); //await getCFWTypeLibraryOptions();
                // const cfwTypes = localStorage.getItem("cfw_type");
                // if (!cfwTypes) {
                //     localStorage.setItem("cfw_type", JSON.stringify(cfw_type));
                // }
                // setCFWTypeOptions(cfw_type);

                // const storedHasProgramDetails = localStorage.getItem("cfwHasProgramDetails");
                const storedHasProgramDetails = localStorage.getItem("person_profile");
                if(storedHasProgramDetails){
                    const parsHPD = JSON.parse(storedHasProgramDetails)
                    setHasProgramDetails(parsHPD);
                    console.log("has Program Details? " + storedHasProgramDetails);
                }
                // if (storedHasProgramDetails !== null) {
                // }

                loadProgramDetails();

                const extension_name = await getOfflineExtensionLibraryOptions(); //await getExtensionNameLibraryOptions();

                setprogramDetailsExtensionNameOptions(extension_name);


                const yearsServed = await getOfflineLibYearServed();
                const yearsServed_map = Object.fromEntries(yearsServed.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
                setYearServedNames(yearsServed_map);
                setYearServeOptions(yearsServed)

                const programTypes = await getOfflineLibProgramTypes();
                const programType_map = Object.fromEntries(programTypes.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
                setProgramTypeNames(programType_map);
                setProgramTypesOptions(programTypes)

                debugger;
                console.log(typeof familyComposition)
                if (typeof familyComposition === "object" && !Array.isArray(familyComposition)) {
                    familyComposition = Object.values(familyComposition);
                }
                const family = familyComposition.map((row: any) => {
                    const fullName = `${row?.first_name || ""} ${row?.middle_name || ""} ${row?.last_name || ""}`.trim();
                    return {
                        id: row.id,
                        name: fullName,
                        label: fullName,
                    };
                });
                const bene_name = `${capturedData?.first_name || ""} ${capturedData?.middle_name || ""} ${capturedData?.last_name || ""}`.trim();
                family.push({
                    id: capturedData.id,
                    name: bene_name,
                    label: bene_name,
                });
                const family_map = Object.fromEntries(family.map((ext: { id: string; name: string }) => [ext.id, ext.name]));
                setFamilyMap(family_map);
                console.log("Family Composition", family);
                setFamilyOptions(family);

                return;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const [cfwType, setcfwType] = useState("");

    const handleCFWTypeChange = (id: number) => {
        console.log("Selected CFW Type ID:", id);
        setSelectedProgramTypeId(id);
    };

    const handleCFWFamilyMember = (id: string) => {
        console.log("Selected CFW Family Member ID:", id);
        setSelectedFamilyMember(id);
    };

    const handleYearServedChange = (id: number) => {
        console.log("Selected Year Served ID:", id);
        setSelectedYearServedId(id);
    };



    const handleIsCFWFamBene = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateFormData({ has_program_details: JSON.parse(event.target.value) }); // Proper boolean conversion
        // updateFormData({ hasprogramdetails: JSON.parse(event.target.value) }); // Proper boolean conversion
    };

    useEffect(() => {
        const storedValue = localStorage.getItem("has_program_details");
        if (storedValue) {
            setHasProgramDetails(storedValue);
        }
    }, [hasProgramDetails]);

    const handleDelete = (cfwTypeId: string, firstName?: string, middleName?: string, lastName?: string, extNameId?: number, yearServedId?: number) => {
        toast({
            variant: "destructive",
            title: "Are you sure?",
            description: "You are about to remove the record, continue?",
            action: (
                <button
                    onClick={() => confirmDelete(cfwTypeId, firstName, middleName, lastName, extNameId, yearServedId)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    Confirm
                </button>
            ),
        });
    };

    const confirmDelete = (cfwTypeId: string, firstName?: string, middleName?: string, lastName?: string, extNameId?: number, yearServedId?: number) => {
        const updatedList = programDetails.filter(
            (program) => !(program.program_type_first_name === firstName &&
                program.program_type_middle_name === middleName &&
                program.program_type_last_name === lastName &&
                Number(program.program_type_ext_name_id) === Number(extNameId) &&
                Number(program.program_type_id) === Number(cfwTypeId) &&
                Number(program.program_type_year_served_id) === Number(yearServedId)
            )
        );

        setProgramDetails(updatedList); // ✅ Updates state
        localStorage.setItem("programDetails", JSON.stringify(updatedList)); // ✅ Updates localStorage

        toast({
            variant: "green",
            title: "Success",
            description: "Record has been deleted!",
        });
    };

    const radioOptions: { id: string; label: string; value: boolean }[] = [
        { id: 'cfw_program_details_yes', label: 'Yes', value: true },
        { id: 'cfw_program_details_no', label: 'No', value: false },
    ];

    const handleNewEntry = () => {
        setDialogOpen(true);
    };

    const handleSaveFamBeneData = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent default button behavior
        debugger;
        if (!selectedFamilyMember) {

            toast({
                variant: "destructive",
                title: "Error",
                description: "Please Select Family Member!",
            })
            return;
        }

        else if (selectedProgramTypeId === null) {

            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select a Program Type!",
            })
            return;
        }
        else if (selectedYearServedId == null) {


            toast({
                variant: "destructive",
                title: "Error",
                description: "Year served required!",
            })
            return;
        } else {

            const newRecord: Partial<IPersonProfileCfwFamProgramDetails> = {
                family_composition_id: selectedFamilyMember,
                program_type_id: selectedProgramTypeId,
                year_served_id: selectedYearServedId,
                created_by: session.userData.email,
                person_profile_id: capturedData.id,
            };
            console.log("CFW Fam Composition type is ", typeof cfwFamComposition)
            const isExist = Array.isArray(cfwFamComposition) && cfwFamComposition.some(record =>
                record.family_composition_id === newRecord.family_composition_id &&
                record.program_type_id === newRecord.program_type_id &&
                record.year_served_id === newRecord.year_served_id
            );

            if (!isExist) {
                // Insert new recordz
                const updatedCFWProgramDetails = Array.isArray(cfwFamComposition) ? [...cfwFamComposition, newRecord] : [newRecord];

                // Update form data with the new list
                localStorage.setItem("person_cfw_program_details", JSON.stringify(updatedCFWProgramDetails));
                updateCFWFormData(updatedCFWProgramDetails);
                setDialogOpen(false);
                toast({
                    variant: "green",
                    title: "Success",
                    description: "New entry has been saved!",
                })
            }
            else {
                // const programArray = Array.isArray(prevData) ? prevData : Object.values(prevData);
                const lsProgramDetails = localStorage.getItem("programDetails");
                if (lsProgramDetails) {
                    debugger;
                    const parsedProgramDetails = JSON.parse(lsProgramDetails);
                    const matchingPrograms = parsedProgramDetails.filter((program: any) => {
                        return (
                            Number(program.program_type_id) === Number(selectedProgramTypeId) &&
                            Number(program.program_type_year_served_id) === Number(selectedYearServedId)
                        );
                    });

                    if (matchingPrograms.length > 0) {
                        console.log("Existing programs:", matchingPrograms);
                        // console.log(localStorage.getItem("formData"));
                        toast({
                            variant: "destructive",
                            title: "Error",
                            description: "Record exists!",
                        })
                    } else {

                        console.log("No matching programs found.");
                        // Create new program object
                        // Append the new data to the array
                        // programArray.push(newRecord);
                        addProgramDetail(newRecord);
                        debugger;
                        updateCFWFormData([...cfwFamComposition, newRecord]);
                        localStorage.setItem("person_cfw_program_details", JSON.stringify([...cfwFamComposition, newRecord]));
                        setDialogOpen(false);
                        toast({
                            variant: "green",
                            title: "Success",
                            description: "New entry has been saved!",
                        })
                    }
                }



            }
        }
    };
    const [userIdViewing, setUserIdViewing] = useState(user_id_viewing);
    // readonly when admin viewing 
    useEffect(() => {
        if (userIdViewing) {
            const form = document.getElementById("program_details_form");
            if (form) {
                form.querySelectorAll("input, select, textarea, button, label").forEach((el) => {
                    el.setAttribute("disabled", "true");
                });
            }
        }
    }, [userIdViewing]);
    return (
        <div id="program_details_form">
            <div className="w-full">
                <Label htmlFor="cfw_program_details" className="block text-sm font-medium p-2">
                    Have you/or member/s of your family ever been a beneficiary of the Cash-for-Work Programs of the DSWD? {capturedData.has_program_details}
                </Label>
                <div className="mt-2 ml-2 flex items-center space-x-6">
                    {radioOptions.map((option) => (
                        <div key={option.id} className="flex items-center">
                            <input
                                checked={capturedData.has_program_details === option.value}
                                onChange={handleIsCFWFamBene}
                                id={option.id}
                                name="cfw_program_details"
                                type="radio"
                                value={option.value.toString()} // This will pass "true" or "false" as a string
                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                            />
                            <Label htmlFor={option.id} className="ml-2 text-sm font-medium text-gray-700">
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>



                {errors?.cfw_program_details && (
                    <p className="mt-2 text-sm text-red-500">{errors.cfw_program_details[0]}</p>
                )}
            </div>
            {capturedData.has_program_details && (
                <div className="mt-4">

                    <div className="flex justify-start mt-5 overflow-y-auto">

                        <Dialog modal={false} open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <p
                                    onClick={handleNewEntry}
                                    className="border px-4 py-2 rounded-md bg-blue-600 text-white text-center cursor-pointer hover:bg-blue-700 transition"
                                >
                                    Add New Entry
                                </p>
                            </DialogTrigger>

                            <DialogContent className="w-full max-w-[90vw] md:max-w-[600px] lg:max-w-[660px] max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="text-left mb-3">Beneficiary History</DialogTitle>
                                    <DialogDescription className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-md text-sm">
                                        Please indicate if your family has ever been a beneficiary of the Cash-for-Work Program of DSWD
                                        (e.g., Tara Basa Program, CFW for Disaster, etc.). Write the full name and the year served.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="mb-2 w-full space-y-4">
                                    <div className="px-2 w-[300px] md:w-full lg:w-full">
                                        <Label htmlFor="family_member_select" className="block text-sm font-medium mb-2">
                                            Family Member
                                        </Label>
                                        <FormDropDown
                                            options={familyOptions}
                                            selectedOption={selectedFamilyId || null}
                                            label="Select CFW Family Member"
                                            onChange={(value) => handleCFWFamilyMember(value)}
                                            id="family_member_select"
                                        />
                                    </div>


                                    <div className="px-2 w-[300px] md:w-full lg:w-full">
                                        <Label htmlFor="program_type" className="block text-sm font-medium mb-2">
                                            Program Type
                                        </Label>
                                        <FormDropDown
                                            options={programTypesOptions}
                                            selectedOption={selectedProgramTypeId}
                                            label="Select CFW Program Type"
                                            onChange={(value) => handleCFWTypeChange(value)}
                                            id="program_type"
                                        />
                                    </div>

                                    <div className="px-2">
                                        <Label htmlFor="year_served" className="block text-sm font-medium mb-2">
                                            Year Served
                                        </Label>
                                        <FormDropDown
                                            options={yearServeOptions}
                                            selectedOption={selectedYearServedId}
                                            label="Select Year Served"
                                            onChange={(value) => handleYearServedChange(value)}
                                            id="year_served"
                                        />
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button onClick={handleSaveFamBeneData}>Save</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                    </div>
                    <div className="mt-4">
                        <Table className="border">
                            {/* <TableCaption>A list of families that have previously been beneficiaries of the DSWD's CFW Program.</TableCaption> */}
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[5%] text-center">#</TableHead>
                                    <TableHead className="w-[45%] ">Family Member Name</TableHead>
                                    <TableHead className="w-[40%] ">Program Type</TableHead>
                                    <TableHead className="w-[10%] text-center">Year Served</TableHead>
                                    <TableHead className="w-[10%] text-center">Action</TableHead>

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* {capturedData !== undefined ? "" : capturedData?.cfw[1].program_details[0].cfw_type_id} */}


                                {Array.isArray(cfwFamComposition) &&
                                    cfwFamComposition ? (
                                    cfwFamComposition.map((programDetail: Partial<IPersonProfileCfwFamProgramDetails>, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell className="text-center">{index + 1}.</TableCell>
                                            {/* <TableCell>{programDetail.program_type_first_name} {programDetail.program_type_middle_name}  {programDetail.program_type_last_name} {programDetail.selectedExtensionName} </TableCell> */}
                                            <TableCell>{familyMap[programDetail.family_composition_id ?? ""] || "N/A"}</TableCell>
                                            <TableCell>{programTypeNames[programDetail.program_type_id ?? 0] || "N/A"}</TableCell>
                                            <TableCell className="text-center" >{yearServedNames[programDetail.year_served_id ?? 0] || "N/A"}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex space-x-2 text-center">

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                {/* <button onClick={() => handleDelete(programDetail.program_type_id,
                                                                        programDetail.program_type_first_name,
                                                                        programDetail.program_type_middle_name,
                                                                        programDetail.program_type_last_name,
                                                                        programDetail.program_type_ext_name_id,
                                                                        programDetail.program_type_year_served_id)}
                                                                        className="text-red-500 hover:text-red-700"> */}
                                                                <button>
                                                                    <Trash className="w-4 h-4" />
                                                                </button>
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
                                        <TableCell colSpan={5} className="text-center">No program details available</TableCell>
                                    </TableRow>
                                )}


                            </TableBody>

                        </Table>
                    </div>

                </div>

            )}
        </div>
    )
}