import { add, format } from "date-fns";
import { nanoid } from "nanoid";

type Attraction = {
  from: string;
  to: string;
  name: string;
};

const DATE_FORMAT = "yyyyMMdd";

const generateIcsEvent = (attraction: Attraction) => {
  return `BEGIN:VEVENT
DTSTART;VALUE=DATE:${format(attraction.from, DATE_FORMAT)}
DTEND;VALUE=DATE:${format(add(attraction.to, { days: 1 }), DATE_FORMAT)}
DTSTAMP:${new Date().toISOString().split(".")[0].replaceAll(/[-:]/g, "")}
SUMMARY:Onderhoud: ${attraction.name}
UID:${nanoid()}
END:VEVENT`;
};

export const generateIcs = (data: Attraction[]) => {
  const icsStart = `BEGIN:VCALENDAR
CALSCALE:GREGORIAN
PRODID:efteling-onderhoudskalender
VERSION:2.0`;

  const icsEnd = "END:VCALENDAR";

  return [icsStart, ...data.map(generateIcsEvent), icsEnd].join("\n");
};
