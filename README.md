# 🍳 ScanPan — AI-Powered Kitchen Assistant

> Scan receipts, track your pantry, and get AI-generated recipes based on what you have.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-AI-4285F4?logo=google)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📸 **AI Receipt Scanner** | Snap a photo of any grocery receipt — Gemini Vision AI extracts items, cleans up names, estimates expiry dates, and categorizes each item automatically |
| 🧺 **Smart Pantry Tracker** | Full CRUD management of pantry items with color-coded expiry indicators (expired/expiring/fresh), category tagging, and manual add support |
| 👨‍🍳 **AI Recipe Generator** | Get creative, single-click recipe suggestions based on exactly what's in your pantry — powered by Gemini 2.5 Flash |
| 📖 **Personal Cookbook** | Save your favorite AI-generated recipes with full ingredients and Markdown-rendered instructions |
| 🔐 **Secure Authentication** | Email/password auth with bcrypt hashing and JWT sessions via NextAuth.js |
| 📱 **Mobile-First PWA** | Installable as a Progressive Web App with bottom navigation, skeleton loading states, and safe-area support |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 16 (App Router)               │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Pantry   │  │   Scan   │  │ Recipes  │  │ Profile │ │
│  │  (SSR)    │  │ (Client) │  │  (SSR)   │  │  (SSR)  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       │              │              │              │      │
│       ▼              ▼              ▼              ▼      │
│  ┌─────────────────────────────────────────────────────┐ │
│  │           Server Actions & API Routes               │ │
│  │  ┌─────────────┐  ┌───────────────┐  ┌───────────┐ │ │
│  │  │pantry-actions│  │recipe-actions │  │  actions   │ │ │
│  │  └──────┬──────┘  └──────┬────────┘  └─────┬─────┘ │ │
│  └─────────┼────────────────┼─────────────────┼───────┘ │
│            │                │                 │          │
│            ▼                ▼                 ▼          │
│  ┌─────────────────┐  ┌──────────────────────────────┐  │
│  │   PostgreSQL     │  │      Gemini 2.5 Flash API    │  │
│  │  (Users, Pantry, │  │  ┌─────────┐  ┌──────────┐  │  │
│  │   Recipes)       │  │  │ Vision  │  │  Text    │  │  │
│  └─────────────────┘  │  │(Receipt)│  │ (Recipe) │  │  │
│                        │  └─────────┘  └──────────┘  │  │
│                        └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, custom design system with glassmorphism + animations
- **AI/ML**: Google Gemini 2.5 Flash (Vision API for receipt scanning, Text API for recipes)
- **Database**: PostgreSQL with raw SQL queries via `pg`
- **Auth**: NextAuth.js v4 with Credentials provider + bcrypt + JWT
- **Validation**: Zod schema validation
- **Icons**: Lucide React
- **Markdown**: react-markdown with @tailwindcss/typography

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL running locally (or a hosted instance like Supabase)
- Google AI API Key ([Get one here](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/mihir-rathod/scan-pan.git
cd scan-pan

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your credentials (see below)

# Initialize the database
node scripts/init-db.js

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/scan-pan"
GOOGLE_API_KEY="your-gemini-api-key"
AUTH_SECRET="generate-a-random-secret"
```

Generate `AUTH_SECRET` with: `openssl rand -base64 32`

---

## 📂 Project Structure

```
scan-pan/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts       # Gemini Vision receipt analysis
│   │   ├── auth/[...nextauth]/    # NextAuth.js configuration
│   │   └── recipe/route.ts        # Gemini recipe generation
│   ├── pantry/page.tsx            # Pantry management (SSR)
│   ├── scan/page.tsx              # Receipt scanner with review step
│   ├── recipes/page.tsx           # AI recipe suggestions
│   ├── saved/page.tsx             # Personal cookbook
│   ├── profile/page.tsx           # User profile & stats
│   ├── login/page.tsx             # Authentication
│   ├── register/page.tsx          # User registration
│   ├── error.tsx                  # Error boundary
│   ├── not-found.tsx              # Custom 404
│   └── globals.css                # Design system & animations
├── components/
│   ├── BottomNav.tsx              # Glassmorphism navigation bar
│   ├── PantryItem.tsx             # Item card with expiry tracking
│   ├── AddItemButton.tsx          # Manual add with slide-up modal
│   ├── ExpiryBanner.tsx           # Expiry notification banners
│   ├── SavedRecipeCard.tsx        # Collapsible recipe card
│   └── ...
├── lib/
│   ├── db.ts                      # PostgreSQL connection pool
│   ├── pantry-actions.ts          # Server actions for pantry CRUD
│   ├── recipe-actions.ts          # Server actions for recipes
│   └── actions.ts                 # Auth server actions
├── scripts/
│   └── init-db.js                 # Database schema initialization
└── public/
    └── manifest.json              # PWA manifest
```

---

## 📄 License

MIT © Mihir Rathod
