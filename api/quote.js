const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const CACHE_SECONDS = 60;
const symbolPattern = /^[A-Z0-9.-]{1,10}$/;

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function normalizeSymbol(rawSymbol) {
  const symbol = String(rawSymbol || "").trim().toUpperCase();

  if (!symbolPattern.test(symbol)) {
    throw new Error("Invalid symbol. Use 1 to 10 letters, numbers, dots, or hyphens only.");
  }

  return symbol;
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Finnhub request failed with HTTP ${response.status}`);
  }

  return response.json();
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method !== "GET") {
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    return res.status(405).json({
      error: "Method not allowed. Use GET only."
    });
  }

  let symbol;

  try {
    symbol = normalizeSymbol(req.query.symbol);
  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }

  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "FINNHUB_API_KEY is not configured in Vercel Environment Variables."
    });
  }

  try {
    const quoteUrl = `${FINNHUB_BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&token=${encodeURIComponent(apiKey)}`;
    const profileUrl = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${encodeURIComponent(apiKey)}`;

    const [quoteData, profileData] = await Promise.all([
      fetchJson(quoteUrl),
      fetchJson(profileUrl).catch(() => ({}))
    ]);

    if (!quoteData || typeof quoteData.c !== "number" || quoteData.c <= 0) {
      return res.status(404).json({
        error: `No live quote found for ${symbol}.`
      });
    }

    const previousClose =
      typeof quoteData.pc === "number" && quoteData.pc > 0
        ? quoteData.pc
        : quoteData.c;

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      `s-maxage=${CACHE_SECONDS}, stale-while-revalidate=300`
    );

    return res.status(200).json({
      symbol,
      name: profileData.name || profileData.ticker || symbol,
      price: quoteData.c,
      previousClose,
      high: quoteData.h,
      low: quoteData.l,
      open: quoteData.o,
      timestamp: quoteData.t,
      source: "Finnhub live API"
    });
  } catch (error) {
    return res.status(502).json({
      error: "Unable to retrieve live quote from Finnhub.",
      details: error.message
    });
  }
};