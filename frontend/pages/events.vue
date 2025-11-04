<template>
  <div>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-8">Browse Events</h1>

      <!-- Filters -->
      <div class="bg-card border border-border rounded-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Search</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search events..."
              class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">City</label>
            <select
              v-model="filters.city"
              class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Cities</option>
              <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Category</label>
            <select
              v-model="filters.category"
              class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Events Grid -->
      <div v-if="isLoading" class="text-center py-12">
        <p class="text-muted-foreground">Loading events...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-destructive">Error loading events: {{ error }}</p>
      </div>

      <div v-else-if="events.length === 0" class="text-center py-12">
        <p class="text-muted-foreground">No events found. Try adjusting your filters.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EventCard
          v-for="event in events"
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
    </div>
  </div>
</template>

<script setup lang="ts">
const filters = ref({
  city: '',
  category: '',
  search: '',
})

const categories = ['Technology', 'Design', 'Business', 'Education', 'Entertainment']
const cities = ['New York', 'San Francisco', 'Austin', 'Chicago', 'Los Angeles']

const { events, isLoading, error } = useEvents(filters)
</script>
