import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Save movie metadata to database (upsert - insert or update)
export async function saveMovie(movie) {
  // Extract genre names from genre objects
  const genreNames = movie.genres
    ? movie.genres.map((g) => g.name)
    : [];

  // Extract year from release_date
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  const { data, error } = await supabase
    .from("movies")
    .upsert({
      id: movie.id,
      title: movie.title,
      year: year,
      poster_path: movie.poster_path,
      overview: movie.overview,
      genres: genreNames,
      runtime: movie.runtime,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving movie:", error);
    throw error;
  }

  return data;
}

// Save or update a rating (upsert - insert or update if exists)
export async function saveRating(movieId, ratings, movieData) {
  // First, ensure the movie exists in our database
  await saveMovie(movieData);

  // Upsert the rating (insert, or update if movie_id already exists)
  const { data, error } = await supabase
    .from("ratings")
    .upsert(
      {
        movie_id: movieId,
        overall: ratings.overall,
        plot: ratings.plot || null,
        acting: ratings.acting || null,
        cinematography: ratings.cinematography || null,
        score: ratings.score || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "movie_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Error saving rating:", error);
    throw error;
  }

  return data;
}

// Get rating for a specific movie
export async function getRating(movieId) {
  const { data, error } = await supabase
    .from("ratings")
    .select("*")
    .eq("movie_id", movieId)
    .single();

  // "PGRST116" means no rows found, which is fine
  if (error && error.code !== "PGRST116") {
    console.error("Error fetching rating:", error);
    throw error;
  }

  return data || null;
}

// Get all ratings with movie details
export async function getAllRatings() {
  const { data, error } = await supabase
    .from("ratings")
    .select(`
      *,
      movie:movies(*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching ratings:", error);
    throw error;
  }

  // Transform to match our app's data structure
  return data.map((rating) => ({
    movieId: rating.movie_id,
    overall: rating.overall,
    plot: rating.plot,
    acting: rating.acting,
    cinematography: rating.cinematography,
    score: rating.score,
    createdAt: rating.created_at,
    updatedAt: rating.updated_at,
    movie: {
      id: rating.movie.id,
      title: rating.movie.title,
      poster_path: rating.movie.poster_path,
      release_date: rating.movie.year ? `${rating.movie.year}-01-01` : null,
      genres: rating.movie.genres
        ? rating.movie.genres.map((name, index) => ({ id: index, name }))
        : [],
    },
  }));
}

// Delete a rating
export async function deleteRating(movieId) {
  const { error } = await supabase
    .from("ratings")
    .delete()
    .eq("movie_id", movieId);

  if (error) {
    console.error("Error deleting rating:", error);
    throw error;
  }

  return true;
}
