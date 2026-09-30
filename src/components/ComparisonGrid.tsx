import { GroceryItem, Basket, ResolvedBranch } from "@/lib/types";
import { getCheapestBranchForItem } from "@/lib/data";
import { Minus, Plus, BadgeCheck } from "lucide-react";

interface ComparisonGridProps {
  items: GroceryItem[];
  branches: ResolvedBranch[];
  basket: Basket;
  onQuantityChange: (itemId: string, delta: number) => void;
}

const CATEGORY_META: Record<string, { subtitle: string; tint: string; pillColor: string }> = {
  Pantry: {
    subtitle: "Long-life cupboard essentials and dry staples",
    tint: "bg-amber-50/40 border-amber-100/60",
    pillColor: "bg-amber-100/80 text-amber-800",
  },
  Bakery: {
    subtitle: "Fresh daily sandwich loaves and toast bread",
    tint: "bg-amber-50/60 border-amber-200/60",
    pillColor: "bg-amber-100 text-amber-900",
  },
  "Dairy & Eggs": {
    subtitle: "Farm fresh milk, creamery butter, cheese, and eggs",
    tint: "bg-sky-50/40 border-sky-100/60",
    pillColor: "bg-sky-100/80 text-sky-800",
  },
  Meat: {
    subtitle: "Fresh prime butchery cuts and ground mince",
    tint: "bg-rose-50/30 border-rose-100/60",
    pillColor: "bg-rose-100/80 text-rose-800",
  },
};

export default function ComparisonGrid({
  items,
  branches,
  basket,
  onQuantityChange,
}: ComparisonGridProps) {
  // Group items by category
  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="space-y-10">
      {categories.map((category) => {
        const catItems = items.filter((i) => i.category === category);
        const meta = CATEGORY_META[category] || {
          subtitle: "Essential Auckland supermarket staples",
          tint: "bg-stone-50 border-stone-200/60",
          pillColor: "bg-stone-100 text-stone-800",
        };

        return (
          <section key={category} className="space-y-4">
            {/* Category Header with refined typography & subtitle */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 px-1">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                    {category}
                  </h2>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${meta.pillColor}`}
                  >
                    {catItems.length} item{catItems.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
                  {meta.subtitle}
                </p>
              </div>
            </div>

            {/* Grocery Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {catItems.map((item) => {
                const qty = basket[item.id] || 0;
                const cheapestBranchId = getCheapestBranchForItem(item, branches);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border border-stone-200/70 p-5 shadow-sm hover:shadow-stone-200/60 transition-all flex flex-col justify-between"
                  >
                    {/* Item Header & Stepper */}
                    <div className="flex items-start justify-between gap-3 pb-4 mb-4 border-b border-stone-100">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                          {item.emoji}
                        </div>
                        <div>
                          <h3 className="font-bold text-stone-900 text-base leading-snug">
                            {item.name}
                          </h3>
                          <p className="text-xs text-stone-500 font-medium mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Clean Minimalist Stepper */}
                      <div className="inline-flex items-center rounded-full bg-stone-100/80 border border-stone-200/70 p-1 shadow-2xs shrink-0">
                        <button
                          onClick={() => onQuantityChange(item.id, -1)}
                          disabled={qty === 0}
                          className="w-7 h-7 flex items-center justify-center rounded-full text-stone-600 hover:bg-white hover:text-stone-900 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-stone-900 select-none">
                          {qty}
                        </span>
                        <button
                          onClick={() => onQuantityChange(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-full text-stone-700 hover:bg-emerald-600 hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Minimalist Branch Comparison Cards */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {branches.map((branch) => {
                        const priceEntry = item.prices[branch.branchId];
                        const isCheapest = branch.branchId === cheapestBranchId;
                        const hasPrice =
                          priceEntry && priceEntry.inStock && priceEntry.price !== null;

                        return (
                          <div
                            key={branch.branchId}
                            className={`p-3 rounded-2xl border transition-all ${
                              isCheapest
                                ? "bg-emerald-50/70 border-emerald-200/80 shadow-2xs"
                                : "bg-stone-50/60 border-stone-200/60"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="text-sm shrink-0">{branch.logoEmoji}</span>
                                <span
                                  className="text-xs font-bold text-stone-700 truncate"
                                  title={branch.branchDisplayName}
                                >
                                  {branch.branchDisplayName}
                                </span>
                              </div>
                              {branch.distanceKm !== null && (
                                <span className="text-[10px] text-stone-400 font-medium shrink-0">
                                  {branch.distanceKm.toFixed(1)}km
                                </span>
                              )}
                            </div>

                            {hasPrice ? (
                              <div>
                                <div className="flex items-baseline justify-between gap-1">
                                  <span className="text-lg font-black text-stone-900">
                                    ${priceEntry.price?.toFixed(2)}
                                  </span>
                                  {isCheapest && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold border border-emerald-200/60">
                                      <BadgeCheck className="w-2.5 h-2.5 text-emerald-600" />
                                      Lowest
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-stone-400 font-medium truncate mt-0.5">
                                  {priceEntry.brandLabel || item.unitMeasure}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center h-8">
                                <span className="text-xs font-medium text-stone-300">Out of Stock</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
