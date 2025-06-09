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
import { FinanceService } from '@/app/(authorized)/finance/FinanceService'
import { toast } from '@/hooks/use-toast'
import { IAllocation, IAllocationUacs } from '@/db/offline/Dexie/schema/finance-service'
import FormAllocationUasc from '../../../allocation/form/[id]/uacs/[uacsId]/page'
import { NumericFormat } from 'react-number-format'


const formSchema = z.object({
    id: z.string(),
    allotment_manual_id: z.string().min(1, "Allotment ID is required!"),
    allotment_purpose: z.string().min(1, "Purpose is required!"),
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

    const [record, setRecord] = useState<any>(null);

    let defaultValues: Partial<FormValues> = {
        id: id || '',
        allotment_manual_id: "",
        allotment_purpose: "",
    }

    const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
        defaultValues,
    })

    useEffect(() => {
        const fetchRecord = async () => {
            if(!id) return;

            try{
                const fetchedRecord = await financeService.getOfflineAllocationById(id) as IAllocation;
                setRecord(fetchedRecord);
                debugger;
                form.reset(fetchedRecord as any); // ✅ Apply fetched record to form
            } catch (error) {
                console.error("Failed to fetch position item:", error);
            }
        }
        fetchRecord();
    }, [id])

    async function onSubmit(data: FormValues, redirect?: boolean) {
        debugger;
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

    // const values = form.watch();

    return (
    <div className="container mx-auto">
        <Card className="max-w-full mx-auto">
            <Form {...form}>
                {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                <form onSubmit={form.handleSubmit((data) => onSubmit(data))}>
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
                                <Input placeholder="Enter Allotment ID" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 p-4">
                        <FormField
                        control={form.control}
                        name="allotment_purpose"
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
                    <Button variant="outline" type="button" onClick={undefined}>
                    Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                </CardFooter>
                </form>
            </Form>
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
