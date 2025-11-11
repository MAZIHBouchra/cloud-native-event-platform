import { randomUUID } from "crypto"

export type UserRole = "PARTICIPANT" | "ORGANIZER"

export interface MockUser {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
}

declare global {
  // eslint-disable-next-line no-var
  var __mockUsers: Map<string, MockUser> | undefined
}

const users: Map<string, MockUser> = globalThis.__mockUsers ?? new Map()
if (!globalThis.__mockUsers) {
  globalThis.__mockUsers = users
}

export function createUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: UserRole,
): MockUser {
  if (users.has(email)) {
    throw new Error("Email already registered")
  }

  const user: MockUser = {
    id: randomUUID(),
    email,
    password,
    firstName,
    lastName,
    role,
  }

  users.set(email, user)
  return user
}

export function findUserByEmail(email: string) {
  return users.get(email) ?? null
}

export function upsertUser(user: MockUser) {
  users.set(user.email, user)
}

export function resetUsers() {
  users.clear()
}

export {}


