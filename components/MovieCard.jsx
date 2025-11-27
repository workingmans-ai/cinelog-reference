import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

// TMDB image base URL
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieCard({ movie, rating }) {
  // Build the poster URL, fallback to placeholder if no poster
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : "/placeholder-poster.png";

  // Extract year from release date
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : movie.year || "N/A";

  // Limit genres to 2 for display
  const displayGenres = (movie.genres || []).slice(0, 2);

  return (
    <Link href={`/movie/${movie.id}`}>
      <Card className="bg-slate-900 border-slate-800 overflow-hidden hover:scale-105 transition-transform cursor-pointer">
        {/* Poster */}
        <div className="aspect-[2/3] relative">
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            className="w-full h-full object-cover"
          />
          {/* Rating badge overlay */}
          {rating && (
            <div className="absolute top-2 right-2 bg-slate-900/90 rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span className="text-xs font-medium text-slate-50">{rating}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-3">
          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-50 truncate">
            {movie.title}
          </h3>

          {/* Year */}
          <p className="text-xs text-slate-400 mt-1">{year}</p>

          {/* Genre badges */}
          {displayGenres.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {displayGenres.map((genre) => (
                <Badge
                  key={genre.id || genre}
                  variant="secondary"
                  className="bg-slate-700 text-slate-300 text-xs px-2 py-0"
                >
                  {genre.name || genre}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
