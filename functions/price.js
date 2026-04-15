export async function onRequest(context) {
  const url = new URL(context.request.url);
  const symbol = (url.searchParams.get("symbol") || "").trim().toUpperCase();

  return new Response(JSON.stringify({
    symbol,
    exchange: "NSE",
    price: 1234.56
  }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
