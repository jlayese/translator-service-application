"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Globe, MapPin, MessageSquare, User } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"

export default function DashboardPage() {
  const [userType, setUserType] = useState<"client" | "translator">("client")
  
  // Mock data - would come from Supabase in a real implementation
  const activeRequests = [
    {
      id: "req-1",
      title: "Business Meeting Translation",
      languages: ["English", "Japanese"],
      date: "2025-05-15T14:00:00",
      status: "active",
      location: "Virtual",
      description: "Need a translator for a 1-hour business meeting with Japanese partners.",
    },
    {
      id: "req-2",
      title: "Legal Document Translation",
      languages: ["English", "Spanish"],
      date: "2025-05-20",
      status: "pending",
      location: "Document Upload",
      description: "10-page legal contract that needs to be translated from English to Spanish.",
    },
  ]

  const availableJobs = [
    {
      id: "job-1",
      title: "Medical Appointment Translation",
      languages: ["English", "Mandarin"],
      date: "2025-05-16T10:00:00",
      duration: "1 hour",
      rate: "$50/hour",
      client: {
        name: "Sarah Johnson",
        rating: 4.8,
      },
      location: "Virtual",
    },
    {
      id: "job-2",
      title: "Technical Manual Translation",
      languages: ["English", "German"],
      date: "2025-05-18",
      duration: "Project-based",
      rate: "$0.12/word",
      client: {
        name: "TechCorp Inc.",
        rating: 4.9,
      },
      location: "Document Upload",
    },
    {
      id: "job-3",
      title: "Conference Interpretation",
      languages: ["English", "French"],
      date: "2025-05-22T09:00:00",
      duration: "6 hours",
      rate: "$65/hour",
      client: {
        name: "Global Events Ltd.",
        rating: 4.7,
      },
      location: "Paris, France",
    },
  ]

  // Toggle between client and translator views for demo purposes
  // In a real app, this would be determined by the user's role in Supabase
  useEffect(() => {
    // Simulating user type retrieval from database
    // In a real app, this would come from Supabase auth
    const timer = setTimeout(() => {
      // For demo purposes, allow toggling between views
      // In production, this would be fixed based on the user's actual role
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          {/* Demo toggle - would not exist in production */}
          <div className="flex items-center space-x-2 bg-muted p-2 rounded-md">
            <span className="text-sm font-medium">View as:</span>
            <Button 
              variant={userType === "client" ? "default" : "outline"} 
              size="sm"
              onClick={() => setUserType("client")}
            >
              Client
            </Button>
            <Button 
              variant={userType === "translator" ? "default" : "outline"} 
              size="sm"
              onClick={() => setUserType("translator")}
            >
              Translator
            </Button>
          </div>
          
          {userType === "client" ? (
            <Link href="/request">
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </Link>
          ) : (
            <Link href="/profile">
              <Button>
                <User className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
            </Link>
          )}
        </div>
      </div>

      {userType === "client" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Translations</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Languages Used</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saved Translators</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">Active Requests</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="saved">Saved Translators</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-4">
              {activeRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{request.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {request.languages.join(" → ")}
                        </CardDescription>
                      </div>
                      <Badge variant={request.status === "active" ? "default" : "outline"}>
                        {request.status === "active" ? "Active" : "Pending"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(request.date).toLocaleDateString()}</span>
                        {request.date.includes("T") && (
                          <>
                            <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                            <span>{new Date(request.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{request.location}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{request.description}</p>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4 pt-0 flex justify-end gap-2">
                    <Button variant="outline" size="sm">Cancel</Button>
                    <Button size="sm">View Details</Button>
                  </div>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="completed" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>No completed requests yet</CardTitle>
                  <CardDescription>
                    Your completed translation requests will appear here.
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
            <TabsContent value="saved" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>No saved translators yet</CardTitle>
                  <CardDescription>
                    Translators you save will appear here for quick access.
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Jobs</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rating</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.9</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="available" className="space-y-4">
            <TabsList>
              <TabsTrigger value="available">Available Jobs</TabsTrigger>
              <TabsTrigger value="active">Active Jobs</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="available" className="space-y-4">
              {availableJobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {job.languages.join(" → ")}
                        </CardDescription>
                      </div>
                      <Badge>{job.rate}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(job.date).toLocaleDateString()}</span>
                        {job.date.includes("T") && (
                          <>
                            <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                            <span>{new Date(job.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{job.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{job.client.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{job.client.name}</span>
                        <span className="text-muted-foreground ml-1">({job.client.rating}★)</span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4 pt-0 flex justify-end gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button size="sm">Apply</Button>
                  </div>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="active" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Conference Interpretation</CardTitle>
                      <CardDescription className="mt-1">
                        English → French
                      </CardDescription>
                    </div>
                    <Badge>$65/hour</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>May 10, 2025</span>
                      <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                      <span>9:00 AM - 3:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Virtual</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>GE</AvatarFallback>
                      </Avatar>
                      <span>Global Events Ltd.</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      International technology conference requiring simultaneous interpretation.
                    </p>
                  </div>
                </CardContent>
                <div className="px-6 pb-4 pt-0 flex justify-end gap-2">
                  <Button variant="outline" size="sm">Message Client</Button>
                  <Button size="sm">View Details</Button>
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="completed" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Completed jobs will appear here</CardTitle>
                  <CardDescription>
                    View your history of completed translation jobs.
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </DashboardLayout>
  )
}