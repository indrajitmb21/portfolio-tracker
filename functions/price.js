export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const symbol = (url.searchParams.get("symbol") || "").trim().toUpperCase();
  const exchange = (url.searchParams.get("exchange") || "NSE").trim().toUpperCase();

  if (!symbol) {
    return new Response(JSON.stringify({ error: "Missing symbol" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const yahooSymbol = `${symbol}.${exchange === "BSE" ? "BO" : "NS"}`;
  const targets = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1d`,
    `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1d`,
  ];

  for (const target of targets) {
    try {
      const res = await fetch(target, {
        headers: {
          "user-agent": "Mozilla/5.0",
          "accept": "application/json",
        },
      });

      if (!res.ok) continue;

      const data = await res.json();
      const result = data?.chart?.result?.[0];
      const price = result?.meta?.regularMarketPrice;

      if (Number.isFinite(price)) {
        return new Response(JSON.stringify({
          symbol,
          exchange,
          price,
          source: "yahoo-meta",
        }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      const closes = result?.indicators?.quote?.[0]?.close || [];
      const valid = closes.filter(v => v != null);
      if (valid.length) {
        return new Response(JSON.stringify({
          symbol,
          exchange,
          price: valid[valid.length - 1],
          source: "yahoo-close",
        }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    } catch (e) {}
  }

  return new Response(JSON.stringify({
    symbol,
    exchange,
    price: null,
    source: "failed",
  }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
