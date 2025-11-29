"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit2, Trash2, Users } from "lucide-react"
import Link from "next/link"
import { API_BASE_URL } from "@/lib/config"

// 1. Event Type Definition
interface Event {
  id: string;
  title: string;
  date: string;
  status: "PUBLISHED" | "DRAFT" | "CANCELLED";
  registrations: number;
}

export default function OrganizerDashboardPage() {
  const { user } = useAuth()
  
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 3. Fetch Data from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/events`)

        if (!response.ok) {
          throw new Error("Network response was not valid.")
        }

        const data = await response.json()

        const formattedEvents: Event[] = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          date: event.eventDate,
          status: event.status,
          registrations: event.totalSeats - (event.availableSeats || 0),
        }))

        setEvents(formattedEvents)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const statusColors: Record<string, string> = {
    PUBLISHED: "bg-green-100 text-green-800",
    DRAFT: "bg-yellow-100 text-yellow-800",
    CANCELLED: "bg-red-100 text-red-800",
  }

  // --- DELETE FUNCTION (With Token) ---
  const handleDelete = async (eventId: string) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
            throw new Error("Session expired or unauthorized.");
        }
        throw new Error("Failed to delete the event.");
      }

      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      console.log("Event deleted successfully!");

    } catch (err: any) {
      setError(err.message);
      console.error(err.message);
    }
  };
  // ----------------------------------------

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <p>Loading events...</p>
        </div>
    )
  }

  if (error) {
    return (
        <div className="flex justify-center items-center min-h-screen text-red-500">
            <p>Error: {error}</p>
        </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar 
        isLoggedIn={true} 
        userName={user?.email ? user.email.split('@')[0] : "Organizer"} 
      />

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
                  {events.map((event) => (
                    <tr key={event.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-6 py-4 font-medium">{event.title}</td>
                      <td className="px-6 py-4">{new Date(event.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            statusColors[event.status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">{event.registrations}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <Link href={`/dashboard/organizer/edit-event/${event.id}`}>
                            <Button variant="outline" size="sm">
                            <Edit2 className="w-4 h-4 mr-1" />
                            Edit
                            </Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {events.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                  You haven't created any events yet.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="participants" className="mt-8">
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">{event.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-5 h-5" />
                      <span>{event.registrations} registered participant(s)</span>
                    </div>
                    <Link href={`/dashboard/organizer/event/${event.id}/participants`}>
                      <Button variant="outline" size="sm">
                        View Participants
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                  No events to display.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}