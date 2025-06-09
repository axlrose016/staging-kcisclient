"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react'; 
import { ChartConfig } from './types';

interface ChartDownloaderProps {
  config: ChartConfig;
  chartRef: React.RefObject<HTMLDivElement>;
}

export function ChartDownloader({ config, chartRef }: ChartDownloaderProps) {
  // Function to download as PNG
  const downloadAsPNG = () => {
    if (!chartRef.current) return;

    import('html-to-image').then((htmlToImage) => {
      htmlToImage.toPng(chartRef.current!)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `${config.title || 'chart'}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error('Error generating PNG:', error);
        });
    });
  };

  // Function to download as CSV
  const downloadAsCSV = () => {
    if (!config.data || config.data.length === 0) return;

    try {
      // Get all unique keys from the data
      const allKeys = new Set<string>();
      config.data.forEach(item => {
        Object.keys(item).forEach(key => allKeys.add(key));
      });
      
      // Convert Set to Array and filter out keys we don't want to include
      const keys = Array.from(allKeys);
      
      // Create CSV header
      let csv = keys.join(',') + '\n';
      
      // Add data rows
      config.data.forEach(item => {
        const row = keys.map(key => {
          const value = item[key];
          // Handle different data types and ensure proper CSV formatting
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
          return value;
        });
        csv += row.join(',') + '\n';
      });
      
      // Create and trigger download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${config.title || 'chart-data'}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating CSV:', error);
    }
  };

  if (!config.download || config.download.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {config.download.includes('png') && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={downloadAsPNG}
          title="Download as PNG"
        >
          <Download className="h-4 w-4 mr-2" />
          PNG
        </Button>
      )}
      {config.download.includes('csv') && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={downloadAsCSV}
          title="Download as CSV"
        >
          <Download className="h-4 w-4 mr-2" />
          CSV
        </Button>
      )}
    </div>
  );
}