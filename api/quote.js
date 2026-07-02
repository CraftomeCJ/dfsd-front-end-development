const demoQuotes = {
  AAPL: { symbol: "AAPL", name: "Apple Inc.", price: 214.37, previousClose: 210.12 },
  MSFT: { symbol: "MSFT", name: "Microsoft Corp.", price: 468.91, previousClose: 461.44 },
  TSLA: { symbol: "TSLA", name: "Tesla, Inc.", price: 241.28, previousClose: 249.65 },
  NVDA: { symbol: "NVDA", name: "NVIDIA Corp.", price: 128.54, previousClose: 124.02 },
  SPY: { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", price: 546.12, previousClose: 541.45 },
  QQQ: { symbol: "QQQ", name: "Invesco QQQ Trust", price: 480.33, previousClose: 476.9 }
};

module.exports = function handler(req, res) {
  const symbol = String(req.query.symbol || "AAPL").trim().toUpperCase();
  const quote = demoQuotes[symbol] || {
    symbol,
    name: `${symbol} Demo Asset`,
    price: 100.5,
    previousClose: 99.25
  };

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).json({
    symbol: quote.symbol,
    name: quote.name,
    price: quote.price,
    previousClose: quote.previousClose,
    source: "Aegis Lite demo API"
  });
};