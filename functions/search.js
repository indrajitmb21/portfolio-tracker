export async function onRequest() {
  return new Response(JSON.stringify([
    { symbol: "RELIANCE", name: "Reliance Industries Ltd", exchange: "NSE" },
    { symbol: "TCS", name: "Tata Consultancy Services Ltd", exchange: "NSE" },
    { symbol: "INFY", name: "Infosys Ltd", exchange: "NSE" }
  ]), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
