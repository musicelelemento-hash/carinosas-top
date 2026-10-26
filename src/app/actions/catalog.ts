"use server";

import {
  getModelCatalogPage,
  type ModelCatalogCursor,
  type ModelCatalogFilters,
} from "@/lib/modelCatalog";

export async function getModelCatalogPageAction(
  cursor: ModelCatalogCursor | null,
  filters: ModelCatalogFilters,
) {
  return getModelCatalogPage(cursor, filters);
}
