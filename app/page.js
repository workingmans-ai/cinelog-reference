"use client";

import { useState, useEffect, useCallback } from "react";
import MovieGrid from "@/components/MovieGrid";
import SearchBar from "@/components/SearchBar";
import { searchMovies, browseMovies, getGenres, getPopularMovies } from "@/lib/tmdb";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const results = await getPopularMovies();
        setMovies(results);
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

  // Handle search mode (title/actor/keyword + year)
  const handleSearch = useCallback(async ({ query, year }) => {
    try {
      setLoading(true);
      const results = await searchMovies(query, year);
      setMovies(results);
      setError(null);
    } catch (err) {
      setError("Failed to search movies from TMDB API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle browse mode (genre, decade, sort, rating)
  const handleBrowse = useCallback(async ({ genre, decade, sortBy, minRating }) => {
    try {
      setLoading(true);
      const results = await browseMovies({ genre, decade, sortBy, minRating });
      setMovies(results);
      setError(null);
    } catch (err) {
      setError("Failed to browse movies from TMDB API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-50">Discover Movies</h1>
        <p className="text-slate-400 mt-1">
          Search by title or browse by genre
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-8">
        <SearchBar
          genres={genres}
          onSearch={handleSearch}
          onBrowse={handleBrowse}
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
        <MovieGrid movies={movies} />
      )}
    </div>
  );
}
