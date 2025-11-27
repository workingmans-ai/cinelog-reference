"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  saveRating as dbSaveRating,
  getRating as dbGetRating,
  deleteRating as dbDeleteRating,
  getAllRatings as dbGetAllRatings,
} from "@/lib/supabase";

// Create context
const RatingsContext = createContext(null);

// Provider component
export function RatingsProvider({ children }) {
  // Store ratings as an object with movie ID as key (local cache)
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all ratings from database on mount
  useEffect(() => {
    async function loadRatings() {
      try {
        setLoading(true);
        const allRatings = await dbGetAllRatings();

        // Convert array to object keyed by movieId
        const ratingsMap = {};
        allRatings.forEach((rating) => {
          ratingsMap[rating.movieId] = rating;
        });

        setRatings(ratingsMap);
        setError(null);
      } catch (err) {
        console.error("Failed to load ratings:", err);
        setError("Failed to load ratings from database");
      } finally {
        setLoading(false);
      }
    }

    loadRatings();
  }, []);

  // Save or update a rating
  const saveRating = useCallback(async (movieId, ratingData, movieData) => {
    try {
      // Save to database
      await dbSaveRating(movieId, ratingData, movieData);

      // Update local cache
      setRatings((prev) => ({
        ...prev,
        [movieId]: {
          ...ratingData,
          movie: movieData,
          movieId: movieId,
          createdAt: prev[movieId]?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }));

      return true;
    } catch (err) {
      console.error("Failed to save rating:", err);
      throw err;
    }
  }, []);

  // Get a rating by movie ID (from local cache)
  const getRating = useCallback(
    (movieId) => {
      return ratings[movieId] || null;
    },
    [ratings]
  );

  // Delete a rating
  const deleteRating = useCallback(async (movieId) => {
    try {
      // Delete from database
      await dbDeleteRating(movieId);

      // Update local cache
      setRatings((prev) => {
        const next = { ...prev };
        delete next[movieId];
        return next;
      });

      return true;
    } catch (err) {
      console.error("Failed to delete rating:", err);
      throw err;
    }
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
        loading,
        error,
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
