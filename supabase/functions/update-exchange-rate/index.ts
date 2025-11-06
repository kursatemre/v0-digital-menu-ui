// Supabase Edge Function: Otomatik USD/TRY kuru güncelleme
// Bu fonksiyon günlük olarak çalışır ve döviz kurunu günceller

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExchangeRateResponse {
  result: string
  conversion_rates: {
    TRY: number
  }
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // ExchangeRate API'den USD/TRY kurunu al (ücretsiz, günde 1500 istek)
    // API Key: https://www.exchangerate-api.com/ adresinden ücretsiz alınabilir
    const EXCHANGE_API_KEY = Deno.env.get('EXCHANGE_RATE_API_KEY')
    
    if (!EXCHANGE_API_KEY) {
      throw new Error('EXCHANGE_RATE_API_KEY environment variable not set')
    }

    const exchangeResponse = await fetch(
      `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/USD`
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

    // Supabase client oluştur
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Platform settings'i güncelle
    const { data, error } = await supabase
      .from('platform_settings')
      .update({ 
        usd_to_try_rate: usdToTryRate,
        // last_rate_update trigger tarafından otomatik güncellenecek
      })
      .single()

    if (error) {
      throw new Error(`Database update error: ${error.message}`)
    }

    console.log(`Successfully updated exchange rate to ${usdToTryRate}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Exchange rate updated successfully',
        rate: usdToTryRate,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error updating exchange rate:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
