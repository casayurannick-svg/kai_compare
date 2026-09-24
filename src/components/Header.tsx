"use client";

import { Store } from "@/lib/types";
import { ShoppingCart, MapPin, RefreshCw } from "lucide-react";

interface HeaderProps {
  stores: Store[];
  lastUpdated: string;
}

export default function Header({ stores, lastUpdated }: HeaderProps) {
  const formatted = new Date(lastUpdated).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Brand row */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="bg-amber-400 text-slate-900 rounded-xl p-2">
              <ShoppingCart className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none">
                Kai<span className="text-amber-400">Compare</span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm font-medium mt-0.5">
                Auckland Grocery Price Tracker
              </p>
            </div>
          </div>

          {/* Location badge */}
          <div className="flex items-center gap-1.5 bg-slate-700/60 backdrop-blur rounded-full px-3 py-1.5 text-xs text-slate-300 border border-slate-600/50">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Tāmaki Makaurau · Auckland</span>
          </div>
        </div>

        {/* Store chips + last updated */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {stores.map((store) => (
              <span
                key={store.id}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border"
                style={{
                  backgroundColor: `${store.color}22`,
                  borderColor: `${store.color}55`,
                  color: store.color === "#FFD700" ? "#FFD700" : store.color,
                }}
              >
                <span>{store.logoEmoji}</span>
                {store.shortName}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <RefreshCw className="w-3 h-3" />
            <span>Updated {formatted}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
