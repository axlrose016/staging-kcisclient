import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getCycleLibraryOptions, getFundSourceLibraryOptions, getModeLibraryOptions, getVolunteerCommitteLibraryOptions, getVolunteerCommittePositionLibraryOptions } from "@/components/_dal/options";
export default function VolunteerDetails({ errors }: ErrorProps) {
    const [relationOptions, setRelationOptions] = useState<LibraryOption[]>([]);
    const [selectedRelation, setSelectedRelation] = useState("");

    const [fundSourceOptions, setFundSourceOptions] = useState<LibraryOption[]>([]);
    const [selectedFundSource, setSelectedFundSource] = useState("");
    const [selectedFundSourceId, setSelectedFundSourceId] = useState<number | null>(null);

    const [cycleOptions, setCycleOptions] = useState<LibraryOption[]>([]);
    const [selectedCycle, setSelectedCycle] = useState("");
    const [selectedCycleId, setSelectedCycleId] = useState<number | null>(null);

    const [modeOptions, setModeOptions] = useState<LibraryOption[]>([]);
    const [selectedMode, setSelectedMode] = useState("");
    const [selectedModeId, setSelectedModeId] = useState<number | null>(null);

    const [volunteerCommitteeOptions, setVolunteerCommitteeOptions] = useState<LibraryOption[]>([]);
    const [selectedVolunteerCommittee, setSelectedVolunteerCommittee] = useState("");
    const [selectedVolunteerCommitteeId, setSelectedVolunteerCommitteeId] = useState<number | null>(null);

    const [volunteerCommitteePositionOptions, setVolunteerCommitteePositionOptions] = useState<LibraryOption[]>([]);
    const [selectedVolunteerCommitteePosition, setSelectedVolunteerCommitteePosition] = useState("");
    const [selectedVolunteerCommitteePositionId, setSelectedVolunteerCommitteePositionId] = useState<number | null>(null);

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fund_source = await getFundSourceLibraryOptions();
                setFundSourceOptions(fund_source);

                const cycle = await getCycleLibraryOptions();
                setCycleOptions(cycle);

                const mode = await getModeLibraryOptions();
                setModeOptions(mode);
                const volunteer_committee = await getVolunteerCommitteLibraryOptions();
                setVolunteerCommitteeOptions(volunteer_committee);
                const volunteer_committee_position = await getVolunteerCommittePositionLibraryOptions();
                setVolunteerCommitteePositionOptions(volunteer_committee_position);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleFundSourceChange = (id: number) => {
        console.log("Selected Fund Source ID:", id);
        setSelectedFundSourceId(id);
    };
    const handleCycleChange = (id: number) => {
        console.log("Selected Cycle ID:", id);
        setSelectedCycleId(id);
    };
    const handleModeChange = (id: number) => {
        console.log("Selected KC Mode ID:", id);
        setSelectedModeId(id);
    };
    const handleVolunteerCommitteeChange = (id: number) => {
        console.log("Selected Volunteer Committee ID:", id);
        setSelectedVolunteerCommitteeId(id);
    };
    const handleVolunteerCommitteePositionChange = (id: number) => {
        console.log("Selected Volunteer Committee Position ID:", id);
        setSelectedVolunteerCommitteePositionId(id);
    };
    return (
        <>
            <div  >
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 ">
                    <div className="p-2 sm:col-span-1">
                        <Label htmlFor="date_first_appointment" className="block text-sm font-medium">Date of First Appointment</Label>
                        <Input
                            id="date_first_appointment"
                            name="date_first_appointment"
                            type="date"
                            placeholder="Enter Date of First Appointment"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.date_first_appointment && (
                            <p className="mt-2 text-sm text-red-500">{errors.date_first_appointment[0]}</p>
                        )}
                    </div>
                    <div className="p-2 Col-span-1">
                        <Label htmlFor="fund_source_id" className="block text-sm font-medium">Fund Source</Label>
                        <FormDropDown
                            id="fund_source_id"
                            options={fundSourceOptions}
                            selectedOption={selectedFundSourceId}
                            onChange={handleFundSourceChange}
                        />
                        {errors?.fund_source_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.fund_source_id[0]}</p>
                        )}
                    </div>
                    <div className="p-2 Col-span-1">
                        <Label htmlFor="cycle_id" className="block text-sm font-medium">Cycle</Label>
                        <FormDropDown
                            id="cycle_id"
                            options={cycleOptions}
                            selectedOption={selectedCycleId}
                            onChange={handleCycleChange}
                        />
                        {errors?.cycle_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.cycle_id[0]}</p>
                        )}
                    </div>
                    <div className="p-2 Col-span-1">
                        <Label htmlFor="kc_mode_id" className="block text-sm font-medium">KC Mode</Label>
                        <FormDropDown
                            id="kc_mode_id"
                            options={modeOptions}
                            selectedOption={selectedModeId}
                            onChange={handleModeChange}
                        />
                        {errors?.kc_mode_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.kc_mode_id[0]}</p>
                        )}
                    </div>
                    <div className="p-2 Col-span-1">
                        <Label htmlFor="committee_id" className="block text-sm font-medium">Committee</Label>
                        <FormDropDown
                            id="committee_id"
                            options={volunteerCommitteeOptions}
                            selectedOption={selectedVolunteerCommitteeId}
                            onChange={handleVolunteerCommitteeChange}
                        />
                        {errors?.committee_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.committee_id[0]}</p>
                        )}
                    </div>
                    <div className="p-2 Col-span-1">
                        <Label htmlFor="position_id" className="block text-sm font-medium">Position</Label>
                        <FormDropDown
                            id="position_id"
                            options={volunteerCommitteePositionOptions}
                            selectedOption={selectedVolunteerCommitteePositionId}
                            onChange={handleVolunteerCommitteePositionChange}
                        />
                        {errors?.position_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.position_id[0]}</p>
                        )}
                    </div>
                    <div className="p-2 sm:col-span-1">
                        <Label htmlFor="volunteer_date_start" className="block text-sm font-medium">Date Start</Label>
                        <Input
                            id="volunteer_date_start"
                            name="volunteer_date_start"
                            type="date"
                            placeholder="Enter Date Start"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.volunteer_date_start && (
                            <p className="mt-2 text-sm text-red-500">{errors.volunteer_date_start[0]}</p>
                        )}
                    </div>
                    <div className="p-2 sm:col-span-1">
                        <Label htmlFor="volunteer_date_end" className="block text-sm font-medium">Date End</Label>
                        <Input
                            id="volunteer_date_end"
                            name="volunteer_date_end"
                            type="date"
                            placeholder="Enter Date End"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.volunteer_date_end && (
                            <p className="mt-2 text-sm text-red-500">{errors.volunteer_date_end[0]}</p>
                        )}
                    </div>
                </div>
            </div >


        </>
    )
}

