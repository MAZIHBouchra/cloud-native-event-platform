"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation" // Ajout de useRouter
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Users, Share2 } from "lucide-react"
import { useEvent } from "@/lib/hooks/use-events"
import { useAuth } from "@/lib/hooks/use-auth" // Ajout du hook d'auth
import Link from "next/link"

export default function EventDetailsPage() {
  const params = useParams()
  const router = useRouter() // Pour la redirection
  const eventId = params.id as string
  
  // Récupération de l'événement et de l'utilisateur connecté
  const { event, isLoading } = useEvent(eventId)
  const { user } = useAuth() 
  
  const [isRegistered, setIsRegistered] = useState(false)

  // Gestion du clic sur le bouton
  const handleRegisterAction = () => {
    if (!user) {
        // SCÉNARIO VISITEUR : On redirige vers l'inscription
        router.push("/signup");
    } else {
        // SCÉNARIO CONNECTÉ : On inscrit l'utilisateur (Simulation pour l'instant)
        setIsRegistered(true);
        // Plus tard, ici, on fera un appel API vers le backend : POST /api/registrations
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar isLoggedIn={!!user} userName={user?.email?.split('@')[0]} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading event details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar isLoggedIn={!!user} userName={user?.email?.split('@')[0]} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">Event not found</p>
            <Link href="/events">
              <Button>Back to Events</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isFullyBooked = event.remainingSeats === 0
  const seatPercentage = ((event.totalSeats - event.remainingSeats) / event.totalSeats) * 100

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* NAVBAR DYNAMIQUE : S'adapte si on est connecté ou non */}
      <Navbar 
        isLoggedIn={!!user} 
        userName={user?.email ? user.email.split('@')[0] : "User"} 
      />

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Event Image */}
          <div className="rounded-lg overflow-hidden mb-8 h-96 bg-muted">
            <img src={event.imageUrl || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
          </div>

          {/* Event Title & Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
              <p className="text-muted-foreground text-lg">
                {event.category} • Organized by {event.organizer}
              </p>
            </div>
            <Button variant="outline" size="icon">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Details */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">{event.description}</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Location Details</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">{event.address}, {event.city}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                {/* Seat Availability */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Seat Availability</span>
                    <span className="text-sm font-semibold">{seatPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${seatPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {event.remainingSeats === 0 ? "Event is fully booked" : `Only ${event.remainingSeats} seats left!`}
                  </p>
                </div>

                {/* Registration Button INTELLIGENT */}
                <Button
                  disabled={isFullyBooked || isRegistered}
                  onClick={handleRegisterAction} 
                  className="w-full py-6 text-base font-semibold bg-primary hover:bg-primary/90"
                >
                  {isFullyBooked 
                    ? "Fully Booked" 
                    : isRegistered 
                        ? "Already Registered" 
                        : user 
                            ? "Register Now" // Si connecté
                            : "Login to Register" // Si visiteur
                  }
                </Button>

                {isRegistered && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                    You've been registered! Check your email for confirmation.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}