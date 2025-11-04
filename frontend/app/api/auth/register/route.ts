/**
 * User Registration Endpoint (POST /api/auth/register)
 *
 * Handles user account creation with validation:
 * - Email format validation
 * - Password strength requirements (minimum 8 characters)
 * - Password confirmation matching
 * - Role assignment (PARTICIPANT or ORGANIZER)
 *
 * Production Implementation:
 * - Replace mock validation with database queries using @neondatabase/serverless
 * - Hash passwords using bcrypt before storage
 * - Check for duplicate email addresses
 * - Send verification email to user
 */

import { type NextRequest, NextResponse } from "next/server"

interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  role: "PARTICIPANT" | "ORGANIZER"
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()

    if (!body.firstName || !body.lastName || !body.email || !body.password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (body.password !== body.confirmPassword) {
      return NextResponse.json({ error: "Passwords must match" }, { status: 400 })
    }

    if (body.password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (!body.role || !["PARTICIPANT", "ORGANIZER"].includes(body.role)) {
      return NextResponse.json({ error: "Invalid role selected" }, { status: 400 })
    }

    // Production: Check if email already exists
    // const existingUser = await db.query('SELECT id FROM users WHERE email = ?', [body.email])
    // if (existingUser) return NextResponse.json({ error: 'Email already exists' }, { status: 400 })

    // Production: Hash password with bcrypt
    // const hashedPassword = await bcrypt.hash(body.password, 10)

    // Production: Insert user into database
    // const result = await db.query(
    //   'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
    //   [body.email, hashedPassword, body.firstName, body.lastName, body.role]
    // )

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          role: body.role,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
