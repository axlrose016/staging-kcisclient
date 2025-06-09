"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import { CalendarIcon, Download, Edit, Plus, Printer, Trash2, UserCheck2Icon, UserRoundCheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppTable } from '@/components/app-table';
import { SessionPayload } from '@/types/globals';
import { getSession } from '@/lib/sessions-client';
import Image from 'next/image';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { ICFWPayroll, ICFWPayrollBene } from '@/components/interfaces/cfw-payroll';
import { IPersonProfile } from '@/components/interfaces/personprofile';
import { v5 as uuidv5 } from 'uuid';
import { Badge } from '@/components/ui/badge';
import { ILibSchoolProfiles, ILibStatuses } from '@/components/interfaces/library-interface';

const KeyToken = process.env.NEXT_PUBLIC_DXCLOUD_KEY;
const session = await getSession() as SessionPayload;

export const initialData = [
    {
        id: 'SF-123678',
        date_cover: 'Jan 1-15, 2024',
        total_hours: 80,
        status: 'Completed'
    },
    {
        id: 'SF-12234',
        date_cover: 'Jan 16-31, 2024',
        total_hours: 88,
        status: 'Completed'
    },
    {
        id: 'SF-23478',
        date_cover: 'Feb 1-15, 2024',
        total_hours: 72,
        status: 'Pending'
    }
];


const baseUrl = 'personprofile/payroll'

type IUser = ICFWPayrollBene & IPersonProfile & { no_hours: number, rate: number, amount: number };

export default function PayrollUserList() {

    const params = useParams<{ 'payroll-list': string; id: string }>()
    console.log('params', params)

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
                {["Guest", "CFW Beneficiary"].includes(session!.userData!.role!) && <PayrollBene />}
                {!["Guest", "CFW Beneficiary"].includes(session!.userData!.role!) && <PayrollAdmin />}
            </CardContent>
        </Card>

    );
}


function PayrollAdmin() {

    const router = useRouter();
    const params = useParams<{ 'payroll-list': string; id: string }>()
    const [payroll, setPayrollData] = useState<ICFWPayroll>()
    const [data, setPayrollBeneData] = useState<IUser[] | any[]>([])
    const [cfwSubmissions, setCfwSubmission] = useState<any[]>()
    const [libstatus, setOptionStatus] = useState<ILibStatuses[]>()

    const [regions, setRegions] = useState<any[]>()
    // const [prov, setProv] = useState<any[]>()
    // const [muni, setMuni] = useState<any[]>()

    const [period_cover_from, period_cover_to] = params?.['payroll-list']!.split('-').map(dateStr => {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return new Date(`${year}-${month}-${day}`);
    });

    // console.log('params!.list!', { period_cover_from, period_cover_to }) 
    useEffect(() => {
        (async () => {
            setOptionStatus(await dexieDb.lib_statuses.toArray());

            const response = await fetch("/api-libs/psgc/regions", {
                headers: {
                    Authorization: `Bearer ${KeyToken}`,
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            if (data?.status) {
                setRegions(data.data)
                // console.log('regions > data', data)
            }
        })();
    }, []);


    useEffect(() => {
        (async () => {
            const p = await dexieDb.cfwpayroll.where("id").equals(params!['payroll-list']!).first()
            setPayrollData(p)

            const pbd = await dexieDb.cfwpayroll_bene
                .where("period_cover_from")
                .between(
                    new Date(period_cover_from.setHours(0, 0, 0, 0)),
                    new Date(period_cover_to.setHours(23, 59, 59, 999))
                )
                .toArray()
                .then(async (payrollRecords) => {
                    const mergedRecords = await Promise.all(
                        payrollRecords.map(async (record) => {
                            const personProfile = await dexieDb.person_profile
                                .where("id")
                                .equals(record.bene_id)
                                .first();

                            const period_cover = format(period_cover_from!.toISOString(), 'MMM dd') + "-" + format(period_cover_to!.toISOString(), 'dd, yyyy')
                            const id = uuidv5(period_cover, '108747ef-6b5d-4b5d-b608-ddb684aff5f2') //GeneralID// dont change!

                            const region = regions?.find(i => i.code.includes(personProfile!.region_code))

                            // console.log('regions')
                            // const municipality = await dexieDb.person_profile
                            //     .where("region_code")
                            //     .equals(region!.region_code)
                            //     .first();

                            const school = await dexieDb.lib_school_profiles
                                .where("id")
                                .equals(parseInt(personProfile!.school_id!.toString()))
                                .first();

                            return {
                                ...record,
                                id: id,
                                region: region?.name,
                                province: personProfile?.province_code,
                                municipality: personProfile?.city_code,
                                bene_name: personProfile?.first_name + " " + personProfile?.last_name,
                                // middle_name: personProfile?.middle_name, 
                                school: school?.school_name,
                                bene_id: personProfile?.cfwp_id_no,
                                profile_id: personProfile?.id,
                                operation_status: libstatus?.find(i => i.id == parseInt(record.operation_status))?.status_name ?? "",
                                odnpm_status: libstatus?.find(i => i.id == parseInt(record.odnpm_status))?.status_name ?? "",
                                finance_status: libstatus?.find(i => i.id == parseInt(record.finance_status))?.status_name ?? "",
                            };
                        })
                    );
                    return mergedRecords;
                });

            // console.log('pbd', pbd)
            setPayrollBeneData(pbd)

        })();
    }, [regions])

    const handleRowClick = (row: any) => {
        const r = `/${baseUrl}/${params!['payroll-list']!}/${row.profile_id}`
        console.log('Row clicked:', { r, row });
        router.push(r);
    };
    // console.log('PayrollAdmin > params', { data, payroll, cfwSubmissions })


    const columns = [
        {
            id: 'id',
            header: 'TRANSACTION ID',
            accessorKey: 'id',
            filterType: 'text',
            sortable: true,
        },
        {
            id: 'region',
            header: 'REGION',
            accessorKey: 'region',
            filterType: 'text',
            sortable: true,
        },
        // {
        //     id: 'province',
        //     header: 'PROVINCE',
        //     accessorKey: 'province',
        //     filterType: 'text',
        //     sortable: true,
        // },
        // {
        //     id: 'municipality',
        //     header: 'MUNICIPALITY',
        //     accessorKey: 'municipality',
        //     filterType: 'text',
        //     sortable: true,
        // }, 
        {
            id: 'school',
            header: 'SCHOOL NAME',
            accessorKey: 'school',
            filterType: 'text',
            sortable: true
        },
        {
            id: 'bene_id',
            header: 'BENE. ID',
            accessorKey: 'bene_id',
            filterType: 'text',
            sortable: true,
        },
        {
            id: 'bene_name',
            header: 'BENE. NAME',
            accessorKey: 'bene_name',
            filterType: 'text',
            sortable: true,
        },
        {
            id: 'operation_status',
            header: 'OPERATIONS STATUS',
            accessorKey: 'operation_status',
            filterType: 'text',
            sortable: true,
            cell: (value: string) => (
                <Badge variant={value == "Approved" || value == "Complete" ? "green" :
                    value == "For Compliance" ? "warning" :
                        value == "For Review" ? "destructive" : "default"
                } >
                    {value}
                </Badge>
            )
        },
        {
            id: 'operation_reviewed_by',
            header: 'OPERATIONS REVIEWED BY',
            accessorKey: 'operation_reviewed_by',
            filterType: 'text',
            sortable: true
        },
        {
            id: 'operation_status_date',
            header: 'OPERATION REVIEWED DATE',
            accessorKey: 'operation_status_date',
            filterType: 'text',
            sortable: true,
            cell: (value: string) => value ? format(value, 'PPpp') : ""
        },
        {
            id: 'odnpm_status',
            header: 'ODNPM STATUS',
            accessorKey: 'odnpm_status',
            filterType: 'text',
            cell: (value: string) => (
                <Badge variant={value == "Approved" || value == "Complete" ? "green" :
                    value == "For Compliance" ? "warning" :
                        value == "For Review" ? "destructive" : "default"
                } >
                    {value}
                </Badge>
            )
        },
        {
            id: 'odnpm_reviewed_by',
            header: 'ODNPM REVIEWED BY',
            accessorKey: 'odnpm_reviewed_by',
            filterType: 'text',
            sortable: true
        },
        {
            id: 'odnpm_status_date',
            header: 'ODNPM REVIEWED DATE',
            accessorKey: 'odnpm_status_date',
            filterType: 'text',
            sortable: true,
            cell: (value: string) => value ? format(value, 'PPpp') : ""
        },
        {
            id: 'finance_status',
            header: 'FINANCE STATUS',
            accessorKey: 'finance_status',
            filterType: 'text',
            sortable: true,
            cell: (value: string) => (
                <Badge variant={value == "Approved" || value == "Complete" ? "green" :
                    value == "For Compliance" ? "warning" :
                        value == "For Review" ? "destructive" : "default"
                } >
                    {value}
                </Badge>
            )
        },
        {
            id: 'finance_reviewed_by',
            header: 'FINANCE REVIEWED BY',
            accessorKey: 'finance_reviewed_by',
            filterType: 'text',
            sortable: true
        },
        {
            id: 'finance_status_date',
            header: 'FINANCE STATUS DATE',
            accessorKey: 'finance_status_date',
            filterType: 'text',
            sortable: true,
            cell: (value: string) => value ? format(value, 'PPpp') : ""
        },
        {
            id: 'date_received',
            header: 'DATE RECEIEVED (PAYOUT)',
            accessorKey: 'date_received',
            filterType: 'text',
            sortable: true,
            cell: (value: string) => value ? format(value, 'PPpp') : ""
        },

    ];

    return (
        <>
            <AppTable
                data={data as []}
                columns={columns}
                iconEdit={<UserCheck2Icon className="h-[55px] w-[55px] text-blue-500" />}
                onClickEdit={(record) => console.log('onClickEdit > ecord', record)}
                onRowClick={handleRowClick}
            />
        </>
    )
}


type UserTypes = IPersonProfile & ILibSchoolProfiles;
function PayrollBene() {

    const router = useRouter();
    const params = useParams<{ 'payroll-list': string; id: string }>()
    const [user, setUser] = useState<UserTypes>();
    const [session, setSession] = useState<SessionPayload>();
    const [data, setData] = useState(initialData);
    const handleDelete = (row: any) => {
        console.log('Delete:', row);
    };


    useEffect(() => {
        (async () => {
            const _session = await getSession() as SessionPayload;
            setSession(_session)  
            await getResults(_session)

        })();
    }, [])

    const getResults = async (session: SessionPayload) => {
        const user = await dexieDb.person_profile.where('id')
            .equals(params!.id).first();

        const merge = {
            ...await dexieDb.lib_school_profiles.where("id").equals(user!.school_id!).first(),
            ...user
        }; 
        // console.log('getResults > user', { user, dtr, id: params!.id })
        setUser(merge as UserTypes);
    }

    const handleRowClick = (row: any) => {
        const r = `/${baseUrl}/${params!['payroll-list']!}/${row.id}`
        console.log('Row clicked:', { r, row });
        router.push(r);
    };

    const handleAddNewRecord = (newRecord: any) => {
        console.log('handleAddNewRecord:', newRecord);
    };

    return (
        <>
            <div className="min-h-screen">

                <div className="flex flex-col">

                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" alt="User name" />
                            <AvatarFallback>{user?.first_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                            <h2 className="text-lg font-semibold uppercase">{user?.first_name} {user?.last_name}</h2>
                            <p className="text-sm text-gray-500">{user?.school_name}</p>
                        </div>  
                    </div>

                    {session?.userData.role == "Guest" && (
                        <>
                            <div className="my-10 grid grid-cols-2 gap-2 text-center">
                                <div>
                                    <p className="text-xl font-bold">146</p>
                                    <p className="text-gray-500 text-sm">Working hours</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold">14</p>
                                    <p className="text-gray-500 text-sm">Overtime hours</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold">2</p>
                                    <p className="text-gray-500 text-sm">Sick days</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold">3</p>
                                    <p className="text-gray-500 text-sm">Days off</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <p><strong>Type:</strong> Hourly</p>
                                <p><strong>Period of :</strong> March 1 - 15, 2025</p>
                                <p><strong>Total Salary:</strong> 4,580</p>
                                <div className='flex gap-2 items-center'><p><strong>Payment date:</strong> March 15 2025</p> <StatusBadge status='completed' /></div>
                                <p><strong>Bank:</strong> Cash</p>
                                <p><strong>Bank Number:</strong> N/A</p>
                            </div>
                        </>)}
                </div>
            </div>
        </>
    )
}
