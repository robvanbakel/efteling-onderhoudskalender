import { add, format } from "date-fns";

type Attraction = {
  from: string | null;
  to: string;
  name: string;
};

const DATE_FORMAT = "yyyyMMdd";

const generateUid = ({ name, from, to }: Attraction) => {
  return [name.toLowerCase().replaceAll(" ", "-"), from, to].join("_");
};

const generateIcsEvent = (attraction: Attraction, timestamp?: string) => {
  return `BEGIN:VEVENT
DTSTART;VALUE=DATE:${format(attraction.from ?? new Date(), DATE_FORMAT)}
DTEND;VALUE=DATE:${format(add(attraction.to, { days: 1 }), DATE_FORMAT)}
DTSTAMP:${(timestamp ?? new Date().toISOString()).split(".")[0].replaceAll(/[-:]/g, "")}
SUMMARY:Onderhoud: ${attraction.name}
UID:${generateUid(attraction)}
END:VEVENT`;
};

export const generateIcs = (data: Attraction[], timestamp?: string) => {
  const icsStart = `BEGIN:VCALENDAR
CALSCALE:GREGORIAN
PRODID:efteling-onderhoudskalender
VERSION:2.0`;

  const icsEnd = "END:VCALENDAR";

  return [
    icsStart,
    ...data.map((attraction) => generateIcsEvent(attraction, timestamp)),
    icsEnd,
  ].join("\n");
};
