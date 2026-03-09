# ⚽ Football Higher or Lower

A football stats guessing game with 14 modes and a global leaderboard.

---

## 🚀 How to deploy (step by step)

### STEP 1 — Set up Supabase (free database for the leaderboard)

1. Go to **supabase.com** and create a free account
2. Click **"New Project"** — give it any name, pick any region
3. Once it loads, go to the **SQL Editor** (left sidebar)
4. Paste this and click **Run**:

```sql
create table scores (
  id bigint generated always as identity primary key,
  mode_key text not null,
  player_name text not null,
  score integer not null,
  created_at timestamp with time zone default now()
);

-- Allow anyone to read scores
create policy "Public read" on scores for select using (true);

-- Allow anyone to insert scores  
create policy "Public insert" on scores for insert with check (true);

-- Enable row level security
alter table scores enable row level security;
```

5. Go to **Settings → API** (left sidebar)
6. Copy **Project URL** and **anon public key** — you'll need these in a moment

---

### STEP 2 — Set up GitHub

1. Go to **github.com** and create a free account (if you don't have one)
2. Click the **+** button top right → **New repository**
3. Name it `football-higher-lower`
4. Leave everything else as default, click **Create repository**
5. You'll see a page with upload instructions — click **"uploading an existing file"**
6. Upload **all the files from this folder** (drag and drop the whole folder contents)
7. Click **Commit changes**

---

### STEP 3 — Deploy on Vercel

1. Go to **vercel.com** and sign up with your GitHub account
2. Click **"Add New Project"**
3. Find `football-higher-lower` and click **Import**
4. Before clicking Deploy, click **"Environment Variables"** and add:
   - `VITE_SUPABASE_URL` → paste your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` → paste your Supabase anon key
5. Click **Deploy**
6. Done — you'll get a live URL like `football-higher-lower.vercel.app` ✅

---

### STEP 4 — Custom domain (optional, ~$10/year)

1. Buy a domain at **namecheap.com** (search for something like `footballhol.com`)
2. In Vercel, go to your project → **Settings → Domains**
3. Add your domain and follow the DNS instructions (copy/paste a couple of values)
4. Takes about 10 minutes to go live

---

## 🔧 Running locally (optional)

If you want to test it on your own computer first:

```bash
npm install
cp .env.example .env
# Fill in your Supabase keys in .env
npm run dev
```

Then open http://localhost:5173

---

## 📁 File structure

```
football-higher-lower/
├── index.html          ← HTML entry point
├── package.json        ← Dependencies
├── vite.config.js      ← Build config
├── .env.example        ← Environment variable template
├── .gitignore          ← Tells Git to ignore node_modules etc
└── src/
    ├── main.jsx        ← React entry point
    ├── App.jsx         ← The whole game
    └── supabase.js     ← Leaderboard database connection
```

---

## 💰 Monetisation notes

- Add Google AdSense by dropping their script tag into `index.html`
- For gambling sponsorships (Stake etc.) — add 18+ disclaimer and responsible gambling messaging before going live
- Add a footer with "Unofficial fan game — not affiliated with FIFA or any football organisation"
