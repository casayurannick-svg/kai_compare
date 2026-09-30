# KaiCompare Auckland 🛒🇳🇿

Compare staple grocery prices across Auckland's major supermarkets (PAK'nSAVE, Woolworths NZ, New World, and The Warehouse). Find the best one-stop shop, discover real-time competitor savings, or use the Smart Split optimizer to split your haul across nearby stores.

## Features

- **Minimalist Modern Grocery Design (KC-UI-01)**: Soft pastel tints, pill badges, clean whitespace, and refined typography.
- **Suburb & Geolocation Selector**: Automatically finds the nearest branches within a 5 km radius (with fallback expansion) for 20+ Auckland suburbs.
- **Pre-Populated Baseline Basket (KC-STORY-01)**: Pre-seeds quantity 1 for all 9 core staples on initial load so the Winner Verdict renders immediately.
- **Staples Comparison Grid**: Compare prices across 9 essential supermarket staples with interactive pill steppers and lowest-price tags.
- **Winner Verdict Hero Card (KC-STORY-03)**: Real-time hero card highlighting the overall cheapest supermarket and dynamic competitor price deltas.
- **Smart Split Optimizer**: Multi-store routing that calculates maximum savings when splitting your haul across stores.
- **Shopping List Modal**: Categorized breakdown with copy-to-clipboard functionality.

---

## Minimalist Modern Grocery Card Redesign (KC-UI-01)

The interface follows modern e-grocery design aesthetics with a focus on scannability, soft color hierarchy, and tactile pill controls:

- **Warm Neutral Palette**: Built on a warm `bg-stone-50` backdrop with soft diffused shadows (`shadow-sm`, `shadow-stone-200/50`) and crisp stone typography (`text-stone-900`, `text-stone-500`).
- **Soft Pastel Card Tints**: Category and store cards feature gentle tints (`bg-amber-50/70`, `bg-emerald-50/70`, `bg-sky-50/70`, `bg-rose-50/50`) with subtle borders (`border-stone-200/60` and `border-black/5`).
- **Minimalist Sticky Header**: Translucent frosted navigation bar (`backdrop-blur-md`) with brand mark, suburb pill dropdown selector, "Locate Me" pill button, and soft nearby branch chips.
- **Fresh Grocery Hero Card (`WinnerVerdictCard.tsx`)**: Fresh sage/emerald banner layout with prominent winning store name, bold basket total, and neat runner-up savings pills (`Save $X.XX vs [Store]`).
- **Clean Grocery Cards (`ComparisonGrid.tsx`)**: Replaced dense table borders with individual clean grocery cards featuring category subtitles, unit pricing, pill steppers (`-` `qty` `+`), and subtle `✓ Lowest` price tags.
- **Smart Split & Action Drawer**: Restyled multi-store summary card, bottom action bar, and shopping list modal with pill buttons and soft card styling.

---

## Pre-Populated Default Staples Basket (KC-STORY-01)

To provide an instant high-value comparison on initial page load, KaiCompare pre-seeds the basket state with a baseline quantity of **1** for all 9 core staples (`DEFAULT_STAPLES_BASELINE`):

| Core Staple | Initial Quantity | Dataset Item ID |
| :--- | :---: | :--- |
| `rice-1kg` | **1** | `white-rice-1kg` |
| `bread-loaf` | **1** | `sandwich-bread-700g` |
| `eggs-dozen` | **1** | `eggs-dozen` |
| `flour-1.5kg` | **1** | `plain-flour-1-5kg` |
| `milk-2l` | **1** | `standard-milk-2l` |
| `cheese-1kg` | **1** | `edam-cheese-1kg` |
| `butter-500g` | **1** | `butter-500g` |
| `pork-chops-1kg` | **1** | `pork-chops-1kg` |
| `beef-mince-1kg` | **1** | `beef-mince-1kg` |

### User Experience & Interactivity
- **Instant Verdict**: The Winner Verdict hero card, store totals, and competitor savings render immediately on first visit without requiring shoppers to manually tap `+` on each item.
- **Full Stepper Interactivity**: Shoppers can adjust quantities (`+`, `-`), zero out individual items, or click the clear/trash action to reset the basket.
- **Seamless Recalculation**: All delta badges, winning totals, and marginal advice adapt dynamically as quantities change.

---

## Winner Verdict Hero Card & Price Delta Logic (KC-STORY-03)

The **Winner Verdict Hero Card** (`components/WinnerVerdictCard.tsx`) is positioned prominently below the location selector and above the staple item grid. It gives shoppers an immediate, high-confidence verdict on which supermarket offers the lowest total cost for their active basket.

### UI Behavior
- **Winning Store & Proximity**: Displays the #1 cheapest store name alongside distance from the selected suburb (e.g., `PAK'nSAVE Royal Oak • 1.4 km`).
- **Winning Basket Total**: Highlights the total cost for the active basket at the winning store in bold (`$XX.XX`).
- **Competitor Delta Badges**:
  - `Save $X.XX vs [Store 2] ([Dist] km)`
  - `Save $X.XX vs [Store 3] ([Dist] km)`
- **Marginal Price Note**: When the savings between 1st and 2nd place are under $0.75 (`isMarginal = true`), the card displays:
  > *Prices within $0.75 — choose nearest store*
  to encourage shoppers to prioritize travel convenience when savings are negligible.

### Price Delta & Ranking Logic (`lib/verdict.ts`)
1. **Inputs**:
   - Filtered nearby stores (`ResolvedBranch[]`)
   - Active basket quantities (`Basket`: map of `itemId` → `quantity`)
   - Unit & line prices from `data/auckland_staples.json` (`GroceryItem[]`)
2. **Total Calculation & Sorting**:
   - Calculates the total basket cost for each store based on active basket item quantities:
     $$\text{Total} = \sum (\text{Price}_{\text{branch}} \times \text{Quantity})$$
   - Prioritizes stores with full inventory in stock.
   - Sorts stores ascending by total cost:
     - `#1 Winner` (`winnerTotal`)
     - `#2 Runner-up` (`runnerUpTotal`)
     - `#3 Third` (`thirdTotal`)
3. **Deltas & Threshold**:
   - `deltaVsSecond = runnerUpTotal - winnerTotal`
   - `deltaVsThird = thirdTotal - winnerTotal`
   - `isMarginal = deltaVsSecond < 0.75`

---

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production Build & Validation

```bash
npm run build
npm run lint
```

## Deploy on Vercel

The app is deployed to Vercel via GitHub continuous deployment on the `main` branch.
