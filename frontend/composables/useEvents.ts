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
  address?: string
  time?: string
  organizer?: string
}

// Mock events data
const mockEvents: Event[] = [
  {
    id: "event-1",
    title: "Web Development Masterclass",
    description: "Learn modern web development with React, Next.js, and TailwindCSS",
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    city: "New York",
    address: "123 Tech Street, NYC",
    category: "Technology",
    remainingSeats: 85,
    totalSeats: 100,
    imageUrl: "/web-development-event.jpg",
    time: "10:00 AM - 6:00 PM",
    organizer: "Tech Academy",
  },
  {
    id: "event-2",
    title: "Design Systems Workshop",
    description: "Build scalable design systems for modern applications",
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    city: "San Francisco",
    address: "456 Design Ave, SF",
    category: "Design",
    remainingSeats: 25,
    totalSeats: 50,
    imageUrl: "/design-workshop-event.png",
    time: "2:00 PM - 5:00 PM",
    organizer: "Design Studio",
  },
  {
    id: "event-3",
    title: "AI & Machine Learning Conference",
    description: "Explore cutting-edge AI technologies and their real-world applications",
    date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    city: "Austin",
    address: "789 AI Boulevard, Austin",
    category: "Technology",
    remainingSeats: 120,
    totalSeats: 200,
    imageUrl: "/artificial-intelligence-conference.jpg",
    time: "9:00 AM - 7:00 PM",
    organizer: "AI Research Lab",
  },
]

export function useEvents(filters?: Record<string, string>) {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const events = computed(() => {
    let filtered = [...mockEvents]
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(searchLower) ||
          e.description.toLowerCase().includes(searchLower)
      )
    }
    
    if (filters?.city) {
      filtered = filtered.filter((e) => e.city.toLowerCase() === filters.city!.toLowerCase())
    }
    
    if (filters?.category) {
      filtered = filtered.filter((e) => e.category.toLowerCase() === filters.category!.toLowerCase())
    }

    return filtered
  })

  return {
    events,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value)
  }
}

export function useEvent(eventId: string) {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const event = computed(() => {
    if (!eventId) return null
    return mockEvents.find(e => e.id === eventId) || null
  })

  return {
    event,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value)
  }
}
