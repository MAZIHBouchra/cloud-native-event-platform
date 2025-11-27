"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth" // 👇 Import de l'auth
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Interface des données
interface EventData {
  id: string;
  title: string;
  description: string;
  category: string;
  eventDate: string;
  locationCity: string;
  locationAddress: string;
  totalSeats: number;
  availableSeats: number;
  status: "PUBLISHED" | "DRAFT" | "CANCELLED";
  imageUrl: string;
}

// ⚠️ IMPORTANT : Pas de "async" ici pour un composant client !
export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  // Utilisation sécurisée de l'ID (peut être un tableau ou undefined)
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { user } = useAuth(); // 👇 Récupération de l'utilisateur connecté

  const [eventData, setEventData] = useState<Partial<EventData>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 1. Chargement des données
  useEffect(() => {
    if (!eventId) return;

    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error("Impossible de récupérer les détails de l'événement.");
        }
        const data = await response.json();
        
        // Formatage de la date pour l'input HTML (YYYY-MM-DDTHH:mm)
        if(data.eventDate && data.eventDate.length >= 10) {
            // Si c'est juste une date YYYY-MM-DD, on ajoute une heure par défaut ou on garde tel quel
            // Si c'est ISO, on coupe. Ici on suppose que le backend renvoie YYYY-MM-DD
            // On adapte pour que l'input ne plante pas
            data.eventDate = data.eventDate.substring(0, 10); 
        }
        
        setEventData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  // 2. Gestion des changements (Input texte)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };
  
  // Gestion des changements (Select)
  const handleSelectChange = (name: string, value: string) => {
    setEventData(prev => ({ ...prev, [name]: value }));
  }

  // 3. Soumission du formulaire
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

      // Succès : on redirige
      router.push("/dashboard/organizer"); 
      
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Chargement...</div>
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar dynamique */}
      <Navbar 
        isLoggedIn={true} 
        userName={user?.email ? user.email.split('@')[0] : "Organisateur"} 
      />

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
            <label htmlFor="eventDate" className="block text-sm font-medium mb-2">Date</label>
            {/* Type date car votre backend utilise LocalDate (pas d'heure) */}
            <Input id="eventDate" name="eventDate" type="date" value={eventData.eventDate || ''} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-2">Ville</label>
            <Input id="city" name="city" value={eventData.locationCity || ''} onChange={(e) => setEventData({...eventData, locationCity: e.target.value})} required />
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