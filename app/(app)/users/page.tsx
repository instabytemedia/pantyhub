"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUsers } from "@/hooks/use-user";
import { UserCard } from "@/components/user/user-card";
import type { User } from "@/lib/schemas/user";
import { Plus, Search, Loader2 } from "lucide-react";

export default function UsersPage() {
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
  const [roleFilter, setRoleFilter] = useState<string | undefined>();
  const limit = 20;

  const { data: users, pagination, isLoading, error } = useUsers({
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
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">
            {pagination ? `${pagination.total} total` : "Loading..."}
          </p>
        </div>
        <Link
          href="/users/new"
          className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          New User
        </Link>
      </div>

      {/* Search + Sort toolbar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Users..."
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 pr-4"
            aria-label="Search Users"
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
            <option value="username">Username</option>
            <option value="email">Email</option>
            <option value="password">Password</option>
            <option value="role">Role</option>
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

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={roleFilter || ""}
          onChange={(e) => { setRoleFilter(e.target.value || undefined); setPage(1); }}
          className="rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">All roles</option>
          <option value="buyer">buyer</option>
          <option value="seller">seller</option>
        </select>
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
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium">No Users yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first User to get started.
          </p>
          <Link
            href="/users/new"
            className="mt-4 inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Create User
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((item: User) => (
            <UserCard key={item.id} user={item} />
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
