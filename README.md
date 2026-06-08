# HELIX — Deployment Guide

## File Structure
Place your files exactly like this:

```
helix/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── api/
│   └── chat.js
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
│       ├── icon-72.png
│       ├── icon-96.png
│       ├── icon-128.png
│       ├── icon-144.png
│       ├── icon-152.png
│       ├── icon-192.png
│       ├── icon-384.png
│       └── icon-512.png
└── src/
    ├── App.jsx
    └── main.jsx
```

---

## OPTION A — Deploy via GitHub + Vercel (No coding required)

### Step 1 — Create GitHub Repo
1. Go to **github.com** → sign up/log in
2. Click **New Repository** (green button top right)
3. Name it `helix`, keep it **Public**, click **Create**
4. Click **uploading an existing file**
5. Drag and drop ALL your files — maintain the folder structure
6. Click **Commit changes**

### Step 2 — Deploy on Vercel
1. Go to **vercel.com** → sign up with your GitHub account
2. Click **Add New Project**
3. Select your `helix` repository → click **Import**
4. Under **Build & Output Settings**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy** — wait ~60 seconds for your live URL

### Step 3 — Add API Key (enables AI chat)
1. In Vercel → your project → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from console.anthropic.com
   - Check all 3 boxes: Production, Preview, Development
3. Click **Save**
4. Go to **Deployments** → click `...` on latest → **Redeploy**

✅ Your app is live. Open the URL on any phone and install via browser.

---

## OPTION B — Run Locally First

### Prerequisites
- Install **Node.js** from nodejs.org (click the green LTS button)
- Install **Vercel CLI**: open Terminal and run `npm install -g vercel`

### Steps
```bash
# Navigate to your helix folder
cd Desktop/helix

# Install dependencies
npm install

# Run locally WITH AI chat working
vercel dev
# → Opens at http://localhost:3000

# OR run without AI chat (no API key needed)
npm run dev
# → Opens at http://localhost:5173
```

### Deploy when ready
```bash
vercel
# Follow the prompts — it deploys and gives you a live URL
```

Then add your ANTHROPIC_API_KEY in Vercel dashboard as described above.

---

## Getting Your Anthropic API Key
1. Go to **console.anthropic.com**
2. Sign up / log in (free)
3. Click **API Keys** in the left sidebar
4. Click **Create Key** → name it `helix`
5. **Copy it immediately** — shown only once
6. Paste it into Vercel Environment Variables

Cost: ~$0.01–0.03 per AI conversation. Set a spending limit in Billing.

---

## Installing as PWA on Phone

**Android (Chrome):**
- Open your Vercel URL in Chrome
- Tap the three-dot menu → **Add to Home Screen**
- HELIX appears as a full app icon

**iPhone (Safari):**
- Open your Vercel URL in Safari
- Tap the **Share** button (box with arrow)
- Tap **Add to Home Screen**
- HELIX appears on your home screen

---

## Troubleshooting

| Problem | Fix |
|---|---|
| 404 NOT_FOUND after deploy | In Vercel Settings → Build, set Framework to Vite, Output to `dist` |
| AI chat not working | Make sure ANTHROPIC_API_KEY is set in Vercel Environment Variables, then Redeploy |
| Files in wrong place | index.html and package.json must be at the ROOT of your repo, not inside a subfolder |
| White screen | Open browser DevTools (F12) → Console tab to see the error |
