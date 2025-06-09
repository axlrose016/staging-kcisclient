"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ChartConfig, CHART_TYPES, EXAMPLE_DATA } from '@/components/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ChartSidebarProps {
  onChange: (config: ChartConfig) => void;
  onSave: (config: ChartConfig) => void;
  initialConfig?: ChartConfig;
}

export function ChartSidebar({ onChange, onSave, initialConfig }: ChartSidebarProps) {
  const [config, setConfig] = useState<ChartConfig>(() => {
    return initialConfig || {
      title: 'Sample Chart',
      description: 'A description of the chart',
      type: 'scorecard',
      data: EXAMPLE_DATA,
      dataKeys: ['value', 'value2'],
      xAxisKey: 'name',
      variant: 'default',
      orientation: 'vertical',
      showLegend: true,
      legendPosition: 'bottom',
      showGrid: true,
      showTooltip: true,
      fullscreen: false,
    };
  });

  const [dataInput, setDataInput] = useState<string>('');
  const [dataSource, setDataSource] = useState<'paste' | 'api'>('paste');
  const [dataKeysInput, setDataKeysInput] = useState<string>(config.dataKeys.join(', '));
  const [apiUrl, setApiUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize dataInput with the stringified data
    setDataInput(JSON.stringify(config.data, null, 2));
  }, []);

  useEffect(() => {
    // Notify parent of changes
    onChange(config);
  }, [config, onChange]);

  // Get the selected chart type's variants
  const selectedChartType = CHART_TYPES.find(chartType => chartType.value === config.type);
  const availableVariants = selectedChartType?.variants || [];
  const supportsOrientation = selectedChartType?.supportsOrientation || false;

  const handleDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDataInput(e.target.value);
    try {
      const parsedData = JSON.parse(e.target.value);
      if (Array.isArray(parsedData)) {
        setConfig({ ...config, data: parsedData });
        setError(null);
      } else {
        setError('Data must be an array');
      }
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  const handleDataKeysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataKeysInput(e.target.value);
    const keys = e.target.value.split(',').map(key => key.trim()).filter(Boolean);
    setConfig({ ...config, dataKeys: keys });
  };

  const handleFetchData = async () => {
    if (!apiUrl) {
      setError('Please enter a valid API URL');
      return;
    }

    try {
      setError('Fetching data...');
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setConfig({ ...config, data });
        setDataInput(JSON.stringify(data, null, 2));
        setError(null);
      } else {
        setError('API response must be an array');
      }
    } catch (err) {
      setError(`Failed to fetch data: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const getDownloadOptions = () => {
    const options = [];
    if (config.download?.includes('png')) options.push({ value: 'png', label: 'PNG' });
    if (config.download?.includes('csv')) options.push({ value: 'csv', label: 'CSV' });
    return options;
  };

  return (
    <Card className="w-full h-full overflow-y-auto">
      <CardHeader>
        <CardTitle>Chart Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Chart Type Selection - First in the sidebar */}
          <div className="space-y-2">
            <Label htmlFor="chart-type">Chart Type</Label>
            <Select
              value={config.type}
              onValueChange={(value: ChartConfig['type']) => {
                // Reset variant when chart type changes
                setConfig({
                  ...config,
                  type: value,
                  variant: CHART_TYPES.find(t => t.value === value)?.variants[0]?.value || 'default'
                });
              }}
            >
              <SelectTrigger id="chart-type">
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                {CHART_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data Source Section - Second in the sidebar */}
          <div className="space-y-4">
            <div>
              <Label>Data Source</Label>
              <Tabs defaultValue="paste" value={dataSource} onValueChange={(v) => setDataSource(v as 'paste' | 'api')}>
                <TabsList className="w-full">
                  <TabsTrigger className="flex-1" value="paste">Paste Data</TabsTrigger>
                  <TabsTrigger className="flex-1" value="api">API Endpoint</TabsTrigger>
                </TabsList>
                <TabsContent value="paste" className="mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="data-input">JSON Data</Label>
                    <Textarea
                      id="data-input"
                      placeholder="Paste JSON data here..."
                      value={dataInput}
                      onChange={handleDataChange}
                      className="min-h-32 font-mono text-sm"
                    />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                  </div>
                </TabsContent>
                <TabsContent value="api" className="mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="api-url">API Endpoint</Label>
                    <div className="flex gap-2">
                      <Input
                        id="api-url"
                        placeholder="https://api.example.com/data"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                      />
                      <Button onClick={handleFetchData} variant="secondary">Fetch</Button>
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data-keys">Data Keys (comma separated)</Label>
              <Input
                id="data-keys"
                placeholder="value, value2, etc."
                value={dataKeysInput}
                onChange={handleDataKeysChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="x-axis-key">X-Axis Key</Label>
              <Input
                id="x-axis-key"
                placeholder="name"
                value={config.xAxisKey || ''}
                onChange={(e) => setConfig({ ...config, xAxisKey: e.target.value })}
              />
            </div>
          </div>

          <Separator />

          {/* Chart Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Chart Options</h3>

            <div className="space-y-2">
              <Label htmlFor="chart-title">Title</Label>
              <Input
                id="chart-title"
                placeholder="Chart Title"
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chart-description">Description</Label>
              <Input
                id="chart-description"
                placeholder="Chart Description"
                value={config.description || ''}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
              />
            </div>

            {config.type === 'scorecard' && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="fullscreen-toggle"
                  checked={!!config.fullscreen}
                  onCheckedChange={(checked) => setConfig({ ...config, fullscreen: checked })}
                />
                <Label htmlFor="fullscreen-toggle">Fullscreen Mode</Label>
              </div>
            )}

            {/* Only show variants if available for the current chart type */}
            {availableVariants.length > 0 && (
              <div className="space-y-2">
                <Label>Variant</Label>
                <RadioGroup
                  value={config.variant || 'default'}
                  onValueChange={(value) => setConfig({ ...config, variant: value })}
                  className="flex flex-wrap gap-4"
                >
                  {availableVariants.map((variant) => (
                    <div key={variant.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={variant.value} id={`variant-${variant.value}`} />
                      <Label htmlFor={`variant-${variant.value}`}>{variant.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Only show orientation if supported */}
            {supportsOrientation && (
              <div className="space-y-2">
                <Label>Orientation</Label>
                <RadioGroup
                  value={config.orientation || 'vertical'}
                  onValueChange={(value: 'vertical' | 'horizontal') => setConfig({ ...config, orientation: value })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vertical" id="orientation-vertical" />
                    <Label htmlFor="orientation-vertical">Vertical</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="horizontal" id="orientation-horizontal" />
                    <Label htmlFor="orientation-horizontal">Horizontal</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <div className="space-y-2">
              <Label>Legend</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="legend-toggle"
                  checked={!!config.showLegend}
                  onCheckedChange={(checked) => setConfig({ ...config, showLegend: checked })}
                />
                <Label htmlFor="legend-toggle">Show Legend</Label>
              </div>

              {config.showLegend && (
                <div className="mt-2">
                  <Label htmlFor="legend-position">Legend Position</Label>
                  <Select
                    value={config.legendPosition || 'bottom'}
                    onValueChange={(value: 'top' | 'bottom' | 'left' | 'right') => setConfig({ ...config, legendPosition: value })}
                  >
                    <SelectTrigger id="legend-position">
                      <SelectValue placeholder="Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Display Options</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-grid"
                    checked={!!config.showGrid}
                    onCheckedChange={(checked) => setConfig({ ...config, showGrid: typeof checked === 'boolean' ? checked : false })}
                  />
                  <Label htmlFor="show-grid">Show Grid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-tooltip"
                    checked={!!config.showTooltip}
                    onCheckedChange={(checked) => setConfig({ ...config, showTooltip: typeof checked === 'boolean' ? checked : false })}
                  />
                  <Label htmlFor="show-tooltip">Show Tooltip</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Download Options</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="download-png"
                    checked={config.download?.includes('png') || false}
                    onCheckedChange={(checked) => {
                      const downloadOptions = [...(config.download || [])];
                      if (checked && !downloadOptions.includes('png')) {
                        downloadOptions.push('png');
                      } else if (!checked) {
                        const index = downloadOptions.indexOf('png');
                        if (index !== -1) downloadOptions.splice(index, 1);
                      }
                      setConfig({ ...config, download: downloadOptions });
                    }}
                  />
                  <Label htmlFor="download-png">PNG</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="download-csv"
                    checked={config.download?.includes('csv') || false}
                    onCheckedChange={(checked) => {
                      const downloadOptions = [...(config.download || [])];
                      if (checked && !downloadOptions.includes('csv')) {
                        downloadOptions.push('csv');
                      } else if (!checked) {
                        const index = downloadOptions.indexOf('csv');
                        if (index !== -1) downloadOptions.splice(index, 1);
                      }
                      setConfig({ ...config, download: downloadOptions });
                    }}
                  />
                  <Label htmlFor="download-csv">CSV</Label>
                </div>
              </div>
            </div>
          </div>

          <Separator />
          
          {/* Save Button */}
          <Button 
            className="w-full" 
            onClick={() => onSave(config)}
          >
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}