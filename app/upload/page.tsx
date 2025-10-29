"use client"

import { useState } from "react"
import { Upload, Music, ImageIcon, Check, Loader2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const steps = ["Upload", "Metadata", "Mint Options", "Confirm"]

export default function UploadPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverArt, setCoverArt] = useState<File | null>(null)
  const [mintNFT, setMintNFT] = useState(true)
  const [mintToken, setMintToken] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [audioCID, setAudioCID] = useState<string>("")
  const [showAudioCID, setShowAudioCID] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    ticker: "",
    description: "",
    credits: "",
    price: "",
    supply: "",
    royalties: "10",
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    setIsUploading(true)
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false)
      alert("Song uploaded and minted successfully!")
    }, 3000)
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-space-grotesk mb-2">Upload Your Music</h1>
        <p className="text-muted-foreground">Create NFTs and tokens for your songs on Algorand</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    index <= currentStep
                      ? "border-accent bg-accent text-primary"
                      : "border-border bg-background text-muted-foreground",
                  )}
                >
                  {index < currentStep ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
                </div>
                <span
                  className={cn(
                    "mt-2 text-sm font-medium",
                    index <= currentStep ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn("h-0.5 flex-1 transition-all", index < currentStep ? "bg-accent" : "bg-border")} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardContent className="p-8">
          {/* Step 1: Upload */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-4 block">Upload Audio File</Label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer",
                    audioFile ? "border-accent bg-accent/5" : "border-border hover:border-accent/50",
                  )}
                  onClick={() => document.getElementById("audio-upload")?.click()}
                >
                  {audioFile ? (
                    <div className="space-y-2">
                      <Music className="h-12 w-12 mx-auto text-accent" />
                      <p className="font-medium">{audioFile.name}</p>
                      <p className="text-sm text-muted-foreground">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="font-medium">Click to upload audio file</p>
                      <p className="text-sm text-muted-foreground">MP3, WAV, or OGG (max 30MB)</p>
                    </div>
                  )}
                  <input
                    id="audio-upload"
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      setAudioFile(file)
                      // Simulate CID generation when file is uploaded
                      if (file) {
                        // In a real app, this would be the actual IPFS CID
                        setAudioCID(`Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`)
                      } else {
                        setAudioCID("")
                      }
                    }}
                  />
                </div>

                {/* CID Display */}
                {audioCID && (
                  <div className="mt-4 p-4 rounded-lg border border-accent/30 bg-accent/5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-accent mb-1">Audio File CID</Label>
                        <div className="font-mono text-sm bg-secondary/50 p-2 rounded border">
                          {showAudioCID ? audioCID : "•".repeat(audioCID.length)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAudioCID(!showAudioCID)}
                        className="ml-2 h-8 w-8 p-0"
                      >
                        {showAudioCID ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">Upload Cover Art</Label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer",
                    coverArt ? "border-accent bg-accent/5" : "border-border hover:border-accent/50",
                  )}
                  onClick={() => document.getElementById("cover-upload")?.click()}
                >
                  {coverArt ? (
                    <div className="space-y-2">
                      <ImageIcon className="h-12 w-12 mx-auto text-accent" />
                      <p className="font-medium">{coverArt.name}</p>
                      <p className="text-sm text-muted-foreground">{(coverArt.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="font-medium">Click to upload cover art</p>
                      <p className="text-sm text-muted-foreground">JPG, PNG (min 1000x1000px)</p>
                    </div>
                  )}
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setCoverArt(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Metadata */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Song Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter song title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-secondary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artist">Artist Name *</Label>
                  <Input
                    id="artist"
                    placeholder="Enter artist name"
                    value={formData.artist}
                    onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                    className="bg-secondary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your song..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-secondary/20 min-h-24"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credits">Credits (Optional)</Label>
                <Textarea
                  id="credits"
                  placeholder="Producer, mixer, featured artists..."
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                  className="bg-secondary/20"
                />
              </div>
            </div>
          )}

          {/* Step 3: Mint Options */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 rounded-lg border border-border/50 bg-secondary/20">
                  <Checkbox
                    id="mint-nft"
                    checked={mintNFT}
                    onCheckedChange={(checked) => setMintNFT(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="mint-nft" className="text-base font-semibold cursor-pointer">
                      Mint NFT (Single Copy)
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create a unique NFT representing ownership of this song
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg border border-border/50 bg-secondary/20">
                  <Checkbox
                    id="mint-token"
                    checked={mintToken}
                    onCheckedChange={(checked) => setMintToken(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="mint-token" className="text-base font-semibold cursor-pointer">
                      Mint Fungible Tokens
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create tradeable tokens that fans can buy, stake, and trade
                    </p>
                  </div>
                </div>
              </div>

              {mintToken && (
                <div className="space-y-6 p-6 rounded-lg border border-accent/30 bg-accent/5">
                  <h3 className="font-semibold">Token Configuration</h3>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="ticker">Token Ticker *</Label>
                      <Input
                        id="ticker"
                        placeholder="e.g., SONG"
                        value={formData.ticker}
                        onChange={(e) => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
                        className="bg-secondary/20"
                        maxLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supply">Total Supply *</Label>
                      <Input
                        id="supply"
                        type="number"
                        placeholder="1000000"
                        value={formData.supply}
                        onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
                        className="bg-secondary/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price">Initial Price (ALGO) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="bg-secondary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="royalties">Royalties (%) *</Label>
                      <Input
                        id="royalties"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="10"
                        value={formData.royalties}
                        onChange={(e) => setFormData({ ...formData, royalties: e.target.value })}
                        className="bg-secondary/20"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirm */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="rounded-lg border border-border/50 bg-secondary/20 p-6 space-y-4">
                <h3 className="text-lg font-semibold">Review Your Submission</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Song Title</p>
                    <p className="font-medium">{formData.title || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Artist</p>
                    <p className="font-medium">{formData.artist || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Audio File</p>
                    <p className="font-medium">{audioFile?.name || "Not uploaded"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cover Art</p>
                    <p className="font-medium">{coverArt?.name || "Not uploaded"}</p>
                  </div>
                </div>

                {mintToken && (
                  <div className="pt-4 border-t border-border/50">
                    <h4 className="font-semibold mb-3">Token Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Ticker</p>
                        <p className="font-medium">{formData.ticker || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Supply</p>
                        <p className="font-medium">{formData.supply || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Initial Price</p>
                        <p className="font-medium">{formData.price || "0"} ALGO</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Royalties</p>
                        <p className="font-medium">{formData.royalties}%</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-accent/30 bg-accent/5 p-6">
                <h4 className="font-semibold mb-2">Transaction Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IPFS Upload Fee</span>
                    <span>0.1 ALGO</span>
                  </div>
                  {mintNFT && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">NFT Minting Fee</span>
                      <span>0.2 ALGO</span>
                    </div>
                  )}
                  {mintToken && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token Creation Fee</span>
                      <span>0.3 ALGO</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-border/50 font-semibold">
                    <span>Total</span>
                    <span className="text-accent">
                      {(0.1 + (mintNFT ? 0.2 : 0) + (mintToken ? 0.3 : 0)).toFixed(1)} ALGO
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 0 || isUploading}>
              Back
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-[#17cac6] to-[#0ea39f] hover:from-[#15b8b4] hover:to-[#0c8f8b]"
                disabled={
                  (currentStep === 0 && (!audioFile || !coverArt)) ||
                  (currentStep === 1 && (!formData.title || !formData.artist))
                }
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-[#17cac6] to-[#0ea39f] hover:from-[#15b8b4] hover:to-[#0c8f8b] gap-2"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Minting...
                  </>
                ) : (
                  "Mint & Upload"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
