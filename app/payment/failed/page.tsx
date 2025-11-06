'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function PaymentFailedPage() {
  const searchParams = useSearchParams()
  const merchant_oid = searchParams.get('merchant_oid')
  const [transaction, setTransaction] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (merchant_oid) {
      loadTransaction()
    }
  }, [merchant_oid])

  const loadTransaction = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('payment_transactions')
      .select('*, tenants(name, slug)')
      .eq('merchant_oid', merchant_oid)
      .single()

    setTransaction(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const failureReason = transaction?.callback_data?.failed_reason_msg || 'Bilinmeyen hata'

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 text-center">
        {/* Error Icon */}
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ❌ Ödeme Başarısız
        </h1>

        <p className="text-gray-600 mb-6">
          Ödeme işleminiz tamamlanamadı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.
        </p>

        {transaction && (
          <>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 text-left">
              <h2 className="font-semibold text-lg text-red-900 mb-4">Hata Detayları</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">İşlem No:</span>
                  <span className="font-mono font-semibold">{merchant_oid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hata Kodu:</span>
                  <span className="font-semibold text-red-600">
                    {transaction?.callback_data?.failed_reason_code || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hata Mesajı:</span>
                  <span className="font-semibold text-red-600">{failureReason}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left text-sm">
              <h3 className="font-semibold text-yellow-900 mb-2">💡 Öneriler:</h3>
              <ul className="space-y-1 text-yellow-800 list-disc list-inside">
                <li>Kart bilgilerinizi kontrol edin (son kullanma tarihi, CVV)</li>
                <li>Kartınızda yeterli bakiye olduğundan emin olun</li>
                <li>3D Secure doğrulamasını tamamladığınızdan emin olun</li>
                <li>Sorun devam ederse bankanızla iletişime geçin</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/${transaction.tenants?.slug}/payment`}>
                <Button size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
                  🔄 Tekrar Dene
                </Button>
              </Link>
              <Link href={`/${transaction.tenants?.slug}/admin`}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  🎛️ Admin Paneline Dön
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

        <p className="text-xs text-gray-500 mt-6">
          Destek için: <a href="mailto:destek@menumgo.com" className="text-blue-600 hover:underline">destek@menumgo.com</a>
        </p>
      </Card>
    </div>
  )
}
