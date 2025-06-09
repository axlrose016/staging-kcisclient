import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getCourseLibraryOptions, getYearLevelLibraryOptions } from "@/components/_dal/options";
export default function HighestEducationalAttainment({ errors, capturedData, updateCapturedData, selectedModalityId }: { errors: any; capturedData: any; updateCapturedData: any, selectedModalityId: any }) {
    const [relationOptions, setRelationOptions] = useState<LibraryOption[]>([]);
    const [selectedRelation, setSelectedRelation] = useState("");

    const [courseOptions, setCourseOptions] = useState<LibraryOption[]>([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

    const [YearLevelOptions, setYearLevelOptions] = useState<LibraryOption[]>([]);
    const [selectedYearLevel, setSelectedYearLevel] = useState("");
    const [selectedYearLevelId, setSelectedYearLevelId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const course = await getCourseLibraryOptions();
                setCourseOptions(course);

                const year_level = await getYearLevelLibraryOptions();
                setYearLevelOptions(year_level);


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleCourseChange = (id: number) => {
        console.log("Selected Course ID:", id);
        updateCapturedData("cfw", "course_id", id, 4);
        setSelectedCourseId(id);
    };
    const handleYearLevelChange = (id: number) => {
        console.log("Selected Year Level ID:", id);
        updateCapturedData("cfw", "year_level_id", id, 4);
        setSelectedYearLevelId(id);
    };
    return (
        <>
            <div>
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 mb-2">
                    <div className="p-2 col-span-1">
                        <Label htmlFor="school_name" className="block text-sm font-medium">Name of School</Label>
                        <Input
                            value={capturedData.cfw[4].school_name}
                            onChange={(e) => updateCapturedData("cfw", "school_name", e.target.value, 4)}
                            id="school_name"
                            name="school_name"
                            type="text"
                            placeholder="Enter Name of School"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.school_name && (
                            <p className="mt-2 text-sm text-red-500">{errors.school_name}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="campus" className="block text-sm font-medium">Campus</Label>
                        <Input
                            value={capturedData.cfw[4].campus}
                            id="campus"
                            name="campus"
                            type="text"
                            placeholder="Enter Campus"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(e) => updateCapturedData("cfw", "campus", e.target.value, 4)}
                        />
                        {errors?.campus && (
                            <p className="mt-2 text-sm text-red-500">{errors.campus}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="school_address" className="block text-sm font-medium">School Address</Label>
                        <Textarea
                            value={capturedData.cfw[4].school_address}
                            id="school_address"
                            name="school_address"
                            placeholder="Enter School Address"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows={4}
                            onChange={(e) => updateCapturedData("cfw", "school_address", e.target.value, 4)}
                        />
                        {errors?.school_address && (
                            <p className="mt-2 text-sm text-red-500">{errors.school_address}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1 overflow-hidden">
                        <Label htmlFor="course_id" className="block text-sm font-medium">Course</Label>
                        <FormDropDown
                            id="course_id"
                            options={courseOptions}
                            selectedOption={capturedData.cfw[4].course_id}
                            onChange={handleCourseChange}
                            
                        />
                        {errors?.course_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.course_id}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="year_graduated" className="block text-sm font-medium">Year Graduated</Label>
                        <Input
                            value={capturedData.cfw[4].year_graduated}
                            id="year_graduated"
                            name="year_graduated"
                            type="number"
                            placeholder="Enter Year Graduated"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(e) => updateCapturedData("cfw", "year_graduated", e.target.value, 4)}
                        />
                        {errors?.year_graduated && (
                            <p className="mt-2 text-sm text-red-500">{errors.year_graduated}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="year_level_id" className="block text-sm font-medium">Year Level (if student)</Label>
                        <FormDropDown
                            id="year_level_id"
                            options={YearLevelOptions}
                            selectedOption={capturedData.cfw[4].year_level_id}
                            onChange={handleYearLevelChange}
                        />
                        {errors?.year_level_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.year_level_id}</p>
                        )}
                    </div>
                </div>
            </div >


        </>
    )
}