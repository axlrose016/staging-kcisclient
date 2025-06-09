"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ScorecardProps {
  title?: string;
  data: any[];
  dataKeys: string[];
  fullscreen?: boolean;
}

export function Scorecard({ title, data, dataKeys, fullscreen }: ScorecardProps) {
  // Calculate totals for each data key
  const totals = dataKeys.reduce((acc, key) => {
    const total = data.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
    return { ...acc, [key]: total };
  }, {});

  return (
    <div className={cn(
      "grid gap-4",
      fullscreen ? "h-full" : "",
      dataKeys.length > 2 ? "grid-cols-3" : `grid-cols-${dataKeys.length}`
    )}>
      {dataKeys.map((key) => (
        <Card key={key} className={cn("overflow-hidden", fullscreen && "h-full")}>
          <CardContent className={cn(
            "flex flex-col items-center justify-center p-6",
            fullscreen && "h-full"
          )}>
            <p className="text-sm font-medium text-muted-foreground mb-2">{key}</p>
            <h2 className="text-3xl font-bold">{totals[key].toLocaleString()}</h2>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}