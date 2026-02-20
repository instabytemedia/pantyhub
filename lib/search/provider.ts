import type { SearchQuery, SearchResponse, IndexConfig } from "@/types/search";

/**
 * Abstract search provider interface.
 * Implement this to add Meilisearch, Algolia, or other backends.
 */
export interface SearchProvider {
  /** Provider name for logging */
  readonly name: string;

  /** Search documents in a given index */
  search<T = Record<string, unknown>>(
    index: string,
    query: SearchQuery
  ): Promise<SearchResponse<T>>;

  /** Index a single document (upsert) */
  indexDocument(
    index: string,
    id: string,
    document: Record<string, unknown>
  ): Promise<void>;

  /** Remove a document from the index */
  removeDocument(index: string, id: string): Promise<void>;

  /** Create or update an index configuration */
  configureIndex(config: IndexConfig): Promise<void>;

  /** Health check */
  isHealthy(): Promise<boolean>;
}

/** Active provider instance — set at app init */
let activeProvider: SearchProvider | null = null;

export function setSearchProvider(provider: SearchProvider): void {
  activeProvider = provider;
}

export function getSearchProvider(): SearchProvider {
  if (!activeProvider) {
    throw new Error(
      "Search provider not initialized. Call setSearchProvider() at app startup."
    );
  }
  return activeProvider;
}
