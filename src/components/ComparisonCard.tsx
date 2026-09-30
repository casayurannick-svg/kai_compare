"use client";

import { useState } from "react";
import { ResolvedBranch, StoreTotals } from "@/lib/types";
import { CalculationMode, calculateDrivingCost, IRD_MILEAGE_RATE_PER_KM, DEFAULT_FUEL_RATE_PER_KM } from "@/lib/driving";
import DrivingCostToggle from "./DrivingCostToggle";
import { Car, Trophy, CheckCircle2, AlertCircle } from "lucide-react";

export interface ComparisonCardProps {
  branch: ResolvedBranch;
  totals?: StoreTotals;
  isWinner?: boolean;
  calculationMode?: CalculationMode;
  onCalculationModeChange?: (mode: CalculationMode) => void;
  showToggle?: boolean;
  className?: string;
}

export default function ComparisonCard({
  branch,
  totals,
  isWinner = false,
  calculationMode: controlledMode,
  onCalculationModeChange,
  showToggle = true,
  className = "",
}: ComparisonCardProps) {
  const [internalMode, setInternalMode] = useState<CalculationMode>("FUEL");
  const mode = controlledMode ?? internalMode;

  const handleModeChange = (newMode: CalculationMode) => {
    if (onCalculationModeChange) {
      onCalculationModeChange(newMode);
    } else {
      setInternalMode(newMode);
    }
  };

  const distanceKm = branch.distanceKm;
  const drivingCost = calculateDrivingCost(distanceKm, mode);
  const groceryTotal = totals?.total ?? 0;
  const combinedTotal = groceryTotal + drivingCost;
  const isIrd = mode === "IRD_TRUE_COST";
  const ratePerKm = isIrd ? IRD_MILEAGE_RATE_PER_KM : DEFAULT_FUEL_RATE_PER_KM;

  return (
    <div
      className={`p-5 rounded-3xl border transition-all ${
        isWinner
          ? "bg-emerald-50/80 border-emerald-200/80 shadow-sm"
          : "bg-white border-stone-200/70 shadow-2xs hover:shadow-sm"
      } ${className}`}
    >
      {/* Header: Store Identity */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{branch.logoEmoji}</span>
          <div>
            <h4 className="font-bold text-stone-900 text-sm leading-tight">
              {branch.fullName}
            </h4>
            {distanceKm !== null && (
              <span className="text-xs text-stone-500 font-medium">
                {distanceKm.toFixed(1)} km away
              </span>
            )}
          </div>
        </div>

        {isWinner && (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-200/80 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs">
            <Trophy className="w-2.5 h-2.5 text-amber-500" />
            Cheapest
          </span>
        )}
      </div>

      {/* Grocery Total */}
      <div className="mb-4">
        <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-0.5">
          Grocery Basket
        </div>
        <div className="text-3xl font-black text-stone-900 tracking-tight">
          ${groceryTotal.toFixed(2)}
        </div>
      </div>

      {/* Driving Cost Breakdown */}
      {distanceKm !== null && distanceKm > 0 && (
        <div className="mb-4 p-3 rounded-2xl bg-stone-50 border border-stone-200/60 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-stone-500 font-medium flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-stone-600" />
              Driving ({isIrd ? "IRD True Cost" : "Fuel"})
            </span>
            <span className="font-bold text-stone-900">
              +${drivingCost.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1.5 border-t border-stone-200/50">
            <span>
              {distanceKm.toFixed(1)} km @ ${ratePerKm.toFixed(2)}/km
            </span>
            <span className="font-semibold text-stone-700">
              Trip Total: ${combinedTotal.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Optional Mode Toggle */}
      {showToggle && (
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Driving Rate
            </span>
            <DrivingCostToggle mode={mode} onChange={handleModeChange} showRates={false} />
          </div>
        </div>
      )}

      {/* Stock Status */}
      {totals && (
        <div className="mt-3">
          {totals.missingItems.length > 0 ? (
            <div className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Missing {totals.missingItems.length} items</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] text-stone-500 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-100">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>All {totals.itemCount} items in stock</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
