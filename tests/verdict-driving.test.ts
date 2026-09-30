import { describe, it } from "node:test";
import assert from "node:assert";
import { calculateWinnerVerdict } from "../src/lib/verdict";
import { selectTop3DistinctChains } from "../src/lib/auckland_locations";
import { createDefaultBasket } from "../src/lib/basket";
import { resolveBranches } from "../src/lib/data";
import { calculateDrivingCost } from "../src/lib/driving";
import { PriceDataset } from "../src/lib/types";
import rawData from "../data/auckland_staples.json";

const dataset = rawData as unknown as PriceDataset;

describe("FEAT-60: Driving Cost Integration with Supermarket Comparison", () => {
  it("computes driving cost for Auckland CBD top 3 stores", () => {
    const basket = createDefaultBasket();
    const branches = selectTop3DistinctChains(-36.8485, 174.7633); // CBD
    const resolved = resolveBranches(branches.branches, dataset.chains);
    const verdict = calculateWinnerVerdict(dataset.items, basket, resolved);

    assert.ok(verdict !== null, "Verdict should not be null");
    assert.strictEqual(resolved.length, 3, "Should have 3 distinct chains");

    // CBD stores
    const woolworths = resolved.find((b) => b.chainId === "woolworths")!;
    const newWorld = resolved.find((b) => b.chainId === "newworld")!;
    const paknsave = resolved.find((b) => b.chainId === "paknsave")!;

    // Distances: Woolworths ~0.8km, New World ~1.3km, PAK'nSAVE ~5.8km
    assert.strictEqual(woolworths.distanceKm, 0.8);
    assert.strictEqual(newWorld.distanceKm, 1.3);
    assert.strictEqual(paknsave.distanceKm, 5.8);

    // Fuel costs ($0.28/km)
    const wwFuel = calculateDrivingCost(woolworths.distanceKm, "FUEL");
    const nwFuel = calculateDrivingCost(newWorld.distanceKm, "FUEL");
    const pnsFuel = calculateDrivingCost(paknsave.distanceKm, "FUEL");

    assert.strictEqual(wwFuel, 0.22);
    assert.strictEqual(nwFuel, 0.36);
    assert.strictEqual(pnsFuel, 1.62);

    // IRD True Costs ($0.95/km)
    const wwIrd = calculateDrivingCost(woolworths.distanceKm, "IRD_TRUE_COST");
    const nwIrd = calculateDrivingCost(newWorld.distanceKm, "IRD_TRUE_COST");
    const pnsIrd = calculateDrivingCost(paknsave.distanceKm, "IRD_TRUE_COST");

    assert.strictEqual(wwIrd, 0.76);
    assert.strictEqual(nwIrd, 1.24);
    assert.strictEqual(pnsIrd, 5.51);

    // Verify delta impact: PAK'nSAVE driving cost under IRD adds $5.51
    const pnsGroceryTotal = verdict.winner.total; // e.g. $56.78
    const pnsTotalWithIrd = pnsGroceryTotal + pnsIrd;
    assert.strictEqual(Math.round((pnsTotalWithIrd - pnsGroceryTotal) * 100) / 100, 5.51);
  });
});
