# 🐍 Viper VCF — Contact Collection SaaS

> Create VCF sessions, collect contacts from anyone via a public link, and export a `.vcf` file instantly.

---

## 📁 Project Structure

```
vcf-platform/
├── database/
│   └── schema.sql              # Full Supabase PostgreSQL schema + RLS policies
├── public/
│   └── favicon.svg
├── src/
│   ├── config/
│   │   └── supabase.js         # Supabase client (PKCE auth flow)
│   ├── context/
│   │   ├── AuthContext.jsx     # Global auth state
│   │   └── ToastContext.jsx    # Toast notification system
│   ├── hooks/
│   │   ├── useSessions.js      # Session CRUD operations
│   │   └── useContacts.js      # Contact CRUD + public submission
│   ├── lib/
│   │   ├── sanitize.js         # XSS / injection prevention
│   │   ├── validators.js       # Input validation (email, phone, URL…)
│   │   ├── vcf.js              # RFC 6350 VCard generator + download
│   │   └── utils.js            # Dates, clipboard, rate limiter
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── ViperLogo.jsx   # Cobra snake SVG logo
│   │   ├── layout/
│   │   │   ├── Navbar.jsx      # Public top nav
│   │   │   └── DashboardLayout.jsx  # Sidebar layout
│   │   └── shared/
│   │       ├── ProtectedRoute.jsx
│   │       └── SessionCard.jsx
│   ├── pages/
│   │   ├── Landing.jsx         # Marketing homepage
│   │   ├── auth/
│   │   │   ├── Register.jsx    # Sign up page
│   │   │   └── Login.jsx       # Sign in page
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx   # Session list + stats
│   │   │   ├── CreateSession.jsx
│   │   │   └── SessionResults.jsx  # Contacts table + VCF download
│   │   └── public/
│   │       └── SessionSubmit.jsx   # Public contact form (no login needed)
│   ├── styles/
│   │   └── globals.css         # Design system (Viper dark purple theme)
│   ├── App.jsx                 # Routes
│   └── main.jsx                # Entry point
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd vcf-platform
npm install
```

### 2. Set Up Supabase
1. Go to [supabase.com](https://supabase.com) → Create a new project
2. Go to **SQL Editor** → paste and run `database/schema.sql`
3. Go to **Authentication → Providers** → enable **Email** and optionally **Google**
4. Get your keys from **Settings → API**

### 3. Configure Environment
```bash
cp .env.example .env
```
Edit `.env`:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_APP_URL=http://localhost:3000
VITE_MAX_CONTACTS_PER_SESSION=500
VITE_SUBMISSION_COOLDOWN=30
```

### 4. Run
```bash
npm run dev
```
App runs at `http://localhost:3000`

---

## 🔐 Security

| Layer | What it does |
|-------|-------------|
| **Supabase RLS** | Row-Level Security on all tables — users can only touch their own data |
| **DB check constraints** | Phone regex, URL format, title length enforced at database level |
| **Input sanitization** | `src/lib/sanitize.js` strips HTML/XSS before every DB write |
| **Input validation** | `src/lib/validators.js` validates email, password, phone, URLs client-side |
| **PKCE auth flow** | Prevents CSRF on OAuth redirects |
| **Rate limiting** | `sessionStorage`-based cooldown prevents rapid-fire submissions |
| **Duplicate prevention** | Unique constraint on `(session_code, phone)` — one phone per session |
| **Expiry enforcement** | Both client-side check AND database-level `INSERT` policy block expired submissions |
| **Session cap** | `VITE_MAX_CONTACTS_PER_SESSION` limits contacts per session |

---

## 🗃️ Database Schema

### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | FK → auth.users |
| full_name | TEXT | 2–100 chars |
| email | TEXT | unique, validated |
| created_at | TIMESTAMPTZ | |

### `sessions`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users |
| title | TEXT | 3–120 chars |
| description | TEXT | optional, max 500 |
| session_code | TEXT | unique, alphanumeric |
| whatsapp_link | TEXT | optional, https only |
| telegram_link | TEXT | optional, https only |
| expiry_date | TIMESTAMPTZ | must be future |
| is_active | BOOLEAN | auto-false on expiry |
| created_at | TIMESTAMPTZ | |

### `contacts`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| session_code | TEXT | FK → sessions |
| name | TEXT | 1–100 chars |
| phone | TEXT | validated format |
| created_at | TIMESTAMPTZ | |

---

## 📇 VCF Export

Generated as **RFC 6350 vCard 3.0** — importable by:
- iPhone Contacts
- Android Contacts
- Google Contacts
- WhatsApp
- Any standard contacts app

Each contact becomes one `BEGIN:VCARD…END:VCARD` block.

---

## 🌐 Public Session Flow

```
Owner creates session ──► Gets link: https://yourdomain.com/s/SESSIONCODE
          │
          ▼
Share link (WhatsApp, Telegram, social, QR code…)
          │
          ▼
Visitor opens link ──► Fills name + phone ──► Submits
          │
          ▼
Contact saved in Supabase
          │
          ▼
Visitor redirected to WhatsApp/Telegram group (if set)
          │
          ▼
Session expires ──► Owner downloads .vcf file ──► Imports to phone
```

---

## 🎨 Design

- **Brand:** Viper VCF — Purple cobra snake mascot
- **Background:** Pure `#000000` black
- **Accent:** Purple gradient `#7c3aed → #a855f7`
- **Typography:** Outfit (headings) + Inter (body)
- **Glass cards:** `rgba(12,4,24,0.92)` with purple border glow
- **Mobile-first:** fully responsive

---

## 📦 Build for Production

```bash
npm run build
# Output: dist/
```

Deploy to **Vercel**, **Netlify**, or any static host.

Add your production URL to:
1. `.env` → `VITE_APP_URL`
2. Supabase Dashboard → **Authentication → URL Configuration** → Site URL + Redirect URLs

---

## 🤝 License

MIT — build your business freely.
