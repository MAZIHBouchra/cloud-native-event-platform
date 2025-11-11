/**
 * User Login Endpoint (POST /api/auth/login)
 *
 * Authenticates user credentials and returns JWT token for session management
 *
 * Production Implementation:
 * - Query database to find user by email
 * - Verify password using bcrypt.compare
 * - Generate JWT token with user ID and role
 * - Set secure HTTP-only cookie for token
 */

import { type NextRequest, NextResponse } from "next/server"
import { findUserByEmail } from "@/lib/mock-db"

interface LoginRequest {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()

    if (!body.email || !body.password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const existingUser = findUserByEmail(body.email)
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (existingUser.password !== body.password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: existingUser.id,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          role: existingUser.role,
        },
        token: "jwt_token_here", // Production: sign JWT with secret key
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
