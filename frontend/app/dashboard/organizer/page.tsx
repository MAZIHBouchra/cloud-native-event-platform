// Organizer dashboard - manage events and registrations
"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit2, Trash2, Users } from "lucide-react"
import Link from "next/link"

// 1. Définition du type pour un objet "Event" avec TypeScript
// Cela permet d'éviter les erreurs et d'avoir une meilleure autocomplétion.
interface Event {
  id: string;
  title: string;
  date: string; // La date est une chaîne de caractères (format ISO) venant de l'API
  status: "PUBLISHED" | "DRAFT" | "CANCELLED"; // On définit les statuts possibles
  registrations: number;
}

export default function OrganizerDashboardPage() {
  // 2. Gestion des états :
  // - events: stocke la liste des événements récupérés
  // - loading: indique si les données sont en cours de chargement
  // - error: stocke un message d'erreur en cas de problème
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 3. Hook useEffect pour récupérer les données de l'API une seule fois,
  // au moment où le composant est affiché pour la première fois.
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Assurez-vous que cette URL correspond bien à votre backend (port 8080 par défaut pour Spring Boot)
        const response = await fetch("http://localhost:8080/api/events")

        if (!response.ok) {
          throw new Error("La réponse du réseau n'était pas valide.")
        }

        const data = await response.json()

        // On transforme les données reçues de l'API pour qu'elles correspondent à notre interface 'Event'
        const formattedEvents: Event[] = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          date: event.eventDate, // Le backend envoie 'eventDate'
          status: event.status,
          registrations: event.totalSeats - event.availableSeats, // On calcule le nombre d'inscrits
        }))

        setEvents(formattedEvents)
      } catch (err: any) {
        setError(err.message)
      } finally {
        // Qu'il y ait eu une erreur ou non, le chargement est terminé
        setLoading(false)
      }
    }

    fetchEvents()
  }, []) // Le tableau vide [] assure que le hook ne s'exécute qu'une fois

  // Définition des couleurs pour chaque statut d'événement
  const statusColors: Record<Event["status"], string> = {
    PUBLISHED: "bg-green-100 text-green-800",
    DRAFT: "bg-yellow-100 text-yellow-800",
    CANCELLED: "bg-red-100 text-red-800",
  }
const handleDelete = async (eventId: string) => {
    // Demande de confirmation à l'utilisateur
    if (!window.confirm("Êtes-vous certain de vouloir supprimer cet événement ? Cette action est irréversible.")) {
      return;
    }

    try {
      // Appel à l'API backend pour supprimer l'événement
      const response = await fetch(`http://localhost:8080/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("La suppression de l'événement a échoué.");
      }

      // Mise à jour de l'état local pour retirer l'événement de la liste
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      
      console.log("Événement supprimé avec succès !");

    } catch (err: any) {
      setError(err.message);
      console.error(err.message);
    }
  };
  // 4. Affichage conditionnel pendant le chargement
  if (loading) {
    return (
        // Vous pouvez remplacer ceci par un composant de chargement plus élégant (spinner, etc.)
        <div className="flex justify-center items-center min-h-screen">
            <p>Chargement des événements...</p>
        </div>
    )
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
        <div className="flex justify-center items-center min-h-screen text-red-500">
            <p>Erreur lors de la récupération des données : {error}</p>
        </div>
    )
  }

  // 5. Affichage principal du composant une fois les données chargées
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn={true} userName="Jane" />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Organizer Dashboard</h1>
            <p className="text-muted-foreground">Créez et gérez vos événements</p>
          </div>
          <Link href="/dashboard/organizer/create-event">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-5 h-5 mr-2" />
              Créer un événement
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="events">Mes Événements</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
          </TabsList>

          {/* Onglet des Événements */}
          <TabsContent value="events" className="mt-8">
            <div className="overflow-x-auto bg-card border border-border rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-semibold">Titre de l'événement</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Inscriptions</th>
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
                          Modifier
                        </Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Message si aucun événement n'est trouvé */}
              {events.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                  Vous n'avez encore créé aucun événement.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Onglet des Participants */}
          <TabsContent value="participants" className="mt-8">
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">{event.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-5 h-5" />
                      <span>{event.registrations} participant(s) inscrit(s)</span>
                    </div>
                    <Link href={`/dashboard/organizer/event/${event.id}/participants`}>
                      <Button variant="outline" size="sm">
                        Voir les participants
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
               {/* Message si aucun événement n'est trouvé */}
              {events.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                  Aucun événement à afficher.
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