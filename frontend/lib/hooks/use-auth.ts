// frontend/lib/hooks/use-auth.ts
"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation" // Important pour la redirection

// Définition de la structure d'un objet Utilisateur
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "PARTICIPANT" | "ORGANIZER";
}

export function useAuth() {
  const router = useRouter(); // Pour rediriger après login
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      // Appel au backend Java
      const response = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Échec de la connexion")
      }

      // CORRECTION ICI : Correspondance avec AuthController.java
      const data = await response.json() 
      // Le backend renvoie : { accessToken: "...", idToken: "...", role: "...", ... }

      // On reconstruit l'objet User pour le Frontend
      // Note: Le backend login ne renvoie pas encore le nom/prénom, on met des placeholders ou l'email pour l'instant
      const loggedUser: User = {
        id: data.accessToken, // On utilise le token comme ID temporaire
        email: email,
        firstName: "", // Sera vide pour l'instant (nécessiterait un autre appel API ou décodage ID Token)
        lastName: "",
        role: data.role as "PARTICIPANT" | "ORGANIZER"
      };

      // Mise à jour de l'état
      setUser(loggedUser)
      
      // Stockage du token pour les futures requêtes
      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", data.accessToken)
        localStorage.setItem("userRole", data.role)
      }

      // Redirection automatique selon le rôle (Facultatif mais recommandé)
      if (loggedUser.role === "ORGANIZER") {
          router.push("/dashboard"); // ou la route pour les organisateurs
      } else {
          router.push("/events"); // ou la route pour les participants
      }

      return loggedUser

    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [router])

  const register = useCallback(
    async (data: {
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      role: 'PARTICIPANT' | 'ORGANIZER'
    }) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("http://localhost:8080/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data), 
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(errorText || "Registration failed")
        }
        
        const successMessage = await response.text();
        console.log("Backend response:", successMessage);
        
        // Redirection vers login après inscription réussie
        router.push("/login?success=true");

      } catch (err) {
        const message = err instanceof Error ? err.message : "Registration failed"
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [router],
  )

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
    }
    router.push("/login");
  }, [router])

  return { user, loading, error, login, register, logout }
}