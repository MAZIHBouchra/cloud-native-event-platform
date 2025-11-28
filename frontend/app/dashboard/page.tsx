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
  event: Event; // L'objet Registration contient l'objet Event complet
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
      // Sécurité : On vérifie que c'est bien un tableau
      setAvailableEvents(Array.isArray(eventsData) ? eventsData : [])

      // Appel 2 : Mes inscriptions
      const regRes = await fetch("http://localhost:8080/api/registrations/me", { headers })
      const regData = await regRes.json()
      // Sécurité : On vérifie que c'est bien un tableau
      setMyRegistrations(Array.isArray(regData) ? regData : [])

    } catch (err) {
      console.error(err)
      setError("Impossible de charger les événements.")
      // En cas d'erreur, on met des tableaux vides pour éviter le crash
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
        alert(errorData.error || "Erreur lors de l'inscription")
        return
      }

      alert("Inscription réussie !")
      fetchData() // On recharge les données pour mettre à jour les places et la liste
    } catch (e) {
      alert("Erreur technique lors de l'inscription")
    }
  }

  // 4. Action : Se désinscrire
  const handleUnregister = async (eventId: number) => {
    if (!confirm("Voulez-vous vraiment annuler votre inscription ?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`http://localhost:8080/api/registrations/${eventId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (!response.ok) throw new Error("Erreur")

      alert("Désinscription confirmée.")
      fetchData() // On recharge
    } catch (e) {
      alert("Impossible de se désinscrire.")
    }
  }

  // Helper : Vérifier si l'utilisateur est déjà inscrit à un event donné
  const isRegistered = (eventId: number) => {
    // Sécurité : Si myRegistrations est undefined ou null
    if (!Array.isArray(myRegistrations)) return false;
    return myRegistrations.some(reg => reg.event.id === eventId)
  }

  if (loading) return <div className="p-10 text-center">Chargement...</div>

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn={true} userName={user?.email?.split('@')[0]} />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Espace Participant</h1>
          <p className="text-muted-foreground">Gérez vos événements et découvrez-en de nouveaux.</p>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="browse">Parcourir les événements</TabsTrigger>
            <TabsTrigger value="my-events">Mes Inscriptions ({myRegistrations.length})</TabsTrigger>
          </TabsList>

          {/* ONGLET 1 : TOUS LES ÉVÉNEMENTS */}
          <TabsContent value="browse" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableEvents.map(event => {
                const registered = isRegistered(event.id)
                return (
                  <div key={event.id} className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                    {/* Image Placeholder si pas d'image */}
                    <div className="h-40 bg-gray-200 w-full object-cover relative">
                       {event.imageUrl ? (
                           <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                       ) : (
                           <div className="flex items-center justify-center h-full text-gray-400">Pas d'image</div>
                       )}
                       <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-bold shadow">
                         {event.availableSeats} places restantes
                       </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(event.eventDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4 mr-2" />
                        {/* On essaie d'abord locationCity, sinon on prend city */}
                        {event.locationCity || event.city || "Lieu non précisé"}
                      </div>

                      {registered ? (
                        <Button disabled className="w-full bg-green-600 text-white opacity-100">
                          <Ticket className="w-4 h-4 mr-2" /> Déjà inscrit
                        </Button>
                      ) : event.availableSeats > 0 ? (
                        <Button onClick={() => handleRegister(event.id)} className="w-full">
                          S'inscrire
                        </Button>
                      ) : (
                        <Button disabled variant="secondary" className="w-full">
                          Complet
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
              {availableEvents.length === 0 && <p>Aucun événement disponible pour le moment.</p>}
            </div>
          </TabsContent>

          {/* ONGLET 2 : MES INSCRIPTIONS */}
          <TabsContent value="my-events">
            <div className="space-y-4">
              {myRegistrations.map(reg => (
                <div key={reg.id} className="bg-card border rounded-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold">{reg.event.title}</h3>
                    <p className="text-muted-foreground flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-2" /> 
                      {new Date(reg.event.eventDate).toLocaleDateString()} à {reg.event.locationCity}
                    </p>
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Confirmé
                    </span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleUnregister(reg.event.id)} 
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Se désinscrire
                  </Button>
                </div>
              ))}
              {myRegistrations.length === 0 && (
                <div className="text-center p-12 border-2 border-dashed rounded-xl">
                  <AlertCircle className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">Aucune inscription</h3>
                  <p className="text-muted-foreground">Vous n'êtes inscrit à aucun événement pour le moment.</p>
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