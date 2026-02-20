"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useShops } from "@/hooks/use-shop";
import { ShopCard } from "@/components/shop/shop-card";
import type { Shop } from "@/lib/schemas/shop";
import { Plus, Search, Loader2 } from "lucide-react";

export default function ShopsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  // Debounce search: wait 300ms after user stops typing before firing API call
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);
  const limit = 20;

  const { data: shops, pagination, isLoading, error } = useShops({
    page,
    limit,
    search: search || undefined,
    sort,
    order,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shops</h1>
          <p className="text-sm text-muted-foreground">
            {pagination ? `${pagination.total} total` : "Loading..."}
          </p>
        </div>
        <Link
          href="/shops/new"
          className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          New Shop
        </Link>
      </div>

      {/* Search + Sort toolbar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Shops..."
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 pr-4"
            aria-label="Search Shops"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-auto"
            aria-label="Sort by"
          >
            <option value="created_at">Date Created</option>
            <option value="updated_at">Last Updated</option>
            <option value="name">Name</option>
            <option value="description">Description</option>
          </select>
          <button
            type="button"
            onClick={() => setOrder(o => o === "asc" ? "desc" : "asc")}
            className="rounded border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-200 px-3"
            aria-label={order === "asc" ? "Sort descending" : "Sort ascending"}
            title={order === "asc" ? "Ascending" : "Descending"}
          >
            {order === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* Content */}
      {error && (
        <div className="rounded bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : shops.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium">No Shops yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first Shop to get started.
          </p>
          <Link
            href="/shops/new"
            className="mt-4 inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Create Shop
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((item: Shop) => (
            <ShopCard key={item.id} shop={item} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-200 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= pagination.totalPages}
            className="rounded border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
