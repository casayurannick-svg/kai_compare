import type {
  PriceDataset,
  GroceryItem,
  Chain,
  ResolvedBranch,
  Basket,
  StoreTotals,
  SmartSplitResult,
  ChainId,
  BranchId,
} from "./types";
import { getDefaultBranches, type BranchWithDistance } from "./auckland_locations";

// ─── Data Fetcher ─────────────────────────────────────────────────────────────

let _cache: PriceDataset | null = null;

export async function fetchPriceData(): Promise<PriceDataset> {
  if (_cache) return _cache;
  const raw = await import("../../data/auckland_staples.json");
  _cache = raw.default as unknown as PriceDataset;
  return _cache;
}

// ─── Branch Resolution ────────────────────────────────────────────────────────

/**
 * Merge raw BranchWithDistance (geo data) with Chain UI metadata (colors, emoji)
 * to produce the ResolvedBranch objects consumed by all UI components.
 */
export function resolveBranches(
  branches: BranchWithDistance[],
  chains: Chain[]
): ResolvedBranch[] {
  const chainMap = new Map(chains.map((c) => [c.id, c]));
  return branches.map((b) => {
    const chain = chainMap.get(b.chainId as ChainId)!;
    // Extract the part after the chain name for the short display name
    // e.g. "PAK'nSAVE Royal Oak" → "Royal Oak"
    const branchDisplayName =
      b.name.replace(chain.name, "").replace(chain.shortName, "").trim() || b.name;
    return {
      branchId: b.id,
      chainId: b.chainId as ChainId,
      branchDisplayName,
      fullName: b.name,
      address: b.address,
      lat: b.lat,
      lng: b.lng,
      distanceKm: b.distanceKm,
      color: chain.color,
      textColor: chain.textColor,
      logoEmoji: chain.logoEmoji,
      chainShortName: chain.shortName,
    };
  });
}

/** Resolve the default set of branches (no suburb selected). */
export function resolveDefaultBranches(chains: Chain[]): ResolvedBranch[] {
  return resolveBranches(getDefaultBranches(), chains);
}

// ─── Price Lookup ─────────────────────────────────────────────────────────────

/**
 * Among the currently filtered ResolvedBranches, return the branchId with the
 * lowest available price for a given item (used for ✓ Best badge).
 */
export function getCheapestBranchForItem(
  item: GroceryItem,
  resolvedBranches: ResolvedBranch[]
): BranchId | null {
  const available = resolvedBranches.filter((b) => {
    const p = item.prices[b.branchId];
    return p && p.inStock && p.price !== null;
  });
  if (available.length === 0) return null;
  return available.reduce((best, curr) =>
    item.prices[curr.branchId].price! < item.prices[best.branchId].price! ? curr : best
  ).branchId;
}

// ─── Basket Computation ───────────────────────────────────────────────────────

/** Compute per-branch basket totals for the set of filtered branches. */
export function computeStoreTotals(
  items: GroceryItem[],
  basket: Basket,
  resolvedBranches: ResolvedBranch[]
): StoreTotals[] {
  const itemMap = new Map(items.map((i) => [i.id, i]));

  return resolvedBranches.map((branch) => {
    let total = 0;
    let itemCount = 0;
    const missingItems: string[] = [];

    for (const [itemId, qty] of Object.entries(basket)) {
      if (qty === 0) continue;
      const item = itemMap.get(itemId);
      if (!item) continue;
      const entry = item.prices[branch.branchId];
      if (!entry || !entry.inStock || entry.price === null) {
        missingItems.push(item.name);
      } else {
        total += entry.price * qty;
        itemCount += 1;
      }
    }

    return {
      branchId: branch.branchId,
      chainId: branch.chainId,
      storeName: branch.chainShortName,
      branchDisplayName: branch.branchDisplayName,
      total: Math.round(total * 100) / 100,
      itemCount,
      missingItems,
    };
  });
}

/** Return the StoreTotals entry with the lowest total cost. */
export function cheapestSingleStore(totals: StoreTotals[]): StoreTotals {
  return totals.reduce((best, curr) =>
    curr.total > 0 && (curr.total < best.total || best.total === 0) ? curr : best
  );
}

// ─── Smart Split ──────────────────────────────────────────────────────────────

/**
 * For each basket item, pick the filtered branch with the lowest price.
 * Returns savings vs. buying everything at the single cheapest branch.
 */
export function computeSmartSplit(
  items: GroceryItem[],
  basket: Basket,
  resolvedBranches: ResolvedBranch[]
): SmartSplitResult {
  const totals = computeStoreTotals(items, basket, resolvedBranches);
  const single = cheapestSingleStore(totals);

  const itemMap = new Map(items.map((i) => [i.id, i]));
  const splitMap = new Map<BranchId, SmartSplitResult["splitPlan"][number]>();

  resolvedBranches.forEach((b) => {
    splitMap.set(b.branchId, {
      branchId: b.branchId,
      chainId: b.chainId,
      storeName: b.chainShortName,
      branchDisplayName: b.branchDisplayName,
      address: b.address,
      items: [],
      storeTotal: 0,
    });
  });

  for (const [itemId, qty] of Object.entries(basket)) {
    if (qty === 0) continue;
    const item = itemMap.get(itemId);
    if (!item) continue;
    const cheapestBranchId = getCheapestBranchForItem(item, resolvedBranches);
    if (!cheapestBranchId) continue;
    const price = item.prices[cheapestBranchId].price!;
    const lineTotal = Math.round(price * qty * 100) / 100;
    const entry = splitMap.get(cheapestBranchId)!;
    entry.items.push({ itemId, itemName: item.name, quantity: qty, lineTotal });
    entry.storeTotal = Math.round((entry.storeTotal + lineTotal) * 100) / 100;
  }

  const splitPlan = [...splitMap.values()].filter((e) => e.items.length > 0);
  const splitGrandTotal = Math.round(
    splitPlan.reduce((s, p) => s + p.storeTotal, 0) * 100
  ) / 100;
  const savingsVsSingleCheapest = Math.round((single.total - splitGrandTotal) * 100) / 100;

  return { savingsVsSingleCheapest, cheapestSingleStore: single, splitPlan, splitGrandTotal };
}
