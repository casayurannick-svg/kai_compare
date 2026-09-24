"use client";

import { useState, useMemo, useCallback } from "react";
import { GroceryItem, Store, StoreId, Basket } from "@/lib/types";
import { computeStoreTotals, computeSmartSplit } from "@/lib/data";
import Header from "@/components/Header";
import ComparisonGrid from "@/components/ComparisonGrid";
import BasketPanel from "@/components/BasketPanel";
import SmartSplitCard from "@/components/SmartSplitCard";
import ShoppingListModal from "@/components/ShoppingListModal";
import { List, ShoppingCart, Trash2 } from "lucide-react";

interface AppClientProps {
  items: GroceryItem[];
  stores: Store[];
  lastUpdated: string;
}

export default function AppClient({ items, stores, lastUpdated }: AppClientProps) {
  const [basket, setBasket] = useState<Basket>({});
  const [modalOpen, setModalOpen] = useState(false);

  const storeIds = useMemo(() => stores.map((s) => s.id as StoreId), [stores]);

  const handleQuantityChange = useCallback((itemId: string, delta: number) => {
    setBasket((prev) => {
      const current = prev[itemId] ?? 0;
      const next = Math.max(0, current + delta);
      if (next === current) return prev;
      return { ...prev, [itemId]: next };
    });
  }, []);

  const clearBasket = useCallback(() => setBasket({}), []);

  const totals = useMemo(
    () => computeStoreTotals(items, basket, storeIds),
    [items, basket, storeIds]
  );

  const smartSplit = useMemo(
    () => computeSmartSplit(items, basket, stores),
    [items, basket, stores]
  );

  // Enrich totals with store names
  const enrichedTotals = useMemo(
    () =>
      totals.map((t) => ({
        ...t,
        storeName: stores.find((s) => s.id === t.storeId)?.name ?? t.storeId,
      })),
    [totals, stores]
  );

  const basketItemCount = useMemo(
    () => Object.values(basket).filter((q) => q > 0).length,
    [basket]
  );

  const hasBasketItems = basketItemCount > 0;

  return (
    <>
      <Header stores={stores} lastUpdated={lastUpdated} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {/* Intro banner */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 px-5 py-4 flex items-start gap-3">
          <span className="text-2xl">🇳🇿</span>
          <div>
            <p className="font-semibold text-slate-700 text-sm">
              Compare staple grocery prices across Auckland&apos;s major supermarkets.
            </p>
            <p className="text-slate-500 text-xs mt-0.5">
              Add items to your basket with the{" "}
              <span className="font-bold text-amber-600">+</span> buttons to see real-time totals
              and find the best deal — or split your run across multiple stores.
            </p>
          </div>
        </div>

        <ComparisonGrid
          items={items}
          stores={stores}
          basket={basket}
          onQuantityChange={handleQuantityChange}
        />

        <BasketPanel stores={stores} totals={enrichedTotals} basketItemCount={basketItemCount} />

        {hasBasketItems && (
          <SmartSplitCard result={smartSplit} stores={stores} />
        )}
      </main>

      {/* Sticky action bar (mobile-first) */}
      {hasBasketItems && (
        <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-slate-100 shadow-2xl z-40 safe-bottom">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500">
                <span className="font-bold text-slate-700">{basketItemCount}</span> item type
                {basketItemCount !== 1 ? "s" : ""} in basket
              </p>
              {smartSplit.savingsVsSingleCheapest > 0.01 && (
                <p className="text-xs text-emerald-600 font-semibold truncate">
                  Smart Split saves you ${smartSplit.savingsVsSingleCheapest.toFixed(2)}!
                </p>
              )}
            </div>

            <button
              onClick={clearBasket}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors"
              aria-label="Clear basket"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition-colors"
            >
              <List className="w-4 h-4" />
              Shopping List
            </button>
          </div>
        </div>
      )}

      {/* Shopping list modal */}
      <ShoppingListModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        result={smartSplit}
        stores={stores}
      />
    </>
  );
}
