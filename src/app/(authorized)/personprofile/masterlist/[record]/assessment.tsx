import { getOfflineLibStatuses } from "@/components/_dal/offline-options";
import { FormDropDown } from "@/components/forms/form-dropdown";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react"
import { json } from "stream/consumers";

export default function Assessment() {
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [statusesOptions, setStatusesOptions] = useState<LibraryOption[]>([]);
    const [assessment, setAssessment] = useState("");
    const [noOfDaysEngagement, setNoOfDaysEngagement] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const statuses = await getOfflineLibStatuses();
                const filteredStatuses = statuses.filter(status => [1, 10, 20].includes(status.id));
                setStatusesOptions(filteredStatuses);

                const lsAssessment = localStorage.getItem("assessment");
                if (!lsAssessment) {
                    const lsAssessmentFields = {
                        status_id: 0,
                        assessment: "",
                        number_of_days_program_engagement: 0
                    }
                    localStorage.setItem("assessment", JSON.stringify(lsAssessmentFields));
                }
                if (lsAssessment) {
                    const parsedlsAssessment = JSON.parse(lsAssessment);
                    setSelectedStatus(parsedlsAssessment.status_id);
                    setAssessment(parsedlsAssessment.assessment);
                    setNoOfDaysEngagement(parsedlsAssessment.number_of_days_program_engagement);
                }
            } catch (error) {

            }

        };
        fetchData();

    }, []);

    const updateAssessment = (field: string, value: string) => {
        debugger;
        // setAssessment(e);

        const lsAssessment = localStorage.getItem("assessment");
        if (lsAssessment) {
            const parsedlsAssessment = JSON.parse(lsAssessment);
            const updatedAssessment = { ...parsedlsAssessment, [field]: value };
            setAssessment(updatedAssessment.assessment);
           
            if (updatedAssessment.status_id !== 1) {
                updatedAssessment.number_of_days_program_engagement = 0;
                setNoOfDaysEngagement(0);
            } else {
                setNoOfDaysEngagement(updatedAssessment.number_of_days_program_engagement);
            }
            setSelectedStatus(updatedAssessment.status_id);
            localStorage.setItem("assessment", JSON.stringify(updatedAssessment));
        }
        // alert(selectedStatus)
    }
    // Removed redundant useEffect block as updateAssessment already handles localStorage updates.
    // const updateEligibleStatus = (e: number) => {
    //     setSelectedStatus(e);
    //     const lsAssessment = localStorage.getItem("assessment");
    //     if (lsAssessment) {
    //         const assessmentdata = {
    //             status_id: e,
    //             assessment: assessment,
    //             number_of_days_program_engagement: noOfDaysEngagement
    //         }
    //         localStorage.setItem("assessment", JSON.stringify(assessmentdata));
    //     }
    // }
    return (
        <div className="w-full">

            <div id="assessment_parent">
                <div className="flex grid sm:col-span-3 sm:grid-cols-2 ">


                    <div className="p-2 col-span-4">
                        <Label htmlFor="assessment" className="block text-sm font-medium">Assessment</Label>
                        <Textarea
                            value={assessment}
                            id="assessment"
                            name="assessment"
                            placeholder="Enter Assessment"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows={4}
                            onChange={(e) => updateAssessment("assessment", e.target.value)}
                        />

                    </div>
                    <div className="p-2 sm:col-span-1 md:grid-col-span-2">
                        <Label htmlFor="number_of_days_program_engagement" className="block text-sm font-medium">Number of Days Program Engagement<span className='text-red-500'> *</span></Label>
                        <Input
                            type="number"
                            id="number_of_days_program_engagement"
                            name="number_of_days_program_engagement"
                            min={0}
                            value={noOfDaysEngagement}
                            onChange={(e) => updateAssessment("number_of_days_program_engagement", e.target.value)}
                            className="mt-2"
                            disabled={selectedStatus !== 1} // Disable if status is not 1
                        />

                    </div>
                    <div className="p-2  sm:col-span-1 md:grid-col-span-2">
                        <Label htmlFor="status_id" className="block text-sm font-medium mb-2">Eligibility Status<span className='text-red-500'> *</span></Label>
                        <FormDropDown
                            id="status_id"
                            name="status_id"
                            options={statusesOptions}
                            selectedOption={selectedStatus ?? null}
                            onChange={(id) => updateAssessment("status_id", id)}
                        // onChange={(e) => {updateAssessment("status_id", e.target.value); alert(e.target.value + typeof e.target.value)}}

                        />

                    </div>


                </div>
            </div >

        </div>
    )
}