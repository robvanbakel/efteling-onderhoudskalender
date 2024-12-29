import { differenceInDays, isToday } from "date-fns";

export type Status = "ADDED" | "REMOVED" | "UPDATED";

export type Item = {
  name: string;
  from: string | null;
  to: string;
};

export const appendStatus = (oldItems: Item[], newItems: Item[]) => {
  const outputItems: (Item & { status?: Status })[] = newItems;

  const removedItems = oldItems.filter(({ name, to }) => {
    return !newItems.find((item) => item.name === name) && !isToday(to);
  });

  removedItems.forEach((item) => {
    const index = oldItems.findIndex(({ name }) => name === item.name);
    outputItems.splice(index, 0, { ...item, status: "REMOVED" });
  });

  return outputItems.reduce<typeof outputItems>((acc, i) => {
    const oldItem = oldItems.find(({ name, from, to }) => {
      const nameMatch = name === i.name;
      const fromMatch =
        (!from && !i.from) ||
        (from && i.from && Math.abs(differenceInDays(from, i.from)) < 5);
      const toMatch = Math.abs(differenceInDays(to, i.to)) < 5;

      return nameMatch && (fromMatch || toMatch);
    });

    if (!oldItem) {
      acc.push({ ...i, status: "ADDED" });
      return acc;
    }

    if (i.from !== oldItem.from || i.to !== oldItem.to) {
      acc.push({ ...i, status: "UPDATED" });
      return acc;
    }

    acc.push(i);
    return acc;
  }, []);
};
