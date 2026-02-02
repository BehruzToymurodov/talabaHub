import type { Deal } from "../../types";
import { withLatency } from "../../utils/latency";
import { readStorage, writeStorage } from "../storage/storage";

function getDeals() {
  return readStorage<Deal[]>("deals", []);
}

function saveDeals(deals: Deal[]) {
  writeStorage("deals", deals);
}

export const dealsApi = {
  list: async () =>
    withLatency(() => {
      return getDeals();
    }, 300),
  getById: async (id: string) =>
    withLatency(() => {
      const deal = getDeals().find((item) => item.id === id);
      if (!deal) throw new Error("Deal not found");
      return deal;
    }, 250),
  create: async (payload: Deal) =>
    withLatency(() => {
      const deals = getDeals();
      deals.unshift(payload);
      saveDeals(deals);
      return payload;
    }, 400),
  update: async (payload: Deal) =>
    withLatency(() => {
      const deals = getDeals();
      const index = deals.findIndex((item) => item.id === payload.id);
      if (index === -1) throw new Error("Deal not found");
      deals[index] = payload;
      saveDeals(deals);
      return payload;
    }, 400),
  remove: async (id: string) =>
    withLatency(() => {
      const deals = getDeals();
      const next = deals.filter((item) => item.id !== id);
      saveDeals(next);
      return true;
    }, 300),
};
