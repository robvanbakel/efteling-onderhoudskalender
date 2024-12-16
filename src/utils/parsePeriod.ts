import { parse } from "date-fns";
import { nl } from "date-fns/locale/nl";

const TRANSLATED_UNTIL = "t/m";

const parseFormattedDate = (
  formattedDate: string,
  options: Partial<{
    referenceDate: Date;
    returnDateObject: boolean;
  }> = {},
): Date => {
  const referenceDate = options.referenceDate ?? new Date();

  const formatString =
    formattedDate.split(" ").length === 3 ? "d MMMM yyyy" : "d MMMM";

  const date = parse(formattedDate, formatString, referenceDate, {
    locale: nl,
  });

  return date;
};

export const parsePeriod = (period: string): { from: Date; to: Date } => {
  if (!period.includes(TRANSLATED_UNTIL)) {
    const date = parseFormattedDate(period);

    return {
      from: date,
      to: date,
    };
  }

  if (period.startsWith(TRANSLATED_UNTIL)) {
    const to = parseFormattedDate(period.slice(4));

    return {
      from: new Date(),
      to,
    };
  }

  const [formattedFrom, formattedTo] = period.split(` ${TRANSLATED_UNTIL} `);

  const to = parseFormattedDate(formattedTo);
  const from = parseFormattedDate(formattedFrom, { referenceDate: to });

  return {
    from,
    to,
  };
};
