import { GroceryItem, Basket, ResolvedBranch } from "@/lib/types";
import { getCheapestBranchForItem } from "@/lib/data";
import { Minus, Plus, BadgeCheck } from "lucide-react";

interface ComparisonGridProps {
  items: GroceryItem[];
  branches: ResolvedBranch[];
  basket: Basket;
  onQuantityChange: (itemId: string, delta: number) => void;
}

export default function ComparisonGrid({ items, branches, basket, onQuantityChange }: ComparisonGridProps) {
  // Group items by category
  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="space-y-8">
      {categories.map((category) => {
        const catItems = items.filter((i) => i.category === category);
        return (
          <section key={category}>
            <h2 className="text-xl font-bold text-slate-900 mb-4 px-2">{category}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {catItems.map((item) => {
                const qty = basket[item.id] || 0;
                const cheapestBranchId = getCheapestBranchForItem(item, branches);

                return (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    
                    {/* Item Header */}
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl" aria-hidden="true">{item.emoji}</span>
                        <div>
                          <h3 className="font-bold text-slate-800 leading-tight">{item.name}</h3>
                          <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                        </div>
                      </div>
                      
                      {/* Stepper */}
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm">
                        <button
                          onClick={() => onQuantityChange(item.id, -1)}
                          disabled={qty === 0}
                          className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-slate-800 select-none">
                          {qty}
                        </span>
                        <button
                          onClick={() => onQuantityChange(item.id, 1)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Price Grid (2x2) */}
                    <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 border-t border-slate-100">
                      {branches.map((branch) => {
                        const priceEntry = item.prices[branch.branchId];
                        const isCheapest = branch.branchId === cheapestBranchId;
                        const hasPrice = priceEntry && priceEntry.inStock && priceEntry.price !== null;

                        return (
                          <div 
                            key={branch.branchId} 
                            className={`p-3 relative ${isCheapest ? 'bg-emerald-50/30' : 'bg-white'}`}
                          >
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="text-sm">{branch.logoEmoji}</span>
                              <span className="text-xs font-bold text-slate-700 truncate" title={branch.branchDisplayName}>
                                {branch.branchDisplayName}
                              </span>
                            </div>
                            
                            {hasPrice ? (
                              <div>
                                <div className="flex items-baseline gap-1">
                                  <span className="text-lg font-black text-slate-900">
                                    ${priceEntry.price?.toFixed(2)}
                                  </span>
                                  {isCheapest && (
                                    <BadgeCheck className="w-4 h-4 text-emerald-500" aria-label="Lowest price" />
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                                  {priceEntry.brandLabel}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center h-[42px]">
                                <span className="text-sm font-medium text-slate-300">N/A</span>
                              </div>
                            )}

                            {branch.distanceKm !== null && (
                              <div className="absolute top-3 right-3 text-[9px] font-medium text-slate-400">
                                {branch.distanceKm}km
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
