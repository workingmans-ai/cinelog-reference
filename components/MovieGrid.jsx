import MovieCard from "./MovieCard";

export default function MovieGrid({ movies, ratings = {} }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No movies found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          rating={ratings[movie.id]?.overall}
        />
      ))}
    </div>
  );
}
