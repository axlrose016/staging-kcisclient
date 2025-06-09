"use client"

import { AppTable } from "@/components/app-table";
import LoadingScreen from "@/components/general/loading-screen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import React from "react"
import { SettingsService } from "../SettingsService";
import { IUser } from "@/components/interfaces/iuser";
import { PushStatusBadge } from "@/components/general/push-status-badge";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { toast } from "@/hooks/use-toast";

export default function Users(){
    const [users, setUsers] = React.useState<IUser[] | undefined>(undefined);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();
    const baseUrl = 'settings/users'
    const settingsService = new SettingsService();

    async function loadUsers(){
        try{
            const data = await settingsService.getOfflineUsers() as any;
            setUsers(data);
        }catch(error){
            console.error(error);
        }finally{
            setLoading(false);
        }
    }

    React.useEffect(() => {
        loadUsers();
    }, []);


    if(loading){
        return <div>
            <LoadingScreen
                isLoading={loading}
                text={"Loading... Please wait."}
                style={"dots"}
                fullScreen={true}
                progress={0}
                timeout={0}
                onTimeout={() => console.log("Loading timed out")}
            />
        </div>
    }

    const handleEdit = (row: any) => {
        console.log('Edit:', row);
    };

    const handleDelete = async (row: any) => {
        const child: Record<string, { table: string; foreignKey: string }[]> = {
            "users": [
                { table: 'useraccess', foreignKey: 'user_id' },
            ],
        };
        const success = await settingsService.deleteData(dexieDb, "users", row,child);
        if(success){
            toast({
                variant: "green",
                title: "Success.",
                description: "Record successfully deleted!",
            })
            loadUsers();
        }
    };

    const handleRowClick = (row: any) => {
        console.log('Row clicked:', row);
        router.push(`/${baseUrl}/${row.id}`);
    };

    const handleAddNewRecord = (newRecord: any) => {
        console.log('handleAddNewRecord', newRecord)
        router.push(`/${baseUrl}/${newRecord.id}`);
    };

    const handleOnRefresh = async() => {
        const fetchedUsers = await settingsService.syncDownloadUsers();
        setUsers(fetchedUsers);
    }

    const handleOnSync = async() => {
        const success = await settingsService.syncBulkUserData();
        alert("Success" + success);
    }

     const columnsMasterlist = [
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
            id: 'user name',
            header: 'UserName',
            accessorKey: 'username',
            filterType: 'text',
            sortable: true,
            align: "left",
            cell: null,
        },
        {
            id: 'email',
            header: 'Email',
            accessorKey: 'email',
            filterType: 'text',
            sortable: true,
            align: "left",
            cell: null,
        },
        {
            id: 'role description',
            header: 'Role',
            accessorKey: 'role_description',
            filterType: 'text',
            sortable: true,
            align: "left",
            cell: null,
        },
        {
            id: 'level description',
            header: 'Level',
            accessorKey: 'level_description',
            filterType: 'text',
            sortable: true,
            align: "left",
            cell: null,
        },
    ];

    return(
        <Card>
        <CardHeader>
            <CardTitle className="mb-2 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
                {/* Logo Section */}
                <div className="flex-shrink-0">
                    <img src="/images/logos.png" alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto" />
                </div>

                {/* Title Section */}
                <div className="text-lg font-semibold mt-2 md:mt-0">
                    Users
                </div>
            </CardTitle>
        </CardHeader>
            <CardContent>
                <div className="min-h-screen">
                    <AppTable
                    data={users ?? []}
                    columns={columnsMasterlist}
                    onDelete={handleDelete}
                    onRowClick={handleRowClick}
                    onAddNewRecord={handleAddNewRecord}
                    onRefresh={handleOnRefresh}
                    onSync={handleOnSync}
                    />
                </div>
            </CardContent>
        </Card>
    )
}