"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import MovieGrid from "@/components/MovieGrid";
import SearchBar from "@/components/SearchBar";
import {
  searchByTitle,
  searchByActor,
  discoverMovies,
  getGenres,
  getPopularMovies,
} from "@/lib/tmdb";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Store current search params for "Load More"
  const searchParamsRef = useRef({
    mode: "title",
    params: {},
  });

  // Load genres on mount
  useEffect(() => {
    async function loadGenres() {
      try {
        const genreList = await getGenres();
        setGenres(genreList);
      } catch (err) {
        console.error("Failed to load genres:", err);
      }
    }
    loadGenres();
  }, []);

  // Load popular movies on mount
  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        const data = await getPopularMovies();
        setMovies(data.results);
        setHasMore(data.hasMore);
        setCurrentPage(data.page);
        searchParamsRef.current = { mode: "popular", params: {} };
        setError(null);
      } catch (err) {
        setError("Failed to load movies from TMDB API");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, []);

  // Handle title search
  const handleSearchByTitle = useCallback(async ({ query, year }) => {
    try {
      setLoading(true);
      const data = await searchByTitle(query, year);
      setMovies(data.results);
      setHasMore(data.hasMore);
      setCurrentPage(data.page);
      searchParamsRef.current = { mode: "title", params: { query, year } };
      setError(null);
    } catch (err) {
      setError("Failed to search movies from TMDB API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle actor search
  const handleSearchByActor = useCallback(async ({ query, year }) => {
    try {
      setLoading(true);
      const data = await searchByActor(query, year);
      setMovies(data.results);
      setHasMore(data.hasMore);
      setCurrentPage(data.page);
      searchParamsRef.current = { mode: "actor", params: { query, year } };
      setError(null);
    } catch (err) {
      setError("Failed to search actors from TMDB API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle discover mode
  const handleDiscover = useCallback(
    async ({ genre, decade, sortBy, minRating }) => {
      try {
        setLoading(true);
        const data = await discoverMovies({ genre, decade, sortBy, minRating });
        setMovies(data.results);
        setHasMore(data.hasMore);
        setCurrentPage(data.page);
        searchParamsRef.current = {
          mode: "discover",
          params: { genre, decade, sortBy, minRating },
        };
        setError(null);
      } catch (err) {
        setError("Failed to discover movies from TMDB API");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Handle "Load More" button click
  const handleLoadMore = useCallback(async () => {
    const { mode, params } = searchParamsRef.current;
    const nextPage = currentPage + 1;

    try {
      setLoadingMore(true);
      let data;

      if (mode === "title") {
        data = await searchByTitle(params.query, params.year, nextPage);
      } else if (mode === "actor") {
        data = await searchByActor(params.query, params.year, nextPage);
      } else if (mode === "discover") {
        data = await discoverMovies(params, nextPage);
      } else {
        // popular
        data = await getPopularMovies(nextPage);
      }

      // Append new results to existing movies
      setMovies((prev) => [...prev, ...data.results]);
      setHasMore(data.hasMore);
      setCurrentPage(data.page);
      setError(null);
    } catch (err) {
      setError("Failed to load more movies");
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-50">Discover Movies</h1>
        <p className="text-slate-400 mt-1">
          Search by title, actor, or browse by genre
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-8">
        <SearchBar
          genres={genres}
          onSearchByTitle={handleSearchByTitle}
          onSearchByActor={handleSearchByActor}
          onDiscover={handleDiscover}
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="text-red-400 mb-4 p-4 bg-red-900/20 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="text-slate-400 text-center py-12">
          Loading movies...
        </div>
      ) : (
        <>
          <MovieGrid movies={movies} />

          {/* Load More button */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-3 bg-amber-500 text-slate-900 font-medium rounded-lg hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
