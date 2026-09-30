"use client";

import { useState } from "react";
import { StoreTotals, ResolvedBranch } from "@/lib/types";
import { CalculationMode, calculateDrivingCost } from "@/lib/driving";
import DrivingCostToggle from "./DrivingCostToggle";
import { AlertCircle, CheckCircle2, Trophy, Car } from "lucide-react";

interface BasketPanelProps {
  branches: ResolvedBranch[];
  totals: StoreTotals[];
  basketItemCount: number;
  calculationMode?: CalculationMode;
  onCalculationModeChange?: (mode: CalculationMode) => void;
}

export default function BasketPanel({
  branches,
  totals,
  basketItemCount,
  calculationMode: propCalculationMode,
  onCalculationModeChange,
}: BasketPanelProps) {
  const [internalMode, setInternalMode] = useState<CalculationMode>("FUEL");
  const mode = propCalculationMode ?? internalMode;

  const handleModeChange = (newMode: CalculationMode) => {
    if (onCalculationModeChange) {
      onCalculationModeChange(newMode);
    } else {
      setInternalMode(newMode);
    }
  };

  if (basketItemCount === 0) return null;

  const hasDistances = branches.some((b) => b.distanceKm !== null && b.distanceKm > 0);

  // Find the lowest total (that is > 0)
  const validTotals = totals.filter((t) => t.total > 0 && t.itemCount === basketItemCount);
  const cheapestTotal =
    validTotals.length > 0 ? Math.min(...validTotals.map((t) => t.total)) : null;

  return (
    <section className="mt-14">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            One-Stop Shop Totals
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200/60">
            Entire Basket
          </span>
        </div>

        {hasDistances && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-semibold hidden sm:inline">
              Driving Cost:
            </span>
            <DrivingCostToggle mode={mode} onChange={handleModeChange} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {totals.map((t) => {
          const branch = branches.find((b) => b.branchId === t.branchId)!;
          const isCheapest = cheapestTotal !== null && t.total === cheapestTotal;
          const hasMissing = t.missingItems.length > 0;

          return (
            <div
              key={t.branchId}
              className={`p-5 rounded-3xl border transition-all ${
                isCheapest
                  ? "bg-emerald-50/70 border-emerald-200/80 shadow-sm"
                  : "bg-white border-stone-200/70 shadow-2xs hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{branch.logoEmoji}</span>
                  <span className="font-bold text-stone-800 text-sm">
                    {branch.branchDisplayName}
                  </span>
                </div>
                {isCheapest && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-200/80 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs">
                    <Trophy className="w-2.5 h-2.5 text-amber-500" />
                    Winner
                  </span>
                )}
              </div>

              <div className="mb-3">
                <span className="text-3xl font-black text-stone-900 tracking-tight">
                  ${t.total.toFixed(2)}
                </span>
                <span className="text-xs text-stone-400 font-medium ml-1">groceries</span>
              </div>

              {/* Driving Cost Breakdown (FEAT-60) */}
              {branch.distanceKm !== null && branch.distanceKm > 0 && (
                <div className="mb-3 p-2.5 rounded-2xl bg-stone-50/80 border border-stone-200/60 text-xs">
                  <div className="flex items-center justify-between text-stone-600 mb-1">
                    <span className="flex items-center gap-1 font-medium text-stone-600">
                      <Car className="w-3.5 h-3.5 text-stone-400" />
                      Driving ({branch.distanceKm.toFixed(1)} km)
                    </span>
                    <span className="font-bold text-stone-900">
                      +${calculateDrivingCost(branch.distanceKm, mode).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-200/50">
                    <span>{mode === "IRD_TRUE_COST" ? "IRD True Cost" : "Fuel Only"}</span>
                    <span className="font-bold text-stone-800">
                      Trip: ${(t.total + calculateDrivingCost(branch.distanceKm, mode)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {hasMissing ? (
                <div className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-2xl border border-amber-200/60">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                  <p>
                    Missing {t.missingItems.length} item{t.missingItems.length > 1 ? "s" : ""}
                  </p>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs text-stone-500 font-medium px-2 py-1 bg-stone-50 rounded-full border border-stone-100">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>All {t.itemCount} items found</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
