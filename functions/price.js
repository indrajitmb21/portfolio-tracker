export async function onRequest(context) {
  const url = new URL(context.request.url);
  const symbol = (url.searchParams.get("symbol") || "").trim().toUpperCase();
  const exchange = (url.searchParams.get("exchange") || "NSE").trim().toUpperCase();
  console.log("PRICE HIT", { symbol, exchange });

  if (!symbol) {
    return new Response(JSON.stringify({ error: "Missing symbol" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const API_BASE = "http://nse-api-khaki.vercel.app:5000";
  const apiSymbol = exchange === "BSE" ? `${symbol}.BO` : `${symbol}.NS`;
  const apiUrl = `${API_BASE}/stock?symbol=${encodeURIComponent(apiSymbol)}&res=num`;
  console.log("PRICE URL", apiUrl);

  try {
    const res = await fetch(apiUrl);
    console.log("PRICE STATUS", res.status);
    const data = await res.json();
    console.log("PRICE DATA", data);

    const price = data?.data?.last_price ?? null;

    return new Response(JSON.stringify({ symbol, exchange, price, raw: data }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.log("PRICE ERROR", String(err));
    return new Response(JSON.stringify({ symbol, exchange, price: null, error: "price_failed" }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}
