<template>
  <div class="max-w-md mx-auto px-4 py-16">
    <h1 class="text-3xl font-bold mb-8 text-center">Login</h1>
    
    <form @submit.prevent="handleSubmit" class="space-y-6 bg-card border border-border rounded-lg p-8">
      <div v-if="formError" class="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
        {{ formError }}
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Email</label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Password</label>
        <input
          v-model="password"
          type="password"
          required
          class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition disabled:opacity-50"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <div class="text-center text-sm text-muted-foreground">
        Don't have an account?
        <NuxtLink to="/signup" class="text-primary hover:underline">Sign up</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { login, loading } = useAuth()
const email = ref('')
const password = ref('')
const formError = ref('')

const handleSubmit = async () => {
  formError.value = ''
  if (!email.value || !password.value) {
    formError.value = 'Please fill in all fields'
    return
  }
  try {
    await login(email.value, password.value)
    router.push('/')
  } catch (err) {
    formError.value = 'Login failed. Please try again.'
  }
}
</script>
