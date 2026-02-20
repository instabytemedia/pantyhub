"use client";

import { useState } from "react";
import { Upload, Search, FolderOpen } from "lucide-react";
import { MediaGrid } from "@/components/media/media-grid";
import { FileUploader } from "@/components/upload/file-uploader";
import { useMedia } from "@/hooks/use-media";

export default function MediaPage() {
  const [showUploader, setShowUploader] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const { mediaFiles, loading, deleteMediaFile, refetch } = useMedia({
    search,
    folder: selectedFolder,
  });

  const folders = Array.from(
    new Set(mediaFiles.map((f) => f.folder).filter(Boolean))
  ).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
          <p className="text-sm text-muted-foreground">
            {mediaFiles.length} file{mediaFiles.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Upload className="h-4 w-4" />
          Upload
        </button>
      </div>

      {/* Uploader */}
      {showUploader && (
        <div className="rounded-lg border border-border bg-card p-4">
          <FileUploader
            bucket="media"
            maxFiles={20}
            onUploadComplete={() => {
              refetch();
              setShowUploader(false);
            }}
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2 text-sm"
          />
        </div>

        {folders.length > 0 && (
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedFolder ?? ""}
              onChange={(e) =>
                setSelectedFolder(e.target.value || null)
              }
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">All Folders</option>
              {folders.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Grid */}
      <MediaGrid
        files={mediaFiles}
        loading={loading}
        onDelete={deleteMediaFile}
      />
    </div>
  );
}
