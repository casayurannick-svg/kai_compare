import { StoreTotals, ResolvedBranch } from "@/lib/types";
import { AlertCircle } from "lucide-react";

interface BasketPanelProps {
  branches: ResolvedBranch[];
  totals: StoreTotals[];
  basketItemCount: number;
}

export default function BasketPanel({ branches, totals, basketItemCount }: BasketPanelProps) {
  if (basketItemCount === 0) return null;

  // Find the lowest total (that is > 0)
  const validTotals = totals.filter((t) => t.total > 0 && t.itemCount === basketItemCount);
  const cheapestTotal = validTotals.length > 0
    ? Math.min(...validTotals.map((t) => t.total))
    : null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-slate-900 mb-4 px-2">One-Stop Shop Totals</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {totals.map((t) => {
          const branch = branches.find((b) => b.branchId === t.branchId)!;
          const isCheapest = cheapestTotal !== null && t.total === cheapestTotal;
          const hasMissing = t.missingItems.length > 0;

          return (
            <div 
              key={t.branchId}
              className={`p-4 rounded-2xl border ${
                isCheapest 
                  ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{branch.logoEmoji}</span>
                  <span className="font-bold text-slate-700 text-sm">{branch.branchDisplayName}</span>
                </div>
                {isCheapest && (
                  <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Winner
                  </span>
                )}
              </div>

              <div className="mb-3">
                <span className="text-3xl font-black text-slate-900">
                  ${t.total.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 font-medium ml-1">total</span>
              </div>

              {hasMissing ? (
                <div className="flex items-start gap-1.5 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <p>Missing {t.missingItems.length} item{t.missingItems.length > 1 ? 's' : ''}</p>
                </div>
              ) : (
                <div className="text-xs text-slate-400 font-medium px-1">
                  All {t.itemCount} items found
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
