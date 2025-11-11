// Organizer dashboard - manage events and registrations
"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit2, Trash2, Users } from "lucide-react"
import Link from "next/link"

export default function OrganizerDashboardPage() {
  const myEvents = [
    {
      id: "1",
      title: "Web Development Masterclass",
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "PUBLISHED",
      registrations: 15,
    },
    {
      id: "2",
      title: "Design Systems Workshop",
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      status: "PUBLISHED",
      registrations: 8,
    },
  ]

  const statusColors = {
    PUBLISHED: "bg-green-100 text-green-800",
    DRAFT: "bg-yellow-100 text-yellow-800",
    CANCELLED: "bg-red-100 text-red-800",
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn={true} userName="Jane" />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Organizer Dashboard</h1>
            <p className="text-muted-foreground">Create and manage your events</p>
          </div>
          <Link href="/dashboard/organizer/create-event">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-5 h-5 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-8">
            <div className="overflow-x-auto bg-card border border-border rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-semibold">Event Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Registrations</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myEvents.map((event) => (
                    <tr key={event.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-6 py-4">{event.title}</td>
                      <td className="px-6 py-4">{new Date(event.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{event.registrations}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="mt-8">
            <div className="space-y-4">
              {myEvents.map((event) => (
                <div key={event.id} className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">{event.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-5 h-5" />
                      <span>{event.registrations} participants registered</span>
                    </div>
                    <Link href={`/dashboard/organizer/event/${event.id}/participants`}>
                      <Button variant="outline" size="sm">
                        View Participants
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
