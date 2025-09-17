import prisma from '@aerofresh/db/client';

export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    // Health check endpoint
    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ ok: true, ts: Date.now() }), {
        headers: { "content-type": "application/json" },
      });
    }

    // Aircraft summary: /api/aircraft/:tail/summary
    let m = url.pathname.match(/^\/api\/aircraft\/([A-Za-z0-9-]+)\/summary$/);
    if (m) {
      const tail = m[1].toUpperCase();
      try {
        const aircraft = await prisma.aircraft.findUnique({ where: { tail } });
        if (!aircraft) {
          return new Response("Not found", { status: 404 });
        }
        const accidentsCount = await prisma.accident.count({ where: { tail } });
        const ownersCount = await prisma.aircraftOwner.count({ where: { tail } });
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
        return Response.json({ tail, summary });
      } catch (err) {
        return new Response("Error fetching data", { status: 500 });
      }
    }

    // Aircraft history: /api/aircraft/:tail/history
    m = url.pathname.match(/^\/api\/aircraft\/([A-Za-z0-9-]+)\/history$/);
    if (m) {
      const tail = m[1].toUpperCase();
      try {
        const owners = await prisma.aircraftOwner.findMany({
          where: { tail },
          include: { owner: true },
          orderBy: { start: 'asc' },
        });
        const accidents = await prisma.accident.findMany({
          where: { tail },
          orderBy: { date: 'desc' },
        });
        const aircraft = await prisma.aircraft.findUnique({ where: { tail } });
        const makeModelKey = aircraft ? `${aircraft.make ?? ''}:${aircraft.model ?? ''}` : '';
        const adDirectives = makeModelKey
          ? await prisma.adDirective.findMany({
              where: { makeModelKey },
            })
          : [];
        const history = { owners, accidents, adDirectives };
        return Response.json({ tail, history });
      } catch (err) {
        return new Response("Error fetching data", { status: 500 });
      }
    }

    // Aircraft live: /api/aircraft/:tail/live
    m = url.pathname.match(/^\/api\/aircraft\/([A-Za-z0-9-]+)\/live$/);
    if (m) {
      const tail = m[1].toUpperCase();
      try {
        const latest = await prisma.eventLive.findFirst({
          where: { tail },
          orderBy: { ts: 'desc' },
        });
        return Response.json({ tail, live: latest });
      } catch (err) {
        return new Response("Error fetching data", { status: 500 });
      }
    }

    // Airport METAR: /api/airport/:icao/metar
    m = url.pathname.match(/^\/api\/airport\/([A-Za-z0-9]+)\/metar$/);
    if (m) {
      const icao = m[1].toUpperCase();
      try {
        const metar = await prisma.weatherMetar.findFirst({
          where: { icao },
          orderBy: { ts: 'desc' },
        });
        return Response.json({ icao, metar });
      } catch (err) {
        return new Response("Error fetching data", { status: 500 });
      }
    }

    // Search endpoint: /api/search
    if (url.pathname === "/api/search") {
      const params = url.searchParams;
      const make = params.get("make") || undefined;
      const model = params.get("model") || undefined;
      const hasAccidents = params.get("hasAccidents");
      try {
        const where: any = {};
        if (make) {
          where.make = { contains: make, mode: 'insensitive' };
        }
        if (model) {
          where.model = { contains: model, mode: 'insensitive' };
        }
        let aircraftList = await prisma.aircraft.findMany({
          where,
          take: 100,
        });
        if (hasAccidents === "false") {
          const filtered: typeof aircraftList = [];
          for (const a of aircraftList) {
            const count = await prisma.accident.count({ where: { tail: a.tail } });
            if (count === 0) {
              filtered.push(a);
            }
          }
          aircraftList = filtered;
        }
        return Response.json({ results: aircraftList });
      } catch (err) {
        return new Response("Error fetching data", { status: 500 });
      }
    }

    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler;
