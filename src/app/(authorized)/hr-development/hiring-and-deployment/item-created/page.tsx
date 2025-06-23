"use client"
import { AppTable } from '@/components/app-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IPositionItem } from '@/db/offline/Dexie/schema/hr-service';
import { useRouter } from 'next/navigation';
import React from 'react'
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { FolderInput, PlusCircle } from 'lucide-react';
import { HRService } from '../../../../../components/services/HRService';

function ItemCreated() {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();
    const hrService = new HRService();

    React.useEffect(() => {
      async function loadRoles() {
        try {
          const data = await hrService.getOfflinePositionItems() as any;
          setData(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
      loadRoles();
    }, []);


    const baseUrl = 'hr-development/hiring-and-deployment/item-created/'
    const distributeUrl = 'hr-development/hiring-and-deployment/item-distribution/'

    const handleEdit = (row: any) => {
        console.log('Edit:', row);
    };

    const handleDelete = (row: any) => {
        console.log('Delete:', row);
    };

    const handleCreateDistribute = (row: any) => {
      router.push(`/${distributeUrl}/form/page?parentId=`+row+"&id=0");
    };

    const handleRowClick = (row: any) => {
      console.log('Row clicked:', row);
      router.push(`/${baseUrl}/form/${row.id}`);
    };

    const columnsMasterlist = [
      // {
      //   id: 'record_id', 
      //   header: 'Shortcut',
      //   accessorKey: 'id',
      //   filterType: null,
      //   sortable: false,
      //   align: "center",
      //   cell: (value: any) => 
      //     <TooltipProvider>
      //       <Tooltip>
      //         <TooltipTrigger asChild>
      //           <Button
      //             variant="ghost"
      //             size="icon"
      //             className="h-8 w-8"
      //             onClick={(e) => {
      //               e.stopPropagation();
      //               handleCreateDistribute(value);
      //             }}
      //             //disabled={isRefreshing}
      //           >
      //             <FolderInput className="h-4 w-4" />
      //           </Button>
      //         </TooltipTrigger>
      //         <TooltipContent>Create Item Distribution</TooltipContent>
      //       </Tooltip>
      //     </TooltipProvider>
          
      // },
      {
          id: 'item code',
          header: 'Item Code',
          accessorKey: 'item_code',
          filterType: 'text',
          sortable: true,
          align: "left",
          cell: null,
      },
      {
          id: 'position id',
          header: 'Position',
          accessorKey: 'position_description',
          filterType: 'text',
          sortable: true,
          align: "left",
          cell: null,
      },
      {
          id: 'salary grade id',
          header: 'Salary Grade',
          accessorKey: 'salary_grade_id',
          filterType: 'text',
          sortable: true,
          align: "left",
          cell: null,
      },
      {
          id: 'employment status id',
          header: 'Employment Status',
          accessorKey: 'employment_status_description',
          filterType: 'text',
          sortable: true,
          align: "left",
          cell: null,
      },
      {
          id: 'modality id',
          header: 'Modality',
          accessorKey: 'modality_name',
          filterType: 'text',
          sortable: true,
          align: "left",
          cell: null,
      },
    ];

  return (
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
                Position: Item-Created
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

export default ItemCreated