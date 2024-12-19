import { expect, test } from "vitest";
import { parsePeriod } from "./parsePeriod";
import { format } from "date-fns";

test("formats fromToDate period correctly", () => {
  const dates = parsePeriod("6 januari t/m 28 maart 2025");

  expect(dates).toMatchObject({
    from: "2025-01-06",
    to: "2025-03-28",
  });
});

test("formats noFromDate period correctly", () => {
  const dates = parsePeriod("t/m 20 december 2024");

  expect(dates).toMatchObject({
    from: format(new Date(), "yyyy-MM-dd"),
    to: "2024-12-20",
  });
});

test("formats singleDate period correctly", () => {
  const dates = parsePeriod("26 maart 2025");

  expect(dates).toMatchObject({
    from: "2025-03-26",
    to: "2025-03-26",
  });
});
