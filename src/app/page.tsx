import React from "react";
import HomePageClient from "@/components/HomePageClient";
import ReferralTracker from "@/components/ReferralTracker";
import { getModelCatalogPage } from "@/lib/modelCatalog";
import { rankModels } from "@/lib/ranking";

// Revalidate the initial catalog at most once per minute.
export const revalidate = 60;

export default async function Home({ searchParams }: { searchParams?: Promise<{ city?: string }> }) {
  const [page, params] = await Promise.all([
    getModelCatalogPage(),
    searchParams ? searchParams : Promise.resolve({ city: undefined as string | undefined }),
  ]);
  const ranked = rankModels(page.models, params.city);

  return (
    <>
      <ReferralTracker />
      <HomePageClient
        initialModels={ranked}
        initialCursor={page.nextCursor}
        initialHasMore={page.hasMore}
        initialError={Boolean(page.error)}
      />
    </>
  );
}
