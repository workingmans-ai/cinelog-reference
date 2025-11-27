import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star } from "lucide-react";

// Hardcoded movie for Phase 2 testing
const SAMPLE_MOVIE = {
  id: 550,
  title: "Fight Club",
  release_date: "1999-10-15",
  runtime: 139,
  overview:
    "A ticking-Loss time bomb of a movie. An insomniac office worker, looking for a way to change his life, crosses paths with a devil-may-care soapmaker, forming an underground fight club that evolves into something much, much more.",
  poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  genres: [
    { id: 18, name: "Drama" },
    { id: 53, name: "Thriller" },
  ],
};

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function MoviePage({ params }) {
  // In Phase 3, we'll fetch the actual movie data using params.id
  const movie = SAMPLE_MOVIE;

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
          </div>

          {/* Genres */}
          <div className="flex gap-2 mt-4">
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

          {/* Overview */}
          <p className="text-slate-300 mt-6 leading-relaxed">{movie.overview}</p>

          {/* Rate button - will be functional in Phase 4 */}
          <Button className="mt-8 bg-amber-500 hover:bg-amber-400 text-slate-900">
            <Star className="h-4 w-4 mr-2" />
            Rate This Movie
          </Button>

          <p className="text-slate-500 text-sm mt-4">
            Rating functionality will be added in Phase 4
          </p>
        </div>
      </div>
    </div>
  );
}
