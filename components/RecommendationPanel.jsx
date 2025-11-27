"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { getRecommendations } from "@/lib/ai";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function RecommendationPanel({ movie, ratings }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Fetch recommendations
  async function handleGetRecommendations() {
    setLoading(true);
    setError(null);

    try {
      const recs = await getRecommendations(movie, ratings);
      setRecommendations(recs);
      setHasLoaded(true);
    } catch (err) {
      console.error("Failed to get recommendations:", err);
      setError("Failed to get recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      {/* Button to trigger recommendations */}
      {!hasLoaded && !loading && (
        <Button
          onClick={handleGetRecommendations}
          variant="outline"
          className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Get AI Recommendations
        </Button>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-3 py-4">
          <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
          <p className="text-slate-400">Finding movies you&apos;ll love...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="py-4">
          <p className="text-red-400 mb-3">{error}</p>
          <Button
            onClick={handleGetRecommendations}
            variant="outline"
            size="sm"
            className="border-slate-600"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Recommendations list */}
      {hasLoaded && !loading && !error && recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Recommended for You
          </h3>
          <div className="grid gap-3">
            {recommendations.map((rec, index) => (
              <RecommendationCard key={index} recommendation={rec} />
            ))}
          </div>
          {/* Button to refresh recommendations */}
          <Button
            onClick={handleGetRecommendations}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-300"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Get New Recommendations
          </Button>
        </div>
      )}
    </div>
  );
}

// Individual recommendation card
function RecommendationCard({ recommendation }) {
  const { title, year, reason, tmdbMovie } = recommendation;

  const posterUrl = tmdbMovie?.poster_path
    ? `${TMDB_IMAGE_BASE}${tmdbMovie.poster_path}`
    : "/placeholder-poster.png";

  const cardContent = (
    <Card className={`bg-slate-800/50 border-slate-700 overflow-hidden transition-colors ${tmdbMovie?.id ? "hover:bg-slate-700/50 cursor-pointer" : ""}`}>
      <div className="flex gap-4 p-4">
        {/* Poster */}
        <div className="w-16 flex-shrink-0">
          <img
            src={posterUrl}
            alt={`${title} poster`}
            className="w-full aspect-[2/3] object-cover rounded"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-slate-50 font-medium">
            {title} <span className="text-slate-400 font-normal">({year})</span>
          </h4>
          <p className="text-slate-300 text-sm mt-1">{reason}</p>
        </div>
      </div>
    </Card>
  );

  // If we have TMDB data, link to the movie detail page (opens in new tab)
  if (tmdbMovie?.id) {
    return (
      <Link href={`/movie/${tmdbMovie.id}`} target="_blank" rel="noopener noreferrer">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
