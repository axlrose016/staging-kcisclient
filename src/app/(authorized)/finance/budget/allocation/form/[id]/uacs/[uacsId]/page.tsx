"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { FormDropDown } from "@/components/forms/form-dropdown"
import { LibraryOption } from "@/components/interfaces/library-interface"
import { getOfflineLibAllotmentClass, getOfflineLibComponent, getOfflineLibExpense, getOfflineLibLevel } from "@/components/_dal/offline-options"
import { dxFetchData } from "@/components/_dal/external-apis/dxcloud"
import { FinanceService } from "@/app/(authorized)/finance/FinanceService"
import { IAllocationUacs } from "@/db/offline/Dexie/schema/finance-service"
import { NumericFormat } from 'react-number-format';

type FormAllocationUascProps = {
  _id?: string | null;
};

const formSchema = z.object({
  id: z.string(),
  allocation_id: z.string(),
  allotment_class_id: z.coerce.number().int().positive("Classification is required"),
  component_id: z.coerce.number().int().positive("Component is required"),
  expense_id: z.coerce.number().int().positive("Expense is required"),
  allocation_amount: z.preprocess(
  (val) => (val === '' || val == null ? undefined : Number(val)),
  z
    .number({
      required_error: "Allocation Amount is required",
      invalid_type_error: "Allocation Amount must be a number",
    })
    .positive("Allocation Amount must be greater than 0")
  ),
});

type FormValues = z.infer<typeof formSchema>
const financeService = new FinanceService();

export default function FormAllocationUasc({ _id }: FormAllocationUascProps) {
  const router = useRouter();
  const params = useParams() || undefined; // for dynamic route segments
  const searchParams = useSearchParams();
  const baseUrl = 'finance/budget/allocation'
  const [record, setRecord] = useState<any>(null);
  const [uacs, setUacs] = useState<any>(null);
  const [region, setRegion] = useState<LibraryOption[]>([]);
  const [allotmentClass, setAllotmentClass] = useState<LibraryOption[]>([]);
  const [expense, setExpense] = useState<LibraryOption[]>([]);

  const uacsId = typeof params?.uacsId === 'string' ? params.uacsId : '';
  const id = typeof params?.id === 'string' ? params.id : '';

  useEffect(() => {
    async function fetchLibrary(){
      await dxFetchData("regions", "/api-libs/psgc/regions", data => {
        const regionOptions = data.map((item: any) => ({
          id: item.code,
          name: item.name,
        }));
        setRegion(regionOptions);
      });

      const lib_allotment_class = await getOfflineLibAllotmentClass();
      setAllotmentClass(lib_allotment_class);
      const lib_expense = await getOfflineLibExpense();
      setExpense(lib_expense);
    }
    fetchLibrary();
  }, [])

  // Default values for the form (could come from API for editing)
  let defaultValues: Partial<FormValues> = {
    id: "",
    allocation_id: id || '', 
    allotment_class_id: 0,
    component_id: 0,
    expense_id: 0,
    allocation_amount: 0,
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  useEffect(() => {
  const fetchRecord = async () => {

    if (!uacsId && !_id) return;

    try {
        const finId = uacsId !== "" ? uacsId : _id;
        const fetchedRecord = await financeService.getOfflineAllocationUacsById(finId) as IAllocationUacs;
        setRecord(fetchedRecord);
        form.reset(fetchedRecord as any); // ✅ Apply fetched record to form
    } catch (error) {
      console.error("Failed to fetch allocation UACS:", error);
    }
  };

  fetchRecord();
  }, [uacsId,_id]);

  useEffect(() => {
    if(!id) return;
    form.setValue('allocation_id', id);
  }, [id]);

  function onSubmit(data: FormValues) {
    financeService.saveOfflineAllocationUacs(data).then((response:any) => {
      if (response) {
        router.push(`/${baseUrl}/form/${id}`);
        toast({
            variant: "green",
            title: "Success.",
            description: "Form submitted successfully!",
          })
      }
    });
  }
  // const values = form.watch();

  return (
    <div className="container mx-auto">
      <Card className="max-w-full mx-auto">
        <CardHeader>
          <CardTitle>UACS</CardTitle>
          <CardDescription>Enter or update UACS details.</CardDescription>
        </CardHeader>
        <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
            <fieldset disabled={false}>
              <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                      control={form.control}
                      name="allotment_class_id"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Allotment Class</FormLabel>
                          <FormControl>
                              <FormDropDown
                              id="allotment_class_id"
                              options={allotmentClass}
                              selectedOption={allotmentClass.find(r => r.id === field.value)?.id || null}
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
                    name="component_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Component</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(val) => field.onChange(Number(val))}
                            value={field.value?.toString()}
                            defaultValue={field.value?.toString()}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a component" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                      control={form.control}
                      name="expense_id"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Expense Title</FormLabel>
                          <FormControl>
                              <FormDropDown
                              id="expense_id"
                              options={expense}
                              selectedOption={expense.find(r => r.id === field.value)?.id || null}
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
                name="allocation_amount"
                render={({ field }) => {
                  const { onChange, value, ref, ...restField } = field;

                  return (
                    <FormItem>
                      <FormLabel>Allocation Amount</FormLabel>
                      <FormControl>
                        <NumericFormat
                          {...restField}
                          id="allocation_amount"
                          customInput={Input}
                          thousandSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                          allowNegative={false}
                          prefix="₱"
                          placeholder="₱0.00"
                          value={value === undefined || value === null ? '' : value.toString()}
                          onValueChange={(values) => {
                            onChange(values.floatValue ?? 0);
                          }}
                          getInputRef={ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => router.push(`/${baseUrl}/form/${id}`)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </CardFooter>
            </fieldset>
          </form>
        </Form>
        </CardContent>
      </Card>
    </div>
  )
}
