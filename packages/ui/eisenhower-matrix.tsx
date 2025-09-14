"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Video, Users, LogIn, Info, Calendar, Link, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AnimatedBackground from "./animated-background"
import OnboardingTour from "./onboarding-tour"
import AppHeader from "./app-header"
import AppFooter from "./app-footer"
import { useToast } from "@/hooks/use-toast"
import { useUIStore } from "@/lib/store/ui-store"
import { useMobile } from "@/hooks/use-mobile"

export default function EisenhowerMatrix() {
  // Get state from stores
  const isDarkMode = useUIStore((state) => state.isDarkMode)
  const setDarkMode = useUIStore((state) => state.setDarkMode)
  const viewMode = useUIStore((state) => state.viewMode)
  const setViewMode = useUIStore((state) => state.setViewMode)
  const searchQuery = useUIStore((state) => state.searchQuery)
  const setSearchQuery = useUIStore((state) => state.setSearchQuery)
  const isOnboardingShown = useUIStore((state) => state.isOnboardingShown)
  const setOnboardingShown = useUIStore((state) => state.setOnboardingShown)

  // Local state
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [meetingCode, setMeetingCode] = useState("")
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false)
  const [isJoinMeetingOpen, setIsJoinMeetingOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const isMobile = useMobile()
  const mainRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Check if it's the first visit and show onboarding
  useEffect(() => {
    if (!isOnboardingShown) {
      setShowOnboarding(true)
      setOnboardingShown(true)
    }
  }, [isOnboardingShown, setOnboardingShown])

  // Toggle dark mode and update document class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  // Scroll to top when changing view mode
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [viewMode])

  const handleNewMeeting = useCallback(() => {
    const meetingId = Math.random().toString(36).substring(2, 8).toUpperCase()
    toast({
      title: "New Meeting Created",
      description: `Meeting ID: ${meetingId}. Share this with participants.`,
      duration: 5000,
    })
    setIsNewMeetingOpen(false)
  }, [toast])

  const handleJoinMeeting = useCallback(() => {
    if (!meetingCode.trim()) {
      toast({
        title: "Meeting Code Required",
        description: "Please enter a meeting code or link to join.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Joining Meeting",
      description: `Connecting to meeting: ${meetingCode}`,
      duration: 3000,
    })
    setIsJoinMeetingOpen(false)
    setMeetingCode("")
  }, [meetingCode, toast])

  const handleLogin = useCallback(() => {
    toast({
      title: "Redirecting to Login",
      description: "Taking you to the login page...",
      duration: 2000,
    })
    setIsLoginOpen(false)
  }, [toast])

  const handleAbout = useCallback(() => {
    toast({
      title: "About COM",
      description: "Learn more about Collaboration Online Meet features and benefits.",
      duration: 3000,
    })
  }, [toast])

  return (
    <div className={`w-full min-h-screen relative ${isDarkMode ? "dark" : ""}`}>
      <AnimatedBackground isDarkMode={isDarkMode} />

      <div className="relative z-10 min-h-screen flex flex-col">
        <AppHeader
          isDarkMode={isDarkMode}
          setIsDarkMode={setDarkMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showOnboarding={() => setShowOnboarding(true)}
          totalTasks={0}
        />

        <main
          id="main-content"
          ref={mainRef}
          className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 flex-1 flex flex-col"
        >
          <div className="mb-3 sm:mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
              <Tabs defaultValue={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
                <TabsList>
                  <TabsTrigger value="grid" className="text-xs sm:text-sm px-2 sm:px-3">
                    Grid View
                  </TabsTrigger>
                  <TabsTrigger value="list" className="text-xs sm:text-sm px-2 sm:px-3">
                    List View
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center justify-between sm:justify-end gap-2">
                <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  Connect, collaborate, and celebrate from anywhere with PSU Rizal: COM
                </div>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 flex-1">
                {/* Video Meetings - Start or host meetings */}
                <Card className="border-2 border-orange-500/30 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                      <CardTitle className="text-lg">Video Meetings</CardTitle>
                    </div>
                    <CardDescription>Start or host meetings instantly</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      <Video className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                      <h3 className="text-lg font-semibold mb-2">Video calls and meetings for everyone</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Connect, collaborate, and celebrate from anywhere with PSU Rizal: COM
                      </p>
                      <Dialog open={isNewMeetingOpen} onOpenChange={setIsNewMeetingOpen}>
                        <DialogTrigger asChild>
                          <Button className="btn-orange-gradient hover:shadow-orange-glow">
                            <Video className="h-4 w-4 mr-2" />
                            New Meeting
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Start New Meeting</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              Create a new meeting room and invite participants to join.
                            </p>
                            <Button onClick={handleNewMeeting} className="w-full btn-orange-gradient">
                              Create Meeting Room
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>

                {/* Join Meeting - Enter code or link */}
                <Card className="border-2 border-blue-500/30 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <CardTitle className="text-lg">Join Meeting</CardTitle>
                    </div>
                    <CardDescription>Enter a code or link to join</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      <Link className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                      <h3 className="text-lg font-semibold mb-2">Enter a code or link</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Join an existing meeting using a meeting code or invitation link
                      </p>
                      <Dialog open={isJoinMeetingOpen} onOpenChange={setIsJoinMeetingOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="border-blue-500/30 hover:bg-blue-500/10 bg-transparent">
                            <Calendar className="h-4 w-4 mr-2" />
                            Join Meeting
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Join Meeting</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="meeting-code">Meeting Code or Link</Label>
                              <Input
                                id="meeting-code"
                                placeholder="Enter meeting code or paste link"
                                value={meetingCode}
                                onChange={(e) => setMeetingCode(e.target.value)}
                              />
                            </div>
                            <Button onClick={handleJoinMeeting} className="w-full">
                              Join Meeting
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Access - Login/Sign-Up */}
                <Card className="border-2 border-green-500/30 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <CardTitle className="text-lg">Account Access</CardTitle>
                    </div>
                    <CardDescription>Login or create your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <h3 className="text-lg font-semibold mb-2">Login/Sign-Up</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Access your account or create a new one to unlock all features
                      </p>
                      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="border-green-500/30 hover:bg-green-500/10 bg-transparent"
                          >
                            <LogIn className="h-4 w-4 mr-2" />
                            Login/Sign-Up
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Account Access</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              Sign in to your existing account or create a new one to get started.
                            </p>
                            <div className="flex gap-2">
                              <Button onClick={handleLogin} className="flex-1">
                                <LogIn className="h-4 w-4 mr-2" />
                                Login
                              </Button>
                              <Button onClick={handleLogin} variant="outline" className="flex-1 bg-transparent">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Sign Up
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>

                {/* About COM - Learn more about the platform */}
                <Card className="border-2 border-gray-500/30 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                      <CardTitle className="text-lg">About COM</CardTitle>
                    </div>
                    <CardDescription>Learn about our platform</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      <Info className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                      <h3 className="text-lg font-semibold mb-2">About COM</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Learn more about Collaboration Online Meet features, benefits, and how it can help your team
                        stay connected.
                      </p>
                      <Button
                        onClick={handleAbout}
                        variant="outline"
                        className="border-gray-500/30 hover:bg-gray-500/10 bg-transparent"
                      >
                        <Info className="h-4 w-4 mr-2" />
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-6">
                {/* List view - same content but in vertical layout */}
                <Card className="border-2 border-orange-500/30 bg-card/80 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                        <div>
                          <CardTitle className="text-lg">Video Meetings - Start or host meetings</CardTitle>
                          <CardDescription>Start or host meetings instantly</CardDescription>
                        </div>
                      </div>
                      <Button
                        className="btn-orange-gradient hover:shadow-orange-glow"
                        onClick={() => setIsNewMeetingOpen(true)}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        New Meeting
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border-2 border-blue-500/30 bg-card/80 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <div>
                          <CardTitle className="text-lg">Join Meeting - Enter a code or link</CardTitle>
                          <CardDescription>Enter a code or link to join</CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="border-blue-500/30 bg-transparent"
                        onClick={() => setIsJoinMeetingOpen(true)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Join Meeting
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border-2 border-green-500/30 bg-card/80 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <div>
                          <CardTitle className="text-lg">Account Access - Login/Sign-Up</CardTitle>
                          <CardDescription>Login or create your account</CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="border-green-500/30 bg-transparent"
                        onClick={() => setIsLoginOpen(true)}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Login/Sign-Up
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border-2 border-gray-500/30 bg-card/80 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                        <div>
                          <CardTitle className="text-lg">About COM - Learn about our platform</CardTitle>
                          <CardDescription>Learn about our platform</CardDescription>
                        </div>
                      </div>
                      <Button variant="outline" className="border-gray-500/30 bg-transparent" onClick={handleAbout}>
                        <Info className="h-4 w-4 mr-2" />
                        Learn More
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            )}
          </div>
        </main>

        <AppFooter />
      </div>

      {showOnboarding && <OnboardingTour onClose={() => setShowOnboarding(false)} />}
    </div>
  )
}
