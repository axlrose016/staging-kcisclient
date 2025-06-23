"use client";

import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { FormDropDown } from "@/components/forms/form-dropdown";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { FormValues } from "@/app/sign-up/guest/page";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface Props {
  displayPic: string | null;
  setDisplayPic: (pic: string) => void;
  libExt: LibraryOption[];
  libSex: LibraryOption[];
  libCivilStatus: LibraryOption[];
}

export const GeneralInformationSection = ({
  displayPic,
  setDisplayPic,
  libExt,
  libSex,
  libCivilStatus,
}: Props) => {
  const { control, setValue, setError, clearErrors, watch } = useFormContext<FormValues>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

useEffect(() => {
  const subscription = watch((value, { name }) => {
    // Only act when 'basicInformation.birthdate' changes
    if (name === "basicInformation.birthdate") {
      const birthdate = value.basicInformation?.birthdate;

      if (birthdate instanceof Date && !isNaN(birthdate.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();

        const hasBirthdayPassed =
          today.getMonth() > birthdate.getMonth() ||
          (today.getMonth() === birthdate.getMonth() && today.getDate() >= birthdate.getDate());

        if (!hasBirthdayPassed) age -= 1;

        setValue("basicInformation.age", age, { shouldValidate: true });
      }
    }
  });

  return () => subscription.unsubscribe();
}, [watch, setValue]);

  return (
    <>
    <div className="p-5 col-span-full">
        <div className={`grid sm:grid-cols-4 sm:grid-rows-1 bg-cfw_bg_color text-white p-3 mb-0`}>
            General Information
        </div>
    </div>
    <div id="general_info_form" className="grid grid-cols-1 py-4 sm:grid-cols-4 gtabs4:grid-cols-1 md:grid-cols-1 2xl:grid-cols-4 w-full p-5">
      {/* Display Picture */}
      <FormField
        control={control}
        name="basicInformation.display_picture"
        render={({ field }) => (
          <FormItem className="col-span-1 p-4 flex flex-col items-center justify-center">
            <FormLabel className="mb-2">Profile Picture</FormLabel>

            <Avatar
              className="h-[300px] w-[300px] cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              id="basicInformation.display_picture"
            >
              {displayPic ? (
                <AvatarImage src={displayPic} alt="Display Picture" />
              ) : (
                <AvatarFallback className="bg-white border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 font-bold rounded-full w-full h-full">
                  KC
                </AvatarFallback>
              )}
            </Avatar>

            <Input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > MAX_FILE_SIZE) {
                    setError("basicInformation.display_picture", {
                      type: "manual",
                      message: "Image must be 5MB or less",
                    });
                    return;
                  }

                  // ✅ Call RHF's field.onChange
                  field.onChange(file);
                  clearErrors("basicInformation.display_picture");

                  // ✅ Update UI preview
                  const url = URL.createObjectURL(file);
                  setDisplayPic(url);
                }
              }}
            />

            <FormMessage />
          </FormItem>
        )}
      />

      <div className="col-span-3 flex flex-col gap-4 mt-2">
        <div className=" grid sm:grid-cols-1 lg:grid-cols-3 gap-4 ipadmini:grid-cols-3 gtabs4:grid-cols-3  2xl:grid-cols-4 w-full ">
          <div className="p-2 md:p-1">
            <FormField
                control={control}
                name="basicInformation.first_name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter First Name" className="normal-case" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>
          <div className="p-2 md:p-1">
            <FormField
                control={control}
                name="basicInformation.middle_name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter Middle Name" className="normal-case" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>
          <div className="p-2 md:p-1">
            <FormField
                control={control}
                name="basicInformation.last_name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter Last Name" className="normal-case" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>
          <div className="p-2 md:p-1">
            <FormField
                control={control}
                name="basicInformation.extension_name_id"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Extension Name</FormLabel>
                    <FormControl>
                        <FormDropDown
                        id="extension_name_id"
                        options={libExt}
                        selectedOption={libExt.find(ext => ext.id === field.value)?.id || null}
                        onChange={(selected) => {
                            field.onChange(selected); // usually enough if you don't need manual form.setValue
                        }}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
          </div>
          <div className="p-2 md:p-1">
            <FormField
                control={control}
                name="basicInformation.sex_id"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <FormControl>
                        <FormDropDown
                        id="sex_id"
                        options={libSex}
                        selectedOption={libSex.find(sex => sex.id === field.value)?.id || null}
                        onChange={(selected) => {
                            field.onChange(selected); // usually enough if you don't need manual form.setValue
                        }}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
          </div>
          <div className="p-2 md:p-1">
            <FormField
                control={control}
                name="basicInformation.civil_status_id"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Civil Status</FormLabel>
                    <FormControl>
                        <FormDropDown
                        id="civil_status_id"
                        options={libCivilStatus}
                        selectedOption={libCivilStatus.find(cs => cs.id === field.value)?.id || null}
                        onChange={(selected) => {
                            field.onChange(selected); // usually enough if you don't need manual form.setValue
                        }}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
          </div>
          <div className="p-2 md:p-1 mt-2.5">
          <FormField
            control={control}
            name="basicInformation.birthdate"
            render={({ field }) => {
              const formatted = field.value
                ? format(field.value, "yyyy-MM-dd")
                : "";

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Birth Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="date"
                            value={formatted}
                            max={format(new Date(), "yyyy-MM-dd")}
                            min="1900-01-01"
                            onChange={(e) => {
                              const date = new Date(e.target.value);
                              if (!isNaN(date.getTime())) {
                                field.onChange(date);
                              }
                            }}
                            className="pr-10 appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0"
                          />
                          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
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
              );
            }}
          />


          </div>
          <div className="p-2 md:p-1">
            <FormField
                control={control}
                name="basicInformation.age"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                        <Input  readOnly placeholder="Age" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>
          <div className="p-2 md:p-1">
              <FormField
                control={control}
                name="basicInformation.philsys_id_no"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>PhilSys ID Number</FormLabel>
                    <FormControl>
                        <Input placeholder="PhilSys ID Number" className="normal-case" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>
          <div className="p-2 md:p-1  gtabs4:col-span-3 2xl:col-span-3">
            <FormField
                control={control}
                name="basicInformation.birthplace"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Birth Place</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Birth Place" className="normal-case" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
