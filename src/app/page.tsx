import { fetchPriceData } from "@/lib/data";
import AppClient from "@/components/AppClient";

// Free tier ISR - Revalidate once a day
export const revalidate = 86400;

export default async function Home() {
  const dataset = await fetchPriceData();
  
  return (
    <AppClient 
      items={dataset.items} 
      chains={dataset.chains} 
      lastUpdated={dataset.meta.lastUpdatedIso} 
    />
  );
}
