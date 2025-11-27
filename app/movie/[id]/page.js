"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Edit } from "lucide-react";
import { getMovieDetails } from "@/lib/tmdb";
import { useRatings } from "@/lib/ratings-context";
import RatingForm from "@/components/RatingForm";
import RatingDisplay from "@/components/RatingDisplay";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function MoviePage() {
  const params = useParams();
  const movieId = parseInt(params.id);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRatingForm, setShowRatingForm] = useState(false);

  const { getRating, saveRating } = useRatings();
  const existingRating = getRating(movieId);

  // Fetch movie details on mount
  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        const data = await getMovieDetails(movieId);
        setMovie(data);
        setError(null);
      } catch (err) {
        setError("Failed to load movie details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  // Handle rating submission
  function handleRatingSubmit(ratingData) {
    saveRating(movieId, ratingData, {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      genres: movie.genres,
      overview: movie.overview,
      runtime: movie.runtime,
    });
    setShowRatingForm(false);
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-slate-400 text-center py-12">
          Loading movie details...
        </div>
      </div>
    );
  }

  // Error state
  if (error || !movie) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-slate-300 hover:text-slate-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </Link>
        <div className="text-red-400 p-4 bg-red-900/20 rounded-lg">
          {error || "Movie not found"}
        </div>
      </div>
    );
  }

  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : "/placeholder-poster.png";

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link href="/">
        <Button variant="ghost" className="mb-6 text-slate-300 hover:text-slate-50">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>
      </Link>

      {/* Movie details */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="w-full md:w-80 flex-shrink-0">
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            className="w-full rounded-lg"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-50">{movie.title}</h1>

          <div className="flex items-center gap-4 mt-2 text-slate-400">
            <span>{year}</span>
            {movie.runtime && <span>{movie.runtime} min</span>}
            {/* TMDB Rating */}
            {movie.vote_average > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {movie.vote_average.toFixed(1)}
              </span>
            )}
          </div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {movie.genres.map((genre) => (
                <Badge
                  key={genre.id}
                  variant="secondary"
                  className="bg-slate-700 text-slate-300"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Cast */}
          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Starring</h3>
              <p className="text-slate-300">
                {movie.credits.cast
                  .slice(0, 5)
                  .map((actor) => actor.name)
                  .join(", ")}
              </p>
            </div>
          )}

          {/* Overview */}
          <p className="text-slate-300 mt-6 leading-relaxed">{movie.overview}</p>

          {/* Rating section */}
          <div className="mt-8 p-4 bg-slate-800/50 rounded-lg">
            {existingRating ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-50">Your Rating</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRatingForm(true)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                <RatingDisplay rating={existingRating} size="md" />
              </div>
            ) : (
              <div>
                <p className="text-slate-400 mb-4">You haven&apos;t rated this movie yet</p>
                <Button
                  onClick={() => setShowRatingForm(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Rate This Movie
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating form modal */}
      <RatingForm
        movie={movie}
        existingRating={existingRating}
        open={showRatingForm}
        onSubmit={handleRatingSubmit}
        onCancel={() => setShowRatingForm(false)}
      />
    </div>
  );
}
