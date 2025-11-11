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
import { cn } from "@/lib/utils"

export default function SignupPage() {
  const router = useRouter()
  const { register, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [role, setRole] = useState<"PARTICIPANT" | "ORGANIZER">("PARTICIPANT")
  const [formError, setFormError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
        role,
      )
      router.push("/login")
    } catch (err) {
      setFormError(error || "Registration failed")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Navbar isLoggedIn={false} />

      <main className="flex-grow px-4 py-12">
        <div className="mx-auto w-full max-w-xl">
          <div className="rounded-2xl border border-border/60 bg-card shadow-lg shadow-primary/10">
            <div className="flex flex-col gap-6 px-8 py-10">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Account</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Join EventHub to discover amazing events or host your own experiences.
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">I want to</span>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      id: "PARTICIPANT",
                      title: "Discover and attend events",
                      description: "Browse and register for events.",
                    },
                    {
                      id: "ORGANIZER",
                      title: "Create and manage events",
                      description: "Host events and engage participants.",
                    },
                  ].map((option) => {
                    const isSelected = role === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setRole(option.id as typeof role)}
                        className={cn(
                          "rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border/60 hover:border-primary/60 hover:bg-primary/5",
                        )}
                        aria-pressed={isSelected}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={cn(
                              "mt-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full border-2",
                              isSelected ? "border-primary bg-primary" : "border-muted-foreground/40",
                            )}
                          />
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-foreground">{option.title}</p>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {formError && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                    {formError}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-foreground">
                    First Name
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="mt-2 w-full rounded-lg border border-border bg-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </label>

                  <label className="text-sm font-medium text-foreground">
                    Last Name
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="mt-2 w-full rounded-lg border border-border bg-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </label>
                </div>

                <label className="block text-sm font-medium text-foreground">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-lg border border-border bg-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-foreground">
                    Password
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 8 characters"
                      className="mt-2 w-full rounded-lg border border-border bg-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </label>
                  <label className="text-sm font-medium text-foreground">
                    Confirm Password
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="mt-2 w-full rounded-lg border border-border bg-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </label>
                </div>

                <Button type="submit" disabled={loading} className="w-full py-2 text-base">
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
