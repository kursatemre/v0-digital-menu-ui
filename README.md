# 🍽️ Digital Menu UI

A modern, multi-tenant digital menu system for restaurants, cafes, and takeaway businesses. Built with Next.js 16, React 19, and Supabase.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/bilgeeroglan-3234s-projects/v0-digital-menu-ui)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/ixdf10VnBdp)

## 🚀 Features

### Core Functionality
- **Multi-tenant Architecture** - Support for multiple restaurants/tenants
- **QR Code Menus** - Generate QR codes for contactless menu access
- **Real-time Orders** - Live order management system
- **Waiter Call System** - Customers can request service from their table
- **Shopping Cart** - Add items, customize orders, and checkout
- **Customer Feedback** - Built-in feedback system for comments, suggestions, and complaints

### Product Features
- **Product Variants** - Size options (Small, Medium, Large, etc.)
- **Customization Options** - Dynamic customization groups (milk type, sugar level, extras)
- **Product Images** - Visual menu with product photos
- **Multi-language Support** - Turkish and English translations
- **Badge System** - Highlight special items (New, Popular, etc.)

### 🎨 Three Premium Themes

#### 1. Modern Theme (Default)
- Clean, contemporary design
- Card-based layout
- Optimized for dine-in restaurants
- Full-featured shopping cart and order system

#### 2. Classic Elegance
- Luxury restaurant aesthetic
- Gold accent colors (#D4AF37)
- Playfair Display typography
- Decorative ornamental elements
- Portrait-style category images
- Perfect for fine dining establishments

#### 3. Modern Takeaway (NEW! ✨)
- **Premium minimalist design**
- **Background hero image with overlay**
- **Emerald green accent color (#4CAF50)**
- **Single-line product layout with pill-style buttons**
- **Sticky footer with cart summary**
- **Optimized for quick-service and takeaway**
- Clean, compact interface for fast ordering

### Admin Panel
- **Order Management** - View and manage incoming orders
- **Waiter Call Management** - Respond to customer service requests
- **Feedback Management** - Review and respond to customer feedback
- **Status Updates** - Mark orders as pending, in progress, or completed
- **Real-time Updates** - Auto-refresh every 5 seconds
- **Statistics Dashboard** - Track new orders, active calls, and feedback

## 🛠️ Tech Stack

- **Framework:** Next.js 16.0.0
- **UI Library:** React 19.2.0
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **Deployment:** Vercel

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/kursatemre/v0-digital-menu-ui.git
cd v0-digital-menu-ui
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Environment Variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Database Setup**

Run the migrations in the `supabase/migrations` folder:
- `20240101_initial_schema.sql` - Core tables
- `20251126_create_feedback_table.sql` - Feedback system

5. **Run Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
v0-digital-menu-ui/
├── app/
│   ├── [slug]/              # Dynamic tenant routes
│   │   ├── page.tsx         # Main menu page (Modern theme)
│   │   └── admin/           # Admin panel
│   └── api/
│       └── feedback/        # Feedback API endpoints
├── components/
│   ├── themes/
│   │   ├── modern-takeaway/ # Modern Takeaway theme ✨
│   │   └── classic-elegance/# Classic Elegance theme
│   ├── feedback-button.tsx  # Feedback button component
│   └── feedback-modal.tsx   # Feedback form modal
├── contexts/
│   └── language-context.tsx # i18n context
├── lib/
│   └── supabase/           # Supabase client
└── supabase/
    └── migrations/         # Database migrations
```

## 🎯 Usage

### Accessing a Menu
Navigate to: `https://your-domain.com/[restaurant-slug]`

### Admin Panel
Navigate to: `https://your-domain.com/[restaurant-slug]/admin`

### Available Routes
- `/[slug]` - Customer menu view
- `/[slug]/admin` - Admin dashboard
- `/api/feedback` - Feedback API endpoints (GET, POST, PATCH, DELETE)

## 🆕 Recent Updates

### Latest Features (v2.0)
- ✅ **Customer Feedback System** - Comprehensive feedback collection across all themes
- ✅ **Modern Takeaway Theme Redesign** - Premium minimalist style with emerald green accents
- ✅ **Sticky Cart Footer** - Always-visible cart summary for quick checkout
- ✅ **Background Hero Images** - Stunning header visuals with overlay effects
- ✅ **Improved Typography** - Optimized font sizes for better readability
- ✅ **Admin Feedback Management** - Complete feedback review and status tracking

### Theme Updates
- Modern Takeaway: Complete redesign with single-line product layout
- All Themes: Integrated feedback button at bottom of menu
- Classic Elegance: Enhanced gold accents and ornamental details

## 🌐 Multi-language Support

The application supports:
- 🇹🇷 Turkish (Türkçe)
- 🇬🇧 English

Language can be switched via the language selector in the header.

## 📱 Responsive Design

- Fully responsive across all devices
- Mobile-optimized for smartphone QR code scanning
- Tablet-friendly admin interface
- Desktop-optimized for restaurant staff

## 🔐 Security Features

- Row Level Security (RLS) policies on all tables
- Tenant isolation for multi-tenant data
- Secure API endpoints
- Authentication via Supabase Auth

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.

## 🔗 Links

- **Live Demo:** [https://vercel.com/bilgeeroglan-3234s-projects/v0-digital-menu-ui](https://vercel.com/bilgeeroglan-3234s-projects/v0-digital-menu-ui)
- **v0 Chat:** [https://v0.app/chat/ixdf10VnBdp](https://v0.app/chat/ixdf10VnBdp)

---

Made with ❤️ using Next.js, React, and Supabase
