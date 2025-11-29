// Home page with hero section and featured events
"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { Search, Sparkles, Users, MapPin } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock featured events
  const featuredEvents = [
    {
      id: "1",
      title: "Web Development Masterclass",
      description: "Learn modern web development with React, Next.js, and TailwindCSS",
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      city: "New York",
      remainingSeats: 85,
      totalSeats: 100,
      imageUrl: "/web-development-event.jpg",
      category: "Technology",
    },
    {
      id: "2",
      title: "Design Systems Workshop",
      description: "Build scalable design systems for modern applications",
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      city: "San Francisco",
      remainingSeats: 25,
      totalSeats: 50,
      imageUrl: "/design-systems-workshop.png",
      category: "Design",
    },
    {
      id: "3",
      title: "AI & Machine Learning Conference",
      description: "Explore cutting-edge AI technologies and their real-world applications",
      date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      city: "Austin",
      remainingSeats: 120,
      totalSeats: 200,
      imageUrl: "/artificial-intelligence-conference.jpg",
      category: "Technology",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn={false} />

      <main className="flex-grow">
        {/* Hero Section - Creative with Floating Cards */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-32 px-4">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Gradient orb 1 - top left */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
            {/* Gradient orb 2 - bottom right */}
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tl from-secondary/20 to-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          {/* Content container with floating cards */}
          <div className="relative max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Text content */}
              <div className="flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 mb-6 w-fit px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Experience Events Like Never Before</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Connect, Attend,{" "}
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Inspire
                  </span>
                </h1>

                <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-xl">
                  Discover amazing events, connect with like-minded people, and unlock opportunities. From tech
                  conferences to creative workshops, find your next inspiration.
                </p>

                {/* Search Bar */}
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <div className="flex-grow relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search events, cities, or categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-slate-500 transition"
                      />
                    </div>
                    <Link href={`/events?search=${searchQuery}`}>
                      <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-4 rounded-xl font-semibold">
                        Search
                      </Button>
                    </Link>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <Link href="/events">
                      <Button
                        variant="outline"
                        className="rounded-xl border-slate-600 hover:bg-slate-800/50 bg-transparent"
                      >
                        Browse All Events
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-8 mt-12 pt-8 border-t border-slate-700/50">
                  {[
                    { icon: Users, label: "Active Users", value: "50K+" },
                    { icon: MapPin, label: "Events", value: "1000+" },
                  ].map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <stat.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">{stat.label}</p>
                        <p className="text-lg font-bold text-white">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side - Floating cards */}
              <div className="relative h-96 md:h-[500px] hidden lg:block">
                {/* Card 1 - Top center */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-float-1 w-64">
                  <div className="bg-gradient-to-br from-purple-400 via-pink-300 to-purple-300 rounded-2xl p-6 shadow-2xl backdrop-blur-sm border border-white/20">
                    <div className="bg-slate-900/40 rounded-xl p-4">
                      <p className="text-sm font-semibold text-white mb-2">Tech Summit 2025</p>
                      <p className="text-xs text-slate-200">Leading innovation conference</p>
                    </div>
                  </div>
                </div>

                {/* Card 2 - Left */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 animate-float-2 w-56">
                  <div className="bg-gradient-to-br from-orange-400 via-red-400 to-orange-300 rounded-2xl p-1 shadow-2xl">
                    <div className="bg-slate-900 rounded-2xl p-6 h-44 flex flex-col justify-between">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg"></div>
                      <div>
                        <p className="text-sm font-bold text-white">Creative Workshop</p>
                        <p className="text-xs text-slate-400 mt-1">120 attendees</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3 - Right */}
                <div className="absolute right-0 top-1/3 animate-float-3 w-56">
                  <div className="bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-300 rounded-2xl p-1 shadow-2xl">
                    <div className="bg-slate-900 rounded-2xl p-6 h-48 flex flex-col justify-between">
                      <div className="flex gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg"></div>
                        <div>
                          <p className="text-xs font-semibold text-white">Design Conf</p>
                          <p className="text-xs text-slate-400">Next week</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/60">
                          Seats left: <span className="font-bold text-white">24</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 4 - Bottom right */}
                <div className="absolute bottom-0 right-1/4 animate-float-4 w-52">
                  <div className="bg-gradient-to-br from-green-400 via-emerald-400 to-green-300 rounded-2xl p-1 shadow-2xl">
                    <div className="bg-slate-900 rounded-2xl p-5">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">⭐</p>
                        <p className="text-xs font-semibold text-white mt-2">Trending</p>
                        <p className="text-xs text-slate-400 mt-1">Web Development</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Events Section */}
        <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Upcoming Events</h2>
            <p className="text-muted-foreground text-lg">Register for exciting events happening soon</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/events">
              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                Browse All Events
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-16 md:py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Adray ⴰⴷⵔⴰⵢ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Easy Discovery",
                  description: "Search and filter events by location, category, and date",
                },
                {
                  title: "Secure Registration",
                  description: "Safe and easy event registration with instant confirmation",
                },
                {
                  title: "Stay Updated",
                  description: "Get notifications and reminders for your registered events",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition"
                >
                  <div className="w-12 h-12 bg-primary rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">{idx + 1}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
