"use client"

import { Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { handleTracking, getTrackingStatus, changeQuarter, getTrackingQuarter } from "../useWatchlist"

interface QuarterControlProps {
  quarter: string
  onQuarterChange: (quarter: string) => void
  trackingEnabled: boolean
  onTrackingChange: (enabled: boolean) => void
  trackingCount: number
  totalCount: number
}

export default function QuarterControl({
  quarter,
  onQuarterChange,
  trackingEnabled,
  onTrackingChange,
  trackingCount,
  totalCount,
}: QuarterControlProps) {

  const trackingChange = async (enabled: boolean) => {
    // console.log("Tracking change:", enabled);
    await handleTracking(enabled);
    onTrackingChange(enabled);
    const status = await getTrackingStatus();
    onTrackingChange(status);
  };

  const handleQuarterChange = async (value: string) => {
    console.log("Quarter change:", value);
    await changeQuarter(value);
    onQuarterChange(value);
    const trackingQuarter = await getTrackingQuarter();
    if (trackingQuarter !== value) {
      // console.log("Tracking quarter changed to:", trackingQuarter);
      onQuarterChange(trackingQuarter);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
            Tracking for {quarter}
            </h3>
            <p className="text-gray-600">
              {trackingEnabled ? `Tracking ${trackingCount} of ${totalCount} classes` : "Tracking disabled"}
            </p>
            <p className="text-gray-500 text-sm">
              *Only the classes for the selected quarter that are offered will be tracked.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={quarter} onValueChange={(value) => handleQuarterChange(value)}>
              <SelectTrigger className="w-48">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025 Winter Quarter">Winter 2025</SelectItem>
                <SelectItem value="2025 Spring Quarter">Spring 2025</SelectItem>
                <SelectItem value="2025 Summer Quarter">Summer 2025</SelectItem>
                <SelectItem value="2025 Fall Quarter">Fall 2025</SelectItem>
              </SelectContent>
            </Select>
            <Switch
              checked={trackingEnabled}
              onCheckedChange={(checked) => trackingChange(checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}