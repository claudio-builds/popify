import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { key, type } = await request.json()

    if (!key || !type) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // Get site by API key
    const { data: site } = await supabase
      .from('sites')
      .select('id')
      .eq('api_key', key)
      .single()

    if (!site) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    // Get or create today's analytics record
    const today = new Date().toISOString().split('T')[0]
    
    const { data: existing } = await supabase
      .from('analytics')
      .select('*')
      .eq('site_id', site.id)
      .eq('date', today)
      .single()

    if (existing) {
      // Update existing record
      await supabase
        .from('analytics')
        .update({
          impressions: type === 'impression' ? existing.impressions + 1 : existing.impressions,
          clicks: type === 'click' ? existing.clicks + 1 : existing.clicks
        })
        .eq('id', existing.id)
    } else {
      // Create new record
      await supabase
        .from('analytics')
        .insert({
          site_id: site.id,
          date: today,
          impressions: type === 'impression' ? 1 : 0,
          clicks: type === 'click' ? 1 : 0
        })
    }

    return NextResponse.json({ success: true }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
