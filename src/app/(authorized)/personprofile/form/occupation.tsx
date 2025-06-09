import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getIDCardLibraryOptions } from "@/components/_dal/options";
import { getOfflineLibIdCard } from "@/components/_dal/offline-options";
import { IPersonProfile } from "@/components/interfaces/personprofile";

export default function Occupation({ errors, capturedData, updateCapturedData, selectedModalityId, updateFormData, user_id_viewing }: { errors: any; capturedData: Partial<IPersonProfile>; updateCapturedData: any, selectedModalityId: any, updateFormData: (newData: Partial<IPersonProfile>) => void, user_id_viewing: any }) {

    const [hasOccupation, sethasOccupation] = useState(false);
    const [hasIDNumber, sethasIDNumber] = useState(false);
    const [userIdViewing, setUserIdViewing] = useState(user_id_viewing);


    const chkHasOccupation = () => {
        sethasOccupation(!hasOccupation); // Toggle `hasOccupation` state
        updateFormData({ hasoccupation: !hasOccupation });
    }

    const [commonData, setCommonData] = useState(() => {
        if (typeof window !== "undefined") {
            const storedCommonData = localStorage.getItem("common_data");
            return storedCommonData ? JSON.parse(storedCommonData) : {};
        }
        return {};
    });



    const [employment, setEmployment] = useState(() => {

        if (typeof window !== "undefined") {
            const storedEmployment = localStorage.getItem("employment");
            return storedEmployment ? JSON.parse(storedEmployment) : {}
        }
        return {};
    });

    useEffect(() => {
        localStorage.setItem("employment", JSON.stringify(employment));
    }, [employment]);

    const updatingEmployment = (field: any, value: any) => {
        setEmployment((prev: any) => ({
            ...prev, [field]: value

        }));
        updateFormData({ current_occupation: value });
    }


    const [cfwOptions, setCfwOptions] = useState<LibraryOption[]>([]);
    const [selectedCfwCategory, setSelectedCfwCategory] = useState("");

    const [iDCardOptions, setIDCardOptions] = useState<LibraryOption[]>([]);
    const [selectedIDCard, setSelectedIDCard] = useState("");
    const [selectedIDCardId, setSelectedIDCardId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const id_card = await getOfflineLibIdCard();//await getIDCardLibraryOptions();
                setIDCardOptions(id_card);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const employment = localStorage.getItem("employment");
        if (employment) {
            const parsedEmployment = JSON.parse(employment);
            sethasOccupation(parsedEmployment.has_occupation);
            // alert(hasOccupation)
        }


        fetchData();
    }, []);

    const occupationRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (hasOccupation && occupationRef.current) {
            occupationRef.current.focus(); // Auto-focus when enabled
        }
    }, [hasOccupation]);

    const handleIDCardChange = (id: number) => {
        console.log("Selected ID Card ID:", id);
        setSelectedIDCardId(id);
        //updatingEmployment("id_card", id);
        // if (!hasOccupation) {

        //     updatingEmployment("id_card", 11); // meaning n/a
        // } else {
        //     updatingEmployment("id_card", id); // meaning n/a
        // }

        if (id === 11) {
            sethasIDNumber(false);
        } else {
            sethasIDNumber(true);
        }

        updateFormData({ id_card: id });

    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { id, value } = e.target;  // Destructure name and value from e.target
        updateFormData({ [id]: value });
    };
    const updatingSkills = (value: any) => {
        updateFormData({ skills: value })
    }

    // readonly when admin viewing 
    useEffect(() => {
        if (userIdViewing) {
            const form = document.getElementById("employment_form");
            if (form) {
                form.querySelectorAll("input, select, textarea, button, label").forEach((el) => {
                    el.setAttribute("disabled", "true");
                });
            }
        }
    }, [userIdViewing]);
    return (
        <>
            <div id="employment_form">
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 mb-2">

                    <div className="flex items-center space-x-1 p-2">
                        <Input
                            type='checkbox'
                            className="w-4 h-4 cursor-pointer"
                            checked={capturedData.hasoccupation ?? false}
                            id='has_occupation_toggle'
                            onChange={(e) => updateFormData({ hasoccupation: e.target.checked })}
                        />
                        <Label htmlFor="has_occupation" className="block text-md  font-medium">
                            {/* Do you have a current occupation? */}
                            With Current Occupation
                        </Label>
                    </div>

                    <div className="p-2 col-span-4">
                        <Label htmlFor="current_occupation" className="block text-sm font-medium">Occupation</Label>
                        <Input
                            value={capturedData.hasoccupation ? capturedData.current_occupation?.toUpperCase() : capturedData.current_occupation = ""}
                            onChange={handleChange}
                            ref={occupationRef}
                            // value={capturedData.cfw[4].current_occupation}
                            id="current_occupation"
                            name="current_occupation"
                            type="text"
                            disabled={!capturedData.hasoccupation}
                            placeholder={capturedData.hasoccupation ? "Enter your Occupation" : "No Occupation"}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                                ${!capturedData.hasoccupation ? "bg-gray-200 cursor-not-allowed" : ""}`}
                        />

                    </div>
                    <div className="p-2 col-span-4 sm:col-span-4">

                        <Label htmlFor="occupation_id_card" className="block text-sm font-medium mb-[5px]">Valid ID</Label>
                        <FormDropDown
                            disabled={!capturedData.hasoccupation}
                            selectedOption={capturedData.hasoccupation ? capturedData.id_card : capturedData.id_card = 0}
                            // selectedOption={capturedData.cfw[4].id_card}
                            onChange={(value) => {
                                if (!capturedData.hasoccupation) {
                                    handleIDCardChange(11); // Set default value if no occupation
                                } else {
                                    handleIDCardChange(value); // Handle normally if occupation exists
                                }
                            }}
                            id="occupation_id_card"
                            options={iDCardOptions.filter(i => (capturedData?.age || 0) < 60 && i.id !== 9)}
                            // readOnly={employment.id_card === 11 ? true : false} // Disable if hasOccupation is false
                            readOnly={!capturedData.hasoccupation
                            }
                        />
                        {errors?.occupation_id_card && (
                            <p className="mt-2 text-sm text-red-500">{errors.occupation_id_card[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-4 sm:col-span-4">

                        <Label htmlFor="occupation_id_card_number" className="block text-sm font-medium mb-[5px]">ID Number</Label>
                        <Input
                            value={capturedData.hasoccupation ? capturedData.occupation_id_card_number : capturedData.occupation_id_card_number = ""}
                            id="occupation_id_card_number"
                            name="occupation_id_card_number"
                            type="text"
                            disabled={!capturedData.hasoccupation}
                            onChange={handleChange}
                            placeholder={!capturedData.hasoccupation && !capturedData.occupation_id_card_number === true ? "Enter your ID Number" : "ID Number not applicable"}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                                ${!capturedData.hasoccupation || capturedData.occupation_id_card_number ? "bg-gray-200 cursor-not-allowed" : ""}`}
                        />
                        {errors?.occupation_id_card_number && (
                            <p className="mt-2 text-sm text-red-500">{errors.occupation_id_card_number[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-4 sm:col-span-4">
                        <Label htmlFor="skills" className="block text-sm font-medium">Skills<span className='text-red-500'> *</span></Label>
                        <Textarea
                            value={capturedData.skills}
                            // value={capturedData.cfw[4].skills}
                            onChange={(e) => updateFormData({ skills: e.target.value })}
                            // onChange={(e) => updateCapturedData("cfw", 'skills', e.target.value, 4)}
                            id="skills"
                            name="skills"
                            placeholder="Enter your skills"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.no_of_children && (
                            <p className="mt-2 text-sm text-red-500">{errors.no_of_children}</p>
                        )}
                    </div>


                    <div className={`grid sm:grid-cols-1 sm:grid-rows-1 mb-2  ${capturedData.modality_id === 25 ? "hidden" : ""}  `}>
                        {/* <div className={`grid sm:grid-cols-1 sm:grid-rows-1 mb-2  ${selectedModalityId === 25 ? "hidden" : ""}  `}> */}
                        <div className="p-2">
                            <Label htmlFor="is_lgu_official" className="block text-sm font-medium">Is LGU Official</Label>
                            <div className="mt-1">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="is_lgu_official" value="yes" className="form-radio" />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input type="radio" name="is_lgu_official" value="no" className="form-radio" />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {errors?.is_lgu_official && (
                                <p className="mt-2 text-sm text-red-500">{errors.is_lgu_official[0]}</p>
                            )}
                        </div>
                        <div className="p-2">
                            <Label htmlFor="is_mdc" className="block text-sm font-medium">Is MDC</Label>
                            <div className="mt-1">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="is_mdc" value="yes" className="form-radio" />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input type="radio" name="is_mdc" value="no" className="form-radio" />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {errors?.is_mdc && (
                                <p className="mt-2 text-sm text-red-500">{errors.is_mdc[0]}</p>
                            )}
                        </div>
                        <div className="p-2">
                            <Label htmlFor="is_bdc" className="block text-sm font-medium">Is BDC</Label>
                            <div className="mt-1">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="is_bdc" value="yes" className="form-radio" />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input type="radio" name="is_bdc" value="no" className="form-radio" />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {errors?.is_bdc && (
                                <p className="mt-2 text-sm text-red-500">{errors.is_bdc[0]}</p>
                            )}
                        </div>
                        <div className="p-2">
                            <Label htmlFor="is_bspmc" className="block text-sm font-medium">Is BSPMC</Label>
                            <div className="mt-1">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="is_bspmc" value="yes" className="form-radio" />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input type="radio" name="is_bspmc" value="no" className="form-radio" />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {errors?.is_bspmc && (
                                <p className="mt-2 text-sm text-red-500">{errors.is_bspmc[0]}</p>
                            )}
                        </div>
                        <div className="p-2">
                            <Label htmlFor="is_bdrrmc_bdc_twg" className="block text-sm font-medium">Is BDRRMC/BDC-TWG</Label>
                            <div className="mt-1">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="is_bdrrmc_bdc_twg" value="yes" className="form-radio" />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input type="radio" name="is_bdrrmc_bdc_twg" value="no" className="form-radio" />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {errors?.is_bdrrmc_bdc_twg && (
                                <p className="mt-2 text-sm text-red-500">{errors.is_bdrrmc_bdc_twg[0]}</p>
                            )}
                        </div>
                        <div className="p-2">
                            <Label htmlFor="is_bdrrmc_expanded_bdrrmc" className="block text-sm font-medium">Is BDRRMC/EXPANDED BDRRMC?</Label>
                            <div className="mt-1">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="is_bdrrmc_expanded_bdrrmc" value="yes" className="form-radio" />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input type="radio" name="is_bdrrmc_expanded_bdrrmc" value="no" className="form-radio" />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {errors?.is_bdrrmc_expanded_bdrrmc && (
                                <p className="mt-2 text-sm text-red-500">{errors.is_bdrrmc_expanded_bdrrmc[0]}</p>
                            )}
                        </div>
                        <div className="p-2">
                            <Label htmlFor="is_mdrrmc" className="block text-sm font-medium">Is MDRRMC?</Label>
                            <div className="mt-1">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="is_mdrrmc" value="yes" className="form-radio" />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input type="radio" name="is_mdrrmc" value="no" className="form-radio" />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {errors?.is_mdrrmc && (
                                <p className="mt-2 text-sm text-red-500">{errors.is_mdrrmc[0]}</p>
                            )}
                        </div>
                        <div className="p-2">
                            <Label htmlFor="is_hh_head" className="block text-sm font-medium">Is HH Head?</Label>
                            <div className="mt-1">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="is_hh_head" value="yes" className="form-radio" />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input type="radio" name="is_hh_head" value="no" className="form-radio" />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {errors?.is_hh_head && (
                                <p className="mt-2 text-sm text-red-500">{errors.is_hh_head[0]}</p>
                            )}
                        </div>
                    </div>


                </div>

            </div >


        </>
    )
}