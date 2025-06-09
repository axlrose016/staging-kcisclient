"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ILibSchoolProfiles } from '@/components/interfaces/library-interface';
import { IPersonProfile } from '@/components/interfaces/personprofile';
import { SessionPayload } from '@/types/globals';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { getSession } from '@/lib/sessions-client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AppSubmitReview, { LibraryOption } from '@/components/app-submit-review';
import { ICFWPayrollBene, ISubmissionLog } from '@/components/interfaces/cfw-payroll';
import { getOfflineLibStatuses } from '@/components/_dal/offline-options';
import Image from 'next/image';
import { AppTable } from '@/components/app-table';
import { ICFWTimeLogs } from '@/components/interfaces/iuser';
import { DTRcolumns } from '../../../daily-time-record/[id]/page';
import { AccomplishmentUser } from '@/components/accomplishment-user';
import { toast } from '@/hooks/use-toast';
import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';

export interface dataI {
    id: string;
    date: string;
    hours: number;
    status: string;
}

const data = [
    {
        id: 'SF-123678',
        date: 'Jan 1-15, 2024',
        hours: 80,
        status: 'Completed'
    },
    {
        id: 'SF-12234',
        date: 'Jan 16-31, 2024',
        hours: 88,
        status: 'Completed'
    },
    {
        id: 'SF-23478',
        date: 'Feb 1-15, 2024',
        hours: 72,
        status: 'Pending'
    }
];

type UserTypes = IPersonProfile & ILibSchoolProfiles;
type IPayrollBene = ICFWPayrollBene & IPersonProfile & { no_hours: number, rate: number, amount: number };

export default function PayrollUser() {

    const router = useRouter();
    const params = useParams<{ 'payroll-list': string; id: string }>()


    const [user, setUser] = useState<UserTypes>();
    const [session, setSession] = useState<SessionPayload>();


    const [dtrlist, setDTRList] = useState<ICFWTimeLogs[]>([]);
    const [bene, setPayrollBeneData] = useState<IPayrollBene>([])
    const [statusesOptions, setStatusesOptions] = useState<LibraryOption[]>([]);
    const [submissionLogs, setSubmissionLogs] = useState<ISubmissionLog[]>([]);
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

    const [period_cover_from, period_cover_to] = params!['payroll-list']!.split('-').map(dateStr => {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return new Date(`${year}-${month}-${day}`);
    });

    const StatusBadge = ({ status }: { status: string }) => (
        <span className={`
        px-2 py-1 rounded-full text-xs font-semibold
        ${status === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-400'
            }
      `}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );


    useEffect(() => {
        (async () => {
            const _session = await getSession() as SessionPayload;
            setSession(_session)

            const statuses = await getOfflineLibStatuses();
            const filteredStatuses = statuses.filter(status => [2, 10, 11, 10, 5, 17].includes(status.id));
            setStatusesOptions(filteredStatuses);

            const pbd = await dexieDb.cfwpayroll_bene
                .where("period_cover_from")
                .between(
                    new Date(period_cover_from.setHours(0, 0, 0, 0)),
                    new Date(period_cover_to.setHours(23, 59, 59, 999))
                ).and(i => i.bene_id == params?.id).first()


            const userid = uuidv5(params!['payroll-list'], pbd!.bene_id)
            console.log('pbd', { pbd, userid })
            setPayrollBeneData(pbd as IPayrollBene)

            const logsQuery = await dexieDb.submission_log.where("record_id").equals(userid)
            const logs = await logsQuery.sortBy("created_date")
            setSubmissionLogs(logs)

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

        const dtr = await dexieDb.cfwtimelogs
            .where('created_by')
            .equals(user?.email ?? "")
            .and(log => {
                const logDate = new Date(log.log_in);
                return logDate >= period_cover_from! && logDate <= period_cover_to!;
            })
            .sortBy("created_date"); // Ascending: oldest → latest  

        setDTRList(dtr)
        // console.log('getResults > user', { user, dtr, id: params!.id })
        setUser(merge as UserTypes);
    }


    const handleSubmitReview = (review: ISubmissionLog) => {
        (async () => {
            console.log('handleSubmitReview > review', { review, session: session?.userData })
            const raw = {
                ...review!,
                id: uuidv4(),
                record_id: uuidv5(params!['payroll-list'], user!.id),
                bene_id: params!.id,
                module: "payroll",
                created_date: new Date().toISOString(),
                created_by: session!.userData!.email!,
                push_status_id: 0,
            }
            // console.log('handleSubmitReview > rev', raw)
            await dexieDb.submission_log.put(raw)

            const rev = {
                ...bene,
                [session?.userData.role == 'CFW Administrator' ? 'operation_status' :
                    session?.userData.role == 'Finance' ? "finance_status" : "odnpm_status"]: raw.status,
                [session?.userData.role == 'CFW Administrator' ? 'operation_status_date' :
                    session?.userData.role == 'Finance' ? "finance_status_date" : "odnpm_status_date"]: new Date().toISOString(),
                [session?.userData.role == 'CFW Administrator' ? 'operation_reviewed_by' :
                    session?.userData.role == 'Finance' ? "finance_reviewed_by" : "odnpm_reviewed_by"]: session!.userData.email,
            } as IPayrollBene
            console.log('handleSubmitReview > rev', rev)
            await dexieDb.cfwpayroll_bene.put(rev)

            toast({
                variant: "green",
                title: "Submit Review",
                description: "Your review has been submitted!",
            });
        })();
    }


    return (

        <Card className='min-h-screen'>
            <CardHeader>
                <CardTitle className="mb-2 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
                    {/* Logo Section */}
                    <div className="flex-shrink-0">
                        <Image src="/images/logos.png" width={300} height={300} alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto" />
                    </div>

                    {/* Title Section */}
                    <div className="flex text-lg items-center font-semibold mt-2 md:mt-0 gap-2">
                        <p>{format(period_cover_from, 'MMM d')} - {format(period_cover_to, 'd, yyyy')}</p>
                    </div>
                </CardTitle>



            </CardHeader>
            <CardContent>
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

                        {/* <Button onClick={() => console.log('enteries', null)} size="sm" className="flex items-center gap-2">
                            <Printer className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => console.log('enteries', null)} size="sm" className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                        </Button> */}

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

                <Accordion type="multiple" className="w-full my-4" defaultValue={["item-1", "item-2"]}>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className='font-bold w-full'>
                            <div className='flex justify-between items-center w-full mx-2'>
                                <span>Daily Time Record</span>
                                <span className='flex items-center'>
                                    <Tooltip>
                                        <TooltipTrigger  asChild className="flex items-center">
                                            <CheckCircle className='h-7 w-7 mr-1 text-green-500' />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Reviewed at {bene?.daily_time_record_reviewed_date ? format(new Date(bene.daily_time_record_reviewed_date), 'PPpp') : ""}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="rounded-lg mb-6">
                                <Card className='p-4'>
                                    <AppTable
                                        simpleView
                                        data={dtrlist}
                                        columns={DTRcolumns}
                                    />
                                </Card>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger  className='font-bold'>
                            <div className='flex justify-between items-center w-full mx-2'>
                                <span>Accomplishment Report </span>
                                <span className='flex items-center'>
                                    <Tooltip>
                                        <TooltipTrigger asChild className="flex items-center">
                                            <CheckCircle className='h-7 w-7 mr-1 text-green-500' />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Reviewed at {bene?.accomplishment_report_reviewed_date ? format(new Date(bene.accomplishment_report_reviewed_date), 'PPpp') : ""}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <Card className='p-4'>
                                <AccomplishmentUser
                                    disabled={true}
                                    user={user}
                                    date={{ from: period_cover_from, to: period_cover_to }}
                                    session={session}
                                    accomplishmentReportId={bene?.accomplishment_report_id || ""}
                                />
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <AppSubmitReview
                    openHistory
                    options={statusesOptions}
                    review={selectedStatus}
                    review_logs={submissionLogs}
                    session={session!}
                    onChange={(e) => console.log(e)}
                    onSubmit={(r) => handleSubmitReview(r)}
                />
            </CardContent>
        </Card>

    );
}