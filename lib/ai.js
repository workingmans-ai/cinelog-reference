import { searchByTitle } from "./tmdb";

// Get AI-powered movie recommendations
export async function getRecommendations(movie, ratings, focusText = "") {
  // Call our API route (which calls Claude)
  const response = await fetch("/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ movie, ratings, focusText }),
  });

  if (!response.ok) {
    throw new Error("Failed to get recommendations");
  }

  const data = await response.json();

  // For each recommendation, search TMDB to get poster and details
  const enrichedRecommendations = [];

  for (const rec of data.recommendations) {
    try {
      // Search TMDB for this movie by title and year
      const searchResults = await searchByTitle(rec.title, rec.year);
      const tmdbMovie = searchResults.results?.[0] || null;

      enrichedRecommendations.push({ ...rec, tmdbMovie });
    } catch (error) {
      // If TMDB search fails, return recommendation without poster
      console.error(`Failed to find ${rec.title} on TMDB:`, error);
      enrichedRecommendations.push({ ...rec, tmdbMovie: null });
    }
  }

  return enrichedRecommendations;
}
