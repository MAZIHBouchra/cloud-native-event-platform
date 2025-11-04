<template>
  <footer class="bg-card border-t border-border mt-16">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span class="text-primary-foreground font-bold">AD</span>
            </div>
            <span class="font-bold text-lg text-primary">Adray ⴰⴷⵔⴰⵢ</span>
          </div>
          <p class="text-muted-foreground text-sm">Discover and register for amazing events.</p>
        </div>
        <div>
          <h3 class="font-semibold mb-3">Company</h3>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" class="hover:text-primary transition">About Us</a></li>
            <li><a href="#" class="hover:text-primary transition">Contact</a></li>
            <li><a href="#" class="hover:text-primary transition">Blog</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold mb-3">Support</h3>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" class="hover:text-primary transition">Help Center</a></li>
            <li><a href="#" class="hover:text-primary transition">FAQs</a></li>
            <li><a href="#" class="hover:text-primary transition">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold mb-3">Connect</h3>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" class="hover:text-primary transition">Twitter</a></li>
            <li><a href="#" class="hover:text-primary transition">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-border pt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {{ new Date().getFullYear() }} Adray ⴰⴷⵔⴰⵢ. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
</script>

