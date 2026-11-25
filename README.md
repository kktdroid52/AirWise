# AirWise
*Breathe smarter. Make better everyday choices.*

## Problem
Winter smog makes air-quality numbers hard to act on. AirWise answers: **"What should I change about my day because of today's air quality?"**

## Features
- Dashboard: AQI ring, category, PM2.5/PM10, source, time, and a DEMO badge when data is simulated
- Daily planner with reasons, plus an optional family checklist
- Ask AirWise: quick prompts; rule-based "assistant demo mode" unless an AI endpoint is configured
- Indoor air checklist (room, size, ventilation, purifier)
- Sustainable choice tracker with disclosed assumptions (exposure vs. emissions explained)
- Short education section

## Screenshots
_Add screenshots here after running the app._

## Tech stack
React, Vite, TypeScript, Tailwind CSS, Vitest.

## Setup
```bash
npm install
npm run dev      # local development
npm test         # unit tests
npm run build    # type-check + production build
```

## Environment
Copy `.env.example` to `.env`. `VITE_ASSISTANT_ENDPOINT` is optional and should point to **your own server-side** endpoint that holds any AI key. No secrets belong in this frontend.

## Data and demo mode
Live data comes from the free Open-Meteo geocoding and air-quality APIs (modelled estimates, not ground-station readings). If a lookup fails, AirWise shows clearly labelled simulated data.

## Limitations
- No server-side AI endpoint is included; the assistant is rule-based by default.
- No forecast or trend, browser geolocation, or persistence yet.
- Eco figures are rough illustrations. Guidance is general, not medical advice.

## Security and privacy
No keys in code, input sanitised, React escapes output, no accounts, nothing stored.

## Future improvements
Forecast-aware planning, optional geolocation, server AI proxy, UI tests, i18n.

## License
MIT
