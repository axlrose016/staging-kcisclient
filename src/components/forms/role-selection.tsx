"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Building2, GraduationCap, Users, Briefcase, Check, Crown, Shield, UserCog, Settings, School, UserCheck, ShieldCheck, HardHat, Banknote, User, BadgeCheck } from "lucide-react"
import { IRoles } from "../interfaces/library-interface"
const iconNameMap: { [key: string]: string } = {
  Finance: "Banknote",
  Engineer: "HardHat",
  "CFW Beneficiary": "Users",
  "CFW Immediate Supervisor": "ShieldCheck",
  Guest: "User",
  "CFW Administrator": "Settings",
  Administrator: "BadgeCheck",
  "CFW HEI Focal Person": "School",
  "CFW Alternate Supervisor": "UserCheck"
};
import * as LucideIcons from "lucide-react";



type RoleSelectionComponentProps = {
  roleOptions: any[],
  onContinue: (value: boolean) => void,
  onHandleSelectedRole: (role: IRoles) => void
}
export default function RoleSelectionComponent({ roleOptions, onContinue, onHandleSelectedRole }: RoleSelectionComponentProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [selectedRoleName, setSelectedRoleName] = useState<string | null>(null)
  const rolesWithIcons = roleOptions
    .filter(role => role.name !== "Guest") // omit Guest
    .map(role => ({
      ...role,
      role_description: role.name,
      icon: iconNameMap[role.name] || null,  // fallback to null if no match
      
    })).sort((a, b) => a.name.localeCompare(b.name));

  const handleRoleClick = (role: IRoles) => {
    
  };

  const handleRoleSelect = (role: IRoles) => {
    // const roleId = JSON.parse(role)
    onHandleSelectedRole(role);
    setSelectedRoleId(role.id)
    // setSelectedRoleName(role.name)
    console.log("Selected ROLE Id Is", role.id)
    console.log("Selected ROLE Name Is", role?.role_description)
    // setSelectedRole(role.id)
  }

  const handleContinue = () => {
    if (selectedRoleId) {
      localStorage.setItem("roleIdOfNewRegistrant", selectedRoleId)
      onContinue(false)
      // alert(selectedRole)

      // Here you would typically navigate to the registration form
      console.log(`Proceeding with role: ${selectedRoleId}`)
    }
  }

  return (
    <div className="min-h-screen   flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-5 border-b border-slate-200 pb-5">Welcome to KC Information System!</h1>
          <h2 className="text-2xl font-bold text-slate-900">Choose Your Role</h2>
          <p className="text-slate-600 text-md">
            Select the option that best describes how you'll be using our platform
          </p>

          {/* {JSON.stringify(roleOptions)} */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {rolesWithIcons.map((role, idx) => {

            const isSelected = selectedRoleId === role.id
            const IconComponent = role.icon ? (LucideIcons as any)[role.icon] : null;
            return (
              <Card
                key={role.id}
                className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${isSelected ? "ring-2 ring-blue-500 shadow-lg bg-blue-50/50" : "hover:shadow-md"
                  }`}
                onClick={() => handleRoleSelect(role)}
              >
                {/* {role.popular && (
                  <Badge className="absolute -top-2 left-4 bg-blue-600 hover:bg-blue-600">Most Popular</Badge>
                )} */}

                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-100" : "bg-slate-100"}`}>

                      {/* {role.icon} */}
                      {/* {IconComponent && <IconComponent className="w-5 h-5 text-slate-600" />} */}
                      {IconComponent && <IconComponent className={`w-6 h-6 ${isSelected ? "text-blue-600" : "text-slate-600"}`} />}
                      {/* <IconComponent className={`w-6 h-6 ${isSelected ? "text-blue-600" : "text-slate-600"}`} /> */}
                    </div>
                    <CardTitle className="text-xl">{role.name}</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">{role.description}</CardDescription>
                </CardHeader>

                {/* <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-900 mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent> */}
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedRoleId}
            size="lg"
            className="px-8 py-3 text-base font-medium"
          >
            Continue to Registration
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          {!selectedRoleId && <p className="text-sm text-slate-500 mt-3">Please select a role to continue</p>}
        </div>


      </div>
    </div>
  )
}
