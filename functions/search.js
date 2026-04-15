export async function onRequest(context) {
  const url = new URL(context.request.url);
  const q = (url.searchParams.get("q") || "").trim();
  console.log("SEARCH HIT", { q });

  if (!q) {
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const API_BASE = "http://nse-api-khaki.vercel.app:5000";
  const apiUrl = `${API_BASE}/search?q=${encodeURIComponent(q)}`;
  console.log("SEARCH URL", apiUrl);

  try {
    const res = await fetch(apiUrl);
    console.log("SEARCH STATUS", res.status);
    const data = await res.json();
    console.log("SEARCH DATA", data);

    const results = Array.isArray(data?.results) ? data.results : [];
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.log("SEARCH ERROR", String(err));
    return new Response(JSON.stringify({ error: "search_failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}
