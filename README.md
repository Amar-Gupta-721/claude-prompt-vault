# Claude Prompt Vault — Next.js + MongoDB

A full-stack Next.js 14 conversion of the Claude Prompt Vault, with:
- **MongoDB** for real-time, persistent stats (Prompts, Skill Repos, Copies Made)
- **Admin authentication** (JWT + httpOnly cookies) — only admin can add/edit/delete prompts
- **Pixel-perfect design** matching the original HTML
- All the original features: search, filter by category, prompt modal, copy/download, bookmarks, modals

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/claude-prompt-vault
JWT_SECRET=a-very-long-random-secret-string
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
SETUP_SECRET=another-secret-for-seeding
```

### 3. Seed the database (first time only)
With the dev server running, just open this URL in your browser:

```
http://localhost:3000/api/admin/seed
```

You'll see a JSON response confirming the admin account was created and prompts were seeded. **You can call this again anytime** to reset your admin password — it always syncs from `.env.local`.

### 4. Run development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🔐 Admin Access

- Go to `/admin/login`
- Log in with the credentials from your `.env.local`
- You'll be redirected to `/admin` dashboard

### Admin can:
- ✅ Add new prompts
- ✅ Edit existing prompts
- ✅ Delete prompts
- ✅ View real-time stats (prompts count, skill repos, copies made)

### Public users can:
- ✅ Browse all prompts and skills
- ✅ Search and filter
- ✅ Copy prompts (increments the live counter in MongoDB)
- ✅ Download prompts
- ✅ Bookmark prompts (localStorage)
- ✅ Submit prompt suggestions

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home page (server component)
│   ├── layout.tsx                  # Root layout
│   ├── admin/
│   │   ├── page.tsx                # Admin dashboard (server component)
│   │   └── login/page.tsx          # Admin login
│   └── api/
│       ├── prompts/route.ts        # GET (public), POST (admin)
│       ├── prompts/[id]/route.ts   # PUT/DELETE (admin)
│       ├── skills/route.ts         # GET skills
│       ├── stats/route.ts          # GET stats, POST increment copies
│       ├── auth/
│       │   ├── login/route.ts      # POST login
│       │   ├── logout/route.ts     # POST logout
│       │   └── check/route.ts      # GET auth status
│       └── admin/seed/route.ts     # POST seed DB (one-time setup)
├── components/
│   ├── HomeClient.tsx              # Full interactive homepage
│   ├── PromptModal.tsx
│   ├── SubmitModal.tsx
│   ├── ContactModal.tsx
│   ├── AboutModal.tsx
│   └── AdminDashboardClient.tsx    # Admin UI
├── lib/
│   ├── mongodb.ts                  # MongoDB connection
│   ├── models.ts                   # Mongoose models
│   ├── auth.ts                     # JWT utilities
│   └── seedData.ts                 # Initial data
├── middleware.ts                   # Protects /admin/* routes
└── styles/globals.css              # All styles (exact match to original)
```

---

## 📊 Real-Time Stats

The three stats shown in the hero section are **live from MongoDB**:

| Stat | Source |
|------|--------|
| **Prompts** | `Prompt.countDocuments()` |
| **Skill Repos** | `Skill.countDocuments()` |
| **Copies Made** | `Stats.copiesMade` — incremented via `POST /api/stats` every time a user copies a prompt |

---

## 🌐 Deployment

### Vercel (recommended)
1. Push to GitHub
2. Import into Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Add your connection string to `MONGODB_URI`
3. Whitelist `0.0.0.0/0` (or your server IPs) in Network Access

---

## 🔒 Security Notes

- Admin password is hashed with bcrypt (12 rounds)
- JWT stored in `httpOnly` cookie — not accessible to JavaScript
- All admin API routes verify the token server-side
- Middleware redirects unauthenticated requests from `/admin/*` to `/admin/login`
- `SETUP_SECRET` prevents unauthorized DB seeding

---

## License

MIT
