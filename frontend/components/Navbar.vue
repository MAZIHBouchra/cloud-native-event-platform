<template>
  <nav class="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span class="text-primary-foreground font-bold text-lg">AD</span>
        </div>
        <span class="font-bold text-xl text-primary hidden sm:inline">Adray ⴰⴷⵔⴰⵢ</span>
      </NuxtLink>
      <div class="hidden md:flex items-center gap-8">
        <NuxtLink to="/" class="text-foreground hover:text-primary transition">Home</NuxtLink>
        <NuxtLink to="/events" class="text-foreground hover:text-primary transition">Browse Events</NuxtLink>
      </div>
      <div class="hidden md:flex items-center gap-3">
        <NuxtLink to="/login">
          <button class="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition">Login</button>
        </NuxtLink>
        <NuxtLink to="/signup">
          <button class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90">Sign Up</button>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next'
const isMenuOpen = ref(false)
</script>
