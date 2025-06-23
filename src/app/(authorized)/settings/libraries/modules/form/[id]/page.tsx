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
import { LibrariesService } from "../../../../../../../components/services/LibrariesService"
import { IModules, IRoles } from "@/components/interfaces/library-interface"

const formSchema = z.object({
  id: z.string(),
  module_description: z.string().min(1, { message: "Role description is required" }),
  module_path: z.string().min(1, { message: "Module path is required" }),
});

type FormValues = z.infer<typeof formSchema>
const libService = new LibrariesService();

export default function FormModule() {
  const router = useRouter();
  const params = useParams() || undefined; // for dynamic route segments
  const baseUrl = 'settings/libraries/modules/'

  const [record, setRecord] = useState<any>(null);

  const id = typeof params?.id === 'string' ? params.id : '';

  useEffect(() => {
    debugger;
    async function fetchRecord() {
      if (id) {
        const fetchedRecord = await libService.getOfflineModuleById(id) as IModules;
        setRecord(fetchedRecord);
        form.reset(fetchedRecord as any); // ✅ Apply fetched record to form
      }
    }
    fetchRecord();
  }, [id]);

  // Default values for the form (could come from API for editing)
  let defaultValues: Partial<FormValues> = {
    id: "",
    module_description: "",
    module_path: "",
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  function onSubmit(data: FormValues) {
    console.log("Form submitted:", data)

    libService.saveOfflineModule(data).then((response:any) => {
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
          <CardTitle>Module</CardTitle>
          <CardDescription>Enter Module Details.</CardDescription>
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
                  name="module_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Module Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="module_path"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Module Path</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="Enter Module Path" {...field} />
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
              <Button type="submit">Save Module</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
