"use client"

import { useState } from "react";
import { onSubmit } from "./action";
import { Label } from "@/components/ui/label";
import Details from "./details";
import { FormTabs } from "@/components/forms/form-tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, useToast } from "@/hooks/use-toast";
import { PictureBox } from "@/components/forms/picture-box";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { FormDropDown } from "@/components/forms/form-dropdown";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Textarea } from "@/components/ui/textarea";
import SPCR from "./spcr";
import SPCF from "./spcf";
import Finance from "./finance";

export default function SubProjectForm(){
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
    const { toast } = useToast()

    //Region
    const [regionOptions, setRegionOptions] = useState<LibraryOption[]>([]); // State to store API data
    const [selectedRegion, setSelectedRegion] = useState(""); // State for selected value
  

    const tabs = [
        {
          value: "details",
          label: "Details",
          content: (
            <div className="bg-card rounded-lg">
              <Details/>
            </div>
          ),
        },
        {
          value: "spcf",
          label: "Sub-Project Concept Form",
          content: (
            <div className="bg-card rounded-lg">
              <SPCF errors={errors}/>
            </div>
          ),
        },
        {
          value: "spcr",
          label: "Sub-Project Completion Report",
          content: (
            <div className="bg-card rounded-lg">
              <SPCR errors={errors}/>
            </div>
          ),
        },
        {
          value: "finance",
          label: "Financial Information",
          content: (
            <div className="bg-card rounded-lg">
              <Finance errors={errors}/>
            </div>
          ),
        },
    ]


    async function handleOnClick(formData: FormData) {
      const result = await onSubmit(formData)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        setErrors({})
      } else {
        setErrors(result.errors || {})
      }
    }

    const handleRoleChange = (id: any) => {
          console.log("Updated User: ")
      }
    return (
      <Card className="w-full">
        <CardHeader>
        <CardTitle className="mb-2 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <img src="/images/logos.png" alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto" />
            </div>

            {/* Title Section */}
            <div className="text-lg font-semibold mt-2 md:mt-0">
              Sub-Project Form
            </div>
          </CardTitle>

        </CardHeader>
        <form action={handleOnClick}>
          <CardContent>
            <div className="grid sm:grid-cols-4 sm:grid-rows-2 mb-2">
                <div className="flex items-center justify-center row-span-1 sm:row-span-2 sm:col-span-1">
                  <PictureBox />
                </div>
                <div className="flex grid sm:col-span-3 sm:grid-cols-3">
                  <div className="p-2">
                    <Label htmlFor="first_name" className="block text-sm font-medium">Region</Label>
                    <FormDropDown
                      options={regionOptions}
                      selectedOption={selectedRegion}
                      label="Select Region ..."
                      onChange={handleRoleChange}

                    />
                    {/* {errors?.first_name && (
                      <p className="mt-2 text-sm text-red-500">{errors.first_name[0]}</p>
                    )} */}
                  </div>
                  <div className="p-2">
                    <Label htmlFor="first_name" className="block text-sm font-medium">Province</Label>
                    <FormDropDown
                        options={regionOptions}
                        selectedOption={selectedRegion}
                        label="Select Province ..."
                        onChange={handleRoleChange}
                      />
                    {/* {errors?.middle_name && (
                      <p className="mt-2 text-sm text-red-500">{errors.middle_name[0]}</p>
                    )} */}
                  </div>
                  <div className="p-2">
                    <Label htmlFor="first_name" className="block text-sm font-medium">Municipality</Label>
                    <FormDropDown
                      options={regionOptions}
                      selectedOption={selectedRegion}
                      label="Select Municipality ..."
                      onChange={handleRoleChange}

                    />
                    {/* {errors?.last_name && (
                      <p className="mt-2 text-sm text-red-500">{errors.last_name[0]}</p>
                    )} */}
                  </div>
                  <div className="p-2">
                    <Label htmlFor="first_name" className="block text-sm font-medium">Barangay</Label>
                    <FormDropDown
                      options={regionOptions}
                      selectedOption={selectedRegion}
                      label="Select Barangay ..."
                      onChange={handleRoleChange}

                    />
                    {/* {errors?.last_name && (
                      <p className="mt-2 text-sm text-red-500">{errors.last_name[0]}</p>
                    )} */}
                  </div>
                  <div className="p-2">
                    <Label htmlFor="first_name" className="block text-sm font-medium">Sitio</Label>
                      <Input placeholder="Sitio"/>
                  </div>
                  <div className="p-2">
                    <Label htmlFor="first_name" className="block text-sm font-medium">Mode</Label>
                    <FormDropDown
                      options={regionOptions}
                      selectedOption={selectedRegion}
                      label="Select Project Type ..."
                      onChange={handleRoleChange}
                    />
                    {errors?.last_name && (
                      <p className="mt-2 text-sm text-red-500">{errors.last_name[0]}</p>
                    )}
                  </div>
                </div>
                <div className="flex grid sm:col-span-2 sm:grid-cols-2">
                  <div className="p-2">
                    <Label htmlFor="first_name" className="block text-sm font-medium">Sub Project ID</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      placeholder="SPID"
                      disabled={true}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors?.first_name && (
                      <p className="mt-2 text-sm text-red-500">{errors.first_name[0]}</p>
                    )}
                  </div>
                  <div className="p-2">
                    <Label htmlFor="first_name" className="block text-sm font-medium">Project Type</Label>
                    <FormDropDown
                      options={regionOptions}
                      selectedOption={selectedRegion}
                      label="Select Project Type ..."
                      onChange={handleRoleChange}
                    />
                    {errors?.last_name && (
                      <p className="mt-2 text-sm text-red-500">{errors.last_name[0]}</p>
                    )}
                  </div>
                  <div className="p-2">
                    <Label htmlFor="first_name" className="block text-sm font-medium">Fund Source</Label>
                    <FormDropDown
                      options={regionOptions}
                      selectedOption={selectedRegion}
                      label="Select Project Type ..."
                      onChange={handleRoleChange}
                    />
                    {errors?.last_name && (
                      <p className="mt-2 text-sm text-red-500">{errors.last_name[0]}</p>
                    )}
                  </div>
                  <div className="p-2">
                    <Label htmlFor="first_name" className="block text-sm font-medium">Cycle</Label>
                    <FormDropDown
                      options={regionOptions}
                      selectedOption={selectedRegion}
                      label="Select Project Type ..."
                      onChange={handleRoleChange}
                    />
                    {errors?.last_name && (
                      <p className="mt-2 text-sm text-red-500">{errors.last_name[0]}</p>
                    )}
                  </div>
                </div>
                <div className="flex grid sm:col-span-1 sm:grid-cols-1">
                  <div className="p-2">
                  <Label htmlFor="first_name" className="block text-sm font-medium">Sub-Project Name</Label>
                    <Textarea maxLength={250} />
                  </div>
                </div>
            </div>
            {/* <FormTabs tabs={tabs}/> */}
          </CardContent>
          <CardFooter className="mt-6 flex items-center justify-end gap-x-6">
              <button type="button" className="text-sm/6 font-semibold text-gray-900">
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
          </CardFooter>
        </form>
      </Card>
    )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Registering...' : 'Register'}
    </Button>
  )
}

