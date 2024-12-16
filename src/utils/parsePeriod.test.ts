import { expect, test } from "vitest";
import { parsePeriod } from "./parsePeriod";

test("formats fromToDate period correctly", () => {
  const dates = parsePeriod("6 januari t/m 28 maart 2025");

  expect(dates).toMatchObject({
    from: new Date("2025-01-06"),
    to: new Date("2025-03-28"),
  });
});

test("formats noFromDate period correctly", () => {
  const dates = parsePeriod("t/m 20 december 2024");

  expect(dates).toMatchObject({
    from: new Date(),
    to: new Date("2024-12-20"),
  });
});

test("formats singleDate period correctly", () => {
  const dates = parsePeriod("26 maart 2025");

  expect(dates).toMatchObject({
    from: new Date("2025-03-26"),
    to: new Date("2025-03-26"),
  });
});
