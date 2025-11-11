// Navigation bar component with authentication state and responsive menu
"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  isLoggedIn?: boolean
  userName?: string
}

export function Navbar({ isLoggedIn = false, userName = "User" }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">AD</span>
          </div>
          <span className="font-bold text-xl text-primary hidden sm:inline">Adray ⴰⴷⵔⴰⵢ</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition">
            Home
          </Link>
          <Link href="/events" className="text-foreground hover:text-primary transition">
            Browse Events
          </Link>
          {isLoggedIn && (
            <Link href="/dashboard" className="text-foreground hover:text-primary transition">
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground">Welcome, {userName}</span>
              <Button variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-3">
          <Link href="/" className="py-2 text-foreground hover:text-primary">
            Home
          </Link>
          <Link href="/events" className="py-2 text-foreground hover:text-primary">
            Browse Events
          </Link>
          {isLoggedIn && (
            <Link href="/dashboard" className="py-2 text-foreground hover:text-primary">
              Dashboard
            </Link>
          )}
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            {isLoggedIn ? (
              <Button className="w-full bg-destructive">Logout</Button>
            ) : (
              <>
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full bg-transparent">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" className="w-full">
                  <Button className="w-full bg-primary">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
