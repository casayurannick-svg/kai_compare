"use client";

import { useState, useMemo, useCallback } from "react";
import { GroceryItem, Basket, Chain } from "@/lib/types";
import { computeStoreTotals, computeSmartSplit, resolveBranches, resolveDefaultBranches } from "@/lib/data";
import {
  DEFAULT_BASKET,
  DEFAULT_STAPLES_BASELINE,
  createDefaultBasket,
  createBasket,
  resolveCanonicalId,
} from "@/lib/basket";
import { AUCKLAND_SUBURBS, getNearestBranchesWithinRadius, getNearestSuburbName } from "@/lib/auckland_locations";
import { CalculationMode } from "@/lib/driving";
import Header from "@/components/Header";
import ComparisonGrid from "@/components/ComparisonGrid";
import BasketPanel from "@/components/BasketPanel";
import SmartSplitCard from "@/components/SmartSplitCard";
import WinnerVerdictCard from "@/components/WinnerVerdictCard";
import ShoppingListModal from "@/components/ShoppingListModal";
import Footer from "@/components/Footer";
import FeedbackModal from "@/components/FeedbackModal";
import TermsModal from "@/components/TermsModal";
import { List, Trash2 } from "lucide-react";

interface AppClientProps {
  items: GroceryItem[];
  chains: Chain[];
  lastUpdated: string;
}

// Pre-populated default 9-staple baseline basket (KC-STORY-01)
// rice-1kg: 1, bread-loaf: 1, eggs-dozen: 1, flour-1.5kg: 1, milk-2l: 1,
// cheese-1kg: 1, butter-500g: 1, pork-chops-1kg: 1, beef-mince-1kg: 1
export { DEFAULT_BASKET, DEFAULT_STAPLES_BASELINE };

export default function AppClient({ items, chains, lastUpdated }: AppClientProps) {
  const [basket, setBasket] = useState<Basket>(() => createDefaultBasket());
  const [modalOpen, setModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [suburbName, setSuburbName] = useState<string>("");
  const [calculationMode, setCalculationMode] = useState<CalculationMode>("FUEL");

  // Branch resolution based on coords (KC-STORY-02)
  const { branches: activeBranches, expanded, expandedChainName } = useMemo(() => {
    if (!coords) {
      return {
        branches: resolveDefaultBranches(chains),
        expanded: false,
        expandedChainName: undefined,
      };
    }
    const result = getNearestBranchesWithinRadius(coords.lat, coords.lng, 5.0);
    return {
      branches: resolveBranches(result.branches, chains),
      expanded: result.expanded,
      expandedChainName: result.expandedChainName,
    };
  }, [coords, chains]);

  const handleQuantityChange = useCallback((itemId: string, delta: number) => {
    setBasket((prev) => {
      const canonicalKey = resolveCanonicalId(itemId);
      const current = prev[canonicalKey] ?? prev[itemId] ?? 0;
      const next = Math.max(0, current + delta);
      if (next === current) return prev;
      return createBasket({ ...prev, [canonicalKey]: next });
    });
  }, []);

  const clearBasket = useCallback(() => setBasket(createBasket({})), []);

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
        {/* Intro banner with soft warm pastel styling */}
        <div className="mb-8 rounded-3xl bg-amber-50/70 border border-amber-200/60 px-5 py-4 flex items-start gap-3.5 shadow-2xs">
          <span className="text-2xl shrink-0">🇳🇿</span>
          <div className="flex-1">
            <p className="font-bold text-stone-800 text-sm">
              Compare staple grocery prices across Auckland&apos;s major supermarkets.
            </p>
            <p className="text-stone-600 text-xs mt-0.5 leading-relaxed">
              Select your suburb to find the nearest branches and see their specific prices. Add items to your basket to calculate the <b>Smart Split</b> savings.
            </p>
          </div>
        </div>

        {expanded && coords && (
          <div className="mb-6 rounded-2xl bg-sky-50/80 border border-sky-200/70 px-4 py-2.5 flex items-center gap-2.5 text-xs sm:text-sm text-sky-900 font-medium shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
            <span>
              {expandedChainName
                ? `Expanded search to find nearest ${expandedChainName}`
                : "Expanded search to find nearest branches"}
            </span>
          </div>
        )}

        <WinnerVerdictCard
          items={items}
          basket={basket}
          branches={activeBranches}
          radiusExpanded={expanded}
          expandedChainName={expandedChainName}
          calculationMode={calculationMode}
          onCalculationModeChange={setCalculationMode}
        />

        <ComparisonGrid
          items={items}
          branches={activeBranches}
          basket={basket}
          onQuantityChange={handleQuantityChange}
        />

        <BasketPanel
          branches={activeBranches}
          totals={totals}
          basketItemCount={basketItemCount}
          calculationMode={calculationMode}
          onCalculationModeChange={setCalculationMode}
        />

        {hasBasketItems && (
          <SmartSplitCard result={smartSplit} branches={activeBranches} />
        )}
      </main>

      {/* Minimalist footer with utilities and disclaimers */}
      <Footer
        onOpenFeedback={() => setFeedbackModalOpen(true)}
        onOpenTerms={() => setTermsModalOpen(true)}
      />

      {/* Sticky action bar (minimalist pill aesthetics) */}
      {hasBasketItems && (
        <div className="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-md border-t border-stone-200/60 shadow-xl z-40 safe-bottom">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-stone-500 font-medium">
                <span className="font-bold text-stone-800">{basketItemCount}</span> item type
                {basketItemCount !== 1 ? "s" : ""} in basket
              </p>
              {smartSplit.savingsVsSingleCheapest > 0.01 && (
                <p className="text-xs text-emerald-700 font-semibold truncate">
                  Smart Split saves you ${smartSplit.savingsVsSingleCheapest.toFixed(2)}!
                </p>
              )}
            </div>

            <button
              onClick={clearBasket}
              className="p-2.5 rounded-full border border-stone-200/80 text-stone-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50 transition-colors"
              aria-label="Clear basket"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md transition-all active:scale-[0.98]"
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

      {/* Feedback & Bug report modal (KC-ENG-02) */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        suburbName={suburbName}
      />

      {/* Terms & Disclaimer modal (KC-LEGAL-01) */}
      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
    </>
  );
}
