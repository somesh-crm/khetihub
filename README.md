# KhetiHub - Mobile-First Tractor Portal

A complete full-stack Tractor Gyan-style portal for Indian farmers: search and compare tractors, calculate EMI, buy/sell used tractors, and find implements and dealers.

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + React Router + Zustand (compare basket)
- **Backend**: Express + better-sqlite3 (SQLite)
- **Design**: Mobile-first, matching tractorgyan.com - dark-green fixed header with rounded bottom, hamburger slide-in drawer, search pill (no bottom nav)

## Project Structure

```
backend/
  index.js          # Express server: REST API + admin CRM endpoints + SVG image generator
  db.js             # SQLite schema
  seed.js           # Database seeding
  img.js            # SVG placeholder image generator (self-contained, no external images)
  data/seed-data.js # Realistic Indian tractor/brand/implement/news data
frontend/
  src/
    pages/          # Home, Brands, Tractors, TractorDetail, Compare, EMI, Used, Sell,
                    # Implements, Dealers, News, Videos, Admin (CRM)
    components/     # Layout (header/drawer/search/footer), Cards, Icons
    store/          # Zustand compare store (max 3 tractors, persisted)
    lib/            # API client, constants, hooks
```

## Quick Start

```bash
# Install all dependencies
npm run install:all

# Seed the SQLite database
npm run seed

# Start both servers (backend :3001, frontend :5173)
npm run dev
```

Or simply run `./start.sh`.

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- Vite proxies `/api` and `/img` to the backend (no CORS issues)

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero search, brands, HP/fuel/budget filters, popular/latest/mini tractors, used, compare widget, EMI, implements, videos, news |
| Brands | `/brands`, `/brand/:slug` | All brands grid + per-brand models |
| Tractor listing | `/tractors` | Filter by HP range, budget, fuel, drive, search |
| Tractor detail | `/tractor/:slug` | Specs table, features, related models, dealer enquiry |
| Compare | `/compare` | Side-by-side spec comparison (max 3) |
| EMI | `/emi` | Interactive EMI calculator with sliders |
| Used tractors | `/used`, `/used/:id` | Second-hand listings + contact seller |
| Sell | `/sell` | Sell tractor/implement form (creates admin CRM request) |
| Implements | `/implements`, `/implements/:slug` | Categories + implement detail |
| Dealers | `/dealers` | Dealer locator by state/city/brand |
| News | `/news`, `/news/:slug` | Tractor industry news |
| Videos | `/videos` | Video gallery |
| Admin | `/admin` | CRM dashboard: manage brands/tractors/products, sell requests, leads |

## API Overview

Public: `GET /api/brands`, `/api/brands/:slug`, `/api/tractors` (filters), `/api/tractors/:slug`, `/api/implements`, `/api/used`, `/api/news`, `/api/videos`, `/api/dealers`, `/api/states`, `GET /api/emi`, `POST /api/sell-requests`, `POST /api/leads`

Admin CRM: `GET /api/admin/dashboard`, CRUD on `/api/admin/{brands,tractors,implements,used_listings,news,videos,dealers}`, sell-request status workflow (`/api/admin/sell-requests`), leads management.

Images: dynamically generated SVG placeholders at `/img/...` - the app is fully self-contained with no external image dependencies.

## Notes

- Prices are indicative demo data for development purposes.
- The admin panel is demo (no auth) - add authentication before production use.
