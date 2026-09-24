"use client";

import { StoreTotals, Store, StoreId } from "@/lib/types";
import { ShoppingCart, TrendingDown, AlertCircle } from "lucide-react";

interface BasketPanelProps {
  stores: Store[];
  totals: StoreTotals[];
  basketItemCount: number;
}

export default function BasketPanel({ stores, totals, basketItemCount }: BasketPanelProps) {
  if (basketItemCount === 0) {
    return (
      <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
        <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 font-medium">Add items above to compare basket totals</p>
        <p className="text-slate-400 text-sm mt-1">
          Use the <span className="font-mono font-bold">+</span> buttons to build your shopping list
        </p>
      </div>
    );
  }

  const storeMap = new Map(stores.map((s) => [s.id, s]));
  const minTotal = Math.min(...totals.map((t) => t.total));

  return (
    <section className="mt-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5" />
        Basket Totals
        <span className="ml-auto text-xs font-normal text-slate-400">
          {basketItemCount} item type{basketItemCount !== 1 ? "s" : ""} selected
        </span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {totals.map((storeTotal) => {
          const store = storeMap.get(storeTotal.storeId as StoreId);
          if (!store) return null;
          const isCheapest = storeTotal.total === minTotal && storeTotal.total > 0;
          const hasMissing = storeTotal.missingItems.length > 0;

          return (
            <div
              key={storeTotal.storeId}
              className={`relative rounded-2xl p-4 border-2 transition-all ${
                isCheapest
                  ? "border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-100"
                  : "border-slate-100 bg-white"
              }`}
            >
              {isCheapest && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap shadow">
                  <TrendingDown className="w-3 h-3" />
                  Cheapest
                </div>
              )}

              {/* Store badge */}
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold mb-3"
                style={{ backgroundColor: store.color, color: store.textColor }}
              >
                <span>{store.logoEmoji}</span>
                {store.shortName}
              </div>

              {/* Total */}
              <p
                className={`text-3xl font-extrabold tabular-nums ${
                  isCheapest ? "text-emerald-600" : "text-slate-800"
                }`}
              >
                {storeTotal.total > 0 ? `$${storeTotal.total.toFixed(2)}` : "—"}
              </p>

              {/* Missing items warning */}
              {hasMissing && (
                <div className="mt-2 flex items-start gap-1 text-amber-600 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    Missing: {storeTotal.missingItems.slice(0, 2).join(", ")}
                    {storeTotal.missingItems.length > 2 &&
                      ` +${storeTotal.missingItems.length - 2} more`}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
