"use client"

import { CheckCircle, Loader2, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PushStatusBadgeProps {
  push_status_id: null | 1 | 2
  size?: "sm" | "md" | "lg"
  showDate?: boolean
}

export function PushStatusBadge({ push_status_id, size = "md", showDate = true }: PushStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (push_status_id) {
      case 1: // uploaded
        return {
          icon: CheckCircle,
          text: "Uploaded",
          variant: "default" as const,
          className: "bg-green-100 text-green-700 border-green-200",
        }
      case 2: // uploading
        return {
          icon: Clock,
          text: "For Upload",
          variant: "default" as const,
          className: "bg-blue-100 text-blue-700 border-blue-200",
        }
      default:
        return {
          icon: Clock,
          text: "Unknown",
          variant: "secondary" as const,
          className: "bg-gray-100 text-gray-700",
        }
    }
  }

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date

    // Check if date is today
    const today = new Date()
    const isToday = dateObj.toDateString() === today.toDateString()

    if (isToday) {
      return dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    // Check if date is this year
    const isThisYear = dateObj.getFullYear() === today.getFullYear()

    if (isThisYear) {
      return dateObj.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    return dateObj.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const config = getStatusConfig()
  const Icon = config.icon

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <div className="flex flex-col gap-1">
      <Badge
        variant={config.variant}
        className={`${config.className} ${sizeClasses[size]} flex items-center gap-2 w-fit`}
      >
        <Icon className={`${iconSizes[size]} ${push_status_id === 2 ? "animate-spin" : ""}`} />
        <span className="font-medium">{config.text}</span>
      </Badge>
{/* 
      {showDate && (
        <span className="text-xs text-muted-foreground ml-1">
          {push_status_id === 1 ? "Uploaded" : "For Uploading"} 
        </span>
      )} */}
    </div>
  )
}

// export default function PushStatusBadge() {
//   // Sample data to demonstrate the component
//   const sampleData = [
//     {
//       id: 1,
//       push_status_id: 1 as const,
//       push_date: new Date().toISOString(), // Today
//       description: "Latest deployment",
//     },
//     {
//       id: 2,
//       push_status_id: 2 as const,
//       push_date: new Date().toISOString(), // Currently uploading
//       description: "Feature update",
//     },
//     {
//       id: 3,
//       push_status_id: 1 as const,
//       push_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
//       description: "Bug fix release",
//     },
//     {
//       id: 4,
//       push_status_id: 1 as const,
//       push_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
//       description: "Major version update",
//     },
//     {
//       id: 5,
//       push_status_id: 1 as const,
//       push_date: new Date("2023-12-15").toISOString(), // Last year
//       description: "Initial release",
//     },
//   ]

//   return (
//     <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
//       <Card>
//         <CardHeader>
//           <CardTitle>Push Status Badge</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {/* Different sizes */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Different Sizes</h3>
//             <div className="flex flex-wrap items-start gap-4">
//               <StatusBadge push_status_id={1} push_date={new Date().toISOString()} size="sm" />
//               <StatusBadge push_status_id={2} push_date={new Date().toISOString()} size="md" />
//               <StatusBadge push_status_id={1} push_date={new Date().toISOString()} size="lg" />
//             </div>
//           </div>

//           {/* Status comparison */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Status Types</h3>
//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="p-4 border rounded-lg">
//                 <h4 className="font-medium mb-2">Uploaded (push_status_id: 1)</h4>
//                 <StatusBadge push_status_id={1} push_date={new Date().toISOString()} />
//               </div>
//               <div className="p-4 border rounded-lg">
//                 <h4 className="font-medium mb-2">Uploading (push_status_id: 2)</h4>
//                 <StatusBadge push_status_id={2} push_date={new Date().toISOString()} />
//               </div>
//             </div>
//           </div>

//           {/* Sample data table */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Sample Data</h3>
//             <div className="space-y-3">
//               {sampleData.map((item) => (
//                 <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
//                   <div className="flex-1">
//                     <h4 className="font-medium">{item.description}</h4>
//                     <p className="text-sm text-muted-foreground">ID: {item.id}</p>
//                   </div>
//                   <StatusBadge push_status_id={item.push_status_id} push_date={item.push_date} />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Without date */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Without Date Display</h3>
//             <div className="flex gap-4">
//               <StatusBadge push_status_id={1} push_date={new Date().toISOString()} showDate={false} />
//               <StatusBadge push_status_id={2} push_date={new Date().toISOString()} showDate={false} />
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
