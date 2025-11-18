// PayTR Ödeme İframe Token Oluşturma API
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export const runtime = 'nodejs'

interface PaymentRequest {
  tenant_id: string
  user_name: string
  user_email: string
  user_phone: string
  user_address: string
  amount: number
  plan_type?: string
  plan_name?: string
  subscription_plan?: 'standard' | 'premium'
}

export async function POST(request: Request) {
  try {
    const body: PaymentRequest = await request.json()

    console.log('Payment request received:', {
      tenant_id: body.tenant_id,
      amount: body.amount,
      plan_type: body.plan_type,
      plan_name: body.plan_name
    })

    // Validation
    if (!body.tenant_id || !body.user_name || !body.user_email || !body.user_phone || !body.amount) {
      console.error('Validation failed:', body)
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // PayTR Test Credentials
    const MERCHANT_ID = process.env.PAYTR_MERCHANT_ID || '000000' // Test: 000000
    const MERCHANT_KEY = process.env.PAYTR_MERCHANT_KEY || 'xxxxxxxxxxxxxx'
    const MERCHANT_SALT = process.env.PAYTR_MERCHANT_SALT || 'xxxxxxxxxxxxxx'

    console.log('PayTR credentials:', {
      MERCHANT_ID,
      hasKey: !!MERCHANT_KEY,
      hasSalt: !!MERCHANT_SALT
    })

    // Benzersiz sipariş ID oluştur
    const merchant_oid = `MENU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Sipariş detayları
    const productName = body.plan_name || 'Premium Abonelik - 1 Aylık'
    const user_basket = JSON.stringify([
      [productName, body.amount.toFixed(2), 1]
    ])

    // PayTR callback URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://menumgo.digital'
    const merchant_ok_url = `${baseUrl}/payment/success?merchant_oid=${merchant_oid}`
    const merchant_fail_url = `${baseUrl}/payment/failed?merchant_oid=${merchant_oid}`

    // PayTR API parametreleri
    const user_ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const payment_amount = (body.amount * 100).toFixed(0) // Kuruş cinsinden
    const no_installment = '0'
    const max_installment = '0'
    const currency = 'TRY'
    const test_mode = '1'

    // Hash oluştur (PayTR güvenlik)
    // Format: merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode + merchant_salt
    const hashStr = `${MERCHANT_ID}${user_ip}${merchant_oid}${body.user_email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}${MERCHANT_SALT}`
    const token = crypto.createHmac('sha256', MERCHANT_KEY).update(hashStr).digest('base64')

    console.log('Hash created:', {
      merchant_oid,
      user_ip,
      payment_amount,
      token_preview: token.substring(0, 20) + '...'
    })

    // PayTR API isteği
    const paytrParams = new URLSearchParams({
      merchant_id: MERCHANT_ID,
      user_ip: user_ip,
      merchant_oid: merchant_oid,
      email: body.user_email,
      payment_amount: payment_amount,
      paytr_token: token,
      user_basket: user_basket,
      debug_on: '1',
      no_installment: no_installment,
      max_installment: max_installment,
      user_name: body.user_name,
      user_address: body.user_address,
      user_phone: body.user_phone,
      merchant_ok_url: merchant_ok_url,
      merchant_fail_url: merchant_fail_url,
      timeout_limit: '30',
      currency: currency,
      test_mode: test_mode,
      lang: 'tr'
    })

    const paytrResponse = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: paytrParams.toString()
    })

    const paytrData = await paytrResponse.json()

    console.log('PayTR Response:', {
      status: paytrData.status,
      reason: paytrData.reason,
      hasToken: !!paytrData.token
    })

    if (paytrData.status !== 'success') {
      console.error('PayTR Error:', paytrData)
      return NextResponse.json(
        { error: 'PayTR ödeme oluşturulamadı', details: paytrData.reason },
        { status: 500 }
      )
    }

    // Database'e kaydet
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error: dbError } = await supabase
      .from('payment_transactions')
      .insert({
        tenant_id: body.tenant_id,
        merchant_oid: merchant_oid,
        payment_amount: body.amount,
        payment_type: 'card',
        paytr_token: paytrData.token,
        payment_status: 'pending',
        user_name: body.user_name,
        user_email: body.user_email,
        user_phone: body.user_phone,
        user_address: body.user_address,
        order_details: {
          product: body.plan_name || 'Premium Abonelik',
          plan_type: body.plan_type || 'monthly',
          subscription_plan: body.subscription_plan || 'premium',
          amount: body.amount
        }
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Ödeme kaydedilemedi' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      iframe_token: paytrData.token,
      merchant_oid: merchant_oid
    })

  } catch (error: any) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Ödeme işlemi başlatılamadı', details: error.message },
      { status: 500 }
    )
  }
}
