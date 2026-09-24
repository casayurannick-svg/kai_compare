// ─── Chain / Store Types ──────────────────────────────────────────────────────

export type ChainId = "paknsave" | "woolworths" | "newworld" | "warehouse";
/** @deprecated Use ChainId — kept for backward compat */
export type StoreId = ChainId;

export interface Chain {
  id: ChainId;
  name: string;
  shortName: string;
  color: string;
  textColor: string;
  branches: string[];   // human-readable branch list for display
  logoEmoji: string;
}

// ─── Branch Types ─────────────────────────────────────────────────────────────

export type BranchId = string; // e.g. "pns-royal-oak"

export interface Branch {
  id: BranchId;
  chainId: ChainId;
  name: string;       // full name: "PAK'nSAVE Royal Oak"
  address: string;
  lat: number;
  lng: number;
}

/**
 * A branch resolved with its parent chain's UI metadata and the computed
 * distance from the currently selected suburb. Used throughout the UI.
 */
export interface ResolvedBranch {
  branchId: BranchId;
  chainId: ChainId;
  branchDisplayName: string; // "Royal Oak"
  fullName: string;          // "PAK'nSAVE Royal Oak"
  address: string;
  lat: number;
  lng: number;
  distanceKm: number | null; // null = no suburb selected
  // Inherited from Chain for rendering
  color: string;
  textColor: string;
  logoEmoji: string;
  chainShortName: string;
}

// ─── Price / Item Types ───────────────────────────────────────────────────────

export interface StorePrice {
  price: number | null;
  brandLabel: string | null;
  inStock: boolean;
  unitPrice: number | null;
  lastUpdatedIso: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  unitMeasure: string;
  emoji: string;
  prices: Record<BranchId, StorePrice>; // keyed by branch ID
}

// ─── Dataset ──────────────────────────────────────────────────────────────────

export interface PriceDataset {
  meta: {
    version: string;
    region: string;
    currency: string;
    lastUpdatedIso: string;
    note: string;
  };
  chains: Chain[];
  branches: Branch[];
  items: GroceryItem[];
}

// ─── Basket Types ─────────────────────────────────────────────────────────────

export type Basket = Record<string, number>; // itemId → quantity

// ─── Computed / Output Types ──────────────────────────────────────────────────

export interface StoreTotals {
  branchId: BranchId;
  chainId: ChainId;
  storeName: string;        // chain short name
  branchDisplayName: string;
  total: number;
  itemCount: number;
  missingItems: string[];
}

export interface SmartSplitResult {
  savingsVsSingleCheapest: number;
  cheapestSingleStore: StoreTotals;
  splitPlan: Array<{
    branchId: BranchId;
    chainId: ChainId;
    storeName: string;
    branchDisplayName: string;
    address: string;
    items: Array<{
      itemId: string;
      itemName: string;
      quantity: number;
      lineTotal: number;
    }>;
    storeTotal: number;
  }>;
  splitGrandTotal: number;
}
