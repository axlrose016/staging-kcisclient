import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getCourseLibraryOptions, getYearLevelLibraryOptions } from "@/components/_dal/options";
import { getOfflineLibCourses, getOfflineLibSchools, getOfflineLibYearLevel } from "@/components/_dal/offline-options";
import { IPersonProfile } from "@/components/interfaces/personprofile";
export default function HighestEducationalAttainment({ errors, capturedData, updateFormData, user_id_viewing }: { errors: any; capturedData: Partial<IPersonProfile>; updateFormData: (newData: Partial<IPersonProfile>) => void, user_id_viewing: string }) {
    const [userIdViewing, setUserIdViewing] = useState(user_id_viewing);
    const [relationOptions, setRelationOptions] = useState<LibraryOption[]>([]);
    const [selectedRelation, setSelectedRelation] = useState("");

    const [courseOptions, setCourseOptions] = useState<LibraryOption[]>([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

    const [schoolOptions, setSchoolOptions] = useState<LibraryOption[]>([]);

    const [YearLevelOptions, setYearLevelOptions] = useState<LibraryOption[]>([]);
    const [selectedYearLevel, setSelectedYearLevel] = useState("");
    const [selectedYearLevelId, setSelectedYearLevelId] = useState<number | null>(null);
    const [isGraduate, setisGraduate] = useState(false);
    const isGraduateRef = useRef<HTMLInputElement>(null);


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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const course = await getOfflineLibCourses(); //await getCourseLibraryOptions();               
                setCourseOptions(course);

                const schoolList = await getOfflineLibSchools(); //await getCourseLibraryOptions();               
                console.log("School Array", schoolList);
                setSchoolOptions(schoolList);
                // console.log("schoolList", schoolList);

                const year_level = await getOfflineLibYearLevel(); //await getYearLevelLibraryOptions();
                const formattedYearLevel = year_level.map(option => ({

                    ...option,
                    name: option.name.toUpperCase(), // Convert label to uppercase

                }));
                setYearLevelOptions(formattedYearLevel);

                const storedEducationalAttainment = localStorage.getItem("educational_attainment");

                if (storedEducationalAttainment) {
                    setEducationalAttainment(JSON.parse(storedEducationalAttainment));
                } else {
                    localStorage.setItem("educational_attainment", JSON.stringify(initialEducation));
                    setEducationalAttainment(initialEducation);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);




    const inputOnchange = (field: string, value: string) => {
        setEducationalAttainment((prev) => {
            const updatedData = { ...prev, [field]: value };

            // Update localStorage
            localStorage.setItem("educational_attainment", JSON.stringify(updatedData));

            return updatedData;
        });
        updateFormData({ [field]: value })
    };

    const chkIsGraduateChange = (e: any) => {
        // alert(e);
        setisGraduate(e);
        inputOnchange("is_graduate", e);
        educationalAttainment.school_name = "";
        educationalAttainment.campus = "";
        educationalAttainment.school_address = "";
        educationalAttainment.short_name = "";
        educationalAttainment.course_id = 0;
        educationalAttainment.year_level_id = 0;
        educationalAttainment.year_level_id = 0;
        educationalAttainment.year_graduated = ""
        // alert(e)
        // updatingCommonData('philsys_id_no', "")
        // updatingCommonData('has_philsys_id', !hasPhilsysId);
    }
    useEffect(() => {
        if (isGraduate && isGraduateRef.current) {
            isGraduateRef.current.focus(); // Auto-focus when enabled
        }
    }, [isGraduate]);

    // readonly when admin viewing 
    useEffect(() => {
        if (userIdViewing) {
            const form = document.getElementById("highest_educational_attainment_info_form");
            if (form) {
                form.querySelectorAll("input, select, textarea, button, label").forEach((el) => {
                    el.setAttribute("disabled", "true");
                });
            }
        }
    }, [userIdViewing]);
    return (
        <div id="highest_educational_attainment_info_form">

            <div className="grid grid-cols-1 py-4 sm:grid-cols-4   ipadmini:grid-cols-1 gtabs4:grid-cols-1 2xl:grid-cols-4  w-full">
                <div className="sm:py-1 md:p-1 col-span-4 w-full max-w-full box-border">

                    <div className="flex items-start space-x-3 p-4 bg-white shadow-md rounded-md mb-5">
                        <Input
                            type="checkbox"
                            className="w-5 h-5 cursor-pointer accent-blue-500 mt-1"
                            id="is_graduate_chk"
                            checked={capturedData?.is_graduate ?? false}
                            onChange={(e) => chkIsGraduateChange(e.target.checked)}
                        />
                        <div className="flex flex-col">
                            <Label htmlFor="is_graduate_chk" className="text-lg font-semibold text-gray-800">
                                Are you a graduate?
                            </Label>
                            <p className="text-sm text-gray-500 mt-1">

                                Tick the checkbox if you have successfully completed the program, and enter the required data in the provided fields.

                                <br /> Leave it unticked if you have not yet finished the program, and specify your current year level.
                            </p>
                        </div>

                    </div>



                </div>
                <div className={`p-2 col-span-4`}>
                <Label htmlFor="school_name" className="block text-sm font-medium">School Name<span className='text-red-500'> *</span></Label>
                    <FormDropDown
                        id="school_name"
                        options={schoolOptions}
                        selectedOption={Number(capturedData.school_id) || 0}
                        onChange={(value) => {
                            const selectedSchool = schoolOptions.find(option => option.id === value);
                            inputOnchange("school_id", value);
                            inputOnchange("short_name", selectedSchool?.short_name || "");
                        }}
                        // onChange={(value) =>  inputOnchange("school_id", value)}
                    />
                    {/* <Input
                        ref={isGraduateRef}
                        value={capturedData.school_name}
                        // value={capturedData.school_name ? capturedData.school_name : ""}
                        onChange={(e) => inputOnchange("school_name", e.target.value.toUpperCase())}
                        id="school_name"
                        name="school_name"
                        type="text"
                        placeholder="Enter Name of School"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    /> */}
                    {errors?.school_name && (
                        <p className="mt-2 text-sm text-red-500">{errors.school_name}</p>
                    )}
                </div>
                <div className={`p-2 col-span-4 `}>
                    <Label htmlFor="campus" className="block text-sm font-medium">Campus<span className='text-red-500'> *</span></Label>
                    <Input
                        ref={isGraduateRef}
                        value={capturedData?.campus}
                        id="campus"
                        name="campus"
                        type="text"
                        placeholder="Enter Campus"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        onChange={(e) => inputOnchange("campus", e.target.value.toUpperCase())}
                    />
                    {errors?.campus && (
                        <p className="mt-2 text-sm text-red-500">{errors.campus}</p>
                    )}
                </div>
                <div className={`p-2 col-span-4 `}>
                    <Label htmlFor="school_address" className="block text-sm font-medium">School Address<span className='text-red-500'> *</span></Label>
                    <Textarea
                        value={capturedData?.school_address}
                        id="school_address"
                        name="school_address"
                        placeholder="Enter School Address"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows={4}
                        onChange={(e) => inputOnchange("school_address", e.target.value.toUpperCase())}
                    />
                    {errors?.school_address && (
                        <p className="mt-2 text-sm text-red-500">{errors.school_address}</p>
                    )}
                </div>
                <div className={`p-2 col-span-4  `}>
                    <Label htmlFor="course_id" className="block text-sm font-medium">Course<span className='text-red-500'> *</span></Label>
                    <FormDropDown
                        id="course_id"
                        options={courseOptions}
                        selectedOption={Number(capturedData.course_id) || 0}
                        onChange={(value) => inputOnchange("course_id", value)}
                    />
                    {errors?.course_id && (
                        <p className="mt-2 text-sm text-red-500">{errors.course_id}</p>
                    )}
                </div>
                <div className={`p-2 col-span-4 ${!capturedData.is_graduate ? "hidden" : ""}   `}>
                    <Label htmlFor="year_graduated" className="block text-sm font-medium">Year Graduated<span className='text-red-500'> *</span></Label>
                    <Input
                        value={capturedData.is_graduate ? capturedData.year_graduated : capturedData.year_graduated = ""}
                        id="year_graduated"
                        name="year_graduated"
                        type="text"
                        placeholder="Enter Year Graduated"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        onChange={(e) => inputOnchange("year_graduated", e.target.value)}
                    />
                    {errors?.year_graduated && (
                        <p className="mt-2 text-sm text-red-500">{errors.year_graduated}</p>
                    )}
                </div>
                <div className={`p-2 col-span-4 ${capturedData.is_graduate ? "hidden" : ""}   `}>
                    <Label htmlFor="year_level_id" className="block text-sm font-medium">Year Level</Label>
                    <FormDropDown
                        id="year_level_id"
                        options={YearLevelOptions}
                        selectedOption={
                            !capturedData?.is_graduate ? Number(capturedData.year_level_id) || "" : capturedData.year_level_id = 0
                        }
                        onChange={(value) => inputOnchange("year_level_id", value)}
                        disabled={true}
                    // disabled={educationalAttainment.is_graduate}
                    />
                    {errors?.year_level_id && (
                        <p className="mt-2 text-sm text-red-500">{errors.year_level_id}</p>
                    )}
                </div>
            </div>


        </div>
    )
}