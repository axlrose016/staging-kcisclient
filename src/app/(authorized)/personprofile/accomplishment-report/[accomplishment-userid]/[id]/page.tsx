"use client";

import React, { useEffect, useState } from 'react';
import { addDays, endOfMonth, format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { SessionPayload } from '@/types/globals';
import { getSession } from '@/lib/sessions-client';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { IAccomplishmentActualTask, IAccomplishmentReport, ICFWAssessment, IPersonProfile, IWorkPlan } from '@/components/interfaces/personprofile';
import { ILibSchoolProfiles, LibraryOption } from '@/components/interfaces/library-interface';
import { v4 as uuidv4 } from 'uuid';
import { getOfflineLibStatuses } from '@/components/_dal/offline-options';
import { ICFWPayrollBene, ISubmissionLog } from '@/components/interfaces/cfw-payroll';
import AppSubmitReview from '@/components/app-submit-review';
import { AccomplishmentUser } from '@/components/accomplishment-user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download, Edit, Printer } from 'lucide-react';
import { IAttachments } from '@/components/interfaces/general/attachments';
import { libDb } from '@/db/offline/Dexie/databases/libraryDb';
import { v5 as uuidv5 } from 'uuid';
import { toast } from '@/hooks/use-toast';

export type UserTypes = IPersonProfile & ILibSchoolProfiles;

const baseUrl = "personprofile/accomplishment-report";
export default function AccomplishmentReportUser() {

    const router = useRouter();
    const params = useParams<{ 'accomplishment-userid': string; id: string }>()
    const [user, setUser] = useState<UserTypes>();
    const [supervisor, setSupervisor] = useState<any>();
    const [ar, setAR] = useState<IAccomplishmentReport>()
    const [attachments, setAttachments] = useState<IAttachments[]>([])
    const [tasks, setTasks] = useState<IAccomplishmentActualTask[]>([])
    const [assessment, setAssessment] = useState<ICFWAssessment>()


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
            const filteredStatuses = statuses.filter(status => [2, 10].includes(status.id));
            setStatusesOptions(filteredStatuses);


            setSession(_session)
            await getResults(_session)
        })();
    }, [date])

    const getResults = async (session: SessionPayload) => {
        const user = await dexieDb.person_profile.where('user_id')
            .equals(params!['accomplishment-userid']).first();
        console.log('p', { user, params, p: params!['accomplishment-userid'] })
        const merge = {
            ...await libDb.lib_school_profiles.where("id").equals(user!.school_id!).first(),
            ...user
        };
        setUser(merge as UserTypes);

        let period_cover = "";
        let r = "";
        if (date?.from && date?.to && user?.id) {
            period_cover = format(new Date(date!.from!)!.toISOString(), 'yyyyMMdd') + "-" + format(new Date(date!.to!)!.toISOString(), 'yyyyMMdd')
            r = uuidv5("accomplishment report" + "-" + period_cover, user.id);
        }
        console.log('getResults > uuidv5', { params, date, period_cover, params_id: params!.id, user_id: user?.user_id ?? "", r })

        const arId = r;
        // If the arId is different from the current URL param, update the URL (shallow routing) without refreshing the page
        if (params?.id !== arId && arId) {
            // Use window.history.replaceState to update the URL without reloading the page
            const newUrl = `/${baseUrl}/${params!['accomplishment-userid']}/${arId}`;
            window.history.replaceState(null, '', newUrl);
        }


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

        const assessment = await dexieDb.cfwassessment.where("person_profile_id").equals(user?.id || "").first();
        console.log('assessment', assessment)
        setAssessment(assessment)

        if (!assessment || assessment?.work_plan_id == null) {
            toast({
                variant: "destructive",
                title: "Assesment or Work Plan not found",
                description: "Please notify your supervisor to create an assessment or Work plan!   ",
            });
        }

        const raw = {
            id: arId,
            person_profile_id: user!.user_id,
            period_cover_from: date?.from ? format(new Date(date.from), "yyyy-MM-dd") : "",
            period_cover_to: date?.to ? format(new Date(date.to), "yyyy-MM-dd") : "",
            work_plan_id: assessment?.work_plan_id || "",
            accomplishment_actual_task: "",
            status_id: ar ? ar.status_id : 0,
            created_date: ar?.created_date ?? new Date().toISOString(),
            created_by: ar?.created_by ?? user!.email!,
            last_modified_by: ar?.last_modified_by ?? user!.email!,
            last_modified_date: new Date().toISOString(),
            push_status_id: 0,
            push_date: null,
            deleted_date: null,
            deleted_by: "",
            is_deleted: false,
            remarks: "",
        }

        setAR(raw)
        const attachments = await dexieDb.attachments.where("record_id").equals(arId).toArray()
        console.log('attachments', { raw, attachments })
        setAttachments(attachments)
    };

    const handleSaveAccomplishmentReport = () => {
        const id = `${ar?.id}`
        const module = "accomplishment report";
        if (["Administrator", "CFW Administrator", "CFW Immediate Supervisor"].includes(session?.userData.role!)) {
            (async () => {
                const raw = {
                    ...selectedStatus!,
                    id: uuidv4(),
                    record_id: id,
                    bene_id: user!.id,
                    module: module,
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
                        period_cover_from: date?.from!,
                        period_cover_to: date?.to!,
                        operation_reviewed_by: "",
                        odnpm_reviewed_by: "",
                        finance_reviewed_by: "",
                        operation_status: "",
                        operation_status_date: null,
                        odnpm_status: "",
                        odnpm_status_date: null,
                        finance_status: "",
                        finance_status_date: null,
                        date_released: null,
                        date_received: null,
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
                    await dexieDb.attachments.bulkPut(attachments)
                    console.log('handleSaveAccomplishmentReport > raw', raw);
                    console.log('handleSaveAccomplishmentReport > tasks', tasks);
                    console.log('handleSaveAccomplishmentReport > attachments', attachments);
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
                        disabled={session?.userData.role !== "CFW Beneficiary"}
                        assessment={assessment!}
                        user={user}
                        date={date}
                        setDate={setDate}
                        session={session}
                        onChangeTask={setTasks}
                        accomplishmentReportId={ar?.id}
                        onSupervisorTypeChange={(user) => setSupervisor(user)}
                        supervisorType={supervisor}
                        onChangeAttachments={setAttachments}
                    />

                    {["CFW Beneficiary"].includes(session?.userData.role!) &&
                        <div className="flex justify-start gap-2 m-1 no-print">
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
                                </>
                            }
                        </div>
                    }

                    <div className="m-1 no-print">
                        <AppSubmitReview
                            session={session!}
                            review_logs={submissionLogs}
                            options={statusesOptions}
                            review={selectedStatus}
                            onChange={(review) => setSelectedStatus(review)}
                            onSubmit={() => handleSaveAccomplishmentReport()}
                        />
                    </div>

                </CardContent>
            </div>
        </Card>
    );
}