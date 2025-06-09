
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormMultiDropDown } from "@/components/forms/form-multi-dropdown";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { getIPGroupLibraryOptions, getSectorsLibraryOptions, getTypeOfDisabilityLibraryOptions } from "@/components/_dal/options";
import { FormDropDown } from "@/components/forms/form-dropdown";
import React from "react";
import { parse } from "path";
import { constructNow } from "date-fns";

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


    const [ipGroupsOptions, setIpGroupsOptions] = useState<LibraryOption[]>([]);
    const [selectedIpGroup, setselectedIpGroup] = useState("");
    const [selectedIpGroupId, setselectedIpGroupId] = useState<number>();

    useEffect(() => {
        console.log("Data is : " + typeof selectedIpGroupId);
    }, [selectedIpGroupId])
    interface Sector {
        id: string;
        name: string;
        answer: string;
    }
    // const [sectorsArrayfromLS, setSectorsArrayfromLS] = useState<Sector[]>([]);
    // () => {
    // if (typeof window !== "undefined") {
    //     const sect = localStorage.getItem("sectors");
    //     console.log("Sect value is ", sect);
    //     return (sect) ? JSON.parse(sect) : {}
    // }
    // return {};
    // });

    // useEffect(() => {
    //     localStorage.setItem("sectors", JSON.stringify(sectorsArrayfromLS))
    // }, [sectorsArrayfromLS])
    // const [selectedDisabilties, setSelectedDisabilties] = useState<string[]>([])
    const [selectedDisabilities, setSelectedDisabilities] = React.useState<string[]>([])
    const [disabilityOptions, setDisabilityOptions] = useState<{ id: number; name: string }[]>([])

    const [storedSect, setStoredSect] = useState<any[]>(() => {
        if (typeof window === "undefined") return []; // Prevents SSR issues
        const data = localStorage.getItem("sectors");
        if (data !== null) {
            try {
                return JSON.parse(data); // Ensure it's parsed correctly
            } catch (error) {
                console.error("Error parsing storedSect:", error);
                return []; // Return empty array if parsing fails
            }
        }
        return []; // Return empty array when data is null
    });


    const [commonData, setCommonData] = useState(() => {
        if (typeof window !== "undefined") {
            const cd = localStorage.getItem("commonData");
            return cd ? JSON.parse(cd) : {};
        }
        return {};

    })

    useEffect(() => {
        localStorage.setItem("commonData", JSON.stringify(commonData));
    }, [commonData]);

    const handleIPGroupChange = (id: string) => {
        setselectedIpGroupId(Number(id));
        console.log("IP Group ID is " + id);
        localStorage.setItem("ip_group_id", id);
    }

    const handleDisabilitiesChange = (updatedDisabilities: string[]) => {
        // debugger;
        setSelectedDisabilities(updatedDisabilities); // Update state directly
        const dis = localStorage.getItem("disabilities");
        (dis !== null) ? localStorage.removeItem("disabilities") : "";
        localStorage.setItem("disabilities", JSON.stringify(updatedDisabilities));
        // const formData = localStorage.getItem("formData");
        // const prevData = formData ? JSON.parse(formData) : { cfw: [{}, {}, {}] };

        // const updatedData = {
        //     ...prevData,
        //     cfw: prevData.cfw.map((cfwItem: any, index: number) => {
        //         if (index !== 2) return cfwItem; // Only modify index 2

        //         // Update the disabilities array directly with the new values
        //         return { ...cfwItem, disabilities: updatedDisabilities };
        //     }),
        // };

        // localStorage.setItem("formData", JSON.stringify(updatedData));
        // setCapturedData(updatedData); // Update your local state if necessary
    };


    const handleSectorChange = (sectorId: any, value: string) => {
        console.log("The sector id is " + sectorId + " and value is " + value);

        const storedSectors = localStorage.getItem("sectors");
        let sectorsObj = storedSectors ? JSON.parse(storedSectors) : {};

        // Update the selected sector
        sectorsObj[sectorId - 1] = { id: sectorId, name: sectorsObj[sectorId - 1].name, answer: value };


        if (sectorId === 3 && value === "Yes") {
            // console.log("visible");
            setSelectedPersonsWithDisability("Yes");

        } else {
            setSelectedPersonsWithDisability("No");
        }

        // setSectorsArrayfromLS(sectorsObj);
        // console.log("A ", sectorsArrayfromLS);
        // Save the updated data back to localStorage
        setStoredSect(sectorsObj);
        // console.log(storedSect);
        localStorage.setItem("sectors", JSON.stringify(sectorsObj));

        if(sectorId === 4 && value === "Yes"){
            setSelectedIP("Yes");
        }else{
            setSelectedIP("No");
            localStorage.removeItem("ip_group_id");
        }
    }

    useEffect(() => {
        console.log("Updated storedSect:", storedSect);
    }, [storedSect]); // Runs whenever storedSect changes


    const handleSectorChange1 = (sectorId: any, value: string) => {
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
        const sectors = prevData.cfw.sectors.length > 0
            ? prevData.cfw.sectors
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
                { ...prevData.cfw, sectors: updatedSectors }, // Only update cfw.sectors
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


                // debugger;
                const sectors = await getSectorsLibraryOptions();
                setSectorOptions(sectors);

                // check if there is value from localstorage
                const storedSectors = localStorage.getItem("sectors");
                if (storedSectors === null) {
                    // populate the localstorage
                    // console.log("Its empty");
                    let extendedSectors: { id: number; name: string; answer: string }[] = [];
                    extendedSectors = sectors.map((sector, index) => ({
                        ...sector,
                        answer: "" // Keep existing answers or set to ""
                    }));
                    localStorage.setItem("sectors", JSON.stringify(extendedSectors));
                }

                const sectorsFromLS = localStorage.getItem("sectors");
                setStoredSect(sectorsFromLS ? JSON.parse(sectorsFromLS) : []);
                console.log("SS to ", sectorsFromLS);

                // debugger;
                const storedDisabs = localStorage.getItem("disabilities");
                if (storedDisabs !== null) {
                    setSelectedDisabilities(JSON.parse(storedDisabs));
                }

                const ip_groups = await getIPGroupLibraryOptions();
                setIpGroupsOptions(ip_groups);

                // debugger;
                const ip_group_id = localStorage.getItem("ip_group_id");
                if (ip_group_id) {
                    const ipgid = Number(ip_group_id);
                    setselectedIpGroupId(ipgid); // Keep it as a string
                    console.log("IP Group Id is " + ipgid);
                    console.log("Type of IP Group Id is " + typeof ipgid);
                }

                // else {
                //     // get the localstorage and populate the radio button
                //     console.log("Its not empty");
                // }
                // console.log("SS type is ", typeof storedSectors);


                // const extendedSectors = sectors.map((sector) => ({
                //     ...sector, // Copy existing properties (id, name)
                //     answer: "" // Add a new column
                // }));

                // localStorage.setItem("sectors", JSON.stringify(extendedSectors));

                // let sectorsLS: Record<string, { id: string; name: string, answer: string }> | null = localStorage.getItem("sectors")
                //     ? JSON.parse(localStorage.getItem("sectors") as string)
                //     : null;

                // if (sectorsLS === null || Object.keys(sectorsLS).length === 0) {
                //     const sectorsLS1 = sectors.reduce((acc: Record<string, { id: string; name: string, answer: string }>, s) => {
                //         acc[s.id] = { id: s.id, name: s.name, answer: "" }; // Ensure `s.id` exists
                //         return acc;
                //     }, {});
                //     // setSectorsArrayfromLS(JSON.parse(sectorsLS1));
                //     localStorage.setItem("sectors", JSON.stringify(sectorsLS1));
                //     // const sectorsLS = JSON.parse(localStorage.getItem("sectors") || "{}");
                //     // setSectorsArrayfromLS(JSON.parse(localStorage.getItem("sectors") || "{}"));

                // }
                // else {
                //     // setSectorsArrayfromLS(JSON.parse(localStorage.getItem("sectors") || "{}"));
                // }
                // console.log("Sectors are " + typeof sectorsLS);
                return;
                const formDataLS = localStorage.getItem("formData");

                // First, check if formDataLS exists
                if (formDataLS) {
                    const parsedData = JSON.parse(formDataLS || "");
                    setSelectedDisabilities(parsedData?.cfw[2].disabilities || []);

                    // console.log("Parsed Data: ", parsedData);
                    setParsedData(parsedData.cfw.sectors);
                    // console.log("Final Parsed Data: ", parsedData1);
                    // Check if sectors array exists and is not empty
                    if (Array.isArray(parsedData.cfw.sectors) && parsedData.cfw.sectors.length > 0) {
                        console.log("Sectors array is not empty:", setFormData(parsedData.cfw.sectors));
                    } else {
                        console.log("Sectors array is empty or doesn't exist.");

                        // If empty, populate it
                        const updatedFormData = { ...parsedData };
                        updatedFormData.cfw.sectors = sectors.map((sector) => ({
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


                if (formData.cfw.sectors[2].answer) {
                    if (formData.cfw.sectors[2].answer === "Yes") {
                        setSelectedPersonsWithDisability("Yes");
                    } else {
                        setSelectedPersonsWithDisability("No");
                    }

                }


                // console.log(sectors);
                console.log("The form data is : ", typeof formData);
                console.log("The form data is : ", formData.cfw.sectors);

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

                        commonData.modality_id !== undefined && commonData.modality_id === 25 ? (
                            (Array.isArray(storedSect) ? storedSect : []).map((sector: any, index: number) => (
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
                                                checked={sector.answer === "Yes"}
                                                // checked={sector.answer === "Yes" || ""}
                                                onChange={(e) => handleSectorChange(sector.id, e.target.value)}
                                            />
                                            <Label htmlFor={`sector${sector.id}Yes`} className="mr-4">Yes</Label>

                                            <Input
                                                className="w-4 h-4"
                                                type="radio"
                                                id={`sector${sector.id}No`}
                                                name={`sector${sector.id}`}
                                                value="No"
                                                checked={sector.answer === "No"}
                                                // checked={sectorsArrayfromLS[sector.id].answer === "No" || false}
                                                onChange={(e) => handleSectorChange(sector.id, e.target.value)}
                                            />
                                            <Label htmlFor={`sector${sector.id}No`}>No</Label>

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
                    {/* dto natapos sa pagdisplay ng disabilities, need dn ng pang IP */}
                    {storedSect[2].answer && storedSect[2].answer === "Yes" && (
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
                                <p className="mt-2 text-sm text-red-500">{errors.type_of_disabilities}</p>
                            )}
                        </div>
                    )}
                    {storedSect[3].answer && storedSect[3].answer === "Yes" && (
                        <div className="p-2  ">
                            <Label htmlFor="ip_group" className="block text-sm font-medium">IP Group</Label>
                            <div className="mt-1">
                                <FormDropDown
                                    id="ip_group"
                                    options={ipGroupsOptions}
                                    onChange={handleIPGroupChange}
                                    selectedOption={selectedIpGroupId}
                                />
                            </div>
                            {errors?.ip_group && (
                                <p className="mt-2 text-sm text-red-500">{errors.ip_group}</p>
                            )}
                           
                           
                        </div>


                    )}

                </div>





            </div >


        </>
    )
}