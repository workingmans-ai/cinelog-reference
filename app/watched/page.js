"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRatings } from "@/lib/ratings-context";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StarRating from "@/components/StarRating";
import { Trash2 } from "lucide-react";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// Sort options
const SORT_OPTIONS = [
  { value: "date-desc", label: "Recently Added" },
  { value: "date-asc", label: "Oldest First" },
  { value: "rating-desc", label: "Highest Rated" },
  { value: "rating-asc", label: "Lowest Rated" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
];

export default function WatchedPage() {
  const { getAllRatings, deleteRating } = useRatings();
  const [sortBy, setSortBy] = useState("date-desc");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const allRatings = getAllRatings();

  // Sort ratings based on selected option
  const sortedRatings = useMemo(() => {
    const ratings = [...allRatings];

    switch (sortBy) {
      case "date-desc":
        return ratings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "date-asc":
        return ratings.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "rating-desc":
        return ratings.sort((a, b) => b.overall - a.overall);
      case "rating-asc":
        return ratings.sort((a, b) => a.overall - b.overall);
      case "title-asc":
        return ratings.sort((a, b) => a.movie.title.localeCompare(b.movie.title));
      case "title-desc":
        return ratings.sort((a, b) => b.movie.title.localeCompare(a.movie.title));
      default:
        return ratings;
    }
  }, [allRatings, sortBy]);

  // Handle delete confirmation
  function handleDeleteClick(movieId) {
    setDeleteConfirm(movieId);
  }

  async function handleDeleteConfirm(movieId) {
    setDeleteError(null);

    try {
      await deleteRating(movieId);
      setDeleteConfirm(null);
      console.log("[WatchedPage] Rating deleted successfully");
    } catch (err) {
      console.error("[WatchedPage] Failed to delete rating:", err);
      setDeleteError("Failed to delete rating. Please try again.");
      setDeleteConfirm(null);
    }
  }

  function handleDeleteCancel() {
    setDeleteConfirm(null);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-50">My Watched List</h1>
        <p className="text-slate-400 mt-1">
          {allRatings.length} {allRatings.length === 1 ? "movie" : "movies"} rated
        </p>
      </div>

      {/* Delete error message */}
      {deleteError && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
          <p className="text-red-400">{deleteError}</p>
        </div>
      )}

      {/* Empty state */}
      {allRatings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">You haven&apos;t rated any movies yet</p>
          <Link href="/">
            <Button className="bg-amber-500 hover:bg-amber-400 text-slate-900">
              Discover Movies
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Sort controls */}
          <div className="mb-6 flex items-center gap-4">
            <span className="text-sm text-slate-400">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-slate-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {SORT_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-slate-50"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rated movies grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRatings.map((rating) => {
              const movie = rating.movie;
              const posterUrl = movie.poster_path
                ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
                : "/placeholder-poster.png";

              const year = movie.release_date
                ? new Date(movie.release_date).getFullYear()
                : "N/A";

              const isDeleting = deleteConfirm === rating.movieId;

              return (
                <div
                  key={rating.movieId}
                  className="bg-slate-800/50 rounded-lg overflow-hidden"
                >
                  <Link href={`/movie/${rating.movieId}`}>
                    <div className="flex gap-4 p-4 hover:bg-slate-700/50 transition-colors">
                      {/* Poster */}
                      <img
                        src={posterUrl}
                        alt={`${movie.title} poster`}
                        className="w-20 h-30 object-cover rounded"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-50 truncate">
                          {movie.title}
                        </h3>
                        <p className="text-sm text-slate-400">{year}</p>

                        {/* Overall rating */}
                        <div className="mt-2">
                          <StarRating value={rating.overall} readonly size="sm" />
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Delete action */}
                  <div className="px-4 pb-4">
                    {isDeleting ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteConfirm(rating.movieId)}
                          className="flex-1"
                        >
                          Confirm Delete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleDeleteCancel}
                          className="flex-1 border-slate-600 text-slate-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(rating.movieId)}
                        className="text-slate-400 hover:text-red-400 hover:bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Rating
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
