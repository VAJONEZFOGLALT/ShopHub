# Environment Configuration Guide

## Files Overview

### Local Development

- **`.env`** (both frontend & backend)
  - Tracked in git (can be empty)
  - Used for local development defaults
  - Frontend: `VITE_API_URL=http://localhost:3000`
  - Backend: Empty (uses defaults)

- **`.env.example`** (both frontend & backend)
  - NOT tracked (in .gitignore)
  - Template showing all available configuration keys
  - Copy to `.env` and fill in your values for local development

### Production (Vercel)

- **`.env.vercel.local`** (both frontend & backend)
  - NOT tracked (in .gitignore)
  - Contains all production secrets and API keys
  - Manually import values into Vercel dashboard environment variables
  - **DO NOT commit** - use for manual Vercel setup only

## Setup Instructions

### Local Development

1. Create `.env` files from templates:
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

2. Fill in any custom values for your local setup

3. To get secrets for local testing, reference `.env.vercel.local` but **don't commit it**

### Production (Vercel)

1. Backend project (`project-six-rho-32`):
   - Go to Settings → Environment Variables
   - Copy each key-value pair from `backend/.env.vercel.local`
   - OR import the file directly if Vercel supports it

2. Frontend project (`webshopfrontend`):
   - Go to Settings → Environment Variables
   - Copy each key-value pair from `frontend/.env.vercel.local`

3. After adding environment variables, **redeploy** both projects

## Required Keys

### Backend
- `DATABASE_URL` - TiDB Cloud connection string
- `OPENAI_API_KEY` - For GPT-powered translations
- `JWT_SECRET` - For auth token signing
- `CLOUDINARY_*` - For image uploads
- `FRONTEND_URL` - CORS origin

### Frontend
- `VITE_API_URL` - Backend API URL

## Security Notes

- `.env` is tracked (empty/safe)
- `.env.example` is NOT tracked (template only)
- `.env.vercel.local` is NOT tracked (contains secrets)
- All actual secrets live in Vercel environment variables
- No secrets are committed to GitHub
