"use client";

import StarRating from "@/components/StarRating";

// Rating dimensions with labels (same as RatingForm)
const RATING_DIMENSIONS = [
  { key: "overall", label: "Overall" },
  { key: "plot", label: "Plot" },
  { key: "acting", label: "Acting" },
  { key: "cinematography", label: "Cinematography" },
  { key: "score", label: "Score/Music" },
];

export default function RatingDisplay({ rating, size = "sm" }) {
  if (!rating) {
    return (
      <p className="text-slate-400 text-sm">No rating yet</p>
    );
  }

  // Filter to only show dimensions that have ratings
  const ratedDimensions = RATING_DIMENSIONS.filter(
    (dimension) => rating[dimension.key] && rating[dimension.key] > 0
  );

  return (
    <div className="space-y-2">
      {ratedDimensions.map((dimension) => (
        <div key={dimension.key} className="flex items-center justify-between gap-4">
          <span className="text-sm text-slate-400">{dimension.label}</span>
          <StarRating
            value={rating[dimension.key]}
            readonly={true}
            size={size}
          />
        </div>
      ))}
    </div>
  );
}
