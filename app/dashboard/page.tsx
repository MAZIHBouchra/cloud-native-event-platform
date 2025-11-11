// Participant dashboard - discover and manage event attendance
"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarDays,
  MapPin,
  Clock,
  Star,
  Heart,
  Ticket,
  Bell,
  Filter,
  Plus,
} from "lucide-react"

const upcomingEvents = [
  {
    id: "1",
    title: "Women in Tech Summit",
    dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Downtown Innovation Hub",
    status: "Registered",
    category: "Conference",
    speaker: "Sofia Rahman",
  },
  {
    id: "2",
    title: "AI & Robotics Bootcamp",
    dateTime: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Future Labs, Level 4",
    status: "Ticket Saved",
    category: "Workshop",
    speaker: "Dr. Lena Flores",
  },
]

const recommendedEvents = [
  {
    id: "3",
    title: "Creative Design Showcase",
    date: "Apr 28",
    location: "BAU Arts Center",
    attendees: 230,
    rating: 4.8,
    tag: "Design",
  },
  {
    id: "4",
    title: "Community Hack Night",
    date: "May 03",
    location: "Tech Basement, Dubai",
    attendees: 120,
    rating: 4.6,
    tag: "Hackathon",
  },
  {
    id: "5",
    title: "Wellness for Founders",
    date: "May 10",
    location: "MindBody Studio",
    attendees: 90,
    rating: 4.9,
    tag: "Wellness",
  },
]

const savedCollections = [
  {
    id: "s1",
    name: "My Summer Festivals",
    count: 7,
    color: "from-pink-500/80 to-orange-400/80",
  },
  {
    id: "s2",
    name: "Talks to Attend",
    count: 4,
    color: "from-blue-500/80 to-violet-500/80",
  },
]

export default function ParticipantDashboardPage() {
  const now = new Date()

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar isLoggedIn={true} userName="Salma" />

      <main className="flex-grow">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary" variant="secondary">
                👋 Welcome back, Salma
              </Badge>
              <h1 className="text-3xl font-bold text-slate-900 lg:text-4xl">
                Ready for your next unforgettable event experience?
              </h1>
              <p className="mt-3 max-w-xl text-sm text-slate-600 lg:text-base">
                Explore curated recommendations matched to your interests, keep track of tickets, and get reminders for
                sessions you love.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/events">
                  <Button className="bg-primary hover:bg-primary/90">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Browse Events
                  </Button>
                </Link>
                <Link href="/events?filter=near-me">
                  <Button variant="outline">
                    <MapPin className="mr-2 h-4 w-4" />
                    Events Near Me
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid w-full max-w-sm gap-4 rounded-2xl border border-slate-200 bg-slate-100/80 p-6 shadow-sm">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Next Event</span>
                <span>{now.toLocaleDateString(undefined, { month: "long", day: "numeric" })}</span>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Women in Tech Summit</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <span>Apr {now.getDate() + 5} · 9:30 AM</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Downtown Innovation Hub</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    Registered
                  </Badge>
                  <Button size="sm" variant="link" className="text-primary">
                    View ticket
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
                <div>
                  <p className="text-xs text-slate-500">Reminder</p>
                  <p className="text-sm font-semibold text-slate-900">Check-in opens in 4 days</p>
                </div>
                <Bell className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900 lg:text-xl">Your upcoming plans</h2>
            <Button variant="outline" size="sm">
              <Ticket className="mr-2 h-4 w-4" />
              Manage tickets
            </Button>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {upcomingEvents.map((event) => (
              <article
                key={event.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
              >
                <div className="relative h-36 w-full bg-slate-200">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                      {event.category}
                    </Badge>
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Clock className="h-4 w-4" />
                      {new Date(event.dateTime).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary">{event.title}</h3>
                  <p className="text-sm text-slate-600">Featuring {event.speaker}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-primary/70" />
                    {event.location}
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {event.status}
                    </Badge>
                    <Button variant="link" className="text-primary">
                      View details
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900 lg:text-xl">Recommended for you</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                <Button variant="outline" size="sm">
                  View all
                </Button>
              </div>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {recommendedEvents.map((event) => (
                <article
                  key={event.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{event.date}</span>
                    <span className="flex items-center gap-1 font-medium text-amber-500">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {event.rating}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{event.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-primary/70" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Ticket className="h-4 w-4 text-primary/70" />
                    {event.attendees} attendees going
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {event.tag}
                    </Badge>
                    <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900 lg:text-xl">Your collections</h2>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New collection
            </Button>
          </div>
          <Tabs defaultValue="saved" className="mt-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="interests">Interests</TabsTrigger>
            </TabsList>

            <TabsContent value="saved" className="mt-6 grid gap-5 md:grid-cols-2">
              {savedCollections.map((collection) => (
                <article
                  key={collection.id}
                  className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${collection.color} p-6 text-white shadow-sm`}
                >
                  <p className="text-sm uppercase tracking-wide text-white/80">Collection</p>
                  <h3 className="mt-3 text-xl font-semibold">{collection.name}</h3>
                  <p className="mt-2 text-sm text-white/80">{collection.count} events saved</p>
                  <Button variant="secondary" className="mt-6 bg-white/20 text-white hover:bg-white/30">
                    View collection
                  </Button>
                </article>
              ))}
            </TabsContent>

            <TabsContent
              value="history"
              className="flex min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-sm text-slate-500"
            >
              Your past events will live here once you start attending.
            </TabsContent>

            <TabsContent
              value="interests"
              className="flex min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-sm text-slate-500"
            >
              Choose more interests to get smarter recommendations.
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  )
}

