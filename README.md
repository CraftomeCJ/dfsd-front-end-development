# Aegis Lite

## Project Overview

Aegis Lite is a beginner-friendly investment dashboard prototype built for a Front-End Development module assignment. It demonstrates how to search demo stock symbols, save a watchlist, run a simple educational signal, and calculate a basic portfolio allocation using only HTML, Tailwind CSS, vanilla JavaScript, DOM manipulation, ES6 syntax, `fetch()`, `localStorage`, and a Vercel serverless API route.

## Target Audience

This project is designed for students who are learning front-end fundamentals and want a simple, believable investment dashboard example without using a complex framework or real trading tools.

## Features

- Hero section with project introduction and quick links
- Dashboard summary cards
- Quote search with loading, success, and error states
- Watchlist add and remove actions
# Aegis Lite

## Project Overview

Aegis Lite is a Year 1 Front-End Development assignment that simulates a lightweight investment dashboard. It uses HTML, Tailwind CSS, vanilla JavaScript, localStorage, and a Vercel serverless API to let students search quotes, manage a watchlist, and try a simple allocation calculator.

## Live Links

- Figma prototype: https://www.figma.com/design/fLDlfsIQvHLnYSNJLJrSe4/Aegis-Lite-FED-Prototype?node-id=1-392&t=jzDlH5Z1cL5Um8PN-0
- GitHub repository: https://github.com/CraftomeCJ/dfsd-front-end-development
- GitHub Pages: https://craftomecj.github.io/dfsd-front-end-development/
- Vercel live app: https://dfsd-front-end-development.vercel.app/
- API test link: https://dfsd-front-end-development.vercel.app/api/quote?symbol=AAPL

## API Integration

The frontend calls the Vercel route at `/api/quote?symbol=AAPL` on the live app, and GitHub Pages traffic is routed to the same Vercel API base URL. The route validates the symbol, reads `FINNHUB_API_KEY` from the environment, fetches Finnhub quote and profile data, and returns normalized JSON with `source: "Finnhub live API"`.

## Setup

1. Open the project in VS Code.
2. Add `FINNHUB_API_KEY` in Vercel project settings.
3. Deploy the repo to Vercel.
4. Publish the static frontend to GitHub Pages.

## Notes

- Symbols support the allowlist pattern `/^[A-Z0-9.-]{1,10}$/`.
- Offline fallback data is used only when the live API is unavailable.
- Do not commit a real API key.
- GitHub Pages for static hosting