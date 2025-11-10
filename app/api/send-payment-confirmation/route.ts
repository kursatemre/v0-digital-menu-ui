import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Resend API key optional - if not set, just log instead of sending
const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function POST(request: Request) {
  try {
    const { to, business_name, amount, merchant_oid, plan_type } = await request.json()

    if (!to || !business_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If Resend is not configured, just log and return success
    if (!resend) {
      console.log('Resend API key not configured. Email would be sent to:', {
        to,
        business_name,
        amount,
        merchant_oid,
        plan_type
      })
      return NextResponse.json({ 
        success: true, 
        message: 'Email logging only (Resend not configured)' 
      })
    }

    const { data, error } = await resend.emails.send({
      from: 'MenumGO <noreply@menumgo.digital>',
      to: [to],
      subject: '✅ Ödemeniz Başarıyla Alındı - Premium Aboneliğiniz Aktif!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .info-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Ödemeniz Başarıyla Alındı!</h1>
            </div>
            <div class="content">
              <p>Merhaba <strong>${business_name}</strong>,</p>
              
              <p>Premium abonelik ödemeniz başarıyla işleme alınmıştır. Artık MenumGO Premium özelliklerinin tamamına erişebilirsiniz!</p>
              
              <div class="info-box">
                <strong>Ödeme Detayları:</strong><br>
                💳 Tutar: <strong>${amount} TL</strong><br>
                📦 Plan: <strong>${plan_type === 'monthly' ? 'Aylık Premium' : 'Yıllık Premium'}</strong><br>
                🔑 İşlem No: <strong>${merchant_oid}</strong><br>
                📅 Tarih: <strong>${new Date().toLocaleDateString('tr-TR')}</strong>
              </div>
              
              <p><strong>Premium Özellikler:</strong></p>
              <ul>
                <li>✨ Sınırsız ürün ekleme</li>
                <li>🎨 Özel tema ve renk ayarları</li>
                <li>📊 Detaylı analitik raporlar</li>
                <li>🌐 Çoklu dil desteği</li>
                <li>💼 Öncelikli destek</li>
              </ul>
              
              <center>
                <a href="https://www.menumgo.digital" class="button">Admin Paneline Git</a>
              </center>
              
              <p>Herhangi bir sorunuz olursa bizimle iletişime geçmekten çekinmeyin.</p>
              
              <p>İyi çalışmalar dileriz!<br>
              <strong>MenumGO Ekibi</strong></p>
              
              <div class="footer">
                <p>Bu e-posta MenumGO tarafından gönderilmiştir.<br>
                © ${new Date().getFullYear()} MenumGO. Tüm hakları saklıdır.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error: any) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    )
  }
}
