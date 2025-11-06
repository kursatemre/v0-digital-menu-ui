// Next.js API Route: Otomatik USD/TRY kuru güncelleme
// Vercel Cron Job ile günlük otomatik çalışır

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

interface ExchangeRateResponse {
  result: string
  conversion_rates: {
    TRY: number
  }
}

export async function GET(request: Request) {
  try {
    // Güvenlik: Sadece Vercel Cron'dan gelen istekleri kabul et
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // ExchangeRate API'den kur al
    const EXCHANGE_API_KEY = process.env.EXCHANGE_RATE_API_KEY
    
    if (!EXCHANGE_API_KEY) {
      throw new Error('EXCHANGE_RATE_API_KEY not configured')
    }

    console.log('Fetching USD/TRY exchange rate...')

    const exchangeResponse = await fetch(
      `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/USD`,
      { cache: 'no-store' }
    )

    if (!exchangeResponse.ok) {
      throw new Error(`Exchange API error: ${exchangeResponse.status}`)
    }

    const exchangeData: ExchangeRateResponse = await exchangeResponse.json()
    
    if (exchangeData.result !== 'success') {
      throw new Error('Exchange API returned error')
    }

    const usdToTryRate = exchangeData.conversion_rates.TRY

    console.log(`Fetched USD/TRY rate: ${usdToTryRate}`)

    // Supabase'de güncelle
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase
      .from('platform_settings')
      .update({ 
        usd_to_try_rate: usdToTryRate
        // last_rate_update trigger tarafından otomatik güncellenecek
      })
      .eq('id', (await supabase.from('platform_settings').select('id').single()).data?.id)

    if (error) {
      throw new Error(`Database update error: ${error.message}`)
    }

    console.log(`✅ Exchange rate updated successfully to ${usdToTryRate}`)

    return NextResponse.json({
      success: true,
      message: 'Exchange rate updated successfully',
      rate: usdToTryRate,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ Error updating exchange rate:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    )
  }
}
