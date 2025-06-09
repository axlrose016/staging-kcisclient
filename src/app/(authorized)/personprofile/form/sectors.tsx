/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { FormMultiDropDown } from "@/components/forms/form-multi-dropdown";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { FormDropDown } from "@/components/forms/form-dropdown";
import React from "react";
import {
  getOfflineLibIPGroup,
  getOfflineLibSectorsLibraryOptions,
  getOfflineLibTypeOfDisability,
} from "@/components/_dal/offline-options";
import {
  IPersonProfile,
  IPersonProfileDisability,
  IPersonProfileSector,
} from "@/components/interfaces/personprofile";
import { v4 as uuidv4 } from "uuid";
import { CustomRadioGroup } from "@/components/ui/custom-radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SectorDetails({
  errors,
  capturedData,
  sectorData,
  disabilitiesData,
  selectedModality,
  updateFormData,
  updateSectorData,
  updateDisabilityData,
  session,
  user_id_viewing,
}: {
  errors: any;
  capturedData: Partial<IPersonProfile>;
  sectorData: Partial<IPersonProfileSector>[];
  disabilitiesData: Partial<IPersonProfileDisability>[];
  selectedModality: any;
  updateFormData: (newData: Partial<IPersonProfile>) => void;
  updateSectorData: (newData: Partial<IPersonProfileSector>[]) => void;
  updateDisabilityData: (newData: Partial<IPersonProfileDisability>[]) => void;
  session: any;
  user_id_viewing: any;
}) {
  const [formattedDateToday, setFormattedDateToday] = useState("");
  const [userIdViewing, setUserIdViewing] = useState(user_id_viewing);
  const [selectedPersonsWithDisability, setSelectedPersonsWithDisability] =
    useState("");
  const [isPersonWithDisablitiesSector, setIsPersonWithDisablitiesSector] =
    useState(false);
  const [selectedIP, setSelectedIP] = useState(""); //this is for showing and hiding group of IPs
  // const [typeOfDisabilityOptions, setTypeOfDisabilityOptions] = useState<LibraryOption[]>([]);
  const [selectedTypeOfDisability, setSelectedTypeOfDisability] = useState("");
  const [selectedTypeOfDisabilityId, setSelectedTypeOfDisabilityId] = useState<
    number | null
  >(null);

  const [selectedSector, setSelectedSector] = useState("");
  const [sectorOptions, setSectorOptions] = useState<LibraryOption[]>([]);

  const [selectedSectors, setSelectedSectors] = useState<{
    [key: string]: boolean;
  }>({});
  const [ipGroupsOptions, setIpGroupsOptions] = useState<LibraryOption[]>([]);
  const [selectedIpGroup, setselectedIpGroup] = useState("");
  const [selectedIpGroupId, setselectedIpGroupId] = useState(0);

  const [selectedDisabilities, setSelectedDisabilities] = React.useState<
    string[]
  >([]);
  const [disabilityOptions, setDisabilityOptions] = useState<
    { id: number; name: string }[]
  >([]);

  const [listOfSelectedSectors, setListOfSelectedSectors] = useState([]);

  // const [showListOfDisabilities, setShowListOfDisabilities] = useState(false)
  const [isListOfDisabsEnabled, setIsListOfDisabsEnabled] = useState(false);
  const [showListOfIPs, setShowListOfIPs] = useState(false);
  const handleIPGroupChange = (id: number) => {
    setselectedIpGroupId(id);
    console.log("IP Group ID is " + id);
    localStorage.setItem("ipgroup_id", id.toString());
    updateFormData({ ip_group_id: id });
  };

  const [isOpenDisabs, setIsOpenDisabs] = useState(false);

  const handleDisabilitiesChange = (updatedDisabilities: string[]) => {
    console.log("Selected Disabilities", updatedDisabilities);

    // Store updated disabilities in local storage
    // localStorage.setItem("disabilities", JSON.stringify(updatedDisabilities));

    // Track existing disability IDs
    const existingDisabilityIds = disabilitiesData.map((d) =>
      d.type_of_disability_id?.toString()
    );

    // Mark deleted disabilities
    const updatedData = disabilitiesData.map((disability) => {
      const isExisting = updatedDisabilities.includes(
        disability.type_of_disability_id?.toString() ?? ""
      );
      return {
        ...disability,
        is_deleted: !isExisting,
      };
    });

    // Add new disabilities if they do not exist
    const newDisabilities = updatedDisabilities
      .filter((id) => !existingDisabilityIds.includes(id))
      .map((id) => ({
        id: uuidv4(),
        type_of_disability_id: Number(id),
        is_deleted: false,
        created_by: session.userData.email,
        person_profile_id: capturedData.id,
      }));

    // Combine updated and new data
    const finalData = [...updatedData, ...newDisabilities];

    // Update the disability data
    localStorage.setItem("person_disabilities", JSON.stringify(finalData));
    updateDisabilityData(finalData);
  };

  const handleSectorChange = (sectorId: number, isSelected: boolean): void => {
    debugger;
    console.log(`${isSelected ? "Adding" : "Removing"} sector id:`, sectorId);

    const currentData: Partial<IPersonProfileSector>[] = Array.isArray(
      sectorData
    )
      ? sectorData
      : [];

    const existingSector = currentData.find(
      (sector) => sector.sector_id === sectorId
    );
    // alert(isSelected)
    if (isSelected) {
      if (existingSector) {
        if (existingSector.is_deleted) {
          existingSector.is_deleted = false; // Restore if deleted
          console.log("Sector restored:", sectorId);
        } else {
          console.log("Sector already exists");
        }
      } else {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(
          date.getHours()
        ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
          2,
          "0"
        )}:${String(date.getSeconds()).padStart(2, "0")}`;
        const newSector: Partial<IPersonProfileSector> = {
          id: uuidv4(),
          sector_id: sectorId,
          is_deleted: false,
          created_by: session.userData.email,
          person_profile_id: capturedData.id,
          created_date: formattedDate,

          user_id: session.id,
          last_modified_by: null,
          last_modified_date: null,
          push_date: null,
          push_status_id: 2,
          deleted_by: null,
          deleted_date: null,
          remarks: "Person Profile Sector Created",
        };
        currentData.push(newSector);
        console.log("New sector added:", newSector);
      }
      // if (sectorId == 3) setShowListOfDisabilities(true)
      if (sectorId == 4) setShowListOfIPs(true);
    } else {
      if (existingSector) {
        existingSector.is_deleted = true;
        console.log("Sector marked as deleted:", sectorId);
      } else {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(
          date.getHours()
        ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
          2,
          "0"
        )}:${String(date.getSeconds()).padStart(2, "0")}`;
        const newSector: Partial<IPersonProfileSector> = {
          id: uuidv4(),
          sector_id: sectorId,
          is_deleted: true,
          created_by: session.userData.email,
          person_profile_id: capturedData.id,
          created_date: formattedDate,

          user_id: session.id,
          last_modified_by: null,
          last_modified_date: null,
          push_date: null,
          push_status_id: 2,
          deleted_by: null,
          deleted_date: null,
          remarks: "Person Profile Sector Created",
        };
        currentData.push(newSector);
        console.log("New sector added as deleted:", newSector);
      }
      // if (sectorId == 3) setShowListOfDisabilities(false)
      localStorage.setItem("ipgroup_id", "0");
      setselectedIpGroupId(0);
      if (sectorId == 4) setShowListOfIPs(false);
    }
    if (sectorId == 3) {
      updateFormData({ is_pwd: isSelected });
    }
    // if (existingSector?.sector_id === 3) {
    //     updateFormData({ is_pwd: isSelected })
    // }
    if (sectorId === 4) {
      updateFormData({ is_ip: isSelected });
    }
    // if (existingSector?.sector_id === 4) {
    //     updateFormData({ is_ip: isSelected })
    // }
    updateSectorData([...currentData]);
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
        debugger;
        const sectors = await getOfflineLibSectorsLibraryOptions(); //await getSectorsLibraryOptions();

        if (capturedData.sex_id == 2) {
          // male
          const excludeSectorIfSexIsMale = ["1", "13"];
          const filteredSectors = sectors.filter(
            (sector) => !excludeSectorIfSexIsMale.includes(sector.id.toString())
          );

          setSectorOptions(filteredSectors);
        } else {
          setSectorOptions(sectors);
        }
        setIsListOfDisabsEnabled(false);
        // setShowListOfDisabilities(false)
        // check if there is value from localstorage
        const storedSectors = localStorage.getItem("person_sectors");
        if (storedSectors) {
          const parsedSectors = JSON.parse(storedSectors);

          // Remove any sector where sector_id === 0
          const filteredSectors = parsedSectors.filter(
            (sector: any) => sector.sector_id !== "0" && sector.person_profile_id.toString() == capturedData.id?.toString() 
          );

          // Optional: Update localStorage to remove those entries too
          localStorage.setItem(
            "person_sectors",
            JSON.stringify(filteredSectors)
          );

          // Update state
          setListOfSelectedSectors(filteredSectors);
          const parsedStoredSector = JSON.parse(storedSectors || "");
          const sectorWithId3 = parsedStoredSector.find(
            (sector: any) =>
              sector.sector_id === 3 && sector.is_deleted === false
          );
          setIsListOfDisabsEnabled(sectorWithId3 != undefined);
          console.log("Sector with ID 3 and is_deleted false:", sectorWithId3);

          console.log("Stored Sectors;  ", storedSectors);
        }

        // if (!storedSectors) {
        //     let sectorFields = sectors.map((sector, index) => ({
        //         id: sector.id,
        //         name: sector.name,
        //         answer: ""
        //     }))
        //     const stringedSectors = JSON.stringify(sectorFields);
        //     storedSectors = stringedSectors;
        // }

        //

        // search for sector of PWD

        const type_of_disability = await getOfflineLibTypeOfDisability(); //await getTypeOfDisabilityLibraryOptions();
        console.log("Disability Options: ", JSON.stringify(type_of_disability));
        console.log("Debugging");
        console.log("Disabilities type is ", typeof type_of_disability);
        const convertedData = type_of_disability.map(
          (item: { id: number; name: string }) => ({
            id: item.id, // Convert id to string
            name: item.name,
          })
        );
        setDisabilityOptions(convertedData); // Now it matches the expected format

        const storedSelectedDisabilities = localStorage.getItem(
          "person_disabilities"
        );
        // alert(typeof storedSelectedDisabilities)
        if (storedSelectedDisabilities) {
          updateDisabilityData(JSON.parse(storedSelectedDisabilities));

          setIsListOfDisabsEnabled(true);
        }
        // console.log("Disability Options: " + convertedData);
        // setDisabilityOptions(type_of_disability);
        // updateSelectedDisabilities()

        // debugger;
        // const storedDisabs = localStorage.getItem("disabilities");
        // if (storedDisabs !== null) {
        //     setSelectedDisabilities(JSON.parse(storedDisabs));
        // }

        // IP Group
        const ip_groups = await getOfflineLibIPGroup();
        setIpGroupsOptions(ip_groups);

        debugger;
        const ip_group_id = localStorage.getItem("ipgroup_id") || "0";
        localStorage.setItem("ipgroup_id", ip_group_id);

        setShowListOfIPs(ip_group_id !== "0");
        setselectedIpGroupId(Number(ip_group_id));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleTypeOfDisabilityChange = (id: number) => {
    console.log("Selected Type of Disability ID:", id);
    setSelectedTypeOfDisabilityId(id);
  };

  const isSectorSelected = (sectorId: number): boolean => {
    const currentData: Partial<IPersonProfileSector>[] = Array.isArray(
      sectorData
    )
      ? sectorData
      : [];
    const sector = currentData.find((sector) => sector.sector_id === sectorId);
    return !!sector && !sector.is_deleted;
  };

  const isSectorUnselected = (sectorId: number): boolean => {
    const currentData: Partial<IPersonProfileSector>[] = Array.isArray(
      sectorData
    )
      ? sectorData
      : [];
    const sector = currentData.find((sector) => sector.sector_id === sectorId);
    return !!sector && sector.is_deleted === true;
  };

  useEffect(() => {
    if (userIdViewing) {
      const form = document.getElementById("sectors_info_form");
      if (form) {
        form.querySelectorAll("input[type='radio']").forEach((el) => {
          (el as HTMLInputElement).disabled = true;
        });
      }
    }
  }, [userIdViewing]);

  // useEffect(() => {
  //     debugger;
  //     const lsSec = localStorage.getItem("person_sectors")
  //     let isPWD = false;
  //     if (lsSec) {
  //         const parsedStoredSector = JSON.parse(lsSec)
  //         const sectorWithId3 = parsedStoredSector.find((sector: any) => sector.sector_id === 3 && sector.is_deleted === false);
  //         // setShowListOfDisabilities(sectorWithId3)
  //         // if (sectorWithId3) {
  //         isPWD = sectorWithId3

  //         // }
  //     }

  //     if (!isPWD && disabilitiesData.length > 0) {
  //         updateDisabilityData([]);
  //     }
  // }, [showListOfDisabilities]);
  // useEffect(() => {
  //     debugger;
  //     const lsIP = localStorage.getItem("ipgroup_id")
  //     let hasIpgroup = false;
  //     if (lsIP == "1") {
  //         setShowListOfDisabilities(true)
  //         hasIpgroup = true
  //         // const parsedStoredIP = JSON.parse(lsIP)
  //         // const sectorWithId3 = lsIP.find((sector: any) => sector.sector_id === 3 && sector.is_deleted === false);
  //         // if (sectorWithId3) {
  //         //     isPWD = true
  //         //     setShowListOfDisabilities(true)
  //         // }
  //     }

  //     if (!hasIpgroup) {
  //         localStorage.setItem("ipgroup_id", "0");
  //     }
  // }, [showListOfIPs]);
  const updateDatetoday = () => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
    ).padStart(2, "0")}`;
    setFormattedDateToday(formattedDate);
  };
  const updateSelectedDisabilities = () => {
    const storedSelectedDisabilities = localStorage.getItem(
      "person_disabilities"
    );
    // alert(typeof storedSelectedDisabilities)
    if (storedSelectedDisabilities) {
      updateDisabilityData(JSON.parse(storedSelectedDisabilities));
      setIsListOfDisabsEnabled(true);
    }
  };
  const handleSectorRadioGroupChange = (e: any) => {
    console.log("Sector responses❤️:", e);
    debugger;   
    localStorage.setItem("person_sectors", JSON.stringify(e));
    const isPWDSector = e.find(
      (sector: any) =>
        sector.sector_id.toString() === "3" && sector.is_deleted == false
    );
    console.log("result is ", isPWDSector != undefined);
    // alert(isPWDSector)
    setIsListOfDisabsEnabled(isPWDSector != undefined);
    if (isPWDSector == undefined) {
      localStorage.removeItem("person_disabilities");
      updateDisabilityData([]);
      // updateSelectedDisabilities()
    }

    const isIPSector = e.find(
      (sector: any) =>
        sector.sector_id.toString() === "4" && sector.is_deleted == false
    );
    console.log("result is ", isIPSector != undefined);
    // alert(isPWDSector)
    setIsListOfDisabsEnabled(isIPSector != undefined);
    if (isIPSector == undefined) {
      localStorage.removeItem("ipgroup_id");
      setselectedIpGroupId(0);
      // updateDisabilityData([]);
      // updateSelectedDisabilities()
    }

    // const lsPS = e

    // if (lsPS) {

    //     const lsPS1 = lsPS.find((sector: any) => sector.sector_id.toString() === "3" && sector.is_deleted == false);
    //     if (lsPS1) {
    //         console.log("Found sector with id 3:", lsPS1);
    //         setShowListOfDisabilities(true)
    //     } else {
    //         console.log("Not Found sector with id 3:", lsPS1);
    //         setShowListOfDisabilities(false)
    //     }
    // }
    // const lsIsPwdSector = localStorage.getItem("isPWDSector")
    // if (lsIsPwdSector) {

    //     // const parsedIsPWDSector = JSON.parse(lsIsPwdSector)
    //     // if (Array.isArray(parsedIsPWDSector)) {

    //     //     const sectorWithId3 = parsedIsPWDSector.find((sector: any) => sector.sector_id.toString() === "3"  );
    //     //     if (sectorWithId3) {
    //     //         console.log("Found sector with id 3:", sectorWithId3);
    //     //         setShowListOfDisabilities(true)
    //     //     } else {
    //     //         console.log("Not Found sector with id 3:", sectorWithId3);
    //     //         setShowListOfDisabilities(false)
    //     //     }
    //     // }else{

    //     // }
    // }else{
    //     console.log("Not Found sector with id 3:")
    //      setShowListOfDisabilities(false)
    // }
  };

  return (
    <div className="pt-4">
      {/* user id {session.id} */}
      {/* {session.userData.email} */}
      {/* {typeof listOfSelectedSectors} */}
      {/* Is PWD sector {isPersonWithDisablitiesSector} */}
      {/* Sectors: {JSON.stringify(sectorOptions)} */}
      {/* Selected Sectors
      <pre
        style={{
          background: "#f6f8fa",
          padding: "1rem",
          borderRadius: "6px",
          overflowX: "auto",
        }}
      >
        {JSON.stringify(listOfSelectedSectors, null, 2)}
      </pre>
      Sex ID: {capturedData.sex_id} */}
      <Alert className="mb-3" variant={"information"}>
        <AlertTitle></AlertTitle>
        <AlertDescription>
          Please choose the sector(s) you belong to.
          <br />
          Select "Yes" or "No" for each sector.
          <br />
          If you select "Persons with Disability", you will be asked to specify
          the type(s) of disability.
          <br />
          If you select "Indigenous People", you will be asked to specify the IP
          group.
        </AlertDescription>
      </Alert>
      <div
        className=" grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-y-5 gap-x-5 mb-2"
        id="sectors_info_form"
      >
        {/* <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-y-5 gap-x-[50px] mb-2 bg-red-200" id="sectors_info_form"> */}
        {selectedModality === 25 && (
          <CustomRadioGroup
            options={sectorOptions}
            values={listOfSelectedSectors}
            onChange={(e) => {
              {
                handleSectorRadioGroupChange(e);
              }
            }}
            created_by={session.userData.email}
            person_profile_id={capturedData.id}
            created_date={formattedDateToday}
            user_id={session.id}
          />
        )}

        <div
          className={`p-2 border rounded-lg p-5 ${
            isListOfDisabsEnabled ? "" : "hidden"
          } `}
        >
          <Label
            htmlFor="type_of_disabilities"
            className="block text-sm font-medium mb-3"
          >
            Type of Disability
          </Label>
          <FormMultiDropDown
            options={disabilityOptions}
            selectedValues={
              Array.isArray(disabilitiesData)
                ? disabilitiesData
                    .filter((d) => !d.is_deleted && d.type_of_disability_id)
                    .map((d) => d.type_of_disability_id!.toString())
                : []
            }
            onChange={handleDisabilitiesChange}
          />
          {errors?.type_of_disabilities && (
            <p className="mt-2 text-sm text-red-500">
              {errors.type_of_disabilities}
            </p>
          )}
        </div>
        <div
          className={`p-2 border rounded-lg p-5 ${
            showListOfIPs ? "" : "hidden"
          }`}
        >
          <Label htmlFor="ip_group" className="block text-sm font-medium">
            IP Group
          </Label>
          <FormDropDown
            id="ip_group"
            options={ipGroupsOptions}
            onChange={handleIPGroupChange}
            selectedOption={selectedIpGroupId}
          />
          {errors?.ip_group && (
            <p className="mt-2 text-sm text-red-500">{errors.ip_group}</p>
          )}
        </div>

        {/* </div> */}
      </div>
      {/* <pre>Selected Disabilities: {disabilitiesData.length}</pre> */}
      {/* <pre>{updateFormData.length}</pre> */}
      {/* <pre>{listOfSelectedSectors.length}</pre> */}
      {/* <pre>Selected IP: {selectedIpGroupId}</pre> */}
      <div className="space-y-12 hidden">
        <div
          className="grid sm:grid-cols-4 sm:grid-rows-2 gap-y-5 gap-x-[50px] mb-2 "
          id="sectors_info_form"
        >
          {selectedModality === 25 &&
            Array.isArray(sectorOptions) &&
            sectorOptions
              .filter((sector) => sector.id >= 1 && sector.id <= 19)
              .map((sector) => (
                <React.Fragment key={sector.id}>
                  <div className={`p-2    `}>
                    <Label
                      htmlFor={`sector${sector.id}`}
                      className="block text-sm font-medium"
                    >
                      {sector.name}
                    </Label>
                    <div
                      className="mt-1 flex items-center gap-4"
                      key={sector.id + 0.01}
                    >
                      {["Yes", "No"].map((value) => (
                        <div
                          key={sector.id + value}
                          className={`flex items-center gap-1`}
                        >
                          <Input
                            key={value}
                            className="w-4 h-4 custom-radio"
                            type="radio"
                            id={`sector${sector.id}${value}`}
                            name={`sector${sector.id}`} // Same name = grouped radio buttons
                            value={value}
                            checked={
                              isSectorSelected(sector.id) === undefined
                                ? false // Nothing selected
                                : value === "Yes"
                                ? isSectorSelected(sector.id)
                                : !isSectorSelected(sector.id)
                            }
                            onChange={() =>
                              handleSectorChange(sector.id, value === "Yes")
                            }
                            disabled={!!userIdViewing}
                          />

                          {/* <Input
                                                        className="w-4 h-4 custom-radio"
                                                        type="radio"
                                                        id={`sector${sector.id}${value}`}
                                                        name={`sector${sector.id}`}
                                                        value={value}
                                                        checked={value === "Yes" && 
                                                            Array.isArray(listOfSelectedSectors) &&
                                                            listOfSelectedSectors.some((ss: any) => sector.id === ss.sector_id)
                                                        }
                                                        // checked={value === "Yes" && sector.id == 3 ? isSectorSelected(sector.id) : isSectorUnselected(sector.id)}
                                                        onChange={() => handleSectorChange(sector.id, value === "Yes")}
                                                        disabled={userIdViewing ? true : false} // Disable if userIdViewing is set

                                                    /> */}
                          <Label htmlFor={`sector${sector.id}${value}`}>
                            {value}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors?.[`sector${sector.id}`] && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors[`sector${sector.id}`]}
                      </p>
                    )}
                  </div>
                  {/* {sector.id == 3 && showListOfDisabilities && disabilitiesData && Array.isArray(disabilitiesData) && (
                                        <div className="p-2">
                                            <Label htmlFor="type_of_disabilities" className="block text-sm font-medium">Type of Disability</Label>
                                            <FormMultiDropDown
                                                options={disabilityOptions}
                                                selectedValues={disabilitiesData
                                                    .filter((d) => !d.is_deleted && d.type_of_disability_id)
                                                    .map((d) => d.type_of_disability_id!.toString())}
                                                onChange={handleDisabilitiesChange}
                                            />
                                            {errors?.type_of_disabilities && <p className="mt-2 text-sm text-red-500">{errors.type_of_disabilities}</p>}
                                        </div>
                                    )} */}
                  {/* {showListOfDisabilities   && (
                                    {sector.id == 3 && capturedData.is_pwd && (
                                        <div className="p-2" >
                                            <Label htmlFor="type_of_disabilities" className="block text-sm font-medium">Type of Disability</Label>
                                            <FormMultiDropDown
                                                options={disabilityOptions}
                                                selectedValues={disabilitiesData
                                                    .filter((d) => !d.is_deleted && d.type_of_disability_id)
                                                    .map((d) => d.type_of_disability_id!.toString())}
                                                onChange={handleDisabilitiesChange}
                                            />
                                            {errors?.type_of_disabilities && <p className="mt-2 text-sm text-red-500">{errors.type_of_disabilities}</p>}
                                        </div>
                                    )} */}
                  {/* {sector.id == 4 && showListOfIPs && (
                                        <div className="p-2">
                                            <Label htmlFor="ip_group" className="block text-sm font-medium">IP Group</Label>
                                            <FormDropDown
                                                id="ip_group"
                                                options={ipGroupsOptions}
                                                onChange={handleIPGroupChange}
                                                selectedOption={selectedIpGroupId}
                                            />
                                            {errors?.ip_group && <p className="mt-2 text-sm text-red-500">{errors.ip_group}</p>}
                                        </div>
                                    )} */}

                  {/* {sector.id == (capturedData.is_pwd ? 6 : 7) && capturedData.is_ip && (
                                        <div className="p-2">
                                            <Label htmlFor="ip_group" className="block text-sm font-medium">IP Group</Label>
                                            <FormDropDown
                                                id="ip_group"
                                                options={ipGroupsOptions}
                                                onChange={handleIPGroupChange}
                                                selectedOption={selectedIpGroupId}
                                            />
                                            {errors?.ip_group && <p className="mt-2 text-sm text-red-500">{errors.ip_group}</p>}
                                        </div>
                                    )} */}
                </React.Fragment>
              ))}

          {/* {sector.id == 3 && capturedData.is_pwd && ( */}
          {/* {showListOfDisabilities && disabilitiesData && Array.isArray(disabilitiesData) && (
                        <div className="p-2">
                            <Label htmlFor="type_of_disabilities" className="block text-sm font-medium">Type of Disability</Label>
                            <FormMultiDropDown
                                options={disabilityOptions}
                                selectedValues={disabilitiesData
                                    .filter((d) => !d.is_deleted && d.type_of_disability_id)
                                    .map((d) => d.type_of_disability_id!.toString())}
                                onChange={handleDisabilitiesChange}
                            />
                            {errors?.type_of_disabilities && <p className="mt-2 text-sm text-red-500">{errors.type_of_disabilities}</p>}
                        </div>
                    )} */}
        </div>
      </div>
    </div>
  );
}
