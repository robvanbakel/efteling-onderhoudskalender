import axios from "axios";
import * as cheerio from "cheerio";

const URL = "https://www.efteling.com/nl/park/informatie/in-onderhoud";

export const fetchData = async (): Promise<
  {
    name: string;
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

  return attractions;
};
