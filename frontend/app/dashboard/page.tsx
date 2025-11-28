// Participant dashboard - discover and manage event attendance
"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Ticket, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"

// 1. Définition des types selon votre Backend Java
interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  locationCity: string;
  city?: string;
  totalSeats: number;
  availableSeats: number;
  imageUrl?: string;
  status: string;
}

interface Registration {
  id: number;
  status: string;
  event: Event;
}

export default function ParticipantDashboard() {
  const { user } = useAuth()
  
  // États
  const [availableEvents, setAvailableEvents] = useState<Event[]>([])
  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // 2. Fonction pour charger les données
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) return

      const headers = { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }

      // Appel 1 : Tous les événements publiés
      const eventsRes = await fetch("http://localhost:8080/api/events", { headers })
      const eventsData = await eventsRes.json()
      setAvailableEvents(Array.isArray(eventsData) ? eventsData : [])

      // Appel 2 : Mes inscriptions
      const regRes = await fetch("http://localhost:8080/api/registrations/me", { headers })
      const regData = await regRes.json()
      setMyRegistrations(Array.isArray(regData) ? regData : [])

    } catch (err) {
      console.error(err)
      setError("Failed to load events.")
      setAvailableEvents([])
      setMyRegistrations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 3. Action : S'inscrire à un événement
  const handleRegister = async (eventId: number) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`http://localhost:8080/api/registrations/${eventId}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.error || "Registration failed")
        return
      }

      alert("Successfully registered!")
      fetchData() // Recharge les données
    } catch (e) {
      alert("Technical error during registration")
    }
  }

  // 4. Action : Se désinscrire
  const handleUnregister = async (eventId: number) => {
    if (!confirm("Are you sure you want to cancel your registration?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`http://localhost:8080/api/registrations/${eventId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (!response.ok) throw new Error("Error")

      alert("Registration cancelled.")
      fetchData()
    } catch (e) {
      alert("Failed to cancel registration.")
    }
  }

  // Helper : Vérifier si inscrit
  const isRegistered = (eventId: number) => {
    if (!Array.isArray(myRegistrations)) return false;
    return myRegistrations.some(reg => reg.event.id === eventId)
  }

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading dashboard...</div>

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn={true} userName={user?.email?.split('@')[0]} />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Participant Dashboard</h1>
          <p className="text-muted-foreground">Manage your events and discover new ones.</p>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="browse">Browse Events</TabsTrigger>
            <TabsTrigger value="my-events">My Registrations ({myRegistrations.length})</TabsTrigger>
          </TabsList>

          {/* TAB 1 : BROWSE EVENTS */}
          <TabsContent value="browse" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableEvents.map(event => {
                const registered = isRegistered(event.id)
                return (
                  <div key={event.id} className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                    {/* Image Placeholder */}
                    <div className="h-40 bg-gray-100 w-full object-cover relative flex items-center justify-center">
                       {event.imageUrl ? (
                           <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                       ) : (
                           <span className="text-gray-400 text-sm">No Image</span>
                       )}
                       <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm text-foreground">
                         {event.availableSeats} seats left
                       </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 truncate">{event.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(event.eventDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.locationCity || event.city || "Online / TBD"}
                      </div>

                      {registered ? (
                        <Button disabled className="w-full bg-green-600/90 text-white opacity-100 cursor-default">
                          <Ticket className="w-4 h-4 mr-2" /> Registered
                        </Button>
                      ) : event.availableSeats > 0 ? (
                        <Button onClick={() => handleRegister(event.id)} className="w-full bg-primary hover:bg-primary/90">
                          Register Now
                        </Button>
                      ) : (
                        <Button disabled variant="secondary" className="w-full">
                          Sold Out
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
              {availableEvents.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                      No events available at the moment.
                  </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 2 : MY REGISTRATIONS */}
          <TabsContent value="my-events">
            <div className="space-y-4">
              {myRegistrations.map(reg => (
                <div key={reg.id} className="bg-card border rounded-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                  <div>
                    <h3 className="text-xl font-bold">{reg.event.title}</h3>
                    <p className="text-muted-foreground flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-2" /> 
                      {new Date(reg.event.eventDate).toLocaleDateString()} • {reg.event.locationCity || "Online"}
                    </p>
                    <span className="inline-flex items-center mt-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Confirmed
                    </span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleUnregister(reg.event.id)} 
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    Cancel Registration
                  </Button>
                </div>
              ))}
              {myRegistrations.length === 0 && (
                <div className="text-center p-12 border-2 border-dashed border-border rounded-xl">
                  <AlertCircle className="w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-50" />
                  <h3 className="text-lg font-medium text-foreground">No registrations yet</h3>
                  <p className="text-muted-foreground mt-1">You haven't registered for any events.</p>
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