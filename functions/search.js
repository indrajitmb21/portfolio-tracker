export async function onRequest(context) {
  const url = new URL(context.request.url);
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();

  if (!q) {
    return new Response(JSON.stringify([]), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const API_BASE = "http://nse-api-khaki.vercel.app:5000";
  const apiUrl = `${API_BASE}/symbols`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    const list = Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data)
      ? data
      : [];

    const results = list.filter(item => {
      const sym = String(item.symbol || "").toLowerCase();
      const name = String(item.company_name || item.name || "").toLowerCase();
      return sym.includes(q) || name.includes(q);
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
