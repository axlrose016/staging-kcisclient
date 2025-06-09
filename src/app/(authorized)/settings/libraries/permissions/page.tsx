"use client"

import { fetchPermissions } from "@/components/_dal/libraries";
import { getOfflineLibPermissions } from "@/components/_dal/offline-libraries";
import { ButtonDelete } from "@/components/actions/button-delete";
import { ButtonEdit } from "@/components/actions/button-edit";
import { AppTable } from "@/components/app-table";
import LoadingScreen from "@/components/general/loading-screen";
import { PushStatusBadge } from "@/components/general/push-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getLibrary } from "@/lib/libraries";
import { useRouter } from "next/navigation";
import React from "react";
import { SettingsService } from "../../SettingsService";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { toast } from "@/hooks/use-toast";

export default function Permissions() {
    const [permissions, setPermissions] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();
    const baseUrl = 'settings/libraries/permissions'
    const settingsService = new SettingsService();


    async function loadPermissions(){
        try{
            const data = await getOfflineLibPermissions();
            setPermissions(data);
        } catch(error){
            console.error(error);
        } finally{
            setLoading(false);
        }
    }

    React.useEffect(() => {
        loadPermissions();
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
    const success = await settingsService.deleteData(dexieDb, "permissions", row);
        if (success) {
        toast({
            variant: "green",
            title: "Success.",
            description: "Record successfully deleted!",
        })
        loadPermissions();
    }
    };

  const handleRowClick = (row: any) => {
      console.log('Row clicked:', row);
      router.push(`/${baseUrl}/form/${row.id}`);
  };

  const handleAddNewRecord = (newRecord: any) => {
      console.log('handleAddNewRecord', newRecord)
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
            id: 'permission description',
            header: 'Description',
            accessorKey: 'permission_description',
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
                  Library: Permissions
              </div>
          </CardTitle>

      </CardHeader>
      <CardContent>

          <div className="min-h-screen">
              <div className="min-h-screen">
                  <AppTable
                      data={permissions}
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

