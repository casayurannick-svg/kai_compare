import type { PriceDataset, GroceryItem, Store, StoreId, Basket, StoreTotals, SmartSplitResult } from "./types";

// ─── Data Fetcher ─────────────────────────────────────────────────────────────
// This abstraction allows a future cron scraper to overwrite data/auckland_staples.json
// without touching any UI code. For SSG/ISR, just call fetchPriceData() from
// a Server Component or getStaticProps and pass props down.

let _cache: PriceDataset | null = null;

export async function fetchPriceData(): Promise<PriceDataset> {
  if (_cache) return _cache;
  // Dynamic import works for both local JSON and future API endpoint swap
  const raw = await import("../../data/auckland_staples.json");
  _cache = raw.default as PriceDataset;
  return _cache;
}

// ─── Utility Helpers ──────────────────────────────────────────────────────────

export function getStoreById(stores: Store[], id: StoreId): Store | undefined {
  return stores.find((s) => s.id === id);
}

/** Returns the store ID with the lowest available price for a given item */
export function getCheapestStoreForItem(item: GroceryItem): StoreId | null {
  const entries = Object.entries(item.prices) as [StoreId, (typeof item.prices)[StoreId]][];
  const available = entries.filter(([, p]) => p.inStock && p.price !== null);
  if (available.length === 0) return null;
  return available.reduce((best, curr) => (curr[1].price! < best[1].price! ? curr : best))[0];
}

/** Compute the total basket cost for every store */
export function computeStoreTotals(
  items: GroceryItem[],
  basket: Basket,
  storeIds: StoreId[]
): StoreTotals[] {
  const itemMap = new Map(items.map((i) => [i.id, i]));

  return storeIds.map((storeId) => {
    let total = 0;
    let itemCount = 0;
    const missingItems: string[] = [];

    for (const [itemId, qty] of Object.entries(basket)) {
      if (qty === 0) continue;
      const item = itemMap.get(itemId);
      if (!item) continue;
      const priceEntry = item.prices[storeId];
      if (!priceEntry || !priceEntry.inStock || priceEntry.price === null) {
        missingItems.push(item.name);
      } else {
        total += priceEntry.price * qty;
        itemCount += 1;
      }
    }

    return {
      storeId,
      storeName: storeId,
      total: Math.round(total * 100) / 100,
      itemCount,
      missingItems,
    };
  });
}

/** Find the cheapest single store (by total, ignoring missing items for completeness scoring) */
export function cheapestSingleStore(totals: StoreTotals[]): StoreTotals {
  return totals.reduce((best, curr) => (curr.total < best.total ? curr : best));
}

/** Compute the Smart Split: per-item pick the cheapest available store */
export function computeSmartSplit(
  items: GroceryItem[],
  basket: Basket,
  stores: Store[]
): SmartSplitResult {
  const storeIds = stores.map((s) => s.id);
  const totals = computeStoreTotals(items, basket, storeIds);
  const single = cheapestSingleStore(totals);

  // Group items by their cheapest store
  const splitMap = new Map<StoreId, Array<{ itemId: string; itemName: string; quantity: number; lineTotal: number }>>();
  storeIds.forEach((id) => splitMap.set(id, []));

  const itemMap = new Map(items.map((i) => [i.id, i]));

  for (const [itemId, qty] of Object.entries(basket)) {
    if (qty === 0) continue;
    const item = itemMap.get(itemId);
    if (!item) continue;
    const cheapestStoreId = getCheapestStoreForItem(item);
    if (!cheapestStoreId) continue;
    const price = item.prices[cheapestStoreId].price!;
    splitMap.get(cheapestStoreId)!.push({
      itemId,
      itemName: item.name,
      quantity: qty,
      lineTotal: Math.round(price * qty * 100) / 100,
    });
  }

  const splitPlan = storeIds
    .filter((id) => (splitMap.get(id)?.length ?? 0) > 0)
    .map((storeId) => {
      const storeItems = splitMap.get(storeId)!;
      const storeTotal = Math.round(storeItems.reduce((s, i) => s + i.lineTotal, 0) * 100) / 100;
      const store = stores.find((s) => s.id === storeId)!;
      return { storeId, storeName: store.name, items: storeItems, storeTotal };
    });

  const splitGrandTotal = Math.round(splitPlan.reduce((s, p) => s + p.storeTotal, 0) * 100) / 100;
  const savingsVsSingleCheapest = Math.round((single.total - splitGrandTotal) * 100) / 100;

  return { savingsVsSingleCheapest, cheapestSingleStore: single, splitPlan, splitGrandTotal };
}
