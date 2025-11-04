interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'PARTICIPANT' | 'ORGANIZER'
}

const user = ref<User | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

if (process.client) {
  const storedToken = localStorage.getItem('authToken')
  const storedUser = localStorage.getItem('authUser')
  if (storedToken && storedUser) {
    try {
      user.value = JSON.parse(storedUser)
    } catch (e) {}
  }
}

export const login = async (email: string, password: string) => {
  loading.value = true
  error.value = null
  try {
    // Mock login - accept any email/password for demo
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    
    const mockUser: User = {
      id: '1',
      email: email,
      firstName: 'John',
      lastName: 'Doe',
      role: 'PARTICIPANT'
    }
    
    const mockToken = 'mock-jwt-token-' + Date.now()
    
    user.value = mockUser
    if (process.client) {
      localStorage.setItem('authToken', mockToken)
      localStorage.setItem('authUser', JSON.stringify(mockUser))
    }
    return mockUser
  } catch (err: any) {
    error.value = 'Login failed'
    throw err
  } finally {
    loading.value = false
  }
}

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  role: 'PARTICIPANT' | 'ORGANIZER' = 'PARTICIPANT'
) => {
  loading.value = true
  error.value = null
  try {
    // Mock registration - validate password match
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match')
    }
    
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }
    
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    
    // Mock successful registration
    return { message: 'Registration successful' }
  } catch (err: any) {
    error.value = err.message || 'Registration failed'
    throw err
  } finally {
    loading.value = false
  }
}

export const logout = () => {
  user.value = null
  if (process.client) {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  }
}

export const isLoggedIn = computed(() => user.value !== null)

export function useAuth() {
  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    isLoggedIn,
    login,
    register,
    logout
  }
}
