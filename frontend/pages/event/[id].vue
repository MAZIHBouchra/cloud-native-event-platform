<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div v-if="isLoading" class="text-center py-12">
      <p class="text-muted-foreground">Loading event...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-destructive">Error loading event</p>
      <NuxtLink to="/events" class="text-primary hover:underline mt-4 inline-block">Back to Events</NuxtLink>
    </div>

    <div v-else-if="event" class="space-y-8">
      <NuxtLink to="/events" class="inline-flex items-center text-muted-foreground hover:text-primary transition">
        ← Back to Events
      </NuxtLink>

      <div class="relative h-64 md:h-96 rounded-lg overflow-hidden bg-muted">
        <img :src="event.imageUrl || '/placeholder.svg'" :alt="event.title" class="w-full h-full object-cover" />
        <span v-if="event.category" class="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
          {{ event.category }}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-6">
          <div>
            <h1 class="text-4xl font-bold mb-4">{{ event.title }}</h1>
            <p class="text-lg text-muted-foreground">{{ event.description }}</p>
          </div>

          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <Calendar class="w-5 h-5 text-primary" />
              <div>
                <p class="font-medium">{{ formattedDate }}</p>
                <p v-if="event.time" class="text-sm text-muted-foreground">{{ event.time }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <MapPin class="w-5 h-5 text-primary" />
              <div>
                <p class="font-medium">{{ event.city }}</p>
                <p v-if="event.address" class="text-sm text-muted-foreground">{{ event.address }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Users class="w-5 h-5 text-primary" />
              <div>
                <p class="font-medium">{{ event.remainingSeats }} of {{ event.totalSeats }} seats available</p>
              </div>
            </div>
          </div>
        </div>

        <div class="md:col-span-1">
          <div class="bg-card border border-border rounded-lg p-6 sticky top-24">
            <div class="space-y-4">
              <div>
                <p class="text-2xl font-bold mb-1">Free</p>
                <p class="text-sm text-muted-foreground">{{ event.remainingSeats }} seats remaining</p>
              </div>

              <button
                :disabled="event.remainingSeats === 0"
                :class="[
                  'w-full px-4 py-3 rounded-md font-medium transition',
                  event.remainingSeats === 0
                    ? 'border border-border bg-transparent text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                ]"
              >
                {{ event.remainingSeats === 0 ? 'Fully Booked' : 'Register Now' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Calendar, MapPin, Users } from 'lucide-vue-next'
const route = useRoute()
const eventId = route.params.id as string
const { event, isLoading, error } = useEvent(eventId)
const formattedDate = computed(() => {
  if (!event.value) return ''
  return new Date(event.value.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
})
</script>
