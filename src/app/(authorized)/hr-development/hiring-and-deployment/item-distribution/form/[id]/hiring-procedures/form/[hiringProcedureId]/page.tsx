"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { ILibHiringProcedure, LibraryOption } from "@/components/interfaces/library-interface"
import { LibrariesService } from "@/components/services/LibrariesService"
import { FormDropDown } from "@/components/forms/form-dropdown"
import { getOfflineLibHiringProcedures } from "@/components/_dal/offline-options"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { HRService } from "@/components/services/HRService"
import { IHiringProcedure } from "@/db/offline/Dexie/schema/hr-service"


const formSchema = z.object({
  id: z.string(),
  position_item_distribution_id: z.string().optional(),
  hiring_procedure_id: z.number().min(1, "Hiring Procedure is Required"),
  date_target_from: z
    .date()
    .nullable()
    .optional()
    .transform((val) => (val ? val.toISOString() : null)),
  date_target_to: z
    .date()
    .nullable()
    .optional()
    .transform((val) => (val ? val.toISOString() : null)),
  date_actual_from: z
    .date()
    .nullable()
    .optional()
    .transform((val) => (val ? val.toISOString() : null)),
  date_actual_to: z
    .date()
    .nullable()
    .optional()
    .transform((val) => (val ? val.toISOString() : null)),
  reason_for_variance: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>
const hrService = new HRService();

export default function FormHiringProcedure() {
  const router = useRouter();
  const params = useParams() || undefined; // for dynamic route segments
  const baseUrl = 'hr-development/hiring-and-deployment/item-distribution/';

  const [record, setRecord] = useState<any>(null);
  const [libHiringProcedure, setLibHiringProcedure] = useState<LibraryOption[]>([]);
  const id = typeof params?.id === 'string' ? params.id : '';
  const hiringProcedureId = typeof params?.hiringProcedureId === 'string' ? params.hiringProcedureId : '';

  // Default values for the form (could come from API for editing)
  let defaultValues: Partial<FormValues> = {
    id: "",
    hiring_procedure_id: 0,
    position_item_distribution_id: id || '',
    date_target_from: null,
    date_target_to: null,
    date_actual_from: null,
    date_actual_to: null,
    reason_for_variance: '',
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  useEffect(() => {
    async function fetchLibrary(){
      const lib_hiring_procedure = await getOfflineLibHiringProcedures();
      setLibHiringProcedure(lib_hiring_procedure);
    }
    fetchLibrary();
  }, []);

  useEffect(() => {
    if(!hiringProcedureId) return ;

    async function fetchRecord() {
      if (hiringProcedureId) {
        const fetchedRecord = await hrService.getOfflineHiringProcedureById(hiringProcedureId) as IHiringProcedure;
        setRecord(fetchedRecord);
        form.reset(fetchedRecord as any); // ✅ Apply fetched record to form
      }
    }
    fetchRecord();
  }, [hiringProcedureId]);

  useEffect(() => {
    if(!id) return;
    form.setValue('position_item_distribution_id', id);
  }, [id]);

  function onSubmit(data: FormValues) {
    debugger;
    console.log("Form submitted:", data)
    // Here you would typically send the data to your API
    hrService.saveOfflineHiringProcedure(data).then((response:any) => {
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

  // const values = form.watch();

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Hiring Procedure</CardTitle>
          <CardDescription>Enter or update the Hiring Procedure.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* <FormField
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
                /> */}
                <FormField
                  control={form.control}
                  name="hiring_procedure_id"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Hiring Procedure</FormLabel>
                      <FormControl>
                          <FormDropDown
                          id="hiring_procedure_id"
                          options={libHiringProcedure}
                          selectedOption={libHiringProcedure.find(r => r.id === field.value)?.id || null}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date_target_from"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Target (from)</FormLabel>
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
                <FormField
                  control={form.control}
                  name="date_target_to"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Target (To)</FormLabel>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date_actual_from"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Actual (From)</FormLabel>
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
                <FormField
                  control={form.control}
                  name="date_actual_to"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Actual (To)</FormLabel>
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
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="reason_for_variance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Variance</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Reason for Variance" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
      </Card>
    </div>
  )
}
