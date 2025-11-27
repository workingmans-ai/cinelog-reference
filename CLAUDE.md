You are building CineLog, a personal movie tracker app. This is a REFERENCE IMPLEMENTATION for a coding course, which will be built in another project. The reference app must be simple enough for a beginner to understand while still being functional and polished.

## About Cinelog:

This app serves as:

1. **Validation** — Confirms the course lesson plan is accurate and teachable
2. **Demo** — Shows Pablo what he's building toward (motivation)
3. **Reference** — Provides correct implementation patterns for the teaching scripts

## Critical Constraint

This app will be rebuilt by a beginner named Pablo as part of a 75-lesson course (see `/guidance/cinelog-course-structure.md`). Every architectural decision, pattern, and component must be:

- **Teachable** — Can be explained in 20-40 minutes
- **Incremental** — Can be built step-by-step
- **Beginner-friendly** — No advanced patterns, no premature optimization

DO NOT add complexity beyond what's specified. If something isn't listed, don't include it.

## App Specifications

### Features (Complete List)

**1. Movie Search (Three Modes)**

Due to TMDB API limitations (see `/guidance/cinelog-course-structure.md`), search is split into three modes:

- **By Title Mode:**
  - Search movies by title
  - Optional year filter
  - Uses `/search/movie` endpoint

- **By Actor Mode:**
  - Search movies featuring an actor
  - Optional year filter
  - Uses `/search/person` → `/person/{id}/movie_credits` (two-step)

- **Discover Mode:**
  - Browse by genre (dropdown)
  - Filter by decade (dropdown)
  - Sort by: popularity, rating, release date
  - Filter by minimum rating
  - Uses `/discover/movie` endpoint

- **All modes:**
  - Show popular movies on initial load
  - Display results as card grid (poster, title, year, genre badges)
  - "Load More" button to paginate results
  - Click card to see movie details

**2. Movie Details View**

- Larger poster
- Title, year, runtime, overview
- Genre badges
- "Rate This Movie" button (opens rating form)
- "Back to Search" navigation

**3. Rating System**

- 5-star rating component (click to rate)
- 5 rating dimensions:
  - Overall (required, 1-5 stars)
  - Plot (optional, 1-5 stars)
  - Acting (optional, 1-5 stars)
  - Cinematography (optional, 1-5 stars)
  - Score/Music (optional, 1-5 stars)
- Submit saves to database
- Can only rate each movie once (update if already rated)

**4. Watched List**

- Grid of all rated movies
- Shows poster, title, overall rating
- Sort by: date added, overall rating
- Click to view full rating details
- Edit rating (re-opens rating form)
- Delete rating (with confirmation)

**5. AI Recommendations**

- "Get Recommendations" button on any rated movie
- Sends to Claude API:
  - The selected movie's details
  - Pablo's ratings for that movie (all 5 dimensions)
  - Optional: Pablo's top 5 other rated movies for context
- Returns 3-5 movie recommendations
- Each recommendation includes:
  - Movie title and year
  - Why it's recommended (2-3 sentences referencing Pablo's rating preferences)
- Display in a clean panel/modal

**6. Responsive Design**

- Works on mobile (single column)
- Works on tablet (2 columns)
- Works on desktop (3-4 columns)
- Navigation adapts appropriately

### Features NOT Included (Keep It Simple)

❌ User authentication/accounts
❌ Multiple users
❌ Social features (sharing, friends)
❌ Search by director (actor search is included)
❌ Watchlist/want-to-watch list
❌ Movie reviews (text)
❌ Import/export data
❌ Dark mode toggle
❌ Infinite scroll (we use "Load More" button instead)
❌ Caching/optimization
❌ Testing (unit, integration, e2e)
❌ Analytics
❌ PWA features

## Tech Stack (Exact Versions)

```json
{
  "framework": "Next.js 14 (App Router)",
  "language": "JavaScript (NOT TypeScript)",
  "styling": "Tailwind CSS v3",
  "components": "shadcn/ui",
  "database": "Supabase",
  "movie-api": "TMDB API",
  "ai-api": "Anthropic Claude API",
  "deployment": "Vercel"
}
```

### Why These Versions

- **Next.js 14** (not 15): Better stability, more documentation, proven shadcn/ui compatibility
- **Tailwind v3** (not v4): v4 has breaking changes (CSS-first config), v3 is stable and well-documented
- **JavaScript** (not TypeScript): Pablo is a beginner. TypeScript adds cognitive load. We teach plain JavaScript first; TypeScript comes later in his journey.

## Sample Project Structure

```
cinelog-reference/
├── .env.example                    # Template for environment variables
├── .env.local                      # Actual env vars (gitignored)
├── .gitignore
├── package.json
├── next.config.js
├── tailwind.config.js              # Tailwind v3 configuration
├── postcss.config.js               # PostCSS config for Tailwind
├── jsconfig.json                   # Path aliases
├── components.json                 # shadcn/ui configuration
├── README.md
│
├── public/
│   └── placeholder-poster.png      # Movie-themed fallback (clapperboard icon)
│
├── src/
│   ├── app/
│   │   ├── layout.js               # Root layout with navigation
│   │   ├── page.js                 # Home/Search page
│   │   ├── globals.css             # Tailwind imports
│   │   ├── movie/
│   │   │   └── [id]/
│   │   │       └── page.js         # Movie details page
│   │   └── watched/
│   │       └── page.js             # Watched list page
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn components (auto-generated)
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── input.jsx
│   │   │   ├── label.jsx
│   │   │   ├── select.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── skeleton.jsx
│   │   │   └── alert.jsx
│   │   │
│   │   ├── Navigation.jsx          # Top nav: "CineLog" logo left, links right
│   │   ├── MovieCard.jsx           # Single movie card
│   │   ├── MovieGrid.jsx           # Grid of MovieCards
│   │   ├── SearchBar.jsx           # Search input + filters
│   │   ├── StarRating.jsx          # Interactive star rating (BUILT FROM SCRATCH)
│   │   ├── RatingForm.jsx          # Full rating form (5 dimensions)
│   │   ├── RatingDisplay.jsx       # Shows existing ratings
│   │   ├── RecommendationPanel.jsx # AI recommendations display
│   │   └── LoadingSpinner.jsx      # Loading indicator
│   │
│   └── lib/
│       ├── tmdb.js                 # TMDB API functions
│       ├── supabase.js             # Supabase client + functions
│       ├── ai.js                   # Claude API functions
│       └── utils.js                # Helper functions
```

## Sample Database Schema (Supabase)

### Table: `movies`

Stores movie metadata (cached from TMDB to avoid repeated API calls)

```sql
CREATE TABLE movies (
  id BIGINT PRIMARY KEY,              -- TMDB movie ID
  title TEXT NOT NULL,
  year INTEGER,
  poster_path TEXT,
  overview TEXT,
  genres TEXT[],                      -- Array of genre names
  runtime INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `ratings`

Stores Pablo's ratings

```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movie_id BIGINT REFERENCES movies(id),
  overall INTEGER NOT NULL CHECK (overall >= 1 AND overall <= 5),
  plot INTEGER CHECK (plot >= 1 AND plot <= 5),
  acting INTEGER CHECK (acting >= 1 AND acting <= 5),
  cinematography INTEGER CHECK (cinematography >= 1 AND cinematography <= 5),
  score INTEGER CHECK (score >= 1 AND score <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(movie_id)                    -- One rating per movie
);
```

## Sample Component Specifications

### StarRating.jsx (Build from scratch - NOT shadcn)

This is intentionally built manually to teach controlled components.

```jsx
// Props:
// - value: number (1-5 or 0 for unset)
// - onChange: function(newValue)
// - readonly: boolean (for display only)
// - size: 'sm' | 'md' | 'lg'

// Behavior:
// - Shows 5 star icons
// - Hover highlights stars up to cursor position
// - Click sets the rating
// - Filled stars for rated, outline for unrated
// - Use lucide-react Star icon
```

### MovieCard.jsx

```jsx
// Props:
// - movie: { id, title, year, poster_path, genres }
// - showRating: boolean (show overall rating badge if rated)

// Behavior:
// - Displays poster (or placeholder)
// - Title, year
// - Genre badges (max 2)
// - Clickable - navigates to /movie/[id]
// - Uses shadcn Card component
```

### SearchBar.jsx

```jsx
// State (three-mode architecture):
// - mode: "title" | "actor" | "discover"
// Title mode state:
// - titleQuery: string
// - titleYear: string
// Actor mode state:
// - actorQuery: string
// - actorYear: string
// Discover mode state:
// - genre: string
// - decade: string
// - sortBy: string ("popularity.desc" | "vote_average.desc" | etc.)
// - minRating: string ("0" | "6" | "7" | "8")

// Props:
// - genres: array of { id, name }
// - onSearchByTitle: function({ query, year })
// - onSearchByActor: function({ query, year })
// - onDiscover: function({ genre, decade, sortBy, minRating })

// Behavior:
// - Three mode toggle buttons at top: "By Title", "By Actor", "Discover"
// - Each mode shows different inputs:
//   - Title: text input + year dropdown
//   - Actor: text input + year dropdown
//   - Discover: genre, decade, sort, rating dropdowns
// - Debounced search (300ms delay) - implemented manually with setTimeout/useEffect
// - Uses shadcn Input and Select

// Debounce implementation (manual, no library):
// useEffect(() => {
//   const timer = setTimeout(() => {
//     if (mode === "title") {
//       onSearchByTitle({ query: titleQuery, year: titleYear });
//     } else if (mode === "actor") {
//       onSearchByActor({ query: actorQuery, year: actorYear });
//     } else {
//       onDiscover({ genre, decade, sortBy, minRating });
//     }
//   }, 300);
//   return () => clearTimeout(timer);
// }, [mode, titleQuery, titleYear, actorQuery, actorYear, genre, decade, sortBy, minRating]);
```

### RatingForm.jsx

```jsx
// Props:
// - movie: object (movie being rated)
// - existingRating: object | null (if editing)
// - onSubmit: function(ratings)
// - onCancel: function()

// State:
// - overall: number (required)
// - plot: number (optional)
// - acting: number (optional)
// - cinematography: number (optional)
// - score: number (optional)

// Behavior:
// - Modal/dialog overlay
// - Shows movie poster + title
// - 5 StarRating components (one per dimension)
// - Overall is required (show validation)
// - Others are optional (can be 0/unset)
// - Submit button disabled until overall is set
// - Uses shadcn Dialog
```

### RecommendationPanel.jsx

```jsx
// Props:
// - movie: object (the movie to base recs on)
// - ratings: object (Pablo's ratings for this movie)

// State:
// - recommendations: array
// - loading: boolean
// - error: string | null

// Behavior:
// - "Get Recommendations" button
// - Loading spinner while fetching
// - Displays 3-5 recommended movies
// - Each shows: title, year, explanation
// - Error handling with retry button
```

## Sample API Functions

### lib/tmdb.js

```javascript
// Environment: NEXT_PUBLIC_TMDB_API_KEY
// All search functions return: { results, page, totalPages, hasMore }

export async function getGenres() {
  // Returns: array of { id, name } for genre dropdown
}

export async function searchByTitle(query, year = "", page = 1) {
  // Uses: /search/movie endpoint
  // If no query, falls back to getPopularMovies()
  // Returns: { results, page, totalPages, hasMore }
}

export async function searchByActor(query, year = "", page = 1) {
  // Two-step process:
  // Step 1: /search/person to find the actor
  // Step 2: /person/{id}/movie_credits to get their movies
  // Note: TMDB returns all credits at once, so we do client-side pagination
  // Returns: { results, page, totalPages, hasMore }
}

export async function discoverMovies(filters = {}, page = 1) {
  // Uses: /discover/movie endpoint
  // Accepts: { genre, decade, sortBy, minRating }
  // Returns: { results, page, totalPages, hasMore }
}

export async function getPopularMovies(page = 1) {
  // Uses: /movie/popular endpoint
  // Returns: { results, page, totalPages, hasMore }
}

export async function getMovieDetails(movieId) {
  // Uses: /movie/{id} endpoint
  // Returns: full movie object with runtime, overview, etc.
}
```

### lib/supabase.js

```javascript
// Environment: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(...)

export async function saveMovie(movie) {
  // Upsert movie metadata to movies table
}

export async function saveRating(movieId, ratings) {
  // Insert or update rating
  // Also saves movie if not exists
}

export async function getRating(movieId) {
  // Get rating for a specific movie (or null)
}

export async function getAllRatings() {
  // Get all ratings with movie details
  // Joins movies table
  // Orders by created_at desc
}

export async function deleteRating(movieId) {
  // Delete rating (movie metadata stays)
}
```

### lib/ai.js

```javascript
// Environment: ANTHROPIC_API_KEY (server-side only)

export async function getRecommendations(movie, ratings, otherRatings = []) {
  // Calls Claude API
  // Builds prompt with movie context and rating preferences
  // Parses response into structured recommendations
  // Returns: array of { title, year, explanation }
}
```

## API Routes (for server-side API calls)

```
src/app/api/
├── recommendations/
│   └── route.js        # POST - calls Claude API (keeps key server-side)
```

## Environment Variables

```env
# .env.example

# TMDB API (get from themoviedb.org)
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key

# Supabase (get from supabase.com project settings)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Anthropic (get from console.anthropic.com)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Design System

### Theme: "Modern Cinema"

A clean, minimal dark theme with subtle cinematic touches - sophisticated but simple to implement.

### Color Palette (Tailwind defaults)

| Role | Tailwind Class | Usage |
|------|----------------|-------|
| Background | `bg-slate-950` | Main app background (dark, like a theater) |
| Surface | `bg-slate-900` | Cards, navigation, elevated elements |
| Surface Light | `bg-slate-800` | Inputs, hover states, borders |
| Text Primary | `text-slate-50` | Headings, important text |
| Text Secondary | `text-slate-400` | Descriptions, metadata |
| Accent | `text-amber-500` / `bg-amber-500` | Stars, ratings, primary buttons |
| Accent Hover | `bg-amber-400` | Button hover states |
| Border | `border-slate-700` | Subtle borders |

### Typography

- **Font:** Inter (shadcn default) - no additional setup needed
- **App title:** `text-xl font-bold`
- **Movie titles:** `text-lg font-semibold`
- **Body text:** `text-sm`
- **Metadata:** `text-xs text-slate-400`

### Component Patterns

**Navigation:**
- `bg-slate-900` background
- "CineLog" logo on left, links on right
- Links: `text-slate-300 hover:text-amber-500`

**Movie Cards:**
- Poster-dominant (large poster, minimal text below)
- `bg-slate-900 rounded-lg` container
- `hover:scale-105 transition-transform` on hover
- Genre badges: `bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full`

**Star Rating:**
- Empty stars: `text-slate-600`
- Filled stars: `text-amber-500`
- Hover preview: `text-amber-400`

**Inputs & Selects:**
- `bg-slate-800 border-slate-700`
- Focus: `focus:ring-amber-500`

**Buttons:**
- Primary: `bg-amber-500 hover:bg-amber-400 text-slate-900`
- Secondary: `bg-slate-700 hover:bg-slate-600 text-slate-100`

**Modals:**
- Overlay: `bg-black/80`
- Content: `bg-slate-900 rounded-lg`

### Layout

- Container: `max-w-6xl mx-auto px-4`
- Card grid: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`
- Section spacing: `py-8`
- Consistent corners: `rounded-lg` throughout

### Micro-interactions (simple)

- Cards: `hover:scale-105 transition-transform`
- Buttons: `transition-colors`
- No complex animations - all Tailwind utilities

## Coding Style Guidelines

These patterns will be taught to Pablo, so use them consistently:

### State Management

- Use `useState` for component state
- Lift state to parent when shared between siblings
- NO Redux, Zustand, or other state libraries

### Data Fetching

- Use `useEffect` for fetching on mount/dependency change
- Use `async/await` (not .then chains)
- Always handle loading and error states

### Event Handlers

- Name as `handleX` (handleSearch, handleSubmit, handleClick)
- Define inside component (not extracted to utils)

### Component Structure

```jsx
// 1. Imports
import { useState, useEffect } from "react";

// 2. Component function
export default function ComponentName({ prop1, prop2 }) {
  // 3. State declarations
  const [value, setValue] = useState(initialValue);

  // 4. Effects
  useEffect(() => {
    // effect logic
  }, [dependencies]);

  // 5. Event handlers
  function handleSomething() {
    // handler logic
  }

  // 6. Render helpers (if needed)
  function renderItem(item) {
    return <div>{item.name}</div>;
  }

  // 7. Return JSX
  return <div>{/* JSX */}</div>;
}
```

### Tailwind Usage

- Use utility classes directly (no @apply in CSS)
- Use Tailwind's responsive prefixes (sm:, md:, lg:)
- Use shadcn component variants when available

### Images

- Use standard `<img>` tags for movie posters (not Next.js Image component)
- Simpler for beginners - it's just HTML they already know
- Next.js Image requires width/height props and domain config in next.config.js
- Can mention Next.js Image as optional optimization in Module 10 (Polish)

### Comments

- Comment WHY, not WHAT
- Add comments for non-obvious logic
- No JSDoc (too advanced for now)

### Error Messages

- Use technical error messages (e.g., "Failed to fetch movies from TMDB API")
- Include the actual error when helpful for debugging
- Always show a retry option where applicable

## Build Order

Implement in this sequence to mirror the course:

1. **Project setup**

   - Initialize Next.js project
   - Install dependencies
   - Configure Tailwind
   - Install shadcn/ui base
   - Create folder structure

2. **Static components first**

   - MovieCard (hardcoded data)
   - MovieGrid (hardcoded array)
   - Navigation
   - Basic page layouts

3. **TMDB integration**

   - lib/tmdb.js functions (searchByTitle, searchByActor, discoverMovies, getPopularMovies)
   - SearchBar component with three modes (Title, Actor, Discover)
   - Fetch and display real movies
   - Filters: year (title/actor modes), genre/decade/sort/rating (discover mode)
   - "Load More" pagination

4. **Rating system (local state)**

   - StarRating component (from scratch)
   - RatingForm modal
   - Local state for ratings (not persisted yet)

5. **Database integration**

   - Supabase setup
   - lib/supabase.js functions
   - Persist ratings
   - Load ratings on mount
   - Watched list page

6. **AI recommendations**

   - API route for Claude
   - lib/ai.js functions
   - RecommendationPanel component
   - Prompt engineering

7. **Polish**
   - Loading states (Skeleton)
   - Error handling (Alert)
   - Responsive tweaks
   - Final styling pass

## Deliverables

When complete, provide:

1. **Complete source code** - All source as part of this project
2. **README.md** with:
   - App description
   - Setup instructions (env vars, database setup)
   - How to run locally
   - How to deploy to Vercel
3. **Database setup SQL** (`supabase/schema.sql`) - Ready to run in Supabase dashboard
4. **Seed data script** (`supabase/seed.sql`) - Sample movies and ratings for testing
5. **Notes on any deviations** - If you had to change something from spec, explain why

## Validation Checklist

Before considering the app complete:

- [ ] Can search movies by title (By Title mode)
- [ ] Can search movies by actor (By Actor mode)
- [ ] Can filter by genre (Discover mode)
- [ ] Can filter by decade (Discover mode)
- [ ] Can sort by popularity/rating/date (Discover mode)
- [ ] Can filter by minimum rating (Discover mode)
- [ ] "Load More" pagination works in all modes
- [ ] Movie cards display correctly
- [ ] Can click movie to see details
- [ ] Can rate a movie (all 5 dimensions)
- [ ] Overall rating is required, others optional
- [ ] Ratings persist in Supabase
- [ ] Watched list shows all ratings
- [ ] Can sort watched list
- [ ] Can edit existing rating
- [ ] Can delete rating
- [ ] AI recommendations work
- [ ] Recommendations include explanations
- [ ] App is responsive (mobile/tablet/desktop)
- [ ] Loading states display correctly
- [ ] Errors are handled gracefully
- [ ] No console errors in normal usage

Begin building the app. Start with project initialization and folder structure.

## Alignment Notes

This reference app is intentionally constrained to match the course (see `/guidance/cinelog-course-structure.md`)
| Course Module | What's Built in App |
|---------------|---------------------|
| Module 5 (React) | MovieCard, MovieGrid, basic components |
| Module 6 (Search) | SearchBar (3 modes), TMDB integration, filters, pagination |
| Module 7 (Rating) | StarRating (manual), RatingForm, local state |
| Module 8 (Persistence) | Supabase integration, CRUD operations |
| Module 9 (AI) | Claude API, RecommendationPanel |
| Module 10 (Polish) | Loading states, error handling, responsive |

The app complexity ceiling is set by what Pablo will learn in the course.
