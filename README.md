# Design Operations Guide

The authoritative operational reference for the eCommerce site, Customer Portal, and Back Office product cycle — covering all 11 sections, DRAC accountability model, and full tool configuration for Jira, Confluence, and Workfront.

---

## Deploy to Vercel (recommended)

### From GitHub (auto-deploy on every push)

1. Push this repo to GitHub (public or private)
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo
4. Vercel auto-detects Vite — no configuration needed
5. Click **Deploy**

Every push to `main` triggers an automatic redeploy.

### From Vercel CLI

```bash
npm install -g vercel
vercel
```

---

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## Project structure

```
designops-guide/
├── index.html          # HTML entry point
├── vite.config.js      # Vite + React config
├── vercel.json         # Vercel deployment config
├── package.json        # React 18 + Vite 5
├── .gitignore
├── README.md
└── src/
    ├── main.jsx        # React root (mounts App)
    └── App.jsx         # Entire application — all 11 sections
```

---

## Stack

- **React 18** — UI
- **Vite 5** — build tool and dev server  
- **Zero external UI dependencies** — all styles inline, no CSS files, no UI libraries

---

## Editing content

All content, styles, and logic live in `src/App.jsx`. To update a section, find the relevant object in the `SECTIONS` array at the top of the file, edit the data, save, and push. Vercel redeploys automatically.
