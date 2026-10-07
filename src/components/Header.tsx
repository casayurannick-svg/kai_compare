import { ResolvedBranch } from "@/lib/types";
import { AUCKLAND_SUBURBS } from "@/lib/auckland_locations";
import { MapPin, Navigation, Sparkles, ChevronDown } from "lucide-react";

interface HeaderProps {
  branches: ResolvedBranch[];
  lastUpdated: string;
  suburbName: string;
  onSelectSuburb: (name: string) => void;
  onLocateMe: () => void;
}

export default function Header({
  branches,
  lastUpdated,
  suburbName,
  onSelectSuburb,
  onLocateMe,
}: HeaderProps) {
  const dateStr = new Date(lastUpdated).toLocaleDateString("en-NZ", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-stone-200/60 sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          {/* Brand mark */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-base shadow-xs shrink-0 font-black">
              🛒
            </div>
            <div className="flex items-baseline gap-1.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
                Kai<span className="text-emerald-700">Spy</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-semibold text-[10px] tracking-wide border border-stone-200/60">
                Auckland
              </span>
            </div>
          </div>

          {/* Suburb pill selector & quick action links */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Pill dropdown */}
            <div className="relative flex items-center bg-stone-50 hover:bg-stone-100/70 border border-stone-200/80 rounded-full transition-colors shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 pointer-events-none" />
              <select
                value={suburbName}
                onChange={(e) => onSelectSuburb(e.target.value)}
                className="appearance-none pl-9 pr-8 py-1.5 bg-transparent text-xs sm:text-sm font-semibold text-stone-700 outline-none cursor-pointer rounded-full focus:ring-2 focus:ring-emerald-500/20"
                aria-label="Select Auckland suburb"
              >
                <option value="">Auckland Region (All)</option>
                <optgroup label="Central">
                  {AUCKLAND_SUBURBS.filter((s) => s.zone === "central").map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="North Shore">
                  {AUCKLAND_SUBURBS.filter((s) => s.zone === "north").map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="West">
                  {AUCKLAND_SUBURBS.filter((s) => s.zone === "west").map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="South & East">
                  {AUCKLAND_SUBURBS.filter((s) => s.zone === "south").map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-3 pointer-events-none" />
            </div>

            {/* Locate Me pill button */}
            <button
              onClick={onLocateMe}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200/70 border border-stone-200/80 rounded-full transition-all shadow-xs active:scale-95"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-700" />
              <span>Locate Me</span>
            </button>

            {/* Subtle quick-action links / update pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-stone-500 font-medium px-3 py-1 bg-stone-100/60 rounded-full border border-stone-200/50 whitespace-nowrap">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Updated {dateStr}</span>
            </div>
          </div>
        </div>

        {/* Selected Branches Chips (Pill badges with soft tints) */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-stone-100">
          <span className="text-[11px] font-semibold text-stone-400 mr-1 uppercase tracking-wider">
            Nearby:
          </span>
          {branches.map((b) => (
            <div
              key={b.branchId}
              className="px-2.5 py-1 rounded-full text-xs font-semibold border border-black/5 whitespace-nowrap shadow-2xs inline-flex items-center gap-1.5"
              style={{
                backgroundColor: b.color + "14", // 8% opacity tint
                color: b.color === "#FFD700" ? "#b45309" : b.color,
              }}
            >
              <span className="text-xs">{b.logoEmoji}</span>
              <span>{b.branchDisplayName}</span>
              {b.distanceKm !== null && (
                <span className="text-[10px] opacity-70 font-normal">
                  ({b.distanceKm.toFixed(1)} km)
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
