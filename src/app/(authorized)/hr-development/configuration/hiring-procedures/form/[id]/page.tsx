"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { ILibHiringProcedure } from "@/components/interfaces/library-interface"
import { LibrariesService } from "@/components/services/LibrariesService"

const formSchema = z.object({
  id: z.number().optional(),
  hiring_procedure_description: z.string().min(1, "Hiring Procedure Description is Required"),
});

type FormValues = z.infer<typeof formSchema>
const libService = new LibrariesService();

export default function FormLibHiringProcedure() {
  const router = useRouter();
  const params = useParams() || undefined; // for dynamic route segments
  const baseUrl = 'hr-development/configuration/hiring-procedures';

  const [record, setRecord] = useState<any>(null);

  const id = params?.id != null ? Number(params.id) : NaN;

  if (isNaN(id)) {
    console.error("Invalid ID provided.");
    return;
  }  

  // Default values for the form (could come from API for editing)
  let defaultValues: Partial<FormValues> = {
    id: id && id > 0 ? id : undefined,
    hiring_procedure_description: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })


  useEffect(() => {
    debugger;
    async function fetchRecord() {
      if (id) {
        const fetchedRecord = await libService.getOfflineLibHiringProcedureById(id) as ILibHiringProcedure;
        setRecord(fetchedRecord);
        form.reset(fetchedRecord as any); // ✅ Apply fetched record to form
      }
    }
    fetchRecord();
  }, [id]);

  function onSubmit(data: FormValues) {
    console.log("Form submitted:", data)
    // Here you would typically send the data to your API
    libService.saveOfflineLibHiringProcedure(data).then((response:any) => {
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
          <CardTitle>Hiring Procedure</CardTitle>
          <CardDescription>Enter or update the Hiring Procedure.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
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
                  name="hiring_procedure_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hiring Procedure</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Hiring Procedure" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push(`/${baseUrl}/`)}>
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
