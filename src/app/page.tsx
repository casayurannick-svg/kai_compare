import { fetchPriceData } from "@/lib/data";
import AppClient from "@/components/AppClient";

// Revalidate every 24 hours for ISR – zero cost on Vercel Hobby
export const revalidate = 86400;

export default async function Home() {
  const dataset = await fetchPriceData();

  return (
    <AppClient
      items={dataset.items}
      stores={dataset.stores}
      lastUpdated={dataset.meta.lastUpdatedIso}
    />
  );
}
