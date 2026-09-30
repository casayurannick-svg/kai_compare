"use client";

import { useMemo } from "react";
import { GroceryItem, Basket, ResolvedBranch } from "@/lib/types";
import { calculateWinnerVerdict, WinnerVerdict } from "@/lib/verdict";
import { Trophy, TrendingDown, MapPin, Sparkles } from "lucide-react";

export interface WinnerVerdictCardProps {
  items: GroceryItem[];
  basket: Basket;
  branches: ResolvedBranch[];
  verdict?: WinnerVerdict | null;
}

export default function WinnerVerdictCard({
  items,
  basket,
  branches,
  verdict: propVerdict,
}: WinnerVerdictCardProps) {
  const computedVerdict = useMemo(() => {
    if (propVerdict !== undefined) return propVerdict;
    return calculateWinnerVerdict(items, basket, branches);
  }, [propVerdict, items, basket, branches]);

  const verdict = propVerdict !== undefined ? propVerdict : computedVerdict;

  // If there are no items in the basket yet, display an inviting hero prompt
  if (!verdict) {
    return (
      <section className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                  Winner Verdict
                </span>
                <span className="text-xs text-slate-500 font-medium">Price Delta Hero</span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                Find Auckland&apos;s Cheapest Supermarket
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Add staples to your basket below to calculate Auckland&apos;s cheapest store and live competitor price deltas.
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-600 bg-white/90 border border-slate-200 px-3.5 py-2 rounded-xl shrink-0 font-medium shadow-xs">
            👉 Tap <span className="font-bold text-amber-600">+</span> on items below to calculate
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
    <section className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white shadow-xl border border-emerald-500/30">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

      <div className="relative p-6 sm:p-8">
        {/* Top Winner Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-md">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              Cheapest Overall Store
            </span>
            <span className="text-emerald-300/80 text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Live Verdict
            </span>
          </div>

          <div className="text-xs text-slate-300 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            {winner.itemCount} item{winner.itemCount !== 1 ? "s" : ""} compared
          </div>
        </div>

        {/* Hero Row: Winning Store + Basket Total */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/10">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              Winning Supermarket
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
              <span className="text-3xl drop-shadow-sm">{winner.logoEmoji || "🛒"}</span>
              <span>{winnerTitle}</span>
            </h2>
          </div>

          <div className="md:text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">
              Winning Basket Total
            </p>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-sm">
              ${verdict.winnerTotal.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Competitor Price Delta Badges */}
        {(deltaVsSecondText || deltaVsThirdText) && (
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              Competitor Price Deltas
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              {deltaVsSecondText && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {deltaVsSecondText}
                </span>
              )}
              {deltaVsThirdText && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  {deltaVsThirdText}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Marginal Price Recommendation Note */}
        {isMarginal && (
          <div className="mt-5 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-200 text-xs sm:text-sm font-semibold shadow-inner">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Prices within $0.75 — choose nearest store</span>
          </div>
        )}
      </div>
    </section>
  );
}
