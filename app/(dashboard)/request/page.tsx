"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/dashboard-layout"

export default function RequestPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [requestType, setRequestType] = useState("live")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement Supabase request creation
      toast({
        title: "Request submitted",
        description: "Your translation request has been submitted successfully.",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Request failed",
        description: "There was an error submitting your request. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">New Translation Request</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
            <CardDescription>
              Fill out the form below to request a translator for your needs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Request Title</Label>
              <Input id="title" placeholder="e.g., Business Meeting Translation" required />
            </div>

            <div className="space-y-2">
              <Label>Request Type</Label>
              <RadioGroup defaultValue="live" value={requestType} onValueChange={setRequestType}>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-start space-x-3 rounded-md border p-3">
                    <RadioGroupItem value="live" id="live" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="live" className="font-medium">Live Translation</Label>
                      <p className="text-sm text-muted-foreground">
                        Real-time translation for meetings, appointments, or conversations.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 rounded-md border p-3">
                    <RadioGroupItem value="document" id="document" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="document" className="font-medium">Document Translation</Label>
                      <p className="text-sm text-muted-foreground">
                        Translation of written documents, files, or text.
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source-language">Source Language</Label>
                <Select required>
                  <SelectTrigger id="source-language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Mandarin</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="ko">Korean</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="ru">Russian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-language">Target Language</Label>
                <Select required>
                  <SelectTrigger id="target-language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Mandarin</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="ko">Korean</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="ru">Russian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {requestType === "live" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <div className="flex items-center">
                    <Input
                      id="time"
                      type="time"
                      className="flex-1"
                      required={requestType === "live"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0.5"
                    step="0.5"
                    placeholder="1.5"
                    required={requestType === "live"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select required={requestType === "live"}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual (Zoom, Teams, etc.)</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {requestType === "document" && (
              <div className="space-y-2">
                <Label htmlFor="document-upload">Upload Document (optional)</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Drag and drop your file here, or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supports PDF, DOCX, TXT (Max 10MB)</p>
                  <Input id="document-upload" type="file" className="hidden" />
                  <Button type="button" variant="outline" size="sm" className="mt-4">
                    Browse Files
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Additional Details</Label>
              <Textarea
                id="description"
                placeholder="Describe your translation needs, specific requirements, or any other relevant information."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD)</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter your budget (optional)"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Request"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardLayout>
  )
}