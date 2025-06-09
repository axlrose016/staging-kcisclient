"use client"
import { AppTable } from '@/components/app-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IPositionItem } from '@/db/offline/Dexie/schema/hr-service';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { FolderInput, PlusCircle } from 'lucide-react';
import { FinanceService } from '../../FinanceService';

function AllotmentMasterlist() {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();
    const financeService = new FinanceService();
      React.useEffect(() => {
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
          loadAllocations();
        }, []);


    const baseUrl = 'finance/budget/allotment/'

    const handleEdit = (row: any) => {
        console.log('Edit:', row);
    };

    const handleDelete = (row: any) => {
        console.log('Delete:', row);
    };

    const handleRowClick = (row: any) => {
      console.log('Row clicked:', row);
      router.push(`/${baseUrl}/form/${row.id}?uacsId=${row.uacs_id}`);
    };

   const columnsMasterlist = [
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
          id: 'pap descriotion',
          header: 'PAP',
          accessorKey: 'pap_description',
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
          filterType: 'number',
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
                Allotment
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
                />
            </div>
        </div>

    </CardContent>
    </Card>
  )
}

export default AllotmentMasterlist