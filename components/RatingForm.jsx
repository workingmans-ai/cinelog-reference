"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/StarRating";

// Rating dimensions with labels
const RATING_DIMENSIONS = [
  { key: "overall", label: "Overall", required: true },
  { key: "plot", label: "Plot", required: false },
  { key: "acting", label: "Acting", required: false },
  { key: "cinematography", label: "Cinematography", required: false },
  { key: "score", label: "Score/Music", required: false },
];

export default function RatingForm({
  movie,
  existingRating = null,
  onSubmit,
  onCancel,
  open = false,
}) {
  // Rating state for each dimension
  const [ratings, setRatings] = useState({
    overall: 0,
    plot: 0,
    acting: 0,
    cinematography: 0,
    score: 0,
  });

  // Initialize with existing rating if editing
  useEffect(() => {
    if (existingRating) {
      setRatings({
        overall: existingRating.overall || 0,
        plot: existingRating.plot || 0,
        acting: existingRating.acting || 0,
        cinematography: existingRating.cinematography || 0,
        score: existingRating.score || 0,
      });
    } else {
      // Reset when opening for a new rating
      setRatings({
        overall: 0,
        plot: 0,
        acting: 0,
        cinematography: 0,
        score: 0,
      });
    }
  }, [existingRating, open]);

  // Update a single dimension
  function handleRatingChange(key, value) {
    setRatings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  // Handle form submission
  function handleSubmit() {
    // Only include non-zero ratings (except overall which is required)
    const submittedRatings = {
      overall: ratings.overall,
    };

    // Add optional ratings only if they have a value
    if (ratings.plot > 0) submittedRatings.plot = ratings.plot;
    if (ratings.acting > 0) submittedRatings.acting = ratings.acting;
    if (ratings.cinematography > 0) submittedRatings.cinematography = ratings.cinematography;
    if (ratings.score > 0) submittedRatings.score = ratings.score;

    onSubmit(submittedRatings);
  }

  // Check if form is valid (overall rating is required)
  const isValid = ratings.overall > 0;

  // Build poster URL
  const posterUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w154${movie.poster_path}`
    : "/placeholder-poster.png";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="bg-slate-900 border-slate-700 text-slate-50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {existingRating ? "Edit Rating" : "Rate This Movie"}
          </DialogTitle>
        </DialogHeader>

        {/* Movie info */}
        <div className="flex gap-4 mb-6">
          <img
            src={posterUrl}
            alt={movie?.title || "Movie poster"}
            className="w-20 h-30 object-cover rounded"
          />
          <div>
            <h3 className="font-semibold text-lg">{movie?.title}</h3>
            <p className="text-slate-400 text-sm">
              {movie?.release_date?.split("-")[0] || "Unknown year"}
            </p>
          </div>
        </div>

        {/* Rating dimensions */}
        <div className="space-y-4">
          {RATING_DIMENSIONS.map((dimension) => (
            <div key={dimension.key} className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {dimension.label}
                {dimension.required && (
                  <span className="text-red-400 ml-1">*</span>
                )}
              </label>
              <StarRating
                value={ratings[dimension.key]}
                onChange={(value) => handleRatingChange(dimension.key, value)}
                size="md"
              />
            </div>
          ))}
        </div>

        {/* Validation message */}
        {!isValid && (
          <p className="text-sm text-slate-400 mt-2">
            Overall rating is required
          </p>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="flex-1 bg-amber-500 text-slate-900 hover:bg-amber-400 disabled:opacity-50"
          >
            {existingRating ? "Update Rating" : "Save Rating"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
