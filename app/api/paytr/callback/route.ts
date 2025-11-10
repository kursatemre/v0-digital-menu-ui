// PayTR Callback - Ödeme sonucu bildirimi
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    // PayTR'den gelen parametreler
    const merchant_oid = formData.get('merchant_oid') as string
    const status = formData.get('status') as string
    const total_amount = formData.get('total_amount') as string
    const hash = formData.get('hash') as string
    const failed_reason_code = formData.get('failed_reason_code') as string
    const failed_reason_msg = formData.get('failed_reason_msg') as string
    const test_mode = formData.get('test_mode') as string
    const payment_type = formData.get('payment_type') as string
    const currency = formData.get('currency') as string
    const payment_amount = formData.get('payment_amount') as string

    console.log('PayTR Callback received:', {
      merchant_oid,
      status,
      total_amount,
      test_mode
    })

    // Güvenlik kontrolü - Hash doğrulama
    const MERCHANT_KEY = process.env.PAYTR_MERCHANT_KEY || 'xxxxxxxxxxxxxx'
    const MERCHANT_SALT = process.env.PAYTR_MERCHANT_SALT || 'xxxxxxxxxxxxxx'

    const hashStr = merchant_oid + MERCHANT_SALT + status + total_amount
    const calculatedHash = crypto.createHmac('sha256', MERCHANT_KEY).update(hashStr).digest('base64')

    if (hash !== calculatedHash) {
      console.error('Hash mismatch! Possible fraud attempt.')
      return NextResponse.json({ error: 'FAIL' }, { status: 400 })
    }

    // Database güncelle
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const paymentStatus = status === 'success' ? 'success' : 'failed'

    const { data: transaction, error } = await supabase
      .from('payment_transactions')
      .update({
        payment_status: paymentStatus,
        paytr_payment_id: merchant_oid,
        callback_data: {
          status,
          total_amount,
          failed_reason_code,
          failed_reason_msg,
          test_mode,
          payment_type,
          currency,
          payment_amount,
          received_at: new Date().toISOString()
        },
        callback_received_at: new Date().toISOString()
      })
      .eq('merchant_oid', merchant_oid)
      .select()
      .single()

    if (error) {
      console.error('Database update error:', error)
      return NextResponse.json({ error: 'FAIL' }, { status: 500 })
    }

    console.log(`Payment ${merchant_oid} updated to ${paymentStatus}`)

    // Başarılı ödeme için mail gönder
    if (paymentStatus === 'success' && transaction) {
      try {
        // Tenant bilgilerini al
        const { data: tenant } = await supabase
          .from('tenants')
          .select('business_name, owner_email')
          .eq('id', transaction.tenant_id)
          .single()

        if (tenant?.owner_email) {
          // Mail gönder (Resend entegrasyonu - gelecekte eklenecek)
          console.log('TODO: Send payment confirmation email to:', tenant.owner_email)
          
          // Şimdilik basit bir log
          console.log('Payment confirmation:', {
            to: tenant.owner_email,
            business: tenant.business_name,
            amount: total_amount,
            merchant_oid
          })
        }
      } catch (mailError) {
        console.error('Email send error:', mailError)
        // Mail hatası ödemeyi etkilemez, devam et
      }
    }

    // PayTR'ye OK dön (zorunlu!)
    return new Response('OK', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })

  } catch (error: any) {
    console.error('Callback error:', error)
    return new Response('FAIL', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}
