export type Team = {
    name: string;
    logo: React.ElementType;
    plan: string;
    url: string;
  };

  export interface AppChartConfig {
    title: string;
    description?: string;
    type: 'bar' | 'line' | 'area' | 'pie' | 'donut' | 'scatter' | 'radial' | 'scorecard';
    data: any[];
    dataKeys: string[];
    xAxisKey: string;
    variant?: 'default' | 'stacked' | 'filled' | 'percentage' | 'labeled';
    orientation?: 'vertical' | 'horizontal';
    showLegend?: boolean;
    legendPosition?: 'top' | 'right' | 'bottom' | 'left';
    showGrid?: boolean;
    showTooltip?: boolean;
    fullscreen?: boolean;
    id?: string;
  }
  
  export const EXAMPLE_DATA = [
    { name: 'Jan', value: 400, value2: 240, value3: 200 },
    { name: 'Feb', value: 300, value2: 139, value3: 220 },
    { name: 'Mar', value: 200, value2: 980, value3: 190 },
    { name: 'Apr', value: 278, value2: 390, value3: 300 },
    { name: 'May', value: 189, value2: 480, value3: 210 },
    { name: 'Jun', value: 239, value2: 380, value3: 250 },
    { name: 'Jul', value: 349, value2: 430, value3: 270 }
  ];