# 🤖 AI Destek Chat - Hızlı Başlangıç

## ✅ Tamamlandı

Landing page'inize AI destekli bir sohbet balonu başarıyla eklendi!

### Eklenen Dosyalar:
- ✅ `components/support-chat-button.tsx` - Sağ alt köşede chat balonu
- ✅ `components/support-chat-widget.tsx` - Chat penceresi ve UI
- ✅ `app/api/chat/route.ts` - OpenAI API entegrasyonu (güvenli)
- ✅ `docs/AI_CHAT_SETUP.md` - Detaylı kurulum dokümantasyonu
- ✅ `.env.local.example` - Environment variables şablonu

## 🚀 Şimdi Ne Yapmalıyım?

### 1. OpenAI API Key Alın (5 dakika)

1. [OpenAI Platform](https://platform.openai.com/api-keys) sitesine gidin
2. Hesap oluşturun veya giriş yapın
3. "Create new secret key" butonuna tıklayın
4. Key'i kopyalayın (örn: `sk-proj-xxxxxxxxxxxx`)

> **Not:** OpenAI hesabınızda kredi olması gerekiyor. İlk kayıtta $5 ücretsiz kredi veriliyor.

### 2. Yerel Test İçin (.env.local)

Proje kök dizininde `.env.local` dosyası oluşturun:

\`\`\`bash
# .env.local
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxx
\`\`\`

Sonra dev server'ı başlatın:

\`\`\`bash
pnpm dev
\`\`\`

Tarayıcıda http://localhost:3000 açın ve sağ alt köşedeki chat balonuna tıklayın!

### 3. Vercel Deployment İçin

1. Vercel Dashboard'a gidin: https://vercel.com
2. Projenizi seçin
3. **Settings** → **Environment Variables**
4. Yeni variable ekleyin:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Environment:** Production, Preview, Development (hepsini seçin)
5. **Save** butonuna tıklayın
6. **Redeploy** yapın (Deployments sekmesinden son deployment'ın yanındaki "..." menüsünden "Redeploy")

## 🎯 Özellikler

- ✅ **Gerçek Zamanlı Streaming:** Yanıtlar cümle cümle gelir
- ✅ **Akıllı Bot:** MenumGo sistemi hakkında her şeyi biliyor
- ✅ **Güvenli:** API key'ler server-side'da, asla client'a açık değil
- ✅ **Mobil Uyumlu:** Tüm cihazlarda mükemmel çalışır
- ✅ **Modern UI:** Şık ve kullanıcı dostu tasarım

## 💰 Maliyet

- **GPT-4o-mini kullanıyor** (en uygun model)
- Ortalama sohbet maliyeti: ~$0.0002 (20 kuruşun altı!)
- 1,000 sohbet/ay ≈ $0.20
- 10,000 sohbet/ay ≈ $2

## 🎨 Özelleştirme

### Bot'un Bilgisini Değiştirmek

`app/api/chat/route.ts` dosyasını açın ve `systemPrompt` değişkenini düzenleyin.

### Renkleri Değiştirmek

`components/support-chat-button.tsx` ve `components/support-chat-widget.tsx` dosyalarındaki Tailwind sınıflarını düzenleyin.

## 🐛 Sorun Giderme

### Chat açılmıyor?

1. Browser console'da hata var mı kontrol edin (F12)
2. `.env.local` dosyası oluşturdunuz mu?
3. `OPENAI_API_KEY` doğru mu?

### "401 Unauthorized" hatası?

OpenAI API key'iniz geçersiz veya kredisi bitmiş olabilir.

### Yanıt gelmiyor?

1. OpenAI hesabınızda kredi var mı kontrol edin
2. Rate limit'e takılmış olabilirsiniz (çok fazla istek)

## 📖 Detaylı Dokümantasyon

Daha fazla bilgi için: `docs/AI_CHAT_SETUP.md`

## 🎉 Başarıyla Tamamlandı!

Artık landing page'inizde tam fonksiyonel bir AI destek chat'i var!

**Sıradaki adımlar:**
- ✅ OpenAI API key alın
- ✅ `.env.local` oluşturun
- ✅ `pnpm dev` ile test edin
- ✅ Vercel'e environment variable ekleyin
- ✅ Deploy edin ve müşterileriniz kullanmaya başlasın!

---

**Sorularınız mı var?** `docs/AI_CHAT_SETUP.md` dosyasına bakın veya bana sorun! 🚀
