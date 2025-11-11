"use client"

/**
 * Custom hook for authentication state management
 * Handles user registration, login, and logout with localStorage persistence
 *
 * Usage:
 * const { user, loading, error, login, register, logout } = useAuth()
 */

import { useState, useCallback } from "react"

/** User interface representing authenticated user data */
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "PARTICIPANT" | "ORGANIZER"
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Login user with email and password
   * Stores authentication token in localStorage for persistence
   *
   * @param email - User email address
   * @param password - User password
   * @returns User object on successful login
   * @throws Error if login fails
   */
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      setUser(data.user)
      localStorage.setItem("authToken", data.token)
      return data.user
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Register new user with validation
   *
   * @param firstName - User's first name
   * @param lastName - User's last name
   * @param email - User's email address
   * @param password - User's password (minimum 8 characters)
   * @param confirmPassword - Password confirmation for validation
   * @param role - User role determining participant vs organizer experience
   * @returns Registration response object
   * @throws Error if registration fails or validation fails
   */
  const register = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      confirmPassword: string,
      role: "PARTICIPANT" | "ORGANIZER",
    ) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, password, confirmPassword, role }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Registration failed")
        }

        const data = await response.json()
        return data
      } catch (err) {
        const message = err instanceof Error ? err.message : "Registration failed"
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  /**
   * Logout user and clear authentication state
   * Removes stored authentication token from localStorage
   */
  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("authToken")
  }, [])

  return { user, loading, error, login, register, logout }
}
