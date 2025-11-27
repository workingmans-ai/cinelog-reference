"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

// Year options for Search mode (individual years, recent first)
const YEARS = Array.from({ length: 50 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { value: year.toString(), label: year.toString() };
});

// Decade options for Browse mode
const DECADES = [
  { value: "2020", label: "2020s" },
  { value: "2010", label: "2010s" },
  { value: "2000", label: "2000s" },
  { value: "1990", label: "1990s" },
  { value: "1980", label: "1980s" },
  { value: "1970", label: "1970s" },
];

// Sort options for Browse mode
const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "primary_release_date.desc", label: "Newest First" },
  { value: "primary_release_date.asc", label: "Oldest First" },
];

// Minimum rating options for Browse mode
const MIN_RATING_OPTIONS = [
  { value: "0", label: "Any Rating" },
  { value: "6", label: "6+ (Decent)" },
  { value: "7", label: "7+ (Good)" },
  { value: "8", label: "8+ (Great)" },
];

export default function SearchBar({ genres = [], onSearch, onBrowse }) {
  // Mode: "search" or "browse"
  const [mode, setMode] = useState("search");

  // Search mode state
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");

  // Browse mode state
  const [genre, setGenre] = useState("");
  const [decade, setDecade] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [minRating, setMinRating] = useState("0");

  // Debounced search - triggers 500ms after user stops typing/selecting
  // (500ms accounts for multi-page API fetches)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === "search") {
        onSearch({ query, year });
      } else {
        onBrowse({ genre, decade, sortBy, minRating });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [mode, query, year, genre, decade, sortBy, minRating, onSearch, onBrowse]);

  // Reset filters when switching modes
  function handleModeChange(newMode) {
    setMode(newMode);
    // Clear the other mode's filters
    if (newMode === "search") {
      setGenre("");
      setDecade("");
      setSortBy("popularity.desc");
      setMinRating("0");
    } else {
      setQuery("");
      setYear("");
    }
  }

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => handleModeChange("search")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "search"
              ? "bg-amber-500 text-slate-900"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          <Search className="h-4 w-4" />
          Title & Actor Search
        </button>
        <button
          onClick={() => handleModeChange("browse")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "browse"
              ? "bg-amber-500 text-slate-900"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter & Discover
        </button>
      </div>

      {/* Search mode panel */}
      {mode === "search" && (
        <div className="space-y-4">
          {/* Text input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by title, actor, or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-slate-50 placeholder:text-slate-400 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Year filter */}
          <div className="flex gap-4">
            <Select value={year || "all"} onValueChange={(val) => setYear(val === "all" ? "" : val)}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-slate-50">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
                <SelectItem value="all" className="text-slate-50">
                  All Years
                </SelectItem>
                {YEARS.map((y) => (
                  <SelectItem
                    key={y.value}
                    value={y.value}
                    className="text-slate-50"
                  >
                    {y.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Browse mode panel */}
      {mode === "browse" && (
        <div className="flex gap-4 flex-wrap">
          {/* Genre filter */}
          <Select value={genre || "all"} onValueChange={(val) => setGenre(val === "all" ? "" : val)}>
            <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-slate-50">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-slate-50">
                All Genres
              </SelectItem>
              {genres.map((g) => (
                <SelectItem
                  key={g.id}
                  value={g.id.toString()}
                  className="text-slate-50"
                >
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Decade filter */}
          <Select value={decade || "all"} onValueChange={(val) => setDecade(val === "all" ? "" : val)}>
            <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-slate-50">
              <SelectValue placeholder="Decade" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-slate-50">
                All Decades
              </SelectItem>
              {DECADES.map((d) => (
                <SelectItem
                  key={d.value}
                  value={d.value}
                  className="text-slate-50"
                >
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort by filter */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-slate-50">
              <SelectValue placeholder="Sort By" />
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

          {/* Minimum rating filter */}
          <Select value={minRating} onValueChange={setMinRating}>
            <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-slate-50">
              <SelectValue placeholder="Min Rating" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {MIN_RATING_OPTIONS.map((option) => (
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
      )}
    </div>
  );
}
