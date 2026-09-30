"use client";

import { useMemo } from "react";
import { GroceryItem, Basket, ResolvedBranch } from "@/lib/types";
import { calculateWinnerVerdict, WinnerVerdict } from "@/lib/verdict";
import { Trophy, TrendingDown, MapPin, Sparkles, CheckCircle2 } from "lucide-react";

export interface WinnerVerdictCardProps {
  items: GroceryItem[];
  basket: Basket;
  branches: ResolvedBranch[];
  verdict?: WinnerVerdict | null;
  radiusExpanded?: boolean;
  expandedChainName?: string;
}

export default function WinnerVerdictCard({
  items,
  basket,
  branches,
  verdict: propVerdict,
  radiusExpanded: propRadiusExpanded,
  expandedChainName: propExpandedChainName,
}: WinnerVerdictCardProps) {
  const computedVerdict = useMemo(() => {
    if (propVerdict !== undefined) return propVerdict;
    return calculateWinnerVerdict(items, basket, branches);
  }, [propVerdict, items, basket, branches]);

  const verdict = propVerdict !== undefined ? propVerdict : computedVerdict;

  const isRadiusExpanded =
    propRadiusExpanded !== undefined
      ? propRadiusExpanded
      : (verdict?.radiusExpanded ?? branches.some((b) => (b.distanceKm ?? 0) > 5.0));

  const displayExpandedChain = useMemo(() => {
    if (propExpandedChainName) return propExpandedChainName;
    if (verdict?.expandedChainName) return verdict.expandedChainName;
    const expandedStores = branches.filter((b) => (b.distanceKm ?? 0) > 5.0);
    const names = Array.from(
      new Set(expandedStores.map((b) => b.chainShortName || b.branchDisplayName || b.fullName))
    );
    if (names.length === 0) return undefined;
    return names.length === 2 ? `${names[0]} & ${names[1]}` : names.join(", ");
  }, [propExpandedChainName, verdict, branches]);

  // Empty basket hero prompt with soft pastel styling
  if (!verdict) {
    return (
      <section className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50/60 via-stone-50 to-emerald-50/40 border border-stone-200/70 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/70 border border-amber-200/80 flex items-center justify-center text-2xl shadow-2xs shrink-0">
              🏆
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                  Winner Verdict
                </span>
                <span className="text-xs text-stone-500 font-medium">Price Delta Hero</span>
                {isRadiusExpanded && displayExpandedChain && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-100/90 text-sky-900 border border-sky-200/80 text-[11px] font-semibold shadow-2xs">
                    <MapPin className="w-3 h-3 text-sky-600" />
                    Expanded search to find nearest {displayExpandedChain}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-black text-stone-900 mt-1">
                Find Auckland&apos;s Cheapest Supermarket
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                Add staples to your basket below to calculate Auckland&apos;s cheapest store and live competitor price deltas.
              </p>
            </div>
          </div>
          <div className="text-xs text-stone-600 bg-white/90 border border-stone-200/80 px-3.5 py-2 rounded-full shrink-0 font-medium shadow-2xs">
            👉 Tap <span className="font-bold text-emerald-700">+</span> on items below to calculate
          </div>
        </div>
      </section>
    );
  }

  const { winner, runnerUp, third, deltaVsSecond, deltaVsThird, isMarginal } = verdict;

  const winnerDistance =
    winner.distanceKm !== null ? ` • ${winner.distanceKm.toFixed(1)} km` : "";
  const winnerTitle = `${winner.fullName}${winnerDistance}`;

  const runnerUpDist =
    runnerUp?.distanceKm !== null && runnerUp?.distanceKm !== undefined
      ? ` (${runnerUp.distanceKm.toFixed(1)} km)`
      : "";
  const deltaVsSecondText =
    runnerUp && deltaVsSecond !== null
      ? `Save $${deltaVsSecond.toFixed(2)} vs ${runnerUp.fullName}${runnerUpDist}`
      : null;

  const thirdDist =
    third?.distanceKm !== null && third?.distanceKm !== undefined
      ? ` (${third.distanceKm.toFixed(1)} km)`
      : "";
  const deltaVsThirdText =
    third && deltaVsThird !== null
      ? `Save $${deltaVsThird.toFixed(2)} vs ${third.fullName}${thirdDist}`
      : null;

  return (
    <section className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50/90 via-teal-50/30 to-stone-50 border border-emerald-200/70 p-6 sm:p-8 shadow-sm text-stone-900">
      {/* Decorative subtle ambient glows */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-60 h-60 rounded-full bg-teal-200/30 blur-3xl pointer-events-none" />

      <div className="relative">
        {/* Top Header Badge & Item Count */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200/80 font-bold text-xs uppercase tracking-wider shadow-2xs">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Cheapest Overall Store
            </span>
            <span className="text-emerald-800 text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Live Verdict
            </span>
            {isRadiusExpanded && displayExpandedChain && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/90 text-sky-900 border border-sky-200/80 text-xs font-semibold shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                Expanded search to find nearest {displayExpandedChain}
              </span>
            )}
          </div>

          <div className="text-xs text-stone-500 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-stone-200/60 shadow-2xs">
            {winner.itemCount} item{winner.itemCount !== 1 ? "s" : ""} compared
          </div>
        </div>

        {/* Hero Row: Winning Store + Basket Total */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-5 border-b border-emerald-200/50">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800/80 mb-1">
              Winning Supermarket
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 flex items-center gap-2.5 tracking-tight">
              <span className="text-3xl drop-shadow-2xs">{winner.logoEmoji || "🛒"}</span>
              <span>{winnerTitle}</span>
            </h2>
          </div>

          <div className="md:text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800/80 mb-1">
              Winning Basket Total
            </p>
            <div className="text-4xl sm:text-5xl font-black text-emerald-950 tracking-tight">
              ${verdict.winnerTotal.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Competitor Price Delta Badges */}
        {(deltaVsSecondText || deltaVsThirdText) && (
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-700" />
              Competitor Price Deltas
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              {deltaVsSecondText && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-white text-emerald-900 border border-emerald-200/80 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {deltaVsSecondText}
                </span>
              )}
              {deltaVsThirdText && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-white text-stone-800 border border-stone-200/80 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  {deltaVsThirdText}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Marginal Price Recommendation Note */}
        {isMarginal && (
          <div className="mt-5 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs sm:text-sm font-medium shadow-2xs">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Prices within $0.75 — choose nearest store</span>
          </div>
        )}
      </div>
    </section>
  );
}
