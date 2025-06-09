"use client"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { BanknoteIcon, BookUserIcon, CoinsIcon, FileSpreadsheetIcon, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'

function FinanceConfiguration() {
  const router = useRouter();
  const baseUrl = 'finance/configuration/'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
     <Card
        className="@container/card bg-[hsl(var(--sidebar-background))] transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-500/50 hover:scale-[1.02] cursor-pointer"
        onClick={() => router.push(`/${baseUrl}/budget-years`)}
      >
      <CardHeader className="relative">
        <CardDescription>Budget Year</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"></CardTitle>
        <div className="absolute right-4 top-4">
          <BookUserIcon size={40} className="h-10 w-12 text-muted-foreground mr-2" />
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          List of Budget Year 
        </div>
      </CardFooter>
    </Card>

     <Card
        className="@container/card bg-[hsl(var(--sidebar-background))] transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-500/50 hover:scale-[1.02] cursor-pointer"
        onClick={() => router.push(`/${baseUrl}/paps`)}
      >
      <CardHeader className="relative">
        <CardDescription>PAP</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"></CardTitle>
        <div className="absolute right-4 top-4">
          <FileSpreadsheetIcon size={40} className="h-10 w-12 text-muted-foreground mr-2" />
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          List of All PAP
        </div>
      </CardFooter>
    </Card>

    <Card
        className="@container/card bg-[hsl(var(--sidebar-background))] transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-500/50 hover:scale-[1.02] cursor-pointer"
        onClick={() => router.push(`/${baseUrl}/allotment-class`)}
      >
      <CardHeader className="relative">
        <CardDescription>Allotment Class</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"></CardTitle>
        <div className="absolute right-4 top-4">
          <FileSpreadsheetIcon size={40} className="h-10 w-12 text-muted-foreground mr-2" />
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          List of Allotment Class
        </div>
      </CardFooter>
    </Card>

    <Card
        className="@container/card bg-[hsl(var(--sidebar-background))] transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-500/50 hover:scale-[1.02] cursor-pointer"
        onClick={() => router.push(`/${baseUrl}/appropriation-source`)}
      >
      <CardHeader className="relative">
        <CardDescription>Appropriation Source</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"></CardTitle>
        <div className="absolute right-4 top-4">
          <FileSpreadsheetIcon size={40} className="h-10 w-12 text-muted-foreground mr-2" />
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          List of Appropriation Source
        </div>
      </CardFooter>
    </Card>

    <Card
        className="@container/card bg-[hsl(var(--sidebar-background))] transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-500/50 hover:scale-[1.02] cursor-pointer"
        onClick={() => router.push(`/${baseUrl}/appropriation-type`)}
      >
      <CardHeader className="relative">
        <CardDescription>Appropriation Type</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"></CardTitle>
        <div className="absolute right-4 top-4">
          <FileSpreadsheetIcon size={40} className="h-10 w-12 text-muted-foreground mr-2" />
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          List of Appropriation Type
        </div>
      </CardFooter>
    </Card>

    <Card
        className="@container/card bg-[hsl(var(--sidebar-background))] transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-500/50 hover:scale-[1.02] cursor-pointer"
        onClick={() => router.push(`/${baseUrl}/expense`)}
      >
      <CardHeader className="relative">
        <CardDescription>Expense</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"></CardTitle>
        <div className="absolute right-4 top-4">
          <FileSpreadsheetIcon size={40} className="h-10 w-12 text-muted-foreground mr-2" />
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          List of Expense
        </div>
      </CardFooter>
    </Card>
    </div>
  )
}

export default FinanceConfiguration
