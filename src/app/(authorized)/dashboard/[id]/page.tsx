 'use client';

import { AppTable } from '@/components/app-table' 
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookAIcon, GraduationCapIcon, HandCoinsIcon, MegaphoneIcon, RocketIcon, Share2Icon, TargetIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts'


// Sample data for different chart types

// Sample data for bar and line charts
export const samplePageData = [
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

// Sample data for pie charts
export const samplePieData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
    { name: 'Group E', value: 100 },
];

// Sample data for radial charts
export const sampleRadialData = [
    { name: '18-24', value: 60 },
    { name: '25-34', value: 75 },
    { name: '35-44', value: 40 },
    { name: '45-54', value: 30 },
    { name: '55-64', value: 20 },
    { name: '65+', value: 10 },
];

// Sample data for revenue
export const sampleRevenueData = [
    { month: 'Jan', revenue: 4000, profit: 2400, cost: 1600 },
    { month: 'Feb', revenue: 3000, profit: 1398, cost: 1602 },
    { month: 'Mar', revenue: 9800, profit: 2000, cost: 7800 },
    { month: 'Apr', revenue: 3908, profit: 2780, cost: 1128 },
    { month: 'May', revenue: 4800, profit: 1890, cost: 2910 },
    { month: 'Jun', revenue: 3800, profit: 2390, cost: 1410 },
    { month: 'Jul', revenue: 4300, profit: 3490, cost: 810 },
    { month: 'Aug', revenue: 5200, profit: 3100, cost: 2100 },
    { month: 'Sep', revenue: 4800, profit: 2400, cost: 2400 },
    { month: 'Oct', revenue: 6000, profit: 3200, cost: 2800 },
    { month: 'Nov', revenue: 5500, profit: 2900, cost: 2600 },
    { month: 'Dec', revenue: 7000, profit: 3800, cost: 3200 },
];

// Sample data for product categories
export const sampleProductData = [
    { category: 'Electronics', sales: 4500, target: 5000 },
    { category: 'Clothing', sales: 3100, target: 3000 },
    { category: 'Home', sales: 2800, target: 3500 },
    { category: 'Beauty', sales: 2200, target: 2000 },
    { category: 'Sports', sales: 1800, target: 2500 },
    { category: 'Books', sales: 1500, target: 1200 },
];

// Custom tooltip component
const CustomTooltip = ({
    active,
    payload,
    label,
}: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border border-border rounded-md shadow-sm">
                <p className="font-medium text-sm">{`${label}`}</p>
                <p className="text-[#4DB6AC] text-sm">{`Target: ${payload[0].value}`}</p>
                <p className="text-[#FFD54F] text-sm">{`Total Served: ${payload[1].value}`}</p>
            </div>
        );
    }
    return null;
};


interface TargetChartProps {
    data: ChartDataItem[];
    title?: string;
    className?: string;
}


export interface ChartDataItem {
    name: string;
    target: number;
    served: number;
}
;

export default function Dashboard() {

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const data: ChartDataItem[] = [
        { name: 'CAR', target: 558, served: 0 },
        { name: 'I', target: 900, served: 0 },
        { name: 'II', target: 600, served: 0 },
        { name: 'III', target: 2700, served: 0 },
        { name: 'CALABARZON', target: 4200, served: 100 },
        { name: 'MIMAROPA', target: 300, served: 0 },
        { name: 'V', target: 300, served: 0 },
        { name: 'VI', target: 250, served: 0 },
        { name: 'NIR', target: 300, served: 0 },
        { name: 'VII', target: 600, served: 0 },
        { name: 'VIII', target: 900, served: 0 },
        { name: 'IX', target: 600, served: 0 },
        { name: 'X', target: 600, served: 0 },
        { name: 'XI', target: 900, served: 0 },
        { name: 'XII', target: 250, served: 0 },
        { name: 'Caraga', target: 510, served: 0 },
        { name: 'NPMO/NCR', target: 1800, served: 0 },
    ]

    // Calculate maximum value for chart layout
    const maxValue = Math.max(
        ...data.map((item) => Math.max(item.target, item.served))
    );
    const roundedMax = Math.ceil(maxValue / 1000) * 1000;

    // Handle bar hover
    const handleBarMouseEnter = (data: any, index: number) => {
        setActiveIndex(index);
    };

    const handleBarMouseLeave = () => {
        setActiveIndex(null);
    };


    // Bar Chart Configuration
    const barChartConfig: ChartConfig = {
        data: samplePageData,
        type: 'bar',
        options: {
            title: 'Simple Bar Chart',
            series: [
                { dataKey: 'uv', name: 'User Views' },
                { dataKey: 'pv', name: 'Page Views' }
            ]
        }
    }

    // Stacked Bar Chart Configuration
    const stackedBarChartConfig: ChartConfig = {
        data: samplePageData,
        type: 'bar',
        variant: 'stacked',
        options: {
            title: 'Stacked Bar Chart',
            series: [
                { dataKey: 'uv', name: 'User Views' },
                { dataKey: 'pv', name: 'Page Views' }
            ]
        }
    }

    // Line Chart Configuration
    const lineChartConfig: ChartConfig = {
        data: samplePageData,
        type: 'line',
        options: {
            title: 'Simple Line Chart',
            series: [
                { dataKey: 'uv', name: 'User Views' },
                { dataKey: 'pv', name: 'Page Views' }
            ]
        }
    }

    // Pie Chart Configuration
    const pieChartConfig: ChartConfig = {
        data: samplePieData,
        type: 'pie',
        options: {
            title: 'Simple Pie Chart',
            series: [
                { dataKey: 'value', name: 'Group' }
            ]
        }
    }

    // Radial Chart Configuration
    const radialChartConfig: ChartConfig = {
        data: sampleRadialData,
        type: 'radial',
        options: {
            title: 'Age Distribution',
            series: [
                { dataKey: 'value', name: 'Age Group' }
            ]
        }
    }

    // Revenue Chart Configuration
    const revenueChartConfig: ChartConfig = {
        data: sampleRevenueData,
        type: 'line',
        options: {
            title: 'Monthly Revenue',
            xAxis: { dataKey: 'month' },
            series: [
                { dataKey: 'revenue', name: 'Revenue' },
                { dataKey: 'profit', name: 'Profit' }
            ]
        }
    }

    // Product Category Chart
    const productChartConfig: ChartConfig = {
        data: sampleProductData,
        type: 'bar',
        variant: 'stacked',
        options: {
            title: 'Product Category Performance',
            xAxis: { dataKey: 'category' },
            series: [
                { dataKey: 'sales', name: 'Sales' },
                { dataKey: 'target', name: 'Target' }
            ],
            legend: {
                show: true,
                verticalAlign: 'top',
                align: 'right'
            }
        }
    }

    return (
        <>
            <div className='flex flex-col h-full'>
                <p className='font-bold text-2xl my-2'>CFW HEI's PHYSICAL & FINANCIAL </p>
                <div className='flex flex-col md:flex-row  gap-2 flex-1'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex w-[420px] flex-col md:flex-row gap-2 '>
                            <Card>
                                <CardContent className='flex flex-col p-2 gap-2 items-center'>
                                    <span className='font-bold'>SERVED</span>
                                    <div className='flex gap-2 items-center'>
                                        <TargetIcon className='h-5 w-5' />
                                        <div className='flex flex-col'>
                                            <span className='font-bold text-xs'>STUDENTS</span>
                                            <small>16,168</small>
                                        </div>
                                    </div>
                                    <hr className='h-1 w-full' />
                                    <div className='flex gap-2 items-center'>
                                        <TargetIcon className='h-5 w-5' />
                                        <div className='flex flex-col'>
                                            <span className='font-bold text-xs'>GRADUATES</span>
                                            <small>16,168</small>
                                        </div>
                                    </div>
                                    <hr className='h-1 w-full' />
                                </CardContent>

                            </Card>
                            <div className='grid grid-cols-2 gap-2 flex-1'>
                                <Card>
                                    <CardContent className='flex p-2 gap-2 items-center'>
                                        <TargetIcon className='h-12 w-12' />
                                        <div className='flex flex-col'>
                                            <span className='font-bold text-lg'>TARGETS</span>
                                            <span>16,168</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className='flex p-2 gap-2 items-center'>
                                        <Share2Icon className='h-12 w-12' />
                                        <div className='flex flex-col'>
                                            <span className='font-bold text-lg'>ENDORSED</span>
                                            <span>9,807</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className='flex p-2 gap-2 items-center'>
                                        <BookAIcon className='h-12 w-12' />
                                        <div className='flex flex-col'>
                                            <span className='font-bold text-lg'>STUDENTS</span>
                                            <span>5,322</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className='flex p-2 gap-2 items-center'>
                                        <MegaphoneIcon className='h-12 w-12' />
                                        <div className='flex flex-col'>
                                            <span className='font-bold text-lg'>ORIENTED</span>
                                            <span>2,609</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className='flex p-2 gap-2 items-center'>
                                        <GraduationCapIcon className='h-12 w-12' />
                                        <div className='flex flex-col'>
                                            <span className='font-bold text-lg'>GRADUATES</span>
                                            <span>4,485</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className='flex p-2 gap-2 items-center'>
                                        <RocketIcon className='h-12 w-12' />
                                        <div className='flex flex-col'>
                                            <span className='font-bold text-lg'>DEPLOYED</span>
                                            <span>529</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <Card>
                            <CardContent className='p-2'>
                                <div className="h-[650px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={data}
                                            layout="vertical"
                                            margin={{ top: 10, right: 30, left: 80, bottom: 20 }}
                                            barGap={4}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                            <XAxis
                                                type="number"
                                                domain={[0, roundedMax]}
                                                tickCount={6}
                                                tickFormatter={(value) => {
                                                    if (value >= 1000) {
                                                        return `${value / 1000}K`;
                                                    }
                                                    return value.toString();
                                                }}
                                            />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                width={80}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar
                                                dataKey="target"
                                                fill="#4DB6AC"
                                                radius={[4, 4, 4, 4]}
                                                onMouseEnter={handleBarMouseEnter}
                                                onMouseLeave={handleBarMouseLeave}
                                                animationDuration={1500}
                                                label={{
                                                    position: "right",
                                                    fill: "#4DB6AC",
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    formatter: (value) => value,
                                                }}
                                            />
                                            <Bar
                                                dataKey="served"
                                                fill="#FFD54F"
                                                radius={[4, 4, 4, 4]}
                                                onMouseEnter={handleBarMouseEnter}
                                                onMouseLeave={handleBarMouseLeave}
                                                animationDuration={1500}
                                                // animationDelay={300}
                                                label={{
                                                    position: "right",
                                                    fill: "#FFD54F",
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    formatter: (value) => value > 0 ? value : "",
                                                }}
                                            />
                                            <Legend />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className='flex flex-col flex-1 gap-2'>
                        <Card>
                            <CardContent className='flex p-2 gap-4 items-center justify-around'>
                                <div className='flex gap-2'>
                                    <div className='flex gap-2'>
                                        <HandCoinsIcon className='h-12 w-12' />
                                        <div className='flex flex-col'>
                                            <div className='flex flex-col'>
                                                <p className='font-bold'>ALLOTMENT</p>
                                                <p className="text-2xl">100,000</p>
                                                <small>100%</small>
                                            </div>
                                            <Progress
                                                value={100}
                                                className="bg-gray-200"
                                                indicatorColor="bg-green-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='flex gap-2'>
                                    <div className='flex gap-2'>
                                        <HandCoinsIcon className='h-12 w-12' />
                                        <div className='flex flex-col'>
                                            <div className='flex flex-col'>
                                                <p className='font-bold'>ALLOTMENT</p>
                                                <p className="text-2xl">100,000</p>
                                                <small>100%</small>
                                            </div>
                                            <Progress
                                                value={100}
                                                className="bg-gray-200"
                                                indicatorColor="bg-green-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex gap-2'>
                                    <div className='flex gap-2'>
                                        <HandCoinsIcon className='h-12 w-12' />
                                        <div className='flex flex-col'>
                                            <div className='flex flex-col'>
                                                <p className='font-bold'>ALLOTMENT</p>
                                                <p className="text-2xl">100,000</p>
                                                <small>100%</small>
                                            </div>
                                            <Progress
                                                value={100}
                                                className="bg-gray-200"
                                                indicatorColor="bg-green-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                        <Card className='max-w-[49vw]'>
                            <AppTable
                                simpleView
                                columns={[
                                    "REGION",
                                    "ALLOTMENT",
                                    "OBLIGATED",
                                    "UNOBLIGATED BAL.",
                                    "DISBURSED",
                                    "UNDISBURSED",
                                    "LIQUIDATION",
                                    "UNLIQUIDATED",
                                    "OBLI %",
                                    "DISB. %",
                                    "LIQUID. %"
                                ].map((key, idx) => ({
                                    id: key,
                                    header: key,
                                    accessorKey: key,
                                    filterType: 'text',
                                    sortable: true,
                                }))
                                } data={[]} />
                        </Card>
                    </div>
                </div> 
                <div>
                    Data Last Updated: 5/20/2025 9:55:AM | Privacy Policy
                </div>
            </div>
        </>
        // <div className='flex flex-wrap gap-2'>
        //     <Card>
        //         <CardContent className='flex p-2 gap-2 items-center'>
        //             <TargetIcon className='h-12 w-12' />
        //             <div className='flex flex-col'>
        //                 <span className='font-bold text-lg'>TARGETS</span>
        //                 <span>16,168</span>
        //             </div>
        //         </CardContent>
        //     </Card>
        //     <Card>
        //         <CardContent className='flex p-2 gap-2 items-center'>
        //             <Share2Icon className='h-12 w-12' />
        //             <div className='flex flex-col'>
        //                 <span className='font-bold text-lg'>ENDORSED</span>
        //                 <span>9,807</span>
        //             </div>
        //         </CardContent>
        //     </Card>
        //     <Card>
        //         <CardContent className='flex p-2 gap-2 items-center'>
        //             <BookAIcon className='h-12 w-12' />
        //             <div className='flex flex-col'>
        //                 <span className='font-bold text-lg'>STUDENTS</span>
        //                 <span>5,322</span>
        //             </div>
        //         </CardContent>
        //     </Card>
        //     <Card>
        //         <CardContent className='flex p-2 gap-2 items-center'>
        //             <MegaphoneIcon className='h-12 w-12' />
        //             <div className='flex flex-col'>
        //                 <span className='font-bold text-lg'>ORIENTED</span>
        //                 <span>2,609</span>
        //             </div>
        //         </CardContent>
        //     </Card>
        //     <Card>
        //         <CardContent className='flex p-2 gap-2 items-center'>
        //             <GraduationCapIcon className='h-12 w-12' />
        //             <div className='flex flex-col'>
        //                 <span className='font-bold text-lg'>GRADUATES</span>
        //                 <span>4,485</span>
        //             </div>
        //         </CardContent>
        //     </Card>
        //     <Card>
        //         <CardContent className='flex p-2 gap-2 items-center'>
        //             <RocketIcon className='h-12 w-12' />
        //             <div className='flex flex-col'>
        //                 <span className='font-bold text-lg'>DEPLOYED</span>
        //                 <span>529</span>
        //             </div>
        //         </CardContent>
        //     </Card>

        // </div>
    )
}