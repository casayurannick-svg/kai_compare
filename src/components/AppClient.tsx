"use client";

import { useState, useMemo, useCallback } from "react";
import { GroceryItem, Basket, Chain } from "@/lib/types";
import { computeStoreTotals, computeSmartSplit, resolveBranches, resolveDefaultBranches } from "@/lib/data";
import { AUCKLAND_SUBURBS, getNearestBranchesWithinRadius, getNearestSuburbName } from "@/lib/auckland_locations";
import Header from "@/components/Header";
import ComparisonGrid from "@/components/ComparisonGrid";
import BasketPanel from "@/components/BasketPanel";
import SmartSplitCard from "@/components/SmartSplitCard";
import ShoppingListModal from "@/components/ShoppingListModal";
import { List, Trash2 } from "lucide-react";

interface AppClientProps {
  items: GroceryItem[];
  chains: Chain[];
  lastUpdated: string;
}

export default function AppClient({ items, chains, lastUpdated }: AppClientProps) {
  const [basket, setBasket] = useState<Basket>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [suburbName, setSuburbName] = useState<string>("");

  // Branch resolution based on coords
  const { branches: activeBranches, expanded } = useMemo(() => {
    if (!coords) return { branches: resolveDefaultBranches(chains), expanded: false };
    const result = getNearestBranchesWithinRadius(coords.lat, coords.lng, 5.0);
    return { branches: resolveBranches(result.branches, chains), expanded: result.expanded };
  }, [coords, chains]);

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
    () => computeStoreTotals(items, basket, activeBranches),
    [items, basket, activeBranches]
  );

  const smartSplit = useMemo(
    () => computeSmartSplit(items, basket, activeBranches),
    [items, basket, activeBranches]
  );

  const basketItemCount = useMemo(
    () => Object.values(basket).filter((q) => q > 0).length,
    [basket]
  );

  const hasBasketItems = basketItemCount > 0;

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setSuburbName(getNearestSuburbName(latitude, longitude));
      },
      (err) => alert("Could not fetch location: " + err.message)
    );
  };

  const handleSelectSuburb = (name: string) => {
    if (!name) {
      setCoords(null);
      setSuburbName("");
      return;
    }
    const sub = AUCKLAND_SUBURBS.find(s => s.name === name);
    if (sub) {
      setCoords({ lat: sub.lat, lng: sub.lng });
      setSuburbName(sub.name);
    }
  };

  return (
    <>
      <Header 
        branches={activeBranches} 
        lastUpdated={lastUpdated} 
        suburbName={suburbName}
        onSelectSuburb={handleSelectSuburb}
        onLocateMe={handleLocateMe}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {/* Intro banner */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 px-5 py-4 flex items-start gap-3">
          <span className="text-2xl">🇳🇿</span>
          <div className="flex-1">
            <p className="font-semibold text-slate-700 text-sm">
              Compare staple grocery prices across Auckland&apos;s major supermarkets.
            </p>
            <p className="text-slate-500 text-xs mt-0.5">
              Select your suburb to find the nearest branches and see their specific prices. Add items to your basket to calculate the <b>Smart Split</b> savings.
            </p>
          </div>
        </div>

        {expanded && coords && (
          <div className="mb-6 rounded-xl bg-blue-50 border border-blue-200 p-3 text-sm text-blue-700">
            <strong>Note:</strong> Expanded radius to find your nearest branches.
          </div>
        )}

        <ComparisonGrid
          items={items}
          branches={activeBranches}
          basket={basket}
          onQuantityChange={handleQuantityChange}
        />

        <BasketPanel branches={activeBranches} totals={totals} basketItemCount={basketItemCount} />

        {hasBasketItems && (
          <SmartSplitCard result={smartSplit} branches={activeBranches} />
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
        branches={activeBranches}
      />
    </>
  );
}
