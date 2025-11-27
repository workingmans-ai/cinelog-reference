-- CineLog Seed Data
-- Run this in your Supabase SQL Editor after creating the schema
-- This adds sample movies and ratings for testing

-- Sample movies (from TMDB)
INSERT INTO movies (id, title, year, poster_path, overview, genres, runtime) VALUES
(550, 'Fight Club', 1999, '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', 'A ticking-Loss time bomb of a movie that careens between social satire, self-help parody, and fight-club action. Edward Norton plays an unnamed narrator who is discontented with his white-collar job.', ARRAY['Drama', 'Thriller'], 139),
(238, 'The Godfather', 1972, '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.', ARRAY['Drama', 'Crime'], 175),
(680, 'Pulp Fiction', 1994, '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', ARRAY['Thriller', 'Crime'], 154),
(155, 'The Dark Knight', 2008, '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations.', ARRAY['Drama', 'Action', 'Crime', 'Thriller'], 152),
(497, 'The Green Mile', 1999, '/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg', 'A supernatural tale set on death row in a Southern prison, where gentle giant John Coffey possesses the mysterious power to heal people''s ailments.', ARRAY['Fantasy', 'Drama', 'Crime'], 189)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  year = EXCLUDED.year,
  poster_path = EXCLUDED.poster_path,
  overview = EXCLUDED.overview,
  genres = EXCLUDED.genres,
  runtime = EXCLUDED.runtime;

-- Sample ratings for testing
INSERT INTO ratings (movie_id, overall, plot, acting, cinematography, score) VALUES
(550, 5, 5, 5, 4, 4),      -- Fight Club: loved it
(238, 5, 5, 5, 5, 5),      -- The Godfather: masterpiece
(680, 4, 4, 5, 4, 3),      -- Pulp Fiction: great but slightly lower score
(155, 4, 4, 4, 5, 5)       -- The Dark Knight: excellent visuals and score
ON CONFLICT (movie_id) DO UPDATE SET
  overall = EXCLUDED.overall,
  plot = EXCLUDED.plot,
  acting = EXCLUDED.acting,
  cinematography = EXCLUDED.cinematography,
  score = EXCLUDED.score,
  updated_at = NOW();

-- The Green Mile (movie_id 497) is intentionally NOT rated
-- This gives us a movie in the database without a rating for testing
