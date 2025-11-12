import { NextResponse, type NextRequest } from "next/server"

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

export async function GET(request: NextRequest) {
  try {
    const url = new URL("/api/events", API_BASE_URL)

    request.nextUrl.searchParams.forEach((value, key) => {
      if (value) {
        url.searchParams.set(key, value)
      }
    })

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Backend events API error:", response.status, errorText)
      return NextResponse.json({ error: "Failed to load events" }, { status: 502 })
    }

    const events = (await response.json()) as BackendEvent[]

    const normalized = events.map((event) => ({
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
    }))

    return NextResponse.json({ events: normalized })
  } catch (error) {
    console.error("Events fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
