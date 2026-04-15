export async function onRequest(context) {
  const url = new URL(context.request.url);
  const q = (url.searchParams.get("q") || "").trim();

  if (!q) {
    return new Response(JSON.stringify([]), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const apiUrl = `https://raw.githubusercontent.com/0xramm/Indian-Stock-Market-API/main/data/symbols.json`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    const query = q.toLowerCase();
    const results = (Array.isArray(data) ? data : []).filter(item => {
      const sym = String(item.symbol || item.ticker || "").toLowerCase();
      const name = String(item.name || item.company_name || "").toLowerCase();
      return sym.includes(query) || name.includes(query);
    }).slice(0, 12);

    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "search_failed" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
