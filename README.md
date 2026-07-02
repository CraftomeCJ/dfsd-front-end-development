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
- Watchlist persistence with `localStorage`
- Simple strategy signal demo based on price change percentage
- Portfolio allocation calculator
- Dark and light mode saved in `localStorage`
- About and disclaimer section

## Technologies Used

- HTML5
- Tailwind CSS via CDN
- Vanilla JavaScript
- ES6 syntax
- `fetch()`
- `localStorage`
- Vercel serverless functions
- GitHub Pages for static deployment

## API Explanation

The app calls `/api/quote?symbol=AAPL` from the client. The serverless function in `api/quote.js` returns demo quote data for these symbols:

- AAPL
- MSFT
- TSLA
- NVDA
- SPY
- QQQ

If a symbol is not recognized, the API returns safe fallback demo data instead of failing. No API keys are used, and the route is meant only for educational demo data.

## User Stories

1. As a student, I want to search a stock symbol so I can see demo quote data.
2. As a student, I want to add symbols to a watchlist so I can save favorites.
3. As a student, I want my watchlist to stay after refresh so I do not lose my data.
4. As a student, I want to remove symbols from the watchlist so I can keep it tidy.
5. As a student, I want to see a simple signal so I can learn how percentage changes affect decisions.
6. As a student, I want to calculate portfolio allocation so I can practice splitting percentages.
7. As a student, I want to switch between dark and light mode so the dashboard is easier to read.

## Figma Prototype Link

Placeholder: https://www.figma.com/file/your-prototype-link-here

## Deployment Links

- GitHub Pages: https://your-username.github.io/your-repo-name/
- Vercel live link: https://your-project-name.vercel.app/

## Testing Plan

| Test Area | What To Check | Expected Result |
| --- | --- | --- |
| Quote search | Search AAPL, MSFT, TSLA, NVDA, SPY, and QQQ | Quote panel updates with demo data |
| Unknown symbol | Search a symbol not in the demo list | Safe fallback demo data appears |
| Loading state | Start a quote search | Loading message appears before results |
| Watchlist add | Add a symbol from the quote panel | Symbol appears in the watchlist and saves to localStorage |
| Watchlist remove | Remove a symbol from the watchlist | Symbol disappears from the list |
| Refresh behavior | Reload the page | Watchlist and theme settings return from localStorage |
| Signal demo | Change the threshold slider | Signal label updates based on price change percentage |
| Allocation calculator | Enter three percentages | Total updates to 100% |
| Theme toggle | Switch between dark and light mode | Theme preference persists after refresh |

## Known Limitations

- Quote data is demo-only and not connected to a live market feed.
- The signal logic is educational and oversimplified.
- The allocation calculator only demonstrates percentages and does not manage real investments.
- GitHub Pages can host the static site, but the Vercel API route is needed for the quote endpoint.

## Future Improvements

- Add charts for quote history
- Add more demo symbols
- Improve allocation feedback with color bars
- Expand the watchlist with notes or tags
- Add a small portfolio summary using the saved symbols

## Credits

- Built as a Front-End Development module assignment
- Tailwind CSS for the utility-first styling approach
- Vercel for the serverless API route
- GitHub Pages for static hosting