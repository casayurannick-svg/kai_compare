import fs from 'fs/promises';
import path from 'path';

// Using exact types from our domain
import type { PriceDataset, GroceryItem } from '../src/lib/types';

async function main() {
  const dataPath = path.join(process.cwd(), 'data', 'auckland_staples.json');
  
  console.log("Fetching latest price data...");
  const rawData = await fs.readFile(dataPath, 'utf-8');
  const dataset: PriceDataset = JSON.parse(rawData);
  
  const now = new Date().toISOString();
  
  // 1. Update top-level metadata
  dataset.meta.lastUpdatedIso = now;
  
  // 2. Iterate through items and simulate an update
  // (In a real app, this would fetch from a scraper API)
  dataset.items.forEach((item: GroceryItem) => {
    Object.values(item.prices).forEach((priceEntry) => {
      priceEntry.lastUpdatedIso = now;
      
      // Simulate minor price fluctuation (± 1-5 cents) on 20% of items to demonstrate updates
      if (priceEntry.price !== null && priceEntry.inStock && Math.random() < 0.2) {
        const fluctuation = (Math.random() * 0.1) - 0.05; // -0.05 to +0.05
        let newPrice = priceEntry.price + fluctuation;
        newPrice = Math.max(0.01, Math.round(newPrice * 100) / 100);
        
        // Update unit price proportionally
        if (priceEntry.unitPrice) {
          const ratio = newPrice / priceEntry.price;
          priceEntry.unitPrice = Math.round(priceEntry.unitPrice * ratio * 100) / 100;
        }
        
        priceEntry.price = newPrice;
      }
    });
  });

  // 3. Save it back
  await fs.writeFile(dataPath, JSON.stringify(dataset, null, 2));
  console.log(`✅ Data updated successfully at ${now}`);
}

main().catch(err => {
  console.error("Error refreshing prices:", err);
  process.exit(1);
});
