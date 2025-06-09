import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { PhilSysInput } from "@/components/ui/philsys_mask";
import { getCFWCatLibraryOptions } from "@/components/_dal/options";
import { getOfflineLibCFWType } from "@/components/_dal/offline-options";
import { IPersonProfile } from "@/components/interfaces/personprofile";
// import CFW_Booklet from "@/components/pdf/cfw_booklet";
export default function Details({ errors, capturedData, updateCapturedData, selectedModalityId, updateFormData, user_id_viewing }: { errors: any; capturedData: any; updateCapturedData: any, selectedModalityId: any, updateFormData: (newData: Partial<IPersonProfile>) => void, user_id_viewing: string }) {

    const [healthConcerns, setHealthConcerns] = useState(() => {
        const storedHealthConcerns = localStorage.getItem("healthConcerns");
        return storedHealthConcerns ? JSON.parse(storedHealthConcerns) : {}
    });

    useEffect(() => {
        localStorage.setItem("healthConcerns", JSON.stringify(healthConcerns));
    }, [healthConcerns]);

    const updatingHealthConcerns = (field: any, value: any) => {
        console.log("TEST ", value);
        updateFormData({ immediate_health_concern: value })
    }

    const [selectedHealthConcern, setSelectedHealthConcern] = useState("");
    const [healthConcern, setHealthConcern] = useState("");


    const [cfwCatOptions, setCfwCatOptions] = useState<LibraryOption[]>([]);
    const [selectedCFWCat, setSelectedCFWCat] = useState("");
    const [selectedCFWCatId, setSelectedCFWCatId] = useState<number | null>(null);
    const [userIdViewing, setUserIdViewing] = useState(user_id_viewing);

    const [form_Data, setForm_Data] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const CFWCat = await getOfflineLibCFWType(); //await getCFWCatLibraryOptions();
                setCfwCatOptions(CFWCat);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleCFWCatChange = (id: number) => {
        console.log("Selected Province ID:", id);
        setSelectedCFWCatId(id);
    };
    const handleHealthConcernChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        // console.log('handleHealthConcernChange > value',value)
        setSelectedHealthConcern(value);
        if (value === "no") {
            // updateCapturedData("cfw", "has_immediate_health_concern", 0);
            // updateCapturedData("cfw", "has_immediate_health_concern", 0, 4);
            // updateCapturedData("cfw", "immediate_health_concern", "", 4);
            // setHealthConcern("");
            // updatingHealthConcerns("immediate_health_concern", "");
            updateFormData({ has_immediate_health_concern: false, immediate_health_concern: "no" })

        } else {
            // updateCapturedData("cfw", "has_immediate_health_concern", 1, 4);
            // updatingHealthConcerns("immediate_health_concern", value);
            // updatingHealthConcerns("has_immediate_health_concern", 1);
            updateFormData({ has_immediate_health_concern: true, immediate_health_concern: "" })

        }

        if (event.target.value === "no") {
            (document.getElementById("immediate_health_concern") as HTMLTextAreaElement).value = "";
        }
        const val = value === "no" ? false : true;
        updateFormData({ has_immediate_health_concern: val });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm_Data((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            localStorage.setItem('formData', JSON.stringify(updatedData)); // Save to localStorage
            return updatedData;
        });
    };

    // readonly when admin viewing 
    useEffect(() => {
        if (userIdViewing) {
            const form = document.getElementById("health_concern_info_form");
            if (form) {
                form.querySelectorAll("input, select, textarea, button, label").forEach((el) => {
                    el.setAttribute("disabled", "true");
                });
            }
        }
    }, [userIdViewing]);

    return (
        <div id="health_concern_info_form">
            <div className="">

                <div className="p-2 col-span-1">
                    <Label htmlFor="has_immediate_health_concern" className="block text-sm font-medium">Do you have any immediate health concerns that you think may affect your work?</Label>
                    <div className="mt-2">
                        <div className="flex items-center">
                            <input
                                checked={capturedData.has_immediate_health_concern === true}
                                // checked={capturedData.cfw[4].has_immediate_health_concern === 1}
                                onChange={handleHealthConcernChange}
                                id="has_immediate_health_concern_yes"
                                name="has_immediate_health_concern"
                                type="radio"
                                value="yes"
                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"

                            />
                            <Label htmlFor="health_concerns_yes" className="ml-3 block text-sm font-medium text-gray-700">
                                Yes
                            </Label>
                        </div>
                        <div className="flex items-center mt-2">
                            <input
                                checked={capturedData.has_immediate_health_concern === false}
                                // checked={capturedData.cfw[4].has_immediate_health_concern === 0}
                                onChange={handleHealthConcernChange}
                                id="has_immediate_health_concern_no"
                                name="has_immediate_health_concern"
                                type="radio"
                                value="no"
                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                            // onChange={(e) => updateCapturedData("common_data", "has_immediate_health_concern", e.target.value)}
                            />
                            <Label htmlFor="health_concerns_no" className="ml-3 block text-sm font-medium text-gray-700">
                                No
                            </Label>
                        </div>
                    </div>
                    {errors?.has_immediate_health_concern && (
                        <p className="mt-2 text-sm text-red-500">{errors.has_immediate_health_concern}</p>
                    )}
                </div>
                <div className={`grid sm:grid-cols-1 sm:grid-rows-1 mb-2  ${capturedData.has_immediate_health_concern === true ? "" : "hidden"}`}>
                    {/* <div className="grid sm:grid-cols-1 sm:grid-rows-1 mb-2"> */}
                    <div className="p-2">
                        <Label htmlFor="immediate_health_concern" className="block text-sm font-medium mb-[5px]">Health Condition</Label>
                        <Textarea
                            value={capturedData.immediate_health_concern ?? ""}
                            // value={capturedData.cfw[4].immediate_health_concern}
                            onChange={(e) => updatingHealthConcerns('immediate_health_concern', e.target.value.toUpperCase())}
                            // onChange={(e) => updateCapturedData("cfw", 'immediate_health_concern', e.target.value, 4)}
                            id="immediate_health_concern"
                            name="immediate_health_concern"
                            placeholder="Enter your Health Condition"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        // value={selectedHealthConcern !== "yes" ? "" : healthConcern}
                        // disabled={healthConcerns && healthConcerns.has_immediate_health_concern === 0}
                        // disabled={selectedHealthConcern !== "yes"}
                        />

                        {errors?.immediate_health_concern && (
                            <p className="mt-2 text-sm text-red-500">{errors.immediate_health_concern}</p>
                        )}
                    </div>
                </div>
 
            </div >


        </div>
    )
}

