"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { use, useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { FormDropDown } from "@/components/forms/form-dropdown"
import { LibraryOption } from "@/components/interfaces/library-interface"
import { getOfflineLibAllotmentClass, getOfflineLibComponent, getOfflineLibExpense, getOfflineLibLevel } from "@/components/_dal/offline-options"
import { dxFetchData } from "@/components/_dal/external-apis/dxcloud"
import { FinanceService } from "@/app/(authorized)/finance/FinanceService"
import { IAllocationUacs, IMonthlyObligationPlan } from "@/db/offline/Dexie/schema/finance-service"
import FormAllocationUasc from "@/app/(authorized)/finance/budget/allocation/form/[id]/uacs/[uacsId]/page"
import { NumericFormat } from "react-number-format"
import { set, update } from "lodash"
import { formatPHP } from "@/components/utils/utils"

const formSchema = z.object({
  id: z.string(),
  allocation_uacs_id: z.string(),
  amt_jan: z.coerce.number(),
  amt_feb: z.coerce.number(),
  amt_mar: z.coerce.number(),
  amt_apr: z.coerce.number(),
  amt_may: z.coerce.number(),
  amt_jun: z.coerce.number(),
  amt_jul: z.coerce.number(),
  amt_aug: z.coerce.number(),
  amt_sep: z.coerce.number(),
  amt_oct: z.coerce.number(),
  amt_nov: z.coerce.number(),
  amt_dec: z.coerce.number(),
});

type FormValues = z.infer<typeof formSchema>
const financeService = new FinanceService();

export default function FormMonthlyObligationPlan() {
  const router = useRouter();
  const params = useParams() || undefined; // for dynamic route segments
  const searchParams = useSearchParams();
  const baseUrl = 'finance/budget/mop'

  const [record, setRecord] = useState<any>(null);
  const [uacs, setUacs] = useState<IAllocationUacs | undefined>(undefined);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const uacsId = typeof params?.uacsId === 'string' ? params.uacsId : '';
  
  let defaultValues: Partial<FormValues> = {
    id: "",
    allocation_uacs_id: uacsId || "",
    amt_jan: 0,
    amt_feb: 0,
    amt_mar: 0,
    amt_apr: 0,
    amt_may: 0,
    amt_jun: 0,
    amt_jul: 0,
    amt_aug: 0,
    amt_sep: 0,
    amt_oct: 0,
    amt_nov: 0,
    amt_dec: 0,
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  useEffect(() => {
    const fetchRecord = async () => {
      if(!uacsId) return;

      try{
        const fetchedRecord = await financeService.getOfflineMOPByUACSId(uacsId) as IMonthlyObligationPlan;
        const fetchedUACSRecord = await financeService.getOfflineAllocationUacsById(uacsId) as IAllocationUacs;
        if(fetchedUACSRecord != null || fetchedUACSRecord != undefined){
          defaultValues.allocation_uacs_id = fetchedUACSRecord.id;
          setUacs(fetchedUACSRecord);
        }
        setRecord(fetchedRecord);
        form.reset(fetchedRecord as any);
      }catch(error){
        console.error('Failed to fetch allocation UACS', error);
      }
    };

    fetchRecord();
  }, [uacsId]);

  useEffect(() => {
    if(uacs){
      setGrandTotal(uacs.allocation_amount);
    }
  }), [uacs];

  function onSubmit(data: FormValues){
    if(validateAmount != grandTotal){
      toast({
          variant:"destructive",
          title: "Error.",
          description:"The Monthly Obligation Plan must not exceed the Allocation Amount!"
        })
      return;
    }

    financeService.saveOfflineMOP(data).then((response:any) => {
      if(response){
        // router.push(`/${baseUrl}/`);
        toast({
          variant:"green",
          title: "Success.",
          description:"Form submitted successfully!"
        })
      }
    });
  }

  //UI RENDERER (NOT YET SURE IF WE FULLY IMPLEMENT THIS)
  const validateAmount = useWatch({
    control: form.control,
    name: [
      "amt_jan",
      "amt_feb",
      "amt_mar",
      "amt_apr",
      "amt_may",
      "amt_jun",
      "amt_jul",
      "amt_aug",
      "amt_sep",
      "amt_oct",
      "amt_nov",
      "amt_dec"
    ]
  }).reduce((acc, value) => acc + (value || 0), 0);


  return (
    <div className="container mx-auto">
      <fieldset disabled={true}>
        <FormAllocationUasc/>
      </fieldset>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1 py-5">
        <Card className="max-w-full">
          <CardHeader className="relative">
            <CardDescription>Total Allocated Plan Amount</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {formatPHP(validateAmount)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Card className="max-w-full mx-auto">
          <CardHeader>
            <CardTitle>Monthly Obligation Plan</CardTitle>
            <CardDescription>Enter or update Monthly Obligation Plan.</CardDescription>
          </CardHeader>
          <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-1">
                  <FormField
                      control={form.control}
                      name="amt_jan"
                      render={({ field }) => {
                        const { onChange, value, ref, ...restField } = field;
      
                        return (
                          <FormItem>
                            <FormLabel>January</FormLabel>
                            <FormControl>
                              <NumericFormat
                                {...restField}
                                id="amt_jan"
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
                  <FormField
                      control={form.control}
                      name="amt_feb"
                      render={({ field }) => {
                        const { onChange, value, ref, ...restField } = field;
      
                        return (
                          <FormItem>
                            <FormLabel>February</FormLabel>
                            <FormControl>
                              <NumericFormat
                                {...restField}
                                id="amt_feb"
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
                  <FormField
                      control={form.control}
                      name="amt_mar"
                      render={({ field }) => {
                        const { onChange, value, ref, ...restField } = field;
      
                        return (
                          <FormItem>
                            <FormLabel>March</FormLabel>
                            <FormControl>
                              <NumericFormat
                                {...restField}
                                id="amt_mar"
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
                 <FormField
                      control={form.control}
                      name="amt_apr"
                      render={({ field }) => {
                        const { onChange, value, ref, ...restField } = field;
      
                        return (
                          <FormItem>
                            <FormLabel>April</FormLabel>
                            <FormControl>
                              <NumericFormat
                                {...restField}
                                id="amt_apr"
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
                  <FormField
                      control={form.control}
                      name="amt_may"
                      render={({ field }) => {
                        const { onChange, value, ref, ...restField } = field;
      
                        return (
                          <FormItem>
                            <FormLabel>May</FormLabel>
                            <FormControl>
                              <NumericFormat
                                {...restField}
                                id="amt_may"
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
                  <FormField
                      control={form.control}
                      name="amt_jun"
                      render={({ field }) => {
                        const { onChange, value, ref, ...restField } = field;
      
                        return (
                          <FormItem>
                            <FormLabel>June</FormLabel>
                            <FormControl>
                              <NumericFormat
                                {...restField}
                                id="amt_jun"
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
                  <FormField
                      control={form.control}
                      name="amt_jul"
                      render={({ field }) => {
                        const { onChange, value, ref, ...restField } = field;
      
                        return (
                          <FormItem>
                            <FormLabel>July</FormLabel>
                            <FormControl>
                              <NumericFormat
                                {...restField}
                                id="amt_jul"
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
                  <FormField
                      control={form.control}
                      name="amt_aug"
                      render={({ field }) => {
                        const { onChange, value, ref, ...restField } = field;
      
                        return (
                          <FormItem>
                            <FormLabel>August</FormLabel>
                            <FormControl>
                              <NumericFormat
                                {...restField}
                                id="amt_aug"
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
                  <FormField
                      control={form.control}
                      name="amt_sep"
                      render={({ field }) => {
                        const { onChange, value, ref, ...restField } = field;
      
                        return (
                          <FormItem>
                            <FormLabel>September</FormLabel>
                            <FormControl>
                              <NumericFormat
                                {...restField}
                                id="amt_sep"
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
                  <FormField
                      control={form.control}
                      name="amt_oct"
                      render={({ field }) => {
                        const { onChange, value, ref, ...restField } = field;
      
                        return (
                          <FormItem>
                            <FormLabel>October</FormLabel>
                            <FormControl>
                              <NumericFormat
                                {...restField}
                                id="amt_oct"
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
                 <FormField
                      control={form.control}
                      name="amt_nov"
                      render={({ field }) => {
                        const { onChange, value, ref, ...restField } = field;
      
                        return (
                          <FormItem>
                            <FormLabel>November</FormLabel>
                            <FormControl>
                              <NumericFormat
                                {...restField}
                                id="amt_nov"
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
                  <FormField
                      control={form.control}
                      name="amt_dec"
                      render={({ field }) => {
                        const { onChange, value, ref, ...restField } = field;
      
                        return (
                          <FormItem>
                            <FormLabel>December</FormLabel>
                            <FormControl>
                              <NumericFormat
                                {...restField}
                                id="amt_dec"
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
                <Button variant="outline" type="button" onClick={() => router.push(`/${baseUrl}/`)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
