import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getDeploymentAreaLibraryOptions, getTypeOfWorkLibraryOptions } from "@/components/_dal/options";
import { getOfflineLibDeploymentArea, getOfflineLibDeploymentAreaCategories, getOfflineLibSchools, getOfflineLibTypeOfWork } from "@/components/_dal/offline-options";
import { IPersonProfile } from "@/components/interfaces/personprofile";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
export default function PrefferedDeploymentArea({ errors, capturedData, updateFormData, user_id_viewing }: { errors: any; capturedData: Partial<IPersonProfile>; updateFormData: (newData: Partial<IPersonProfile>) => void, user_id_viewing: string }) {
    const [userIdViewing, setUserIdViewing] = useState(user_id_viewing);
    const [relationOptions, setRelationOptions] = useState<LibraryOption[]>([]);
    const [selectedRelation, setSelectedRelation] = useState("");

    const [deploymentAreaOptions, setDeploymentAreaOptions] = useState<LibraryOption[]>([]);
    const [deploymentAreaCategoriesOptions, setDeploymentAreaCategoriesOptions] = useState<LibraryOption[]>([]);
    const [selectedDeploymentArea, setSelectedDeploymentArea] = useState("");
    const [selectedDeploymentAreaId, setSelectedDeploymentAreaId] = useState<number | null>(null);
    const [typeOfWorkOptions, setTypeOfWorkOptions] = useState<LibraryOption[]>([]);
    const [selectedTypeOfWork, setSelectedTypeOfWork] = useState("");
    const [selectedTypeOfWorkId, setSelectedTypeOfWorkId] = useState<number | null>(null);
    const [selectedAssignedDeploymentAreaId, setSelectedAssignedDeploymentAreaId] = useState(0);
    const [selectedAssignedDeploymentAreaCategoryId, setSelectedAssignedDeploymentAreaCategoryId] = useState(0);

    const [immediateSupervisorOptions, setImmediateSupervisorOptions] = useState<LibraryOption[]>([]);
    const [selectedImmediateSupervisorName, setSelectedImmediateSupervisorName] = useState("");
    const [selectedImmediateSupervisorId, setSelectedImmediateSupervisorId] = useState("");
    const [alternateSupervisorOptions, setAlternateSupervisorOptions] = useState<LibraryOption[]>([]);
    const [selectedAlternateSupervisorName, setSelectedAlternateSupervisorName] = useState("");
    const [selectedAlternateSupervisorId, setSelectedAlternateSupervisorId] = useState("");
    const [schoolOptions, setSchoolOptions] = useState<LibraryOption[]>([]);
    const initialEducation = {
        is_graduate: false,
        school_id: 0,
        school_name: "",
        short_name: "",
        campus: "",
        school_address: "",
        course_id: 0,
        year_graduated: "",
        year_level_id: 0
    };
    const [educationalAttainment, setEducationalAttainment] = useState(initialEducation);

    const initialPreferredDeployment = {
        deployment_area_id: 0,

        deployment_area_name: "",
        deployment_area_address: "",
        preffered_type_of_work_id: 0,
        assigned_deployment_area_id: 0,
        assigned_deployment_area_category_id: 0,
        assigned_deployment_area_name: "",
        immediate_supervisor_id: 0,
        immediate_supervisor_name: "",
        alternate_supervisor_id: 0,
        alternate_supervisor_name: "",

    }

    const [preferredDeployment, setPreferredDeployment] = useState(initialPreferredDeployment);
    const updatingData = (field: any, value: any) => {

        setPreferredDeployment((prev: any) => {
            const updatedData = { ...prev, [field]: value };

            // Update localStorage
            localStorage.setItem("preferred_deployment", JSON.stringify(updatedData));

            return updatedData;
        });

    }

    const [isSchoolAsDeploymentArea, setIsSchoolAsDeploymentArea] = useState(false); //trigger to filter the deployment area select
    // useEffect(() => {
    //     setSelectedDeploymentAreaId(0);
    //     const  lsAssignedDeploymentAreaFields = {
    //         assigned_deployment_area_id: 0,
    //         assigned_deployment_area_category_id: 0,
    //         immediate_supervisor_id: "",
    //         alternate_supervisor_id: "",
    //     }
    //     localStorage.setItem("assigned_deployment_area", JSON.stringify(lsAssignedDeploymentAreaFields));
    // }, [selectedAssignedDeploymentAreaCategoryId])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const deployment_area = await getOfflineLibDeploymentArea(); //await getDeploymentAreaLibraryOptions();
                setDeploymentAreaOptions(deployment_area);

                const deployment_area_categories = await getOfflineLibDeploymentAreaCategories(); //await getDeploymentAreaLibraryOptions();
                setDeploymentAreaCategoriesOptions(deployment_area_categories);
                // alert(deployment_area_categories.length)

                const schoolList = await getOfflineLibSchools();  //await getCourseLibraryOptions();               
                console.log("School Array", schoolList);
                setSchoolOptions(schoolList);

                const type_of_work = await getOfflineLibTypeOfWork(); //await getTypeOfWorkLibraryOptions();
                setTypeOfWorkOptions(type_of_work);
                if (typeof window !== "undefined") {
                    const storedPrefferedDeployment = localStorage.getItem("preferred_deployment");
                    if (storedPrefferedDeployment) {
                        setPreferredDeployment(JSON.parse(storedPrefferedDeployment));
                    }
                }

                debugger;
                // create an admin localstorage that will be used for assessment and eligibility, assigned deployment area, 
                const lsAssignedDeploymentArea = localStorage.getItem("assigned_deployment_area");
                if (!lsAssignedDeploymentArea) {
                    const lsAssignedDeploymentAreaFields = {
                        assigned_deployment_area_id: 0,
                        assigned_deployment_area_category_id: 0,
                        immediate_supervisor_id: "",
                        alternate_supervisor_id: "",
                    }
                    localStorage.setItem("assigned_deployment_area", JSON.stringify(lsAssignedDeploymentAreaFields));
                }
                if (lsAssignedDeploymentArea) {
                    const parsedLsAssignedDeploymentArea = JSON.parse(lsAssignedDeploymentArea);
                    setSelectedAssignedDeploymentAreaId(parsedLsAssignedDeploymentArea.assigned_deployment_area_id);
                    setSelectedAssignedDeploymentAreaCategoryId(parsedLsAssignedDeploymentArea.assigned_deployment_area_category_id);
                    setSelectedImmediateSupervisorId(parsedLsAssignedDeploymentArea.immediate_supervisor_id);
                    setSelectedAlternateSupervisorId(parsedLsAssignedDeploymentArea.alternate_supervisor_id);
                    if (parsedLsAssignedDeploymentArea.assigned_deployment_area_category_id == 1) {
                        setIsSchoolAsDeploymentArea(false)
                    } else {
                        setIsSchoolAsDeploymentArea(true)
                    }
                }



                // debugger;
                try {


                    dexieDb.open();
                    dexieDb.transaction('rw', [dexieDb.users], async () => {
                        try {
                            const usersWithRole = await dexieDb.users
                                .where('role_id')
                                .equals('3d735b9c-f169-46e0-abd1-59f66db1943c')
                                .toArray();
                            setImmediateSupervisorOptions(usersWithRole.map(user => ({
                                id: user.id,
                                name: user.username,
                                label: user.username,
                            })));
                        } catch (error) {
                            console.error("Error retrieving data of users from IndexedDB", error);
                        }
                    });

                    dexieDb.transaction('rw', [dexieDb.users], async () => {
                        try {
                            const usersWithRole = await dexieDb.users
                                .where('role_id')
                                .equals('eed84e85-cd50-49eb-ab19-a9d9a2f3e374')
                                .toArray();
                            setAlternateSupervisorOptions(usersWithRole.map(user => ({
                                id: user.id,
                                name: user.username,
                                label: user.username,
                            })));
                        } catch (error) {
                            console.error("Error retrieving data of users from IndexedDB", error);
                        }
                    });
                } catch (error) {
                    console.error("Error retrieving data of users from IndexedDB", error);
                }


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // const handleDeploymentAreaChange = (id: number) => {
    //     console.log("Selected Deployment Area ID:", id);
    //     setSelectedDeploymentAreaId(id);
    //     updatingData("deployment_area_id", id);
    //     updateFormData({ deployment_area_id: id });
    // };
    const handleTypeOfWorkChange = (id: number) => {
        console.log("Selected Type of Work ID:", id);
        // updateCapturedData("cfw", "preffered_type_of_work_id", id, 4);
        setSelectedTypeOfWorkId(id);
        updatingData("preffered_type_of_work_id", id);
        updateFormData({ preffered_type_of_work_id: id });
    };



    const updateAssignedDeploymentArea = (deploymentAreaId: number) => {
        const lsAssignedDeploymentArea = localStorage.getItem("assigned_deployment_area");
        const parsedlsAssignedDeploymentArea = lsAssignedDeploymentArea
            ? JSON.parse(lsAssignedDeploymentArea)
            : { assigned_deployment_area_id: 0 };
        parsedlsAssignedDeploymentArea.assigned_deployment_area_id = deploymentAreaId;
        localStorage.setItem("assigned_deployment_area", JSON.stringify(parsedlsAssignedDeploymentArea));
        setSelectedAssignedDeploymentAreaId(deploymentAreaId);
        // if (deploymentAreaId == 1) {
        //     setIsSchoolAsDeploymentArea(false)
        // } else {
        //     setIsSchoolAsDeploymentArea(true)
        // }

    }
    const updateAssignedDeploymentAreaCategoryId = (deploymentAreaCategoryId: number) => {
        debugger;
        setSelectedDeploymentAreaId(0);
        console.log(selectedDeploymentAreaId)
        const storedData = localStorage.getItem("assigned_deployment_area");

        // Parse the existing data or create a default object
        const parsedData = storedData
            ? JSON.parse(storedData)
            : { assigned_deployment_area_category_id: 0 };

        // Update the value
        parsedData.assigned_deployment_area_category_id = deploymentAreaCategoryId;
        parsedData.assigned_deployment_area_id = 0;

        // Save back to localStorage
        localStorage.setItem("assigned_deployment_area", JSON.stringify(parsedData));

        // Update your React state (if needed)
        setSelectedAssignedDeploymentAreaCategoryId(deploymentAreaCategoryId);
        if (deploymentAreaCategoryId == 1) {
            setIsSchoolAsDeploymentArea(false)
        }
        else {
            setIsSchoolAsDeploymentArea(true)
        }
    };

    const updateImmediateSupervisor = (immediateSupervisorId: string) => {
        const lsAssignedDeploymentArea = localStorage.getItem("assigned_deployment_area");
        const parsedlsAssignedDeploymentArea = lsAssignedDeploymentArea
            ? JSON.parse(lsAssignedDeploymentArea)
            : { assigned_deployment_area_id: 0 };
        parsedlsAssignedDeploymentArea.immediate_supervisor_id = immediateSupervisorId;
        localStorage.setItem("assigned_deployment_area", JSON.stringify(parsedlsAssignedDeploymentArea));
        setSelectedImmediateSupervisorId(immediateSupervisorId);

    }
    const updateAlternateSupervisor = (alternateSupervisorId: string) => {
        const lsAssignedDeploymentArea = localStorage.getItem("assigned_deployment_area");
        const parsedlsAssignedDeploymentArea = lsAssignedDeploymentArea
            ? JSON.parse(lsAssignedDeploymentArea)
            : { assigned_deployment_area_id: 0 };
        parsedlsAssignedDeploymentArea.alternate_supervisor_id = alternateSupervisorId;
        localStorage.setItem("assigned_deployment_area", JSON.stringify(parsedlsAssignedDeploymentArea));
        setSelectedAlternateSupervisorId(alternateSupervisorId);
    }

    // readonly when admin viewing 
    useEffect(() => {
        if (userIdViewing) {
            const form = document.getElementById("preferred_deployment_info_form");
            if (form) {
                form.querySelectorAll("input, select, textarea, button, label").forEach((el) => {
                    el.setAttribute("disabled", "true");
                });
            }
        }
    }, [userIdViewing]);

    return (
        <div >
            <div className={`flex grid sm:col-span-3 sm:grid-cols-3 ${userIdViewing ? "" : "hidden"}`}>
                <div className="p-2 col-span-4">
                    <Label htmlFor="assigned_deployment_area_category_id" className="block text-sm font-medium mb-1">Deployment Area Category <span className='text-red-500'> *</span></Label>
                    {/* <p>selected area cat id: {selectedAssignedDeploymentAreaCategoryId}</p>
                    <p>selected area  id: {selectedAssignedDeploymentAreaId}</p> */}
                    <FormDropDown
                        id="assigned_deployment_area_category_id"
                        options={deploymentAreaCategoriesOptions}
                        selectedOption={selectedAssignedDeploymentAreaCategoryId ?? null}
                        onChange={(id) => updateAssignedDeploymentAreaCategoryId(id)}
                    // selectedOption={Number(capturedData.assigned_deployment_area_id) || 0}
                    // onChange={(value) => updateFormData({ assigned_deployment_area_id: value.target.value })}
                    />
                </div>
            </div>
            <div className={`flex grid sm:col-span-3 sm:grid-cols-3 ${userIdViewing ? "" : "hidden"}`}>
                <div className={`p-2 col-span-4 ${selectedAssignedDeploymentAreaCategoryId == 0 || selectedAssignedDeploymentAreaCategoryId === 3 ? "hidden" : ""}`}>
                    {/* <p>Is School Selected?: {isSchoolAsDeploymentArea} Why</p> */}
                    {/* <p>{selectedAssignedDeploymentAreaCategoryId}</p> */}
                    <Label htmlFor="assigned_deployment_area_id" className="block text-sm font-medium mb-1">Assigned Deployment Area <span className='text-red-500'> *</span></Label>
                    {!isSchoolAsDeploymentArea ? (
                        <FormDropDown
                            // id="assigned_deployment_area_id_company"
                            options={deploymentAreaOptions}
                            selectedOption={selectedAssignedDeploymentAreaId}
                            onChange={(e) => updateAssignedDeploymentArea(e)}
                        // disabled={true}
                        // disabled={selectedAssignedDeploymentAreaCategoryId == 0}
                        />
                    ) : (
                        <FormDropDown
                            // id="assigned_deployment_area_id"
                            options={schoolOptions}
                            selectedOption={selectedAssignedDeploymentAreaId}
                            onChange={(e) => updateAssignedDeploymentArea(e)}
                        // disabled={true}
                        // disabled={selectedAssignedDeploymentAreaCategoryId == 0}
                        />
                    )}


                </div>
            </div>
            <div className={`flex grid sm:col-span-3 sm:grid-cols-3 hidden`}>
                {/* <div className={`flex grid sm:col-span-3 sm:grid-cols-3 ${userIdViewing ? "" : "hidden"}`}> */}
                <div className="p-2 col-span-4">
                    <Label htmlFor="immediate_supervisor" className="block text-sm font-medium mb-1">Immediate Supervisor <span className='text-red-500'> *</span></Label>
                    <FormDropDown
                        id="immediate_supervisor"
                        options={immediateSupervisorOptions}
                        selectedOption={setSelectedImmediateSupervisorId}
                        onChange={(e) => updateImmediateSupervisor(e)}
                    // selectedOption={Number(capturedData.assigned_deployment_area_id) || 0}
                    // onChange={(value) => updateFormData({ assigned_deployment_area_id: value.target.value })}
                    />
                </div>
            </div>
            <div className={`flex grid sm:col-span-3 sm:grid-cols-3 hidden`}>
                {/* <div className={`flex grid sm:col-span-3 sm:grid-cols-3 ${userIdViewing ? "" : "hidden"}`}> */}
                <div className="p-2 col-span-4">
                    <Label htmlFor="alternate_supervisor" className="block text-sm font-medium mb-1">Alternate Supervisor <span className='text-red-500'> *</span></Label>
                    <FormDropDown
                        id="alternate_supervisor"
                        options={alternateSupervisorOptions}
                        selectedOption={selectedAlternateSupervisorId}
                        onChange={(e) => updateAlternateSupervisor(e)}
                    // selectedOption={Number(capturedData.assigned_deployment_area_id) || 0}
                    // onChange={(value) => updateFormData({ assigned_deployment_area_id: value.target.value })}
                    />
                </div>
            </div>
            <div id="preferred_deployment_info_form">
                <div className="flex grid sm:col-span-3 sm:grid-cols-3">

                    <div className="p-2 col-span-4">
                        <Label htmlFor="deployment_area_id" className="block text-sm font-medium mb-1">Preferred Office <span className='text-red-500'> *</span></Label>
                        <Input
                            value={capturedData.deployment_area_name || ""}
                            onChange={(e) => updateFormData({ deployment_area_name: e.target.value })}
                            id="deployment_area_id"
                            name="deployment_area_id"
                            placeholder="Enter Name of Office"

                        />
                        {/* <FormDropDown

                            id="deployment_area_id"
                            options={deploymentAreaOptions}
                            // selectedOption={preferredDeployment.deployment_area_id}
                            // onChange={handleDeploymentAreaChange}
                            selectedOption={capturedData.deployment_area_id}
                            onChange={handleDeploymentAreaChange}
                        /> */}
                        {errors?.deployment_area_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.deployment_area_id[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-4">
                        <Label htmlFor="deployment_area_address" className="block text-sm font-medium">Office Address</Label>
                        <Textarea
                            value={capturedData.deployment_area_address}
                            id="deployment_area_address"
                            name="deployment_area_address"
                            placeholder="Enter Office Address"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows={4}
                            onChange={(e) => updateFormData({ deployment_area_address: e.target.value })}
                        />
                        {errors?.deployment_area_address && (
                            <p className="mt-2 text-sm text-red-500">{errors.deployment_area_address[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-4">
                        <Label htmlFor="preffered_type_of_work_id" className="block text-sm font-medium">Preferred Type of Work<span className='text-red-500'> *</span></Label>
                        <FormDropDown
                            id="preffered_type_of_work_id"
                            options={typeOfWorkOptions}
                            selectedOption={capturedData.preffered_type_of_work_id}
                            onChange={handleTypeOfWorkChange}
                        />
                        {errors?.preffered_type_of_work_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.preffered_type_of_work_id[0]}</p>
                        )}
                    </div>
                </div>
            </div >


        </div>
    )
}