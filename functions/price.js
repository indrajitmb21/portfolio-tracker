export async function onRequest(context) {
  const url = new URL(context.request.url);
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

  const API_BASE = "PASTE_REAL_API_BASE_HERE";
  const apiSymbol = exchange === "BSE" ? `${symbol}.BO` : `${symbol}.NS`;
  const apiUrl = `${API_BASE}/stock?symbol=${encodeURIComponent(apiSymbol)}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    const price =
      data?.price ??
      data?.ltp ??
      data?.lastPrice ??
      data?.currentPrice ??
      data?.data?.price ??
      null;

    return new Response(JSON.stringify({
      symbol,
      exchange,
      price,
      raw: data,
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({
      symbol,
      exchange,
      price: null,
      error: "price_failed",
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
