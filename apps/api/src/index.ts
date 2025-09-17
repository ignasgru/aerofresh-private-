export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ ok: true, ts: Date.now() }), { headers: { "content-type": "application/json" }});
    }
    const m = url.pathname.match(/^\/api\/aircraft\/([A-Za-z0-9-]+)\/summary$/);
    if (m) {
      const tail = m[1].toUpperCase();
      // TODO: fetch from Postgres; for now return mock
      const summary = {
        tail,
        regStatus: "Valid",
        airworthiness: "Standard",
        adOpenCount: 2,
        ntsbAccidents: 0,
        owners: 1,
        riskScore: 12
      };
      return Response.json({ tail, summary });
    }
    return new Response("Not found", { status: 404 });
  }
} satisfies ExportedHandler;
