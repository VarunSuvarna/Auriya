"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, User, Bell, Shield, Check } from "lucide-react"

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const [profile, setProfile] = useState({
    displayName: "Music Lover",
    username: "musiclover123",
    email: "user@example.com",
    bio: "Passionate about discovering new music and supporting artists through NFTs",
    country: "United States",
    profileImage: null as string | null
  })

  const [notifications, setNotifications] = useState({
    newReleases: true,
    priceAlerts: true,
    socialActivity: false,
    marketing: false
  })

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showListening: true,
    showPurchases: false
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile({...profile, profileImage: e.target?.result as string})
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCancel = () => {
    // Reset to original values
    setProfile({
      displayName: "Music Lover",
      username: "musiclover123",
      email: "user@example.com",
      bio: "Passionate about discovering new music and supporting artists through NFTs",
      country: "United States",
      profileImage: null
    })
    setNotifications({
      newReleases: true,
      priceAlerts: true,
      socialActivity: false,
      marketing: false
    })
    setPrivacy({
      publicProfile: true,
      showListening: true,
      showPurchases: false
    })
  }

  return (
    <div className="container mx-auto px-6 py-8 pb-16 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-space-grotesk text-white mb-2">Profile Settings</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-8">
        {/* Profile Information */}
        <Card className="border-[#15b9b7]/20 bg-gradient-to-br from-[#15b9b7]/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5 text-[#15b9b7]" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#15b9b7] to-[#17cac6] flex items-center justify-center overflow-hidden">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-white" />
                  )}
                </div>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-[#15b9b7] hover:bg-[#15b9b7]/90 p-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Profile Photo</h3>
                <p className="text-sm text-gray-400 mb-3">Upload a photo to personalize your profile</p>
                <Button 
                  variant="outline" 
                  className="border-[#15b9b7]/30 text-[#15b9b7] hover:bg-[#15b9b7]/10"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Photo
                </Button>
              </div>
            </div>

            <Separator className="bg-[#15b9b7]/20" />

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-white">Display Name</Label>
                <Input
                  id="displayName"
                  value={profile.displayName}
                  onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                  className="bg-[#002a4a]/50 border-[#15b9b7]/30 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => setProfile({...profile, username: e.target.value})}
                  className="bg-[#002a4a]/50 border-[#15b9b7]/30 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="bg-[#002a4a]/50 border-[#15b9b7]/30 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                className="bg-[#002a4a]/50 border-[#15b9b7]/30 text-white min-h-[100px]"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-white">Country</Label>
              <Select value={profile.country} onValueChange={(value) => setProfile({...profile, country: value})}>
                <SelectTrigger className="bg-[#002a4a]/50 border-[#15b9b7]/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#002a4a] border-[#15b9b7]/30">
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Japan">Japan</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-[#15b9b7]/20 bg-gradient-to-br from-[#15b9b7]/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="h-5 w-5 text-[#15b9b7]" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">New Releases</h4>
                <p className="text-sm text-gray-400">Get notified when artists you follow release new music</p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, newReleases: !notifications.newReleases})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#15b9b7] focus:ring-offset-2 ${
                  notifications.newReleases ? 'bg-[#15b9b7]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.newReleases ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <Separator className="bg-[#15b9b7]/20" />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Price Alerts</h4>
                <p className="text-sm text-gray-400">Notifications about token price changes</p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, priceAlerts: !notifications.priceAlerts})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#15b9b7] focus:ring-offset-2 ${
                  notifications.priceAlerts ? 'bg-[#15b9b7]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.priceAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <Separator className="bg-[#15b9b7]/20" />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Social Activity</h4>
                <p className="text-sm text-gray-400">When someone likes or comments on your activity</p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, socialActivity: !notifications.socialActivity})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#15b9b7] focus:ring-offset-2 ${
                  notifications.socialActivity ? 'bg-[#15b9b7]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.socialActivity ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <Separator className="bg-[#15b9b7]/20" />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Marketing</h4>
                <p className="text-sm text-gray-400">Updates about new features and promotions</p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, marketing: !notifications.marketing})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#15b9b7] focus:ring-offset-2 ${
                  notifications.marketing ? 'bg-[#15b9b7]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.marketing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="border-[#15b9b7]/20 bg-gradient-to-br from-[#15b9b7]/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-[#15b9b7]" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Public Profile</h4>
                <p className="text-sm text-gray-400">Make your profile visible to other users</p>
              </div>
              <button
                onClick={() => setPrivacy({...privacy, publicProfile: !privacy.publicProfile})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#15b9b7] focus:ring-offset-2 ${
                  privacy.publicProfile ? 'bg-[#15b9b7]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.publicProfile ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <Separator className="bg-[#15b9b7]/20" />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Show Listening Activity</h4>
                <p className="text-sm text-gray-400">Let others see what you're currently playing</p>
              </div>
              <button
                onClick={() => setPrivacy({...privacy, showListening: !privacy.showListening})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#15b9b7] focus:ring-offset-2 ${
                  privacy.showListening ? 'bg-[#15b9b7]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.showListening ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <Separator className="bg-[#15b9b7]/20" />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Show Purchase History</h4>
                <p className="text-sm text-gray-400">Display your NFT and token purchases publicly</p>
              </div>
              <button
                onClick={() => setPrivacy({...privacy, showPurchases: !privacy.showPurchases})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#15b9b7] focus:ring-offset-2 ${
                  privacy.showPurchases ? 'bg-[#15b9b7]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.showPurchases ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>



        {/* Save Changes */}
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            className="border-[#15b9b7]/30 text-[#15b9b7] hover:bg-[#15b9b7]/10"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            className="bg-[#15b9b7] hover:bg-[#15b9b7]/90 text-white min-w-[120px]"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </div>
            ) : saved ? (
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Saved!
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}