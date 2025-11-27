// TMDB API functions
// Will be implemented in Phase 3

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function searchMovies(query, filters = {}) {
  // TODO: Implement in Phase 3
  return [];
}

export async function getPopularMovies() {
  // TODO: Implement in Phase 3
  return [];
}

export async function getMovieDetails(movieId) {
  // TODO: Implement in Phase 3
  return null;
}

export async function getGenres() {
  // TODO: Implement in Phase 3
  return [];
}
