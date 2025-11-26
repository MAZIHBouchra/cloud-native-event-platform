// Dans app/dashboard/organizer/edit-event/[id]/page.tsx

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// On peut réutiliser ou redéfinir l'interface Event
interface EventData {
  id: string;
  title: string;
  description: string;
  category: string;
  eventDate: string; // Garder le format ISO pour l'input datetime-local
  locationCity: string;
  locationAddress: string;
  totalSeats: number;
  availableSeats: number;
  status: "PUBLISHED" | "DRAFT" | "CANCELLED";
  imageUrl: string;
}


export default function EditEventPage() {
  const router = useRouter() // Pour la redirection après la mise à jour
  const params = useParams() // Pour récupérer l'ID de l'URL
  const eventId = params.id as string;

  const [eventData, setEventData] = useState<Partial<EventData>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 1. Récupérer les données de l'événement à éditer
  useEffect(() => {
    if (!eventId) return; // Ne rien faire si l'ID n'est pas encore disponible

    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error("Impossible de récupérer les détails de l'événement.");
        }
        const data = await response.json();
        // Le format de la date doit être compatible avec l'input `datetime-local`
        if(data.eventDate) {
            data.eventDate = data.eventDate.substring(0, 16); // Format YYYY-MM-DDTHH:mm
        }
        setEventData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]); // Le hook se redéclenche si eventId change

  // 2. Gérer la mise à jour du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setEventData(prev => ({ ...prev, [name]: value }));
  }

  // 3. Envoyer les données mises à jour au backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error("La mise à jour de l'événement a échoué.");
      }

      alert("Événement mis à jour avec succès !");
      router.push("/dashboard/organizer"); // Rediriger vers le tableau de bord
      
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Chargement...</div>
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn={true} userName="Jane" />
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Modifier l'événement</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg border">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">Titre de l'événement</label>
            <Input id="title" name="title" value={eventData.title || ''} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
            <Textarea id="description" name="description" value={eventData.description || ''} onChange={handleChange} rows={5} />
          </div>

          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium mb-2">Date et heure</label>
            <Input id="eventDate" name="eventDate" type="datetime-local" value={eventData.eventDate || ''} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2">Statut</label>
            <Select name="status" value={eventData.status || ''} onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="DRAFT">Brouillon (DRAFT)</SelectItem>
                    <SelectItem value="PUBLISHED">Publié (PUBLISHED)</SelectItem>
                    <SelectItem value="CANCELLED">Annulé (CANCELLED)</SelectItem>
                </SelectContent>
            </Select>
          </div>
          
          {/* Ajoutez ici d'autres champs si nécessaire (ville, adresse, places, etc.) */}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Annuler
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}