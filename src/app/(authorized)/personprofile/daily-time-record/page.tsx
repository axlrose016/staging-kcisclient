"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { CalendarIcon, Download, Edit, Plus, Printer, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { AppTable } from '@/components/app-table';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import Image from 'next/image';

const _session = await getSession() as SessionPayload;

const baseUrl = 'personprofile/daily-time-record'

const columns = [
    {
        id: 'cfwp_id_no',
        header: 'CFW ID NO.',
        accessorKey: 'cfwp_id_no',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'first_name',
        header: 'First Name',
        accessorKey: 'first_name',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'last_name',
        header: 'Last Name',
        accessorKey: 'last_name',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'middle_name',
        header: 'Middle Name',
        accessorKey: 'middle_name',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'email',
        header: 'Email',
        accessorKey: 'email',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'school_name',
        header: 'School Name',
        accessorKey: 'school_name',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'campus',
        header: 'CAMPUS',
        accessorKey: 'campus',
        filterType: 'text',
        sortable: true,
    },
]

export default function DailyTimeRecordPage() {

    const router = useRouter();
    const [data, setData] = useState<any[]>([]);

    const getUsers = async () => {
        const results = await dexieDb.person_profile.where('modality_id')
            .equals(25).toArray()
        console.log('getUsers > results', results)
        const merged = await Promise.all(
            results.map(async (a) => {
                const b = await dexieDb.lib_school_profiles.where("id").equals(a.school_id!).first()
                if (b) {
                    return {
                        ...b,    // fields from tableB (same `id`)
                        ...a   // fields from tableA
                    };
                }
                return null;
            })
        );
        return merged
    };

    useEffect(() => {
        console.log('DTR: session', _session)
        debugger;
        if (["CFW Beneficiary", "Guest"].includes(_session?.userData?.role || "")) {
            router.push(`/${baseUrl}/${_session.id}`);
        } else {
            (async () => {
                const _session = await getSession() as SessionPayload;
                console.log('_session', _session)

                try {
                    if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open 
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
                const user = await getUsers()
                setData(user)
                console.log('getUsers', user)
            })();
        }
    }, [])

    const handleEdit = (row: any) => {
        console.log('Edit:', row);
    };

    const handleDelete = (row: any) => {
        console.log('Delete:', row);
    };

    const handleRowClick = (row: any) => {
        console.log('Row clicked:', row);
        router.push(`/${baseUrl}/${row.user_id}`);
    };

    const handleAddNewRecord = (newRecord: any) => {
        console.log('handleAddNewRecord', newRecord)
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
                        Daily Time Record
                    </div>
                </CardTitle>

            </CardHeader>
            <CardContent>

                <div className="min-h-screen">
                    <div className="min-h-screen">
                        <AppTable
                            data={data}
                            columns={columns}
                            onEditRecord={handleEdit}
                            onDelete={handleDelete}
                            onRowClick={handleRowClick}
                            onAddNewRecord={handleAddNewRecord}
                        />
                    </div>
                </div>

            </CardContent>
        </Card>

    );
}