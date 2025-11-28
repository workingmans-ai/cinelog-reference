// TMDB API functions

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const RESULTS_PER_PAGE = 20;

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
    console.error("[TMDB] Failed to fetch genres, status:", response.status);
    throw new Error("Failed to fetch genres from TMDB API");
  }

  const data = await response.json();
  console.log("[TMDB] Loaded", data.genres.length, "genres");
  return data.genres; // Array of { id, name }
}

// Search movies by title
// Uses /search/movie endpoint with pagination
export async function searchByTitle(query, year = "", page = 1) {
  // If no query, return popular movies as fallback
  if (!query || query.trim() === "") {
    return getPopularMovies(page);
  }

  const params = {
    query: query,
    include_adult: "false",
    page: page.toString(),
  };

  // Add year filter if specified
  if (year) {
    params.year = year;
  }

  const url = buildUrl("/search/movie", params);

  const response = await fetch(url);
  if (!response.ok) {
    console.error("[TMDB] Failed to search movies, status:", response.status);
    throw new Error("Failed to search movies from TMDB API");
  }

  const data = await response.json();
  console.log("[TMDB] Search found", data.results.length, "movies for:", query);

  return {
    results: data.results,
    page: data.page,
    totalPages: data.total_pages,
    hasMore: data.page < data.total_pages,
  };
}

// Search movies by actor name
// Note: Actor credits don't support server-side pagination,
// so we do client-side pagination
export async function searchByActor(query, year = "", page = 1) {
  // If no query, return popular movies as fallback
  if (!query || query.trim() === "") {
    return getPopularMovies(page);
  }

  // Step 1: Search for the person
  const personUrl = buildUrl("/search/person", {
    query: query,
    include_adult: "false",
  });

  const personResponse = await fetch(personUrl);
  if (!personResponse.ok) {
    console.error("[TMDB] Failed to search actors, status:", personResponse.status);
    throw new Error("Failed to search actors from TMDB API");
  }

  const personData = await personResponse.json();

  // If no person found, return empty results
  if (!personData.results || personData.results.length === 0) {
    return {
      results: [],
      page: 1,
      totalPages: 1,
      hasMore: false,
    };
  }

  // Get the top matching person (most popular)
  const person = personData.results[0];

  // Step 2: Get their movie credits
  const creditsUrl = buildUrl(`/person/${person.id}/movie_credits`);

  const creditsResponse = await fetch(creditsUrl);
  if (!creditsResponse.ok) {
    console.error("[TMDB] Failed to fetch actor credits, status:", creditsResponse.status);
    throw new Error("Failed to fetch actor credits from TMDB API");
  }

  const creditsData = await creditsResponse.json();

  // Get cast credits, sorted by popularity
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

  // Client-side pagination
  const totalPages = Math.ceil(movies.length / RESULTS_PER_PAGE);
  const startIndex = (page - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const paginatedResults = movies.slice(startIndex, endIndex);

  return {
    results: paginatedResults,
    page: page,
    totalPages: totalPages,
    hasMore: page < totalPages,
  };
}

// Discover movies by filters (genre, decade, sort, rating)
// Uses /discover/movie endpoint with pagination
export async function discoverMovies(filters = {}, page = 1) {
  const { genre, decade, sortBy = "popularity.desc", minRating = "0" } = filters;

  const params = {
    sort_by: sortBy,
    include_adult: "false",
    page: page.toString(),
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
    // Require minimum vote count to avoid obscure films
    params["vote_count.gte"] = "100";
  }

  const url = buildUrl("/discover/movie", params);

  const response = await fetch(url);
  if (!response.ok) {
    console.error("[TMDB] Failed to discover movies, status:", response.status);
    throw new Error("Failed to discover movies from TMDB API");
  }

  const data = await response.json();
  console.log("[TMDB] Discover found", data.results.length, "movies");

  return {
    results: data.results,
    page: data.page,
    totalPages: data.total_pages,
    hasMore: data.page < data.total_pages,
  };
}

// Get popular movies (default view) with pagination
export async function getPopularMovies(page = 1) {
  const url = buildUrl("/movie/popular", { page: page.toString() });

  const response = await fetch(url);
  if (!response.ok) {
    console.error("[TMDB] Failed to fetch popular movies, status:", response.status);
    throw new Error("Failed to fetch popular movies from TMDB API");
  }

  const data = await response.json();
  console.log("[TMDB] Loaded", data.results.length, "popular movies, page", page);

  return {
    results: data.results,
    page: data.page,
    totalPages: data.total_pages,
    hasMore: data.page < data.total_pages,
  };
}

// Get full movie details by ID (includes cast via append_to_response)
export async function getMovieDetails(movieId) {
  const url = buildUrl(`/movie/${movieId}`, {
    append_to_response: "credits",
  });

  const response = await fetch(url);
  if (!response.ok) {
    console.error("[TMDB] Failed to fetch movie details, status:", response.status);
    throw new Error("Failed to fetch movie details from TMDB API");
  }

  const data = await response.json();
  console.log("[TMDB] Loaded details for:", data.title);
  return data;
}
