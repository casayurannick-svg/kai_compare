# Driving Cost & IRD True Cost Mileage Logic (FEAT-60)

KaiSpy incorporates real-world driving mileage calculations into supermarket comparisons. When evaluating whether driving across Auckland to shop at a cheaper supermarket is worth it, shoppers can evaluate both **Fuel-Only** costs and the **IRD True Cost of Driving**.

---

## 1. Calculation Modes (`CalculationMode`)

KaiSpy supports two driving calculation modes:

1. **`FUEL` (Fuel Only)**:
   - Evaluates estimated petrol expenditure based on average Auckland fleet consumption (~9.5L/100km @ ~$2.95/L NZ petrol prices).
   - Baseline rate: `DEFAULT_FUEL_RATE_PER_KM = $0.28/km`.
   - **Formula**:
     $$\text{Driving Cost} = \text{Distance (km)} \times \$0.28$$

2. **`IRD_TRUE_COST` (IRD Tier 1 Mileage Rate)**:
   - Reflects the Inland Revenue (IRD) New Zealand Tier 1 standard mileage rate.
   - Baseline rate: `IRD_MILEAGE_RATE_PER_KM = $0.95/km`.
   - **Formula**:
     $$\text{Driving Cost} = \text{Distance (km)} \times \$0.95$$
   - **Tooltip Context**:
     > *"Includes depreciation, WOF, Rego, maintenance, and insurance."*

---

## 2. Global Constants (`src/lib/driving.ts`, `src/lib/constants.ts`)

```typescript
export const IRD_MILEAGE_RATE_PER_KM = 0.95;
export const DEFAULT_FUEL_RATE_PER_KM = 0.28;
export const IRD_TOOLTIP_TEXT =
  "Includes depreciation, WOF, Rego, maintenance, and insurance.";
```

---

## 3. UI Toggle & Comparison Cards

- **Toggle Switch (`DrivingCostToggle.tsx`)**:
  - Tailwind-styled segmented pill switch allowing shoppers to switch between `Fuel ($0.28/km)` and `IRD True Cost ($0.95/km)`.
  - Accessible `Info` icon with an interactive tooltip displaying the comprehensive ownership scope on hover and on click.
- **Winner Verdict Hero Card (`WinnerVerdictCard.tsx`)**:
  - Displays estimated driving cost to the winning store and trip total (groceries + driving).
- **One-Stop Shop Cards (`BasketPanel.tsx`, `ComparisonCard.tsx`)**:
  - Displays per-store driving cost, rate breakdown, and combined trip total alongside the grocery basket total.

---

## 4. Example: The Real Cost of Driving for Auckland Groceries

Suppose a shopper in Auckland CBD compares **Woolworths Quay St (0.8 km)** vs **PAK'nSAVE Mt Albert (5.8 km)** for a standard staples basket:

| Metric | Woolworths Quay St (0.8 km) | PAK'nSAVE Mt Albert (5.8 km) | Delta |
| :--- | :---: | :---: | :---: |
| **Grocery Basket** | $68.43 | $56.78 | Save $11.65 at PAK'nSAVE |
| **Driving (Fuel @ $0.28/km)** | $0.22 | $1.62 | +$1.40 driving cost |
| **Net Trip Total (Fuel)** | **$68.65** | **$58.40** | **Save $10.25 at PAK'nSAVE** |
| **Driving (IRD @ $0.95/km)** | $0.76 | $5.51 | +$4.75 driving cost |
| **Net Trip Total (IRD True Cost)** | **$69.19** | **$62.29** | **Save $6.90 at PAK'nSAVE** |

When basket savings are marginal ($1 - $2), IRD True Cost reveals when staying local actually saves money.
