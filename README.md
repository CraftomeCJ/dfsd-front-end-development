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

## Source Code Management Pitch

This repo is intended to show iterative development rather than one large drop. A good batch history for the assignment is:

1. `chore: initialise aegis lite project`
2. `feat: build responsive dashboard layout`
3. `feat: add persistent watchlist`
4. `feat: add quote api integration`
5. `feat: add signal and portfolio tools`
6. `chore: polish accessibility and testing documentation`
7. `docs: add deployment and submission notes`

That style of history supports the Source Code Management Pitch marks because it shows planning, feature delivery, and documentation in separate commits.

## Figma Prototype Link

https://www.figma.com/design/fLDlfsIQvHLnYSNJLJrSe4/Aegis-Lite-FED-Prototype?node-id=1-392&t=jzDlH5Z1cL5Um8PN-0

## Deployment Links

- GitHub Pages: https://github.com/CraftomeCJ/dfsd-front-end-development/tree/main#
- Vercel live link: https://vercel.com/new/aegis21/success?auto-redirect=true&developer-id=&external-id=&redirect-url=&branch=main&deploymentUrl=dfsd-front-end-development-ps9husy9x-aegis21.vercel.app&projectName=dfsd-front-end-development&s=https%3A%2F%2Fgithub.com%2FCraftomeCJ%2Fdfsd-front-end-development&gitOrgLimit=&hasTrialAvailable=1&totalProjects=1&flow-id=yltWK5Q5TZppJBhEbvFUz&teamSlug=aegis21

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

## Submission Workflow

1. Keep the Figma, GitHub Pages, and Vercel fields as placeholders until the live links are confirmed.
2. Verify the app is live on Vercel first, then update the README with the real serverless URL.
3. Verify the static site on GitHub Pages next, then update the README with the real Pages URL.
4. After both links are live, make one final documentation commit so the submission proof matches the deployed app.

## Credits

- Built as a Front-End Development module assignment
- Tailwind CSS for the utility-first styling approach
- Vercel for the serverless API route
- GitHub Pages for static hosting