import { NextResponse } from "next/server"

const API_BASE_URL = process.env.EVENTS_API_URL ?? process.env.NEXT_PUBLIC_EVENTS_API_URL ?? "http://localhost:8080"

interface BackendEvent {
  id: string
  title: string
  description: string
  category?: string
  imageUrl?: string
  eventDate: string
  city: string
  address: string
  totalSeats: number
  availableSeats: number
}

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, route: RouteParams) {
  try {
    const { id } = await route.params
    const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (response.status === 404) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Backend event API error:", response.status, errorText)
      return NextResponse.json({ error: "Failed to load event" }, { status: 502 })
    }

    const event = (await response.json()) as BackendEvent

    const normalized = {
      id: event.id,
      title: event.title,
      description: event.description,
      category: event.category,
      imageUrl: event.imageUrl ?? "/placeholder.jpg",
      date: event.eventDate,
      city: event.city,
      address: event.address,
      totalSeats: event.totalSeats,
      remainingSeats: event.availableSeats,
    }

    return NextResponse.json({ event: normalized })
  } catch (error) {
    console.error("Event fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}
