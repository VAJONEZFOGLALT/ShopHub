# E-Commerce Platform

Full-stack e-commerce application with Hungarian/English translations, product management, cart, checkout, and admin panel.

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- i18next for translations
- React Router

**Backend:**
- NestJS + TypeScript
- Prisma ORM
- MySQL (TiDB Cloud)
- OpenAI GPT-3.5 for translations
- Cloudinary for image uploads

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VAJONEZFOGLALT/project.git
   cd project
   ```

2. **Install and setup everything**
   ```bash
   npm install
   ```
   This automatically:
   - Installs dependencies for both frontend and backend
   - Generates Prisma client
   - Runs database migrations

3. **Start development servers**
   ```bash
   npm run dev
   ```
   This starts both backend (port 3000) and frontend (port 5173) concurrently.

4. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install and setup everything (runs automatically) |
| `npm run dev` | Start both backend and frontend in development mode |
| `npm run dev:backend` | Start only backend server |
| `npm run dev:frontend` | Start only frontend dev server |
| `npm run build` | Build both frontend and backend for production |
| `npm run db:migrate` | Run database migrations |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:seed` | Seed database with sample data |

## Project Structure

```
project/
├── backend/           # NestJS backend
│   ├── prisma/       # Database schema and migrations
│   ├── src/          # Source code
│   └── .env          # Backend environment variables
├── frontend/         # React frontend
│   ├── src/          # Source code
│   └── .env          # Frontend environment variables
└── package.json      # Root package.json for scripts
```

## Environment Variables

The project is pre-configured with `.env` files for local development:

**Backend** (`backend/.env`):
- Database connection to TiDB Cloud (production)
- OpenAI API key for translations
- Cloudinary credentials for image uploads
- JWT secret for authentication

**Frontend** (`frontend/.env`):
- API URL pointing to localhost:3000

## Default Test Accounts

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| alice | alice123 | User |
| bob | bob123 | User |

## Features

- 🛒 Product browsing with categories
- 🌍 Hungarian ↔ English translation (OpenAI-powered)
- 🛍️ Shopping cart
- 💳 Checkout process
- 👤 User authentication & profiles
- ⭐ Product reviews
- ❤️ Wishlist
- 🔍 Product comparison
- 📦 Order management
- 🎛️ Admin panel (users, products, orders)
- 📱 Responsive design

## Translation System

- Backend caches translated products (60s TTL)
- Smart routing: DeepL for HU→EN (fast), OpenAI for quality
- Fallback chain: OpenAI → DeepL → LibreTranslate → MyMemory

## Database

The project uses TiDB Cloud (MySQL-compatible) in production. The local `.env` points to the production database for testing. To use a local MySQL database:

1. Install MySQL locally
2. Update `DATABASE_URL` in `backend/.env`
3. Run `npm run db:setup`

## Deployment

The project is deployed on Vercel:
- Frontend: https://webshopfrontend.vercel.app
- Backend: https://project-six-rho-32.vercel.app

## License

MIT
