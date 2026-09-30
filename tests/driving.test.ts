import { describe, it } from "node:test";
import assert from "node:assert";
import {
  IRD_MILEAGE_RATE_PER_KM,
  DEFAULT_FUEL_RATE_PER_KM,
  IRD_TOOLTIP_TEXT,
  calculateDrivingCost,
  calculateRoundTripDrivingCost,
} from "../src/lib/driving";

describe("FEAT-60: IRD True Cost & Mileage Calculations", () => {
  it("defines standard global constants correctly", () => {
    assert.strictEqual(IRD_MILEAGE_RATE_PER_KM, 0.95, "IRD Tier 1 rate must be $0.95/km");
    assert.strictEqual(DEFAULT_FUEL_RATE_PER_KM, 0.28, "Default fuel rate must be $0.28/km");
    assert.strictEqual(
      IRD_TOOLTIP_TEXT,
      "Includes depreciation, WOF, Rego, maintenance, and insurance.",
      "Tooltip text must exactly describe depreciation, WOF, Rego, maintenance, and insurance"
    );
  });

  describe("Mode: 'IRD_TRUE_COST' (distance * IRD_MILEAGE_RATE_PER_KM)", () => {
    it("calculates exact mathematical values for sample distances at $0.95/km", () => {
      // 10 km * 0.95 = $9.50
      assert.strictEqual(calculateDrivingCost(10, "IRD_TRUE_COST"), 9.5);

      // 5.0 km * 0.95 = $4.75
      assert.strictEqual(calculateDrivingCost(5.0, "IRD_TRUE_COST"), 4.75);

      // 5.8 km * 0.95 = 5.51
      assert.strictEqual(calculateDrivingCost(5.8, "IRD_TRUE_COST"), 5.51);

      // 1.4 km * 0.95 = 1.33
      assert.strictEqual(calculateDrivingCost(1.4, "IRD_TRUE_COST"), 1.33);

      // 0.8 km * 0.95 = 0.76
      assert.strictEqual(calculateDrivingCost(0.8, "IRD_TRUE_COST"), 0.76);

      // 0.1 km * 0.95 = 0.095 -> rounds to 0.10
      assert.strictEqual(calculateDrivingCost(0.1, "IRD_TRUE_COST"), 0.1);
    });

    it("handles zero, negative, null, undefined, and NaN distances safely", () => {
      assert.strictEqual(calculateDrivingCost(0, "IRD_TRUE_COST"), 0);
      assert.strictEqual(calculateDrivingCost(-5, "IRD_TRUE_COST"), 0);
      assert.strictEqual(calculateDrivingCost(null, "IRD_TRUE_COST"), 0);
      assert.strictEqual(calculateDrivingCost(undefined, "IRD_TRUE_COST"), 0);
      assert.strictEqual(calculateDrivingCost(NaN, "IRD_TRUE_COST"), 0);
    });

    it("calculates round-trip driving costs in IRD mode", () => {
      // 10 km round-trip = 20 km * 0.95 = $19.00
      assert.strictEqual(calculateRoundTripDrivingCost(10, "IRD_TRUE_COST"), 19.0);
      // 5.8 km round-trip = 11.6 km * 0.95 = $11.02
      assert.strictEqual(calculateRoundTripDrivingCost(5.8, "IRD_TRUE_COST"), 11.02);
    });
  });

  describe("Mode: 'FUEL' (distance * DEFAULT_FUEL_RATE_PER_KM)", () => {
    it("calculates exact mathematical values for sample distances at default fuel rate ($0.28/km)", () => {
      // 10 km * 0.28 = $2.80
      assert.strictEqual(calculateDrivingCost(10, "FUEL"), 2.8);

      // 5.0 km * 0.28 = $1.40
      assert.strictEqual(calculateDrivingCost(5.0, "FUEL"), 1.4);

      // 5.8 km * 0.28 = 1.624 -> rounds to 1.62
      assert.strictEqual(calculateDrivingCost(5.8, "FUEL"), 1.62);

      // 1.4 km * 0.28 = 0.392 -> rounds to 0.39
      assert.strictEqual(calculateDrivingCost(1.4, "FUEL"), 0.39);

      // 0.8 km * 0.28 = 0.224 -> rounds to 0.22
      assert.strictEqual(calculateDrivingCost(0.8, "FUEL"), 0.22);
    });

    it("supports custom fuel rate overrides", () => {
      // 10 km * $0.35/km = $3.50
      assert.strictEqual(calculateDrivingCost(10, "FUEL", 0.35), 3.5);
      // 5 km * $0.25/km = $1.25
      assert.strictEqual(calculateDrivingCost(5, "FUEL", 0.25), 1.25);
    });

    it("handles zero, negative, null, undefined, and NaN distances safely in fuel mode", () => {
      assert.strictEqual(calculateDrivingCost(0, "FUEL"), 0);
      assert.strictEqual(calculateDrivingCost(-5, "FUEL"), 0);
      assert.strictEqual(calculateDrivingCost(null, "FUEL"), 0);
      assert.strictEqual(calculateDrivingCost(undefined, "FUEL"), 0);
      assert.strictEqual(calculateDrivingCost(NaN, "FUEL"), 0);
    });

    it("calculates round-trip driving costs in fuel mode", () => {
      // 10 km round-trip = 20 km * 0.28 = $5.60
      assert.strictEqual(calculateRoundTripDrivingCost(10, "FUEL"), 5.6);
      // 5.8 km round-trip = 11.6 km * 0.28 = 3.248 -> $3.25
      assert.strictEqual(calculateRoundTripDrivingCost(5.8, "FUEL"), 3.25);
    });
  });

  describe("Comparative Analysis between Fuel and IRD True Cost", () => {
    it("verifies IRD True Cost is consistently higher to account for comprehensive vehicle ownership costs", () => {
      const testDistances = [1.0, 2.5, 5.0, 7.8, 10.0, 15.2];
      for (const dist of testDistances) {
        const fuelCost = calculateDrivingCost(dist, "FUEL");
        const irdCost = calculateDrivingCost(dist, "IRD_TRUE_COST");
        assert.ok(
          irdCost > fuelCost,
          `IRD cost (${irdCost}) must be greater than fuel cost (${fuelCost}) for distance ${dist}km`
        );
      }
    });

    it("correctly demonstrates trade-off where grocery savings are offset by IRD driving cost", () => {
      // Scenario: PAK'nSAVE is $4.00 cheaper for basket, but is 5.8 km away.
      const grocerySaving = 4.0;
      const distanceKm = 5.8;

      const fuelDrivingCost = calculateDrivingCost(distanceKm, "FUEL"); // $1.62
      const irdDrivingCost = calculateDrivingCost(distanceKm, "IRD_TRUE_COST"); // $5.51

      const netSavingFuel = grocerySaving - fuelDrivingCost; // $4.00 - $1.62 = +$2.38
      const netSavingIrd = grocerySaving - irdDrivingCost; // $4.00 - $5.51 = -$1.51

      assert.strictEqual(netSavingFuel > 0, true, "Fuel mode appears net positive");
      assert.strictEqual(netSavingIrd < 0, true, "IRD True Cost mode correctly reveals net loss");
    });
  });
});
