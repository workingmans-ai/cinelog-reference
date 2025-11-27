import { searchByTitle } from "./tmdb";

// Get AI-powered movie recommendations
export async function getRecommendations(movie, ratings) {
  // Call our API route (which calls Claude)
  const response = await fetch("/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ movie, ratings }),
  });

  if (!response.ok) {
    throw new Error("Failed to get recommendations");
  }

  const data = await response.json();

  // For each recommendation, search TMDB to get poster and details
  const enrichedRecommendations = await Promise.all(
    data.recommendations.map(async (rec) => {
      try {
        // Search TMDB for this movie by title and year
        const searchResults = await searchByTitle(rec.title, rec.year);

        // Find best match (first result is usually correct)
        const tmdbMovie = searchResults.results?.[0] || null;

        return {
          ...rec,
          tmdbMovie, // includes poster_path, id, overview, etc.
        };
      } catch (error) {
        // If TMDB search fails, return recommendation without poster
        console.error(`Failed to find ${rec.title} on TMDB:`, error);
        return { ...rec, tmdbMovie: null };
      }
    })
  );

  return enrichedRecommendations;
}
