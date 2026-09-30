import type { GroceryItem, Basket, ResolvedBranch } from "./types";
import { resolveCanonicalId } from "./basket";

export interface StoreVerdictRank {
  branchId: string;
  chainId: string;
  storeName: string;
  fullName: string;
  branchDisplayName: string;
  distanceKm: number | null;
  total: number;
  itemCount: number;
  missingItems: string[];
  logoEmoji?: string;
  color?: string;
}

export interface WinnerVerdict {
  winner: StoreVerdictRank;
  runnerUp: StoreVerdictRank | null;
  third: StoreVerdictRank | null;
  rankedStores: StoreVerdictRank[];
  winnerTotal: number;
  runnerUpTotal: number | null;
  thirdTotal: number | null;
  deltaVsSecond: number | null;
  deltaVsThird: number | null;
  isMarginal: boolean;
  radiusExpanded?: boolean;
  expandedChainNames?: string[];
  expandedChainName?: string;
}

export interface VerdictInputOptions {
  branches?: ResolvedBranch[];
  stores?: ResolvedBranch[];
  basket?: Basket;
  items?: GroceryItem[];
}

/**
 * Calculates the winner verdict, ranks stores by basket total ascending,
 * and computes price deltas vs the 2nd and 3rd place stores.
 *
 * Supports overloaded parameter signatures:
 * - calculateWinnerVerdict(items, basket, branches)
 * - calculateWinnerVerdict(branches, basket, items)
 * - calculateWinnerVerdict({ items, basket, branches })
 */
export function calculateWinnerVerdict(
  arg1: GroceryItem[] | ResolvedBranch[] | VerdictInputOptions,
  arg2?: Basket | GroceryItem[] | ResolvedBranch[],
  arg3?: ResolvedBranch[] | GroceryItem[]
): WinnerVerdict | null {
  let items: GroceryItem[] = [];
  let basket: Basket = {};
  let branches: ResolvedBranch[] = [];

  // Handle object input
  if (arg1 && !Array.isArray(arg1) && typeof arg1 === "object") {
    items = arg1.items || [];
    basket = arg1.basket || {};
    branches = arg1.branches || arg1.stores || [];
  } else if (Array.isArray(arg1)) {
    // Detect if arg1 is items or branches
    const firstElem = arg1[0];
    if (firstElem && "branchId" in firstElem) {
      // (branches, basket, items)
      branches = arg1 as ResolvedBranch[];
      basket = (arg2 as Basket) || {};
      items = (arg3 as GroceryItem[]) || [];
    } else {
      // (items, basket, branches)
      items = arg1 as GroceryItem[];
      basket = (arg2 as Basket) || {};
      branches = (arg3 as ResolvedBranch[]) || [];
    }
  }

  // Active basket quantities check
  const activeEntries = Object.entries(basket || {}).filter(([, qty]) => qty > 0);
  if (activeEntries.length === 0 || branches.length === 0 || items.length === 0) {
    return null;
  }

  const activeItemIds = new Set(activeEntries.map(([id]) => id));
  const itemMap = new Map(items.map((i) => [i.id, i]));

  // Calculate total basket cost per store
  const storeRanks: StoreVerdictRank[] = branches.map((branch) => {
    let total = 0;
    let itemCount = 0;
    const missingItems: string[] = [];

    for (const [itemId, qty] of activeEntries) {
      const canonicalKey = resolveCanonicalId(itemId);
      const item = itemMap.get(canonicalKey) || itemMap.get(itemId);
      if (!item) continue;
      const priceEntry = item.prices?.[branch.branchId];
      if (!priceEntry || !priceEntry.inStock || priceEntry.price === null) {
        missingItems.push(item.name);
      } else {
        total += priceEntry.price * qty;
        itemCount++;
      }
    }

    return {
      branchId: branch.branchId,
      chainId: branch.chainId,
      storeName: branch.chainShortName,
      fullName: branch.fullName,
      branchDisplayName: branch.branchDisplayName,
      distanceKm: branch.distanceKm,
      total: Math.round(total * 100) / 100,
      itemCount,
      missingItems,
      logoEmoji: branch.logoEmoji,
      color: branch.color,
    };
  });

  // Stores that have all active basket items in stock are preferred
  const fullStockStores = storeRanks.filter(
    (s) => s.itemCount === activeItemIds.size && s.missingItems.length === 0 && s.total > 0
  );

  const candidates = (
    fullStockStores.length > 0 ? fullStockStores : storeRanks.filter((s) => s.total > 0)
  ).sort((a, b) => a.total - b.total);

  if (candidates.length === 0) {
    return null;
  }

  // Ascending order: #1 Winner, #2 Runner-up, #3 Third
  const winner = candidates[0];
  const runnerUp = candidates.length > 1 ? candidates[1] : null;
  const third = candidates.length > 2 ? candidates[2] : null;

  const winnerTotal = winner.total;
  const runnerUpTotal = runnerUp ? runnerUp.total : null;
  const thirdTotal = third ? third.total : null;

  // Compute deltas:
  // deltaVsSecond = runnerUpTotal - winnerTotal
  // deltaVsThird = thirdTotal - winnerTotal
  const deltaVsSecond =
    runnerUpTotal !== null ? Math.round((runnerUpTotal - winnerTotal) * 100) / 100 : null;
  const deltaVsThird =
    thirdTotal !== null ? Math.round((thirdTotal - winnerTotal) * 100) / 100 : null;

  // Set isMarginal = deltaVsSecond < 0.75
  const isMarginal = deltaVsSecond !== null ? deltaVsSecond < 0.75 : false;

  // KC-STORY-02: Check if any included store was found at > 5.0 km
  const expandedBranches = branches.filter((b) => (b.distanceKm ?? 0) > 5.0);
  const radiusExpanded = expandedBranches.length > 0;
  const expandedChainNames = Array.from(
    new Set(expandedBranches.map((b) => b.chainShortName || b.branchDisplayName || b.fullName))
  );
  const expandedChainName =
    expandedChainNames.length > 0
      ? expandedChainNames.length === 2
        ? `${expandedChainNames[0]} & ${expandedChainNames[1]}`
        : expandedChainNames.join(", ")
      : undefined;

  return {
    winner,
    runnerUp,
    third,
    rankedStores: candidates,
    winnerTotal,
    runnerUpTotal,
    thirdTotal,
    deltaVsSecond,
    deltaVsThird,
    isMarginal,
    radiusExpanded,
    expandedChainNames,
    expandedChainName,
  };
}

export const computeWinnerVerdict = calculateWinnerVerdict;

// Re-export KC-STORY-02 distinct chain selection functions
export {
  selectTop3DistinctChains,
  getTop3DistinctChains,
  getNearestBranchesWithinRadius,
  PRIMARY_CHAINS,
  FALLBACK_CHAIN,
  CHAIN_NAMES,
} from "./auckland_locations";
export type { NearestBranchesResult } from "./auckland_locations";
