"use client";

import { GroceryItem, Store, StoreId, Basket } from "@/lib/types";
import { getCheapestStoreForItem } from "@/lib/data";
import { Plus, Minus, Package } from "lucide-react";

interface ComparisonGridProps {
  items: GroceryItem[];
  stores: Store[];
  basket: Basket;
  onQuantityChange: (itemId: string, delta: number) => void;
}

function StoreHeaderCell({ store }: { store: Store }) {
  return (
    <div
      className="rounded-xl px-3 py-2.5 text-center font-bold text-sm shadow-sm"
      style={{ backgroundColor: store.color, color: store.textColor }}
    >
      <span className="block text-base">{store.logoEmoji}</span>
      <span className="leading-tight">{store.shortName}</span>
    </div>
  );
}

interface PriceCellProps {
  item: GroceryItem;
  store: Store;
  isCheapest: boolean;
}

function PriceCell({ item, store, isCheapest }: PriceCellProps) {
  const priceEntry = item.prices[store.id as StoreId];

  if (!priceEntry || !priceEntry.inStock || priceEntry.price === null) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[3.5rem] text-slate-400">
        <Package className="w-4 h-4 mb-0.5" />
        <span className="text-xs">N/A</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[3.5rem] gap-0.5 relative">
      {isCheapest && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
          ✓ Best
        </span>
      )}
      <span
        className={`text-lg font-extrabold tabular-nums ${
          isCheapest ? "text-emerald-600" : "text-slate-800"
        }`}
      >
        ${priceEntry.price.toFixed(2)}
      </span>
      <span className="text-[10px] text-slate-400 leading-none text-center">
        {priceEntry.brandLabel}
      </span>
    </div>
  );
}

export default function ComparisonGrid({
  items,
  stores,
  basket,
  onQuantityChange,
}: ComparisonGridProps) {
  // Group items by category
  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <section className="mt-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span>📊</span> Price Comparison
      </h2>

      <div className="overflow-x-auto -mx-4 sm:mx-0 pb-2">
        <div className="min-w-[640px] px-4 sm:px-0">
          {/* Store header row */}
          <div className="grid grid-cols-[minmax(160px,2fr)_auto_repeat(4,1fr)] gap-2 mb-4 items-end">
            <div className="text-xs text-slate-500 font-medium pb-1">Item</div>
            <div className="text-xs text-slate-500 font-medium pb-1 text-center w-20">Qty</div>
            {stores.map((store) => (
              <StoreHeaderCell key={store.id} store={store} />
            ))}
          </div>

          {/* Items by category */}
          {categories.map((category) => (
            <div key={category} className="mb-5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                {category}
              </div>
              <div className="space-y-2">
                {items
                  .filter((i) => i.category === category)
                  .map((item) => {
                    const cheapestStoreId = getCheapestStoreForItem(item);
                    const qty = basket[item.id] ?? 0;
                    return (
                      <div
                        key={item.id}
                        className={`grid grid-cols-[minmax(160px,2fr)_auto_repeat(4,1fr)] gap-2 items-center rounded-xl border px-3 py-3 transition-all ${
                          qty > 0
                            ? "bg-amber-50 border-amber-200 shadow-sm"
                            : "bg-white border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        {/* Item info */}
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="text-xl shrink-0 mt-0.5">{item.emoji}</span>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 text-sm leading-tight truncate">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center gap-1 w-20 justify-center">
                          <button
                            onClick={() => onQuantityChange(item.id, -1)}
                            disabled={qty === 0}
                            aria-label={`Remove one ${item.name}`}
                            className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-3 h-3 text-slate-600" />
                          </button>
                          <span className="w-5 text-center font-bold text-slate-700 text-sm tabular-nums">
                            {qty}
                          </span>
                          <button
                            onClick={() => onQuantityChange(item.id, 1)}
                            aria-label={`Add one ${item.name}`}
                            className="w-7 h-7 rounded-full flex items-center justify-center bg-amber-400 hover:bg-amber-500 text-slate-900 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price cells */}
                        {stores.map((store) => (
                          <PriceCell
                            key={store.id}
                            item={item}
                            store={store}
                            isCheapest={cheapestStoreId === store.id}
                          />
                        ))}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
