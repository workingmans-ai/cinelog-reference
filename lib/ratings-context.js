"use client";

import { createContext, useContext, useState, useCallback } from "react";

// Create context
const RatingsContext = createContext(null);

// Provider component
export function RatingsProvider({ children }) {
  // Store ratings as an object with movie ID as key
  // { [movieId]: { overall, plot, acting, cinematography, score, movie } }
  const [ratings, setRatings] = useState({});

  // Save or update a rating
  const saveRating = useCallback((movieId, ratingData, movieData) => {
    setRatings((prev) => ({
      ...prev,
      [movieId]: {
        ...ratingData,
        movie: movieData,
        createdAt: prev[movieId]?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  // Get a rating by movie ID
  const getRating = useCallback(
    (movieId) => {
      return ratings[movieId] || null;
    },
    [ratings]
  );

  // Delete a rating
  const deleteRating = useCallback((movieId) => {
    setRatings((prev) => {
      const next = { ...prev };
      delete next[movieId];
      return next;
    });
  }, []);

  // Get all ratings as an array (for the watched list)
  const getAllRatings = useCallback(() => {
    return Object.entries(ratings).map(([movieId, data]) => ({
      movieId: parseInt(movieId),
      ...data,
    }));
  }, [ratings]);

  return (
    <RatingsContext.Provider
      value={{
        ratings,
        saveRating,
        getRating,
        deleteRating,
        getAllRatings,
      }}
    >
      {children}
    </RatingsContext.Provider>
  );
}

// Hook to use ratings context
export function useRatings() {
  const context = useContext(RatingsContext);
  if (!context) {
    throw new Error("useRatings must be used within a RatingsProvider");
  }
  return context;
}
