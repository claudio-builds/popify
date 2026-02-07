import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const apiKey = searchParams.get('key')

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 400 })
  }

  // Get site by API key
  const { data: site, error: siteError } = await supabase
    .from('sites')
    .select('*')
    .eq('api_key', apiKey)
    .single()

  if (siteError || !site) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  // Get notifications for this site
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('site_id', site.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Return notifications with CORS headers
  return NextResponse.json({
    notifications: notifications || [],
    settings: site.settings
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
