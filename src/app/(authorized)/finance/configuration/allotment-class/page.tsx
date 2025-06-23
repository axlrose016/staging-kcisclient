"use client"
import { LibrariesService } from "@/components/services/LibrariesService";
import { SettingsService } from "@/components/services/SettingsService";
import { AppTable } from "@/components/app-table";
import { PushStatusBadge } from "@/components/general/push-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { libDb } from "@/db/offline/Dexie/databases/libraryDb";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function ListAllotmentClass() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const libService = new LibrariesService();
    const settingsService = new SettingsService();
    
    async function loadAllotmentClass(){
        try{
            const data = await libService.getOfflineAllotmentClass() as any;
            setData(data);
        }catch(error){
            console.error(error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAllotmentClass();
    }, []);

    const baseUrl = 'finance/configuration/allotment-class'

    const handleEdit = (row: any) => {
        console.log('Edit:', row);
    };

    const handleDelete = async (row: any) => {
        const success = await settingsService.deleteData(libDb, "lib_allotment_class", row);
        if (success) {
        toast({
            variant: "green",
            title: "Success.",
            description: "Record successfully deleted!",
        })
        loadAllotmentClass();
    }
    };

    const handleRowClick = (row: any) => {
      console.log('Row clicked:', row);
      router.push(`/${baseUrl}/form/${row.id}`);
    };

    const columnsMasterlist =[
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
          id: 'allotment class desc',
          header: 'Description',
          accessorKey: 'allotment_class_description',
          filterType: 'text',   
          sortable: true,
          align: "left",
          cell: null,
        },
    ];

    return(
    <Card>
        {/* <pre><h1>Person Profile</h1>{JSON.stringify(data, null, 2)}</pre> */}
        <CardHeader>
            <CardTitle className="mb-2 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
                {/* Logo Section */}
                <div className="flex-shrink-0">
                    <img src="/images/logos.png" alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto" />
                </div>

                {/* Title Section */}
                <div className="text-lg font-semibold mt-2 md:mt-0">
                    Library: Allotment Class
                </div>
            </CardTitle>

        </CardHeader>
        <CardContent>
            <div className="min-h-screen">
                <div className="min-h-screen">
                    <AppTable
                        data={data}
                        columns={columnsMasterlist}
                        onDelete={handleDelete}
                        onRowClick={handleRowClick}
                        onAddNewRecordNavigate={() => router.push(`/${baseUrl}/form/0`)}
                    />
                </div>
            </div>

        </CardContent>
        </Card>
    )
}

export default ListAllotmentClass