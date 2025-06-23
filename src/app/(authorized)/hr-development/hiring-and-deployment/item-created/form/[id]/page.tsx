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
import { IPositionItem } from "@/db/offline/Dexie/schema/hr-service"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { FormDropDown } from "@/components/forms/form-dropdown"
import { LibraryOption } from "@/components/interfaces/library-interface"
import { getOfflineLibEmploymentStatus, getOfflineLibModalityOptions, getOfflineLibPosition } from "@/components/_dal/offline-options"
import { lib_modality } from "@/db/schema/libraries"
import { HRService } from "@/components/services/HRService"

const formSchema = z.object({
  id: z.string(),
  item_code: z.string().min(1, "Item code is required"),
  position_id: z.coerce.number().int().positive("Position ID must be a positive number"),
  salary_grade_id: z.coerce.number().int().positive("Salary grade ID must be a positive number"),
  employment_status_id: z.coerce.number().int().positive("Employment status ID must be a positive number"),
  modality_id: z.coerce.number().int().positive("Modality ID must be a positive number"),
  is_abolished: z.boolean().default(false),
  date_abolished: z
    .date()
    .nullable()
    .optional()
    .transform((val) => (val ? val.toISOString() : null)),
}).refine((data) => {
  // If is_abolished is true, date_abolished must be provided (non-null)
  return !data.is_abolished || (data.date_abolished !== null && data.date_abolished !== undefined);
}, {
  message: "Date abolished is required when the position is abolished.",
  path: ["date_abolished"], // Highlight this field in UI if error
});

type FormValues = z.infer<typeof formSchema>
const hrService = new HRService();

export default function FormPositionItem() {
  const router = useRouter();
  const params = useParams() || undefined; // for dynamic route segments
  const baseUrl = 'hr-development/hiring-and-deployment/item-created/'

  const [record, setRecord] = useState<any>(null);
  const [libPosition, setLibPosition] = useState<LibraryOption[]>([]);
  const [libEmploymentStatus, setEmploymentStatus] = useState<LibraryOption[]>([]);
  const [libModality, setLibModality] = useState<LibraryOption[]>([]);

  const id = typeof params?.id === 'string' ? params.id : '';

  useEffect(() => {
    async function fetchLibrary(){
      const lib_position = await getOfflineLibPosition(); 
      const lib_employment_status = await getOfflineLibEmploymentStatus();
      const lib_modality = await getOfflineLibModalityOptions();
      setEmploymentStatus(lib_employment_status);
      setLibPosition(lib_position);
      setLibModality(lib_modality);
    }
    fetchLibrary();
  }, [])

  useEffect(() => {
    debugger;
    async function fetchRecord() {
      if (id) {
        const fetchedRecord = await hrService.getOfflinePositionItemById(id) as IPositionItem;
        setRecord(fetchedRecord);
        form.reset(fetchedRecord as any); // ✅ Apply fetched record to form
      }
    }
    fetchRecord();
  }, [id]);

  // Default values for the form (could come from API for editing)
  let defaultValues: Partial<FormValues> = {
    id: "",
    item_code: "",
    position_id: 0,
    salary_grade_id: 0,
    employment_status_id: 0,
    modality_id: 0,
    is_abolished: false,
    date_abolished: null,
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  function onSubmit(data: FormValues) {
    // If not abolished, ensure date_abolished is null
    if (!data.is_abolished) {
      data.date_abolished = null
    }

    console.log("Form submitted:", data)
    debugger;
    // Here you would typically send the data to your API
    hrService.saveOfflinePositionItem(data).then((response:any) => {
      if (response) {
        router.push(`/${baseUrl}/`);
        toast({
            variant: "green",
            title: "Success.",
            description: "Form submitted successfully!",
          })
      }
    });
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Position Details</CardTitle>
          <CardDescription>Enter or update the employee position information.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Record ID" {...field} readOnly/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="item_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter item code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="position_id"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                          <FormDropDown
                          id="position_id"
                          options={libPosition}
                          selectedOption={libPosition.find(r => r.id === field.value)?.id || null}
                          onChange={(selected) => {
                          field.onChange(selected); 
                          }}
                      />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary_grade_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Grade ID</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter salary grade ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="employment_status_id"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Employment Status</FormLabel>
                      <FormControl>
                          <FormDropDown
                          id="employment_status_id"
                          options={libEmploymentStatus}
                          selectedOption={libEmploymentStatus.find(r => r.id === field.value)?.id || null}
                          onChange={(selected) => {
                          field.onChange(selected); 
                          }}
                      />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
                />

               <FormField
                  control={form.control}
                  name="modality_id"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Modality</FormLabel>
                      <FormControl>
                          <FormDropDown
                          id="modality_id"
                          options={libModality}
                          selectedOption={libModality.find(r => r.id === field.value)?.id || null}
                          onChange={(selected) => {
                          field.onChange(selected); 
                          }}
                      />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_abolished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Position Abolished</FormLabel>
                      <FormDescription>Check this box if the position has been abolished</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("is_abolished") && (
                <FormField
                  control={form.control}
                  name="date_abolished"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date Abolished</FormLabel>
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
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push(`/${baseUrl}/`)}>
                Cancel
              </Button>
              <Button type="submit">Save Position</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
