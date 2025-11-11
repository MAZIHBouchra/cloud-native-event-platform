/**
 * Custom hooks for fetching and managing events data
 * Uses SWR (stale-while-revalidate) pattern for efficient client-side caching
 *
 * Hooks:
 * - useEvents: Fetch multiple events with optional filters
 * - useEvent: Fetch single event details by ID
 */

import useSWR from "swr"

/** Event data structure */
interface Event {
  id: string
  title: string
  description: string
  date: string
  city: string
  category: string
  remainingSeats: number
  totalSeats: number
  imageUrl: string
}

// SWR fetcher function for making API calls
const fetcher = (url: string) => fetch(url).then((res) => res.json())

/**
 * Hook to fetch events with optional filtering
 * Uses SWR for efficient caching and revalidation
 *
 * @param filters - Optional object with search, city, category filters
 * @returns Object with events array, loading state, and error
 *
 * Example:
 * const { events, isLoading, error } = useEvents({ city: 'New York', category: 'Technology' })
 */
export function useEvents(filters?: Record<string, string>) {
  const query = new URLSearchParams(filters || {}).toString()
  const url = `/api/events${query ? `?${query}` : ""}`

  const { data, error, isLoading } = useSWR<{ events: Event[] }>(url, fetcher)

  return {
    events: data?.events || [],
    isLoading,
    error,
  }
}

/**
 * Hook to fetch single event details by ID
 * Returns null while loading or if event not found
 *
 * @param eventId - The ID of the event to fetch
 * @returns Object with event data, loading state, and error
 *
 * Example:
 * const { event, isLoading, error } = useEvent('event-123')
 */
export function useEvent(eventId: string) {
  const { data, error, isLoading } = useSWR(eventId ? `/api/events/${eventId}` : null, fetcher)

  return {
    event: data?.event,
    isLoading,
    error,
  }
}
