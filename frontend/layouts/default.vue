<template>
  <div class="min-h-screen flex flex-col bg-background">
    <Navbar />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
</script>
