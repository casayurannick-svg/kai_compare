import { SmartSplitResult, ResolvedBranch } from "@/lib/types";
import { Sparkles, ArrowRight, Route } from "lucide-react";

interface SmartSplitCardProps {
  result: SmartSplitResult;
  branches: ResolvedBranch[];
}

export default function SmartSplitCard({ result, branches }: SmartSplitCardProps) {
  const hasSavings = result.savingsVsSingleCheapest > 0;

  if (!hasSavings) return null;

  return (
    <section className="mt-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50/90 via-emerald-50/30 to-stone-50 border border-sky-200/70 shadow-sm text-stone-900">
      {/* Decorative subtle ambient element */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />

      <div className="relative p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200/80 font-bold text-xs uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Smart Split Optimizer
          </span>
          <span className="text-xs font-semibold text-sky-800 hidden sm:inline">
            Multi-Store Savings
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
          <div>
            <p className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">
              You could save
            </p>
            <div className="text-5xl sm:text-6xl font-black text-emerald-950 tracking-tight">
              ${result.savingsVsSingleCheapest.toFixed(2)}
            </div>
          </div>
          <div className="flex-1 pb-1">
            <p className="text-stone-600 text-sm leading-relaxed">
              by splitting your grocery run across nearby stores instead of buying everything at{" "}
              <strong className="text-stone-900 font-bold">
                {result.cheapestSingleStore.branchDisplayName}
              </strong>
              .
            </p>
          </div>
        </div>

        {/* The Split Plan */}
        <div className="bg-white/80 backdrop-blur-xs rounded-3xl p-5 border border-stone-200/70 shadow-2xs">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Route className="w-3.5 h-3.5 text-sky-600" />
              Recommended Route
            </h3>
            <span className="text-xs text-stone-400 font-medium">
              {result.splitPlan.length} stops
            </span>
          </div>

          <div className="space-y-2.5">
            {result.splitPlan.map((step, idx) => {
              const branch = branches.find((b) => b.branchId === step.branchId)!;
              return (
                <div
                  key={step.branchId}
                  className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/70 border border-stone-200/60 transition-all hover:bg-stone-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-stone-200/60 flex items-center justify-center text-base shadow-2xs shrink-0">
                      {branch.logoEmoji}
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-sm">
                        {branch.branchDisplayName}
                      </div>
                      <div className="text-xs text-stone-500 font-medium">
                        Buy {step.items.length} item{step.items.length > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-stone-900 text-sm sm:text-base">
                      ${step.storeTotal.toFixed(2)}
                    </span>
                    {idx < result.splitPlan.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-stone-400 hidden sm:block" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 flex justify-between items-center">
            <span className="font-bold text-stone-600 text-sm">Split Grand Total</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
              ${result.splitGrandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
