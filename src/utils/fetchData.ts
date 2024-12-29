import axios from "axios";
import type { KVNamespace } from "@cloudflare/workers-types";
import * as cheerio from "cheerio";
import { parsePeriod } from "./parsePeriod";

const URL = "https://www.efteling.com/nl/park/informatie/in-onderhoud";

export const fetchData = async ({
  cacheStore,
}: {
  cacheStore: KVNamespace<"attractions">;
}): Promise<
  {
    name: string;
    from: string | null;
    to: string;
    period: string;
  }[]
> => {
  const { data } = await axios.get(URL);

  const $ = cheerio.load(data);

  const attractions = $(".attractions")
    .children()
    .map((_, element) => {
      const nameContainer = $(element).find(".layout__item").first();

      return {
        name: nameContainer.find("a").text(),
        period: nameContainer.next().text().trim().replaceAll("\n", " "),
      };
    })
    .get();

  const parsedData = attractions.map((attraction) => ({
    name: attraction.name,
    period: attraction.period,
    ...parsePeriod(attraction.period),
  }));

  await cacheStore.put(
    "attractions",
    JSON.stringify({
      timestamp: new Date().toISOString(),
      data: parsedData,
    }),
  );

  return parsedData;
};
