"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppTable } from '@/components/app-table';
import { IAccomplishmentReport, IPersonProfile } from '@/components/interfaces/personprofile';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { SessionPayload } from '@/types/globals';
import { getSession } from '@/lib/sessions-client';
import { formatInTimeZone } from 'date-fns-tz';
import { ILibSchoolProfiles } from '@/components/interfaces/library-interface';
import Image from 'next/image';
import { ARService } from '../service';
import { libDb } from '@/db/offline/Dexie/databases/libraryDb';
import { toast } from '@/hooks/use-toast';

interface IData {
    id: string;
    date_cover: string;
    total_hours: number;
    status: string;
}
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
        id: 'status',
        header: 'status',
        accessorKey: 'status_id',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'remarks',
        header: 'Remarks',
        accessorKey: 'remarks',
        filterType: 'text',
        sortable: true,
    },
]


type IUser = IPersonProfile & ILibSchoolProfiles;
const baseUrl = 'personprofile/accomplishment-report'

export default function AccomplishmentReportUsersList() {

    const router = useRouter();
    const service = new ARService()

    const [user, setUser] = useState<IUser | any>();
    const [session, setSession] = useState<SessionPayload>();
    const params = useParams<{ 'accomplishment-userid': string; id: string }>()
    const [data, setARList] = useState<IAccomplishmentReport[]>([])

    useEffect(() => {
        (async () => {
            const _session = await getSession() as SessionPayload;
            setSession(_session);
            try {
                if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            getResults(_session)
        })();
    }, [])



    useEffect(() => {
        console.log('')
        const fetchWorkPlan = async () => {
            if (!user?.id || !session?.token) {
                console.log('Worlplan: Missing required user or session data');
                return null;
            }

            try { 
                const results = await service.syncDLWorkplan(`work_plan/view/by_bene/${user.id}/`);
                if (!results) {
                    console.log('Failed to fetch time records');
                    return;
                }
                console.log('Worlplan:   data:', results);
                return data;
            } catch (error) {
                console.error('Worlplan: Error fetching work plan:', error);
                return null;
            }
        };

        fetchWorkPlan();
    }, [user])

    useEffect(() => {
        (async () => { 
            handleOnRefresh()
        })();
    }, [session])


    const handleOnRefresh = async () => {
        try {

            if (!session) {
                console.log('handleOnRefresh > session is not available');
                return;
            }

            const results = await service.syncDLARs(`accomplishment_report/view/${params!['accomplishment-userid']}/`);
            if (!results) {
                console.log('Failed to fetch time records');
                return;
            }

            await getResults(session);
        } catch (error) {
            console.error('Error syncing time records:', error);
            toast({
                variant: "warning",
                title: "Unable to Fetch Latest Data",
                description: error instanceof Error
                    ? `Error: ${error.message}`
                    : "Unable to sync DTR records. Please try logging out and back in to refresh your session.",
            });
        }
    };


    const getResults = async (session: SessionPayload) => {
        const user = await dexieDb.person_profile.where('user_id')
            .equals(params!['accomplishment-userid']!).first();

        const merge = {
            ...await libDb.lib_school_profiles.where("id").equals(user!.school_id!).first(),
            ...user
        };

        console.log('getResults', { session, merge });
        setUser(merge);
        setARList(await dexieDb.accomplishment_report.where("person_profile_id").equals(params!['accomplishment-userid']!).toArray())

        const results = await dexieDb.cfwtimelogs.where('created_by')
            .equals(user?.email ?? "")
            .sortBy("created_date"); // Ascending: oldest → latest

        return results;
    };

    const handleDelete = (row: any) => {
        console.log('Delete:', row);
    };

    const handleRowClick = (row: any) => {
        const r = `/${baseUrl}/${params!['accomplishment-userid']}/${row.id ?? "new"}`
        console.log('Row clicked:', { r, row });
        router.push(r);
    };

    const handleClickAddNew = () => {
        console.log('handleClickAddNew')
        const r = `/${baseUrl}/${params!['accomplishment-userid']}/new`
        router.push(r);
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
                        Accomplishment Report
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>

                <div className="min-h-screen">

                    <div className="flex items-center space-x-4 mb-6">
                        <Avatar>
                            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" alt="User name" />
                            <AvatarFallback>{user?.first_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                            <h2 className="text-lg font-semibold uppercase">{user?.first_name} {user?.last_name}</h2>
                            <p className="text-sm text-gray-500">{user?.school_name}</p>
                        </div>


                    </div>

                    <AppTable
                        data={data}
                        columns={columns} 
                        onRowClick={handleRowClick}
                        onClickAddNew={session?.userData?.role && ["CFW Beneficiary", "Guest"].includes(session.userData.role) ? handleClickAddNew : undefined}
                    />
                </div>

            </CardContent>
        </Card>

    );
}