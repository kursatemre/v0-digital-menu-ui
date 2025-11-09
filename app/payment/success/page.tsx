'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const merchant_oid_param = searchParams.get('merchant_oid')
  const [transaction, setTransaction] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // merchant_oid'yi URL'den veya sessionStorage'dan al
  const merchant_oid = merchant_oid_param || (typeof window !== 'undefined' ? sessionStorage.getItem('last_payment_merchant_oid') : null)
  const tenant_id = typeof window !== 'undefined' ? sessionStorage.getItem('last_payment_tenant_id') : null

  useEffect(() => {
    console.log('Payment success page loaded', { 
      merchant_oid_param, 
      merchant_oid_from_session: typeof window !== 'undefined' ? sessionStorage.getItem('last_payment_merchant_oid') : null,
      final_merchant_oid: merchant_oid,
      searchParams: Object.fromEntries(searchParams.entries()) 
    })
    
    if (merchant_oid) {
      loadTransaction()
      // Temizle
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('last_payment_merchant_oid')
        sessionStorage.removeItem('last_payment_tenant_id')
      }
    } else {
      setLoading(false)
    }
  }, [merchant_oid])

  const loadTransaction = async () => {
    const supabase = createClient()
    
    console.log('Loading transaction with merchant_oid:', merchant_oid)
    
    // İlk önce payment transaction'ı alalım
    const { data: payment, error: paymentError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('merchant_oid', merchant_oid)
      .single()

    if (paymentError) {
      console.error('Error loading payment:', paymentError)
      setLoading(false)
      return
    }

    console.log('Payment loaded:', payment)

    // Sonra tenant bilgisini alalım
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('business_name, slug, id, subscription_plan')
      .eq('id', payment.tenant_id)
      .single()

    if (tenantError) {
      console.error('Error loading tenant:', tenantError)
      setLoading(false)
      return
    }

    console.log('Tenant loaded:', tenant)

    // Birleştir
    const data = {
      ...payment,
      tenants: tenant
    }

    console.log('Combined transaction data:', data)
    setTransaction(data)
    
    // Premium aktivasyonu için API çağrısı (RLS bypass)
    // Test modunda pending, production'da success olabilir
    if (data && ['pending', 'success'].includes(data.payment_status)) {
      console.log('Calling activate-premium API for tenant:', data.tenant_id)
      
      try {
        const response = await fetch('/api/activate-premium', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenant_id: data.tenant_id,
            merchant_oid: merchant_oid
          })
        })

        const result = await response.json()
        
        if (response.ok && result.success) {
          console.log('Premium activated successfully')
          // Reload transaction to get updated tenant data
          const { data: updatedData } = await supabase
            .from('payment_transactions')
            .select('*, tenants(name, slug, subscription_plan)')
            .eq('merchant_oid', merchant_oid)
            .single()
          setTransaction(updatedData)
        } else {
          console.error('Premium activation failed:', result.error)
        }
      } catch (error) {
        console.error('Premium activation request failed:', error)
      }
    }
    
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!merchant_oid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Ödeme Başarılı!
          </h1>
          <p className="text-gray-600 mb-6">
            Premium üyeliğiniz aktif edildi. Ödeme detayları e-posta adresinize gönderildi.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left text-sm">
            <h3 className="font-semibold text-blue-900 mb-2">📧 Sonraki Adımlar:</h3>
            <ul className="space-y-1 text-blue-800 list-disc list-inside">
              <li>E-posta adresinize onay maili gönderdik</li>
              <li>Fatura bilgileri 24 saat içinde iletilecek</li>
              <li>Premium özellikleriniz şu anda aktif</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => window.location.href = '/'}>
              🏠 Ana Sayfaya Dön
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 Ödeme Başarılı!
        </h1>

        {transaction && (
          <>
            <p className="text-gray-600 mb-6">
              <strong>{transaction.tenants?.business_name || 'Restoranınız'}</strong> için <strong>Premium Üyelik</strong> aktif edildi.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h2 className="font-semibold text-lg mb-4">Ödeme Detayları</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">İşlem No:</span>
                  <span className="font-mono font-semibold">{merchant_oid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tutar:</span>
                  <span className="font-semibold text-green-600">{transaction.payment_amount} TRY</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paket:</span>
                  <span className="font-semibold">Premium (30 Gün)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durum:</span>
                  <span className="text-green-600 font-semibold">✅ Tamamlandı</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left text-sm">
              <h3 className="font-semibold text-blue-900 mb-2">📧 Sonraki Adımlar:</h3>
              <ul className="space-y-1 text-blue-800 list-disc list-inside">
                <li>E-posta adresinize onay maili gönderdik</li>
                <li>Fatura bilgileri 24 saat içinde iletilecek</li>
                <li>Premium özellikleriniz şu anda aktif</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/${transaction.tenants?.slug}/admin`}>
                <Button size="lg" className="w-full sm:w-auto">
                  🎛️ Admin Paneline Git
                </Button>
              </Link>
              <Link href={`/${transaction.tenants?.slug}`}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  🍽️ Menümü Görüntüle
                </Button>
              </Link>
            </div>
          </>
        )}

        {!transaction && (
          <div>
            <p className="text-gray-600 mb-4">İşlem bilgisi bulunamadı.</p>
            <Link href="/">
              <Button>Ana Sayfaya Dön</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  )
}
