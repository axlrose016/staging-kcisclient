"use client";

import { AppChart } from '@/components/app-charts';
import { AppChartConfig, EXAMPLE_DATA } from '@/components/types';
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import React, { useEffect, useState } from 'react'
import { financedata } from './data';



const _session = await getSession() as SessionPayload;

function Page() {

  const [, setSession] = useState<SessionPayload>();
  // const [data, setData] = useState([]);

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
        // setData(data)
      } catch (error) {
        console.error('Error fetching charts data:', error);
      }
    })();
  }, [])

  const data = financedata;

  console.log('data', data)

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
        <AppChart config={{
          title: 'NO. OF ENDORSED POTENTIAL BENEFICIARIES FROM HEIs',
          description: 'description',
          type: "donut",
          variant: "default",
          data: data,
          dataKeys: ['ALLOCATION'],
          xAxisKey: "REGION",
          orientation: "vertical",
          showLegend: true,
          showGrid: true,
          showTooltip: true,
          legendPosition: 'bottom'
        } as AppChartConfig} />


        <AppChart config={{
          title: 'NO. OF ENDORSED POTENTIAL BENEFICIARIES FROM HEIs',
          description: 'description',
          type: "donut",
          variant: "filled",
          data: data,
          dataKeys: ['total_no_of_graduate'],
          xAxisKey: "",
          orientation: "vertical",
          showLegend: true,
          showGrid: true,
          showTooltip: true,
          legendPosition: 'bottom'
        } as AppChartConfig} />


        <AppChart config={{
          title: 'NO. OF ENDORSED POTENTIAL BENEFICIARIES FROM HEIs',
          description: 'description',
          type: "donut",
          variant: "labeled",
          data: data,
          dataKeys: ['total_no_of_graduate'],
          xAxisKey: "",
          orientation: "vertical",
          showLegend: true,
          showGrid: true,
          showTooltip: true,
          legendPosition: 'bottom'
        } as AppChartConfig} />

        <AppChart config={{
          title: 'NO. OF ENDORSED POTENTIAL BENEFICIARIES FROM HEIs',
          description: 'description',
          type: "donut",
          variant: "percentage",
          data: data,
          dataKeys: ['total_no_of_graduate'],
          xAxisKey: "",
          orientation: "vertical",
          showLegend: true,
          showGrid: true,
          showTooltip: true,
          legendPosition: 'bottom'
        } as AppChartConfig} />

        <AppChart config={config} />
        <AppChart config={config} />
        <AppChart config={config} />
      </div>
    </div>
  )
}

export default Page