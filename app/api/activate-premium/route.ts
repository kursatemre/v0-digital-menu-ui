import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { tenant_id, merchant_oid } = await request.json()

    if (!tenant_id || !merchant_oid) {
      return NextResponse.json(
        { error: 'Missing tenant_id or merchant_oid' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Activating premium for tenant:', tenant_id)

    // Verify payment is successful
    const { data: payment } = await supabase
      .from('payment_transactions')
      .select('payment_status')
      .eq('merchant_oid', merchant_oid)
      .eq('tenant_id', tenant_id)
      .single()

    if (!payment || payment.payment_status !== 'success') {
      return NextResponse.json(
        { error: 'Payment not found or not successful' },
        { status: 404 }
      )
    }

    // Activate premium
    const subscriptionEndDate = new Date()
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30)

    const { data: tenant, error: updateError } = await supabase
      .from('tenants')
      .update({
        subscription_plan: 'premium',
        subscription_status: 'active',
        subscription_end_date: subscriptionEndDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', tenant_id)
      .select()
      .single()

    if (updateError) {
      console.error('Premium activation error:', updateError)
      return NextResponse.json(
        { error: 'Failed to activate premium', details: updateError.message },
        { status: 500 }
      )
    }

    console.log('Premium activated successfully for tenant:', tenant_id)

    return NextResponse.json({
      success: true,
      tenant
    })

  } catch (error: any) {
    console.error('Activate premium error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
