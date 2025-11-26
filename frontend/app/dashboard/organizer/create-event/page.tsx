// Create event form for organizers
"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import axios from "axios" // IMPORTANT : Importation d'axios

export default function CreateEventPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Technology",
    eventDate: "",
    eventTime: "",
    city: "",
    address: "",
    totalSeats: "100",
  })
  const [eventImage, setEventImage] = useState<File | null>(null) // NOUVEAU : Pour stocker le fichier image réel
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false) // NOUVEAU : Pour l'état du bouton (feedback utilisateur)
  const [error, setError] = useState<string | null>(null) // NOUVEAU : Pour afficher les messages d'erreur

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEventImage(file) // METTRE À JOUR : Stocke le fichier réel
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setEventImage(null) // NOUVEAU : Réinitialiser si aucun fichier n'est sélectionné
      setImagePreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => { // METTRE À JOUR : rendre la fonction asynchrone
    e.preventDefault()
    setLoading(true) // Activer l'état de chargement
    setError(null) // Réinitialiser l'erreur

    const data = new FormData() // NOUVEAU : Utiliser FormData pour envoyer les données et le fichier

    // NOUVEAU : Ajouter les données du formulaire en tant que JSON
    // Le nom "event" DOIT correspondre à @RequestPart("event") dans le contrôleur Spring Boot
    data.append("event", new Blob([JSON.stringify({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        city: formData.city,
        address: formData.address,
        totalSeats: parseInt(formData.totalSeats), // Convertir en nombre
    })], {
        type: "application/json"
    }))

    // NOUVEAU : Ajouter le fichier image si présent
    // Le nom "image" DOIT correspondre à @RequestPart(value = "image", ...) dans le contrôleur Spring Boot
    if (eventImage) {
      data.append("image", eventImage)
    }

    try {
      // NOUVEAU : Appel à l'API backend Spring Boot
      const response = await axios.post("http://localhost:8080/api/events", data, {
        headers: {
          "Content-Type": "multipart/form-data", // IMPORTANT pour FormData
        },
      })
      console.log("Event created successfully:", response.data)
      router.push("/dashboard/organizer") // Redirection en cas de succès
    } catch (err) {
      console.error("Error creating event:", err)
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || "Failed to create event. Please try again.")
      } else {
        setError("An unexpected error occurred. Please check your network connection.")
      }
    } finally {
      setLoading(false) // Désactiver l'état de chargement
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn={true} userName="Jane" />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Event</h1>
          <p className="text-muted-foreground">Fill in the details below to create your event</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Event Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event"
                rows={5}
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Technology</option>
                <option>Design</option>
                <option>Business</option>
                <option>Education</option>
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Event Date *</label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Event Time *</label>
                <input
                  type="time"
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Event city"
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street, City, State"
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Total Seats */}
            <div>
              <label className="block text-sm font-medium mb-2">Total Seats *</label>
              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleChange}
                min="1"
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Event Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview} // Utilisez imagePreview pour l'affichage
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? "Creating..." : "Create Event"} {/* Texte du bouton change pendant le chargement */}
              </Button>
              <Link href="/dashboard/organizer">
                <Button variant="outline" disabled={loading}>Cancel</Button> {/* Désactiver le bouton pendant le chargement */}
              </Link>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>} {/* Afficher l'erreur si elle existe */}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}