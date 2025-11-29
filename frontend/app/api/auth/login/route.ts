import { type NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

// On définit la structure des données attendues
interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    // 1. Validation simple
    if (!body.email || !body.password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    console.log("Tentative de connexion pour :", body.email);

    // 2. C'EST ICI LA CLÉ : On appelle le Backend Java (Spring Boot)
    // Au lieu de regarder dans le mock-db local
    const backendUrl = `${API_BASE_URL}/api/auth/signin`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // 3. On récupère la réponse de Java
    let data;
    try {
        data = await response.json();
    } catch (e) {
        console.error("Erreur lecture JSON:", e);
        data = { message: "Erreur technique du backend" };
    }

    // 4. Si Java dit NON (401 ou 400), on renvoie l'erreur au site
    if (!response.ok) {
      console.error("Erreur renvoyée par Java:", data);
      return NextResponse.json(
        { error: data.message || "Email ou mot de passe incorrect (AWS)" },
        { status: response.status }
      );
    }

    // 5. Si Java dit OUI, on renvoie le token au site
    console.log("Connexion réussie via Java/Cognito !");
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Erreur serveur Next.js:", error);
    return NextResponse.json(
      { error: "Impossible de contacter le serveur backend" },
      { status: 500 }
    );
  }
}