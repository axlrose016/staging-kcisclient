"use client"
import { LibrariesService } from "@/components/services/LibrariesService";
import { AppTable } from "@/components/app-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function ListDivision() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const libService = new LibrariesService();

    useEffect(() => {
        async function loadDivision(){
            try{
                const data = await libService.getOfflineLibDivision() as any;
                setData(data);
            }catch(error){
                console.error(error);
            }finally{
                setLoading(false);
            }
        }
        loadDivision();
    }, []);

    const baseUrl = 'hr-development/configuration/divisions'

    const handleEdit = (row: any) => {
        console.log('Edit:', row);
    };

    const handleDelete = (row: any) => {
        console.log('Delete:', row);
    };

    const handleRowClick = (row: any) => {
      console.log('Row clicked:', row);
      router.push(`/${baseUrl}/form/${row.id}`);
    };

    const columnsMasterlist =[
        {
          id: 'division id',
          header: 'ID',
          accessorKey: 'id',
          filterType: 'text',
          sortable: true,
          align: "left",
          cell: null,
        },
        {
          id: 'division description',
          header: 'Description',
          accessorKey: 'division_description',
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
                    Library: Divisions
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

export default ListDivision