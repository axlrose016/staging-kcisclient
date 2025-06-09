"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LibraryOption } from "../interfaces/library-interface";

interface FormDropDownProps {
  options: LibraryOption[];
  selectedOption: any | null; // Use number since ID is usually numeric
  label?: string;
  id?: string;
  onChange: (id: any) => void; // Function that receives the selected ID
  menuPortalTarget?: string;
  readOnly?: boolean;
  disabled?: boolean;
  name?: string;
}

export function FormDropDown({ options, selectedOption, label, onChange, id, menuPortalTarget, readOnly, disabled, name }: FormDropDownProps) {
  const [open, setOpen] = React.useState(false);
  // const [selected, setSelected] = React.useState<number>(Number(selectedOption));
  const [selectedId, setSelectedId] = React.useState<any | null>(selectedOption);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000)
    // setSelected(Number(selectedOption));
    // setSelectedId(selectedOption);
  }, []);

  React.useEffect(() => {
    setSelectedId(selectedOption !== null ? selectedOption : null);
  }, [selectedOption]);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000)
  })
  // const handleSelect = (option: any) => {
  //   setSelected(option);
  //   setOpen(false);
  //   onChange(option); // Pass the entire option object back
  // };
  const handleSelect = (id: any) => {
    setSelectedId(id);
    setOpen(false);
    onChange(id); // Call onChange with the selected ID
  };


  return (
    <div className="w-full p-0 z-[9999]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild >
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between text-ellipsis overflow-hidden ${readOnly ? "truncate pointer-events-none cursor-not-allowed" : ""}`}
            name={name}
            // className="w-full justify-between overflow-hidden truncate pointer-events-none"
            onClick={(e) => e.stopPropagation()}

          // disabled={readOnly}
          >
            <span className="truncate max-w-full uppercase">{selectedId !== null ? options.find((option) => option.id === selectedId)?.name : label}</span>
            <ChevronsUpDown className="opacity-50 ml-2 flex-shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 z-[9999]" >
          <Command>
            <CommandInput placeholder={label} />
            <CommandList>
              <CommandEmpty>No {label} found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem key={option.id} value={option.name} onSelect={() => handleSelect(option.id)} className="w-full max-w-full">

                    <span className="relative z-10 text-ellipsis max-w-full uppercase">{option.name}</span>
                    <Check className={cn("ml-auto", selectedId === option.id ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
