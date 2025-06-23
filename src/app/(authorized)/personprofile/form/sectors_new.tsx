"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Users, Baby, Accessibility, User, GraduationCap, Briefcase, Heart, Home, CheckCircle2 } from "lucide-react"
import { IPersonProfile, IPersonProfileDisability, IPersonProfileSector } from "@/components/interfaces/personprofile"

interface Sector {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

const sectors: Sector[] = [
  {
    id: "women",
    name: "Women",
    description: "Programs and services specifically for women",
    icon: <Users className="h-6 w-6" />,
  },
  {
    id: "pregnant-women",
    name: "Pregnant Women",
    description: "Support for expectant mothers and maternal health",
    icon: <Baby className="h-6 w-6" />,
  },
  {
    id: "pwd",
    name: "Persons with Disabilities (PWD)",
    description: "Services for individuals with disabilities",
    icon: <Accessibility className="h-6 w-6" />,
  },
  {
    id: "solo-parent",
    name: "Solo Parent",
    description: "Support for single parents and their families",
    icon: <User className="h-6 w-6" />,
  },
  {
    id: "senior-citizen",
    name: "Senior Citizen",
    description: "Programs for elderly individuals (60+ years old)",
    icon: <Heart className="h-6 w-6" />,
  },
  {
    id: "student",
    name: "Student",
    description: "Educational assistance and student services",
    icon: <GraduationCap className="h-6 w-6" />,
  },
  {
    id: "unemployed",
    name: "Unemployed",
    description: "Job placement and livelihood programs",
    icon: <Briefcase className="h-6 w-6" />,
  },
  {
    id: "indigenous",
    name: "Indigenous People",
    description: "Services for indigenous communities",
    icon: <Home className="h-6 w-6" />,
  },
]

export default function SectorDetails({
  errors,
  capturedData,
  sectorData,
  disabilitiesData,
  selectedModality,
  updateFormData,
  updateSectorData,
  updateDisabilityData,
  session,
  user_id_viewing,
}: {
  errors: any;
  capturedData: Partial<IPersonProfile>;
  sectorData: Partial<IPersonProfileSector>[];
  disabilitiesData: Partial<IPersonProfileDisability>[];
  selectedModality: any;
  updateFormData: (newData: Partial<IPersonProfile>) => void;
  updateSectorData: (newData: Partial<IPersonProfileSector>[]) => void;
  updateDisabilityData: (newData: Partial<IPersonProfileDisability>[]) => void;
  session: any;
  user_id_viewing: any;
}) {
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSectorsByUser, setSelectedSectorsByUser] = useState<IPersonProfileSector[]>([])
  // Load selected sectors from localStorage on component mount
  useEffect(() => {
    const savedSectors = localStorage.getItem("selectedSectors")
    if (savedSectors) {
      try {
        const parsed = JSON.parse(savedSectors)
        setSelectedSectors(Array.isArray(parsed) ? parsed : [])
      } catch (error) {
        console.error("Error parsing saved sectors:", error)
        setSelectedSectors([])
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("selectedSectors", JSON.stringify(selectedSectors))
    }
  }, [selectedSectors, isLoading])

  const toggleSector = (sectorId: string) => {
    setSelectedSectors((prev) => (prev.includes(sectorId) ? prev.filter((id) => id !== sectorId) : [...prev, sectorId]))
  }

  const clearAllSelections = () => {
    setSelectedSectors([])
  }

  const getSelectedSectorNames = () => {
    return sectors.filter((sector) => selectedSectors.includes(sector.id)).map((sector) => sector.name)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 w-full">
      {/* Header + Summary + Action Buttons (still centered) */}
      <div className="w-full px-2">
        {/* <div className="max-w-4xl mx-auto"> */}
        {/* Header */}
        
        {/* Selected Sectors Summary */}
        {selectedSectors.length > 0 && (

          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Selected Sectors ({selectedSectors.length})
                {/* User ID {session.id} */}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllSelections}
                className="text-blue-700 border-blue-300 hover:bg-blue-100"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {getSelectedSectorNames().map((name) => (
                <Badge key={name} variant="secondary" className="bg-blue-100 text-blue-800">
                  {name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Width Grid */}
      <div className="w-full px-2">
        <div className="grid gap-4 mb-8 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          {sectors.map((sector) => {
            const isSelected = selectedSectors.includes(sector.id);
            return (
              <Card
                key={sector.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200" : "hover:border-gray-300"
                  }`}
                onClick={() => toggleSector(sector.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${isSelected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {sector.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                          {sector.name}
                        </h3>
                        <Checkbox checked={isSelected} onChange={() => toggleSector(sector.id)} className="ml-auto" />
                      </div>
                      <p className={`text-sm ${isSelected ? "text-blue-700" : "text-gray-600"}`}>
                        {sector.description}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 flex items-center gap-2 text-blue-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Action Buttons (still centered) */}
      {/* <div className="max-w-4xl mx-auto text-center">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Your selections are automatically saved</p>
          {selectedSectors.length > 0 && (
            <Button
              onClick={() => {
                alert(`You have selected: ${getSelectedSectorNames().join(", ")}`);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue with Selected Sectors
            </Button>
          )}
        </div>
      </div> */}
    </div>

  )
}
