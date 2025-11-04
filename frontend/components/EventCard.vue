<template>
  <div class="bg-card rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
    <div class="relative h-48 bg-muted overflow-hidden">
      <img
        :src="imageUrl || '/placeholder.svg'"
        :alt="title"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
      <span v-if="category" class="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
        {{ category }}
      </span>
    </div>
    <div class="p-4 flex flex-col flex-grow">
      <h3 class="font-semibold text-lg text-foreground mb-2 line-clamp-2">{{ title }}</h3>
      <p class="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">{{ description }}</p>
      <div class="space-y-2 mb-4 text-sm text-muted-foreground">
        <div class="flex items-center gap-2">
          <Calendar class="w-4 h-4 text-primary" />
          <span>{{ formattedDate }}</span>
        </div>
        <div class="flex items-center gap-2">
          <MapPin class="w-4 h-4 text-primary" />
          <span>{{ city }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Users class="w-4 h-4 text-primary" />
          <span :class="remainingSeats === 0 ? 'text-destructive font-medium' : ''">
            {{ remainingSeats }} of {{ totalSeats }} seats
          </span>
        </div>
      </div>
      <NuxtLink :to="`/event/${id}`" class="w-full">
        <button
          :disabled="isFullyBooked"
          :class="[
            'w-full px-4 py-2 rounded-md transition',
            isFullyBooked
              ? 'border border-border bg-transparent text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          ]"
        >
          {{ isFullyBooked ? 'Fully Booked' : 'See Details' }}
        </button>
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Calendar, MapPin, Users } from 'lucide-vue-next'

interface Props {
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

const props = defineProps<Props>()
const isFullyBooked = computed(() => props.remainingSeats === 0)
const formattedDate = computed(() => {
  return new Date(props.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})
</script>

