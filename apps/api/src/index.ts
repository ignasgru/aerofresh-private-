import prisma from '@aerofresh/db/client';

export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ ok: true, ts: Date.now() }), {
        headers: { "content-type": "application/json" },
      });
    }

    // Match /api/aircraft/:tail/summary
    const m = url.pathname.match(/^\/api\/aircraft\/([A-Za-z0-9-]+)\/summary$/);
    if (m) {
      const tail = m[1].toUpperCase();

      try {
        const aircraft = await prisma.aircraft.findUnique({ where: { tail } });
        if (!aircraft) {
          return new Response("Not found", { status: 404 });
        }

        const accidentsCount = await prisma.accident.count({ where: { tail } });
        const ownersCount = await prisma.aircraftOwner.count({ where: { tail } });

        // Placeholder for AD open directives count
        const adOpenCount = 0;

        const summary = {
          tail: aircraft.tail,
          regStatus: "Valid",
          airworthiness: "Standard",
          adOpenCount,
          ntsbAccidents: accidentsCount,
          owners: ownersCount,
          riskScore: accidentsCount * 10 + adOpenCount * 5,
        };

        return new Response(JSON.stringify({ tail, summary }), {
          headers: { "content-type": "application/json" },
        });
      } catch (err) {
        return new Response("Error fetching data", { status: 500 });
      }
    }

    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler;
