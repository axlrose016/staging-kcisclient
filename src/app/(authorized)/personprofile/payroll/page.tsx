"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Building2, Users } from 'lucide-react';
import { AppTable } from '@/components/app-table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import { ICFWPayroll } from '@/components/interfaces/cfw-payroll';

import { v3 as uuidv3 } from 'uuid';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const ModuleKey = 'kcis-payroll';//dont chnage

const session = await getSession() as SessionPayload;

// Internal lookup maps
const stringToUUIDMap: Record<string, string> = {};
const uuidToStringMap: Record<string, string> = {};

// Function to convert and store mapping
function encodeUUID(input: string): string {
    const uuid = uuidv3(input, ModuleKey);
    stringToUUIDMap[input] = uuid;
    uuidToStringMap[uuid] = input;
    return uuid;
}

// Simulate "reverse lookup"
function decodeUUID(uuid: string): string | undefined {
    return uuidToStringMap[uuid];
}

const baseUrl = 'personprofile/payroll'

const columns = [
    {
        id: 'date_cover_from',
        header: 'Date Cover',
        accessorKey: 'period_cover_from',
        filterType: 'text',
        sortable: true,
        cell: (value: Date | undefined) => {
            if (value) {
                return formatInTimeZone(value, 'UTC', 'MM-dd-yyyy');
            }
            return "-";
        },
    },
    {
        id: 'date_cover_to',
        header: 'Date Cover To',
        accessorKey: 'period_cover_to',
        filterType: 'text',
        sortable: true,
        cell: (value: Date | undefined) => {
            if (value) {
                return formatInTimeZone(value, 'UTC', 'MM-dd-yyyy');
            }
            return "-";
        },
    },
    {
        id: 'mov_path',
        header: 'MOV',
        accessorKey: 'mov_path',
        filterType: 'text',
        sortable: true,
        cell: (value: any) => value == "" ? "No Attachments" : "Link"
    },
    {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        filterType: 'select',
        filterOptions: ['Created', 'On-Going', 'Released'],
        sortable: true,
        cell: (value: any) => <Badge variant={value == "Released" ? "green" :
            value == "On-Going" ? "warning" :
                value == "Cancelled" ? "destructive" : "default"}>{value}</Badge>
    },
    {
        id: 'last_modified_date',
        header: 'Last Update',
        accessorKey: 'last_modified_date',
        filterType: 'text',
        sortable: true,
    },
];


export default function PayrollPage() {

    const router = useRouter();
    const [data, setData] = useState<ICFWPayroll[] | any[]>([]);

    useEffect(() => {
        (async () => {
            try {
                if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            const data = await dexieDb.cfwpayroll_bene.toArray()
            const groupedData = data.reduce((acc: any[], curr) => {
                const existingGroup = acc.find(group =>
                    group.period_cover_from.getTime() === new Date(curr.period_cover_from).getTime() &&
                    group.period_cover_to.getTime() === new Date(curr.period_cover_to).getTime()
                );

                if (!existingGroup) {
                    acc.push({
                        period_cover_from: new Date(curr.period_cover_from).toISOString(),
                        period_cover_to: new Date(curr.period_cover_to).toISOString()
                    });
                }
                return acc;
            }, []);
            setData(groupedData)
            console.log('payroll > data', data)
        })();
    }, [])

    const handleEdit = (row: any) => {
        (async () => {
            await dexieDb.cfwpayroll.put({
                last_modified_date: new Date().toISOString(),
                last_modified_by: session.userData.email,
                ...row
            })
            toast({
                variant: "green",
                title: "Payroll Updated",
                description: "Payroll has been updated!",
            })
        })();
    };

    const handleDelete = (row: any) => {
        console.log('Delete:', row);
    };

    const handleRowClick = (row: any) => {

        const period_cover = format(new Date(row.period_cover_from)!.toISOString(), 'yyyyMMdd') + "-" + format(new Date(row.period_cover_to)!.toISOString(), 'yyyyMMdd')
        console.log('Row clicked:', period_cover);
        router.push(`/${baseUrl}/${period_cover}`);
    };

    const handleAddNewRecord = (newRecord: any) => {
        // setData((prevData) => [...prevData, { id: String(prevData.length + 1), ...newRecord }]);
        (async () => {
            await dexieDb.cfwpayroll.put({
                id: uuidv4(),
                created_date: new Date().toISOString(),
                created_by: session.userData.email,
                ...newRecord
            })
            toast({
                variant: "green",
                title: "Payroll",
                description: "Payroll has been created!",
            })
        })();
    };

    const handleRefresh = async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData([]);
    };

    const handleClickAddNew = () => {
        console.log('handleClickAddNew')
    };


    return (

        <Card>
            <CardHeader>
                <CardTitle className="mb-2 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
                    {/* Logo Section */}
                    <div className="flex-shrink-0">
                        <Image src="/images/logos.png" width={300} height={300} alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto" />
                    </div>

                    {/* Title Section */}
                    <div className="text-lg font-semibold mt-2 md:mt-0">
                        Payroll
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>

                <div className="min-h-screen">

                    <AppTable
                        data={data}
                        columns={columns}
                        onDelete={handleDelete}
                        onRowClick={handleRowClick}
                        onRefresh={handleRefresh}
                        onAddNewRecord={handleAddNewRecord}
                        onClickAddNew={handleClickAddNew}
                        onEditRecord={handleEdit}
                    />
                </div>

            </CardContent>
        </Card>

    );
}