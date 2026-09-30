/**
 * Driving and Mileage Cost Calculation (FEAT-60)
 *
 * Implements driving cost comparisons between standard fuel-only estimates
 * and the IRD Tier 1 mileage rate ("True Cost" of driving).
 */

export type CalculationMode = "FUEL" | "IRD_TRUE_COST";

/**
 * Standard IRD Tier 1 mileage rate in NZD per km.
 * Official Inland Revenue (IRD) New Zealand Tier 1 rate: $0.95 / km.
 * Encompasses full running costs: fuel, depreciation, WOF, Rego, maintenance, and insurance.
 */
export const IRD_MILEAGE_RATE_PER_KM = 0.95;

/**
 * Standard average fuel-only cost estimate in NZD per km in New Zealand.
 * Based on typical fleet consumption (~9.5L/100km) @ NZ average fuel price (~$2.95/L) = ~$0.28/km.
 */
export const DEFAULT_FUEL_RATE_PER_KM = 0.28;

/**
 * Exact tooltip description explaining what IRD True Cost encompasses.
 */
export const IRD_TOOLTIP_TEXT =
  "Includes depreciation, WOF, Rego, maintenance, and insurance.";

/**
 * Calculates one-way driving cost based on distance in km and calculation mode.
 * - 'IRD_TRUE_COST': distance_in_km * IRD_MILEAGE_RATE_PER_KM ($0.95/km)
 * - 'FUEL': distance_in_km * fuelRatePerKm (default $0.28/km)
 *
 * @param distanceInKm Distance to supermarket in kilometres
 * @param mode Calculation mode ('FUEL' | 'IRD_TRUE_COST')
 * @param fuelRatePerKm Custom fuel rate per km override (defaults to $0.28/km)
 * @returns Driving cost in NZD, rounded to 2 decimal places
 */
export function calculateDrivingCost(
  distanceInKm: number | null | undefined,
  mode: CalculationMode = "FUEL",
  fuelRatePerKm: number = DEFAULT_FUEL_RATE_PER_KM
): number {
  if (distanceInKm == null || isNaN(distanceInKm) || distanceInKm <= 0) {
    return 0;
  }
  const rate = mode === "IRD_TRUE_COST" ? IRD_MILEAGE_RATE_PER_KM : fuelRatePerKm;
  return Math.round((distanceInKm * rate + 1e-9) * 100) / 100;
}

/**
 * Calculates round-trip driving cost (2 × one-way distance).
 *
 * @param distanceInKm Distance to supermarket in kilometres
 * @param mode Calculation mode ('FUEL' | 'IRD_TRUE_COST')
 * @param fuelRatePerKm Custom fuel rate per km override (defaults to $0.28/km)
 * @returns Round-trip driving cost in NZD, rounded to 2 decimal places
 */
export function calculateRoundTripDrivingCost(
  distanceInKm: number | null | undefined,
  mode: CalculationMode = "FUEL",
  fuelRatePerKm: number = DEFAULT_FUEL_RATE_PER_KM
): number {
  if (distanceInKm == null || isNaN(distanceInKm) || distanceInKm <= 0) {
    return 0;
  }
  return calculateDrivingCost(distanceInKm * 2, mode, fuelRatePerKm);
}
