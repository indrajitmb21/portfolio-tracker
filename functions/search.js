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

  const apiUrl = `https://api.example.com/search?q=${encodeURIComponent(q)}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    let results = [];
    if (Array.isArray(data)) results = data;
    else if (Array.isArray(data.results)) results = data.results;
    else if (Array.isArray(data.data)) results = data.data;

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
