// frontend/lib/hooks/use-auth.ts
"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/lib/config"

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

  // --- NOUVEAU : Restauration de la session au chargement (F5) ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("userRole") as "PARTICIPANT" | "ORGANIZER";
      const email = localStorage.getItem("userEmail");

      // Si on a les infos, on reconnecte l'utilisateur silencieusement
      if (token && role) {
        setUser({
          id: token,
          email: email || "User",
          firstName: "",
          lastName: "",
          role: role
        });
      }
    }
  }, []);
  // -------------------------------------------------------------

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      // Appel au backend Java
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Échec de la connexion")
      }

      const data = await response.json()
      
      console.log("📢 Login réussi ! Rôle détecté :", data.role);

      const loggedUser: User = {
        id: data.accessToken,
        email: email,
        firstName: "", 
        lastName: "",
        role: data.role as "PARTICIPANT" | "ORGANIZER"
      };

      // Mise à jour de l'état
      setUser(loggedUser)
      
      // Stockage du token ET de l'email (pour la persistance)
      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", data.accessToken)
        localStorage.setItem("userRole", data.role)
        localStorage.setItem("userEmail", email) // <-- Ajouté pour garder le nom
      }

      // Redirection (Votre logique exacte conservée)
      if (loggedUser.role === "ORGANIZER") {
          console.log("👉 Redirection vers le tableau de bord Organisateur");
          router.push("/dashboard/organizer");
      } else {
          console.log("👉 Redirection vers le tableau de bord Participant");
          router.push("/dashboard"); 
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
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
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
        localStorage.removeItem("userEmail"); // <-- On nettoie aussi l'email
    }
    router.push("/login");
  }, [router])

  return { user, loading, error, login, register, logout }
}