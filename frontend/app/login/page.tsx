// Login page with email and password form
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"PARTICIPANT" | "ORGANIZER">("PARTICIPANT")
  const [formError, setFormError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (!email || !password) {
      setFormError("Please fill in all fields")
      return
    }

    if (role === "ORGANIZER") {
      router.push("/dashboard/organizer")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn={false} />

      <main className="flex-grow max-w-md mx-auto w-full px-4 py-12">
        <div className="bg-card rounded-lg border border-border shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground mb-6">Jump straight into the experience you want to explore.</p>

          <div className="mb-6 space-y-3">
            <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">I want to</span>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  id: "PARTICIPANT",
                  title: "Discover and attend events",
                  description: "See the attendee dashboard.",
                },
                {
                  id: "ORGANIZER",
                  title: "Create and manage events",
                  description: "Preview the organizer tools.",
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {formError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
                {formError}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-2">
              Sign In
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center mt-6 text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
