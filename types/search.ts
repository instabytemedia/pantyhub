export interface SearchQuery {
  query: string;
  filters?: Record<string, string | number | boolean>;
  page?: number;
  limit?: number;
  sort?: {
    field: string;
    direction: "asc" | "desc";
  };
}

export interface SearchHit<T = Record<string, unknown>> {
  id: string;
  score: number;
  document: T;
  highlights?: Record<string, string>;
}

export interface SearchResponse<T = Record<string, unknown>> {
  hits: SearchHit<T>[];
  totalHits: number;
  query: string;
  processingTimeMs: number;
  page: number;
  totalPages: number;
}

export interface IndexConfig {
  name: string;
  primaryKey: string;
  searchableAttributes: string[];
  filterableAttributes?: string[];
  sortableAttributes?: string[];
}
