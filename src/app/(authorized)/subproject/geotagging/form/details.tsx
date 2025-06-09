import { FormDropDown } from "@/components/forms/form-dropdown";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getLibrary } from "@/lib/libraries";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";

export default function Details(){

  return (
      <>
        <Label className="text-md font-semibold text-gray-900 mb-2">Checklist</Label>
        <div className="grid grid-cols-4 sm:grid-rows-1 mb-2">
          <div className="flex grid col-span-4 sm:grid-cols-4">
              <div className="flex items-center space-x-2 m-2">
                <Checkbox id="terms2" className="mr-2" />
                <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Public School for IP (Lumad)?
                </Label>
              </div>
              <div className="flex items-center space-x-2 m-2">
                <Checkbox id="terms2" className="mr-2" />
                <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Purely LCC? (No KC Grant Amount)
                </Label>
              </div>
              <div className="flex items-center space-x-2 m-2">
                <Checkbox id="terms2" className="mr-2" />
                <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Incentives (Tier-2)-ADB?
                </Label>
              </div>
              <div className="flex items-center space-x-2 m-2">
                <Checkbox id="terms2" className="mr-2" />
                <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  LGU-Led?
                </Label>
              </div>
          </div>
        </div>
        <Label className="text-md font-semibold text-gray-900 mb-2">Other Details</Label>
        <div className="flex grid col-span-3 sm:grid-cols-4">
          <div className="p-2">
            <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Number of Children</Label>
            <Input id="no_children" name="no_children" type="number" placeholder="Enter Number of Children" />
          </div>
          <div className="p-2">
            <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Number of Hand Pumps</Label>
            <Input id="no_children" name="no_children" type="number" placeholder="Enter Number of Children" />
          </div>
          <div className="p-2">
            <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Number of Tapstands</Label>
            <Input id="no_children" name="no_children" type="number" placeholder="Enter Number of Children" />
          </div>
        </div>
      </>
  )
}