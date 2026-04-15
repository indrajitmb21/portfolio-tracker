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

  const API_BASE = "http://nse-api-khaki.vercel.app:5000";
  const apiUrl = `${API_BASE}/search?q=${encodeURIComponent(q)}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    const results =
      (Array.isArray(data) && data) ||
      data?.results ||
      data?.symbols ||
      data?.data ||
      [];

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
