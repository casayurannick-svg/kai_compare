// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface StoreLocation {
  id: string;         // unique branch slug, e.g. "pns-royal-oak"
  chainId: string;    // parent chain: "paknsave" | "woolworths" | "newworld" | "warehouse"
  name: string;       // full display name, e.g. "PAK'nSAVE Royal Oak"
  address: string;
  lat: number;
  lng: number;
}

export interface AucklandSuburb {
  name: string;
  zone: "central" | "north" | "west" | "south";
  lat: number;
  lng: number;
}

export interface BranchWithDistance extends StoreLocation {
  distanceKm: number | null; // null = no suburb selected (showing defaults)
}

// ─── Store Locations (24 branches) ───────────────────────────────────────────

export const STORE_LOCATIONS: StoreLocation[] = [
  // ── PAK'nSAVE (7 branches) ──────────────────────────────────────────────
  { id: "pns-royal-oak",    chainId: "paknsave",   name: "PAK'nSAVE Royal Oak",   address: "953 Mt Eden Rd, Royal Oak",              lat: -36.9007, lng: 174.7785 },
  { id: "pns-sylvia-park",  chainId: "paknsave",   name: "PAK'nSAVE Sylvia Park", address: "286 Mt Wellington Hwy, Mt Wellington",   lat: -36.9147, lng: 174.8416 },
  { id: "pns-albany",       chainId: "paknsave",   name: "PAK'nSAVE Albany",      address: "218 Don McKinnon Dr, Albany",             lat: -36.7246, lng: 174.6995 },
  { id: "pns-lincoln-rd",   chainId: "paknsave",   name: "PAK'nSAVE Lincoln Rd",  address: "62 Lincoln Rd, Henderson",               lat: -36.8726, lng: 174.6400 },
  { id: "pns-manukau",      chainId: "paknsave",   name: "PAK'nSAVE Manukau",     address: "587 Great South Rd, Manukau",            lat: -37.0010, lng: 174.8711 },
  { id: "pns-ormiston",     chainId: "paknsave",   name: "PAK'nSAVE Ormiston",    address: "488 Ormiston Rd, Flat Bush",             lat: -36.9497, lng: 174.9303 },
  { id: "pns-mt-albert",    chainId: "paknsave",   name: "PAK'nSAVE Mt Albert",   address: "1198 New North Rd, Mt Albert",           lat: -36.8870, lng: 174.7200 },

  // ── Woolworths (6 branches) ─────────────────────────────────────────────
  { id: "ww-ponsonby",      chainId: "woolworths", name: "Woolworths Ponsonby",   address: "209 Ponsonby Rd, Ponsonby",              lat: -36.8566, lng: 174.7483 },
  { id: "ww-takapuna",      chainId: "woolworths", name: "Woolworths Takapuna",   address: "Westfield Takapuna, Takapuna",           lat: -36.7892, lng: 174.7771 },
  { id: "ww-westgate",      chainId: "woolworths", name: "Woolworths Westgate",   address: "Westgate Town Centre, Westgate",         lat: -36.7990, lng: 174.6264 },
  { id: "ww-manukau",       chainId: "woolworths", name: "Woolworths Manukau",    address: "1-7 Hayman Park, Manukau",               lat: -36.9900, lng: 174.8780 },
  { id: "ww-quay-st",       chainId: "woolworths", name: "Woolworths Quay St",    address: "67 Victoria St W, Auckland CBD",         lat: -36.8427, lng: 174.7680 },
  { id: "ww-newmarket",     chainId: "woolworths", name: "Woolworths Newmarket",  address: "Westfield Newmarket, Newmarket",         lat: -36.8713, lng: 174.7773 },

  // ── New World (6 branches) ──────────────────────────────────────────────
  { id: "nw-victoria-park", chainId: "newworld",   name: "New World Victoria Park", address: "218 Victoria St W, Auckland CBD",     lat: -36.8527, lng: 174.7498 },
  { id: "nw-browns-bay",    chainId: "newworld",   name: "New World Browns Bay",    address: "10 Anzac Rd, Browns Bay",             lat: -36.7053, lng: 174.7561 },
  { id: "nw-new-lynn",      chainId: "newworld",   name: "New World New Lynn",      address: "LynnMall, New Lynn",                  lat: -36.9042, lng: 174.6858 },
  { id: "nw-papatoetoe",    chainId: "newworld",   name: "New World Papatoetoe",    address: "55 St George St, Papatoetoe",         lat: -36.9820, lng: 174.8472 },
  { id: "nw-remuera",       chainId: "newworld",   name: "New World Remuera",       address: "263 Remuera Rd, Remuera",             lat: -36.8840, lng: 174.7900 },
  { id: "nw-albany",        chainId: "newworld",   name: "New World Albany",        address: "Albany Mall, Albany",                 lat: -36.7249, lng: 174.7000 },

  // ── The Warehouse (5 branches) ──────────────────────────────────────────
  { id: "tw-atrium-cbd",    chainId: "warehouse",  name: "The Warehouse Atrium",    address: "18 Atrium on Elliott, Auckland CBD",  lat: -36.8453, lng: 174.7648 },
  { id: "tw-glenfield",     chainId: "warehouse",  name: "The Warehouse Glenfield", address: "Glenfield Mall, Glenfield",           lat: -36.7783, lng: 174.7157 },
  { id: "tw-westcity",      chainId: "warehouse",  name: "The Warehouse WestCity",  address: "WestCity Mall, Henderson",            lat: -36.8741, lng: 174.6341 },
  { id: "tw-manukau",       chainId: "warehouse",  name: "The Warehouse Manukau",   address: "Manukau Supa Centa, Manukau",         lat: -37.0010, lng: 174.8711 },
  { id: "tw-sylvia-park",   chainId: "warehouse",  name: "The Warehouse Sylvia Park", address: "Sylvia Park Mall, Mt Wellington",  lat: -36.9147, lng: 174.8416 },
];

// ─── Auckland Suburbs ─────────────────────────────────────────────────────────

export const AUCKLAND_SUBURBS: AucklandSuburb[] = [
  // Central (7)
  { name: "Auckland CBD",  zone: "central", lat: -36.8485, lng: 174.7633 },
  { name: "Ponsonby",      zone: "central", lat: -36.8571, lng: 174.7470 },
  { name: "Newmarket",     zone: "central", lat: -36.8696, lng: 174.7763 },
  { name: "Grey Lynn",     zone: "central", lat: -36.8619, lng: 174.7395 },
  { name: "Mt Eden",       zone: "central", lat: -36.8798, lng: 174.7589 },
  { name: "Epsom",         zone: "central", lat: -36.8946, lng: 174.7739 },
  { name: "Mt Roskill",    zone: "central", lat: -36.9037, lng: 174.7256 },
  // North Shore (5)
  { name: "Takapuna",      zone: "north",   lat: -36.7884, lng: 174.7769 },
  { name: "Albany",        zone: "north",   lat: -36.7303, lng: 174.7066 },
  { name: "Browns Bay",    zone: "north",   lat: -36.7050, lng: 174.7559 },
  { name: "Glenfield",     zone: "north",   lat: -36.7791, lng: 174.7155 },
  { name: "Birkenhead",    zone: "north",   lat: -36.8148, lng: 174.7243 },
  // West (5)
  { name: "Henderson",     zone: "west",    lat: -36.8747, lng: 174.6333 },
  { name: "New Lynn",      zone: "west",    lat: -36.9042, lng: 174.6858 },
  { name: "Westgate",      zone: "west",    lat: -36.7967, lng: 174.6275 },
  { name: "Te Atatu",      zone: "west",    lat: -36.8612, lng: 174.6567 },
  { name: "Massey",        zone: "west",    lat: -36.8528, lng: 174.6244 },
  // South & East (6)
  { name: "Sylvia Park",   zone: "south",   lat: -36.9147, lng: 174.8416 },
  { name: "Manukau",       zone: "south",   lat: -36.9937, lng: 174.8778 },
  { name: "Botany",        zone: "south",   lat: -36.9353, lng: 174.9136 },
  { name: "Papatoetoe",    zone: "south",   lat: -36.9820, lng: 174.8472 },
  { name: "Ormiston",      zone: "south",   lat: -36.9507, lng: 174.9411 },
  { name: "Flat Bush",     zone: "south",   lat: -36.9618, lng: 174.9136 },
];

// ─── Haversine Distance ───────────────────────────────────────────────────────

/** Returns great-circle distance in kilometres between two WGS-84 coordinates. */
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Radius Filter Utilities ──────────────────────────────────────────────────

const CHAIN_IDS = ["paknsave", "woolworths", "newworld", "warehouse"];

/**
 * Given a reference point, find the nearest branch per chain within `radiusKm`.
 * Falls back to 2× radius then to absolute nearest if fewer than 2 chains qualify.
 */
export function getNearestBranchesWithinRadius(
  lat: number,
  lng: number,
  radiusKm = 5
): { branches: BranchWithDistance[]; expanded: boolean } {
  const withDist: BranchWithDistance[] = STORE_LOCATIONS.map((loc) => ({
    ...loc,
    distanceKm: Math.round(getDistanceKm(lat, lng, loc.lat, loc.lng) * 10) / 10,
  }));

  const nearestPerChain = (maxR: number): BranchWithDistance[] =>
    CHAIN_IDS.flatMap((chainId) => {
      const sorted = withDist
        .filter((b) => b.chainId === chainId && (b.distanceKm ?? 999) <= maxR)
        .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
      return sorted.length > 0 ? [sorted[0]] : [];
    });

  const primary = nearestPerChain(radiusKm);
  if (primary.length >= 2) return { branches: primary, expanded: false };

  const expanded = nearestPerChain(radiusKm * 2);
  if (expanded.length >= 2) return { branches: expanded, expanded: true };

  // Last resort: absolute nearest regardless of distance
  const absolute = CHAIN_IDS.flatMap((chainId) => {
    const sorted = withDist
      .filter((b) => b.chainId === chainId)
      .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
    return sorted.length > 0 ? [sorted[0]] : [];
  });
  return { branches: absolute, expanded: true };
}

/** Default branches shown when no suburb is selected (one representative per chain). */
export function getDefaultBranches(): BranchWithDistance[] {
  const defaults: Record<string, string> = {
    paknsave:   "pns-royal-oak",
    woolworths: "ww-ponsonby",
    newworld:   "nw-victoria-park",
    warehouse:  "tw-atrium-cbd",
  };
  return CHAIN_IDS.map((chainId) => ({
    ...STORE_LOCATIONS.find((l) => l.id === defaults[chainId])!,
    distanceKm: null,
  }));
}

/** Find the closest suburb name to a raw lat/lng (for device geolocation labelling). */
export function getNearestSuburbName(lat: number, lng: number): string {
  let best = AUCKLAND_SUBURBS[0];
  let bestDist = Infinity;
  for (const s of AUCKLAND_SUBURBS) {
    const d = getDistanceKm(lat, lng, s.lat, s.lng);
    if (d < bestDist) { bestDist = d; best = s; }
  }
  return best.name;
}
