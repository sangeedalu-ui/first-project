# Dress Deal Tracker

A lightweight dress deal tracker for women's clothing from Myntra, Meesho, and Amazon.

## Features

- Track selected women's clothing products
- Filter by budget, size, fabric, and platform
- Deal scoring and status badges
- Price drop and discount alerts
- Responsive static HTML dashboard
- Configurable user preferences
- AI-powered deal analysis
- Cloudflare free tier compatible

## Quick Start

```bash
# Clone and install
git clone <repo-url>
cd dress-deal-tracker
npm install

# Run locally
npm run dev

# Open http://localhost:8788
```

## Project Structure

```
dress-deal-tracker/
├── public/              # Static dashboard (HTML, CSS, JS)
├── src/
│   ├── ai/              # AI analysis (Big Pickle)
│   ├── collectors/      # Product data collection adapters
│   ├── deals/           # Deal scoring and detection
│   ├── filters/         # Preference matching
│   ├── notifications/   # Alert notifications
│   └── storage/         # Data persistence
├── data/                # Configuration and product data
├── tests/               # Test files
├── wrangler.toml        # Cloudflare configuration
└── package.json
```

## Configuration

### User Preferences

Edit `data/preferences.json`:

```json
{
  "budget": { "max": 5000 },
  "sizes": ["S", "M"],
  "fabrics": ["Cotton", "Rayon"],
  "discounts": { "min": 30 }
}
```

### Product Watchlist

Add products to `data/watchlist.json`:

```json
{
  "products": [
    {
      "id": "myntra-001",
      "name": "Cotton Dress",
      "url": "https://myntra.com/...",
      "platform": "Myntra"
    }
  ]
}
```

## Deployment

### Cloudflare Pages (Dashboard only)

```bash
npm run deploy
```

### Cloudflare Workers (Full app with API)

1. Install Wrangler CLI: `npm install -g wrangler`
2. Login: `wrangler login`
3. Deploy: `wrangler deploy`
4. Set secrets: `wrangler secret put TELEGRAM_BOT_TOKEN`

### Cron Schedule

The worker runs deal checks every 6 hours via Cloudflare Cron Triggers.

## Commands

```bash
npm run dev          # Local development
npm run deploy       # Deploy to Cloudflare Pages
npm run collect      # Run product collection
npm run check-deals  # Run deal analysis
npm test             # Run tests
```

## License

MIT
