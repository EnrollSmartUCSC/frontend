"use client"

import { Heart, Plus, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function EmptyWatchlist() {
  const router = useRouter()

  return (
    <Card className="text-center py-16">
      <CardContent>
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-gray-400" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Your watchlist is empty</h3>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Start building your course schedule by adding classes to your watchlist. You&apos;ll get notified when spots open
            up or when you move up on waitlists.
          </p>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => router.push("/dashboard/tab-1")} className="w-full max-w-xs">
              <Plus className="w-4 h-4 mr-2" />
              Browse Courses
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                <span>Track availability</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                <span>Get notifications</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}