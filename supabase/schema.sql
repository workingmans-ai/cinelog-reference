-- CineLog Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Movies table: stores movie metadata from TMDB
-- We cache this so we don't need to fetch from TMDB every time
CREATE TABLE movies (
  id BIGINT PRIMARY KEY,              -- TMDB movie ID (not auto-generated)
  title TEXT NOT NULL,
  year INTEGER,
  poster_path TEXT,
  overview TEXT,
  genres TEXT[],                      -- Array of genre names like ['Action', 'Drama']
  runtime INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ratings table: stores the user's movie ratings
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movie_id BIGINT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  overall INTEGER NOT NULL CHECK (overall >= 1 AND overall <= 5),
  plot INTEGER CHECK (plot IS NULL OR (plot >= 1 AND plot <= 5)),
  acting INTEGER CHECK (acting IS NULL OR (acting >= 1 AND acting <= 5)),
  cinematography INTEGER CHECK (cinematography IS NULL OR (cinematography >= 1 AND cinematography <= 5)),
  score INTEGER CHECK (score IS NULL OR (score >= 1 AND score <= 5)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(movie_id)                    -- One rating per movie
);

-- Row Level Security (RLS) policies
-- For this simple app without auth, we allow all operations
-- In a production app, you'd restrict these to authenticated users

ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Allow all operations on movies table (public access)
CREATE POLICY "Allow all operations on movies" ON movies
  FOR ALL USING (true) WITH CHECK (true);

-- Allow all operations on ratings table (public access)
CREATE POLICY "Allow all operations on ratings" ON ratings
  FOR ALL USING (true) WITH CHECK (true);
