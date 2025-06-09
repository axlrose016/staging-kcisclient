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
import { cn } from "@/lib/utils"
import { HRService } from "../../../../HRService"
import { IPositionItem, IPositionItemDistribution } from "@/db/offline/Dexie/schema/hr-service"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { FormDropDown } from "@/components/forms/form-dropdown"
import { LibraryOption } from "@/components/interfaces/library-interface"
import { getOfflineLibDivision, getOfflineLibLevel, getOfflineLibOffice } from "@/components/_dal/offline-options"
import { dxFetchData } from "@/components/_dal/external-apis/dxcloud"
import { map } from "lodash"
import { useSearchParams } from "next/dist/client/components/navigation"
import { getOfflineItemCodes } from "@/components/_dal/hr/hr-options"
import { setItem } from "localforage"
import { FormTabs } from "@/components/forms/form-tabs"
import HiringProcedures from "./hiring-procedures/page"
import ApplicantList from "./applicants/page"

const formSchema = z.object({
  id: z.string(),
  position_item_id: z.string(),
  level_id: z.coerce.number().int().positive("User Level is required"),
  region_code: z.string().min(1, "Region is required"),
  province_code: z.string().min(1, "Province is required"),
  city_code: z.string().min(1, "City is required"),
  office_id: z.coerce.number().int().positive("Office is required"),
  division_id: z.coerce.number().int().positive("Division is required"),
  parenthetical_title: z.string().min(1, "Parenthetical title is required"),
  date_distributed: z.date().nullable().optional().transform((val) => (val ? val.toISOString() : null)),
});

type FormValues = z.infer<typeof formSchema>
const hrService = new HRService();

export default function FormPositionDistribution() {
  const router = useRouter();
  const baseUrl = 'hr-development/hiring-and-deployment/item-distribution/'
  const params = useParams() || undefined; 

  const [record, setRecord] = useState<any>(null);
  const [level, setLevel] = useState<LibraryOption[]>([]);
  const [office, setOffice] = useState<LibraryOption[]>([]);
  const [division, setDivision] = useState<LibraryOption[]>([]);
  const [region, setRegion] = useState<LibraryOption[]>([]);
  const [province, setProvince] = useState<LibraryOption[]>([]);
  const [city, setCity] = useState<LibraryOption[]>([]);
  const [itemCode, setItemCode] = useState<LibraryOption[]>([]);
  const [activeTab, setActiveTab] = useState("hiring-procedures");
      
  // const searchParams = useSearchParams() || undefined;
  // const id = searchParams?.get('id');
  const id = typeof params?.id === 'string' ? params.id : '';

  // Default values for the form (could come from API for editing)
  let defaultValues: Partial<FormValues> = {
    id: "",
    position_item_id:"",
    level_id: 0,
    region_code: "",
    province_code: "",
    city_code: "",
    office_id: 0,
    division_id: 0,
    parenthetical_title: "",
    date_distributed: null,
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  useEffect(() => {
    async function fetchLibrary(){
      const lib_level = await getOfflineLibLevel(); 
      const itemCodes = await getOfflineItemCodes();
      const office = await getOfflineLibOffice();
      const division = await getOfflineLibDivision();
      await dxFetchData("regions", "/api-libs/psgc/regions", data => {
        const regionOptions = data.map((item: any) => ({
          id: item.code,
          name: item.name,
        }));
        setRegion(regionOptions);
      });
      setItemCode(itemCodes);
      setLevel(lib_level);
      setOffice(office);
      setDivision(division);
    }
    fetchLibrary();
  }, [])

  const regionCode = form.watch("region_code");
  const provinceCode = form.watch("province_code");

  useEffect(() => {
    if (regionCode) {
      form.setValue("province_code", ""); 
      form.setValue("city_code", "");
      setProvince([]); 
      const fetchData = async () => {
        await dxFetchData(
          "provinces-" + regionCode, // use dynamic key to avoid cache/stale data
          "/api-libs/psgc/provincesByRegion?region=" + regionCode,
          (data) => {
            const provinceOptions = data.provinces.map((item: any) => ({
              id: item.code,
              name: item.name,
            }));
            setProvince(provinceOptions); // ✅ set as array directly
          }
        );
      };
      fetchData();
    }
  }, [regionCode]);

  useEffect(() => {
    if (provinceCode) {
      form.setValue("city_code", ""); 
      setCity([]); 
      const fetchData = async () => {
        await dxFetchData(
          "cities-" + provinceCode, // use dynamic key to avoid cache/stale data
          "/api-libs/psgc/municipalityByProvince?province=" + provinceCode,
          (data) => {
            const cityOptions = data.municipalities.map((item: any) => ({
              id: item.code,
              name: item.name,
            }));
            setCity(cityOptions); // ✅ set as array directly
          }
        );
      };
      fetchData();
    }
  }, [provinceCode]);




  useEffect(() => {
    const fetchRecord = async () => {
      if(!id) return;

      try{
        const fetchedRecord = await hrService.getOfflinePositionDistributionById(id) as IPositionItemDistribution;
        setRecord(fetchedRecord);
        form.reset(fetchedRecord as any); 
      } catch (error) {
        console.error("Failed to fetch position distribution item:", error);
      }
    };
    fetchRecord();
  }, [id]);

  function onSubmit(data: FormValues) {
    // Perform your form submission logic here
    console.log("Form submitted:", data)
    // Here you would typically send the data to your API
    hrService.saveOfflinePositionDistribution(data).then((response:any) => {
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

  const tabs = [
    {
      value: "hiring-procedures",
      label: "Hiring Procedures",
      content: activeTab === "hiring-procedures" && (
        <div className="bg-card rounded-lg">
          <HiringProcedures
          />
        </div>
      ),
    },
    {
      value:"applicants",
      label: "Applicants",
      content: activeTab === "applicants" && (
        <div className="bg-card rounded-lg">
          <ApplicantList
          />
        </div>
      ),
    }
  ]

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-full mx-auto">
        <CardHeader>
          <CardTitle>Item Distribution Details</CardTitle>
          <CardDescription>Enter or update distribution details.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="position_item_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position Item ID</FormLabel>
                      <FormControl>
                        <FormDropDown
                          id="position_item_id"
                          options={itemCode}
                          selectedOption={itemCode.find(lvl => lvl.id === field.value)?.id || null}
                          onChange={(selected) => {
                            console.log("Level:", selected);
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
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Auto Generated ID" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="level_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <FormControl>
                        <FormDropDown
                          id="level_id"
                          options={level}
                          selectedOption={level.find(lvl => lvl.id === field.value)?.id || null}
                          onChange={(selected) => {
                            console.log("Level:", selected);
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
                  name="region_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                          <FormDropDown
                          id="region_code"
                          options={region}
                          selectedOption={region.find(r => r.id === field.value)?.id || null}
                          onChange={(selected) => {
                            field.onChange(selected); 
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="province_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <FormControl>
                          <FormDropDown
                          id="province_code"
                          options={province}
                          selectedOption={province.find(r => r.id === field.value)?.id || null}
                          onChange={(selected) => {
                            field.onChange(selected); 
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                          <FormDropDown
                          id="city_code"
                          options={city}
                          selectedOption={city.find(r => r.id === field.value)?.id || null}
                          onChange={(selected) => {
                            field.onChange(selected); 
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                  control={form.control}
                  name="office_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office</FormLabel>
                      <FormControl>
                        <FormDropDown
                          id="office_id"
                          options={office}
                          selectedOption={office.find(lvl => lvl.id === field.value)?.id || null}
                          onChange={(selected) => {
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
                  name="division_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Division/Section/Unit</FormLabel>
                      <FormControl>
                        <FormDropDown
                          id="division_id"
                          options={division}
                          selectedOption={division.find(lvl => lvl.id === field.value)?.id || null}
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

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="parenthetical_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parenthetical Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Parenthetical title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                  control={form.control}
                  name="date_distributed"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date Distributed</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
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
                  )}
                />  
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push(`/${baseUrl}/`)}>
                Cancel
              </Button>
              <Button type="submit">Save Item Distribution</Button>
            </CardFooter>
          </form>
        </Form>
        <div className="p-3 col-span-full">
          <FormTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </Card>
    </div>
  )
}
