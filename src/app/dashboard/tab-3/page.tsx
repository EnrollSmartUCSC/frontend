"use client";
import ClassCard from "./components/classCard";
// import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Bell } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import QuarterControl from "./components/QuarterControl";
import { getwatchlist, removeFromWatchlist } from "../tab-1/hooks/useWatchlist";
import { watchlistClass, WatchlistedClass } from "@/types/api";
import { 
  getTrackingStatus,
   getwatchlistData,
  } from "./useWatchlist";
import EmptyWatchlist from "./components/noClasses";
import { Spin } from "antd";
import { ScrollArea } from "@/components/ui/scroll-area"



export default function Tab3() {
  const [quarter, setQuarter] = useState("2025 Fall Quarter");
  const [watchlist, setWatchlist] = useState<boolean>(false)
  const [classes, setClasses] = useState<WatchlistedClass[] | null>(null)
  const [trackingEnabled, setTrackingEnabled] = useState(false)

  useEffect(() => {
    (async () => {
      const trackingStatus = await getTrackingStatus();
      setTrackingEnabled(trackingStatus);
    })()
  }, [])

  useEffect(() => {
    (async () => {
      setClasses(null); // Reset classes to null before fetching new data
      const watchlistClasses = await getwatchlist();
      // await setWatchlist(watchlistClasses);
      const trackingStatus = await getTrackingStatus();
      const classData = await getwatchlistData(watchlistClasses, quarter, trackingStatus);
      // Map status to allowed values
      const allowedStatuses = ["Open", "Waitlist", "Closed", "Not offered"] as const;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedClassData = classData.map((cls: any) => ({
        ...cls,
        status: allowedStatuses.includes(cls.status) ? cls.status : "Not offered",
      }));
      setClasses(mappedClassData);
    })()

  }, [quarter, watchlist, trackingEnabled])

  const removeClass = async (course: watchlistClass) => {
    await removeFromWatchlist(course)
    setWatchlist((prev) => !prev)
  }

  const trackingCount = classes ? classes.filter((cls) => cls.isTracking).length : 0;

  return (
    <ScrollArea className="flex-1 h-screen p-8 overflow-auto">
      <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="watchlist">
            <div className="flex justify-between mb-6">
              <TabsList>
                <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
              </TabsList>

              {/* <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Settings
              </Button> */}
            </div>

            <TabsContent value="watchlist" className="space-y-6">
              <QuarterControl
                quarter={quarter}
                onQuarterChange={setQuarter}
                trackingEnabled={trackingEnabled}
                onTrackingChange={setTrackingEnabled}
                trackingCount={trackingCount}
                totalCount={classes?.length || 0}
              />

              <div>
                <h2 className="text-2xl font-semibold mb-2">Your Watchlist</h2>
                <p className="text-gray-600 mb-6">
                  {classes?.length || 0} classes • {trackingCount} tracking
                </p>

                <div className="space-y-4">
                  {classes ? (classes.length > 0 ? (classes.map((cls) => (
                    <ClassCard
                      key={cls.subject + cls.catalog_nbr}
                      classData={cls}
                      trackingEnabled={trackingEnabled}
                      // onToggleTracking={toggleTracking}
                      onRemove={removeClass}
                    />
                  ))) : (
                    <EmptyWatchlist />
                  )) : (
                    <Spin className="flex justify-center items-center h-64" size="large" />
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
    </ScrollArea>
  )
}
