import { differenceInDays, format } from "date-fns";

export type Status = "ADDED" | "REMOVED" | "UPDATED";

export type Item = {
  name: string;
  from: string | null;
  to: string;
};

const areDatesClose = (
  date1: string,
  date2 = format(new Date(), "yyyy-MM-dd"),
  threshold = 2,
) => {
  return Math.abs(differenceInDays(date1, date2)) <= threshold;
};

export const appendStatus = (oldItems: Item[], newItems: Item[]) => {
  const outputItems: (Item & { status?: Status })[] = newItems;

  const removedItems = oldItems.filter(({ name, to }) => {
    return !newItems.find((item) => item.name === name) && !areDatesClose(to);
  });

  removedItems.forEach((item) => {
    const index = oldItems.findIndex(({ name }) => name === item.name);
    outputItems.splice(index, 0, { ...item, status: "REMOVED" });
  });

  return outputItems.reduce<typeof outputItems>((acc, i) => {
    const oldItem = oldItems.find(({ name, from, to }) => {
      const nameMatch = name === i.name;
      const fromMatch =
        (!from && !i.from) || (from && i.from && areDatesClose(from, i.from));
      const toMatch = areDatesClose(to, i.to);

      return nameMatch && (fromMatch || toMatch);
    });

    if (!oldItem) {
      acc.push({ ...i, status: "ADDED" });
      return acc;
    }

    const isTodayUpdatedToNull =
      !i.from && oldItem.from && areDatesClose(oldItem.from);

    if (
      !isTodayUpdatedToNull &&
      (i.from !== oldItem.from || i.to !== oldItem.to)
    ) {
      acc.push({ ...i, status: "UPDATED" });
      return acc;
    }

    acc.push(i);
    return acc;
  }, []);
};
