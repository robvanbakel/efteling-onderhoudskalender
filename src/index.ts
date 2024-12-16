import { Hono } from "hono";
import type { KVNamespace } from "@cloudflare/workers-types";

import { fetchData } from "./utils/fetchData";
import { generateIcs } from "./utils/generateIcs";
import { parsePeriod } from "./utils/parsePeriod";

const cacheKey = "efteling-onderhoudskalender-cache";

const app = new Hono<{
  Bindings: {
    [cacheKey]: KVNamespace;
  };
}>();
app.get("/feed", async (c) => {
  const feedCache = await c.env[cacheKey].get("feed");

  if (feedCache) {
    return c.body(feedCache, 200, {
      "Content-Type": "text/calendar",
    });
  }

  const attractions = await fetchData();

  const parsedData = attractions.map((attraction) => ({
    name: attraction.name,
    ...parsePeriod(attraction.period),
  }));

  const icsString = generateIcs(parsedData);

  await c.env[cacheKey].put("feed", icsString, {
    expirationTtl: 3600,
  });

  return c.body(icsString, 200, {
    "Content-Type": "text/calendar",
  });
});

export default app;
