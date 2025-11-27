"use client";

import { useState } from "react";
import { Star } from "lucide-react";

// Size configurations for the star icons
const SIZES = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export default function StarRating({
  value = 0,
  onChange,
  readonly = false,
  size = "md",
}) {
  // Track which star is being hovered (1-5, or 0 if none)
  const [hoverValue, setHoverValue] = useState(0);

  // Handle clicking a star
  function handleClick(starNumber) {
    if (readonly) return;
    onChange(starNumber);
  }

  // Handle mouse entering a star
  function handleMouseEnter(starNumber) {
    if (readonly) return;
    setHoverValue(starNumber);
  }

  // Handle mouse leaving the star container
  function handleMouseLeave() {
    if (readonly) return;
    setHoverValue(0);
  }

  // Determine which value to display (hover takes priority over actual value)
  const displayValue = hoverValue > 0 ? hoverValue : value;

  return (
    <div
      className="flex gap-1"
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((starNumber) => {
        // Star is filled if its number is <= the display value
        const isFilled = starNumber <= displayValue;

        return (
          <button
            key={starNumber}
            type="button"
            onClick={() => handleClick(starNumber)}
            onMouseEnter={() => handleMouseEnter(starNumber)}
            disabled={readonly}
            className={`${readonly ? "cursor-default" : "cursor-pointer"} transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded`}
            aria-label={`Rate ${starNumber} out of 5 stars`}
          >
            <Star
              className={`${SIZES[size]} ${
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-slate-500"
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
}
