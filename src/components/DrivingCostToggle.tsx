"use client";

import { useState, useRef, useEffect } from "react";
import { CalculationMode, IRD_TOOLTIP_TEXT, IRD_MILEAGE_RATE_PER_KM, DEFAULT_FUEL_RATE_PER_KM } from "@/lib/driving";
import { Info, Fuel, Car } from "lucide-react";

export interface DrivingCostToggleProps {
  mode: CalculationMode;
  onChange: (mode: CalculationMode) => void;
  className?: string;
  showRates?: boolean;
}

export default function DrivingCostToggle({
  mode,
  onChange,
  className = "",
  showRates = true,
}: DrivingCostToggleProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isIrd = mode === "IRD_TRUE_COST";

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center gap-2 bg-stone-100/90 border border-stone-200/80 rounded-full p-1 shadow-2xs ${className}`}
    >
      {/* Segmented / Toggle switch buttons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange("FUEL")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
            !isIrd
              ? "bg-white text-stone-900 shadow-xs border border-stone-200/70"
              : "text-stone-500 hover:text-stone-800"
          }`}
          aria-pressed={!isIrd}
        >
          <Fuel className="w-3 h-3 text-amber-600" />
          <span>Fuel</span>
          {showRates && (
            <span className="text-[10px] text-stone-400 font-semibold">
              ${DEFAULT_FUEL_RATE_PER_KM.toFixed(2)}/km
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onChange("IRD_TRUE_COST")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
            isIrd
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-stone-500 hover:text-stone-800"
          }`}
          aria-pressed={isIrd}
        >
          <Car className="w-3 h-3 text-emerald-200" />
          <span>IRD True Cost</span>
          {showRates && (
            <span className={`text-[10px] font-semibold ${isIrd ? "text-emerald-100" : "text-stone-400"}`}>
              ${IRD_MILEAGE_RATE_PER_KM.toFixed(2)}/km
            </span>
          )}
        </button>
      </div>

      {/* Info Icon with Tooltip */}
      <div className="relative flex items-center pr-1.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowTooltip((prev) => !prev);
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          className="w-5 h-5 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500"
          aria-label="Info about IRD True Cost mileage calculation"
        >
          <Info className="w-3.5 h-3.5" />
        </button>

        {/* Floating Tooltip */}
        {showTooltip && (
          <div
            role="tooltip"
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 p-3 rounded-2xl bg-stone-900 text-stone-100 text-xs shadow-xl border border-stone-800 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="font-semibold text-emerald-400 mb-0.5 flex items-center gap-1.5">
              <span>IRD Tier 1 Rate ($0.95/km)</span>
            </div>
            <p className="text-stone-300 leading-relaxed font-normal">
              {IRD_TOOLTIP_TEXT}
            </p>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900" />
          </div>
        )}
      </div>
    </div>
  );
}
