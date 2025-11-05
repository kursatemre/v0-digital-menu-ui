# Email Verification Setup with Resend.com

This guide explains how to set up email verification for Menumgo using Resend.com and Supabase Auth.

## Prerequisites

- Supabase project (already set up)
- Domain name (for production emails)
- Resend.com account (free tier available)

## Step 1: Create Resend.com Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

## Step 2: Configure Domain (Production)

For production, you need to verify your domain:

1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `menumgo.digital`)
4. Add the provided DNS records to your domain registrar:
   - SPF record (TXT)
   - DKIM records (TXT)
   - DMARC record (TXT)
5. Wait for DNS verification (usually 5-30 minutes)

### For Development/Testing

Resend provides a test domain `onboarding@resend.dev` that you can use immediately without domain verification.

## Step 3: Get SMTP Credentials

1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Name it "Supabase SMTP" and select **Sending access**
4. Copy the API key (starts with `re_`)

### SMTP Settings:
- **Host**: `smtp.resend.com`
- **Port**: `465` (SSL) or `587` (TLS)
- **Username**: `resend`
- **Password**: Your API key (the one you just copied)

## Step 4: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Scroll down to **SMTP Settings**
4. Enable **Enable Custom SMTP**
5. Enter the following:
   - **Host**: `smtp.resend.com`
   - **Port Number**: `587`
   - **Username**: `resend`
   - **Password**: Your Resend API key
   - **Sender email**: `noreply@menumgo.digital` (or your domain)
   - **Sender name**: `Menumgo`

6. Click **Save**

## Step 5: Customize Email Templates

In Supabase, go to **Authentication** → **Email Templates** and customize:

### Confirm Signup Template

Subject: `Menumgo E-posta Doğrulama`

Body:
```html
<h2>Menumgo'ya Hoş Geldiniz!</h2>

<p>Merhaba,</p>

<p>Menumgo hesabınızı oluşturduğunuz için teşekkür ederiz. Hesabınızı aktifleştirmek için aşağıdaki butona tıklayın:</p>

<a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
  E-postamı Onayla
</a>

<p>Veya bu linki kopyalayıp tarayıcınıza yapıştırın:</p>
<p>{{ .ConfirmationURL }}</p>

<p><strong>Bu doğrulamadan sonra 3 günlük ücretsiz deneme süreniz başlayacak!</strong></p>

<p>Bu e-postayı siz istemediyseniz, güvenle silebilirsiniz.</p>

<p>İyi günler,<br>Menumgo Ekibi</p>
```

## Step 6: Test Email Verification

1. Go to your app's registration page
2. Sign up with a real email address
3. Check your inbox for the verification email
4. Click the verification link
5. Verify that:
   - You're redirected to the admin panel
   - Your tenant is activated (`is_active = true`)
   - Trial end date is set to 3 days from now

## Troubleshooting

### Email Not Received

1. **Check spam folder**: Verification emails might be in spam
2. **Check Resend logs**: Go to Resend dashboard → **Logs** to see if email was sent
3. **Verify domain**: Make sure your domain is verified in Resend
4. **Check Supabase logs**: Go to Supabase → **Logs** → **Auth Logs**

### "Invalid credentials" Error

- Double-check your Resend API key
- Make sure you're using `resend` as username
- Verify port number (587 for TLS)

### Email Sent but Link Not Working

1. Check that `emailRedirectTo` in register page matches your domain
2. Verify Site URL in Supabase: **Authentication** → **URL Configuration**
3. Add your domain to **Redirect URLs** list

## Email Limits

### Resend.com Free Tier:
- 100 emails/day
- 3,000 emails/month
- Perfect for testing and small deployments

### Paid Plans:
- Pro: $20/month - 50,000 emails/month
- Scale: Custom pricing for higher volumes

## Production Checklist

- [ ] Domain verified in Resend
- [ ] DNS records added and verified
- [ ] SMTP configured in Supabase
- [ ] Email templates customized
- [ ] Site URL set correctly in Supabase
- [ ] Redirect URLs configured
- [ ] Test email verification flow
- [ ] Monitor email delivery rates

## Alternative SMTP Providers

If you prefer not to use Resend, here are alternatives:

### SendGrid
- Free tier: 100 emails/day
- SMTP: `smtp.sendgrid.net:587`
- Good deliverability

### Mailgun
- Free tier: 5,000 emails/month (first 3 months)
- SMTP: `smtp.mailgun.org:587`
- Good for transactional emails

### Amazon SES
- Very cheap: $0.10 per 1,000 emails
- SMTP: `email-smtp.region.amazonaws.com:587`
- Requires AWS account

## Support

For issues with email setup:
1. Check Supabase docs: https://supabase.com/docs/guides/auth/auth-smtp
2. Check Resend docs: https://resend.com/docs
3. Contact support: support@menumgo.digital
