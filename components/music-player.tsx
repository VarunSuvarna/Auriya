"use client"

import { useState } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  List,
  Maximize2,
  Minimize2,
  Shuffle,
  Repeat,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(33)
  const [volume, setVolume] = useState(70)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  return (
    <>
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 border-t border-[#15b9b7]/20 bg-gradient-to-r from-[#001324] to-[#001a2a] backdrop-blur-md shadow-2xl",
          isExpanded && "hidden",
        )}
      >
        <div className="flex h-20 items-center gap-4 px-4">
          {/* Song Info */}
          <div className="flex items-center gap-3 w-48 md:w-64 min-w-0 flex-shrink-0">
            <img
              src="/abstract-music-album-cover-purple.jpg"
              alt="Album art"
              className="h-10 w-10 md:h-14 md:w-14 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-white">Sonic Dreams</p>
              <p className="text-xs text-gray-400 truncate">Luna Wave</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 flex-shrink-0 hover:bg-[#15b9b7]/10"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn("h-4 w-4", isLiked ? "fill-red-500 text-red-500" : "text-gray-400")} />
            </Button>
          </div>

          {/* Player Controls */}
          <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-[#15b9b7]/10 text-gray-400 hover:text-white"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-[#15b9b7]/10 text-gray-400 hover:text-white"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                className="h-10 w-10 rounded-full bg-[#15b9b7] hover:bg-[#15b9b7]/90 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#15b9b7]/30"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 text-white fill-white" />
                ) : (
                  <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-[#15b9b7]/10 text-gray-400 hover:text-white"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-[#15b9b7]/10 text-gray-400 hover:text-white"
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full max-w-2xl">
              <span className="text-xs text-gray-400 w-10 text-right">0:59</span>
              <Slider
                value={[progress]}
                onValueChange={(value) => setProgress(value[0])}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-gray-400 w-10">4:24</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1 md:gap-2 w-32 md:w-64 justify-end flex-shrink-0">
            <Button size="sm" className="gap-1 md:gap-2 bg-gradient-to-r from-[#15b9b7] to-[#17cac6] text-white hover:from-[#15b9b7]/90 hover:to-[#17cac6]/90 text-xs md:text-sm px-2 md:px-3 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#15b9b7]/30">
              <span className="hidden sm:inline">Buy </span>Token
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-[#15b9b7]/10 text-gray-400 hover:text-white"
            >
              <List className="h-4 w-4" />
            </Button>
            <div className="hidden md:flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-gray-400" />
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                max={100}
                step={1}
                className="w-16 md:w-24"
              />
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-[#15b9b7]/10 text-gray-400 hover:text-white"
              onClick={() => setIsExpanded(true)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Player */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
          <div className="container mx-auto px-6 py-8 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Button size="icon" variant="ghost" onClick={() => setIsExpanded(false)}>
                <Minimize2 className="h-5 w-5" />
              </Button>
              <h2 className="text-sm font-medium text-muted-foreground">Now Playing</h2>
              <Button size="icon" variant="ghost">
                <List className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left: Album Art & Info */}
              <div className="space-y-6">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/abstract-music-album-cover-purple.jpg"
                    alt="Album art"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold font-space-grotesk mb-2">Sonic Dreams</h1>
                      <p className="text-lg text-muted-foreground">Luna Wave</p>
                    </div>
                    <Button size="icon" variant="ghost" className="h-12 w-12" onClick={() => setIsLiked(!isLiked)}>
                      <Heart className={cn("h-6 w-6", isLiked ? "fill-red-500 text-red-500" : "text-gray-400")} />
                    </Button>
                  </div>

                  {/* Waveform Visualization */}
                  <div className="h-24 rounded-lg bg-secondary/30 flex items-end justify-around gap-1 p-4">
                    {Array.from({ length: 60 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-accent/50 rounded-full transition-all"
                        style={{
                          height: `${Math.random() * 100}%`,
                          opacity: i < progress * 0.6 ? 1 : 0.3,
                        }}
                      />
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <Slider
                      value={[progress]}
                      onValueChange={(value) => setProgress(value[0])}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>0:59</span>
                      <span>4:24</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 hover:bg-[#15b9b7]/10 text-gray-400 hover:text-white"
                    >
                      <Shuffle className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 hover:bg-[#15b9b7]/10 text-gray-400 hover:text-white"
                    >
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-16 w-16 rounded-full bg-[#15b9b7] hover:bg-[#15b9b7]/90"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="h-7 w-7 text-white fill-white" />
                      ) : (
                        <Play className="h-7 w-7 text-white fill-white ml-1" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 hover:bg-[#15b9b7]/10 text-gray-400 hover:text-white"
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 hover:bg-[#15b9b7]/10 text-gray-400 hover:text-white"
                    >
                      <Repeat className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Volume */}
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-5 w-5 text-gray-400" />
                    <Slider
                      value={[volume]}
                      onValueChange={(value) => setVolume(value[0])}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-400 w-10 text-right">{volume}%</span>
                  </div>
                </div>
              </div>

              {/* Right: Token Info & Actions */}
              <div className="space-y-6">
                {/* Token Stats */}
                <div className="rounded-2xl border border-border/30 bg-card/50 p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Token Information</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Token Price</p>
                      <p className="text-2xl font-bold text-accent">2.5 ALGO</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Market Cap</p>
                      <p className="text-2xl font-bold">$125K</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">24h Change</p>
                      <p className="text-xl font-semibold text-green-400">+15.3%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Holders</p>
                      <p className="text-xl font-semibold">234</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 gradient-accent text-white hover:opacity-90">Buy Token</Button>
                    <Button variant="outline" className="flex-1 border-accent/30 bg-transparent hover:bg-accent/10">
                      View Chart
                    </Button>
                  </div>
                </div>

                {/* Lyrics / Description */}
                <div className="rounded-2xl border border-border/30 bg-card/50 p-6 space-y-4">
                  <h3 className="text-lg font-semibold">About</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A mesmerizing journey through ambient soundscapes and ethereal melodies. This track combines
                    electronic elements with organic instrumentation to create a unique sonic experience.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                      Electronic
                    </span>
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">Ambient</span>
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">Chill</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
