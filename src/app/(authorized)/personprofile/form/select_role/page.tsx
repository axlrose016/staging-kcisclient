"use client"
import { useRouter } from "next/navigation"
import { User, ShieldCheck, Eye, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
const Roles = [
    {
        label: "CFW Beneficiary",
        icon: "User", // A single person
        role: "CFW Beneficiary"
    },
    {
        label: "CFW Administrator",
        icon: "ShieldCheck", // Represents authority, permissions
        role: "CFW Administrator"
    },
    {
        label: "CFW Supervisor",
        icon: "Eye", // Oversight, supervision
        role: "CFW Supervisor"
    },
    {
        label: "CFW Focal Person",
        icon: "Target", // Key contact or central figure
        role: "CFW Focal Person"
    }
]

export default function SelectRolePage() {
    return (
        <>
            <h1>Select a Role</h1>
            {Roles.map((role)=>{
                <Button>{role.label}</Button>
            })}
        </>
    )
}