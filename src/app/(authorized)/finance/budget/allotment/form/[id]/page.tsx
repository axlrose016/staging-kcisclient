"use client"

import React, { useEffect, useState } from 'react'
import FormAllocation from '../../../allocation/form/[id]/page'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FinanceService } from '@/components/services/FinanceService'
import { toast } from '@/hooks/use-toast'
import { IAllocation, IAllocationUacs, IAllotment } from '@/db/offline/Dexie/schema/finance-service'
import FormAllocationUasc from '../../../allocation/form/[id]/uacs/[uacsId]/page'
import { NumericFormat } from 'react-number-format'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { FormDropDownWithInput } from '@/components/forms/form-dropdown-with-input'
import { LibraryOption } from '@/components/interfaces/library-interface'
import { getOfflineAllotments } from '@/components/_dal/finance/finance-options'
import { AppTable } from '@/components/app-table'
import { PushStatusBadge } from '@/components/general/push-status-badge'
import { Checkbox } from '@/components/ui/checkbox'


const formSchema = z.object({
    id: z.string(),
    allocation_uacs_id: z.string(),
    allotment_manual_id: z.string().min(1, "Allotment ID is required!"),
    purpose: z.string().min(1, "Purpose is required!"),
    date_alloted:z.date().nullable().optional().transform((val) => (val ? val.toISOString() : null)),
    alloted_amount: z.preprocess(
    (val) => (val === '' || val == null ? undefined : Number(val)),
    z
        .number({
        required_error: "Alloted Amount is required",
        invalid_type_error: "Allocation Amount must be a number",
        })
        .positive("Allocation Amount must be greater than 0")
    ),
});

type FormValues = z.infer<typeof formSchema>
const financeService = new FinanceService();

function FormAllotment() {
    const baseUrl = 'finance/budget/allotment'
    const router = useRouter();
    const params = useParams() || undefined; // for dynamic route segments
    const id = typeof params?.id === 'string' ? params.id : '';
    const searchParams = useSearchParams();
    const uacsId = searchParams?.get("uacsId");
    const [allotmentIds, setAllotmentId] = useState<LibraryOption[]>([]);
    const [data, setData] = React.useState([]);
    const [record, setRecord] = useState<any>(null);
    // const [selectedUacs, setSelectedUacs] = useState<IAllocationUacs[]>([]);

    let defaultValues: Partial<FormValues> = {
        id: "",
        allocation_uacs_id: uacsId ?? "",
        allotment_manual_id: "",
        alloted_amount: 0,
        purpose: "",
        date_alloted:null,
    }

    const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
        defaultValues,
    })

    const fetchUacs = async () => {
        const data = await financeService.getOfflineAllocationsForAllotment(id) as any;
        setData(data);
    }

    useEffect(() => {
        async function fetchAllotments(){
            const allotments = await getOfflineAllotments();
            setAllotmentId(allotments);
            fetchUacs();
        }
        fetchAllotments();
    }, [])

    const fetchRecord = async (_id:string) => {
        if(!_id) return;
        try{
            const fetchedRecord = await financeService.getOfflineAllotmentById(_id) as IAllotment;
            if(fetchedRecord !== undefined){
                debugger;
                if(fetchedRecord.id !== id){
                    fetchedRecord.allocation_uacs_id = uacsId ?? "";
                    fetchedRecord.id = "";
                }
                setRecord(fetchedRecord);
                form.reset(fetchedRecord as any); 
            }
        } catch (error) {
            console.error("Failed to fetch position item:", error);
        }
    }

    useEffect(() => {
        fetchRecord(id);
    }, [id])

    const handleOnCancel = () => {
        if(id !== "0"){
            defaultValues.id = id;
        }
        form.reset({
        ...defaultValues,
        });
    };

    async function onSubmit(data: FormValues) {
        financeService.saveOfflineAllotment(data).then((response:any) => {
        if (response) {
            toast({
                variant: "green",
                title: "Success.",
                description: "Form submitted successfully!",
            })
            router.push(`/${baseUrl}/form/${response.id}?uacsId=${uacsId}`)
        }});
    }

    const { watch } = form;
    const allValues = watch(); // returns an object of all form values

    const allotmentManualId = watch("allotment_manual_id");

    useEffect(() => {
    if (allotmentManualId) {
        fetchRecord(allotmentManualId); // only fetch when value changes
    }
    }, [allotmentManualId]);

    const columnsMasterlist = [
          {
              id: 'selected',
              header: 'Selected',
              accessorKey: 'allotment_id',
              filterType: 'boolean',
              filterOptions: ['Selected', 'Not Selected'],
              sortable: true,
              align: "center",
              cell: (value: any) => <Checkbox checked={value === id} disabled/>
          },
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
              id: 'region',
              header: 'Region',
              accessorKey: 'region_code',
              filterType: 'text',
              sortable: true,
              align: "left",
              cell: null,
          },
          {
              id: 'modality name',
              header: 'Modality',
              accessorKey: 'modality_name',
              filterType: 'text',
              sortable: true,
              align: "left",
              cell: null,
          },
          {
              id: 'budget year description',
              header: 'Budget Year',
              accessorKey: 'budget_year_description',
              filterType: 'text',
              sortable: true,
              align: "right",
              cell: null,
          },
          {
              id: 'appropriation source description',
              header: 'Appropriation Source',
              accessorKey: 'appropriation_source_description',
              filterType: 'text',
              sortable: true,
              align: "left",
              cell: null,
          },
          {
              id: 'appropration type description',
              header: 'Appropriation Type',
              accessorKey: 'appropriation_type_description',
              filterType: 'text',
              sortable: true,
              align: "left",
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
              header: 'Amount',
              accessorKey: 'allocation_amount',
              filterType: 'number',
              sortable: true,
              align: "right",
              cell: null,
          },
        ];

    const handleOnSelectUacs = async (row: any) => {
        debugger;
        if(id != "0" && id != undefined){
            const uacs = await financeService.getOfflineAllocationUacsById(row.uacs_id) as IAllocationUacs;
            if(!uacs){return;}

            uacs.allotment_id = uacs.allotment_id === id ? "" : id;
            financeService.saveOfflineAllocationUacs(uacs);
            fetchUacs();
        }else{
            form.handleSubmit(async (data) => {
                await onSubmit(data);
            })();
        }
    }

    return (
    <div className="container mx-auto">
        <Card className="max-w-full mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                <CardTitle>Allotment Received</CardTitle>
                <CardDescription>Enter or update Allotment Received details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                        <FormField
                            control={form.control}
                            name="allotment_manual_id"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Allotment ID</FormLabel>
                                <FormControl>
                                <FormDropDownWithInput
                                    id="allotment_manual_id"
                                    options={allotmentIds}
                                    selectedOption={field.value}
                                    onChange={(selected) => {
                                        fetchRecord(selected as string);
                                        field.onChange(selected);
                                    }}
                                    onCancel={handleOnCancel}
                                    placeholder="Select Allotment ID or Enter Manually..."
                                    allowCustomInput={true}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        {/* <FormField
                            control={form.control}
                            name="allotment_manual_id"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Allotment ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Allotment ID" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                        <FormField
                            control={form.control}
                            name="date_alloted"
                            render={({ field }) => (
                                <FormItem className="flex flex-col py-2.5">
                                <FormLabel>Date Alloted</FormLabel>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                        <FormField
                            control={form.control}
                        name="alloted_amount"
                        render={({ field }) => {
                        const { onChange, value, ref, ...restField } = field;
        
                        return (
                            <FormItem>
                            <FormLabel>Allotment Amount</FormLabel>
                            <FormControl>
                                <NumericFormat
                                {...restField}
                                id="alloted_amount"
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
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 p-4">
                        <FormField
                        control={form.control}
                        name="purpose"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Purpose</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter Purpose" {...field}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={() => router.push(`/${baseUrl}/`)}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </CardFooter>
                </form>
            </Form>
             {/* <div className="p-6 bg-muted/20">
                <pre>{JSON.stringify(selectedUacs, null, 2)}</pre>
                <AppTable
                    data={data}
                    columns={columnsMasterlist}
                    onRowClick={handleOnSelectUacs}
            />
            </div> */}
        </Card>
        <div className='py-5'>
            <fieldset disabled={true}>
                <FormAllocationUasc _id={uacsId}/>
            </fieldset>
        </div>
    </div>
  )
}

export default FormAllotment
