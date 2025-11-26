// frontend/lib/hooks/use-auth.ts
"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"

// Définition de la structure d'un objet Utilisateur
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "PARTICIPANT" | "ORGANIZER";
}

export function useAuth() {
  const router = useRouter();
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

      const data = await response.json()
      
      // --- DEBUG : AFFICHER LE RÔLE DANS LA CONSOLE ---
      console.log("📢 Login réussi ! Données reçues du Backend :", data);
      console.log("📢 Rôle détecté :", data.role);
      // ------------------------------------------------

      const loggedUser: User = {
        id: data.accessToken,
        email: email,
        firstName: "", 
        lastName: "",
        role: data.role as "PARTICIPANT" | "ORGANIZER"
      };

      // Mise à jour de l'état
      setUser(loggedUser)
      
      // Stockage du token
      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", data.accessToken)
        localStorage.setItem("userRole", data.role)
      }

      // --- CORRECTION DE LA REDIRECTION ---
      if (loggedUser.role === "ORGANIZER") {
          console.log("👉 Redirection vers le tableau de bord Organisateur");
          router.push("/dashboard/organizer"); // LA BONNE ROUTE
      } else {
          console.log("👉 Redirection vers le tableau de bord Participant");
          router.push("/dashboard"); // OU "/events" selon votre structure
      }

      return loggedUser

    } catch (err: any) {
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
        
        router.push("/login?success=true");

      } catch (err: any) {
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