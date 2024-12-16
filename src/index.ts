import { Hono } from "hono";

import { fetchData } from "./utils/fetchData";
import { generateIcs } from "./utils/generateIcs";
import { parsePeriod } from "./utils/parsePeriod";

const app = new Hono();

app.get("/feed", async (c) => {
  const attractions = await fetchData();

  const parsedData = attractions.map((attraction) => ({
    name: attraction.name,
    ...parsePeriod(attraction.period),
  }));

  const icsString = generateIcs(parsedData);

  return c.body(icsString, 200, {
    "Content-Type": "text/calendar",
  });
});

export default app;
