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
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { ILibBudgetYear, ILibEmploymentStatus, ILibPAP } from "@/components/interfaces/library-interface"
import { LibrariesService } from "@/app/(authorized)/library/LibrariesService"

const formSchema = z.object({
  id: z.number().optional(),
  pap_description: z.string().min(1, "PAP is Required"),
});

type FormValues = z.infer<typeof formSchema>
const libService = new LibrariesService();

export default function FormPaps() {
  const router = useRouter();
  const params = useParams() || undefined; // for dynamic route segments
  const baseUrl = 'finance/configuration/paps'

  const [record, setRecord] = useState<any>(null);

  const id = params?.id != null ? Number(params.id) : NaN;

  if (isNaN(id)) {
    console.error("Invalid ID provided.");
    return;
  }  

  // Default values for the form (could come from API for editing)
  let defaultValues: Partial<FormValues> = {
    id: id && id > 0 ? id : undefined,
    pap_description: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })


  useEffect(() => {
    debugger;
    async function fetchRecord() {
      if (id) {
        const fetchedRecord = await libService.getOfflineLibPAPById(id) as ILibPAP;
        setRecord(fetchedRecord);
        form.reset(fetchedRecord as any); // ✅ Apply fetched record to form
      }
    }
    fetchRecord();
  }, [id]);

  function onSubmit(data: FormValues) {
    console.log("Form submitted:", data)
    // Here you would typically send the data to your API
    libService.saveOfflineLibPAP(data).then((response:any) => {
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
          <CardTitle>PAP</CardTitle>
          <CardDescription>Enter or update the PAP.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="pap_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAP</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter PAP" {...field} />
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
