"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X } from "lucide-react"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<"client" | "translator">("translator")
  const router = useRouter()
  const { toast } = useToast()

  // Mock data - would come from Supabase in a real implementation
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    bio: "Professional translator with 5+ years of experience in technical and legal translations.",
    hourlyRate: 45,
    isAvailable: true,
    languages: [
      { id: "1", language: "English", proficiency: "native" },
      { id: "2", language: "Spanish", proficiency: "fluent" },
      { id: "3", language: "French", proficiency: "conversational" }
    ]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement Supabase profile update
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addLanguage = () => {
    setProfile(prev => ({
      ...prev,
      languages: [
        ...prev.languages,
        { id: Date.now().toString(), language: "", proficiency: "conversational" }
      ]
    }))
  }

  const removeLanguage = (id: string) => {
    setProfile(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }))
  }

  const updateLanguage = (id: string, field: 'language' | 'proficiency', value: string) => {
    setProfile(prev => ({
      ...prev,
      languages: prev.languages.map(lang => 
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    }))
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
              <CardTitle>{profile.fullName}</CardTitle>
              <CardDescription className="mt-1">{profile.email}</CardDescription>
              <Badge className="mt-2" variant={userType === "translator" ? "default" : "outline"}>
                {userType === "translator" ? "Translator" : "Client"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userType === "translator" && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Hourly Rate:</span>
                    <span>${profile.hourlyRate}/hr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Available for work:</span>
                    <Badge variant={profile.isAvailable ? "default" : "outline"}>
                      {profile.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                  <div className="pt-2">
                    <span className="text-sm font-medium">Languages:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.languages.map(lang => (
                        <Badge key={lang.id} variant="secondary">
                          {lang.language} ({lang.proficiency})
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your personal information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  value={profile.fullName}
                  onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  required 
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Contact support to change your email address.
                </p>
              </div>

              {userType === "translator" && (
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="languages">Languages</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={profile.bio}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        className="min-h-[120px]" 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                      <Input 
                        id="hourlyRate" 
                        type="number" 
                        min="0"
                        value={profile.hourlyRate}
                        onChange={(e) => setProfile(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="isAvailable" 
                        checked={profile.isAvailable}
                        onCheckedChange={(checked) => setProfile(prev => ({ ...prev, isAvailable: checked }))}
                      />
                      <Label htmlFor="isAvailable">Available for new translation jobs</Label>
                    </div>
                  </TabsContent>
                  <TabsContent value="languages" className="space-y-4 pt-4">
                    {profile.languages.map((lang, index) => (
                      <div key={lang.id} className="flex items-center gap-2">
                        <div className="grid grid-cols-2 gap-2 flex-1">
                          <div>
                            <Select 
                              value={lang.language} 
                              onValueChange={(value) => updateLanguage(lang.id, 'language', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Spanish">Spanish</SelectItem>
                                <SelectItem value="French">French</SelectItem>
                                <SelectItem value="German">German</SelectItem>
                                <SelectItem value="Mandarin">Mandarin</SelectItem>
                                <SelectItem value="Japanese">Japanese</SelectItem>
                                <SelectItem value="Korean">Korean</SelectItem>
                                <SelectItem value="Arabic">Arabic</SelectItem>
                                <SelectItem value="Russian">Russian</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Select 
                              value={lang.proficiency} 
                              onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Proficiency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="conversational">Conversational</SelectItem>
                                <SelectItem value="fluent">Fluent</SelectItem>
                                <SelectItem value="native">Native</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeLanguage(lang.id)}
                          disabled={profile.languages.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={addLanguage}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Language
                    </Button>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}