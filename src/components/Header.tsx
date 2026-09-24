import { ResolvedBranch } from "@/lib/types";
import { AUCKLAND_SUBURBS } from "@/lib/auckland_locations";
import { MapPin, Navigation } from "lucide-react";

interface HeaderProps {
  branches: ResolvedBranch[];
  lastUpdated: string;
  suburbName: string;
  onSelectSuburb: (name: string) => void;
  onLocateMe: () => void;
}

export default function Header({ branches, lastUpdated, suburbName, onSelectSuburb, onLocateMe }: HeaderProps) {
  const dateStr = new Date(lastUpdated).toLocaleDateString("en-NZ", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Kai<span className="text-amber-500">Compare</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium text-xs">
              v2.0
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3" />
              <select 
                value={suburbName} 
                onChange={(e) => onSelectSuburb(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer w-full sm:w-48"
              >
                <option value="">Auckland Region (All)</option>
                <optgroup label="Central">
                  {AUCKLAND_SUBURBS.filter(s => s.zone === "central").map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </optgroup>
                <optgroup label="North Shore">
                  {AUCKLAND_SUBURBS.filter(s => s.zone === "north").map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </optgroup>
                <optgroup label="West">
                  {AUCKLAND_SUBURBS.filter(s => s.zone === "west").map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </optgroup>
                <optgroup label="South & East">
                  {AUCKLAND_SUBURBS.filter(s => s.zone === "south").map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <button 
              onClick={onLocateMe}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Locate Me
            </button>
            
            <div className="text-xs text-slate-400 font-medium whitespace-nowrap">
              Updated: {dateStr}
            </div>
          </div>
        </div>

        {/* Selected Branches Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {branches.map((b) => (
            <div
              key={b.branchId}
              className="px-2.5 py-1 rounded-md text-xs font-bold border whitespace-nowrap"
              style={{
                backgroundColor: b.color + "1A", // 10% opacity
                borderColor: b.color + "33",     // 20% opacity
                color: b.color === "#FFD700" ? "#d97706" : b.color,
              }}
            >
              {b.logoEmoji} {b.branchDisplayName}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
