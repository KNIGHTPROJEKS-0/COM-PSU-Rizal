"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  HardDriveIcon as GoogleDrive,
  DropletIcon as Dropbox,
  Cloud,
  CloudIcon as FileCloud,
  Check,
} from "lucide-react"
import { connectGoogleDrive, connectDropbox, connectOneDrive } from "@/lib/cloud-actions"

export function CloudIntegration() {
  const [activeTab, setActiveTab] = useState("google-drive")
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState({
    "google-drive": false,
    dropbox: false,
    onedrive: false,
  })

  const handleConnect = async (provider: string) => {
    setConnecting(true)
    try {
      let result

      switch (provider) {
        case "google-drive":
          result = await connectGoogleDrive()
          break
        case "dropbox":
          result = await connectDropbox()
          break
        case "onedrive":
          result = await connectOneDrive()
          break
      }

      if (result?.success) {
        setConnected((prev) => ({ ...prev, [provider]: true }))
      }
    } catch (error) {
      console.error(`Error connecting to ${provider}:`, error)
    } finally {
      setConnecting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Cloud className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2" />
          Cloud Storage Integration
        </CardTitle>
        <CardDescription>Connect your cloud storage accounts to import documents automatically</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="google-drive">Google Drive</TabsTrigger>
            <TabsTrigger value="dropbox">Dropbox</TabsTrigger>
            <TabsTrigger value="onedrive">OneDrive</TabsTrigger>
          </TabsList>

          <TabsContent value="google-drive" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                <GoogleDrive className="h-6 w-6 text-red-600 dark:text-red-500" />
              </div>
              <div>
                <h3 className="font-medium">Google Drive</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Connect to access your Google Drive documents
                </p>
              </div>
            </div>

            <Button
              onClick={() => handleConnect("google-drive")}
              disabled={connecting || connected["google-drive"]}
              className="w-full"
            >
              {connected["google-drive"] ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Connected
                </>
              ) : connecting ? (
                "Connecting..."
              ) : (
                "Connect Google Drive"
              )}
            </Button>
          </TabsContent>

          <TabsContent value="dropbox" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                <Dropbox className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium">Dropbox</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Connect to access your Dropbox documents</p>
              </div>
            </div>

            <Button
              onClick={() => handleConnect("dropbox")}
              disabled={connecting || connected["dropbox"]}
              className="w-full"
            >
              {connected["dropbox"] ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Connected
                </>
              ) : connecting ? (
                "Connecting..."
              ) : (
                "Connect Dropbox"
              )}
            </Button>
          </TabsContent>

          <TabsContent value="onedrive" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                <FileCloud className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium">OneDrive</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Connect to access your OneDrive documents</p>
              </div>
            </div>

            <Button
              onClick={() => handleConnect("onedrive")}
              disabled={connecting || connected["onedrive"]}
              className="w-full"
            >
              {connected["onedrive"] ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Connected
                </>
              ) : connecting ? (
                "Connecting..."
              ) : (
                "Connect OneDrive"
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
