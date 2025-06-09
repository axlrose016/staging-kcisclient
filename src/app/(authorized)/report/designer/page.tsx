"use client";

import React, { useEffect, useState, } from 'react'

import { AppTable } from '@/components/app-table';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import { IReportDesigner } from '@/components/interfaces/reportdesigner';
import Image from 'next/image';

const _session = await getSession() as SessionPayload;
const baseUrl = 'report/designer'

const columns = [
  {
    id: 'Name',
    header: 'Name',
    accessorKey: 'name',
    filterType: 'text',
    sortable: true,
  },
];

export default function MonitoringCFWList() {

  const router = useRouter();
  const [data, setData] = useState<IReportDesigner[]>([]);

  useEffect(() => {
    if (_session.userData.role != "Administrator") {
      router.push(`/${baseUrl}/${_session.id}`);
    } else {
      (async () => {
        try {
          if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open 
        } catch (error) {
          console.error('Error fetching data:', error);
        }

        setData(await dexieDb.report_designer.toArray())
      })();
    }
  }, [])

  const handleEditClick = (row: IReportDesigner) => {
    console.log('handleEditClick', row)
    router.push(`/${baseUrl}/${row.id}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-2 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Image src="/images/logos.png" width={300} height={300} alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto" />
          </div>

          {/* Title Section */}
          <div className="text-lg font-semibold mt-2 md:mt-0">
            Report Template
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>

        <div className="min-h-screen">
          <AppTable
            data={data}
            columns={columns}
            onClickAddNew={() => router.push(`/${baseUrl}/new`)}
            onClickEdit={handleEditClick}
          />
        </div>
      </CardContent>
    </Card>
  );
}