"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from "@/lib/utils"

interface TabItem {
  value: string
  label: string
  content: React.ReactNode
}

interface ResponsiveTabsProps {
  tabs: TabItem[]
  defaultValue?: string
  className?: string
  activeTab: string
  onTabChange: any
}

export function FormTabs({ tabs, defaultValue, className, activeTab, onTabChange }: ResponsiveTabsProps) {
  // const [activeTab, setActiveTab] = React.useState(defaultValue || tabs[0].value)
  const [showLeftArrow, setShowLeftArrow] = React.useState(false)
  const [showRightArrow, setShowRightArrow] = React.useState(false)
  const tabsListRef = React.useRef<HTMLDivElement>(null)

  const handleTabChange = (value: string) => {
    
    onTabChange(value);
    // setActiveTab(value);
    // alert(value);
    scrollToTab(value);
  }

  const scrollToTab = (value: string) => {
    const tabElement = tabsListRef.current?.querySelector(`[data-value="${value}"]`)
    if (tabElement) {
      tabElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      })
    }
  }

  const handleScroll = () => {
    if (tabsListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1) // -1 to account for rounding errors
    }
  }

  const handleScrollLeft = () => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({ left: -100, behavior: "smooth" })
    }
  }

  const handleScrollRight = () => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({ left: 100, behavior: "smooth" })
    }
  }

  React.useEffect(() => {
    const tabsList = tabsListRef.current
    if (tabsList) {
      handleScroll() // Check initial state
      tabsList.addEventListener('scroll', handleScroll)
      window.addEventListener('resize', handleScroll)

      return () => {
        tabsList.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
      }
    }
  }, [])

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className={cn("w-full", className)}>
      <div className="relative">
        {showLeftArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
            onClick={handleScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <TabsList
          ref={tabsListRef}
          className="flex w-full h-auto overflow-x-auto scrollbar-hide justify-start"
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-1 py-2.5 px-4 text-sm lg:text-base whitespace-nowrap"
              data-value={tab.value}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {showRightArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
            onClick={handleScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

