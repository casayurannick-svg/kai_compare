# KaiCompare Auckland 🛒🇳🇿

Compare staple grocery prices across Auckland's major supermarkets (PAK'nSAVE, Woolworths NZ, New World, and The Warehouse). Find the best one-stop shop, discover real-time competitor savings, or use the Smart Split optimizer to split your haul across nearby stores.

## Features

- **Suburb & Geolocation Selector**: Automatically finds the nearest branches within a 5 km radius (with fallback expansion) for 20+ Auckland suburbs.
- **Staples Comparison Grid**: Compare prices across 9 essential supermarket staples.
- **Winner Verdict Hero Card (KC-STORY-03)**: Real-time hero card highlighting the overall cheapest supermarket and dynamic competitor price deltas.
- **Smart Split Optimizer**: Multi-store routing that calculates maximum savings when splitting your haul across stores.
- **Shopping List Modal**: Categorized breakdown with copy-to-clipboard functionality.

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
