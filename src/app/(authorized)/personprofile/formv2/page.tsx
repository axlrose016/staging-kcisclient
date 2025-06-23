"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  getOfflineCivilStatusLibraryOptions,
  getOfflineExtensionLibraryOptions,
  getOfflineLibSexOptions,
  getOfflineLibStatuses,
} from "@/components/_dal/offline-options";

import { LibraryOption } from "@/components/interfaces/library-interface";
import { GeneralInformationSection } from "@/app/(authorized)/personprofile/components/general-information-section";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactInformationSection } from "@/app/(authorized)/personprofile/components/contact-information-section";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UserCredentialsSection } from "@/app/(authorized)/personprofile/components/user-credentials-section";
import { getModules, getPermissions, getRoles } from "@/db/offline/Dexie/schema/library-service";
import { toast } from "@/hooks/use-toast";
import UsersService from "@/components/services/UsersService";
import { decryptJson, encryptJson } from "@/lib/utils";
import { FormTabs } from "@/components/forms/form-tabs";
import { lab } from "d3";
import HealthInformationSection from "../components/health-information-section";
import { EmploymentInformationSection } from "../components/employment-information-section";
import PersonProfileService from "@/components/services/PersonProfileService";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";

const basicInformationSchema = z.object({
    id: z.string(),
    first_name: z.string().min(1, "First Name is Required"),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, "Last Name is Required"),
    extension_name_id: z.coerce.number().optional(),
    display_picture: z
    .instanceof(File)
    .optional(),
    sex_id: z.coerce.number().int().positive("Sex is required"),
    civil_status_id: z.coerce.number().int().positive("Civil Status is required"),
    birthdate: z.coerce.date()
      .refine(date => date instanceof Date && !isNaN(date.getTime()), {
        message: "Birthdate is required and must be a valid date",
      })
      .transform(date => date.toISOString()),
    age: z.coerce.number().int().positive("Age is required"),
    philsys_id_no: z.string().optional(),
    birthplace: z.string().min(1, "Birth Place is Required"),
    user_id: z.string(),
});

const contactInformationSchema = z.object({
    region_code: z.string().min(1, "Region is required"),
    province_code: z.string().min(1, "Province is required"),
    city_code: z.string().min(1, "City is required"),
    brgy_code: z.string().min(1, "Barangay is required"),
    sitio: z.string().min(1, "Sitio is required"),
    region_code_present_address:z.string().min(1, "Present Region is required"),
    province_code_present_address:z.string().min(1, "Present Province is required"),
    city_code_present_address:z.string().min(1, "Present City is required"),
    brgy_code_present_address: z.string().min(1, "Present Barangay is required"),
    is_permanent_same_as_current_address: z.boolean().optional(),
    sitio_present_address: z.string().min(1, "Sitio is required"),
    cellphone_no: z.string().min(1, "Cellphone Number is required"),
    cellphone_no_secondary: z.string().optional(),
    email: z.string().min(1, "Email is required")
});

const healthInformationSchema = z.object({
  has_immediate_health_concern: z.boolean().optional(),
  immediate_health_concern: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.has_immediate_health_concern && !data.immediate_health_concern) {
    ctx.addIssue({
      path: ['immediate_health_concern'],
      code: z.ZodIssueCode.custom,
      message: 'Immediate health concern is required if do you have immediate health concern.',
    });
  }
});

const employmentInformationSchema = z.object({
  hasoccupation: z.boolean().optional(),
  current_occupation: z.string().optional(),
  id_card: z.coerce.number().int().positive("ID Card is required"),  
}).superRefine((data, ctx) => {
  if (data.hasoccupation) {
    ctx.addIssue({
      path: ['current_occupation'],
      code: z.ZodIssueCode.custom,
      message: 'Current occupation is required if you have a current occupation.',
    });
  }
});

const personProfileSchema = z.object({
  basicInformation: basicInformationSchema,
  contactInformation: contactInformationSchema,
  healthInformation: healthInformationSchema,
  employmentInformation: employmentInformationSchema,
});

export type FormValues = z.infer<typeof personProfileSchema>;
const _session = await getSession() as SessionPayload;

export default function PersonProfileForm() {
  const [libExt, setLibExt] = useState<LibraryOption[]>([]);
  const [libSex, setLibSex] = useState<LibraryOption[]>([]);
  const [libStatuses, setLibStatuses] = useState<LibraryOption[]>([]);
  const [libCivilStatus, setLibCivilStatus] = useState<LibraryOption[]>([]);
  const [displayPic, setDisplayPic] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("contact-details");
  const router = useRouter();
  useEffect(() => {
    async function fetchLibrary() {
      const lib_ext = await getOfflineExtensionLibraryOptions();
      const lib_sex = await getOfflineLibSexOptions();
      const lib_civil_status = await getOfflineCivilStatusLibraryOptions();
      const lib_statuses = (await getOfflineLibStatuses()).filter((status) =>
        [21, 22].includes(status.id)
      );
      setLibExt(lib_ext);
      setLibSex(lib_sex);
      setLibCivilStatus(lib_civil_status);
      setLibStatuses(lib_statuses);
    }
    async function fetchProfile() {
  try {
    const userId = _session?.id;
    if (!userId) {
      console.warn("User ID is missing in session.");
      return;
    }

    const userProfile = await PersonProfileService.getPersonProfileById(userId);
    if (userProfile) {
      methods.reset({
        basicInformation: {
          id: userProfile.id || "",
          first_name: await decryptJson(userProfile.first_name) ?? "",
          middle_name: await decryptJson(userProfile.middle_name) ?? "",
          last_name: await decryptJson(userProfile.last_name) ?? "",
          extension_name_id: userProfile.extension_name_id,
          sex_id: userProfile.sex_id,
          civil_status_id: userProfile.civil_status_id,
          birthdate: await decryptJson(userProfile.birthdate) ?? undefined,
          age: userProfile.age ?? 0,
          philsys_id_no: userProfile.philsys_id_no || "",
          birthplace: await decryptJson(userProfile.birthplace) ?? "",
          user_id: userProfile.user_id || "",
        },
        contactInformation: {
          region_code: userProfile.region_code || "",
          province_code: userProfile.province_code || "",
          city_code: userProfile.city_code || "",
          brgy_code: userProfile.brgy_code || "",
          sitio: await decryptJson(userProfile.sitio!) ?? "",
          is_permanent_same_as_current_address: userProfile.is_permanent_same_as_current_address ?? false,
          region_code_present_address: userProfile.region_code_present_address || "",
          province_code_present_address: userProfile.province_code_present_address || "",
          city_code_present_address: userProfile.city_code_present_address || "",
          brgy_code_present_address: userProfile.brgy_code_present_address || "",
          sitio_present_address: await decryptJson(userProfile.sitio_present_address!) ?? "",
          cellphone_no: await decryptJson(userProfile.cellphone_no!) ?? "",
          cellphone_no_secondary: await decryptJson(userProfile.cellphone_no_secondary!) ?? "",
          email: userProfile.email || ""
        }
      });
    } else {
      console.warn("No profile found for user.");
    }
  } catch (error) {
    console.error("Failed to fetch profile:", error);
  }
}

    fetchLibrary();
    fetchProfile();
  }, []);

  const methods = useForm<FormValues>({
    resolver: zodResolver(personProfileSchema),
    defaultValues: {
      basicInformation: {
        id:"",
        first_name: "",
        middle_name: "",
        last_name: "",
        extension_name_id: undefined,
        display_picture: undefined,
        sex_id: undefined,
        civil_status_id: undefined,
        birthdate: undefined,
        age: 0,
        philsys_id_no: "",
        birthplace: "",
        user_id: "",
      },
      contactInformation: {
        region_code: "",
        province_code: "",
        city_code: "",
        brgy_code: "",
        sitio: "",
        is_permanent_same_as_current_address: false,
        region_code_present_address: "",
        province_code_present_address: "",
        city_code_present_address: "",
        brgy_code_present_address: "",
        sitio_present_address: "",
        cellphone_no: "",
        cellphone_no_secondary: "",
        email: ""
      },
      healthInformation: {
        has_immediate_health_concern: false,
        immediate_health_concern: "",
      },
      employmentInformation: {
        hasoccupation: false,
        current_occupation: "",
        id_card: undefined,
      },
    },
  });

  const onSubmit = async (data: FormValues) => {
    const securedData = {
      ...data,
    }
    debugger;
    UsersService.saveUser(securedData).then((response:any) => {
      if(response){
        router.push('/login');
        toast({
            variant: "green",
            title: "Success.",
            description: "Form submitted successfully!",
          })
      }
    })
  };
  const tabs = [
    {
      value: "contact-details",
      label: "Contact Information",
      content: activeTab === "contact-details" && (
        <div className="bg-card rounded-lg">
          <ContactInformationSection/>
        </div>
      ),
    },
    {
      value: "health-details",
      label: "Health Information",
      content: activeTab === "health-details" && (
        <div className="bg-card rounded-lg">
          <HealthInformationSection/>
        </div>
      ),
    },
    {
      value: "employment-details",
      label: "Employment Information",
      content: activeTab === "employment-details" && (
        <div className="bg-card rounded-lg">
          <EmploymentInformationSection/>
        </div>
      ),
    }
  ]

  return (
        <Card className="max-w-full mx-auto">
           <CardHeader>
          <CardTitle className="mb-2 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <img src="/images/logos.png" alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto" />
            </div>

            {/* Title Section */}
            <div className="text-lg font-semibold mt-2 md:mt-0">
              Profile Form <span className="text-blue-800"> </span>
            </div>
          </CardTitle>
          <CardDescription>
            <div className={`p-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm `}>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Important Instructions</h2>
              {/* <Button onClick={handleUpload} >Upload</Button> */}
              <p className="text-gray-700 mb-4">
                Please read and understand the following before proceeding:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>
                  By submitting this form, you agree to the collection, use, and processing of your personal data in accordance with our{" "}
                  <span className="text-indigo-600 underline cursor-pointer">
                    Data Privacy Statement
                  </span>.
                </li>
                <li>
                  Submitting this form does <span className="font-bold">not guarantee</span> acceptance into any program or service. All submissions are subject to review and approval.
                </li>
                <li>
                  Ensure that all fields are accurately completed. Incomplete or incorrect information may result in disqualification.
                </li>
                <li>
                  Utilize special characters, such as ñ and Ñ, where appropriate.
                </li>
              </ul>

            </div>

            {/* It displays essential details about an individual, including their name, photo, role, contact info, and other related information.</CardDescription> */}
          </CardDescription>
        </CardHeader>
        <FormProvider {...methods}>
          {/* {JSON.stringify(methods.watch(), null, 2)} */}
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <GeneralInformationSection
              displayPic={displayPic}
              setDisplayPic={setDisplayPic}
              libExt={libExt}
              libSex={libSex}
              libCivilStatus={libCivilStatus}
            />
            <div className="p-3 col-span-full">
              <FormTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push(`/login`)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </CardFooter>
          </form>
        </FormProvider>

      </Card>
  );
}
