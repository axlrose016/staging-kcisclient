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
import { LibrariesService } from "@/components/services/LibrariesService"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getOfflineCivilStatusLibraryOptions, getOfflineExtensionLibraryOptions, getOfflineLibSexOptions, getOfflineLibStatuses } from "@/components/_dal/offline-options"
import { FormDropDown } from "@/components/forms/form-dropdown"
import { set } from "lodash"
import { Textarea } from "@/components/ui/textarea"
import { HRService } from "@/components/services/HRService"
import { IApplicant } from "@/db/offline/Dexie/schema/hr-service"
import { FormTabs } from "@/components/forms/form-tabs"
import FormAttachments from "@/components/forms/form-attachments"
import LoadingScreen from "@/components/general/loading-screen"

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const formSchema = z.object({
    id: z.string(),
    position_item_distribution_id: z.string().optional(),
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
    overall_rating: z.coerce.number().int().optional(),
    status_id: z.coerce.number().int().optional(),
});

type FormValues = z.infer<typeof formSchema>
const hrService = new HRService();

export default function ApplicantForm() {
  const router = useRouter();
  const params = useParams() || undefined; // for dynamic route segments
  const baseUrl = 'hr-development/hiring-and-deployment/item-distribution/';

  const [record, setRecord] = useState<any>(null);
  const [displayPic, setDisplayPic] = useState<string | null>(null);
  const [libExt, setLibExt] = useState<LibraryOption[]>([]);
  const [libSex, setLibSex] = useState<LibraryOption[]>([]);
  const [libStatuses, setLibStatuses] = useState<LibraryOption[]>([]);
  const [libCivilStatus, setLibCivilStatus] = useState<LibraryOption[]>([]);
  const [activeTab, setActiveTab] = useState("application-status");

  const id = typeof params?.id === 'string' ? params.id : '';
  const applicantId = typeof params?.applicantId === 'string' ? params.applicantId : '';


  let defaultValues: Partial<FormValues> = {
    id: "",
    position_item_distribution_id: id || "",
    first_name: "",
    middle_name: "",
    last_name: "",
    extension_name_id: undefined,
    display_picture: undefined,
    sex_id: 0,
    civil_status_id: 0,
    birthdate: new Date(),
    age: 0,
    philsys_id_no: "",
    birthplace: "",
    overall_rating: 0,
    status_id: 0,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  useEffect(() => {
   if(!id) return;
   form.setValue('position_item_distribution_id', id);
  }, [id]);

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
        value: "application-status",
        label: "Application Status",
        content: activeTab === "application-status" && (
          <div className="bg-card rounded-lg">
            <FormField
                control={form.control}
                name="overall_rating"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Overall Score/Rating</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter Score/Rating" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="status_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assessment</FormLabel>
                    <FormControl>
                        <FormDropDown
                        id="status_id"
                        options={libStatuses}
                        selectedOption={libStatuses.find(ls => ls.id === field.value)?.id || null}
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
        ),
      },
      // {
      //   value:"attachments",
      //   label: "Attachments",
      //   content: activeTab === "attachments" && (
      //     <div className="bg-card rounded-lg">
      //     <FormAttachments record_id={form.getValues("id")} module_path={"hrdevelopment"} />
      //     </div>
      //   ),
      // }
    ]
  // const values = form.watch();

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-full mx-auto">
        <CardHeader>
          <CardTitle>Applicant</CardTitle>
          <CardDescription>Enter or update the Applicant General Information.</CardDescription>
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
