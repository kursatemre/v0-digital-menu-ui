# AI Destek Chat Kurulumu

## Genel Bakış

Landing page'de sağ alt köşede bir AI destek chat balonu eklendi. Müşteriler bu balona tıklayarak MenumGo sistemi hakkında sorular sorabilir ve anında cevap alabilir.

## Özellikler

- 🤖 **AI Destekli Chat**: OpenAI GPT-4o-mini ile güçlendirilmiş akıllı sohbet
- 💬 **Streaming Yanıtlar**: Gerçek zamanlı, akıcı mesaj akışı
- 🎨 **Modern UI**: Mobil uyumlu, şık tasarım
- 🔒 **Güvenli**: API key'ler server-side'da, client'a asla açık değil
- 📱 **Responsive**: Tüm cihazlarda mükemmel görünüm

## Kurulum Adımları

### 1. OpenAI API Key Alın

1. [OpenAI Platform](https://platform.openai.com/api-keys)'a gidin
2. Hesap oluşturun veya giriş yapın
3. "Create new secret key" butonuna tıklayın
4. Key'i kopyalayın (bir daha göremezsiniz!)

### 2. Environment Variables Ekleyin

**Yerel geliştirme için:**

`.env.local` dosyası oluşturun:

```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Vercel deployment için:**

1. Vercel Dashboard'a gidin
2. Projenizi seçin
3. Settings → Environment Variables
4. Yeni variable ekleyin:
   - Name: `OPENAI_API_KEY`
   - Value: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Environment: Production, Preview, Development (hepsini seçin)
5. Save

### 3. Test Edin

Yerel olarak test etmek için:

```bash
pnpm dev
```

Tarayıcıda `http://localhost:3000` açın ve sağ alt köşedeki chat balonuna tıklayın.

## Bileşenler

### 1. `components/support-chat-button.tsx`
Sağ alt köşede yüzen chat balonu butonu.

### 2. `components/support-chat-widget.tsx`
Chat penceresi ve mesaj akışı UI'ı. Vercel AI SDK'nın `useChat` hook'unu kullanır.

### 3. `app/api/chat/route.ts`
Server-side API route. OpenAI'a güvenli bağlantı sağlar ve streaming response döner.

## Özelleştirme

### Bot'un Bilgisini Değiştirmek

`app/api/chat/route.ts` dosyasındaki `systemPrompt` değişkenini düzenleyin:

```typescript
const systemPrompt = `Sen MenumGo dijital menü sisteminin müşteri destek asistanısın.
// Buraya bot'un bilmesini istediğiniz detayları ekleyin
`
```

### Model Değiştirmek

Daha güçlü veya daha hızlı model kullanmak için:

```typescript
const result = streamText({
  model: openai("gpt-4o"), // veya "gpt-3.5-turbo", "gpt-4-turbo"
  // ...
})
```

### Tema Renkleri

`components/support-chat-button.tsx` ve `components/support-chat-widget.tsx` dosyalarındaki Tailwind sınıflarını düzenleyin.

## Maliyet Tahmini

OpenAI API ücretleri kullanıma göre değişir:

- **GPT-4o-mini**: ~$0.15 / 1M input tokens, ~$0.60 / 1M output tokens
- Ortalama sohbet: ~500 token (giriş) + ~200 token (çıkış) = ~$0.0002 per chat
- 1000 sohbet/ay ≈ $0.20
- 10,000 sohbet/ay ≈ $2

## Sorun Giderme

### "Cannot find module 'ai/react'" Hatası

```bash
pnpm add ai @ai-sdk/openai
```

### Chat Açılmıyor

1. Browser console'da hata var mı kontrol edin
2. `.env.local` dosyasında `OPENAI_API_KEY` var mı?
3. Vercel'de environment variable eklenmiş mi?

### API Hatası

1. OpenAI API key'iniz geçerli mi?
2. OpenAI hesabınızda kredi var mı?
3. Rate limit'e takılmadınız mı?

## Gelecek İyileştirmeler

- [ ] Chat geçmişini kaydetme (Supabase)
- [ ] Kullanıcı kimlik doğrulama
- [ ] Menü/ürün verilerini chat'e entegre etme (RAG)
- [ ] Çoklu dil desteği
- [ ] Analytics ve raporlama
- [ ] Otomatik e-posta yönlendirme

## Destek

Sorularınız için: destek@menumgo.com
