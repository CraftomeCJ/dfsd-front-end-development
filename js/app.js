const watchlistKey = "aegis-lite-watchlist";
const themeKey = "aegis-lite-theme";

const vercelApiBaseUrl = "https://dfsd-front-end-development.vercel.app";
const symbolPattern = /^[A-Z0-9.-]{1,10}$/;

const fallbackQuotes = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 214.37,
    previousClose: 210.12,
    source: "Offline fallback"
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 468.91,
    previousClose: 461.44,
    source: "Offline fallback"
  },
  TSLA: {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 241.28,
    previousClose: 249.65,
    source: "Offline fallback"
  },
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 128.54,
    previousClose: 124.02,
    source: "Offline fallback"
  },
  SPY: {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    price: 546.12,
    previousClose: 541.45,
    source: "Offline fallback"
  },
  QQQ: {
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    price: 480.33,
    previousClose: 476.9,
    source: "Offline fallback"
  }
};

const demoQuotes = {
  AAPL: { symbol: "AAPL", name: "Apple Inc.", price: 214.37, previousClose: 210.12 },
  MSFT: { symbol: "MSFT", name: "Microsoft Corp.", price: 468.91, previousClose: 461.44 },
  TSLA: { symbol: "TSLA", name: "Tesla, Inc.", price: 241.28, previousClose: 249.65 },
  NVDA: { symbol: "NVDA", name: "NVIDIA Corp.", price: 128.54, previousClose: 124.02 },
  SPY: { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", price: 546.12, previousClose: 541.45 },
  QQQ: { symbol: "QQQ", name: "Invesco QQQ Trust", price: 480.33, previousClose: 476.9 }
};

const state = {
  watchlist: loadWatchlist(),
  currentQuote: null,
  signalThreshold: 3,
  theme: loadTheme()
};

const elements = {
  themeToggle: document.querySelector("#theme-toggle"),
  themeToggleLabel: document.querySelector("#theme-toggle-label"),
  watchlistCount: document.querySelector("#watchlist-count"),
  summarySignal: document.querySelector("#summary-signal"),
  cardSymbol: document.querySelector("#card-symbol"),
  cardPrice: document.querySelector("#card-price"),
  cardChange: document.querySelector("#card-change"),
  cardVerdict: document.querySelector("#card-verdict"),
  cardAllocation: document.querySelector("#card-allocation"),
  quoteForm: document.querySelector("#quote-form"),
  symbolInput: document.querySelector("#symbol-input"),
  loadAapl: document.querySelector("#load-aapl"),
  quoteStatus: document.querySelector("#quote-status"),
  quotePanel: document.querySelector("#quote-panel"),
  quoteName: document.querySelector("#quote-name"),
  quoteSymbol: document.querySelector("#quote-symbol"),
  quotePrice: document.querySelector("#quote-price"),
  quoteChange: document.querySelector("#quote-change"),
  quoteChangePct: document.querySelector("#quote-change-pct"),
  quoteSource: document.querySelector("#quote-source"),
  watchlistButton: document.querySelector("#watchlist-button"),
  watchlist: document.querySelector("#watchlist"),
  watchlistEmpty: document.querySelector("#watchlist-empty"),
  thresholdInput: document.querySelector("#threshold-input"),
  thresholdValue: document.querySelector("#threshold-value"),
  signalStatus: document.querySelector("#signal-status"),
  growthInput: document.querySelector("#growth-input"),
  incomeInput: document.querySelector("#income-input"),
  cashInput: document.querySelector("#cash-input"),
  calculateAllocation: document.querySelector("#calculate-allocation"),
  growthResult: document.querySelector("#growth-result"),
  incomeResult: document.querySelector("#income-result"),
  cashResult: document.querySelector("#cash-result"),
  allocationTotal: document.querySelector("#allocation-total"),
  allocationMessage: document.querySelector("#allocation-message")
};

initTheme();
renderWatchlist();
updateAllocationView();
loadQuote("AAPL");

elements.themeToggle.addEventListener("click", toggleTheme);
elements.quoteForm.addEventListener("submit", handleQuoteSearch);
elements.loadAapl.addEventListener("click", () => loadQuote("AAPL"));
elements.watchlistButton.addEventListener("click", toggleCurrentQuoteWatchlist);
elements.thresholdInput.addEventListener("input", handleThresholdChange);
elements.calculateAllocation.addEventListener("click", updateAllocationView);

function loadWatchlist() {
  try {
    const stored = localStorage.getItem(watchlistKey);
    return stored ? JSON.parse(stored) : ["AAPL", "MSFT"];
  } catch {
    return ["AAPL", "MSFT"];
  }
}

function saveWatchlist() {
  localStorage.setItem(watchlistKey, JSON.stringify(state.watchlist));
}

function loadTheme() {
  const savedTheme = localStorage.getItem(themeKey);
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function saveTheme() {
  localStorage.setItem(themeKey, state.theme);
}

function applyTheme() {
  const isDark = state.theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  elements.themeToggle.setAttribute("aria-pressed", String(isDark));
  elements.themeToggleLabel.textContent = isDark ? "Light mode" : "Dark mode";
  saveTheme();
}

function initTheme() {
  applyTheme();
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  applyTheme();
}

function handleQuoteSearch(event) {
  event.preventDefault();

  try {
    const symbol = normalizeSymbol(elements.symbolInput.value);
    loadQuote(symbol);
  } catch (error) {
    showQuoteStatus(error.message, "error");
  }
}

function getApiBaseUrl() {
  return window.location.hostname.endsWith("github.io") ? vercelApiBaseUrl : "";
}

async function loadQuote(symbol) {
  let normalizedSymbol;

  try {
    normalizedSymbol = normalizeSymbol(symbol);
  } catch (error) {
    showQuoteStatus(error.message, "error");
    return;
  }

  showQuoteStatus(`Loading live quote for ${normalizedSymbol}...`, "loading");
  setQuotePanelLoading(normalizedSymbol);

  try {
    const response = await fetch(
      `${getApiBaseUrl()}/api/quote?symbol=${encodeURIComponent(normalizedSymbol)}`
    );

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error || "Quote API error");
    }

    const quote = normalizeQuote(payload, normalizedSymbol);
    renderQuote(quote);
    showQuoteStatus(`Loaded ${quote.symbol} from ${quote.source}.`, "success");
  } catch (error) {
    const fallbackQuote = createFallbackQuote(normalizedSymbol);
    renderQuote(fallbackQuote);
    showQuoteStatus(
      `${error.message}. Showing offline fallback data for ${fallbackQuote.symbol}.`,
      "error"
    );
  }
}

function createFallbackQuote(symbol) {
  const fallback = demoQuotes.AAPL;
  return {
    symbol,
    name: demoQuotes[symbol]?.name ?? `${symbol} Demo Asset`,
    price: demoQuotes[symbol]?.price ?? fallback.price,
    previousClose: demoQuotes[symbol]?.previousClose ?? fallback.previousClose,
    source: "Offline fallback"
  };
}

function setQuotePanelLoading(symbol) {
  elements.quotePanel.classList.remove("hidden");
  elements.quoteName.textContent = "Loading...";
  elements.quoteSymbol.textContent = symbol;
  elements.quotePrice.textContent = "--";
  elements.quoteChange.textContent = "--";
  elements.quoteChangePct.textContent = "--";
  elements.quoteSource.textContent = "Loading";
  elements.watchlistButton.disabled = true;
  elements.watchlistButton.textContent = "Working...";
}

function renderQuote(quote) {
  state.currentQuote = quote;
  elements.quotePanel.classList.remove("hidden");
  elements.quoteName.textContent = quote.name;
  elements.quoteSymbol.textContent = quote.symbol;
  elements.quotePrice.textContent = formatCurrency(quote.price);

  const change = quote.price - quote.previousClose;
  const changePercent = (change / quote.previousClose) * 100;
  const changeText = `${change >= 0 ? "+" : ""}${formatCurrency(change)}`;
  const changePercentText = `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`;

  elements.quoteChange.textContent = changeText;
  elements.quoteChange.className = `mt-2 text-2xl font-bold ${change >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`;
  elements.quoteChangePct.textContent = changePercentText;
  elements.quoteChangePct.className = `mt-2 text-2xl font-bold ${changePercent >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`;
  elements.quoteSource.textContent = quote.source || "Finnhub live API";
  elements.watchlistButton.disabled = false;
  elements.watchlistButton.textContent = isWatchlisted(quote.symbol) ? "Remove from watchlist" : "Add to watchlist";

  updateSummaryCards(quote, changePercent);
  updateSignal(changePercent);
  updateWatchlistView();
}

function updateSummaryCards(quote, changePercent) {
  elements.cardSymbol.textContent = quote.symbol;
  elements.cardPrice.textContent = formatCurrency(quote.price);
  elements.cardChange.textContent = `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}% today`;
  const verdict = getSignalVerdict(changePercent, state.signalThreshold);
  elements.cardVerdict.textContent = verdict.label;
  elements.summarySignal.textContent = verdict.label;
}

function updateSignal(changePercent) {
  const verdict = getSignalVerdict(changePercent, state.signalThreshold);
  elements.signalStatus.textContent = `${verdict.label}: ${verdict.message}`;
  elements.cardVerdict.textContent = verdict.label;
  elements.summarySignal.textContent = verdict.label;
}

function getSignalVerdict(changePercent, threshold) {
  if (changePercent >= threshold) {
    return { label: "Bullish", message: `Price change is above the ${threshold}% demo threshold.` };
  }

  if (changePercent <= -threshold) {
    return { label: "Bearish", message: `Price change is below the -${threshold}% demo threshold.` };
  }

  return { label: "Neutral", message: `Price change is inside the ${threshold}% demo range.` };
}

function handleThresholdChange() {
  state.signalThreshold = Number(elements.thresholdInput.value);
  elements.thresholdValue.textContent = `${state.signalThreshold}%`;

  if (state.currentQuote) {
    const changePercent = ((state.currentQuote.price - state.currentQuote.previousClose) / state.currentQuote.previousClose) * 100;
    updateSignal(changePercent);
  }
}

function toggleCurrentQuoteWatchlist() {
  if (!state.currentQuote) {
    return;
  }

  if (isWatchlisted(state.currentQuote.symbol)) {
    removeFromWatchlist(state.currentQuote.symbol);
    showQuoteStatus(`${state.currentQuote.symbol} removed from watchlist.`, "success");
  } else {
    addToWatchlist(state.currentQuote.symbol);
    showQuoteStatus(`${state.currentQuote.symbol} added to watchlist.`, "success");
  }

  renderWatchlist();
  elements.watchlistButton.textContent = isWatchlisted(state.currentQuote.symbol) ? "Remove from watchlist" : "Add to watchlist";
}

function addToWatchlist(symbol) {
  if (!state.watchlist.includes(symbol)) {
    state.watchlist.unshift(symbol);
    saveWatchlist();
  }
}

function removeFromWatchlist(symbol) {
  state.watchlist = state.watchlist.filter((item) => item !== symbol);
  saveWatchlist();
}

function isWatchlisted(symbol) {
  return state.watchlist.includes(symbol);
}

function renderWatchlist() {
  elements.watchlist.replaceChildren();
  elements.watchlistCount.textContent = String(state.watchlist.length);
  elements.watchlistEmpty.classList.toggle("hidden", state.watchlist.length > 0);

  if (state.watchlist.length === 0) {
    return;
  }

  state.watchlist.forEach((symbol) => {
    const quote = demoQuotes[symbol] ?? createFallbackQuote(symbol);
    const item = document.createElement("li");
    item.className = "flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50";

    const label = document.createElement("div");
    const symbolLine = document.createElement("p");
    symbolLine.className = "font-semibold";
    symbolLine.textContent = quote.symbol;
    const nameLine = document.createElement("p");
    nameLine.className = "text-xs text-slate-500 dark:text-slate-400";
    nameLine.textContent = quote.name;
    label.append(symbolLine, nameLine);

    const controls = document.createElement("div");
    controls.className = "flex items-center gap-2";

    const loadButton = document.createElement("button");
    loadButton.type = "button";
    loadButton.className = "rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold transition hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:hover:border-cyan-400 dark:hover:text-cyan-300";
    loadButton.textContent = "Load";
    loadButton.setAttribute("aria-label", `Load ${quote.symbol} quote`);
    loadButton.addEventListener("click", () => loadQuote(symbol));

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      removeFromWatchlist(symbol);
      renderWatchlist();
      if (state.currentQuote?.symbol === symbol) {
        elements.watchlistButton.textContent = "Add to watchlist";
      }
    });

    controls.append(loadButton, removeButton);
    item.append(label, controls);
    elements.watchlist.appendChild(item);
  });
}

function updateWatchlistView() {
  elements.watchlistCount.textContent = String(state.watchlist.length);
  elements.watchlistButton.textContent = state.currentQuote && isWatchlisted(state.currentQuote.symbol) ? "Remove from watchlist" : "Add to watchlist";
}

function showQuoteStatus(message, variant) {
  const classes = {
    loading: "border-blue-200 bg-blue-50 text-blue-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200",
    error: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200"
  };

  elements.quoteStatus.className = `mt-4 rounded-2xl border border-dashed p-4 text-sm ${classes[variant]}`;
  elements.quoteStatus.textContent = message;
}

function updateAllocationView() {
  const growth = clampPercent(Number(elements.growthInput.value));
  const income = clampPercent(Number(elements.incomeInput.value));
  const remainingCash = 100 - growth - income;
  let cash = clampPercent(Number(elements.cashInput.value));

  if (remainingCash >= 0) {
    cash = remainingCash;
  } else {
    cash = 0;
  }

  elements.growthInput.value = String(growth);
  elements.incomeInput.value = String(income);
  elements.cashInput.value = String(cash);
  elements.growthResult.textContent = `${growth}%`;
  elements.incomeResult.textContent = `${income}%`;
  elements.cashResult.textContent = `${cash}%`;
  elements.allocationTotal.textContent = `${growth + income + cash}%`;
  elements.cardAllocation.textContent = `${growth + income + cash}%`;

  if (remainingCash < 0) {
    elements.allocationMessage.textContent = `Growth and income total ${growth + income}%, which exceeds 100%. Cash has been set to 0%.`;
    elements.allocationMessage.className = "mt-4 text-sm text-rose-600 dark:text-rose-300";
  } else if (growth + income + cash === 100) {
    elements.allocationMessage.textContent = "The allocation is balanced at 100%.";
    elements.allocationMessage.className = "mt-4 text-sm text-slate-600 dark:text-slate-300";
  } else {
    elements.allocationMessage.textContent = "The app corrected the cash bucket so the total equals 100%.";
    elements.allocationMessage.className = "mt-4 text-sm text-slate-600 dark:text-slate-300";
  }
}

function clampPercent(value) {
  if (Number.isNaN(value) || value < 0) {
    return 0;
  }

  if (value > 100) {
    return 100;
  }

  return Math.round(value);
}

function normalizeQuote(payload, symbol) {
  return {
    symbol: String(payload.symbol || symbol).toUpperCase(),
    name: String(payload.name || `${symbol} Quote`),
    price: Number(payload.price),
    previousClose: Number(payload.previousClose || payload.price),
    high: Number(payload.high || payload.price),
    low: Number(payload.low || payload.price),
    open: Number(payload.open || payload.price),
    timestamp: Number(payload.timestamp || Math.floor(Date.now() / 1000)),
    source: String(payload.source || "Finnhub live API")
  };
}

function normalizeSymbol(rawSymbol) {
  const symbol = String(rawSymbol || "").trim().toUpperCase();

  if (!symbolPattern.test(symbol)) {
    throw new Error("Enter a valid symbol using 1 to 10 letters, numbers, dots, or hyphens.");
  }

  return symbol;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}