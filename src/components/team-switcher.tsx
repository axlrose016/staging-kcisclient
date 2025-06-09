"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function TeamSwitcher({
  teams,
  activeTeam,   
  onChange,  
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
    url: string
  }[]
  activeTeam: { name: string; logo: React.ElementType; plan: string }
  onChange: React.Dispatch<React.SetStateAction<{ name: string; logo: React.ElementType; plan: string; url: string }>> // setActiveTeam function type
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {/* Render the active team's logo correctly */}
                {activeTeam ? <activeTeam.logo className="size-4" /> : null}
                </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                 </span>
                {activeTeam ? <span className="truncate text-xs">{activeTeam.name}</span> : null}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Modules
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <Link href={team.url} key={index}>
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => onChange(team)} // Update active team when a team is selected
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    {/* Render each team's logo correctly */}
                    <team.logo className="size-4 shrink-0" />
                  </div>
                    <span>{team.name}</span>
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>

            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
