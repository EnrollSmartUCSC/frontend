"use client"

import { Users, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WatchlistedClass, watchlistClass } from "@/types/api"


interface ClassCardProps {
  classData: WatchlistedClass
  trackingEnabled: boolean
  onRemove: (course: watchlistClass) => void
}

function zip(arr1: number[], arr2: number[]) {
  return arr1.map((item, index) => [item, arr2[index]]);
}


export default function ClassCard({ classData, trackingEnabled, onRemove }: ClassCardProps) {
  const statusColors = {
    Open: "bg-green-100 text-green-800",
    Waitlist: "bg-yellow-100 text-yellow-800",
    Closed: "bg-red-100 text-red-800",
    'Not offered': "bg-gray-100 text-gray-800",
  }

  return (
    <Card className={classData.isTracking && trackingEnabled ? "ring-2 ring-blue-100" : ""}>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold"> {classData.subject}{" "}{classData.catalog_nbr}</h3>
              <Badge className={statusColors[classData.status]}>{classData.status}</Badge>
              {classData.isTracking && trackingEnabled && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse" />
                  Tracking
                </Badge>
              )}
            </div>

            <h4 className="font-medium mb-3">{classData.title}</h4>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{classData.instructor}</span>
              </div>
              {/* <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{classData.schedule}</span>
              </div> */}
              {/* <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{classData.location}</span>
              </div> */}
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>{classData.credits} credits</span>
              </div>
            </div>
            {zip(classData.enrolled, classData.capacity).map((enrollment, idx) => (
              <div key={idx} className="text-sm text-gray-600">
                {enrollment[0]}/{enrollment[1]} enrolled • {enrollment[1] - enrollment[0]} spots available {
                  classData.waitlist && `• People on waitlist: ${classData.waitlist[idx]}`}
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2 ml-6">
            <Button variant="outline" size="sm" onClick={() => onRemove({subject: classData.subject, catalog_nbr: classData.catalog_nbr })}>
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
