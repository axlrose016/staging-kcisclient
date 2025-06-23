"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { FormDropDown } from "@/components/forms/form-dropdown"
import { LibraryOption } from "@/components/interfaces/library-interface"
import { getOfflineLibAppropriationSource, getOfflineLibAppropriationType, getOfflineLibBudgetYear, getOfflineLibFundSourceOptions, getOfflineLibLevel, getOfflineLibModalityOptions } from "@/components/_dal/offline-options"
import { dxFetchData } from "@/components/_dal/external-apis/dxcloud"
import { IAllocation, IAllocationUacs } from "@/db/offline/Dexie/schema/finance-service"
import { AppTable } from "@/components/app-table"
import { FinanceService } from "../../../../../../../components/services/FinanceService"
import { formatPHP } from "@/components/utils/utils"
import { useAlert } from "@/components/general/use-alert"
import { PushStatusBadge } from "@/components/general/push-status-badge"

const formSchema = z.object({
  id: z.string(),
  date_allocation:z.date().nullable().optional().transform((val) => (val ? val.toISOString() : null)),
  region_code: z.string().min(1, "Region is required"),
  fund_source_id: z.coerce.number().int().positive("Fund Source is required"),
  modality_id: z.coerce.number().int().positive("Modality is required"),
  budget_year_id: z.coerce.number().int().positive("Budget Year is required"),
  appropriation_source_id: z.coerce.number().int().positive("Appropriation Source is required"),
  appropriation_type_id: z.coerce.number().int().positive("Appropriation Type is required"), 
});


type FormValues = z.infer<typeof formSchema>
const financeService = new FinanceService();

export default function FormAllocation() {
  const alert = useAlert()
  const router = useRouter();
  const params = useParams() || undefined; 
  const searchParams = useSearchParams();
  const baseUrl = 'finance/budget/allocation'
  const pathname = usePathname();
  // const [pageType, setPageType] = useState("");

  //   useEffect(() => {
  //     if (pathname?.includes("/allocation")) {
  //       setFormTitle("WFP Allocation")
  //       setFormDescription("Enter or update WFP Allocation details");
  //     } else if (pathname?.includes("/allotment")) {
  //       setFormTitle("Allotment Received")
  //       setFormDescription("Enter or update Allotment Received");
  //     }
  //   }, [pathname]);

  const [record, setRecord] = useState<any>(null);
  const [uacs, setUacs] = useState([]);
  const [region, setRegion] = useState<LibraryOption[]>([]);
  const [budget_year, setBudgetYear] = useState<LibraryOption[]>([]);
  const [appropriation_type, setAppropriationType] = useState<LibraryOption[]>([]);
  const [appropriation_source, setAppropriationSource] = useState<LibraryOption[]>([]);
  const [modality, setModality] = useState<LibraryOption[]>([]);
  const [fund_source, setFundSource] = useState<LibraryOption[]>([]);
  const [grandTotal, setGrandTotal] = useState("0");

  const id = typeof params?.id === 'string' ? params.id : '';
  useEffect(() => {
    async function fetchLibrary(){
      const lib_budget_year = await getOfflineLibBudgetYear(); 
      setBudgetYear(lib_budget_year);
      const lib_appropriation_source = await getOfflineLibAppropriationSource();
      setAppropriationSource(lib_appropriation_source);
      const lib_appropriation_type = await getOfflineLibAppropriationType();
      setAppropriationType(lib_appropriation_type);
      const lib_modality = await getOfflineLibModalityOptions();
      setModality(lib_modality);
      const lib_fund_source = await getOfflineLibFundSourceOptions();
      setFundSource(lib_fund_source);

      await dxFetchData("regions", "/api-libs/psgc/regions", data => {
        const regionOptions = data.map((item: any) => ({
          id: item.code,
          name: item.name,
        }));
        setRegion(regionOptions);
      });
    }
    fetchLibrary();
  }, [])

  // Default values for the form (could come from API for editing)
  let defaultValues: Partial<FormValues> = {
    id: "",
    date_allocation:null,
    region_code: "",
    fund_source_id: 0,
    modality_id: 0,
    budget_year_id: 0,
    appropriation_source_id: 0,
    appropriation_type_id: 0,
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  useEffect(() => {
  const fetchRecord = async () => {
    if (!id) return;

    try {
        const fetchedRecord = await financeService.getOfflineAllocationById(id) as IAllocation;
        setRecord(fetchedRecord);
        const fetchUacs = await financeService.getOfflineAllocationUacsByAllotmentId(id) as any;
        if(fetchUacs){
          const totalAmount = fetchUacs.reduce((sum: number, item:any) => sum + item.allocation_amount, 0);
          setGrandTotal(formatPHP(totalAmount));
        }
        setUacs(fetchUacs);
        form.reset(fetchedRecord as any); // ✅ Apply fetched record to form
    } catch (error) {
      console.error("Failed to fetch position item:", error);
    }
  };

  fetchRecord();
  }, [id,form]);

  async function onSubmit(data: FormValues, redirect?: boolean) {
    if(data.id === "" || data.id === "0"){
      const hasExist = await financeService.checkDuplicateAllocation(data);
      if (hasExist) {
        handleWarningAlert(hasExist);
        return undefined
      }
    }
    financeService.saveOfflineAllocation(data).then((response:any) => {
      if (response) {
        if(redirect){
          router.push(`/${baseUrl}/form/${response.id}/uacs/0`);
        }
        else{
          router.push(`/${baseUrl}/`);
        }
        toast({
            variant: "green",
            title: "Success.",
            description: "Form submitted successfully!",
          })
      }
    });
  }

  const handleDelete = (row: any) => {
      console.log('Delete:', row);
  };

  const handleRowClick = (row: any) => {
      router.push(`/${baseUrl}/form/${row.allocation_id}/uacs/${row.id}`);
  };

  const handleAddNewRecord = () => {
    if(id != "0" && id != undefined){
        router.push(`/${baseUrl}/form/${id}/uacs/0`);
    }else{
      form.handleSubmit(async (data) => {
          await onSubmit(data, true);
      })();
    }
  };

  const handleWarningAlert = async (data: any) => {
    const confirmed = await alert.warning(
      "Warning",
      "Uh-oh! An existing allocation with the same details has been found. Please click 'Proceed' to redirect to the existing record.",
    )
    if(confirmed){
      router.push(`/${baseUrl}/form/${data.id}`);
    }
  }

    const columnsMasterlist = [
      {
          id: 'push status id',
          header: 'Uploading Status',
          accessorKey: 'push_status_id',
          filterType: 'select',
          filterOptions: ['Unknown', 'Uploaded', 'For Upload'],
          sortable: true,
          align: "center",
          cell: (value: any) =>  <PushStatusBadge push_status_id={value} size="md" />
      },
      {
          id: 'allotment description',
          header: 'Allotment Class',
          accessorKey: 'allotment_description',
          filterType: 'text',
          sortable: true,
          align: "left",
          cell: null,
      },
      {
          id: 'component id',
          header: 'Component',
          accessorKey: 'component_id',
          filterType: 'number',
          sortable: true,
          align: "right",
          cell: null,
      },
      {
          id: 'expense description',
          header: 'Expense',
          accessorKey: 'expense_description',
          filterType: 'text',
          sortable: true,
          align: "left",
          cell: null,
      },
      {
          id: 'allocation amount',
          header: 'Allocation Amount',
          accessorKey: 'm_allocation_amount',
          filterType: 'number',
          sortable: true,
          align: "right",
          cell: null,
      },
    ];

  return (
    <div className="container mx-auto py-5">
      <Card className="max-w-full mx-auto">
        <CardHeader>
          <CardTitle>WFP Allocation</CardTitle>
          <CardDescription>Enter or update WFP Allocation details.</CardDescription>
        </CardHeader>
        <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => onSubmit(data))}>
            <fieldset disabled={false}>
              <CardContent className="space-y-6">
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                          control={form.control}
                          name="id"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>ID</FormLabel>
                              <FormControl>
                              <Input placeholder="Auto Generated ID" {...field} readOnly/>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                  </div> */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                      control={form.control}
                      name="date_allocation"
                      render={({ field }) => (
                          <FormItem className="flex flex-col">
                          <FormLabel>Date Allocation</FormLabel>
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="budget_year_id"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Budget Year</FormLabel>
                          <FormControl>
                              <FormDropDown
                              id="budget_year_id"
                              options={budget_year}
                              selectedOption={budget_year.find(r => r.id === field.value)?.id || null}
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                      control={form.control}
                      name="fund_source_id"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Fund Source</FormLabel>
                          <FormControl>
                              <FormDropDown
                              id="fund_source_id"
                              options={fund_source}
                              selectedOption={fund_source.find(r => r.id === field.value)?.id || null}
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
                      name="modality_id"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Modality</FormLabel>
                          <FormControl>
                              <FormDropDown
                              id="modality_id"
                              options={modality}
                              selectedOption={modality.find(r => r.id === field.value)?.id || null}
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
                      name="appropriation_source_id"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Appropriation Source</FormLabel>
                          <FormControl>
                              <FormDropDown
                              id="appropriation_source_id"
                              options={appropriation_source}
                              selectedOption={appropriation_source.find(r => r.id === field.value)?.id || null}
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
                      name="appropriation_type_id"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Appropriation Type</FormLabel>
                          <FormControl>
                              <FormDropDown
                              id="appropriation_type_id"
                              options={appropriation_type}
                              selectedOption={appropriation_type.find(r => r.id === field.value)?.id || null}
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
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => router.push(`/${baseUrl}/`)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </CardFooter>
            </fieldset>
          </form>
        </Form>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-1 py-5">
          <Card className="max-w-full">
            <CardHeader className="relative">
              <CardDescription>Total Allocation Amount</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {grandTotal}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        <AppTable
            data={uacs}
            columns={columnsMasterlist}
            onDelete={handleDelete}
            onRowClick={handleRowClick}
            onAddNewRecordNavigate={handleAddNewRecord}
        />
        </CardContent>
      </Card>
    </div>
  )
}
