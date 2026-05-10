"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWallet } from "@txnlab/use-wallet-react"
import { Music, Plus, Trash2, Save, Loader2, Search, SlidersHorizontal } from "lucide-react"
import { toast } from "react-toastify"
import { useRealtime } from "@/hooks/useRealtime"

export default function RecipesPage() {
  const { activeAddress } = useWallet()
  const { addActivity } = useRealtime()
  
  const [availableStems, setAvailableStems] = useState<any[]>([])
  const [selectedStems, setSelectedStems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  const [recipeInfo, setRecipeInfo] = useState({
    title: "",
    description: "",
  })

  useEffect(() => {
    async function fetchStems() {
      try {
        const response = await fetch('/api/songs')
        const data = await response.json()
        if (Array.isArray(data)) {
          setAvailableStems(data)
        }
      } catch (error) {
        console.error("Failed to fetch stems:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStems()
  }, [])

  const filteredStems = availableStems.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.artist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addStem = (stem: any) => {
    if (selectedStems.find(s => s.id === stem.id)) {
      toast.info("Stem already added")
      return
    }
    setSelectedStems([...selectedStems, { ...stem, weight: 50 }])
  }

  const removeStem = (id: string) => {
    setSelectedStems(selectedStems.filter(s => s.id !== id))
  }

  const updateWeight = (id: string, weight: number) => {
    setSelectedStems(selectedStems.map(s => s.id === id ? { ...s, weight } : s))
  }

  const handleSaveRecipe = async () => {
    if (!activeAddress) {
      toast.error("Please connect your wallet")
      return
    }
    if (selectedStems.length === 0) {
      toast.error("Please add at least one stem")
      return
    }
    if (!recipeInfo.title) {
      toast.error("Please provide a recipe title")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...recipeInfo,
          stem_ids: selectedStems.map(s => s.id),
          weights: selectedStems.map(s => s.weight),
          user_address: activeAddress,
          cover_art: selectedStems[0]?.coverArt || "" 
        })
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Recipe crafted successfully!")
        addActivity({
          type: 'mint',
          song_title: recipeInfo.title,
          user_address: activeAddress
        })
        setSelectedStems([])
        setRecipeInfo({ title: "", description: "" })
      } else {
        throw new Error(data.error || "Failed to save recipe")
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-space-grotesk text-white">The Kitchen</h1>
          <p className="text-gray-400">Combine stems into unique music recipes</p>
        </div>
        <Button 
          onClick={handleSaveRecipe} 
          disabled={isSaving}
          className="bg-accent hover:bg-accent/90 gap-2"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Craft Recipe
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selection Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-secondary/10 border-[#15b9b7]/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                 <div className="relative flex-1">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                   <Input 
                     placeholder="Search available stems..." 
                     className="pl-10 bg-secondary/20"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
                 </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredStems.map(stem => (
                    <div 
                      key={stem.id} 
                      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/10 border border-white/5 hover:border-accent/40 transition-all group cursor-pointer"
                      onClick={() => addStem(stem)}
                    >
                      <img src={stem.coverArt} className="h-12 w-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{stem.title}</p>
                        <p className="text-xs text-gray-400 truncate">{stem.artist}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 h-8 w-8 text-accent">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-secondary/10 border-[#15b9b7]/20">
            <CardContent className="p-6">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <Music className="h-5 w-5 text-accent" />
                 Your Mix
               </h3>
               
               {selectedStems.length === 0 ? (
                 <div className="text-center py-12 rounded-xl border-2 border-dashed border-white/5 bg-secondary/5">
                   <p className="text-gray-500">No stems added to the mix. Select one from the left!</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {selectedStems.map(stem => (
                     <div key={stem.id} className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                             <img src={stem.coverArt} className="h-10 w-10 rounded-lg object-cover" />
                             <div>
                               <p className="font-bold text-white leading-tight">{stem.title}</p>
                               <p className="text-xs text-gray-400">{stem.artist}</p>
                             </div>
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            onClick={() => removeStem(stem.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                           <SlidersHorizontal className="h-4 w-4 text-accent/60" />
                           <input 
                             type="range" 
                             min="0" 
                             max="100" 
                             value={stem.weight}
                             onChange={(e) => updateWeight(stem.id, parseInt(e.target.value))}
                             className="flex-1 accent-accent"
                           />
                           <span className="text-sm font-mono text-accent w-8 text-right">{stem.weight}%</span>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
            </CardContent>
          </Card>
        </div>

        {/* Recipe Info Area */}
        <div className="space-y-6">
          <Card className="bg-secondary/10 border-[#15b9b7]/20 sticky top-24">
            <CardContent className="p-6 space-y-6">
               <h3 className="text-xl font-bold text-white mb-2">Recipe Details</h3>
               
               <div className="space-y-4">
                 <div className="space-y-2">
                   <Label htmlFor="title">Recipe Title</Label>
                   <Input 
                     id="title" 
                     placeholder="My Ultimate Chill Mix" 
                     className="bg-secondary/20"
                     value={recipeInfo.title}
                     onChange={(e) => setRecipeInfo({...recipeInfo, title: e.target.value})}
                   />
                 </div>
                 
                 <div className="space-y-2">
                   <Label htmlFor="desc">Description</Label>
                   <textarea 
                     id="desc"
                     className="w-full rounded-lg bg-secondary/20 border border-input p-3 text-sm min-h-[100px] focus:outline-none focus:ring-1 focus:ring-accent"
                     placeholder="Explain the magic behind this combination..."
                     value={recipeInfo.description}
                     onChange={(e) => setRecipeInfo({...recipeInfo, description: e.target.value})}
                   />
                 </div>
               </div>

               <div className="pt-6 border-t border-white/5 space-y-4">
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-400">Total Stems</span>
                   <span className="text-white font-bold">{selectedStems.length}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-400">Avg. Weight</span>
                   <span className="text-white font-bold">
                     {selectedStems.length > 0 
                       ? Math.round(selectedStems.reduce((acc, curr) => acc + curr.weight, 0) / selectedStems.length) 
                       : 0}%
                   </span>
                 </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Latest Recipes Section */}
      <div className="mt-16 space-y-8">
        <div className="flex items-center justify-between border-b border-[#15b9b7]/20 pb-4">
          <h2 className="text-2xl font-bold text-white">Latest Creations</h2>
          <span className="text-sm text-gray-500">Community Recipes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* This would ideally fetch from /api/recipes */}
          <div className="p-4 rounded-2xl bg-secondary/5 border border-white/5 hover:border-[#15b9b7]/30 transition-all text-center group cursor-pointer">
             <div className="aspect-square rounded-xl bg-gradient-to-br from-[#15b9b7]/20 to-transparent flex items-center justify-center mb-4 overflow-hidden">
                <Music className="h-12 w-12 text-[#15b9b7]/30 group-hover:scale-110 transition-transform" />
             </div>
             <h4 className="font-bold text-white">Midnight Soul</h4>
             <p className="text-xs text-gray-500">3 Stems • By Varun...</p>
          </div>
          {/* Add more as placeholders or map real data if you have it */}
        </div>
      </div>
    </div>
  )
}
