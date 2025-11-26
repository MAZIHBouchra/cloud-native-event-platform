"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

// On n'utilise plus le hook useAuth pour le login direct, 
// car il contient probablement l'ancienne logique mockée.
// import { useAuth } from "@/lib/hooks/use-auth"

export default function LoginPage() {
  const router = useRouter()
  
  // États locaux pour gérer le formulaire
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    setIsLoading(true)

    if (!email || !password) {
      setFormError("Veuillez remplir tous les champs")
      setIsLoading(false)
      return
    }

    try {
      // 1. APPEL DIRECT À VOTRE ROUTE API (Celle qu'on a réparée)
      console.log("Envoi de la requête de login...");
      
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Échec de la connexion")
      }

      // 2. SUCCÈS !
      console.log("Login réussi, token reçu :", data.token)
      
      // Ici, idéalement, on stockerait le token (localStorage ou Context)
      // Pour l'instant, on redirige juste pour prouver que ça marche.
      localStorage.setItem("token", data.token); // Stockage temporaire

      // Redirection selon le rôle (si renvoyé par le backend)
      if (data.role === "ORGANIZER") {
        router.push("/dashboard/organizer")
      } else {
        router.push("/dashboard")
      }

    } catch (err: any) {
      console.error("Erreur Login:", err)
      setFormError(err.message || "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn={false} />

      <main className="flex-grow max-w-md mx-auto w-full px-4 py-12">
        <div className="bg-card rounded-lg border border-border shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-2">Connexion</h1>
          <p className="text-muted-foreground mb-6">Connectez-vous à votre compte EventHub.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Message d'erreur */}
            {formError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
                {formError}
              </div>
            )}

            {/* Email */}
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

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Bouton Submit */}
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 py-2">
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          <p className="text-center mt-6 text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}