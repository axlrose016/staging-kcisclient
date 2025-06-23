"use client"
import { AppTable } from '@/components/app-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { HRService } from '../../../../../../../../components/services/HRService';

function ApplicantList() {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();
    const hrService = new HRService();
    const params = useParams() || undefined; 
    const id = typeof params?.id === 'string' ? params.id : '';

    React.useEffect(() => {
        async function loadApplicants() {
          try {
            const data = await hrService.getOfflineApplicantsByDistributionId(id) as any;
            setData(data);
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        }
        loadApplicants();
      }, [id]);


    const baseUrl = 'hr-development/hiring-and-deployment/item-distribution/'

    const handleEdit = (row: any) => {
        console.log('Edit:', row);
    };

    const handleDelete = (row: any) => {
        console.log('Delete:', row);
    };

    const handleRowClick = (row: any) => {
        console.log('Row clicked:', row);
        router.push(`/${baseUrl}/form/${row.position_item_distribution_id}/applicants/form/${row.id}`);
    };

    const columnsMasterlist = [
      {
        id: 'first name',
        header: 'First Name',
        accessorKey: 'first_name',
        filterType: 'text',
        sortable: true,
        align: "left",
        cell: null,
      },
      {
        id: 'middle name',
        header: 'Middle Name',
        accessorKey: 'middle_name',
        filterType: 'text',
        sortable: true,
        align: "left",
        cell: null,
      },
      {
        id: 'last name',
        header: 'Last Name',
        accessorKey: 'last_name',
        filterType: 'text',
        sortable: true,
        align: "left",
        cell: null,
      },
      {
        id: 'division id',
        header: 'Division/Section/Unit',
        accessorKey: 'division',
        filterType: 'text',
        sortable: true,
        align: "left",
        cell: null,
      },
    ];

  return (
    <div>
    {/* <pre><h1>Person Profile</h1>{JSON.stringify(data, null, 2)}</pre> */}
      <AppTable
          data={data}
          columns={columnsMasterlist}
          onDelete={handleDelete}
          onRowClick={handleRowClick}
          onAddNewRecordNavigate={() => router.push(`/${baseUrl}/form/${id}/applicants/form/0`)}
      />
    </div>
  )
}

export default ApplicantList