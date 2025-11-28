"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { useEvents } from "@/lib/hooks/use-events"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/use-auth" // Import Auth

export default function EventsPage() {
  const { user } = useAuth() // On récupère l'info utilisateur
  
  const [filters, setFilters] = useState({
    city: "",
    category: "",
    search: "",
  })

  const { events, isLoading, error } = useEvents(filters)

  const categories = ["Technology", "Design", "Business", "Education", "Entertainment"]
  const cities = ["New York", "San Francisco", "Austin", "Chicago", "Los Angeles"]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* NAVBAR DYNAMIQUE */}
      <Navbar 
        isLoggedIn={!!user} 
        userName={user?.email ? user.email.split('@')[0] : "User"} 
      />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Browse Events</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Filters</h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Event name..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Category</label>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.category === cat}
                        onChange={() => setFilters({ ...filters, category: filters.category === cat ? "" : cat })}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* City Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">City</label>
                <div className="space-y-2">
                  {cities.map((city) => (
                    <label key={city} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.city === city}
                        onChange={() => setFilters({ ...filters, city: filters.city === city ? "" : city })}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-sm">{city}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => setFilters({ city: "", category: "", search: "" })}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Events Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading events...</p>
                </div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No events found matching your criteria</p>
                <Button variant="outline" onClick={() => setFilters({ city: "", category: "", search: "" })}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}