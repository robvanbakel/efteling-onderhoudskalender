import type { KVNamespace } from "@cloudflare/workers-types";
import { Hono } from "hono";

import { differenceInMinutes } from "date-fns";
import { fetchData } from "./utils/fetchData";
import { generateIcs } from "./utils/generateIcs";
import { appendStatus } from "./utils/appendStatus";
import { sendNotification } from "./utils/sendNotification.tsx";

const MAX_CACHE_AGE_IN_MINUTES = 60;
const CACHE_STORE = "efteling-onderhoudskalender-cache";

const app = new Hono<{
  Bindings: {
    [CACHE_STORE]: KVNamespace<"attractions">;
    RESEND_API_KEY: string;
    NOTIFICATION_TO: string;
  };
}>();

app.get("/feed", async (c) => {
  const feedCache = await c.env[CACHE_STORE].get<{
    timestamp: string;
    data: {
      name: string;
      to: string;
      from: string | null;
      period: string;
    }[];
  }>("attractions", "json");

  if (!feedCache) {
    const attractions = await fetchData({ cacheStore: c.env[CACHE_STORE] });

    const icsString = generateIcs(attractions);
    return c.body(icsString);
  }

  const cacheAge = differenceInMinutes(new Date(), feedCache.timestamp);

  if (cacheAge < MAX_CACHE_AGE_IN_MINUTES) {
    const icsString = generateIcs(feedCache.data, feedCache.timestamp);
    return c.body(icsString);
  }

  const attractions = await fetchData({ cacheStore: c.env[CACHE_STORE] });

  const attractionsWithStatus = appendStatus(feedCache.data, attractions);
  const hasChanges = attractionsWithStatus.some(({ status }) => !!status);

  if (hasChanges) {
    await sendNotification(
      c.env.RESEND_API_KEY,
      c.env.NOTIFICATION_TO,
      attractionsWithStatus,
    );
  }

  const icsString = generateIcs(attractions);
  return c.body(icsString);
});

export default app;
