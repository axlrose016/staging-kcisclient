import { financedata } from "./sample-data"

export type ChartConfig = {
    id: string
    type: string
    title: string
    description: string
    dataSource: string
    xAxis?: string
    yAxis?: string
    orientation?: "vertical" | "horizontal"
    stacked?: boolean
}

export type DashboardConfig = {
    charts: ChartConfig[]
    filters: any
    version: string
}

export function exportDashboard(charts: ChartConfig[], filters: any): string {
    const config: DashboardConfig = {
        charts,
        filters,
        version: "1.0",
    }
    return JSON.stringify(config, null, 2)
}

export function importDashboard(json: string): DashboardConfig {
    try {
        const config = JSON.parse(json) as DashboardConfig
        // Validate the imported configuration
        if (!config.charts || !Array.isArray(config.charts)) {
            throw new Error("Invalid dashboard configuration: charts must be an array")
        }
        if (!config.version) {
            throw new Error("Invalid dashboard configuration: missing version")
        }
        return config
    } catch (error) {
        throw new Error("Failed to import dashboard configuration: " + (error as Error).message)
    }
}

export function getChartData(chart: ChartConfig) {
    // In a real application, this would fetch data from an API or database
    // For now, we'll use the sample data
    return financedata
}

export function applyFilters(data: any[], filters: any) {
    return data.filter((item) => {
        if (filters.region && filters.region !== "all") {
            return item.REGION === filters.region
        }
        return true
    })
} 