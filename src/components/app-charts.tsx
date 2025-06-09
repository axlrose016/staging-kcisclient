"use client";

import React, { useEffect, useState, useRef } from 'react';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area,
    PieChart, Pie, Cell, ScatterChart, Scatter,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Sector,
    RadialBarChart, RadialBar,
    PolarRadiusAxis, Label
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartDownloader } from '@/components/chart-downloader';
import { ChartConfig as AppChartConfig } from './types';

interface AppChartProps {
    config: AppChartConfig;
}


const chartData = [{ month: "january", desktop: 1260, mobile: 570 }]
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function AppChart({ config }: AppChartProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const chartRef = useRef<HTMLDivElement>(null);

    const COLORS = [
        'hsl(var(--chart-1))',
        'hsl(var(--chart-2))',
        'hsl(var(--chart-3))',
        'hsl(var(--chart-4))',
        'hsl(var(--chart-5))'
    ];

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const renderActiveShape = (props: any) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        const sin = Math.sin(-midAngle * Math.PI / 180);
        const cos = Math.cos(-midAngle * Math.PI / 180);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                    {payload.name}
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Value: ${value}`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(${(percent * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    };

    const renderChart = () => {
        const {
            type,
            data,
            dataKeys,
            variant,
            orientation,
            showLegend,
            showGrid,
            showTooltip,
            xAxisKey,
            legendPosition = 'bottom'
        } = config;

        if (!data || data.length === 0) {
            return <div className="flex items-center justify-center h-full">No data available</div>;
        }

        const legendProps = showLegend ? {
            layout: legendPosition === 'left' || legendPosition === 'right' ? 'vertical' : 'horizontal',
            align: legendPosition === 'right' ? 'right' : legendPosition === 'left' ? 'left' : 'center',
            verticalAlign: legendPosition === 'bottom' ? 'bottom' : legendPosition === 'top' ? 'top' : 'middle'
        } : undefined;

        const totalValue = data.reduce((sum, item) => sum + (item[dataKeys[0]] || 0), 0);

        switch (type) {
            case 'radial':
                return (
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square w-full max-w-[250px]"
                    >
                        <RadialBarChart
                            data={chartData}
                            endAngle={180}
                            innerRadius={80}
                            outerRadius={130}
                        >
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) - 16}
                                                        className="fill-foreground text-2xl font-bold"
                                                    >
                                                        {totalValue.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 4}
                                                        className="fill-muted-foreground"
                                                    >
                                                        Visitors
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </PolarRadiusAxis>
                            <RadialBar
                                dataKey="desktop"
                                stackId="a"
                                cornerRadius={5}
                                fill="var(--color-desktop)"
                                className="stroke-transparent stroke-2"
                            />
                            <RadialBar
                                dataKey="mobile"
                                fill="var(--color-mobile)"
                                stackId="a"
                                cornerRadius={5}
                                className="stroke-transparent stroke-2"
                            />
                        </RadialBarChart>
                    </ChartContainer>
                );
            case 'bar':
                return (
                    <>
                        {orientation === "horizontal" ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={data}
                                    layout="horizontal"
                                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                >
                                    {showGrid && <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />}
                                    <XAxis dataKey={xAxisKey} />
                                    <YAxis />
                                    {showTooltip && <Tooltip />}
                                    {showLegend && <Legend {...legendProps} />}
                                    {dataKeys.map((key, index) => (
                                        <Bar
                                            key={key}
                                            dataKey={key}
                                            fill={COLORS[index % COLORS.length]}
                                            stackId={variant === 'stacked' ? 'stack' : undefined}
                                            label={variant === 'labeled' ? { position: 'top' } : undefined}
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={data}
                                    layout="vertical"
                                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                >
                                    {showGrid && <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />}
                                    <XAxis
                                        type="number"
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
                                    {showTooltip && <Tooltip />}
                                    {showLegend && <Legend {...legendProps} />}
                                    {dataKeys.map((key, index) => (
                                        <Bar
                                            key={key}
                                            dataKey={key}
                                            fill={COLORS[index % COLORS.length]}
                                            stackId={variant === 'stacked' ? 'stack' : undefined}
                                            label={variant === 'labeled' ? { position: 'right' } : undefined}
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </>
                );

            case 'line':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
                            <XAxis dataKey={xAxisKey} />
                            <YAxis />
                            {showTooltip && <Tooltip />}
                            {showLegend && <Legend {...legendProps} />}
                            {dataKeys.map((key, index) => (
                                <Line
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={COLORS[index % COLORS.length]}
                                    fill={variant === 'filled' ? COLORS[index % COLORS.length] : undefined}
                                    fillOpacity={variant === 'filled' ? 0.3 : 0}
                                    strokeWidth={2}
                                    activeDot={{ r: 8 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'area':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
                            <XAxis dataKey={xAxisKey} />
                            <YAxis />
                            {showTooltip && <Tooltip />}
                            {showLegend && <Legend {...legendProps} />}
                            {dataKeys.map((key, index) => (
                                <Area
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={COLORS[index % COLORS.length]}
                                    fill={COLORS[index % COLORS.length]}
                                    fillOpacity={0.6}
                                    stackId={variant === 'stacked' || variant === 'percentage' ? 'stack' : `stack${index}`}
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                );

            case 'pie':
                const dataKey = dataKeys[0] || 'value';
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            {variant === 'labeled' ? (
                                <Pie
                                    activeIndex={activeIndex}
                                    activeShape={renderActiveShape}
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={0}
                                    outerRadius={80}
                                    dataKey={dataKey}
                                    onMouseEnter={onPieEnter}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            ) : (
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    dataKey={dataKey}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            )}
                            {showTooltip && <Tooltip />}
                            {showLegend && <Legend {...legendProps} />}
                        </PieChart>
                    </ResponsiveContainer>
                );

            case 'donut':
                const donutDataKey = dataKeys[0] || 'value';
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            {variant === 'labeled' ? (
                                <Pie
                                    activeIndex={activeIndex}
                                    activeShape={renderActiveShape}
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    dataKey={donutDataKey}
                                    onMouseEnter={onPieEnter}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            ) : (
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    dataKey={donutDataKey}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            )}
                            {showTooltip && <Tooltip />}
                            {showLegend && <Legend {...legendProps} />}
                        </PieChart>
                    </ResponsiveContainer>
                );

            case 'scatter':
                const xKey = dataKeys[0] || 'x';
                const yKey = dataKeys[1] || dataKeys[0] || 'y';

                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
                            <XAxis type="number" dataKey={xKey} name={xKey} />
                            <YAxis type="number" dataKey={yKey} name={yKey} />
                            {showTooltip && <Tooltip cursor={{ strokeDasharray: '3 3' }} />}
                            {showLegend && <Legend {...legendProps} />}
                            <Scatter
                                name={`${xKey} vs ${yKey}`}
                                data={data}
                                fill={COLORS[0]}
                            />
                        </ScatterChart>
                    </ResponsiveContainer>
                );

            default:
                return <div>Unsupported chart type</div>;
        }
    };

    return (
        <Card className="w-full h-full overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{config.title}</CardTitle>
                    {config.description && <CardDescription>{config.description}</CardDescription>}
                </div>
                <ChartDownloader config={config} chartRef={chartRef} />
            </CardHeader>
            <CardContent>
                <ChartContainer>
                    <div ref={chartRef} className="w-full h-[500px]">
                        {renderChart()}
                    </div>
                    <ChartTooltip>
                        <ChartTooltipContent />
                    </ChartTooltip>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}