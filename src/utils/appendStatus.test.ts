import { describe, test, expect } from "vitest";
import { format } from "date-fns";
import { appendStatus } from "./appendStatus";

describe("Append status to items in array", () => {
  const formattedToday = format(new Date(), "yyyy-MM-dd");

  test("appends no status when no changes are present", () => {
    const mappedArray = appendStatus(
      [
        { from: "2025-01-01", to: "2025-01-01", name: "Item #1" },
        { from: "2025-02-01", to: "2025-02-01", name: "Item #2" },
        { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
      ],
      [
        { from: "2025-01-01", to: "2025-01-01", name: "Item #1" },
        { from: "2025-02-01", to: "2025-02-01", name: "Item #2" },
        { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
      ],
    );

    expect(mappedArray).toEqual([
      { from: "2025-01-01", to: "2025-01-01", name: "Item #1" },
      { from: "2025-02-01", to: "2025-02-01", name: "Item #2" },
      { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
    ]);
  });

  test("appends ADDED status when an item is added", () => {
    const mappedArray = appendStatus(
      [
        { from: "2025-01-01", to: "2025-01-01", name: "Item #1" },
        { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
      ],
      [
        { from: "2025-01-01", to: "2025-01-01", name: "Item #1" },
        { from: "2025-02-01", to: "2025-02-01", name: "Item #2" },
        { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
      ],
    );

    expect(mappedArray).toEqual([
      { from: "2025-01-01", to: "2025-01-01", name: "Item #1" },
      {
        from: "2025-02-01",
        to: "2025-02-01",
        name: "Item #2",
        status: "ADDED",
      },
      { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
    ]);
  });

  test("appends UPDATED status when an item is updated", () => {
    const mappedArray = appendStatus(
      [
        { from: "2025-01-01", to: "2025-01-01", name: "Item #1" },
        { from: "2025-02-01", to: "2025-02-01", name: "Item #2" },
        { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
      ],
      [
        { from: "2025-01-01", to: "2025-01-01", name: "Item #1" },
        { from: "2025-02-02", to: "2025-02-02", name: "Item #2" },
        { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
      ],
    );

    expect(mappedArray).toEqual([
      { from: "2025-01-01", to: "2025-01-01", name: "Item #1" },
      {
        from: "2025-02-02",
        to: "2025-02-02",
        name: "Item #2",
        status: "UPDATED",
      },
      { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
    ]);
  });

  test("appends REMOVED status when an item is removed", () => {
    const mappedArray = appendStatus(
      [
        { from: "2025-01-01", to: "2025-01-01", name: "Item #1" },
        { from: "2025-02-01", to: "2025-02-01", name: "Item #2" },
        { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
      ],
      [
        { from: "2025-01-01", to: "2025-01-01", name: "Item #1" },
        { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
      ],
    );

    expect(mappedArray).toEqual([
      { from: "2025-01-01", to: "2025-01-01", name: "Item #1" },
      {
        from: "2025-02-01",
        to: "2025-02-01",
        name: "Item #2",
        status: "REMOVED",
      },
      { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
    ]);
  });

  test("finds correct item when name occures twice", () => {
    const mappedArray = appendStatus(
      [
        { from: "2025-01-01", to: "2025-01-01", name: "Item #1" },
        { from: "2025-02-01", to: "2025-02-01", name: "Item #2" },
        { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
        { from: "2025-04-01", to: "2025-04-01", name: "Item #2" },
      ],
      [
        { from: "2025-01-01", to: "2025-01-01", name: "Item #1" },
        { from: "2025-02-01", to: "2025-02-01", name: "Item #2" },
        { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
        { from: "2025-04-02", to: "2025-04-02", name: "Item #2" },
      ],
    );

    expect(mappedArray).toEqual([
      { from: "2025-01-01", to: "2025-01-01", name: "Item #1" },
      { from: "2025-02-01", to: "2025-02-01", name: "Item #2" },
      { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
      {
        from: "2025-04-02",
        to: "2025-04-02",
        name: "Item #2",
        status: "UPDATED",
      },
    ]);
  });

  test("doesn't mark as REMOVED when `to` date is today", () => {
    const mappedArray = appendStatus(
      [
        { from: "2025-01-01", to: formattedToday, name: "Item #1" },
        { from: "2025-02-01", to: "2025-02-01", name: "Item #2" },
        { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
      ],
      [
        { from: "2025-02-01", to: "2025-02-01", name: "Item #2" },
        { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
      ],
    );

    expect(mappedArray).toEqual([
      { from: "2025-02-01", to: "2025-02-01", name: "Item #2" },
      { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
    ]);
  });

  test("doesn't mark as UPDATED when `from` date is changed from today to null", () => {
    const mappedArray = appendStatus(
      [
        { from: "2025-01-01", to: "2025-01-01", name: "Item #1" },
        { from: formattedToday, to: "2025-02-01", name: "Item #2" },
        { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
      ],
      [
        { from: "2025-01-01", to: "2025-01-01", name: "Item #1" },
        { from: null, to: "2025-02-01", name: "Item #2" },
        { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
      ],
    );

    expect(mappedArray).toEqual([
      { from: "2025-01-01", to: "2025-01-01", name: "Item #1" },
      { from: null, to: "2025-02-01", name: "Item #2" },
      { from: "2025-03-01", to: "2025-03-01", name: "Item #3" },
    ]);
  });
});
