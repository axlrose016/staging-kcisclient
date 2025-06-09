"use client";

import { AppChart } from '@/components/app-charts';
import { AppChartConfig, EXAMPLE_DATA } from '@/components/types';
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import React, { useEffect, useState } from 'react'



const _session = await getSession() as SessionPayload;

function Page() {

  const [session, setSession] = useState<SessionPayload>();

  useEffect(() => {
    (async () => {
      setSession(_session)
      try {
        const response = await fetch('https://kcnfms.dswd.gov.ph/kcis/api/cfw_dashboard/view/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${_session?.token}`
          },
          body: JSON.stringify({})
        });
        const data = await response.json();
        console.log('Charts data:', data);
      } catch (error) {
        console.error('Error fetching charts data:', error);
      }
    })();
  }, [])

  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const config: AppChartConfig = {
    title: 'Monthly Values',
    description: 'Comparison of monthly values across different metrics',
    type: "bar",
    variant: "default",
    data: EXAMPLE_DATA,
    dataKeys: ['value', 'value2', 'value3'],
    xAxisKey: 'name',
    orientation: "vertical",
    showLegend: true,
    showGrid: true,
    showTooltip: true,
    legendPosition: 'bottom'
  };



  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7x h-[50vh] mx-auto">
        <AppChart config={config} />
      </div>
    </div>
  )
}

export default Page