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
import { getCFWTypeLibraryOptions, getEducationalAttainmentLibraryOptions, getLibraryDescription, getRelationshipToFamilyMemberTypeLibraryOptions, getYearLevelLibraryOptions } from "@/components/_dal/options";
import { ButtonDialog } from "@/components/actions/button-dialog";
import FamilyCompositionForm from "@/components/dialogs/personprofile/frmfamilycomposition";
import HighestEducationalAttainment from "./highest_educational_attainment";
import { toast } from "@/hooks/use-toast";
import { getOfflineExtensionLibraryOptions, getOfflineLibEducationalAttainment, getOfflineLibRelationshipToBeneficiary, getOfflineLibYearLevel } from "@/components/_dal/offline-options";
import { IPersonProfile, IPersonProfileFamilyComposition } from "@/components/interfaces/personprofile";
import { v4 as uuidv4, validate } from 'uuid';
import { lib_extension_name } from "@/db/schema/libraries";
import { person_profile } from "@/db/schema/personprofile";
import { SessionPayload } from '@/types/globals';
import { getSession } from '@/lib/sessions-client'
const _session = await getSession() as SessionPayload;
export default function FamilyComposition({ errors, capturedeData, familyCompositionData, updatedFamComposition, session, user_id_viewing }: {
    errors: any; capturedeData: Partial<IPersonProfile>; familyCompositionData: Partial<IPersonProfileFamilyComposition>[];
    updatedFamComposition: (newData: Partial<IPersonProfileFamilyComposition>[], action: string, id: string) => void; session: any; user_id_viewing: string;

}) {
    const [sessiondata, setSession] = useState<SessionPayload | null>(null);
    const [FCData, setFamilyCompositionData] = useState(familyCompositionData)
    const [relationshipToFamilyMemberOptions, setRelationshipToFamilyMemberOptions] = useState<LibraryOption[]>([]);
    const [selectedRelationshipToFamilyMember, setSelectedRelationshipToFamilyMember] = useState("");
    const [selectedRelationshipToFamilyMemberId, setSelectedRelationshipToFamilyMemberId] = useState<number | null>(null);

    const [yearLevelOptions, setYearLevelOptions] = useState<LibraryOption[]>([]);
    const [selectedYearLevel, setSelectedYearLevel] = useState("");
    const [selectedYearLevelId, setSelectedYearLevelId] = useState<number | null>(null);


    const [EducationalAttainmentOptions, setEducationalAttainmentOptions] = useState<LibraryOption[]>([]);
    const [selectedEducationalAttainment, setSelectedEducationalAttainment] = useState("");
    const [selectedEducationalAttainmentId, setSelectedEducationalAttainmentId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [dob, setDob] = useState<string>("");
    const [age, setAge] = useState<number | null>(null);

    const [familyMemberName, setFamilyMemberName] = useState("");



    const [familyMemberWork, setfamilyMemberWork] = useState("");
    const [familyMemberMonthlyIncome, setfamilyMemberMonthlyIncome] = useState("0.00");
    const [familyMemberContactNumber, setfamilyMemberContactNumber] = useState("09");

    // const [capturedData1, setCapturedData] = useState([]);
    const [capturedData1, setCapturedData] = useState<CapturedData>({ cfw: [{ family_composition: [] }] });

    const [extensionNames, setExtensionNames] = useState<Record<number, string>>({});
    const [relationshipNames, setRelationshipNames] = useState<Record<number, string>>({});
    const [educationNames, setEducationNames] = useState<Record<number, string>>({});

    const [form_Data, setForm_Data] = useState([]);

    const [famComFirstName, setfamComFirstName] = useState("");
    const [famComLastName, setfamComLastName] = useState("");
    const [famComMiddleName, setfamComMiddleName] = useState("");
    const [famComSelectedExtNameId, setfamComExtNameId] = useState<number | null>(null);
    const [famComSelectedExtName, setfamComExtName] = useState<number | null>(null);
    const [famComExtensionNameOptions, setfamComExtensionNameOptions] = useState<LibraryOption[]>([]);

    const [familyComposition, setFamilyComposition] = useState<FamilyCompositionData>({
        family_composition: []
    });
    const handlExtensionNameChange = (id: number) => {

        // updateCommonData("extension_name", id);
        console.log("Selected Extension name ID:", id);
        setfamComExtNameId(id)
        // setSelectedExtensionNameId(id);
        // updatingCommonData("extension_name_id", id);
    };

    // monthly income
    const [value, setValue] = useState("")

    const formatNumber = (num: string): string => {
        // Remove non-numeric characters except decimal point
        const numericValue = num.replace(/[^\d.]/g, "")

        // Ensure only one decimal point
        const parts = numericValue.split(".")
        const wholePart = parts[0] || ""
        const decimalPart = parts.length > 1 ? parts[1].slice(0, 2) : ""

        // Format whole part with commas
        const formattedWholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

        // Combine with decimal part
        return formattedWholePart + (decimalPart || parts.length > 1 ? "." + decimalPart : "")
    }
    const handleFormatMonthlyIncome = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value

        // Store the raw value (for form submission)
        setValue(inputValue)

        // Format and display the value
        setfamilyMemberMonthlyIncome(formatNumber(inputValue))
    }

    useEffect(() => {
        setfamilyMemberMonthlyIncome(formatNumber(value))
    }, [value])



    useEffect(() => {
        debugger
        const lsFC = localStorage.getItem("family_composition")
        if(lsFC){
            const parsedFC = JSON.parse(lsFC)
            setFamilyCompositionData(parsedFC)
        }
    }, [familyCompositionData])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const year_level = await getOfflineLibYearLevel();//await getYearLevelLibraryOptions();
                setYearLevelOptions(year_level);

                const _session = await getSession() as SessionPayload;
                setSession(_session);

                const educational_attainment = await getOfflineLibEducationalAttainment();//await getEducationalAttainmentLibraryOptions();
                const educational_map = Object.fromEntries(educational_attainment.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
                setEducationNames(educational_map);
                setEducationalAttainmentOptions(educational_attainment);

                // let fam_com = localStorage.getItem("family_composition");

                // if (!fam_com) {
                //     // Initialize with an empty array if no data exists
                //     const initialData = { family_composition: [] };
                //     localStorage.setItem("family_composition", JSON.stringify(initialData));
                //     fam_com = JSON.stringify(initialData);
                // }

                // Parse and set the state
                // const parsedData = JSON.parse(fam_com);
                // setFamilyComposition(parsedData);
                // console.log("Family Composition data:", parsedData);

                const cd = localStorage.getItem("commonData");
                if (cd) {
                    const parsedDataCd = JSON.parse(cd);
                    setCommonData(cd);
                }

                const extension_name = await getOfflineExtensionLibraryOptions(); //await getExtensionNameLibraryOptions();
                const ext_map = Object.fromEntries(extension_name.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
                setExtensionNames(ext_map);
                // Convert label values to uppercase before setting state
                const formattedExtensions = extension_name.map(option => ({

                    ...option,
                    name: option.name.toUpperCase(), // Convert label to uppercase

                }));
                console.log("Formatted Extension", formattedExtensions);
                setfamComExtensionNameOptions(formattedExtensions);

                const relationship_to_family_member = await getOfflineLibRelationshipToBeneficiary(); //await getRelationshipToFamilyMemberTypeLibraryOptions();
                const relationship_map = Object.fromEntries(relationship_to_family_member.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
                setRelationshipNames(relationship_map);
                const formattedRelationship = relationship_to_family_member.map(option => ({

                    ...option,
                    name: option.name.toUpperCase(), // Convert label to uppercase

                }));
                setRelationshipToFamilyMemberOptions(formattedRelationship);

                debugger;
                const lsFC = localStorage.getItem("family_composition")
                if (lsFC) {
                    const parsedFC = JSON.parse(lsFC)
                    setFamilyCompositionData(parsedFC)
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

    const clearForm = () => {
        setfamComFirstName("");
        setfamComMiddleName("");
        setfamComLastName("");
        setfamComExtNameId(null);
        setSelectedRelationshipToFamilyMemberId(null);
        setAge(null);
        setSelectedEducationalAttainmentId(null);
        setfamilyMemberWork("");
        setfamilyMemberMonthlyIncome("0.00");
        setfamilyMemberContactNumber("");
    };

    // const handlCFWTypeChange = (id: number) => {
    //     console.log("Selected CFW Type ID (ADD):", id);
    //     setSelectedCFWTypeId(id);
    // };

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
            localStorage.setItem('famCom', JSON.stringify(updatedData)); // Save to localStorage
            return updatedData;
        });
    };


    function errorToastFamCom(msg: string) {
        toast({
            variant: "destructive",
            title: msg,
            // description: msg,
        })
    }

    function validateAge(ageinput: number) {


        return false;
    }

    const handleSavefamComData = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!famComFirstName || famComFirstName.trim() === "") {
            errorToastFamCom("Please input First Name!");
            return;
        }
        else if (!famComLastName || famComLastName.trim() === "") {
            errorToastFamCom("Please input Last Name!");
            return;
        }
        else if (selectedRelationshipToFamilyMemberId === null) {
            errorToastFamCom("Please select a Relationship to Family Member!");
            return;
        } else if (!dob.trim()) {
            errorToastFamCom("Family member's birthday is required!");
            return;
        } else if (selectedEducationalAttainmentId === 0) {
            errorToastFamCom("Highest educational attainment is required!");
            return;
        }
        // } else if (!familyMemberContactNumber.trim()) {
        //     errorToastFamCom("Family Member's Contact number is required!");
        //     return;
        // }
        // else if (Number(familyMemberContactNumber.length) < 13) {
        //     errorToastFamCom("Family Member's Contact number is required!");
        //     return;
        // }


        else {
            // const famCom = localStorage.getItem("family_composition");
            // let prevData: any = { family_composition: [] }; // for enhancement since the fam com has sub fam com

            // if (famCom) {
            //     prevData = JSON.parse(famCom);
            //     console.log("Parsed prevData:", prevData);
            // } else {
            //     console.log("No family composition found.");
            // }

            // console.log("Before:", prevData);

            // // Ensure `family_composition` exists
            // let familyComposition = prevData.family_composition || [];

            // // Find the selected extensionname
            const selectedFamComExtNameText = famComExtensionNameOptions.find(
                (option) => option.id === famComSelectedExtNameId)?.name || "";

            const selectedTextHighestEducationalAttainment = EducationalAttainmentOptions.find(
                (option) => option.id === selectedEducationalAttainmentId
            )?.name || "";

            // console.log("Selected Highest Educational Attainment:", selectedTextHighestEducationalAttainment);

            // 1 = father, 2= mother, 5 = spouse, 7 = grandfather, 8=grandmother    
            familyCompositionData = Array.isArray(familyCompositionData) ? familyCompositionData : [familyCompositionData];

            const famComMemberExists = familyCompositionData.some(
                (member: any) =>
                    [1, 2, 5, 7, 8].includes(selectedRelationshipToFamilyMemberId) &&
                    member.relationship_to_the_beneficiary_id === selectedRelationshipToFamilyMemberId
            );

            if (famComMemberExists) {
                errorToastFamCom("This Family Member should exists once.");
                return; // Exit function early
            }


            // Check for duplicate family member by name (case insensitive)
            const famComExists = familyCompositionData.some((member: any) =>
                member.first_name === famComFirstName.toUpperCase() &&
                member.middle_name === famComMiddleName.toUpperCase() &&
                member.last_name === famComLastName.toUpperCase() &&
                member.extension_name_id === famComSelectedExtNameId &&
                member.extension_name === selectedFamComExtNameText &&
                member.relationship_to_the_beneficiary_id === selectedRelationshipToFamilyMemberId
            );

            if (famComExists) {
                errorToastFamCom("This Family Member already exists.");
                return; // Exit function early
            }

            // Create the new family member object
            const newFamilyMember = {
                id: uuidv4(), //Usually we assign the id during final saving but we need to assign it here to be able to use from CFW Family Details
                first_name: famComFirstName,
                middle_name: famComMiddleName,
                last_name: famComLastName,
                extension_name_id: famComSelectedExtNameId,
                extension_name: selectedFamComExtNameText,
                //relationship_to_the_beneficiary: selectedTextRelationshipToFamilyMember,
                relationship_to_the_beneficiary_id: selectedRelationshipToFamilyMemberId,
                birthdate: dob,
                age: age,
                highest_educational_attainment: selectedTextHighestEducationalAttainment,
                highest_educational_attainment_id: selectedEducationalAttainmentId,
                work: familyMemberWork,
                monthly_income: parseFloat(familyMemberMonthlyIncome.replace(/,/g, '')),
                contact_number: familyMemberContactNumber,
                created_by: session.userData.email,
                person_profile_id: capturedeData.id,
                user_id: _session.id
            };


            if (updatedFamComposition.length > 0) {
                const updatedData: Partial<IPersonProfileFamilyComposition>[] = [
                    ...familyCompositionData, // Ensure previous data exists
                    newFamilyMember,
                ];
                updatedFamComposition(updatedData, "new", "0"); //creates new family member
            } else {
                const updatedData: Partial<IPersonProfileFamilyComposition>[] = [

                    newFamilyMember,
                ];
                updatedFamComposition(updatedData, "new", "0"); //creates new family member
            }



            clearForm();
            setIsDialogOpen(false);
            toast({
                variant: "green",
                title: "Success",
                description: "Family Member data has been added!",
            });
        }
    };



    const handleFamilyMemberDOBChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.value;

        setDob(selectedDate);
        computeAge(selectedDate);

    };

    const computeAge = (dob: string) => {
        if (!dob) {
            setAge(0);
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

        setAge(ageNumber);
    };

    interface FamilyCompositionData {
        family_composition: IPersonProfileFamilyComposition[];
    }
    type CFWItem = {
        family_composition?: IPersonProfileFamilyComposition[];
    };
    type CapturedData = {
        cfw: CFWItem[];
    };
    const [commonData, setCommonData] = useState(() => {
        if (typeof window !== "undefined") {
            const cd = localStorage.getItem("commonData");
            return cd ? JSON.parse(cd) : {};
        }
        return {};

    })
    useEffect(() => {
        const cd = localStorage.getItem("commonData");
        if (!cd) {

            localStorage.setItem("commonData", JSON.stringify(commonData));
        }
    }, [commonData]);

    // Delete function

    const confirmDelete = (index: string) => {
        debugger;
        if (!familyComposition.family_composition) return; // Ensure it exists
        console.log("😘Family composition typeof ", typeof familyCompositionData)
        const updatedFamily = familyComposition.family_composition.filter((_, i) => i !== Number(index));
        setFamilyComposition({ family_composition: updatedFamily });

        updatedFamComposition(familyCompositionData, 'delete', index);
        console.log("😘Family composition typeof ", typeof familyCompositionData)

        // Update localStorage
        localStorage.setItem("family_composition", JSON.stringify({ family_composition: updatedFamily }));

        toast({
            variant: "green",
            title: "Success",
            description: "Record has been deleted!",
        });
    };
    const handleDeleteFamMem = (index: any) => {
        // alert("why");
        toast({
            variant: "destructive",
            title: "Are you sure?",
            description: "This action cannot be undone.",
            action: (
                <button
                    onClick={() => confirmDelete(index)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    Confirm
                </button>
            ),
        });
    };

    const [userIdViewing, setUserIdViewing] = useState(user_id_viewing);
    // readonly when admin viewing 
    useEffect(() => {
        // alert(userIdViewing)
        if (userIdViewing) {
            const form = document.getElementById("family_composition_info_form");
            if (form) {

                // form.setAttribute("disabled", "true");
                form.querySelectorAll("input, select, textarea, button").forEach((el) => {
                    el.setAttribute("disabled", "true");
                });
            }
        }
    }, [userIdViewing]);


    return (
        <div id="family_composition_info_form" >
            <div className="w-full overflow-x-auto " >
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 ">
                    <div className="p-2 col-span-4 ">
                        <div className="flex justify-start">
                            {/* <pre>{FamilyCompositionForm.length}</pre> */}
                            {/* <pre>{JSON.stringify(session)}</pre> */}
                            {/* <pre>User ID for Viewing: {userIdViewing}</pre> */}
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={false}>
                                <DialogTrigger asChild className={`${userIdViewing ? "hidden" : ""}`}>
                                    <p className="border px-4 py-2 ml-2 rounded-md bg-blue-600 text-white text-center cursor-pointer hover:bg-blue-700 transition">
                                        Add New Entry
                                    </p>
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

                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="program_details_first_name" className="block text-sm font-medium mb-2">
                                                    Family Member's First Name
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id="program_details_first_name"
                                                    placeholder="First Name"
                                                    className="w-full"
                                                    value={famComFirstName}
                                                    onChange={(e) => setfamComFirstName(e.target.value.toUpperCase())}
                                                />
                                            </div>

                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="program_details_middle_name" className="block text-sm font-medium mb-2">
                                                    Family Member's Middle Name
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id="program_details_middle_name"
                                                    placeholder="Middle Name"
                                                    className="w-full"
                                                    value={famComMiddleName}
                                                    onChange={(e) => setfamComMiddleName(e.target.value.toUpperCase())}
                                                />
                                            </div>

                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="program_details_last_name" className="block text-sm font-medium mb-2">
                                                    Family Member's Last Name
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id="program_details_last_name"
                                                    placeholder="Last Name"
                                                    className="w-full"
                                                    value={famComLastName}
                                                    onChange={(e) => setfamComLastName(e.target.value.toUpperCase())}
                                                />
                                            </div>

                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="program_details_extension_name" className="block text-sm font-medium mb-2">
                                                    Family Member's Extension Name
                                                </Label>
                                                <FormDropDown
                                                    id="program_details_extension_name"
                                                    options={famComExtensionNameOptions}
                                                    selectedOption={famComSelectedExtNameId}
                                                    onChange={(value) => handlExtensionNameChange(value)}
                                                    label="Select an Extension Name (if applicable)"
                                                />
                                            </div>

                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="relationship_to_family_member_id" className="block text-sm font-medium mb-2">Relationship to Family Member<span className='text-red-500'> *</span></Label>
                                                <FormDropDown

                                                    id="relationship_to_family_member_id"
                                                    options={relationshipToFamilyMemberOptions}
                                                    selectedOption={selectedRelationshipToFamilyMemberId}
                                                    onChange={(value) => handlRelationshipToFamilyMemberChange(value)}

                                                />
                                                {errors?.relationship_to_family_member && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.relationship_to_family_member_id}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="family_member_birthdate" className="block text-sm font-medium mb-2">Birth Date<span className='text-red-500'> *</span></Label>
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
                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="family_member_age" className="block text-sm font-medium mb-2">Age</Label>
                                                <Input
                                                    type="text"
                                                    id="family_member_age"
                                                    name="family_member_age"
                                                    className="mt-1 block w-full mb-2 text-center"
                                                    value={age || 0}
                                                    readOnly

                                                />
                                                {errors?.family_member_age && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.family_member_age}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="family_highest_educational_attainment_id" className="block text-sm font-medium mb-2">Highest Educational Attainment</Label>
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
                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="family_member_work" className="block text-sm font-medium mb-2">Work</Label>
                                                <Input
                                                    type="text"
                                                    id="family_member_work"
                                                    name="family_member_work"
                                                    className="mt-1 block w-full mb-2"
                                                    // readOnly
                                                    onChange={(e) => setfamilyMemberWork(e.target.value.toUpperCase())}

                                                />
                                                {errors?.family_member_work && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.family_member_work}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="family_member_monthly_income" className="block text-sm font-medium mb-2">Monthly Income (₱)</Label>
                                                <Input
                                                    value={familyMemberMonthlyIncome || "0.00"}
                                                    type="text"
                                                    id="family_member_monthly_income"
                                                    name="family_member_monthly_income"
                                                    className="mt-1 block w-full mb-2 text-right"
                                                    onChange={handleFormatMonthlyIncome}

                                                />
                                                {errors?.family_member_monthly_income && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.family_member_monthly_income}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="family_member_contact_number" className="block text-sm font-medium mb-2">Contact Number</Label>
                                                <Input
                                                    value={familyMemberContactNumber}
                                                    type="text"
                                                    id="family_member_contact_number"
                                                    name="family_member_contact_number"
                                                    className="mt-1 block w-full mb-2"
                                                    onChange={(e) => {
                                                        let newValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters

                                                        if (!newValue.startsWith("09")) {
                                                            newValue = "09"; // Ensure it always starts with 09
                                                        }

                                                        // Apply formatting (XXXX-XXX-XXXX)
                                                        if (newValue.length > 4) newValue = newValue.slice(0, 4) + "-" + newValue.slice(4);
                                                        if (newValue.length > 8) newValue = newValue.slice(0, 8) + "-" + newValue.slice(8);

                                                        // Limit to 13 characters (including dashes)
                                                        if (newValue.length > 13) newValue = newValue.slice(0, 13);

                                                        // if (newValue.length > 11) {
                                                        //     newValue = newValue.slice(0, 11); // Limit to 11 digits (without dashes)
                                                        // }

                                                        // // Format as 0915-7620-296
                                                        // let formattedValue = newValue;
                                                        // if (newValue.length > 10) {
                                                        //     formattedValue = `${newValue.slice(0, 4)}-${newValue.slice(4, 8)}-${newValue.slice(8, 11)}`;
                                                        // } else if (newValue.length > 7) {
                                                        //     formattedValue = `${newValue.slice(0, 4)}-${newValue.slice(4, 8)}`;
                                                        // } else if (newValue.length > 4) {
                                                        //     formattedValue = `${newValue.slice(0, 4)}-${newValue.slice(4)}`;
                                                        // }

                                                        setfamilyMemberContactNumber(newValue);
                                                    }}
                                                // onChange={(e) => {
                                                //     const newValue = e.target.value;
                                                //     if (newValue.startsWith("09") && newValue.length <= 11) {
                                                //         setfamilyMemberContactNumber(newValue);
                                                //     }
                                                //   }}
                                                // onChange={(e) => setfamilyMemberContactNumber(e.target.value)}

                                                />
                                                {errors?.family_member_contact_number && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.family_member_contact_number}</p>
                                                )}
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleSavefamComData}>Save</Button>
                                        </DialogFooter>

                                    </DialogContent>
                                </DialogPortal>
                            </Dialog>
                        </div>
                        <div className="p-2 col-span-4">

                            <Table className={`min-w-[1000px] border ${userIdViewing ? "opacity-50 pointer-events-none" : ""}`}>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center">#</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Relationship</TableHead>
                                        <TableHead>Birthday</TableHead>
                                        <TableHead>Age</TableHead>
                                        <TableHead>Educational level</TableHead>
                                        <TableHead>Occupation</TableHead>
                                        <TableHead className="text-center">Monthly Income</TableHead>
                                        <TableHead>Contact Number</TableHead>
                                        <TableHead className={`text-center ${userIdViewing ? "hidden" : ""}`}>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* {typeof familyCompositionData} */}
                                    {familyCompositionData && familyCompositionData.filter((familyMember: Partial<IPersonProfileFamilyComposition>) => familyMember.first_name).length > 0 ? (
                                    // {Array.isArray(familyCompositionData) && familyCompositionData && familyCompositionData.filter((familyMember: Partial<IPersonProfileFamilyComposition>) => familyMember.first_name).length > 0 ? (
                                        familyCompositionData
                                            .filter((familyMember: Partial<IPersonProfileFamilyComposition>) => familyMember.first_name)
                                            .map((familyMember: Partial<IPersonProfileFamilyComposition>, index: number) => (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}.</TableCell>
                                                    <TableCell>{familyMember.first_name} {familyMember.middle_name} {familyMember.last_name} {extensionNames[familyMember.extension_name_id ?? 0] || ""} </TableCell>
                                                    <TableCell>{relationshipNames[familyMember.relationship_to_the_beneficiary_id ?? 0] || "N/A"}</TableCell>
                                                    <TableCell>{familyMember.birthdate}</TableCell>
                                                    <TableCell>{String(familyMember.age || "0")}</TableCell>
                                                    <TableCell>{educationNames[familyMember.highest_educational_attainment_id ?? 0] || ""}</TableCell>
                                                    <TableCell>{familyMember.work}</TableCell>
                                                    <TableCell className="text-right">{String(familyMember.monthly_income || "0.00")}</TableCell>
                                                    <TableCell>{familyMember.contact_number}</TableCell>
                                                    <TableCell className={`text-center ${userIdViewing ? "hidden" : ""}`}>
                                                        <div className="flex justify-center  space-x-2">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>

                                                                        <Trash className="w-5 h-5 inline text-red-500 hover:text-red-700" onClick={() => handleDeleteFamMem(familyMember.id)} />
                                                                        {/* <Trash className="w-5 h-5 inline text-red-500 hover:text-red-700" onClick={() => handleDeleteFamMem(index)} /> */}

                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Remove Record</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={10} className="text-center">No Family Members available</TableCell>
                                        </TableRow>
                                    )}

                                </TableBody>

                            </Table>

                        </div>

                    </div>



                </div>

            </div >
            {
                commonData.modality_id !== undefined && commonData.modality_id === 25 ? (
                    <div className="p-2">
                        <Label htmlFor="no_of_children" className="block text-sm font-medium mb-2">Number of Children</Label>
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
                ) : null
            }

        </div>
    )
}