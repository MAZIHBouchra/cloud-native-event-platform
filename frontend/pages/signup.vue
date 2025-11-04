<template>
  <div class="max-w-md mx-auto px-4 py-16">
    <h1 class="text-3xl font-bold mb-8 text-center">Sign Up</h1>
    
    <form @submit.prevent="handleSubmit" class="space-y-6 bg-card border border-border rounded-lg p-8">
      <div v-if="formError" class="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
        {{ formError }}
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">First Name</label>
          <input v-model="firstName" type="text" required class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Last Name</label>
          <input v-model="lastName" type="text" required class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Email</label>
        <input v-model="email" type="email" required class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Password</label>
        <input v-model="password" type="password" required class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Confirm Password</label>
        <input v-model="confirmPassword" type="password" required class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition disabled:opacity-50"
      >
        {{ loading ? 'Creating account...' : 'Sign Up' }}
      </button>

      <div class="text-center text-sm text-muted-foreground">
        Already have an account?
        <NuxtLink to="/login" class="text-primary hover:underline">Login</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { register, loading } = useAuth()
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const formError = ref('')

const handleSubmit = async () => {
  formError.value = ''
  if (!firstName.value || !lastName.value || !email.value || !password.value) {
    formError.value = 'Please fill in all fields'
    return
  }
  if (password.value !== confirmPassword.value) {
    formError.value = 'Passwords must match'
    return
  }
  if (password.value.length < 8) {
    formError.value = 'Password must be at least 8 characters'
    return
  }
  try {
    await register(firstName.value, lastName.value, email.value, password.value, confirmPassword.value)
    router.push('/login')
  } catch (err: any) {
    formError.value = err.message || 'Registration failed'
  }
}
</script>
