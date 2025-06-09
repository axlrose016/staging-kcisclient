"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ButtonEdit } from "@/components/actions/button-edit";
import { ButtonDelete } from "@/components/actions/button-delete";
import { fetchRoles } from "@/components/_dal/libraries";
import LoadingScreen from "@/components/general/loading-screen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppTable } from "@/components/app-table";
import { useRouter } from "next/navigation";
import { getOfflineLibRoles } from "@/components/_dal/offline-libraries";
import { PushStatusBadge } from "@/components/general/push-status-badge";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { SettingsService } from "../../SettingsService";
import { toast } from "@/hooks/use-toast";

export default function Roles() {
  const [roles, setRoles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const baseUrl = 'settings/libraries/roles'
  const settingsService = new SettingsService();

  async function loadRoles() {
    try {
      const data = await getOfflineLibRoles();
      setRoles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadRoles();
  }, []);

  if (loading) {
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
    const success = await settingsService.deleteData(dexieDb, "roles", row);
    if (success) {
      toast({
        variant: "green",
        title: "Success.",
        description: "Record successfully deleted!",
      })
      loadRoles();
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
          id: 'role description',
          header: 'Description',
          accessorKey: 'role_description',
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
                Library: Role
            </div>
        </CardTitle>

    </CardHeader>
    <CardContent>

        <div className="min-h-screen">
            <div className="min-h-screen">
                <AppTable
                    data={roles}
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
