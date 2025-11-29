"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/use-auth"
import Link from "next/link"
import { ArrowLeft, Mail, User, Calendar } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"

interface Registration {
  id: number;
  participantName: string; 
  participantEmail: string;
  registrationDate: string;
}

export default function EventParticipantsPage() {
  const params = useParams()
  const eventId = params.id as string
  const { user } = useAuth()

  const [participants, setParticipants] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        // Appel au backend
        const response = await fetch(`${API_BASE_URL}/api/registrations/event/${eventId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
          throw new Error("Failed to load participants.")
        }

        const data = await response.json()
        setParticipants(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchParticipants()
  }, [eventId])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn={true} userName={user?.email?.split('@')[0] || "Organizer"} />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-12">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/organizer">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Event Participants</h1>
            <p className="text-muted-foreground">View who registered for your event.</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground">Loading participants list...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">Error: {error}</div>
          ) : participants.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                <Users className="w-12 h-12 mb-4 opacity-20" />
                <p>No participants registered yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Participant</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {participants.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-medium">
                          {p.participantName || "Participant"} 
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                          <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 opacity-50" />
                              {p.participantEmail}
                          </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 opacity-50" />
                            {p.registrationDate ? new Date(p.registrationDate).toLocaleDateString() : "-"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}