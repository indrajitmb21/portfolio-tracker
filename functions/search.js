export async function onRequest() {
  const API_BASE = "http://nse-api-khaki.vercel.app:5000";

  try {
    const res = await fetch(`${API_BASE}/symbols`);
    const data = await res.json();

    const list = Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data)
      ? data
      : [];

    return new Response(JSON.stringify(list), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify([]), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
