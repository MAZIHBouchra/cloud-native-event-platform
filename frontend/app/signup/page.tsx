// Sign up page with registration form and validation
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/use-auth"

export default function SignupPage() {
  const router = useRouter()
  const { register, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "PARTICIPANT" as "PARTICIPANT" | "ORGANIZER",
  })
  const [formError, setFormError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRoleChange = (role: "PARTICIPANT" | "ORGANIZER") => {
    setFormData({
      ...formData,
      role,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setFormError("Please fill in all fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords must match")
      return
    }

    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters")
      return
    }

    try {
      await register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.confirmPassword,
        formData.role,
      )
      router.push("/login")
    } catch (err) {
      setFormError(error || "Registration failed")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn={false} />

      <main className="flex-grow max-w-md mx-auto w-full px-4 py-12">
        <div className="bg-card rounded-lg border border-border shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground mb-6">Join EventHub to discover amazing events</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {formError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
                {formError}
              </div>
            )}

            <div className="space-y-3 mb-6">
              <label className="block text-sm font-medium">I want to:</label>
              <div className="space-y-2">
                <label
                  className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleRoleChange("PARTICIPANT")}
                >
                  <input
                    type="radio"
                    name="role"
                    value="PARTICIPANT"
                    checked={formData.role === "PARTICIPANT"}
                    onChange={() => handleRoleChange("PARTICIPANT")}
                    className="w-4 h-4 text-primary cursor-pointer"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium">Discover and attend events</p>
                    <p className="text-xs text-muted-foreground">Browse and register for events</p>
                  </div>
                </label>

                <label
                  className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleRoleChange("ORGANIZER")}
                >
                  <input
                    type="radio"
                    name="role"
                    value="ORGANIZER"
                    checked={formData.role === "ORGANIZER"}
                    onChange={() => handleRoleChange("ORGANIZER")}
                    className="w-4 h-4 text-primary cursor-pointer"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium">Create and manage events</p>
                    <p className="text-xs text-muted-foreground">Host events and engage participants</p>
                  </div>
                </label>
              </div>
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 py-2">
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
