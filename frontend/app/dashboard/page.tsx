// Participant dashboard page
"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit2, LogOut, Trash2 } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const userProfile = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  }

  const myRegistrations = [
    {
      id: "1",
      title: "Web Development Masterclass",
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      city: "New York",
      registrationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "Design Systems Workshop",
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      city: "San Francisco",
      registrationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn={true} userName={userProfile.firstName} />

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your profile and event registrations</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="registrations">My Registrations</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-8">
            <div className="bg-card border border-border rounded-lg p-8 max-w-2xl">
              <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

              <div className="space-y-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    value={userProfile.firstName}
                    readOnly
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    value={userProfile.lastName}
                    readOnly
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={userProfile.email}
                    readOnly
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Registrations Tab */}
          <TabsContent value="registrations" className="mt-8">
            <div className="space-y-4">
              {myRegistrations.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <p className="text-muted-foreground mb-4">You haven't registered for any events yet</p>
                  <Link href="/events">
                    <Button>Browse Events</Button>
                  </Link>
                </div>
              ) : (
                myRegistrations.map((reg) => (
                  <div key={reg.id} className="bg-card border border-border rounded-lg p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{reg.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {new Date(reg.date).toLocaleDateString()} • {reg.city}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Registered on {new Date(reg.registrationDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/event/${reg.id}`}>
                          <Button variant="outline">View Event</Button>
                        </Link>
                        <Button variant="destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Unregister
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
