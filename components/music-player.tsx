"use client"

import { useState, useRef, useEffect } from "react"
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
  X,
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
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentSong, setCurrentSong] = useState({
    id: "1",
    title: "Chill Vibes",
    artist: "Lo-Fi Dreams",
    coverArt: "/abstract-music-album-cover-purple.jpg",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
    duration: "4:15",
    currentTime: "0:00"
  })
  const [queue, setQueue] = useState([
    { id: "2", title: "Electronic Dreams", artist: "Synth Master", coverArt: "/electronic-music-cover-cyan.jpg", audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.mp3" },
    { id: "3", title: "Ocean Waves", artist: "Nature Sounds", coverArt: "/ocean-waves-music-cover.jpg", audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/intromusic.ogg" },
    { id: "4", title: "Desert Mirage", artist: "Sahara Beats", coverArt: "/desert-music-album-orange.jpg", audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/thrust.mp3" }
  ])
  const [showQueue, setShowQueue] = useState(false)

  const togglePlayPause = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause()
          setIsPlaying(false)
        } else {
          audioRef.current.volume = volume / 100
          if (audioRef.current.readyState < 2) {
            audioRef.current.load()
            await new Promise(resolve => {
              audioRef.current!.addEventListener('canplay', resolve, { once: true })
            })
          }
          await audioRef.current.play()
          setIsPlaying(true)
        }
      } catch (error) {
        // Silently handle playback errors
        setIsPlaying(false)
      }
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current && isFinite(audioRef.current.currentTime) && isFinite(audioRef.current.duration)) {
      const current = audioRef.current.currentTime
      const duration = audioRef.current.duration
      
      if (duration > 0) {
        const progressPercent = (current / duration) * 100
        if (isFinite(progressPercent)) {
          setProgress(progressPercent)
        }
        
        const minutes = Math.floor(current / 60)
        const seconds = Math.floor(current % 60)
        if (isFinite(minutes) && isFinite(seconds)) {
          setCurrentSong(prev => ({
            ...prev,
            currentTime: `${minutes}:${seconds.toString().padStart(2, '0')}`
          }))
        }
      }
    }
  }

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current && audioRef.current.duration && isFinite(audioRef.current.duration)) {
      const duration = audioRef.current.duration
      const newTime = (value[0] / 100) * duration
      if (isFinite(newTime) && newTime >= 0 && newTime <= duration) {
        audioRef.current.currentTime = newTime
        setProgress(value[0])
      }
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100
      setVolume(value[0])
    }
  }

  const playSong = async (song: any) => {
    setIsPlaying(false)
    
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    
    setCurrentSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      coverArt: song.coverArt,
      audioUrl: song.audioUrl,
      duration: song.duration || "0:00",
      currentTime: "0:00"
    })
    setProgress(0)
    
    if (audioRef.current && song.audioUrl) {
      audioRef.current.src = song.audioUrl
      audioRef.current.load()
      
      try {
        await new Promise(resolve => {
          audioRef.current!.addEventListener('canplay', resolve, { once: true })
        })
        await audioRef.current.play()
        setIsPlaying(true)
      } catch (error) {
        // Silently handle song loading errors
        setIsPlaying(false)
      }
    }
  }

  const getSongMetadata = (song: any) => {
    const genreMap: { [key: string]: string[] } = {
      "Chill Vibes": ["Lo-Fi", "Chill", "Study Music", "Ambient"],
      "Electronic Dreams": ["Electronic", "Synthwave", "EDM", "Dance"],
      "Ocean Waves": ["Ambient", "Nature", "Meditation", "Relaxing"],
      "Desert Mirage": ["World", "Ethnic", "Desert", "Atmospheric"],
      "Neon Nights": ["Synthwave", "Retro", "80s", "Cyberpunk"],
      "Forest Whispers": ["Nature", "Ambient", "Forest", "Peaceful"],
      "Space Odyssey": ["Ambient", "Space", "Cinematic", "Atmospheric"],
      "Urban Flow": ["Hip-Hop", "Urban", "Beats", "Street"],
      "Digital Wave": ["Electronic", "Digital", "Futuristic", "Tech"],
      "Golden Hour": ["Chill", "Sunset", "Relaxing", "Warm"],
      "Deep Waters": ["Ambient", "Ocean", "Deep", "Meditative"],
      "Jungle Beats": ["World", "Tribal", "Jungle", "Rhythmic"]
    }

    const descriptions: { [key: string]: string } = {
      "Chill Vibes": "A soothing lo-fi track perfect for studying, working, or relaxing. Features warm analog sounds, gentle percussion, and atmospheric textures.",
      "Electronic Dreams": "An energetic electronic journey with pulsing synths, driving beats, and ethereal melodies that transport you to digital realms.",
      "Ocean Waves": "Immersive ambient soundscape capturing the essence of ocean waves, perfect for meditation and deep relaxation.",
      "Desert Mirage": "Exotic world music blending traditional instruments with modern production, evoking vast desert landscapes and ancient mysteries.",
      "Neon Nights": "Retro synthwave anthem with nostalgic 80s vibes, neon-soaked melodies, and driving electronic rhythms.",
      "Forest Whispers": "Natural ambient composition featuring forest sounds, gentle melodies, and organic textures for peaceful contemplation.",
      "Space Odyssey": "Cinematic ambient piece exploring cosmic themes with expansive soundscapes and otherworldly atmospheres.",
      "Urban Flow": "Modern hip-hop track with smooth beats, urban vibes, and contemporary production perfect for city life.",
      "Digital Wave": "Futuristic electronic composition with glitchy textures, digital processing, and cutting-edge sound design.",
      "Golden Hour": "Warm, sunset-inspired chill track with golden tones, relaxing melodies, and peaceful evening vibes.",
      "Deep Waters": "Meditative ambient piece exploring oceanic depths with deep, resonant tones and flowing textures.",
      "Jungle Beats": "Rhythmic world music with tribal percussion, jungle sounds, and primal energy from ancient forests."
    }

    return {
      genres: genreMap[song.title] || ["Electronic", "Ambient", "Chill"],
      description: descriptions[song.title] || "A unique musical experience crafted with care and attention to detail.",
      plays: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      artistInitials: song.artist.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }

    const handlePlaySong = (event: any) => {
      const song = event.detail
      playSong(song)
    }

    window.addEventListener('playSong', handlePlaySong)
    return () => window.removeEventListener('playSong', handlePlaySong)
  }, [])

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
              src={currentSong.coverArt}
              alt="Album art"
              className="h-10 w-10 md:h-14 md:w-14 rounded-lg object-cover flex-shrink-0 hover:scale-110 transition-transform duration-300 cursor-pointer"
              onClick={() => setIsExpanded(true)}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-white hover:text-[#15b9b7] transition-colors cursor-pointer" onClick={() => setIsExpanded(true)}>{currentSong.title}</p>
              <p className="text-xs text-gray-400 truncate hover:text-gray-300 transition-colors cursor-pointer">{currentSong.artist}</p>
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
                onClick={togglePlayPause}
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
              <span className="text-xs text-gray-400 w-10 text-right">{currentSong.currentTime}</span>
              <div className="flex-1 relative group h-1">
                <div className="absolute inset-0 bg-gray-600 rounded-full"></div>
                <div 
                  className="absolute left-0 top-0 h-full bg-[#15b9b7] rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                ></div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={(e) => handleProgressChange([parseFloat(e.target.value)])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${progress}% - 6px)` }}
                ></div>
              </div>
              <span className="text-xs text-gray-400 w-10">{currentSong.duration}</span>
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
              className={cn(
                "h-8 w-8 hover:bg-[#15b9b7]/10 transition-colors",
                showQueue ? "text-[#15b9b7] bg-[#15b9b7]/10" : "text-gray-400 hover:text-white"
              )}
              onClick={() => setShowQueue(!showQueue)}
            >
              <List className="h-4 w-4" />
            </Button>
            <div className="hidden md:flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-gray-400" />
              <div className="w-16 md:w-24 relative group h-1">
                <div className="absolute inset-0 bg-gray-600 rounded-full"></div>
                <div 
                  className="absolute left-0 top-0 h-full bg-[#15b9b7] rounded-full transition-all duration-100"
                  style={{ width: `${volume}%` }}
                ></div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={volume}
                  onChange={(e) => handleVolumeChange([parseInt(e.target.value)])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${volume}% - 4px)` }}
                ></div>
              </div>
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
        
        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={() => {
            if (audioRef.current && isFinite(audioRef.current.duration) && audioRef.current.duration > 0) {
              const duration = audioRef.current.duration
              const minutes = Math.floor(duration / 60)
              const seconds = Math.floor(duration % 60)
              if (isFinite(minutes) && isFinite(seconds)) {
                setCurrentSong(prev => ({
                  ...prev,
                  duration: `${minutes}:${seconds.toString().padStart(2, '0')}`
                }))
              }
            }
          }}
          onError={(e) => {
            // Silently handle audio errors to prevent console spam
            setIsPlaying(false)
          }}
          onLoadStart={() => {
            console.log('Loading audio:', currentSong.title)
          }}
          onCanPlay={() => {
            console.log('Audio ready to play:', currentSong.title)
          }}
          preload="none"
          className="hidden"
        />
      </div>

      {/* Queue Sidebar */}
      {showQueue && (
        <div className="fixed bottom-20 right-0 w-80 h-96 bg-[#001324] border-l border-t border-[#15b9b7]/20 backdrop-blur-md shadow-2xl z-40 transition-all duration-300">
          <div className="p-4 border-b border-[#15b9b7]/20">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Queue</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowQueue(false)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-2 space-y-1 overflow-y-auto h-80">
            {/* Now Playing */}
            <div className="p-2 rounded-lg bg-[#15b9b7]/10 border border-[#15b9b7]/20">
              <div className="flex items-center gap-3">
                <img
                  src={currentSong.coverArt}
                  alt={currentSong.title}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#15b9b7] truncate">{currentSong.title}</p>
                  <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 bg-[#15b9b7] rounded-full animate-pulse"
                      style={{
                        height: Math.random() * 8 + 4,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '0.8s'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Queue Items */}
            <div className="text-xs text-gray-400 px-2 py-1 font-medium">Next Up</div>
            {queue.map((song, index) => (
              <div
                key={song.id}
                className="p-2 rounded-lg hover:bg-[#15b9b7]/5 transition-colors cursor-pointer group"
                onClick={() => {
                  playSong({ ...song, duration: "4:12" })
                  setQueue(prev => prev.filter((_, i) => i !== index))
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={song.coverArt}
                      alt={song.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-[#15b9b7] transition-colors">{song.title}</p>
                    <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                  </div>
                  <span className="text-xs text-gray-500">{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expanded Player */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#001324] to-[#000a14] overflow-y-auto backdrop-blur-sm">
          <div className="container mx-auto px-6 py-8 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => setIsExpanded(false)}
                className="hover:bg-[#15b9b7]/10 text-gray-400 hover:text-white"
              >
                <Minimize2 className="h-5 w-5" />
              </Button>
              <h2 className="text-sm font-medium text-[#15b9b7] uppercase tracking-wider">Now Playing</h2>
              <Button 
                size="icon" 
                variant="ghost"
                className="hover:bg-[#15b9b7]/10 text-gray-400 hover:text-white"
                onClick={() => setShowQueue(!showQueue)}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left: Album Art & Info */}
              <div className="space-y-6">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-[#15b9b7]/20 group">
                  <img
                    src={currentSong.coverArt}
                    alt={currentSong.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h1 className="text-4xl font-bold font-space-grotesk mb-3 text-white">{currentSong.title}</h1>
                      <p className="text-xl text-[#15b9b7] font-medium">{currentSong.artist}</p>
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                        <span>{getSongMetadata(currentSong).genres[0]}</span>
                        <span>•</span>
                        <span>2024</span>
                        <span>•</span>
                        <span>{currentSong.duration}</span>
                      </div>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-12 w-12 hover:bg-[#15b9b7]/10" 
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart className={cn("h-6 w-6 transition-colors", isLiked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400")} />
                    </Button>
                  </div>

                  {/* Waveform Visualization */}
                  <div className="h-32 rounded-xl bg-gradient-to-r from-[#15b9b7]/10 to-[#15b9b7]/5 flex items-end justify-around gap-1 p-6 border border-[#15b9b7]/20">
                    {Array.from({ length: 80 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex-1 rounded-full transition-all duration-300 hover:bg-[#15b9b7]",
                          i < progress * 0.8 ? "bg-[#15b9b7]" : "bg-[#15b9b7]/30"
                        )}
                        style={{
                          height: `${Math.random() * 80 + 20}%`,
                          maxWidth: '3px'
                        }}
                      />
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="space-y-3">
                    <div className="relative group h-2">
                      <div className="absolute inset-0 bg-gray-600 rounded-full"></div>
                      <div 
                        className="absolute left-0 top-0 h-full bg-[#15b9b7] rounded-full transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      ></div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        value={progress}
                        onChange={(e) => handleProgressChange([parseFloat(e.target.value)])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ left: `calc(${progress}% - 8px)` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span className="font-mono">{currentSong.currentTime}</span>
                      <span className="font-mono">{currentSong.duration}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-6">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-12 w-12 hover:bg-[#15b9b7]/10 text-gray-400 hover:text-white transition-all hover:scale-110"
                    >
                      <Shuffle className="h-6 w-6" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-12 w-12 hover:bg-[#15b9b7]/10 text-gray-400 hover:text-white transition-all hover:scale-110"
                    >
                      <SkipBack className="h-6 w-6" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-20 w-20 rounded-full bg-[#15b9b7] hover:bg-[#15b9b7]/90 shadow-lg hover:shadow-xl hover:shadow-[#15b9b7]/30 transition-all hover:scale-110"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8 text-white fill-white" />
                      ) : (
                        <Play className="h-8 w-8 text-white fill-white ml-1" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-12 w-12 hover:bg-[#15b9b7]/10 text-gray-400 hover:text-white transition-all hover:scale-110"
                    >
                      <SkipForward className="h-6 w-6" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-12 w-12 hover:bg-[#15b9b7]/10 text-gray-400 hover:text-white transition-all hover:scale-110"
                    >
                      <Repeat className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Volume */}
                  <div className="flex items-center gap-4 bg-[#15b9b7]/5 rounded-xl p-4 border border-[#15b9b7]/20">
                    <Volume2 className="h-5 w-5 text-[#15b9b7]" />
                    <div className="flex-1 relative group h-2">
                      <div className="absolute inset-0 bg-gray-600 rounded-full"></div>
                      <div 
                        className="absolute left-0 top-0 h-full bg-[#15b9b7] rounded-full transition-all duration-100"
                        style={{ width: `${volume}%` }}
                      ></div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={volume}
                        onChange={(e) => handleVolumeChange([parseInt(e.target.value)])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ left: `calc(${volume}% - 8px)` }}
                      ></div>
                    </div>
                    <span className="text-sm text-[#15b9b7] w-12 text-right font-mono">{Math.round(volume)}%</span>
                  </div>
                </div>
              </div>

              {/* Right: Token Info & Actions */}
              <div className="space-y-6">
                {/* Token Stats */}
                <div className="rounded-2xl border border-[#15b9b7]/20 bg-gradient-to-br from-[#15b9b7]/10 to-[#15b9b7]/5 p-6 space-y-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Token Information</h3>
                    <div className="px-3 py-1 rounded-full bg-[#15b9b7]/20 text-[#15b9b7] text-xs font-medium">
                      {currentSong.title.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Token Price</p>
                      <p className="text-3xl font-bold text-[#15b9b7]">2.5 ALGO</p>
                      <p className="text-xs text-green-400">+15.3% (24h)</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Market Cap</p>
                      <p className="text-3xl font-bold text-white">$125K</p>
                      <p className="text-xs text-gray-400">Rank #42</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Volume (24h)</p>
                      <p className="text-xl font-bold text-white">$12.4K</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Holders</p>
                      <p className="text-xl font-bold text-white">234</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1 bg-[#15b9b7] hover:bg-[#15b9b7]/90 text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all">
                      Buy Token
                    </Button>
                    <Button variant="outline" className="flex-1 border-[#15b9b7]/30 text-[#15b9b7] hover:bg-[#15b9b7]/10 py-3">
                      View Chart
                    </Button>
                  </div>
                </div>

                {/* Song Details */}
                <div className="rounded-2xl border border-[#15b9b7]/20 bg-gradient-to-br from-[#15b9b7]/5 to-transparent p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">About This Track</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {getSongMetadata(currentSong).description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Genre</span>
                      <span className="text-white">{getSongMetadata(currentSong).genres[0]}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Release Date</span>
                      <span className="text-white">March 2024</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Plays</span>
                      <span className="text-white">{getSongMetadata(currentSong).plays.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Likes</span>
                      <span className="text-white">{getSongMetadata(currentSong).likes.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {getSongMetadata(currentSong).genres.map((genre, index) => (
                      <span key={index} className="px-3 py-1 rounded-full bg-[#15b9b7]/20 text-[#15b9b7] text-xs font-medium">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Artist Info */}
                <div className="rounded-2xl border border-[#15b9b7]/20 bg-gradient-to-br from-[#15b9b7]/5 to-transparent p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#15b9b7] to-[#17cac6] flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{getSongMetadata(currentSong).artistInitials}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{currentSong.artist}</h4>
                      <p className="text-sm text-gray-400">Electronic Music Producer</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    Creating {getSongMetadata(currentSong).genres[0].toLowerCase()} music and atmospheric soundscapes since 2020. 
                    Specializing in {getSongMetadata(currentSong).genres.slice(0, 2).map(g => g.toLowerCase()).join(' and ')} music.
                  </p>
                  <Button variant="outline" className="w-full border-[#15b9b7]/30 text-[#15b9b7] hover:bg-[#15b9b7]/10">
                    Follow Artist
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
