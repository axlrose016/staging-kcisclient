"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { ILibDivision, ILibOffice, LibraryOption } from "@/components/interfaces/library-interface"
import { LibrariesService } from "@/app/(authorized)/library/LibrariesService"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getOfflineCivilStatusLibraryOptions, getOfflineExtensionLibraryOptions, getOfflineLibSexOptions, getOfflineLibStatuses } from "@/components/_dal/offline-options"
import { FormDropDown } from "@/components/forms/form-dropdown"
import { set } from "lodash"
import { Textarea } from "@/components/ui/textarea"
import { HRService } from "@/app/(authorized)/hr-development/HRService"
import { IApplicant } from "@/db/offline/Dexie/schema/hr-service"
import { FormTabs } from "@/components/forms/form-tabs"
import FormAttachments from "@/components/forms/form-attachments"
import LoadingScreen from "@/components/general/loading-screen"
import { getSession } from "@/lib/sessions-client"
import { SessionPayload } from "@/types/globals"
import PersonProfileContactDetails from "./contact-details"
import PersonProfileHealthConcern from "./health-concern"
import PersonProfileEmployment from "./employment"

const _session = await getSession() as SessionPayload;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
 let defaultValues: Partial<FormValues> = {
    user_id: _session.id,
    first_name: "",
    middle_name:"",
    last_name:"",
    age:0,
    has_immediate_health_concern: false,
    immediate_health_concern: "",
    sitio: "",
    sitio_present_address: "",
    hasoccupation: false,
    current_occupation:"",
    id_card: undefined,
    cellphone_no:"",
  };
export const personProfileFormSchema = z.object({
    id: z.string(),
    first_name: z.string().min(1, "First Name is Required"),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, "Last Name is Required"),
    extension_name_id: z.coerce.number().optional(),
    display_picture: z
    .instanceof(File)
    .optional(),
    sex_id: z.coerce.number().int().positive("Sex is required"),
    civil_status_id: z.coerce.number().int().positive("Civil Status is required"),
    birthdate: z.coerce.date().refine(date => date instanceof Date && !isNaN(date.getTime()), {
        message: "Birthdate is required and must be a valid date",
    }),
    age: z.coerce.number().int().positive("Age is required"),
    philsys_id_no: z.string().optional(),
    birthplace: z.string().min(1, "Birth Place is Required"),
    user_id: z.string(),
    //CONTACT INFORMATION
    region_code: z.string().min(1, "Region is required"),
    province_code: z.string().min(1, "Province is required"),
    city_code: z.string().min(1, "City is required"),
    brgy_code: z.string().min(1, "Barangay is required"),
    sitio: z.string().min(1, "Sitio is required"),
    region_code_present_address:z.string().min(1, "Present Region is required"),
    province_code_present_address:z.string().min(1, "Present Province is required"),
    city_code_present_address:z.string().min(1, "Present City is required"),
    brgy_code_present_address: z.string().min(1, "Present Barangay is required"),
    is_permanent_same_as_current_address: z.boolean().optional(),
    sitio_present_address: z.string().min(1, "Sitio is required"),
    //HEALTH CONCERN
    has_immediate_health_concern: z.boolean(),
    immediate_health_concern: z.string(),
    //EMPLOYMENT
    hasoccupation: z.boolean(),
    current_occupation: z.string(),
    id_card: z.number().optional(),
    cellphone_no: z
    .string()
    .min(11, { message: "Cellphone number must be at least 11 digits" })
    .max(13, { message: "Cellphone number must be at most 13 digits" })
    .regex(/^09\d+$/, { message: "Cellphone number must start with 09 and contain only digits" }),    
    cellphone_no_secondary: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }),
    })
    .superRefine((data, ctx) => {
  // Health Concern validation
    if (
        data.has_immediate_health_concern === true &&
        (!data.immediate_health_concern || !data.immediate_health_concern.trim())
    ) {
        ctx.addIssue({
        path: ["immediate_health_concern"],
        code: "custom",
        message: "Health condition is required.",
        });
    }

    // Current Occupation validation
    if (
        data.hasoccupation === true &&
        (!data.current_occupation || !data.current_occupation.trim()))
        {
            ctx.addIssue({
            path: ["current_occupation"],
            code: "custom",
            message: "Current Occupation is required.",
            });
        }
    });

type FormValues = z.infer<typeof personProfileFormSchema>
const hrService = new HRService();

export default function PersonProfileFormv2() {
  const router = useRouter();
  const params = useParams() || undefined; // for dynamic route segments
  const baseUrl = 'hr-development/hiring-and-deployment/item-distribution/';

  const [record, setRecord] = useState<any>(null);
  const [displayPic, setDisplayPic] = useState<string | null>(null);
  const [libExt, setLibExt] = useState<LibraryOption[]>([]);
  const [libSex, setLibSex] = useState<LibraryOption[]>([]);
  const [libStatuses, setLibStatuses] = useState<LibraryOption[]>([]);
  const [libCivilStatus, setLibCivilStatus] = useState<LibraryOption[]>([]);
  const [activeTab, setActiveTab] = useState("contact-details");

  const id = typeof params?.id === 'string' ? params.id : '';
  const applicantId = typeof params?.applicantId === 'string' ? params.applicantId : '';


  const form = useForm<FormValues>({
    resolver: zodResolver(personProfileFormSchema),
    defaultValues,
  })

  useEffect(() => {
      async function fetchLibrary(){
        const lib_ext = await getOfflineExtensionLibraryOptions();
        const lib_sex = await getOfflineLibSexOptions();
        const lib_civil_status = await getOfflineCivilStatusLibraryOptions();
        const lib_statuses = await (await getOfflineLibStatuses()).filter(status => [21, 22].includes(status.id));
        setLibExt(lib_ext);
        setLibSex(lib_sex);
        setLibCivilStatus(lib_civil_status);
        setLibStatuses(lib_statuses);
      }
      fetchLibrary();
    }, []);


  useEffect(() => {
    if(!applicantId) return ;

    async function fetchRecord() {
      if (applicantId) {
        const fetchedRecord = await hrService.getOfflineApplicantById(applicantId) as IApplicant;
        if(fetchedRecord != null && fetchedRecord != undefined){
          const fetchedDisplayPic = fetchedRecord.display_picture ? URL.createObjectURL(fetchedRecord.display_picture as Blob) : null;
          setDisplayPic(fetchedDisplayPic);
        }
        setRecord(fetchedRecord);
        form.reset(fetchedRecord as any); // ✅ Apply fetched record to form
      }
    }
    fetchRecord();
  }, [applicantId]);

  function onSubmit(data: FormValues) {
    hrService.saveOfflineApplicant(data).then((response:any) => {
      if (response) {
        router.push(`/${baseUrl}/form/${id}`);
        toast({
            variant: "green",
            title: "Success.",
            description: "Form submitted successfully!",
          })
      }
    });
  }

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleAvatarClick = () => {
        if (fileInputRef.current) {
        fileInputRef.current.click();
        }
    };

    const tabs = [
      {
        value: "contact-details",
        label: "Contact Information",
        content: activeTab === "contact-details" && (
          <div className="bg-card rounded-lg">
            <PersonProfileContactDetails form={form}/>
          </div>
        ),
      },
      {
        value:"health-concern",
        label: "Health Concern",
        content: activeTab === "health-concern" && (
          <div className="bg-card rounded-lg">
            <PersonProfileHealthConcern  form={form} />
          </div>
        ),
      },
      {
        value:"employment",
        label: "Employment",
        content: activeTab === "employment" && (
          <div className="bg-card rounded-lg">
            <PersonProfileEmployment  form={form} />
          </div>
        ),
      },
    ]
  // const values = form.watch();

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-full mx-auto">
           <CardHeader>
          <CardTitle className="mb-2 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <img src="/images/logos.png" alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto" />
            </div>

            {/* Title Section */}
            <div className="text-lg font-semibold mt-2 md:mt-0">
              Beneficiary Profile Form <span className="text-blue-800"> </span>
            </div>
          </CardTitle>


          <CardDescription>
            <div className={`p-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm `}>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Important Instructions</h2>
              {/* <Button onClick={handleUpload} >Upload</Button> */}
              <p className="text-gray-700 mb-4">
                Please read and understand the following before proceeding:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>
                  By submitting this form, you agree to the collection, use, and processing of your personal data in accordance with our{" "}
                  <span className="text-indigo-600 underline cursor-pointer">
                    Data Privacy Statement
                  </span>.
                </li>
                <li>
                  Submitting this form does <span className="font-bold">not guarantee</span> acceptance into any program or service. All submissions are subject to review and approval.
                </li>
                <li>
                  Ensure that all fields are accurately completed. Incomplete or incorrect information may result in disqualification.
                </li>
                <li>
                  Utilize special characters, such as ñ and Ñ, where appropriate.
                </li>
              </ul>

            </div>

            {/* It displays essential details about an individual, including their name, photo, role, contact info, and other related information.</CardDescription> */}
          </CardDescription>
        </CardHeader>
        {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
            <div id="general_info_form" className="grid grid-cols-1 py-4 sm:grid-cols-4 gtabs4:grid-cols-1 md:grid-cols-1 2xl:grid-cols-4 w-full">
              <FormField
                control={form.control}
                name="display_picture"
                render={({ field }) => (
                  <FormItem className="col-span-1 p-4 flex flex-col items-center justify-center">
                    <FormLabel className="mb-2">Profile Picture</FormLabel>

                    <Avatar
                      className="h-[300px] w-[300px] cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      id="display_picture"
                    >
                      {displayPic ? (
                        <AvatarImage src={displayPic} alt="Display Picture" />
                      ) : (
                        <AvatarFallback className="bg-white border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 font-bold rounded-full w-full h-full">
                          KC
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <Input
                      id="display_picture"
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > MAX_FILE_SIZE) {
                            form.setError("display_picture", {
                              type: "manual",
                              message: "Image must be 5MB or less",
                            });
                            return;
                          }

                          // Clear any previous error
                          form.clearErrors("display_picture");

                          // Save actual File object (which is a Blob)
                          form.setValue("display_picture", file, { shouldValidate: true });

                          // For UI preview only
                          const url = URL.createObjectURL(file);
                          setDisplayPic(url);
                        }
                      }}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-3 flex flex-col gap-4 mt-2">
                <div className=" grid sm:grid-cols-1 lg:grid-cols-3 gap-4 ipadmini:grid-cols-3 gtabs4:grid-cols-3  2xl:grid-cols-4 w-full ">
                  <div className="sm:py-1 md:p-1">
                    <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter First Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>
                  <div className="sm:py-1 md:p-1">
                    <FormField
                        control={form.control}
                        name="middle_name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Middle Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Middle Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>
                  <div className="sm:py-1 md:p-1">
                    <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Last Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>
                  <div className="sm:py-1 md:p-1">
                    <FormField
                        control={form.control}
                        name="extension_name_id"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Extension Name</FormLabel>
                            <FormControl>
                                <FormDropDown
                                id="extension_name_id"
                                options={libExt}
                                selectedOption={libExt.find(ext => ext.id === field.value)?.id || null}
                                onChange={(selected) => {
                                    field.onChange(selected); // usually enough if you don't need manual form.setValue
                                }}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                  </div>
                  <div className="sm:py-1 md:p-1">
                    <FormField
                        control={form.control}
                        name="sex_id"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Sex</FormLabel>
                            <FormControl>
                                <FormDropDown
                                id="sex_id"
                                options={libSex}
                                selectedOption={libSex.find(sex => sex.id === field.value)?.id || null}
                                onChange={(selected) => {
                                    field.onChange(selected); // usually enough if you don't need manual form.setValue
                                }}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                  </div>
                  <div className="sm:py-1 md:p-1">
                    <FormField
                        control={form.control}
                        name="civil_status_id"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Civil Status</FormLabel>
                            <FormControl>
                                <FormDropDown
                                id="civil_status_id"
                                options={libCivilStatus}
                                selectedOption={libCivilStatus.find(cs => cs.id === field.value)?.id || null}
                                onChange={(selected) => {
                                    field.onChange(selected); // usually enough if you don't need manual form.setValue
                                }}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                  </div>
                  <div className="sm:py-1 md:p-1 mt-2.5">
                   <FormField
                        control={form.control}
                        name="birthdate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Birth Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground",
                                    )}
                                    >
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value || undefined}
                                    onSelect={field.onChange}
                                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                    />  
                  </div>
                  <div className="sm:py-1 md:p-1">
                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                                <Input placeholder="Age" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>
                  <div className="sm:py-1 md:p-1">
                      <FormField
                        control={form.control}
                        name="philsys_id_no"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>PhilSys ID Number</FormLabel>
                            <FormControl>
                                <Input placeholder="PhilSys ID Number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>
                  <div className="sm:py-1 md:p-1  gtabs4:col-span-3 2xl:col-span-3">
                    <FormField
                        control={form.control}
                        name="birthplace"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Birth Place</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Birth Place" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                </div>
              </div>
            </div>
            <div className="p-3 col-span-full">
              <FormTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push(`/${baseUrl}/form/${id}`)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </CardFooter>
          </form>
        </Form>
  {record?.id ? (
  <FormAttachments record_id={record.id} module_path="hrdevelopment" />
) : (
  <div>Loading attachments...</div>
)}
      </Card>
    </div>
  )
}
