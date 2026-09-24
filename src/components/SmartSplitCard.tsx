import { SmartSplitResult, ResolvedBranch } from "@/lib/types";
import { Sparkles, ArrowRight } from "lucide-react";

interface SmartSplitCardProps {
  result: SmartSplitResult;
  branches: ResolvedBranch[];
}

export default function SmartSplitCard({ result, branches }: SmartSplitCardProps) {
  const hasSavings = result.savingsVsSingleCheapest > 0;

  if (!hasSavings) return null;

  return (
    <section className="mt-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

      <div className="relative p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4 text-indigo-200">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold tracking-wide uppercase">Smart Split Optimizer</h2>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1">You could save</p>
            <div className="text-5xl sm:text-6xl font-black text-white tracking-tight drop-shadow-md">
              ${result.savingsVsSingleCheapest.toFixed(2)}
            </div>
          </div>
          <div className="flex-1 pb-1">
            <p className="text-indigo-100 text-sm">
              by splitting your run instead of buying everything at{" "}
              <strong className="text-white">{result.cheapestSingleStore.branchDisplayName}</strong>.
            </p>
          </div>
        </div>

        {/* The Split Plan */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-3">
            Recommended Route
          </h3>
          <div className="space-y-2">
            {result.splitPlan.map((step, idx) => {
              const branch = branches.find((b) => b.branchId === step.branchId)!;
              return (
                <div key={step.branchId} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm shadow-inner">
                      {branch.logoEmoji}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">
                        {branch.branchDisplayName}
                      </div>
                      <div className="text-xs text-indigo-200 font-medium">
                        Buy {step.items.length} item{step.items.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white">
                      ${step.storeTotal.toFixed(2)}
                    </span>
                    {idx < result.splitPlan.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-indigo-400 hidden sm:block" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
            <span className="font-bold text-indigo-200">New Grand Total</span>
            <span className="text-2xl font-black text-emerald-400 drop-shadow-sm">
              ${result.splitGrandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
