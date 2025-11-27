// TMDB API functions

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const RESULTS_LIMIT = 50;
const RESULTS_PER_PAGE = 20; // TMDB returns 20 per page

// Helper to build URL with API key
function buildUrl(endpoint, params = {}) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", TMDB_API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

// Get list of movie genres (for filter dropdown)
export async function getGenres() {
  const url = buildUrl("/genre/movie/list");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch genres from TMDB API");
  }

  const data = await response.json();
  return data.genres; // Array of { id, name }
}

// Search movies by text query (title or actor name)
// Searches both movie titles and actor names, merges results
export async function searchMovies(query, year = "") {
  // If no query, return popular movies as fallback
  if (!query || query.trim() === "") {
    return getPopularMovies();
  }

  // Search both movie titles and actors in parallel
  const [movieResults, actorMovies] = await Promise.all([
    searchMoviesByTitle(query, year),
    searchMoviesByActor(query, year),
  ]);

  // Merge results, removing duplicates (by movie id)
  const seenIds = new Set();
  const mergedResults = [];

  // Add movie title matches first (usually more relevant)
  for (const movie of movieResults) {
    if (!seenIds.has(movie.id)) {
      seenIds.add(movie.id);
      mergedResults.push(movie);
    }
  }

  // Add actor's movies
  for (const movie of actorMovies) {
    if (!seenIds.has(movie.id)) {
      seenIds.add(movie.id);
      mergedResults.push(movie);
    }
  }

  return mergedResults.slice(0, RESULTS_LIMIT);
}

// Search movies by title
async function searchMoviesByTitle(query, year = "") {
  const params = {
    query: query,
    include_adult: "false",
  };

  if (year) {
    params.year = year;
  }

  // Fetch multiple pages
  const pagesToFetch = Math.ceil(RESULTS_LIMIT / RESULTS_PER_PAGE);
  const allResults = [];

  for (let page = 1; page <= pagesToFetch; page++) {
    params.page = page.toString();
    const url = buildUrl("/search/movie", params);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to search movies from TMDB API");
    }

    const data = await response.json();
    allResults.push(...data.results);

    if (page >= data.total_pages) break;
  }

  return allResults;
}

// Search movies by actor name
async function searchMoviesByActor(query, year = "") {
  // First, search for the person
  const personUrl = buildUrl("/search/person", {
    query: query,
    include_adult: "false",
  });

  const personResponse = await fetch(personUrl);
  if (!personResponse.ok) {
    return []; // Return empty if person search fails
  }

  const personData = await personResponse.json();

  // If no person found, return empty
  if (!personData.results || personData.results.length === 0) {
    return [];
  }

  // Get the top matching person (most popular)
  const person = personData.results[0];

  // Get their movie credits
  const creditsUrl = buildUrl(`/person/${person.id}/movie_credits`);
  const creditsResponse = await fetch(creditsUrl);

  if (!creditsResponse.ok) {
    return [];
  }

  const creditsData = await creditsResponse.json();

  // Combine cast and crew credits, sort by popularity
  let movies = [...(creditsData.cast || [])];
  movies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  // Filter by year if specified
  if (year) {
    const yearInt = parseInt(year);
    movies = movies.filter((movie) => {
      if (!movie.release_date) return false;
      const movieYear = new Date(movie.release_date).getFullYear();
      return movieYear === yearInt;
    });
  }

  return movies;
}

// Browse/discover movies by filters (genre, decade, sort, rating)
// Uses /discover/movie endpoint - supports full server-side filtering
export async function browseMovies(filters = {}) {
  const { genre, decade, sortBy = "popularity.desc", minRating = "0" } = filters;

  const params = {
    sort_by: sortBy,
    include_adult: "false",
  };

  // Add genre filter if specified
  if (genre) {
    params.with_genres = genre;
  }

  // Add decade filter if specified
  if (decade) {
    const startYear = parseInt(decade);
    const endYear = startYear + 9;
    params["primary_release_date.gte"] = `${startYear}-01-01`;
    params["primary_release_date.lte"] = `${endYear}-12-31`;
  }

  // Add minimum rating filter if specified
  if (minRating && minRating !== "0") {
    params["vote_average.gte"] = minRating;
    // Also require a minimum vote count to avoid obscure films with few votes
    params["vote_count.gte"] = "100";
  }

  // Fetch multiple pages to get RESULTS_LIMIT results
  const pagesToFetch = Math.ceil(RESULTS_LIMIT / RESULTS_PER_PAGE);
  const allResults = [];

  for (let page = 1; page <= pagesToFetch; page++) {
    params.page = page.toString();
    const url = buildUrl("/discover/movie", params);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to browse movies from TMDB API");
    }

    const data = await response.json();
    allResults.push(...data.results);

    // Stop if we've reached the end of results
    if (page >= data.total_pages) break;
  }

  return allResults.slice(0, RESULTS_LIMIT);
}

// Get popular movies (default view)
export async function getPopularMovies() {
  // Fetch multiple pages to get RESULTS_LIMIT results
  const pagesToFetch = Math.ceil(RESULTS_LIMIT / RESULTS_PER_PAGE);
  const allResults = [];

  for (let page = 1; page <= pagesToFetch; page++) {
    const url = buildUrl("/movie/popular", { page: page.toString() });

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch popular movies from TMDB API");
    }

    const data = await response.json();
    allResults.push(...data.results);

    // Stop if we've reached the end of results
    if (page >= data.total_pages) break;
  }

  return allResults.slice(0, RESULTS_LIMIT);
}

// Get full movie details by ID
export async function getMovieDetails(movieId) {
  const url = buildUrl(`/movie/${movieId}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch movie details from TMDB API");
  }

  const data = await response.json();
  return data;
}
