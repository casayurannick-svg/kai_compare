// ─── Core Domain Types ────────────────────────────────────────────────────────

export interface StorePrice {
  price: number | null;
  brandLabel: string | null;
  inStock: boolean;
  unitPrice: number | null; // price per kg/L/unit for normalised comparison
  lastUpdatedIso: string;
}

export type StoreId = "paknsave" | "woolworths" | "newworld" | "warehouse";

export interface Store {
  id: StoreId;
  name: string;
  shortName: string;
  color: string;
  textColor: string;
  branches: string[];
  logoEmoji: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  unitMeasure: string;
  emoji: string;
  prices: Record<StoreId, StorePrice>;
}

export interface PriceDataset {
  meta: {
    version: string;
    region: string;
    currency: string;
    lastUpdatedIso: string;
    note: string;
  };
  stores: Store[];
  items: GroceryItem[];
}

// ─── Basket Types ─────────────────────────────────────────────────────────────

export interface BasketEntry {
  itemId: string;
  quantity: number;
}

export type Basket = Record<string, number>; // itemId → quantity

// ─── Computed Types ───────────────────────────────────────────────────────────

export interface StoreTotals {
  storeId: StoreId;
  storeName: string;
  total: number;
  itemCount: number; // number of basket items available at this store
  missingItems: string[]; // item names not available
}

export interface SmartSplitResult {
  savingsVsSingleCheapest: number;
  cheapestSingleStore: StoreTotals;
  splitPlan: Array<{
    storeId: StoreId;
    storeName: string;
    items: Array<{ itemId: string; itemName: string; quantity: number; lineTotal: number }>;
    storeTotal: number;
  }>;
  splitGrandTotal: number;
}
