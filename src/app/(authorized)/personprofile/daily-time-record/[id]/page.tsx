"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { Clock, Plus, Trash2, Save, X, Printer, Download, SquareArrowUpRight, SquareArrowUpRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addDays, differenceInMinutes, endOfMonth, format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppTable } from '@/components/app-table';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import { IPersonProfile } from '@/components/interfaces/personprofile';
import { ILibSchoolProfiles, LibraryOption } from '@/components/interfaces/library-interface';
import { formatInTimeZone } from 'date-fns-tz';
import { ICFWTimeLogs } from '@/components/interfaces/iuser';
import { toast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/app-daterange';
import Image from 'next/image';
import AppSubmitReview from '@/components/app-submit-review';
import { ICFWPayrollBene, ISubmissionLog } from '@/components/interfaces/cfw-payroll';
import { getOfflineLibStatuses } from '@/components/_dal/offline-options';
import { v4 as uuidv4 } from 'uuid';
import { v5 as uuidv5 } from 'uuid';
import { DTRService } from '../service';
import { libDb } from '@/db/offline/Dexie/databases/libraryDb';
import { ARService } from '../../accomplishment-report/service';


export const DTRcolumns = [
    {
        id: 'log_inX',
        header: '',
        accessorKey: 'log_in',
        filterType: 'text',
        sortable: true,
        cell: (value: Date | undefined) => {
            if (value) {
                return format(value, 'MMM dd');
            }
            return "-";
        },
    },
    {
        id: 'log_inX2',
        header: 'Day',
        accessorKey: 'log_in',
        filterType: 'text',
        sortable: true,
        cell: (value: Date | undefined) => {
            if (value) {
                return format(value, "eeee");
            }
            return "-";
        },
    },
    {
        id: 'log_in',
        header: 'Time In',
        accessorKey: 'log_in',
        filterType: 'text',
        sortable: true,
        dataType: 'datetime',
        validation: (getValues: any) => ({
            required: 'Time in is required.',
            validate: {
                isBeforeLogout: (value: any) => {
                    const log_out = getValues('log_out');
                    if (!log_out || !value) return true;
                    return new Date(value) <= new Date(log_out) || 'Time in cannot be after Time out.';
                }
            }
        }),
        validationTrigger: 'log_out',
        cell: (value: Date | undefined) => {
            if (value) {
                return format(value, "HH:mm");
            }
            return "-";
        },
        className: "text-center"
    },
    {
        id: 'log_out',
        header: 'Time Out',
        accessorKey: 'log_out',
        filterType: 'text',
        sortable: true,
        dataType: 'datetime',
        validation: (getValues: any) => ({
            required: 'Time out is required.',
            validate: {
                isAfterLogin: (value: any) => {
                    const log_in = getValues('log_in');
                    if (!log_in || !value) return true;
                    return new Date(value) >= new Date(log_in) || 'Time out cannot be before Time in.';
                }
            }
        }),
        validationTrigger: 'log_in',
        cell: (value: Date | undefined) => {
            if (value) {
                return format(value, "HH:mm");
            }
            return "-";
        },
        className: "text-center"
    },
    {
        id: 'duration',
        header: 'Duration',
        accessorKey: 'log_out',
        filterType: 'text',
        sortable: true,
        cellRow: (row: any) => {
            if (["-", "", null].includes(row.log_out) || !(new Date(row.log_out) instanceof Date)) {
                return "-";
            }
            const minutes = differenceInMinutes(row.log_out, row.log_in);
            if (minutes < 0) {
                return "-";
            } else if (minutes < 60) {
                return `${minutes} min`;
            } else if (minutes < 1440) { // Less than 24 hours
                const hours = Math.floor(minutes / 60);
                const remainingMinutes = minutes % 60;
                return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
            } else {
                const days = Math.floor(minutes / 1440);
                const remainingHours = Math.floor((minutes % 1440) / 60);
                return `${days}d ${remainingHours}h`;
            }
        },
        className: "text-center"
    },
    {
        id: 'remarks',
        header: 'Remarks',
        accessorKey: 'remarks',
        filterType: 'text',
        sortable: true,
        className: "text-center",
        validation: {
            required: 'Remarks is required.',
            maxLength: { value: 255, message: 'Remarks must be 255 characters or less.' }
        },
    },
]

type IUser = IPersonProfile & ILibSchoolProfiles;

export default function DailyTimeRecordUser() {

    const service = new DTRService();

    const params = useParams<{ id: string }>()
    const router = useRouter()

    const [data, setData] = useState<any[]>([]);
    const [user, setUser] = useState<IUser | any>();
    const [session, setSession] = useState<SessionPayload>();

    const [statusesOptions, setStatusesOptions] = useState<LibraryOption[]>([]);
    const [payrollbene, setCFWPayrollBene] = useState<ICFWPayrollBene>()
    const [submissionLogs, setSubmissionLogs] = useState<ISubmissionLog[]>([]);

    const [lastStatus, setLastStatus] = useState<ISubmissionLog>({
        id: "",
        record_id: "",
        bene_id: "",
        module: "",
        comment: "",
        status: "",
        status_date: "",
        created_date: "",
        created_by: ""
    });

    const [selectedStatus, setSelectedStatus] = useState<ISubmissionLog>({
        id: "",
        record_id: "",
        bene_id: "",
        module: "",
        comment: "",
        status: "",
        status_date: "",
        created_date: "",
        created_by: ""
    });

    const getInitialDateRange = (): DateRange => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        const isAfter15th = today.getDate() >= 16;
        const from = isAfter15th
            ? new Date(year, month, 16)
            : new Date(year, month, 1);

        const to = isAfter15th
            ? endOfMonth(today)
            : addDays(from, 15);

        return { from, to };
    };


    const [date, setDate] = React.useState<DateRange | undefined>(getInitialDateRange())

    useEffect(() => {

        (async () => {
            const _session = await getSession() as SessionPayload;
            console.log('session', _session)
            setSession(_session);
            try {
                if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            const statuses = await getOfflineLibStatuses();
            const filteredStatuses = statuses.filter(status => [2, 10].includes(status.id));
            console.log('filteredStatuses', filteredStatuses)
            setStatusesOptions(filteredStatuses);

            const user = await dexieDb.person_profile.where('user_id')
                .equals(params!.id).first();

            let period_cover = "";
            let r = "";
            if (date?.from && date?.to && user?.id) {
                period_cover = format(new Date(date!.from!)!.toISOString(), 'yyyyMMdd') + "-" + format(new Date(date!.to!)!.toISOString(), 'yyyyMMdd')
                r = uuidv5("daily time record" + "-" + period_cover, user.id);
            }

            const logsQuery = await dexieDb.submission_log.where("record_id").equals(r)
            const logs = await logsQuery.sortBy("created_date")
            const logslast = logs.length > 0 ? logs[logs.length - 1] : null

            console.log('period_cover', period_cover, r, logsQuery.toArray())
            console.log('user', { user, params })

            setSubmissionLogs(logs)
            setSelectedStatus(logslast ?? selectedStatus)
            setLastStatus(logslast ?? selectedStatus)

            const pb = await dexieDb.cfwpayroll_bene.where({
                period_cover_from: date!.from!,
                period_cover_to: date!.to!,
                bene_id: user!.id
            }).first()
            setCFWPayrollBene(pb)
            console.log('ar', { params, pb })

            const merge = {
                ...await libDb.lib_school_profiles.where("id").equals(user!.school_id!).first(),
                ...user
            };
            setUser(merge);


            const assessment = await new ARService().syncDLWorkplan(`work_plan/view/by_bene/${merge.id}/`);
            if (!assessment) {
                toast({
                    variant: "destructive",
                    title: "Assessment not found",
                    description: "Please create an assessment first",
                });
            }


        })();
    }, [date])


    useEffect(() => {
        (async () => {
            await getResults()
            handleOnRefresh()
            console.log('date', date)
        })();
    }, [date, user, session])

    const getResults = async () => {
        const results = await dexieDb.cfwtimelogs
            .where('record_id')
            .equals(user?.user_id ?? "")
            .and(log => {
                const logDate = new Date(log.log_in);
                return logDate >= date!.from! && logDate <= date!.to!;
            })
            .sortBy("created_date"); // Ascending: oldest → latest  

        setData(results)
        console.log('getResults', { results, user: user?.email, date: date!.from!, date2: date!.to! })
        return results;
    };

    useEffect(() => {
        console.log('data', data)
    }, [data])


    const handleEdit = (row: ICFWTimeLogs) => {
        (async () => {
            console.log('Edit:', row);
            await dexieDb.cfwtimelogs.put({
                ...row,
                push_status_id: 0,
                last_modified_by: session!.userData!.email!,
                last_modified_date: new Date().toISOString()
            }, 'id')

            toast({
                variant: "default",
                title: "Update",
                description: "Record has been updated!",
            });
            setData(await getResults())
        })();
    };

    // const handleRowClick = (row: any) => {
    //     console.log('Row clicked:', row);
    //     router.push(`/${baseUrl}/${row.user_id}`);
    // };

    const handleAddNewRecord = (row: any) => {
        (async () => {
            console.log('handleAddNewRecord', row);
            await dexieDb.cfwtimelogs.put({
                ...row,
                log_in: new Date(row.log_in).toISOString(),
                log_out: new Date(row.log_out).toISOString(),
                id: uuidv4(),
                log_type: "IN",
                work_session: 1,
                total_work_hours: 0,
                status: "Pending",
                record_id: user.user_id,
                created_date: new Date().toISOString(),
                created_by: session!.userData!.email!,
                last_modified_by: session!.userData!.email!,
                push_status_id: 0,
                is_deleted: false,
                last_modified_date: new Date().toISOString(),
                push_date: new Date().toISOString(),
                deleted_date: null,
                deleted_by: null
            }, 'id')

            toast({
                variant: "default",
                title: "Add New Record  ",
                description: "Record has been added!",
            });
            setData(await getResults())
        })();
    };


    const handleSubmitReview = () => {
        const module = "daily time record";
        (async () => {

            try {
                const period_cover = format(new Date(date!.from!)!.toISOString(), 'yyyyMMdd') + "-" + format(new Date(date!.to!)!.toISOString(), 'yyyyMMdd')
                const record_id = uuidv5(module + "-" + period_cover, user.id);
                console.log('period_cover', period_cover, record_id)

                const raw = {
                    ...selectedStatus!,
                    id: uuidv4(),
                    record_id: record_id,
                    bene_id: user!.id,
                    module: module,
                    created_date: new Date().toISOString(),
                    created_by: session!.userData!.email!,
                    push_status_id: 0,
                }
                console.log('handleSubmitReview', raw)
                await dexieDb.submission_log.put(raw)

                console.log('handleSaveAccomplishmentReport', raw, payrollbene)
                if (raw.status == "2") {
                    const rev = {
                        id: payrollbene ? payrollbene.id : uuidv4(),
                        bene_id: user!.id,
                        daily_time_record_id: record_id,
                        daily_time_record_reviewed_date: new Date().toISOString(),
                        accomplishment_report_id: payrollbene?.accomplishment_report_id || "",
                        accomplishment_report_reviewed_date: payrollbene?.accomplishment_report_reviewed_date || "",
                        period_cover_from: date?.from!,
                        period_cover_to: date?.to!,
                        operation_status: "",
                        operation_status_date: "",
                        odnpm_status: "",
                        odnpm_status_date: "",
                        finance_status: "",
                        finance_status_date: "",
                        date_released: "",
                        date_received: "",
                        operation_reviewed_by: "",
                        odnpm_reviewed_by: "",
                        finance_reviewed_by: "",
                        push_status_id: 0,
                    }
                    console.log('review', rev)
                    await dexieDb.cfwpayroll_bene.put(rev)
                }

                toast({
                    variant: "green",
                    title: "Submit Review",
                    description: "Your review has been submitted!",
                });
                // console.log('handleSaveAccomplishmentReport > admin > submission', { raw })
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Submit Review",
                    description: `Review or user session is not yet ready ${error} `,
                });
            }
        })();
    }


    const handleOnRefresh = async () => {
        try {
            if (!user?.user_id) {
                console.log('handleOnRefresh > user is loading or invalid');
                return;
            }

            if (!session) {
                console.log('handleOnRefresh > session is not available');
                return;
            }

            const results = await service.syncDLTimeLogs('cfwtimelogs/view/multiple/', {
                "person_profile_id": user.user_id
            });


            console.log('results', results)

            if (!results) {
                console.log('Failed to fetch time records');
                return;
            }

            await getResults();
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

                    <div className="flex items-center space-x-4 mb-6 flex-wrap gap-1">
                        <Avatar>
                            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" alt="User name" />
                            <AvatarFallback>{user?.first_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                            <h2 className="text-lg font-semibold uppercase">{user?.first_name} {user?.last_name}</h2>
                            <p className="text-sm text-gray-500">{user?.school_name}</p>
                        </div>

                        <DatePickerWithRange
                            endIcon={<SquareArrowUpRightIcon onClick={() => {
                                const period_cover = format(new Date(date!.from!)!.toISOString(), 'yyyyMMdd') + "-" + format(new Date(date!.to!)!.toISOString(), 'yyyyMMdd')
                                router.push(`/personprofile/accomplishment-report/${user?.user_id}/${uuidv5("accomplishment report" + "-" + period_cover, user?.user_id ?? "")}`)
                            }} className="scale-116 mx-2 cursor-pointer" />}
                            className={"bg-primary text-primary-foreground hover:bg-primary/90 p-[5px] rounded-md px-1 cursor-pointer"}
                            value={date}
                            onChange={setDate}
                        />


                        {lastStatus.status == "2" &&
                            <>
                                <Button onClick={() => console.log('enteries', null)} size="icon" className="[&_svg]:size-[20px] flex items-center gap-2 !ml-0">
                                    <Printer />
                                </Button>

                                <Button onClick={() => console.log('enteries', null)} size="icon" className="[&_svg]:size-[20px] flex items-center gap-2 !ml-0">
                                    <Download />
                                </Button>
                            </>}


                    </div>
                    <div className="rounded-lg mb-6">
                        <AppTable
                            data={data}
                            columns={DTRcolumns}
                            onEditRecord={!["CFW Beneficiary", "Guest", "Administrator", "CFW Administrator"]
                                .includes(session?.userData?.role || "") ? handleEdit : undefined}
                            onRefresh={handleOnRefresh}
                            onAddNewRecord={["CFW Immediate Supervisor"].includes(session?.userData?.role || "") ? handleAddNewRecord : undefined}
                            onUseFields={(columns) => columns.filter(col => ['log_in', 'log_out', 'remarks']
                                .includes(col.id))}
                        />
                    </div>

                    <div className="no-print">
                     
                        <AppSubmitReview
                            session={session!}
                            review_logs={submissionLogs}
                            options={statusesOptions}
                            review={selectedStatus}
                            onChange={(review) => setSelectedStatus(review)}
                            onSubmit={() => handleSubmitReview()}
                        />
                    </div>

                </div>

            </CardContent>
        </Card>

    );
}