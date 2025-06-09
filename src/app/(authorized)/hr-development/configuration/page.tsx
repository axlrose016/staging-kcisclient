"use client"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { BanknoteIcon, BookUserIcon, Building, Building2Icon, CoinsIcon, FileSpreadsheetIcon, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'

function HRConfiguration() {
  const router = useRouter();
  const baseUrl = 'hr-development/configuration/'

  return (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
     <Card
        className="@container/card bg-[hsl(var(--sidebar-background))] transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-500/50 hover:scale-[1.02] cursor-pointer"
        onClick={() => router.push(`/${baseUrl}/positions`)}
      >
      <CardHeader className="relative">
        <CardDescription>Position</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"></CardTitle>
        <div className="absolute right-4 top-4">
          <BookUserIcon size={40} className="h-10 w-12 text-muted-foreground mr-2" />
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          List of All Position 
        </div>
      </CardFooter>
    </Card>

     <Card
        className="@container/card bg-[hsl(var(--sidebar-background))] transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-500/50 hover:scale-[1.02] cursor-pointer"
        onClick={() => router.push(`/${baseUrl}/employment-status`)}
      >
      <CardHeader className="relative">
        <CardDescription>Employment Status</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"></CardTitle>
        <div className="absolute right-4 top-4">
          <FileSpreadsheetIcon size={40} className="h-10 w-12 text-muted-foreground mr-2" />
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          List of All Employment Status 
        </div>
      </CardFooter>
    </Card>

    <Card
        className="@container/card bg-[hsl(var(--sidebar-background))] transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-500/50 hover:scale-[1.02] cursor-pointer"
        onClick={() => router.push(`/${baseUrl}/offices`)}
      >
      <CardHeader className="relative">
        <CardDescription>Office</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"></CardTitle>
        <div className="absolute right-4 top-4">
          <Building2Icon size={40} className="h-10 w-12 text-muted-foreground mr-2" />
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          List of All Offices
        </div>
      </CardFooter>
    </Card>

     <Card
        className="@container/card bg-[hsl(var(--sidebar-background))] transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-500/50 hover:scale-[1.02] cursor-pointer"
        onClick={() => router.push(`/${baseUrl}/divisions`)}
      >
      <CardHeader className="relative">
        <CardDescription>Division</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"></CardTitle>
        <div className="absolute right-4 top-4">
          <Building size={40} className="h-10 w-12 text-muted-foreground mr-2" />
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          List of All Divisions
        </div>
      </CardFooter>
    </Card>

    <Card
        className="@container/card bg-[hsl(var(--sidebar-background))] transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-500/50 hover:scale-[1.02] cursor-pointer"
        onClick={() => router.push(`/${baseUrl}/hiring-procedures`)}
      >
      <CardHeader className="relative">
        <CardDescription>Hiring Procedures</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"></CardTitle>
        <div className="absolute right-4 top-4">
          <Building size={40} className="h-10 w-12 text-muted-foreground mr-2" />
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          List of All Hiring Procedures
        </div>
      </CardFooter>
    </Card>
    </div>
  )
}

export default HRConfiguration
