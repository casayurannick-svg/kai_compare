import { Basket } from "./types";

/**
 * Baseline 9 core Auckland staples specification (KC-STORY-01).
 * Maps directly to the 9 essential grocery staples.
 */
export const DEFAULT_STAPLES_BASELINE: Record<string, number> = {
  "rice-1kg": 1,
  "bread-loaf": 1,
  "eggs-dozen": 1,
  "flour-1.5kg": 1,
  "milk-2l": 1,
  "cheese-1kg": 1,
  "butter-500g": 1,
  "pork-chops-1kg": 1,
  "beef-mince-1kg": 1,
};

/**
 * Bidirectional alias mapping between spec keys and canonical dataset IDs.
 */
export const STAPLE_ALIAS_MAP: Record<string, string> = {
  "rice-1kg": "white-rice-1kg",
  "bread-loaf": "sandwich-bread-700g",
  "flour-1.5kg": "plain-flour-1-5kg",
  "milk-2l": "standard-milk-2l",
  "cheese-1kg": "edam-cheese-1kg",
  // reverse mappings
  "white-rice-1kg": "rice-1kg",
  "sandwich-bread-700g": "bread-loaf",
  "plain-flour-1-5kg": "flour-1.5kg",
  "standard-milk-2l": "milk-2l",
  "edam-cheese-1kg": "cheese-1kg",
};

/**
 * Resolves an item ID to its canonical dataset ID.
 */
export function resolveCanonicalId(id: string): string {
  return STAPLE_ALIAS_MAP[id] || id;
}

/**
 * Creates a Basket object wrapped in a Proxy so that both
 * canonical dataset IDs and shorthand spec aliases can be accessed transparently.
 */
export function createBasket(initial: Basket = {}): Basket {
  const base: Basket = {};
  for (const [key, qty] of Object.entries(initial)) {
    const canonicalKey = STAPLE_ALIAS_MAP[key] || key;
    base[canonicalKey] = qty;
  }

  return new Proxy(base, {
    get(target, prop) {
      if (typeof prop === "string") {
        if (prop in target) return target[prop];
        const alias = STAPLE_ALIAS_MAP[prop];
        if (alias && alias in target) return target[alias];
      }
      return target[prop as string];
    },
    has(target, prop) {
      if (prop in target) return true;
      if (typeof prop === "string") {
        const alias = STAPLE_ALIAS_MAP[prop];
        return alias ? alias in target : false;
      }
      return false;
    },
  });
}

/**
 * Factory for the default pre-populated staples basket with quantity 1 for all 9 core staples.
 */
export function createDefaultBasket(): Basket {
  return createBasket(DEFAULT_STAPLES_BASELINE);
}

export const DEFAULT_BASKET: Basket = createDefaultBasket();
