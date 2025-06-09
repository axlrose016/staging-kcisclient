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
import { LibraryOption } from "@/components/interfaces/library-interface"
import { UserService } from "../../../UserService"
import { IUserAccess } from "@/components/interfaces/iuser"
import { FormDropDown } from "@/components/forms/form-dropdown"
import { getOfflineModules, getOfflinePermissions } from "@/components/_dal/offline-options"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  id: z.string(),
  module_id: z.string().min(1, { message: "Module is required" }),
  permission_id: z.string().min(1, { message: "Permission description is required" }),
  user_id: z.string()
});

type FormValues = z.infer<typeof formSchema>
const userService = new UserService();

export default function UserAccessPage() {
  const router = useRouter();
  const params = useParams() || undefined; // for dynamic route segments
  const baseUrl = 'settings/users/'

  const [record, setRecord] = useState<any>(null);
  const [modules, setModules] = useState<LibraryOption[]>([]);
  const [permissions, setPermissions] = useState<LibraryOption[]>([]);

  const userId = typeof params?.userId === 'string' ? params.userId : '';
  const id = typeof params?.id === 'string' ? params.id : '';

  useEffect(() => {
    async function fetchLibrary(){
      const lib_modules = await getOfflineModules(); 
      const lib_permissions = await getOfflinePermissions();
      setPermissions(lib_permissions);
      setModules(lib_modules);
    }
    fetchLibrary();
  }, [])

  useEffect(() => {
    debugger;
    async function fetchRecord() {
      if (userId) {
        const fetchedRecord = await userService.getOfflineUserAccessById(userId) as IUserAccess;
        setRecord(fetchedRecord);
        form.reset(fetchedRecord as any); // ✅ Apply fetched record to form
      }
    }
    fetchRecord();
  }, [userId]);

  // Default values for the form (could come from API for editing)
  let defaultValues: Partial<FormValues> = {
    id: "",
    module_id: "",
    permission_id: "",
    user_id: id,
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  function onSubmit(data: FormValues) {
    console.log("Form submitted:", data)

    userService.saveOfflineUserAccess(data).then((response:any) => {
      if (response) {
        router.push(`/${baseUrl}/${data.user_id}`);
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
          <CardTitle>Access</CardTitle>
          <CardDescription>Enter Access Details.</CardDescription>
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
                  name="user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User ID</FormLabel>
                      <FormControl>
                        <Input placeholder="User ID" {...field} readOnly/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="module_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module</FormLabel>
                      <FormControl>
                        <FormDropDown
                          id="module_id"
                          options={modules}
                          selectedOption={modules.find(module => module.id === field.value)?.id || null}
                          onChange={(selected) => {
                            console.log("Selected Role:", selected);
                            field.onChange(selected); // usually enough if you don't need manual form.setValue
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permission_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permission</FormLabel>
                      <FormControl>
                        <FormDropDown
                          id="permission_id"
                          options={permissions}
                          selectedOption={permissions.find(permission => permission.id === field.value)?.id || null}
                          onChange={(selected) => {
                            console.log("Selected Role:", selected);
                            field.onChange(selected); 
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
             
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push(`/${baseUrl}/${id}`)}
              >                
                Cancel
              </Button>
              <Button type="submit">Save Access</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}