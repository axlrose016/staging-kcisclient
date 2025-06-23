/* eslint-disable react/react-in-jsx-scope */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { v4 as uuidv4 } from "uuid";

interface RadioOption {
  id: string | number;
  name: string;
}

interface CustomRadioGroupProps {
  options: RadioOption[];
  onChange?: (optionResponses: any[]) => void;
  values?: any[];
  created_by?: string;
  person_profile_id?: string;
  created_date?: string;
  user_id?: any;
  last_modified_by?: string;
  last_modified_date?: string;
  push_date?: string;
  push_status_id?: number;
  deleted_by?: string;
  deleted_date?: string;
  remarks?: string;
}

export function CustomRadioGroup({
  options,
  onChange,
  created_by,
  person_profile_id,
  created_date,
  user_id,
}: CustomRadioGroupProps) {
  const [responses, setResponses] = useState<Record<string, boolean>>({});

  // Load saved state from localStorage
  useEffect(() => {
    const lsSec = localStorage.getItem("person_sectors");
    if (lsSec) {
      try {
        const parsed = JSON.parse(lsSec);
        // Convert sector list to response shape
        const restored: Record<string, boolean> = {};
        parsed.forEach((sector: any) => {
          if (sector?.sector_id) {
            restored[sector.sector_id.toString()] = !sector.is_deleted;
          }
        });
        setResponses(restored);
      } catch (err) {
        console.error("Error parsing sectors from localStorage", err);
      }
    }
  }, []);

  // Handle toggle
  const handleOptionChange = (Id: string | number, value: string) => {
    const strId = Id.toString();
    const newResponses = {
      ...responses,
      [strId]: value === "yes",
    };

    // Save PWD flag if sector_id = 3
    if (strId === "3") {
      localStorage.setItem("isPWDSector", value === "yes" ? "true" : "false");
    }

    setResponses(newResponses);

    // const formatted = Object.entries(newResponses)
    //   .filter(([key]) => key && key !== "0")
    //   .map(([key, isActive]) => ({
    //     is_deleted: !isActive,
    //     sector_id: key.toString(),
    //     id: uuidv4(),
    //     created_by,
    //     person_profile_id,
    //     created_date,
    //     user_id,
    //     last_modified_by: null,
    //     last_modified_date: null,
    //     push_date: null,
    //     push_status_id: 2,
    //     deleted_by: null,
    //     deleted_date: null,
    //     remarks: "Person Profile Sector Created",
    //   }));
    const formatted = options.map((option) => {
      const strId = option.id.toString();
      const isActive = newResponses[strId] ?? false; // default to false if not explicitly set
      return {
        is_deleted: !isActive,
        sector_id: strId,
        id: uuidv4(),
        created_by,
        person_profile_id,
        created_date,
        user_id,
        last_modified_by: null,
        last_modified_date: null,
        push_date: null,
        push_status_id: 2,
        deleted_by: null,
        deleted_date: null,
        remarks: "Person Profile Sector Created",
      };
    });


    localStorage.setItem("person_sectors", JSON.stringify(formatted));
    onChange?.(formatted);
  };

  return (
    <>
      {options.map((option) => (
        <div key={option.id} className="border rounded-lg p-5">
          <div className="font-medium mb-3 flex items-center">
            {option.name}
          </div>

          <RadioGroup
            value={
              responses?.[option.id.toString()] === undefined
                ? ""
                : responses[option.id.toString()]
                  ? "yes"
                  : "no"
            }
            onValueChange={(value) => handleOptionChange(option.id, value)}
          >
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id={`${option.id}-yes`} />
                <Label htmlFor={`${option.id}-yes`}>Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id={`${option.id}-no`} />
                <Label htmlFor={`${option.id}-no`}>No</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      ))}
    </>
  );
}
