"use client";

import { SmartSplitResult, Store, StoreId } from "@/lib/types";
import { Sparkles, Zap } from "lucide-react";

interface SmartSplitCardProps {
  result: SmartSplitResult;
  stores: Store[];
}

export default function SmartSplitCard({ result, stores }: SmartSplitCardProps) {
  const { savingsVsSingleCheapest, cheapestSingleStore, splitPlan, splitGrandTotal } = result;
  const storeMap = new Map(stores.map((s) => [s.id, s]));

  const hasSavings = savingsVsSingleCheapest > 0.01;
  const singleStore = storeMap.get(cheapestSingleStore.storeId as StoreId);

  if (splitPlan.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-500" />
        Smart Split Savings
      </h2>

      {/* Savings hero card */}
      {hasSavings ? (
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5 shadow-lg mb-4">
          <div className="flex items-center gap-2 text-emerald-100 text-sm font-medium mb-1">
            <Zap className="w-4 h-4" />
            Split shopping saves you
          </div>
          <p className="text-4xl font-extrabold tabular-nums">
            ${savingsVsSingleCheapest.toFixed(2)}
          </p>
          <p className="text-emerald-100 text-sm mt-1">
            vs. buying everything at{" "}
            <span className="font-semibold text-white">
              {singleStore?.shortName ?? cheapestSingleStore.storeId}
            </span>{" "}
            (${cheapestSingleStore.total.toFixed(2)})
          </p>
          <p className="text-emerald-100 text-sm mt-0.5">
            Split total:{" "}
            <span className="font-bold text-white">${splitGrandTotal.toFixed(2)}</span>
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 mb-4 text-center">
          <p className="text-slate-600 font-medium">
            🏆{" "}
            <span className="font-bold">
              {singleStore?.shortName ?? cheapestSingleStore.storeId}
            </span>{" "}
            is already the best single-stop for your basket!
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Splitting wouldn&apos;t save anything meaningful (saves less than $0.01)
          </p>
        </div>
      )}

      {/* Per-store breakdown */}
      {hasSavings && (
        <div className="grid gap-3 sm:grid-cols-2">
          {splitPlan.map(({ storeId, storeName, items, storeTotal }) => {
            const store = storeMap.get(storeId as StoreId);
            return (
              <div key={storeId} className="rounded-xl border border-slate-100 bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
                    style={{
                      backgroundColor: store?.color ?? "#888",
                      color: store?.textColor ?? "#fff",
                    }}
                  >
                    <span>{store?.logoEmoji}</span>
                    {storeName}
                  </div>
                  <span className="font-bold text-slate-700 tabular-nums">
                    ${storeTotal.toFixed(2)}
                  </span>
                </div>
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li
                      key={item.itemId}
                      className="flex justify-between text-xs text-slate-600"
                    >
                      <span className="truncate pr-2">
                        {item.itemName}
                        {item.quantity > 1 && (
                          <span className="text-slate-400"> ×{item.quantity}</span>
                        )}
                      </span>
                      <span className="shrink-0 font-medium tabular-nums">
                        ${item.lineTotal.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
