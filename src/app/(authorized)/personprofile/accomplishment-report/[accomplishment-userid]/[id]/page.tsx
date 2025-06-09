"use client";

import React, { useEffect, useState } from 'react';
import { addDays, endOfMonth } from 'date-fns';
import { useParams } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { SessionPayload } from '@/types/globals';
import { getSession } from '@/lib/sessions-client';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { IAccomplishmentActualTask, IAccomplishmentReport, IPersonProfile } from '@/components/interfaces/personprofile';
import { ILibSchoolProfiles, LibraryOption } from '@/components/interfaces/library-interface';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { getOfflineLibStatuses } from '@/components/_dal/offline-options';
import { ICFWPayrollBene, ISubmissionLog } from '@/components/interfaces/cfw-payroll';
import AppSubmitReview from '@/components/app-submit-review';
import { AccomplishmentUser } from '@/components/accomplishment-user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download, Edit, Printer } from 'lucide-react';

export type UserTypes = IPersonProfile & ILibSchoolProfiles;

export default function AccomplishmentReportUser() {
    const { toast } = useToast()
    const params = useParams<{ 'accomplishment-userid': string; id: string }>()
    const [user, setUser] = useState<UserTypes>();
    const [supervisor, setSupervisor] = useState<any>();
    const [ar, setAR] = useState<IAccomplishmentReport>()
    const [tasks, setTasks] = useState<IAccomplishmentActualTask[]>([])


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



    useEffect(() => {
        (async () => {
            const _session = await getSession() as SessionPayload;
            try {
                if (!dexieDb.isOpen()) await dexieDb.open();
            } catch (error) {
                console.error('Error fetching data:', error);
            }

            const statuses = await getOfflineLibStatuses();
            const filteredStatuses = statuses.filter(status => [2, 10, 11, 10, 5, 17].includes(status.id));
            setStatusesOptions(filteredStatuses);


            setSession(_session)
            await getResults(_session)
        })();
    }, [])

    const getResults = async (session: SessionPayload) => {
        const user = await dexieDb.person_profile.where('user_id')
            .equals(params!['accomplishment-userid']).first();
        console.log('p', { user, params, p: params!['accomplishment-userid'] })
        const merge = {
            ...await dexieDb.lib_school_profiles.where("id").equals(user!.school_id!).first(),
            ...user
        };
        setUser(merge as UserTypes);

        const arId = params?.id == "new" ? uuidv4() : params!.id

        const logsQuery = await dexieDb.submission_log.where("record_id").equals(arId)
        const logs = await logsQuery.sortBy("created_date")
        const logslast = logs.length > 0 ? logs[logs.length - 1] : null

        setSubmissionLogs(logs)
        setSelectedStatus(logslast ?? selectedStatus)
        setLastStatus(logslast ?? selectedStatus)

        const ar = await dexieDb.accomplishment_report.where("id").equals(arId).first()

        const pb = await dexieDb.cfwpayroll_bene.where({
            period_cover_from: date!.from!,
            period_cover_to: date!.to!,
            bene_id: user!.id
        }).first()
        setCFWPayrollBene(pb)

        setAR({
            id: arId,
            person_id: user!.user_id,
            period_cover_from: ar?.period_cover_from ?? date!.from!,
            period_cover_to: ar?.period_cover_to ?? date!.to!,
            work_plan_id: "",
            accomplishment_actual_task: "",
            status_id: ar ? ar.status_id : 0,
            created_date: ar?.created_date ?? new Date().toISOString(),
            created_by: ar?.created_by ?? user!.email!,
            last_modified_by: ar?.last_modified_by ?? user!.email!,
            last_modified_date: new Date().toISOString(),
            push_status_id: 0,
            push_date: "",
            deleted_date: "",
            deleted_by: "",
            is_deleted: false,
            remarks: "",
        })

        // await dexieDb.work_plan_cfw.put({
        //     id: uuidv4(),
        //     work_plan_id:"6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
        //     cfw_id:"2192a8f9-371a-4787-9604-c2f147a05e3c", 
        //     status_id:0,
        //     created_date:"",
        //     created_by:"",
        //     deleted_date:"",
        //     deleted_by:"",
        //     is_deleted:false,
        // })   
        // await dexieDb.work_plan.put({
        //     id: '6ae189ed-eec7-4c38-a9fa-da8a00b01f21',
        //     immediate_supervisor_id: "23db4fc3-038d-4ebc-8688-f35a1cf5f24a",
        //     alternate_supervisor_id: "35c1f7f3-03be-4277-99cd-3b78dad9722a",
        //     objectives: "Sample",
        //     area_focal_person_id: "35c1f7f3-03be-4277-99cd-3b78dad9722a",
        //     no_of_days_program_engagement: 50,
        //     approved_work_schedule_from: "8AN - 12PM, 1PM - 5PM",
        //     approved_work_schedule_to: "June/1/2025",
        //     status_id: 0,
        //     created_date: new Date().toString(),
        //     created_by: session.userData.email!,
        //     last_modified_date: "",
        //     last_modified_by: "",
        //     push_status_id: 1,
        //     push_date: "",
        //     deleted_date: "",
        //     deleted_by: "",
        //     is_deleted: false,
        //     remarks: "",
        //     work_plan_title: "Sample",
        //     total_number_of_bene: 100,
        // })

        // if ((await dexieDb.work_plan_tasks.toArray()).length == 0) {
        //     await dexieDb.work_plan_tasks.bulkPut([
        //         {
        //             id: uuidv4(),
        //             work_plan_category_id: 1,
        //             work_plan_id: "6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
        //             activities_tasks: "Attend to KC-CFW related activities",
        //             expected_output: "Document and comply with the KC-CFW instructions",
        //             timeline_from: new Date(),
        //             timeline_to: new Date(),
        //             assigned_person_id: "",
        //             status_id: 0,
        //             created_date: new Date().toString(),
        //             created_by: session.userData.email!,
        //             last_modified_date: "",
        //             last_modified_by: "",
        //             push_status_id: 1,
        //             push_date: "",
        //             deleted_date: "",
        //             deleted_by: "",
        //             is_deleted: false,
        //             remarks: "",
        //         },
        //         {
        //             id: uuidv4(),
        //             work_plan_category_id: 1,
        //             work_plan_id: "6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
        //             activities_tasks: "Encoding of the served CFW beneficiary profile in the database",
        //             expected_output: "Encoded list of served beneficiaries and updaated database",
        //             timeline_from: new Date(),
        //             timeline_to: new Date(),
        //             assigned_person_id: "",
        //             status_id: 0,
        //             created_date: new Date().toString(),
        //             created_by: session.userData.email!,
        //             last_modified_date: "",
        //             last_modified_by: "",
        //             push_status_id: 1,
        //             push_date: "",
        //             deleted_date: "",
        //             deleted_by: "",
        //             is_deleted: false,
        //             remarks: "",
        //         },
        //         {
        //             id: uuidv4(),
        //             work_plan_category_id: 1,
        //             work_plan_id: "6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
        //             activities_tasks: "Assist in the review and validation of the beneficaires submitted documents ",
        //             expected_output: "Validated and reviewed payment requirements of the beneficiaries and generate the list of beneficiaries with compliances ",
        //             timeline_from: new Date(),
        //             timeline_to: new Date(),
        //             assigned_person_id: "",
        //             status_id: 0,
        //             created_date: new Date().toString(),
        //             created_by: session.userData.email!,
        //             last_modified_date: "",
        //             last_modified_by: "",
        //             push_status_id: 1,
        //             push_date: "",
        //             deleted_date: "",
        //             deleted_by: "",
        //             is_deleted: false,
        //             remarks: "",
        //         },
        //         {
        //             id: uuidv4(),
        //             work_plan_category_id: 1,
        //             work_plan_id: "6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
        //             activities_tasks: "Assist in the computation of payroll assistance",
        //             expected_output: "Accurate computation of the beneficiaries assistance and included on the payroll",
        //             timeline_from: new Date(),
        //             timeline_to: new Date(),
        //             assigned_person_id: "",
        //             status_id: 0,
        //             created_date: new Date().toString(),
        //             created_by: session.userData.email!,
        //             last_modified_date: "",
        //             last_modified_by: "",
        //             push_status_id: 1,
        //             push_date: "",
        //             deleted_date: "",
        //             deleted_by: "",
        //             is_deleted: false,
        //             remarks: "",
        //         },
        //         {
        //             id: uuidv4(),
        //             work_plan_category_id: 1,
        //             work_plan_id: "6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
        //             activities_tasks: "Data recording of the actual day rendered of the beneficiaries based on their submitted payment requirements in the database",
        //             expected_output: "Updated monitoring tool ",
        //             timeline_from: new Date(),
        //             timeline_to: new Date(),
        //             assigned_person_id: "",
        //             status_id: 0,
        //             created_date: new Date().toString(),
        //             created_by: session.userData.email!,
        //             last_modified_date: "",
        //             last_modified_by: "",
        //             push_status_id: 1,
        //             push_date: "",
        //             deleted_date: "",
        //             deleted_by: "",
        //             is_deleted: false,
        //             remarks: "",
        //         },
        //         {
        //             id: uuidv4(),
        //             work_plan_category_id: 2,
        //             work_plan_id: "6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
        //             activities_tasks: "Assist during payout activity.",
        //             expected_output: "Payout report.",
        //             timeline_from: new Date(),
        //             timeline_to: new Date(),
        //             assigned_person_id: "",
        //             status_id: 0,
        //             created_date: new Date().toString(),
        //             created_by: session.userData.email!,
        //             last_modified_date: "",
        //             last_modified_by: "",
        //             push_status_id: 1,
        //             push_date: "",
        //             deleted_date: "",
        //             deleted_by: "",
        //             is_deleted: false,
        //             remarks: "",
        //         },
        //         {
        //             id: uuidv4(),
        //             work_plan_category_id: 1,
        //             work_plan_id: "6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
        //             activities_tasks: "Sorting and filing of CFW documents such as but not limited to their profile forms, payment requirements and other liquidation documents ",
        //             expected_output: "Sorted and compiled the liquidation documents",
        //             timeline_from: new Date(),
        //             timeline_to: new Date(),
        //             assigned_person_id: "",
        //             status_id: 0,
        //             created_date: new Date().toString(),
        //             created_by: session.userData.email!,
        //             last_modified_date: "",
        //             last_modified_by: "",
        //             push_status_id: 1,
        //             push_date: "",
        //             deleted_date: "",
        //             deleted_by: "",
        //             is_deleted: false,
        //             remarks: "",
        //         },
        //         {
        //             id: uuidv4(),
        //             work_plan_category_id: 1,
        //             work_plan_id: "6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
        //             activities_tasks: "Scanning of the liquidation payment requirements",
        //             expected_output: "Scanned the liquidation documents",
        //             timeline_from: new Date(),
        //             timeline_to: new Date(),
        //             assigned_person_id: "",
        //             status_id: 0,
        //             created_date: new Date().toString(),
        //             created_by: session.userData.email!,
        //             last_modified_date: "",
        //             last_modified_by: "",
        //             push_status_id: 1,
        //             push_date: "",
        //             deleted_date: "",
        //             deleted_by: "",
        //             is_deleted: false,
        //             remarks: "",
        //         },
        //         {
        //             id: uuidv4(),
        //             work_plan_category_id: 2,
        //             work_plan_id: "6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
        //             activities_tasks: "Generate payroll list for the month period of February and March.",
        //             expected_output: "Generated the payroll list covered the months of February and March. ",
        //             timeline_from: new Date(),
        //             timeline_to: new Date(),
        //             assigned_person_id: "8d148ae3-83d9-4caf-84c2-39238db6a4cc",
        //             status_id: 0,
        //             created_date: new Date().toString(),
        //             created_by: session.userData.email!,
        //             last_modified_date: "",
        //             last_modified_by: "",
        //             push_status_id: 1,
        //             push_date: "",
        //             deleted_date: "",
        //             deleted_by: "",
        //             is_deleted: false,
        //             remarks: "",
        //         },
        //     ])
        // }
    };

    const handleSaveAccomplishmentReport = () => {
        const id = `${ar?.id}`
        if (session?.userData.role == "Administrator") {
            (async () => {
                const raw = {
                    ...selectedStatus!,
                    id: uuidv4(),
                    record_id: id,
                    bene_id: user!.id,
                    module: "accomplishment report",
                    created_date: new Date().toISOString(),
                    created_by: session!.userData!.email!,
                    push_status_id: 0,
                }
                await dexieDb.submission_log.put(raw)
                if (raw.status == "2") {
                    const rev = {
                        id: payrollbene ? payrollbene.id : uuidv4(),
                        bene_id: user!.id,
                        daily_time_record_id: payrollbene?.daily_time_record_id || "",
                        daily_time_record_reviewed_date: payrollbene?.daily_time_record_reviewed_date || "",
                        accomplishment_report_id: id,
                        accomplishment_report_reviewed_date: new Date().toISOString(),
                        period_cover_from: getInitialDateRange().from!,
                        period_cover_to: getInitialDateRange().to!,
                        operation_reviewed_by: "",
                        odnpm_reviewed_by: "",
                        finance_reviewed_by: "",
                        operation_status: "",
                        operation_status_date: "",
                        odnpm_status: "",
                        odnpm_status_date: "",
                        finance_status: "",
                        finance_status_date: "",
                        date_released: "",
                        date_received: "",
                    }
                    await dexieDb.cfwpayroll_bene.put(rev)
                }
                toast({
                    variant: "green",
                    title: "Submit Review",
                    description: "Your review has been submitted!",
                });
            })();
        } else {
            (async () => {
                const raw = {
                    ...ar!,
                    status_id: 0,
                    created_date: ar?.created_date ?? new Date().toISOString(),
                    created_by: ar?.created_by ?? user!.email!,
                    last_modified_by: ar?.last_modified_by ?? user!.email!,
                    last_modified_date: new Date().toISOString(),
                    push_status_id: 0,
                    remarks: "",
                }
                if (id) {
                    await dexieDb.accomplishment_report.put(raw, id)
                    await dexieDb.accomplishment_actual_task.bulkPut(tasks,)
                    toast({
                        variant: "green",
                        title: "Accomplishment Report",
                        description: "Your update has been saved!",
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "Accomplishment Report",
                        description: "AR Id or user session is not yet ready",
                    });
                }
            })();
        }
    }

    return (
        <Card>
            <div id="print-section" className='print-small'>
                <CardHeader>
                    <CardTitle className="mb-2 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
                        <div className="flex-shrink-0">
                            <Image src="/images/logos.png" width={300} height={300} alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto" />
                        </div>
                        <div className="text-lg font-semibold mt-2 md:mt-0">
                            Accomplishment Report
                        </div>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <AccomplishmentUser
                        user={user}
                        date={date}
                        setDate={setDate}
                        session={session}
                        onChangeTask={setTasks}
                        accomplishmentReportId={ar?.id}
                        onSupervisorTypeChange={(user) => setSupervisor(user)}
                        supervisorType={supervisor}
                    />

                    {session?.userData.role == "Administrator" ?
                        <div className="m-3 no-print">
                            <AppSubmitReview
                                session={session!}
                                review_logs={submissionLogs}
                                options={statusesOptions}
                                review={selectedStatus}
                                onChange={(review) => setSelectedStatus(review)}
                                onSubmit={() => handleSaveAccomplishmentReport()}
                            />
                        </div> : <div className="flex justify-start gap-2 m-1 no-print">
                            <Button onClick={handleSaveAccomplishmentReport}>
                                <Edit className="mr-1 h-4 w-4" /> Save
                            </Button>
                            {lastStatus.status == "2" &&
                                <>
                                    <Button variant="outline" onClick={() => {
                                        const content = document.getElementById('print-section');
                                        if (!content) return;
                                        const style = document.createElement('style');
                                        style.innerHTML = `
                                            @media print { 
                                            @page {
                                                size: A4;
                                                margin: 0.8mm; /* Reduced margin for fitting the content */
                                            } 
                                            body {
                                                zoom: 69%;
                                                margin: 0;
                                                padding: 0;
                                                font-size: 12px; /* Keep the font-size consistent */
                                            } 
                                            #no-print{
                                                display: none;
                                            }
                                            #editable:empty:before {
                                                content: none;
                                                }
                                            /* This ensures the printed content scales without changing the original layout */
                                            .print-small {
                                                padding: 5px; /* Reduce padding to fit more content */
                                            } 
                                            /* Hide non-printable elements */
                                            .no-print {
                                                display: none;
                                            } 
                                            .ql-container.ql-snow {
                                                border: none;
                                                }
                                            /* Scale content without affecting the original layout */
                                            .no-scale {
                                                transform: scale(0.45);
                                                transform-origin: top left;
                                                width: 100%; /* Use full width */
                                                overflow: hidden;
                                            }
                                            }
                                        `;
                                        document.head.appendChild(style);
                                        const clone = content.cloneNode(true) as HTMLElement;
                                        const originalContents = document.body.innerHTML;
                                        document.body.innerHTML = '';
                                        document.body.appendChild(clone);
                                        window.print();
                                        document.body.innerHTML = originalContents;
                                        window.location.reload(); // Rebind React
                                    }}>
                                        <Printer className="mr-1 h-4 w-4" /> Print
                                    </Button>
                                    <Button variant="outline" onClick={() => console.log('Downloading PDF...')}>
                                        <Download className="mr-1 h-4 w-4" /> Download
                                    </Button>
                                </>}


                        </div>}
                </CardContent>
            </div>
        </Card>
    );
}