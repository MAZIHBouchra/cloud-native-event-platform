/**
 * EventCard Component
 *
 * Reusable card component for displaying event listings
 * Shows event image, title, date, location, category badge, and availability
 * Supports disabled state when event is fully booked
 *
 * Props:
 * - id: Event ID for linking
 * - title: Event title
 * - description: Short event description
 * - date: Event date (ISO string)
 * - city: Event location city
 * - remainingSeats: Number of available seats
 * - totalSeats: Total event capacity
 * - imageUrl: Event image URL
 * - category: Event category (optional)
 */

import { MapPin, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EventCardProps {
  id: string
  title: string
  description: string
  date: string
  city: string
  remainingSeats: number
  totalSeats: number
  imageUrl: string
  category?: string
}

export function EventCard({
  id,
  title,
  description,
  date,
  city,
  remainingSeats,
  totalSeats,
  imageUrl,
  category,
}: EventCardProps) {
  const isFullyBooked = remainingSeats === 0

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
      {/* Event Image Section with Category Badge */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {category && (
          <span className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
            {category}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title and Description */}
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">{description}</p>

        {/* Event Information - Date, Location, Seats */}
        <div className="space-y-2 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span className={remainingSeats === 0 ? "text-destructive font-medium" : ""}>
              {remainingSeats} of {totalSeats} seats
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/event/${id}`} className="w-full">
          <Button disabled={isFullyBooked} className="w-full" variant={isFullyBooked ? "outline" : "default"}>
            {isFullyBooked ? "Fully Booked" : "See Details"}
          </Button>
        </Link>
      </div>
    </div>
  )
}
