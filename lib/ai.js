import { searchByTitle } from "./tmdb";

// Get AI-powered movie recommendations
export async function getRecommendations(movie, ratings, focusText = "") {
  console.log("[AI] Requesting recommendations for:", movie.title);

  // Call our API route (which calls Claude)
  const response = await fetch("/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ movie, ratings, focusText }),
  });

  if (!response.ok) {
    console.error("[AI] API request failed, status:", response.status);
    throw new Error("Failed to get recommendations");
  }

  const data = await response.json();
  console.log("[AI] Received", data.recommendations?.length || 0, "recommendations");

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
      console.error("[AI] Failed to find", rec.title, "on TMDB:", error.message);
      enrichedRecommendations.push({ ...rec, tmdbMovie: null });
    }
  }

  console.log("[AI] Enriched", enrichedRecommendations.length, "recommendations with TMDB data");
  return enrichedRecommendations;
}
