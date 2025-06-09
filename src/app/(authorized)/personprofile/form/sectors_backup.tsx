
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormMultiDropDown } from "@/components/forms/form-multi-dropdown";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { getSectorsLibraryOptions, getTypeOfDisabilityLibraryOptions } from "@/components/_dal/options";
import { FormDropDown } from "@/components/forms/form-dropdown";
import React from "react";
import { parse } from "path";

export default function SectorDetails({ errors, capturedData, updateCapturedData, selectedModalityId }: { errors: any; capturedData: any; updateCapturedData: any, selectedModalityId: any }) {
    const [selectedPersonsWithDisability, setSelectedPersonsWithDisability] = useState("");
    const [selectedIP, setSelectedIP] = useState(""); //this is for showing and hiding group of IPs
    // const [typeOfDisabilityOptions, setTypeOfDisabilityOptions] = useState<LibraryOption[]>([]);
    const [selectedTypeOfDisability, setSelectedTypeOfDisability] = useState("");
    const [selectedTypeOfDisabilityId, setSelectedTypeOfDisabilityId] = useState<number | null>(null);

    const [selectedSector, setSelectedSector] = useState("");
    const [sectorOptions, setSectorOptions] = useState<LibraryOption[]>([]);

    const [selectedSectors, setSelectedSectors] = useState<{ [key: string]: boolean }>({});
    const [capturedData1, setCapturedData] = useState("");

    // const [selectedDisabilties, setSelectedDisabilties] = useState<string[]>([])
    const [selectedDisabilities, setSelectedDisabilities] = React.useState<string[]>([])
    const [disabilityOptions, setDisabilityOptions] = useState<{ id: number; name: string }[]>([])

    const handleDisabilitiesChange = (updatedDisabilities: string[]) => {
        setSelectedDisabilities(updatedDisabilities); // Update state directly

        const formData = localStorage.getItem("formData");
        const prevData = formData ? JSON.parse(formData) : { cfw: [{}, {}, {}] };

        const updatedData = {
            ...prevData,
            cfw: prevData.cfw.map((cfwItem: any, index: number) => {
                if (index !== 2) return cfwItem; // Only modify index 2

                // Update the disabilities array directly with the new values
                return { ...cfwItem, disabilities: updatedDisabilities };
            }),
        };

        localStorage.setItem("formData", JSON.stringify(updatedData));
        setCapturedData(updatedData); // Update your local state if necessary
    };

    // const handleSectorChange2 = (sectorId: any, value: string) => {
    //     const updatedData = [...parsedData1]; // Copy the data to avoid mutation
    //     const sectorIndex = updatedData.findIndex((sector: { id: string; answer?: string }) => sector.id === sectorId);
    //     if (sectorIndex !== -1) {
    //         updatedData[sectorIndex].answer = value; // Update the answer for the sector
    //     }
    //     setParsedData(updatedData); // Update the state with the modified data
    // };


    const handleSectorChange = (sectorId: any, value: string) => {
        const updatedData = [...parsedData1]; // Copy the data to avoid mutation
        const sectorIndex = updatedData.findIndex((sector: Record<string, any>) => Number(sector.id) === Number(sectorId));
        if (sectorIndex !== -1) {
            (updatedData[sectorIndex] as Record<string, any>).answer = value; // Update the answer for the sector
        }
        setParsedData(updatedData); // Update the state with the modified data
        console.log("Parsed Data 1: ", parsedData1);


        const formData = localStorage.getItem("formData");
        const prevData = formData
            ? JSON.parse(formData)
            : {
                cfw: [
                    { sectors: [] },
                    { program_details: [] },
                    { disabilities: [] },
                    { family_composition: [] },
                    {}
                ],
            };

        // Check if sectors exist; if not, initialize with default structure
        const sectors = prevData.cfw[0].sectors.length > 0
            ? prevData.cfw[0].sectors
            : [{ id: sectorId, answer: "" }];

        // Map and update the sectors array
        const updatedSectors = sectors.map((sector: { id: string; answer?: string }) => {
            // console.log("Sector ID loop: " + typeof sector.id);
            if (Number(sector.id) === Number(sectorId)) {
                return { ...sector, answer: value.trim() === "Yes" ? "Yes" : "" };
            }
            return sector;
        });

        // If sectorId is not found, add a new entry
        if (!sectors.some((sector: { id: string }) => Number(sector.id) === Number(sectorId))) {
            updatedSectors.push({ id: sectorId, answer: value.trim() === "Yes" ? "Yes" : "" });
        }

        const updatedFormData = {
            ...prevData,
            cfw: [
                { ...prevData.cfw[0], sectors: updatedSectors }, // Only update cfw[0].sectors
                ...prevData.cfw.slice(1), // Keep the rest of cfw unchanged
            ],
        };
        if (sectorId === 3 && value === "Yes") {
            console.log("visible");
            setSelectedPersonsWithDisability("Yes");

        } else {
            setSelectedPersonsWithDisability("No");
        }
        console.log("sector id: " + sectorId + " selected Persons with dis: " + value);
        localStorage.setItem("formData", JSON.stringify(updatedFormData));
    };

    const handleSectorChange21 = (sectorId: string, value: string) => {
        // console.log("Sector ID: " + typeof sectorId + " sector value: " + value);

        const formData = localStorage.getItem("formData");
        const prevData = formData
            ? JSON.parse(formData)
            : {
                cfw: [
                    { sectors: [] },
                    { program_details: [] },
                    { disabilities: [] },
                    { family_composition: [] },
                    {}
                ],
            };

        // Check if sectors exist; if not, initialize with default structure
        const sectors = prevData.cfw[0].sectors.length > 0
            ? prevData.cfw[0].sectors
            : [{ id: sectorId, answer: "" }];

        // Map and update the sectors array
        const updatedSectors = sectors.map((sector: { id: string; answer?: string }) => {
            // console.log("Sector ID loop: " + typeof sector.id);
            if (Number(sector.id) === Number(sectorId)) {
                return { ...sector, answer: value.trim() === "Yes" ? "Yes" : "" };
            }
            return sector;
        });

        // If sectorId is not found, add a new entry
        if (!sectors.some((sector: { id: string }) => Number(sector.id) === Number(sectorId))) {
            updatedSectors.push({ id: sectorId, answer: value.trim() === "Yes" ? "Yes" : "" });
        }

        const updatedFormData = {
            ...prevData,
            cfw: [
                { ...prevData.cfw[0], sectors: updatedSectors }, // Only update cfw[0].sectors
                ...prevData.cfw.slice(1), // Keep the rest of cfw unchanged
            ],
        };

        localStorage.setItem("formData", JSON.stringify(updatedFormData));
        console.log("Updated formData:", updatedFormData);
    };




    const handleSectorChange1 = (sectorId: string, value: string) => {
        const formData = localStorage.getItem("formData");
        const prevData = formData ? JSON.parse(formData) : { cfw: [{ sectors: [] }] };

        // const updatedData = {
        //     ...prevData,
        //     cfw: prevData.cfw.map((cfwItem: any, index: number) => {
        //         if (index !== 0) return cfwItem; // Only modify the first element

        //         const sectors = cfwItem.sectors || [];
        //         const sectorExists = sectors.some((sector: any) => sector.sector_id === sectorId);

        //         const updatedSectors = sectorExists
        //             ? sectors.map((sector: any) =>
        //                 sector.sector_id === sectorId ? { ...sector, value } : sector
        //             )
        //             : [...sectors, { sector_id: sectorId, value }];

        //         return { ...cfwItem, sectors: updatedSectors };
        //     }),
        // };






        // localStorage.setItem("formData", JSON.stringify(updatedData));

        // setCapturedData(updatedData); // Optional: Update state if needed

        // console.log("Sector ID " + sectorId + " Value " + value);
        // if (sectorId === "3" && value === "Yes") {
        //     setSelectedPersonsWithDisability("Yes");
        //     updateCapturedData("cfw","is_need_pwd_id","Yes",4)
        // } else {
        //     setSelectedPersonsWithDisability("");
        //     updateCapturedData("cfw","is_need_pwd_id","No",4)
        // }
    };



    // const handleSectorChange = (sectorId: string, value: string) => {
    //     const updateSectorData = (updateFn: (prevData: any) => any) => {
    //       const formData = localStorage.getItem("formData");
    //       const prevData = formData ? JSON.parse(formData) : { cfw: [{ sectors: [] }] };

    //       const updatedData = updateFn(prevData);

    //       localStorage.setItem("formData", JSON.stringify(updatedData));
    //       // Uncomment this if you want to update the state as well
    //       // setCapturedData(updatedData);
    //     };
    // };      

    // const handleSectorChange = (sectorId: string, value: string) => {

    //     const numericValue = value === "Yes" ? 1 : 0;

    //     // Update or add the sector in the sectors array
    //     updateCapturedData("cfw", "sectors", { sector_id: sectorId, value: numericValue }, 0);


    // console.log(`Sector: ${sectorId}, Selected: ${value}`);
    // value === "Yes" ? "1" : 0;
    // updateCapturedData("cfw", "sector_id", value, 0);
    // // You can update your state here to capture the selection
    // setSelectedSectors((prev) => ({
    //     ...prev,
    //     [sectorId]: Boolean(value) // true for "Yes", false for "No"
    // }));


    // };


    const [formData, setFormData] = useState(() => {
        // Initialize formData from localStorage or set default structure
        const savedData = localStorage.getItem("formData");
        return savedData ? JSON.parse(savedData) : { cfw: [{ sectors: [] }] };
    });
    const [parsedData1, setParsedData] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const type_of_disability = await getTypeOfDisabilityLibraryOptions();
                console.log("Disability Options: " + JSON.stringify(type_of_disability));
                const convertedData = type_of_disability.map((item: { id: number; name: string }) => ({
                    id: item.id,  // Convert id to string
                    name: item.name,
                }))
                setDisabilityOptions(convertedData)  // Now it matches the expected format
                // console.log("Disability Options: " + convertedData);
                // setDisabilityOptions(type_of_disability);



                const sectors = await getSectorsLibraryOptions();
                setSectorOptions(sectors);

                const formDataLS = localStorage.getItem("formData");

                // First, check if formDataLS exists
                if (formDataLS) {
                    const parsedData = JSON.parse(formDataLS);
                    setSelectedDisabilities(parsedData?.cfw[2].disabilities || []);

                    console.log("Parsed Data: ", parsedData);
                    setParsedData(parsedData.cfw[0].sectors);
                    console.log("Final Parsed Data: ", parsedData1);
                    // Check if sectors array exists and is not empty
                    if (Array.isArray(parsedData.cfw[0].sectors) && parsedData.cfw[0].sectors.length > 0) {
                        console.log("Sectors array is not empty:", setFormData(parsedData.cfw[0].sectors));
                    } else {
                        console.log("Sectors array is empty or doesn't exist.");

                        // If empty, populate it
                        const updatedFormData = { ...parsedData };
                        updatedFormData.cfw[0].sectors = sectors.map((sector) => ({
                            id: sector.id,
                            name: sector.name,
                            answer: "",
                        }));
                        setFormData(updatedFormData);
                        localStorage.setItem("formData", JSON.stringify(updatedFormData));
                    }
                } else {
                    console.log("No formData found in localStorage.");

                    // If no formData, initialize it
                    const initialFormData = {
                        cfw: [
                            {
                                sectors: sectors.map((sector) => ({
                                    id: sector.id,
                                    name: sector.name,
                                    answer: "",
                                })),
                            },
                            { program_details: [] },
                            { disabilities: [] },
                            { family_composition: [] },
                            {}
                        ],
                    };

                    setFormData(initialFormData);
                    localStorage.setItem("formData", JSON.stringify(initialFormData));
                }


                if (formData.cfw[0].sectors[2].answer) {
                    if (formData.cfw[0].sectors[2].answer === "Yes") {
                        setSelectedPersonsWithDisability("Yes");
                    } else {
                        setSelectedPersonsWithDisability("No");
                    }

                }


                // console.log(sectors);
                console.log("The form data is : ", typeof formData);
                console.log("The form data is : ", formData.cfw[0].sectors);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleTypeOfDisabilityChange = (id: number) => {
        console.log("Selected Type of Disability ID:", id);
        setSelectedTypeOfDisabilityId(id);
    };
    return (
        <>
            <div className="space-y-12">
                <div className="grid sm:grid-cols-4 sm:grid-rows-2 gap-y-5 gap-x-[50px] mb-2">
                    {
                        selectedModalityId === 25 ? (
                            parsedData1.map((sector: any, index: number) => (
                                sector.id >= 1 && sector.id <= 9 ? (
                                    <div className="p-2" key={index}>
                                        <Label htmlFor={`sector${sector.id}`} className="block text-sm font-medium">{sector.name}</Label>
                                        <div className="mt-1 flex items-center gap-4">
                                            <Input
                                                className="mr-0 w-4 h-4"
                                                type="radio"
                                                id={`sector${sector.id}Yes`}
                                                name={`sector${sector.id}`}
                                                value="Yes"
                                                onChange={(e) => handleSectorChange(sector.id, e.target.value)}
                                                checked={sector.answer === "Yes"}
                                            />
                                            <Label htmlFor={`sector${sector.id}Yes`} className="mr-4">Yes</Label>

                                            <Input
                                                className="w-4 h-4"
                                                type="radio"
                                                id={`sector${sector.id}No`}
                                                name={`sector${sector.id}`}
                                                value="No"
                                                onChange={(e) => handleSectorChange(sector.id, e.target.value)}
                                                checked={sector.answer === "No"}
                                            />
                                            <Label htmlFor={`sector${sector.id}No`}>No</Label>



                                            {/* <RadioGroup

                                                // value={sector.answer}
                                                className="flex gap-4"
                                                onValueChange={(value) => handleSectorChange(sector.id, value)} // Pass id to handleSectorChange
                                            >
                                                <div className="flex items-center">
                                                    <RadioGroupItem value="Yes" id={`sector${sector.id}Yes`} />
                                                    <Label htmlFor={`sector${sector.id}Yes`} className="ml-2">Yes</Label>
                                                </div>
                                                <div className="flex items-center">
                                                    <RadioGroupItem value="No" id={`sector${sector.id}No`} />
                                                    <Label htmlFor={`sector${sector.id}No`} className="ml-2">No</Label>
                                                </div>
                                            </RadioGroup> */}
                                        </div>
                                        {
                                            errors?.[`sector${sector.id}`] && (
                                                <p className="mt-2 text-sm text-red-500">{errors[`sector${sector.id}`]}</p>
                                            )
                                        }
                                    </div>

                                ) : null
                            ))
                        ) : null
                    }

                    {selectedPersonsWithDisability === "Yes" && (
                        <div className="p-2  ">
                            <Label htmlFor="type_of_disabilities" className="block text-sm font-medium">Type of Disability</Label>
                            <div className="mt-1">
                                <FormMultiDropDown
                                    options={disabilityOptions}
                                    selectedValues={selectedDisabilities}
                                    onChange={handleDisabilitiesChange}
                                />


                            </div>
                            {errors?.type_of_disabilities && (
                                <p className="mt-2 text-sm text-red-500">{errors.type_of_disabilities[0]}</p>
                            )}
                        </div>
                    )}

                </div>





            </div >


        </>
    )
}