async function fetchKalshiMarkets() {
  try {
    const res = await fetch(
      "https://api.elections.kalshi.com/trade-api/v2/markets?limit=5"
    );

    const data = await res.json();

    console.log("✅ Markets fetched:\n");

    data.markets.forEach((m) => {
      console.log({
        title: m.title,
        ticker: m.ticker,
        yes_price: m.yes_price,
        no_price: m.no_price,
      });
    });
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

fetchKalshiMarkets();