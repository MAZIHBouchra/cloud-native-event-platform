<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-32 px-4">
      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden">
        <!-- Gradient orb 1 - top left -->
        <div class="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <!-- Gradient orb 2 - bottom right -->
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tl from-secondary/20 to-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div class="relative max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left side - Text content -->
          <div class="flex flex-col justify-center">
            <div class="inline-flex items-center gap-2 mb-6 w-fit px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
              <Sparkles class="w-4 h-4 text-primary" />
              <span class="text-sm font-medium text-primary">Experience Events Like Never Before</span>
            </div>

            <h1 class="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Connect, Attend,
              <span class="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Inspire
              </span>
            </h1>

            <p class="text-xl text-slate-300 mb-8 leading-relaxed max-w-xl">
              Discover amazing events, connect with like-minded people, and unlock opportunities. From tech
              conferences to creative workshops, find your next inspiration.
            </p>

            <!-- Search Bar -->
            <div class="flex flex-col gap-4">
              <div class="flex gap-2">
                <div class="flex-grow relative">
                  <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search events, cities, or categories..."
                    class="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-slate-500 transition"
                  />
                </div>
                <NuxtLink to="/events">
                  <button class="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition font-medium">
                    Search
                  </button>
                </NuxtLink>
              </div>
            </div>

            <!-- Stats -->
            <div class="flex gap-8 mt-12 pt-8 border-t border-slate-700/50">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p class="text-xs text-slate-400">Active Users</p>
                  <p class="text-lg font-bold text-white">50K+</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p class="text-xs text-slate-400">Events</p>
                  <p class="text-lg font-bold text-white">1000+</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right side - Floating cards -->
          <div class="relative h-96 md:h-[500px] hidden lg:block">
            <!-- Card 1 - Top center -->
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 animate-float-1 w-64">
              <div class="bg-gradient-to-br from-purple-400 via-pink-300 to-purple-300 rounded-2xl p-6 shadow-2xl backdrop-blur-sm border border-white/20">
                <div class="bg-slate-900/40 rounded-xl p-4">
                  <p class="text-sm font-semibold text-white mb-2">Tech Summit 2025</p>
                  <p class="text-xs text-slate-200">Leading innovation conference</p>
                </div>
              </div>
            </div>

            <!-- Card 2 - Left -->
            <div class="absolute left-0 top-1/2 transform -translate-y-1/2 animate-float-2 w-56">
              <div class="bg-gradient-to-br from-orange-400 via-red-400 to-orange-300 rounded-2xl p-1 shadow-2xl">
                <div class="bg-slate-900 rounded-2xl p-6 h-44 flex flex-col justify-between">
                  <div class="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg"></div>
                  <div>
                    <p class="text-sm font-bold text-white">Creative Workshop</p>
                    <p class="text-xs text-slate-400 mt-1">120 attendees</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card 3 - Right -->
            <div class="absolute right-0 top-1/3 animate-float-3 w-56">
              <div class="bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-300 rounded-2xl p-1 shadow-2xl">
                <div class="bg-slate-900 rounded-2xl p-6 h-44 flex flex-col justify-between">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg"></div>
                  <div>
                    <p class="text-sm font-bold text-white">Design Expo</p>
                    <p class="text-xs text-slate-400 mt-1">85 registered</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card 4 - Bottom center -->
            <div class="absolute bottom-0 left-1/3 animate-float-4 w-52 delay-1000">
              <div class="bg-gradient-to-br from-green-400 via-emerald-400 to-green-300 rounded-2xl p-1 shadow-2xl">
                <div class="bg-slate-900 rounded-2xl p-5">
                  <p class="text-sm font-bold text-white mb-1">Networking Night</p>
                  <p class="text-xs text-slate-400">Join us tonight!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Events Section -->
    <section class="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div class="mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-3">Upcoming Events</h2>
        <p class="text-muted-foreground text-lg">Register for exciting events happening soon</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EventCard
          v-for="event in featuredEvents"
          :key="event.id"
          :id="event.id"
          :title="event.title"
          :description="event.description"
          :date="event.date"
          :city="event.city"
          :remaining-seats="event.remainingSeats"
          :total-seats="event.totalSeats"
          :image-url="event.imageUrl"
          :category="event.category"
        />
      </div>

      <div class="text-center mt-12">
        <NuxtLink to="/events">
          <button class="px-8 py-3 border border-border rounded-lg bg-transparent hover:bg-muted transition">
            Browse All Events
          </button>
        </NuxtLink>
      </div>
    </section>

    <!-- Features Section -->
    <section class="bg-muted/50 py-16 md:py-24 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Users class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Connect</h3>
            <p class="text-muted-foreground">Meet like-minded people and expand your network</p>
          </div>
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <MapPin class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Discover</h3>
            <p class="text-muted-foreground">Find amazing events happening near you</p>
          </div>
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Sparkles class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Inspire</h3>
            <p class="text-muted-foreground">Learn and grow from incredible experiences</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Search, Sparkles, Users, MapPin } from 'lucide-vue-next'

const searchQuery = ref('')

// Mock featured events
const featuredEvents = [
  {
    id: "event-1",
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
    id: "event-2",
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
    id: "event-3",
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
</script>
