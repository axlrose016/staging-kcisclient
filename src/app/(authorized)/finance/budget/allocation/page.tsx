"use client"
import { AppTable } from '@/components/app-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation';
import React from 'react'
import { FinanceService } from '../../../../../components/services/FinanceService';
import { SettingsService } from '@/components/services/SettingsService';
import { PushStatusBadge } from '@/components/general/push-status-badge';
import { financeDb } from '@/db/offline/Dexie/databases/financeDb';
import { toast } from '@/hooks/use-toast';

function AllocationMasterlist() {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();
    const financeService = new FinanceService();
    const settingsService = new SettingsService();

    async function loadAllocations() {
        try {
          const data = await financeService.getOfflineAllocations() as any;
          setData(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    React.useEffect(() => {
        loadAllocations();
      }, []);


    const baseUrl = 'finance/budget/allocation'

    const handleEdit = (row: any) => {
        console.log('Edit:', row);
    };

    const handleDelete =async(row: any) => {
      const child: Record<string, {table: string; foreignKey: string}[]> = {
        "allocation":[
          {table: 'allocation_uacs', foreignKey:'allocation_id'},
        ],
        "allocation_uacs":[
          {table: 'monthly_obligation_plan', foreignKey:'allocation_uacs_id'}
        ]
      };
      const success = await settingsService.deleteData(financeDb, "allocation",row, child);
      if(success){
        toast({
          variant:"green",
          title: "Success.",
          description: "Record successfully deleted!",
        });
        loadAllocations();
      }
    };

    const handleRowClick = (row: any) => {
      // if(row.uacs_id != undefined){
      //   router.push(`/${baseUrl}/form/${row.id}/uacs/${row.uacs_id}`)        
      // }
      // else{
        router.push(`/${baseUrl}/form/${row.id}`);
      //}
    };

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
          id: 'region',
          header: 'Region',
          accessorKey: 'region_code',
          filterType: 'text',
          sortable: true,
          align: "left",
          cell: null,
      },
      {
          id: 'fund source name',
          header: 'Fund Source',
          accessorKey: 'fund_source_name',
          filterType: 'text',
          sortable: true,
          align: "left",
          cell: null,
      },
      {
          id: 'modality name',
          header: 'Modality',
          accessorKey: 'modality_name',
          filterType: 'text',
          sortable: true,
          align: "left",
          cell: null,
      },
      {
          id: 'budget year description',
          header: 'Budget Year',
          accessorKey: 'budget_year_description',
          filterType: 'text',
          sortable: true,
          align: "right",
          cell: null,
      },
      {
          id: 'appropriation source description',
          header: 'Appropriation Source',
          accessorKey: 'appropriation_source_description',
          filterType: 'text',
          sortable: true,
          align: "left",
          cell: null,
      },
      {
          id: 'appropration type description',
          header: 'Appropriation Type',
          accessorKey: 'appropriation_type_description',
          filterType: 'text',
          sortable: true,
          align: "left",
          cell: null,
      },
      {
          id: 'expense description',
          header: 'Expense',
          accessorKey: 'expense_description',
          filterType: 'text',
          sortable: true,
          align: "left",
          cell: null,
      },
      {
          id: 'allocation amount',
          header: 'Amount',
          accessorKey: 'allocation_amount',
          filterType: null,
          sortable: true,
          align: "right",
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
                WFP Allocation
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

export default AllocationMasterlist