import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ success: true, recipes })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, stem_ids, weights, user_address, cover_art } = body

    // 1. Create the recipe
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .insert({
        title,
        description,
        cover_art,
        creator_address: user_address
      })
      .select()
      .single()

    if (recipeError) throw recipeError

    // 2. Link the stems
    if (stem_ids && stem_ids.length > 0) {
      const recipeStems = stem_ids.map((id: string, index: number) => ({
        recipe_id: recipe.id,
        stem_id: id,
        weight: weights[index] || 50
      }))

      const { error: stemLinkError } = await supabase
        .from('recipe_stems')
        .insert(recipeStems)

      if (stemLinkError) throw stemLinkError
    }

    // 3. Log Activity
    await supabase.from('activities').insert({
      type: 'mint',
      song_title: title,
      user_address: user_address,
      user: 'Architect' 
    })

    return NextResponse.json({ success: true, recipe })
  } catch (error: any) {
    console.error('Recipe Creation Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
