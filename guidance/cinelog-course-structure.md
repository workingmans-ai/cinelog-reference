# CineLog: Pablo's Movie Tracker Course
## Revised Course Structure & Milestone Overview (v2)

---

## Project Overview

**App Name:** CineLog  
**What Pablo Builds:** A personal movie tracker where he can search movies, rate them across multiple dimensions, and get AI-powered recommendations.

**Final Feature Set:**
- Search TMDB database with three modes:
  - **By Title** — search movies by name with optional year filter
  - **By Actor** — find movies featuring a specific actor with optional year filter
  - **Discover** — browse by genre, decade, sort order, and minimum rating
- "Load More" pagination to view additional results
- Add movies to "Watched" list
- Rate movies (1-5 stars): Overall (required), Plot, Acting, Cinematography, Score (optional)
- View his rated movies in a clean gallery
- Get AI recommendations based on a selected movie + his rating preferences
- Deployed live on Vercel with Supabase persistence

---

## TMDB API Design Decisions

> **Why three search modes instead of one?**

During implementation, we discovered TMDB API limitations that forced architectural decisions:

| TMDB Endpoint | What It Supports | What It Doesn't Support |
|---------------|------------------|------------------------|
| `/search/movie` | Text query, year | Genre, sort, rating filters |
| `/search/person` | Person name lookup | — |
| `/person/{id}/movie_credits` | All movies for an actor | Pagination (returns all at once) |
| `/discover/movie` | Genre, decade, sort, rating | Text search |

**The Problem:** You can't search "action movies with 'Batman' in the title" in a single API call.

**The Solution:** Three distinct search modes, each optimized for one use case:
1. **By Title** — Uses `/search/movie` + optional year filter
2. **By Actor** — Uses `/search/person` → `/person/{id}/movie_credits` (two-step)
3. **Discover** — Uses `/discover/movie` with genre, decade, sort, rating filters

**Teaching Value:** This is a realistic scenario. APIs rarely do exactly what you want. Pablo learns to:
- Read API documentation critically
- Design around limitations
- Build UX that maps cleanly to available APIs

---

## Course Philosophy

- **Self-paced:** No deadlines, no pressure. Progress measured by lessons completed, not time elapsed.
- **Small wins:** Lessons are bite-sized (20-40 min). Each one unlocks something visible or tangible.
- **Foundations first:** We spend time on HTML, CSS, JavaScript, and Git before React. This prevents "magic box" confusion later.
- **Build understanding, not just code:** Pablo should be able to explain what his code does, not just copy it.

---

## Course File Structure

```
cinelog-course/
├── .claude/
│   └── commands/                    # Slash commands to start lessons
│       ├── start-0-1.md
│       ├── start-1-1.md
│       └── ... (one per lesson)
│
├── course-content/
│   ├── module-0-welcome/
│   │   ├── 0.1-what-youll-build/
│   │   ├── 0.2-the-architecture-map/
│   │   └── 0.3-environment-setup/
│   │
│   ├── module-1-html-css-refresher/
│   │   ├── 1.1-html-structure/
│   │   ├── 1.2-css-selectors-properties/
│   │   ├── 1.3-box-model/
│   │   ├── 1.4-flexbox-basics/
│   │   ├── 1.5-responsive-basics/
│   │   └── 1.6-static-movie-card/
│   │
│   ├── module-2-javascript-fundamentals/
│   │   ├── 2.1-variables-and-types/
│   │   ├── 2.2-functions-basics/
│   │   ├── 2.3-functions-arguments-return/
│   │   ├── 2.4-scope/
│   │   ├── 2.5-string-manipulation/
│   │   ├── 2.6-arrays-basics/
│   │   ├── 2.7-array-methods/
│   │   ├── 2.8-loops-to-map-filter/
│   │   ├── 2.9-objects/
│   │   └── 2.10-mini-project-data-wrangling/
│   │
│   ├── module-3-git-fundamentals/
│   │   ├── 3.1-what-is-version-control/
│   │   ├── 3.2-git-init-add-commit/
│   │   ├── 3.3-writing-good-commits/
│   │   ├── 3.4-viewing-history/
│   │   └── 3.5-github-basics/
│   │
│   ├── module-4-tailwind-and-components/
│   │   ├── 4.1-what-is-tailwind/
│   │   ├── 4.2-utility-classes/
│   │   ├── 4.3-layout-with-tailwind/
│   │   ├── 4.4-responsive-with-tailwind/
│   │   └── 4.5-rebuild-movie-card-tailwind/
│   │
│   ├── module-5-react-fundamentals/
│   │   ├── 5.1-what-is-react/
│   │   ├── 5.2-your-first-component/
│   │   ├── 5.3-jsx-syntax/
│   │   ├── 5.4-props-passing-data/
│   │   ├── 5.5-rendering-lists/
│   │   ├── 5.6-state-intro/
│   │   ├── 5.7-usestate-in-action/
│   │   ├── 5.8-events-onclick/
│   │   ├── 5.9-events-forms/
│   │   └── 5.10-component-composition/
│   │
│   ├── module-6-building-search/
│   │   ├── 6.1-what-is-an-api/
│   │   ├── 6.2-fetch-and-async-await/
│   │   ├── 6.3-useeffect-intro/
│   │   ├── 6.4-tmdb-api-setup/
│   │   ├── 6.5-fetching-popular-movies/
│   │   ├── 6.6-understanding-tmdb-endpoints/
│   │   ├── 6.7-search-by-title/
│   │   ├── 6.8-search-by-actor/
│   │   ├── 6.9-discover-mode/
│   │   └── 6.10-load-more-pagination/
│   │
│   ├── module-7-rating-system/
│   │   ├── 7.1-planning-the-rating-feature/
│   │   ├── 7.2-star-rating-component/
│   │   ├── 7.3-rating-form-layout/
│   │   ├── 7.4-form-state-management/
│   │   ├── 7.5-saving-to-local-state/
│   │   ├── 7.6-watched-list-page/
│   │   └── 7.7-movie-detail-view/
│   │
│   ├── module-8-data-persistence/
│   │   ├── 8.1-why-we-need-a-database/
│   │   ├── 8.2-supabase-setup/
│   │   ├── 8.3-creating-tables/
│   │   ├── 8.4-inserting-data/
│   │   ├── 8.5-reading-data/
│   │   ├── 8.6-updating-and-deleting/
│   │   └── 8.7-wiring-it-together/
│   │
│   ├── module-9-ai-recommendations/
│   │   ├── 9.1-how-ai-apis-work/
│   │   ├── 9.2-your-first-ai-call/
│   │   ├── 9.3-prompt-engineering-basics/
│   │   ├── 9.4-building-context-from-ratings/
│   │   ├── 9.5-recommendation-ui/
│   │   └── 9.6-displaying-explanations/
│   │
│   └── module-10-polish-and-deploy/
│       ├── 10.1-loading-states/
│       ├── 10.2-error-handling/
│       ├── 10.3-responsive-polish/
│       ├── 10.4-final-touches/
│       ├── 10.5-deploying-to-vercel/
│       └── 10.6-celebration-and-next-steps/
│
├── project-context/
│   ├── APP_VISION.md                # What CineLog is, Pablo's role as builder
│   ├── ARCHITECTURE_MAP.md          # Visual overview of how pieces connect
│   ├── TECH_STACK.md                # Why we chose each technology
│   ├── FEATURE_ROADMAP.md           # What gets built when (motivation)
│   └── GLOSSARY.md                  # Terms + analogies Pablo will encounter
│
├── practice-exercises/              # Standalone exercises for each module
│   ├── html-css/
│   ├── javascript/
│   ├── git/
│   └── react/
│
├── cinelog-app/                     # The actual app Pablo builds
│   ├── .gitignore
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   └── README.md
│
├── mentor-notes/                    # For you (hidden from Pablo)
│   ├── .gitignore
│   ├── progress-log.md
│   ├── struggles.md
│   ├── wins.md
│   └── recommendations.md
│
└── CLAUDE.md                        # Root project memory + guardrails
```

---

## Module Breakdown

---

### Module 0: Welcome & The Big Picture
**Goal:** Pablo sees the destination and understands (at a high level) how all the pieces connect.

| Lesson | What Pablo Learns | What Pablo Does | Milestone |
|--------|-------------------|-----------------|-----------|
| 0.1 What You'll Build | Tour of the finished app, features overview | Explores a demo of the completed CineLog | Can describe what the app does |
| 0.2 The Architecture Map | How frontend, backend, database, and AI connect. Logic vs presentation. | Draws/labels a diagram of the app's architecture | Can explain how data flows through the app |
| 0.3 Environment Setup | Terminal basics, Node.js, npm, VS Code | Installs tools, opens terminal, runs first command | Can navigate folders and run `node -v` |

**Checkpoint:** Explain in your own words: what's the difference between the frontend and the backend? Where do Pablo's movie ratings "live"?

**Unlocked:** "You now have the map. You know where we're going and how the pieces fit. Let's start building the skills."

---

### Module 1: HTML & CSS Refresher
**Goal:** Pablo can read and write HTML/CSS confidently. This makes Tailwind intuitive later.

| Lesson | What Pablo Learns | What Pablo Does | Milestone |
|--------|-------------------|-----------------|-----------|
| 1.1 HTML Structure | Elements, tags, nesting, semantic HTML | Builds a simple page with header, main, footer | Valid HTML page renders |
| 1.2 CSS Selectors & Properties | Selectors, properties, values, linking CSS | Styles the page with colors, fonts | Page has custom styling |
| 1.3 The Box Model | Margin, padding, border, width/height | Adds spacing and borders to elements | Understands why things have gaps |
| 1.4 Flexbox Basics | display: flex, justify-content, align-items | Creates a horizontal nav bar | Items align as expected |
| 1.5 Responsive Basics | Media queries, mobile-first thinking | Makes the nav stack on small screens | Page adapts to window size |
| 1.6 Static Movie Card | Combining all concepts | Builds a movie card with HTML/CSS (no JS) | **Beautiful static card!** |

**Checkpoint Quiz:**
- What's the difference between margin and padding?
- How do you center something with flexbox?
- Write a media query that changes background color on screens under 600px.

**Analogy Bank:**
- Box model = a picture frame (content is the picture, padding is the mat, border is the frame, margin is wall space)
- Flexbox = arranging items on a shelf (you control direction and spacing)

**Unlocked:** "You just built a movie card from scratch. This is exactly what CineLog's UI will look like—but soon, we'll generate these dynamically."

---

### Module 2: JavaScript Fundamentals
**Goal:** Pablo has the JS toolkit needed for React—variables, functions, arrays, objects, and functional patterns.

| Lesson | What Pablo Learns | What Pablo Does | Milestone |
|--------|-------------------|-----------------|-----------|
| 2.1 Variables & Types | let, const, strings, numbers, booleans | Declares variables, checks types | Can predict what `typeof` returns |
| 2.2 Functions Basics | Declaring functions, calling them | Writes functions that log messages | Functions run when called |
| 2.3 Arguments & Return | Parameters, arguments, return values | Writes a function that takes input and returns output | `add(2, 3)` returns `5` |
| 2.4 Scope | Global vs local, block scope, closures intro | Predicts which variable is accessible where | Can explain why a variable is "not defined" |
| 2.5 String Manipulation | .length, .slice(), .toLowerCase(), template literals | Manipulates movie titles (truncate, format) | Formats strings correctly |
| 2.6 Arrays Basics | Creating arrays, accessing by index, .length | Creates array of movie titles, accesses items | Can get first/last item |
| 2.7 Array Methods | .push(), .pop(), .includes(), .indexOf() | Adds/removes movies from a list | List updates correctly |
| 2.8 Loops to Map & Filter | for loops → forEach → map → filter | Transforms an array of movies (get titles, filter by year) | Uses map/filter confidently |
| 2.9 Objects | Key-value pairs, accessing properties, nesting | Creates a movie object with title, year, rating | Can access nested properties |
| 2.10 Mini Project | Combining arrays + objects + functions | Writes functions to filter/sort a movie dataset | **Working data manipulation!** |

**Checkpoint Quiz:**
- What's the difference between `let` and `const`?
- What does `.map()` return? How is it different from `.forEach()`?
- Given an array of movie objects, write a function that returns only movies rated above 4.

**Analogy Bank:**
- Variables = labeled boxes that hold things
- Functions = recipes (ingredients in, dish out)
- Scope = rooms in a house (what's visible depends on which room you're in)
- Arrays = a playlist (ordered, numbered)
- Objects = a contact card (labeled info about one thing)
- Map = a factory assembly line (something goes in, something comes out for each item)

**Unlocked:** "You can now manipulate data like a programmer. This is exactly what React does under the hood—it maps data to UI."

---

### Module 3: Git Fundamentals
**Goal:** Pablo understands version control and can commit meaningful changes.

| Lesson | What Pablo Learns | What Pablo Does | Milestone |
|--------|-------------------|-----------------|-----------|
| 3.1 What Is Version Control? | Why Git exists, snapshots, history | Explores a repo's commit history on GitHub | Understands "save points" concept |
| 3.2 Git Init, Add, Commit | Initializing a repo, staging, committing | Creates a repo, makes first commit | First commit appears in `git log` |
| 3.3 Writing Good Commits | Why messages matter, conventional format | Rewrites bad commit messages to be good | Can write clear, descriptive commits |
| 3.4 Viewing History | git log, git diff, git status | Explores history, sees what changed | Can find when a change was made |
| 3.5 GitHub Basics | Remote repos, push, pull, cloning | Pushes local repo to GitHub | **Code is on GitHub!** |

**Checkpoint Quiz:**
- What's the difference between `git add` and `git commit`?
- Why is "fixed stuff" a bad commit message?
- What does `git status` show you?

**Practical Exercise:** Given 5 terrible commit messages, rewrite them to be helpful.

**Analogy Bank:**
- Git = save points in a video game (you can always go back)
- Staging = packing a box before shipping (decide what goes in this shipment)
- Commit message = a note to future-you explaining what you did

**Unlocked:** "You now have a safety net. Every change you make can be tracked, explained, and undone if needed."

---

### Module 4: Tailwind CSS
**Goal:** Pablo can style rapidly with utility classes, understanding how Tailwind maps to CSS concepts he already knows.

| Lesson | What Pablo Learns | What Pablo Does | Milestone |
|--------|-------------------|-----------------|-----------|
| 4.1 What Is Tailwind? | Utility-first CSS, why it exists | Compares traditional CSS to Tailwind | Understands the trade-off |
| 4.2 Utility Classes | Spacing, colors, typography classes | Styles text and boxes with Tailwind | Styled elements without writing CSS |
| 4.3 Layout with Tailwind | Flex, grid, gap, justify, align | Recreates flexbox layouts with classes | Same layouts, less code |
| 4.4 Responsive with Tailwind | Breakpoint prefixes (sm:, md:, lg:) | Makes a layout responsive | Layout adapts to screen size |
| 4.5 Rebuild Movie Card | All Tailwind concepts together | Rebuilds Lesson 1.6's card using Tailwind | **Same card, pure Tailwind!** |

**Lesson 4.4 — Key Responsive Patterns:**

Pablo learns mobile-first thinking with Tailwind:
```
Base classes apply to all screens (mobile first)
sm: applies at 640px and up
md: applies at 768px and up
lg: applies at 1024px and up
```

**Common patterns Pablo will use throughout CineLog:**
- `grid-cols-2 md:grid-cols-4` — 2 columns on mobile, 4 on medium+
- `flex-col md:flex-row` — Stack on mobile, side-by-side on medium+
- `hidden md:block` — Hide on mobile, show on medium+
- `text-sm md:text-base` — Smaller text on mobile

These patterns are applied in Module 10.3 (Responsive Polish) when finalizing the app.

**Checkpoint Quiz:**
- What does `p-4` do? What about `mt-2`?
- How do you make something only visible on large screens?
- What's the Tailwind equivalent of `display: flex; justify-content: space-between;`?
- What does "mobile-first" mean in Tailwind?

**Analogy Bank:**
- Tailwind classes = LEGO bricks with specific shapes (snap them together to build)
- Responsive prefixes = "only apply this when..." instructions
- Mobile-first = "start with the phone layout, add improvements for bigger screens"

**Unlocked:** "You can now style at the speed of thought. No more switching between HTML and CSS files—it's all inline and fast."

---

### Module 5: React Fundamentals
**Goal:** Pablo understands React's mental model and can build interactive components.

| Lesson | What Pablo Learns | What Pablo Does | Milestone |
|--------|-------------------|-----------------|-----------|
| 5.1 What Is React? | Components, declarative UI, virtual DOM | Reads explanation, watches component re-render | Can explain why React exists |
| 5.2 Your First Component | Function components, return JSX | Creates `MovieCard` component | Component renders on screen |
| 5.3 JSX Syntax | JSX rules, expressions in {}, className | Adds dynamic content to component | Shows calculated values in UI |
| 5.4 Props: Passing Data | Props as function arguments | Makes `MovieCard` accept title, year, poster | One component, different data |
| 5.5 Rendering Lists | .map() in JSX, keys | Renders array of movies as cards | Grid of movie cards appears |
| 5.6 State Intro | Why we need state, mental model | Identifies what should be state in examples | Can distinguish props vs state |
| 5.7 useState in Action | useState hook, setter functions | Adds "liked" toggle to MovieCard | Heart icon toggles on click |
| 5.8 Events: onClick | Event handlers, passing functions | Adds click handler to button | Button click triggers action |
| 5.9 Events: Forms | Controlled inputs, onChange | Builds input that tracks what's typed | Types → sees value update |
| 5.10 Component Composition | Breaking UI into pieces, children | Refactors MovieCard into smaller parts | Cleaner, reusable components |

**Checkpoint Quiz:**
- What's the difference between props and state?
- When does a component re-render?
- Why do we need keys when rendering lists?
- Build a counter component with + and - buttons (from memory).

**Analogy Bank:**
- Components = LEGO bricks (reusable, composable)
- Props = settings passed when using a component (like function arguments)
- State = the component's memory (changes trigger re-renders)
- Re-render = React repainting the screen

**Unlocked:** "You can now build interactive UIs. The search bar, rating stars, movie grid—you have all the building blocks."

---

### Module 6: Building Search
**Goal:** Pablo connects his UI to real movie data from the internet using three search modes.

#### What Is an API? (Conceptual Foundation)

Before diving into code, Pablo needs to understand what an API is and why it matters:

**The Restaurant Analogy:**
```
Imagine a restaurant. You (the customer) don't go into the kitchen
and cook your own food. Instead, you use a menu to communicate
what you want, and a waiter brings you the result.

An API works the same way:
- Your app (the customer) wants movie data
- The API (the waiter) takes your request to the server (the kitchen)
- The server prepares the data and sends it back through the API

You never see the kitchen. You just use the menu (the API documentation)
to ask for what you need.
```

**Why APIs Matter in Modern Development:**
- Almost every app uses APIs to get data from somewhere else
- You don't need to build a movie database—TMDB already has one
- You don't need to train an AI—Claude's API provides intelligence
- APIs let you focus on YOUR app while using others' expertise

**How TMDB's API Shaped CineLog:**

When we started building search, we discovered something important: the TMDB API doesn't do everything we wanted in one request. This is normal! APIs are designed for general use, not specifically for your app.

```
What we wanted:        What TMDB offers:
───────────────        ─────────────────
Search "Batman"        ✓ /search/movie (text search)
  + Action genre       ✗ Can't filter by genre here!
  + 2020s only         ✓ Can filter by year

Browse Action films    ✓ /discover/movie (filters)
  + sorted by rating   ✓ Can sort and filter
  + no text search     ✗ Can't search by title here!
```

**The Lesson:** APIs have rules. You design your app around what the API can do—not the other way around. That's why CineLog has three search modes: each one uses a different API endpoint that does one thing well.

This is real-world development. Pablo will encounter this pattern everywhere.

---

| Lesson | What Pablo Learns | What Pablo Does | Milestone |
|--------|-------------------|-----------------|-----------|
| 6.1 What Is an API? | Client-server model, HTTP, JSON | Explores an API response in browser | Understands request/response |
| 6.2 Fetch and Async/Await | fetch(), promises, async/await syntax | Fetches data from a joke API | Data appears in console |
| 6.3 useEffect Intro | Side effects, useEffect basics, dependencies | Fetches data when component mounts | Data loads on page load |
| 6.4 TMDB API Setup | API keys, environment variables, TMDB docs | Gets API key, stores in .env | API key is secure |
| 6.5 Fetching Popular Movies | Putting it together: useEffect + fetch + TMDB | Fetches and displays popular movies | **Real movies appear!** |
| 6.6 Understanding TMDB Endpoints | API limitations, why we need 3 search modes | Explores `/search/movie` vs `/discover/movie` | Understands API design |
| 6.7 Search by Title | Mode toggle UI, controlled inputs, debouncing | Builds title search with year filter | **Title search works!** |
| 6.8 Search by Actor | Two-step API calls, sequential async/await | Builds actor search (person → credits) | **Actor search works!** |
| 6.9 Discover Mode | Multiple filters, useEffect dependencies | Builds discover with genre, decade, sort, rating | **Discover works!** |
| 6.10 Load More Pagination | Tracking page state, appending results | Adds "Load More" button | Can load more results |

**Checkpoint Quiz:**
- What does `async/await` do?
- Why do we use environment variables for API keys?
- What happens if you forget the dependency array in useEffect?
- Why can't we combine text search with genre filters in a single API call?

**Key Teaching Moment — API Limitations:**
```
"TMDB has two main search endpoints:
- /search/movie — finds movies by title, but doesn't support genre filters
- /discover/movie — supports genre, decade, sort, etc., but no text search

This is a common real-world scenario: APIs don't always do everything
you want. The solution? Build separate search modes for each use case.
That's why we have three tabs: Title, Actor, and Discover."
```

**Practical Challenge:** Try adding a "language" filter to the Discover mode.

**Unlocked:** "Your app now pulls from a database of millions of movies with three powerful search modes. It's real. It's connected to the world."

---

### Module 7: Rating System
**Goal:** Pablo builds the core feature—rating movies across multiple dimensions.

#### Movie Detail Page Enhancement

Before building the rating system, we enhance the movie detail page with additional TMDB data:

**TMDB Rating & Cast Display:**
```
The movie detail page now shows:
- TMDB's community rating (vote_average) with a star icon
- Top 5 cast members under "Starring"

This uses append_to_response=credits to fetch cast data in a single API call.
No extra request needed—just one query parameter.
```

**Teaching Moment — `append_to_response`:**
```javascript
// Instead of making two API calls...
const movie = await fetch(`/movie/${id}`);
const credits = await fetch(`/movie/${id}/credits`);

// TMDB lets you combine them:
const url = `/movie/${id}?append_to_response=credits`;
// Now movie.credits.cast is included in the response!
```

This pattern is common in REST APIs. Pablo learns to read API docs for efficiency features.

---

| Lesson | What Pablo Learns | What Pablo Does | Milestone |
|--------|-------------------|-----------------|-----------|
| 7.1 Planning the Feature | Breaking features into components and state | Sketches UI, identifies state needed | Has a plan before coding |
| 7.2 Star Rating Component | Controlled component, hover states | Builds reusable `StarRating` (from scratch) | Click stars 1-5, see them fill |
| 7.3 Rating Form Layout | Form structure, multiple inputs | Lays out rating form with all 5 dimensions | Form looks complete |
| 7.4 Form State Management | Managing multiple state values | Wires up form inputs to state | Form values update correctly |
| 7.5 Saving to Local State | Context API, lifting state | Submit saves rating via RatingsContext | **Movie rated and saved!** |
| 7.6 Watched List Page | New route, displaying saved data, sorting | Creates sortable watched list with delete | Sees all ratings in gallery |
| 7.7 Movie Detail View | Fetching details, TMDB rating, cast, edit | Click movie → see details + your rating | Can review and edit ratings |

**Implementation Details:**

**StarRating Component (built from scratch):**
- Props: `value`, `onChange`, `readonly`, `size`
- Hover state highlights stars up to cursor position
- Click sets the rating
- Uses lucide-react Star icon (filled vs outline)

**RatingForm Component:**
- Modal using shadcn Dialog
- 5 rating dimensions: Overall (required), Plot, Acting, Cinematography, Score (optional)
- Shows movie poster and title
- Handles both new ratings and edits

**RatingsContext (local state):**
- Stores ratings in React Context (will move to Supabase in Module 8)
- Functions: `saveRating`, `getRating`, `deleteRating`, `getAllRatings`
- Each rating includes movie metadata for the watched list

**Watched List Features:**
- Sort by: date added, rating, title (A-Z / Z-A)
- Delete with confirmation dialog
- Empty state when no ratings

**Checkpoint Quiz:**
- How do you update one field in a form with multiple inputs?
- What does "lifting state up" mean? When do you do it?
- Walk through what happens when the user clicks submit.
- What's the difference between `append_to_response` and making separate API calls?

**Practical Challenge:** The sort functionality is already built in! Try adding a "favorites" filter.

**Unlocked:** "Rating system complete! But there's a problem—refresh the page and your ratings vanish. Let's fix that."

---

### Module 8: Data Persistence
**Goal:** Pablo's data survives page refreshes by storing it in a real database.

#### What Is a Database? (Conceptual Foundation)

Before Pablo writes any database code, he needs to understand the core concepts:

**The Spreadsheet Analogy:**
A database is like a collection of spreadsheets (called **tables**). Each spreadsheet has:
- **Columns** — The headers (like "Title", "Year", "Rating")
- **Rows** — Individual entries (like one movie or one rating)
- **Cells** — Where a specific row meets a specific column

**Example: Our `movies` table is like this spreadsheet:**
```
| id  | title        | year | poster_path | genres              |
|-----|--------------|------|-------------|---------------------|
| 550 | Fight Club   | 1999 | /pB8BM...   | ["Drama","Thriller"]|
| 238 | The Godfather| 1972 | /3bhkr...   | ["Drama","Crime"]   |
```

**What Is SQL?**
SQL (Structured Query Language) is how you talk to databases. It's like giving instructions:
- `SELECT * FROM movies` → "Show me everything from the movies spreadsheet"
- `INSERT INTO movies ...` → "Add a new row to movies"
- `UPDATE movies SET year = 2000 WHERE id = 550` → "Change the year to 2000 for movie #550"
- `DELETE FROM movies WHERE id = 550` → "Remove movie #550"

**What Is Upsert?**
Upsert = "Update or Insert." It's a shortcut that says: "Add this row, but if it already exists, update it instead."

Without upsert, you'd need to:
1. Check if the row exists
2. If yes → UPDATE
3. If no → INSERT

With upsert, it's one step. Supabase makes this easy:
```javascript
await supabase.from("ratings").upsert({ movie_id: 550, overall: 5 });
// If movie 550 has no rating → inserts new row
// If movie 550 already rated → updates existing row
```

We use upsert for both movies (cache TMDB data) and ratings (save user scores).

**Why Supabase?**
Supabase gives us a real PostgreSQL database with:
- A visual dashboard (like looking at the spreadsheet)
- A JavaScript library (so our React code can talk to it)
- Built-in security rules
- Free tier for learning

**Key Terms Pablo Will Use:**
| Term | Meaning | Example |
|------|---------|---------|
| Table | A collection of related data | `movies`, `ratings` |
| Row | One entry in a table | One movie's data |
| Column | One attribute | `title`, `year`, `rating` |
| Primary Key | Unique identifier for each row | `id` column |
| Foreign Key | Links one table to another | `movie_id` in ratings → `id` in movies |
| Query | A request to the database | `SELECT * FROM movies` |

| Lesson | What Pablo Learns | What Pablo Does | Milestone |
|--------|-------------------|-----------------|-----------|
| 8.1 Why We Need a Database | Client vs server storage, persistence | Identifies what data needs to persist | Understands the problem |
| 8.2 Supabase Setup | Creating account, dashboard tour | Creates Supabase project | Dashboard is accessible |
| 8.3 Creating Tables | Tables, columns, data types, primary keys | Creates `movies` and `ratings` tables | Tables exist in Supabase |
| 8.4 Inserting Data | Supabase client, upsert operations | Wires submit to save to database | Submit → data in Supabase |
| 8.5 Reading Data | SELECT operations, loading on mount | Loads watched list from database | Page loads saved ratings |
| 8.6 Updating and Deleting | Upsert for updates, DELETE for removal | Adds edit/delete functionality | Can modify/remove ratings |
| 8.7 Wiring It Together | Replacing local state with database | Full integration | **Data persists across sessions!** |

#### Implementation Patterns (Keep It Simple)

The database code follows beginner-friendly patterns:

**Use `upsert()` instead of check-then-insert/update:**
```javascript
// GOOD: One operation handles both insert and update
const { data, error } = await supabase
  .from("ratings")
  .upsert({ movie_id: movieId, overall: 5 }, { onConflict: "movie_id" });

// AVOID: Checking first, then deciding (more complex)
const existing = await getRating(movieId);
if (existing) {
  await supabase.from("ratings").update(...);
} else {
  await supabase.from("ratings").insert(...);
}
```

**Use plain functions instead of useCallback:**
```javascript
// GOOD: Simple function inside component
function getRating(movieId) {
  return ratings[movieId] || null;
}

// AVOID: useCallback (optimization beginners don't need)
const getRating = useCallback((movieId) => {
  return ratings[movieId] || null;
}, [ratings]);
```

**Skip database triggers and indexes:**
- Triggers (auto-updating timestamps) → Set `updated_at` in JavaScript instead
- Indexes → Premature optimization; our dataset is small

#### Design Decision: Where Does Movie Data Come From?

> **Question Pablo might ask:** "If we save movies to Supabase, why does the movie detail page still call TMDB?"

**The Design:**
- **Movie detail page** → Always fetches from TMDB API
- **Watched list page** → Uses cached data from Supabase

**Why not check Supabase first, then fall back to TMDB?**

1. **Simpler code** — No "check cache, then maybe fetch" logic. Each page has one clear data source.
2. **Always fresh** — TMDB data can change (ratings, descriptions). The detail page always shows current info.
3. **The cache serves its purpose** — Without it, loading 20 rated movies on the watched list would require 20 separate TMDB API calls. The Supabase cache eliminates this.

**Teaching moment:** This is a pragmatic tradeoff. We could build a smarter caching system, but it would add complexity without much benefit. In real-world development, "good enough" often beats "perfect but complicated."

**The pattern:**
```
Movie Detail Page:  User visits → Fetch from TMDB → Display
                    User rates  → Save to TMDB cache + ratings table

Watched List Page:  User visits → Load from Supabase (ratings + cached movies) → Display
```

**Checkpoint Quiz:**
- What's the difference between a table and a row?
- Why do we load data in useEffect?
- What SQL operation adds a new row?

**Practical Challenge:** Add a "favorite" boolean to ratings. Toggle it from the watched list.

**Unlocked:** "Your app has a real backend. Close the browser, come back tomorrow—your data is still there."

---

### Module 9: AI Recommendations
**Goal:** Pablo integrates AI to make personalized movie recommendations.

| Lesson | What Pablo Learns | What Pablo Does | Milestone |
|--------|-------------------|-----------------|-----------|
| 9.1 How AI APIs Work | LLMs, prompts, tokens, API calls | Reads explanation, sees example calls | Understands the pattern |
| 9.2 Your First AI Call | Calling Claude API, handling response | Sends simple prompt, gets response | AI response in console |
| 9.3 Prompt Engineering Basics | Clear instructions, context, examples | Experiments with prompt variations | Sees how prompts affect output |
| 9.4 Building Context from Ratings | Structuring Pablo's ratings as context | Crafts prompt with movie + ratings | AI "knows" Pablo's taste |
| 9.5 Recommendation UI | Button, loading state, displaying results | Builds "Get Recommendations" feature | Click → see recommendations |
| 9.6 Displaying Explanations | Parsing AI response, markdown | Shows why each movie was recommended | **Personalized recs with reasons!** |

#### Implementation Details

**Architecture Pattern (Keep API Key Server-Side):**
```
Browser (RecommendationPanel)
    ↓ fetch("/api/recommendations")
Next.js API Route (app/api/recommendations/route.js)
    ↓ calls Claude API with ANTHROPIC_API_KEY
Claude returns JSON
    ↓
Browser receives recommendations
    ↓ for each rec, search TMDB for poster
Display with posters and reasons
```

**Why This Pattern:**
- API keys must stay server-side (never expose in browser)
- API routes are the simplest way to do this in Next.js
- Pablo learns a real-world security pattern

**API Route (`app/api/recommendations/route.js`):**
```javascript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

function buildPrompt(movie, ratings, focusText = "") {
  // Analyze ratings to find what user loved/disliked
  const loved = [];
  const disliked = [];

  if (ratings.plot >= 4) loved.push("plot/story");
  if (ratings.plot && ratings.plot <= 2) disliked.push("plot/story");
  // ... same pattern for acting, cinematography, score

  // Build prompt with context
  let prompt = `You are a movie recommendation expert.

The user watched "${movie.title}" and rated it ${ratings.overall}/5 stars.
Genres: ${movie.genres?.map((g) => g.name).join(", ")}
`;

  if (loved.length > 0) {
    prompt += `\nThey particularly loved: ${loved.join(", ")}.`;
  }
  if (disliked.length > 0) {
    prompt += `\nThey were less impressed by: ${disliked.join(", ")}.`;
  }
  if (focusText.trim()) {
    prompt += `\nThey specifically want movies with: "${focusText.trim()}".`;
  }

  prompt += `

Recommend 3-5 movies that match what they loved.

IMPORTANT: Respond with ONLY valid JSON:
[{"title": "Movie Title", "year": 2020, "reason": "Why this matches."}]`;

  return prompt;
}

export async function POST(request) {
  const { movie, ratings, focusText } = await request.json();

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: buildPrompt(movie, ratings, focusText) }],
  });

  const recommendations = JSON.parse(message.content[0].text);
  return Response.json({ recommendations });
}
```

**Client-Side Function (`lib/ai.js`):**
```javascript
// Use simple for...of loop (NOT Promise.all - too advanced)
export async function getRecommendations(movie, ratings, focusText = "") {
  const response = await fetch("/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ movie, ratings, focusText }),
  });

  const data = await response.json();

  // Enrich with TMDB data (sequential, not parallel)
  const enrichedRecommendations = [];
  for (const rec of data.recommendations) {
    try {
      const searchResults = await searchByTitle(rec.title, rec.year);
      const tmdbMovie = searchResults.results?.[0] || null;
      enrichedRecommendations.push({ ...rec, tmdbMovie });
    } catch (error) {
      enrichedRecommendations.push({ ...rec, tmdbMovie: null });
    }
  }

  return enrichedRecommendations;
}
```

**RecommendationPanel Component:**
- Displays inline on movie detail page (NOT a modal - simpler UX)
- Shows only for movies that have been rated
- Optional text input for user to specify what they liked
- Opens recommended movies in new tab (preserves list)
- Uses patterns already learned: useState, controlled inputs, onClick, map

#### Complexity Ceiling (What to AVOID)

| Pattern | Why to Avoid | Use Instead |
|---------|--------------|-------------|
| `Promise.all` + `async map` | Advanced parallel async | Simple `for...of` loop |
| Complex prompt building | Hard to modify/understand | Build string incrementally with `if` statements |
| Modal for recommendations | UX issue (modal closes on navigation) | Inline display |
| Streaming responses | Advanced pattern | Wait for complete response |
| `useCallback` | Premature optimization | Plain functions |

#### Teaching Moments

**Lesson 9.3 - Prompt Engineering:**
The `buildPrompt` function is intentionally simple so Pablo can experiment:
- Try changing "3-5 movies" to "exactly 3 movies"
- Try adding "Only recommend comedies"
- Try changing the JSON format

**Lesson 9.4 - Building Context:**
```
"Notice how we analyze the ratings to tell Claude what the user loved?
If plot is 4-5 stars, we add 'plot/story' to the loved list.
If it's 1-2 stars, we add it to disliked.
This gives Claude useful context without sending raw numbers."
```

**Lesson 9.5 - The focusText Feature:**
The optional text input lets users say things like:
- "the twist ending"
- "the chemistry between the leads"
- "movies with a similar soundtrack"

This is just a controlled input (learned in Module 5.9) passed to the prompt.

**Checkpoint Quiz:**
- What context do we send to make recommendations relevant?
- Why do AI requests take longer than database requests?
- How would you modify the prompt to only get comedy recommendations?

**Practical Challenge:** The "mood" input is already built as `focusText`! Try using it with different inputs.

**Unlocked:** "Your app thinks. It understands your taste and explains its reasoning. This is genuinely intelligent software."

---

### Module 10: Polish & Deploy
**Goal:** Pablo ships a production-quality app to the real internet.

| Lesson | What Pablo Learns | What Pablo Does | Milestone |
|--------|-------------------|-----------------|-----------|
| 10.1 Loading States | Skeleton screens, spinners, UX | Adds loading indicators everywhere | No jarring blank screens |
| 10.2 Error Handling | try/catch, graceful degradation, logging | Handles failures gracefully | App doesn't crash on errors |
| 10.3 Responsive Polish | Testing on devices, fixing breakpoints | Makes every screen mobile-friendly | Looks great on phone |
| 10.4 Final Touches | Code cleanup, accessibility basics | Reviews and polishes | Code is clean and commented |
| 10.5 Deploying to Vercel | Git push, Vercel setup, env vars | Deploys to production | **APP IS LIVE!** |
| 10.6 Celebration & Next Steps | Review journey, discuss future learning | Reflects on what was built | Has a roadmap forward |

#### Lesson 10.2 — Error Handling Patterns in CineLog

**Why Error Handling Matters:**

Things go wrong: APIs fail, networks drop, databases time out. Without error handling:
- The app crashes with cryptic errors
- Users don't know what happened
- Developers can't debug problems

Good error handling means: the app keeps working (graceful degradation), users see helpful messages, and developers can find problems in logs.

**The Three Parts of Error Handling:**

1. **Catch errors** — Wrap risky code in try/catch
2. **Show users a message** — Set error state, display in UI
3. **Log for debugging** — console.error with context

**Pattern Used Throughout CineLog:**

```javascript
async function handleSomething() {
  setError(null);        // Clear previous errors
  setLoading(true);      // Show loading state

  try {
    const data = await riskyOperation();
    setData(data);       // Success! Update state
  } catch (err) {
    console.error("[Context] What failed:", err.message);
    setError("User-friendly message here");
  } finally {
    setLoading(false);   // Always hide loading
  }
}
```

**Consistent Logging with Prefixes:**

Every log statement uses a prefix so developers know where the message came from:

| Prefix | Where Used |
|--------|------------|
| `[TMDB]` | lib/tmdb.js — API calls to TMDB |
| `[Supabase]` | lib/supabase.js — Database operations |
| `[AI]` | lib/ai.js, API route — AI recommendations |
| `[Ratings]` | lib/ratings-context.js — Rating state |
| `[HomePage]` | app/page.js — Search page |
| `[MoviePage]` | app/movie/[id]/page.js — Detail page |
| `[WatchedPage]` | app/watched/page.js — Watched list |
| `[Recommendations]` | RecommendationPanel.jsx |

**Example from the codebase:**
```javascript
// In lib/tmdb.js
if (!response.ok) {
  console.error("[TMDB] Failed to search movies, status:", response.status);
  throw new Error("Failed to search movies");
}
console.log("[TMDB] Found", data.results.length, "movies");
```

**Displaying Errors to Users:**

Errors are shown inline, not in alerts/popups:
```jsx
{error && (
  <div className="text-red-400 p-4 bg-red-900/20 rounded-lg">
    {error}
  </div>
)}
```

**What NOT to Do (Complexity Ceiling):**
- No error boundary components (advanced React pattern)
- No toast/notification libraries
- No retry logic with exponential backoff
- No Sentry/error reporting services

Keep it simple: try/catch, useState for error, console.error with prefix.

**Checkpoint for 10.2:**
- What happens if you don't catch an error in an async function?
- Why use prefixes in console.log statements?
- Where should error messages be shown to users?

---

#### Lesson 10.3 — Responsive Patterns Used in CineLog

The reference implementation uses these responsive patterns (all using Tailwind breakpoint prefixes learned in Module 4.4):

**MovieGrid (grid columns):**
```jsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
```
- Mobile: 2 columns
- Small (640px+): 3 columns
- Medium (768px+): 4 columns
- Large (1024px+): 5 columns

**Watched List (grid columns):**
```jsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
```

**Movie Detail Page (layout direction):**
```jsx
<div className="flex flex-col md:flex-row gap-8">
```
- Mobile: Poster stacks above info (vertical)
- Medium+: Poster beside info (horizontal)

**SearchBar Discover Filters (responsive grid):**
```jsx
<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
```
- Mobile: 2x2 grid of filters
- Small+: All 4 filters in one row

**Key Teaching Points:**
- Mobile-first approach: Start with `grid-cols-2`, add larger breakpoints
- Use `flex-col md:flex-row` for stacking → side-by-side layouts
- Container pattern: `max-w-6xl mx-auto px-4` centers content with padding

**Checkpoint Quiz:**
- Why is error handling important for user experience?
- What's different about environment variables in production?
- What happens automatically when you push to main now?
- What does `grid-cols-2 md:grid-cols-4` mean?

**Final Deliverable:** Pablo shares his live URL. The app works. It's on the internet. He built it.

---

## Lesson Structure Template

Each lesson follows this pattern (20-40 minutes):

```
┌─────────────────────────────────────────────────────────────┐
│  1. CONTEXT (2-3 min)                                       │
│     - Where we are in the course/app                        │
│     - What this lesson unlocks                              │
│     - Quick analogy to frame the concept                    │
├─────────────────────────────────────────────────────────────┤
│  2. CONCEPT (5-10 min)                                      │
│     - Explain the new idea clearly                          │
│     - Show a minimal example (not app code yet)             │
│     - Socratic check: "What do you think happens if...?"    │
├─────────────────────────────────────────────────────────────┤
│  3. APPLY (10-20 min)                                       │
│     - Pablo writes code (exercises or app)                  │
│     - Claude guides but doesn't write for him               │
│     - Stuck protocol: hints → smaller task → show solution  │
│     - Time reference: "If stuck 15-20 min, ask for help"    │
├─────────────────────────────────────────────────────────────┤
│  4. CHECKPOINT (3-5 min)                                    │
│     - 1-2 quiz questions (must pass to proceed)             │
│     - "Explain in your own words" prompt                    │
│     - Quick prediction exercise                             │
├─────────────────────────────────────────────────────────────┤
│  5. SAVE POINT                                              │
│     - Summary: "You learned X and can now do Y"             │
│     - Feature unlocked (if applicable)                      │
│     - Git commit with descriptive message                   │
│     - Preview of next lesson                                │
│     - Mentor notes updated                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Progress Milestones (What "Unlocks")

| After Module | What Works / What Pablo Can Do |
|--------------|--------------------------------|
| 0 | Understands the full journey, has dev environment ready |
| 1 | Can build and style static UI with HTML/CSS |
| 2 | Can manipulate data with JavaScript (filter, map, transform) |
| 3 | Can track changes with Git, code is on GitHub |
| 4 | Can style rapidly with Tailwind |
| 5 | Can build interactive React components |
| 6 | **SEARCH WORKS** - 3 search modes (title, actor, discover) + pagination |
| 7 | **RATING WORKS** - can rate movies on 5 dimensions |
| 8 | **DATA PERSISTS** - ratings survive refresh |
| 9 | **AI WORKS** - personalized recommendations with explanations |
| 10 | **DEPLOYED** - live app on the internet! |

---

## Mentor Notes Structure

After each lesson, Claude updates:

### `progress-log.md`
```markdown
## Lesson 2.8: Loops to Map & Filter

**Status:** Complete
**Estimated Duration:** ~35 minutes

**Concepts Covered:**
- for loops ✓
- forEach ✓  
- map (solid understanding)
- filter (needed extra example)

**Commits:** "Add data filtering functions"
**Next:** 2.9 Objects
```

### `struggles.md`
```markdown
## Array Methods (Lesson 2.7-2.8)
- Confused about when map vs filter
- Helpful reframe: "map = transform each, filter = keep some"
- Took 2 attempts to write filter correctly

## Callback Functions (Lesson 2.8)
- Arrow function syntax was confusing initially
- Clicked after seeing: "the arrow separates input from output"
```

### `wins.md`
```markdown
## HTML Structure (Lesson 1.1)
- Immediately understood nesting
- Made connection to "outlines" from writing

## Scope (Lesson 2.4)
- Predicted correctly which variables were accessible
- "Rooms in a house" analogy resonated
```

### `recommendations.md`
```markdown
## Before Module 5 (React)
- Review callback functions (struggled in 2.8)
- Extra practice with arrow function syntax

## General Observations
- Visual learner—responds well to diagrams
- Gets frustrated with typos—encourage console checking
- Motivated by seeing things "work"
```

---

## Lesson Count Summary

| Module | Lessons | Focus |
|--------|---------|-------|
| 0. Welcome | 3 | Orientation, setup |
| 1. HTML/CSS | 6 | Foundation styling |
| 2. JavaScript | 10 | Core programming |
| 3. Git | 5 | Version control |
| 4. Tailwind | 5 | Utility CSS |
| 5. React | 10 | Component fundamentals |
| 6. Search | 10 | API integration (3 modes + pagination) |
| 7. Rating | 7 | Core feature |
| 8. Persistence | 7 | Database |
| 9. AI | 6 | Intelligence |
| 10. Deploy | 6 | Polish & ship |
| **Total** | **75 lessons** | |

At ~30 min/lesson average: ~37 hours of learning
At 1 lesson/day: ~2.5 months
At 2 lessons/day: ~5 weeks
*(But it's self-paced—no pressure!)*

---

## Final Decisions

| Decision | Choice |
|----------|--------|
| App name | CineLog |
| Extra array/object practice | Optional (not required for progress) |
| Practice exercises | "Final boss/test" format for spaced repetition |
| shadcn/ui timing | **Module 5** (hybrid approach—see below) |
| Mentor notes location | Subfolder (`.mentor/notes/`), checked into git |
| Lesson numbering | X.Y format |

---

## shadcn/ui Strategy (Hybrid Approach)

### Philosophy
shadcn/ui is introduced in Module 5 because:
1. **Pablo's motivation:** He wants results that look good. Early polish sustains engagement.
2. **Transparency:** Unlike black-box libraries, shadcn copies source code into the project. Pablo can open any component and see it's just HTML + Tailwind.
3. **Real-world practice:** Professional developers use component libraries. Learning to read and extend them is a skill.
4. **Strategic manual building:** Complex interactive components (StarRating) are still built from scratch to deepen understanding.

### Component Approach by Type

| Component Type | Approach | Module |
|----------------|----------|--------|
| **Card, Button, Badge** | Use shadcn, explain it's "just Tailwind" | 5 |
| **Input, Select, Label** | Use shadcn, walk through source code | 5-6 |
| **StarRating** | **Build from scratch** | 7 |
| **Dialog/Modal** | Use shadcn, study source code together | 7 |
| **Skeleton, Spinner** | Use shadcn | 10 |

### Key Teaching Moments

**Module 5.2 – First Component (shadcn introduction):**
```
"We're using a library called shadcn/ui. Most component libraries are 
black boxes—you can't see inside. shadcn is different: it copies the 
actual code into your project. Let's install a Card and look inside..."

*Pablo opens components/ui/card.tsx*

"See? It's just a div with Tailwind classes. No magic. You could have 
written this yourself—shadcn just saved you the time."
```

**Module 7.2 – StarRating (manual build):**
```
"For this one, we're building from scratch. This is an interactive 
component with hover states and click handling—perfect for practicing 
what you've learned. Plus, you'll appreciate pre-built components more 
after doing this manually."

*Pablo builds StarRating step by step*

"Now you know what goes into making a controlled, interactive component. 
When you use shadcn's more complex components, you'll understand the 
patterns they use."
```

**Module 7.4 – Dialog (shadcn with source review):**
```
"The rating form needs a modal. We'll use shadcn's Dialog component, 
but let's look inside first..."

*Pablo reads through dialog.tsx*

"See how it handles open/close state? This is the same useState pattern 
you used for StarRating, just packaged up for reuse."
```

### Components Used in CineLog

| shadcn Component | Where Used | Notes |
|------------------|------------|-------|
| Card | Movie cards, rating display | Introduced in Module 5 |
| Button | Throughout | Introduced in Module 5 |
| Input | Search bar, forms | Module 5-6 |
| Badge | Genre tags, ratings | Module 6 |
| Select | Filters (genre, year) | Module 6 |
| Dialog | Rating modal | Module 7 (source reviewed) |
| Skeleton | Loading states | Module 10 |
| Alert | Error messages | Module 10 |

### What Pablo Builds From Scratch

| Component | Module | Why Manual |
|-----------|--------|------------|
| **StarRating** | 7 | Core learning—controlled components, hover state, click handling |
| **MovieGrid** | 5-6 | Practice with mapping + composition (uses shadcn Card inside) |
| **SearchBar** | 6 | Practice with controlled inputs (uses shadcn Input inside) |
| **WatchedList** | 7 | Practice with state management and lists |
| **RecommendationPanel** | 9 | Combines everything learned |

---

## Updated Module 5 Lesson List

| Lesson | What Pablo Learns | shadcn Involved? |
|--------|-------------------|------------------|
| 5.1 What Is React? | Components, declarative UI, virtual DOM | No |
| 5.2 Your First Component | Function components, JSX + **shadcn intro** | Yes—Card |
| 5.3 JSX Syntax | JSX rules, expressions, className | No |
| 5.4 Props: Passing Data | Props as function arguments | Uses Card |
| 5.5 Rendering Lists | .map() in JSX, keys | Uses Card |
| 5.6 State Intro | Why we need state, mental model | No |
| 5.7 useState in Action | useState hook, setter functions | Uses Button |
| 5.8 Events: onClick | Event handlers, passing functions | Uses Button |
| 5.9 Events: Forms | Controlled inputs, onChange | Uses Input |
| 5.10 Component Composition | Breaking UI into pieces, children | Uses multiple |

---

## Mentor Notes Folder Structure (Updated)

```
cinelog-course/
├── ...
├── .mentor/                         # Checked into git, not in root
│   └── notes/
│       ├── progress-log.md
│       ├── struggles.md
│       ├── wins.md
│       └── recommendations.md
├── ...
```

The `.mentor/` prefix makes it less obvious but still accessible. It will be tracked in git so you can review Pablo's progress by checking his commits.

---

## Practice Exercises Strategy (Final Boss Format)

Each module ends with optional "challenge exercises" that serve as:
1. **Comprehension check** – Can Pablo apply the concepts without hand-holding?
2. **Spaced repetition** – Revisit concepts from earlier modules
3. **Portfolio material** – Extra projects if he wants to show more work

### Structure

```
practice-exercises/
├── module-1-html-css/
│   ├── README.md                    # Instructions
│   ├── challenge-1-profile-card.md  # Build a profile card
│   └── challenge-2-nav-bar.md       # Build a responsive nav
│
├── module-2-javascript/
│   ├── README.md
│   ├── challenge-1-word-counter.md  # String manipulation
│   ├── challenge-2-todo-data.md     # Array/object manipulation
│   └── challenge-3-movie-filter.md  # Combines everything (callbacks to earlier learning)
│
├── module-5-react/
│   ├── README.md
│   ├── challenge-1-counter-app.md   # State practice
│   └── challenge-2-todo-list.md     # Full mini-app
│
└── final-boss/
    ├── README.md
    └── book-tracker.md              # Build a simplified CineLog for books
                                     # (Tests everything learned)
```

### "Final Boss" Concept

After completing the main course, Pablo can attempt the **Book Tracker Challenge**:
- Same architecture as CineLog (search, rate, persist, recommend)
- Uses Google Books API instead of TMDB
- No hand-holding—tests if he can apply patterns independently
- Optional but highly recommended for solidifying learning

---

## Ready to Build

The course structure is now complete. Next steps:

1. **Scaffold the project folder structure**
2. **Write CLAUDE.md files** (teaching scripts for each lesson)
3. **Create slash commands** (`/start-0-1`, `/start-1-1`, etc.)
4. **Set up cinelog-app/** with minimal scaffolding
5. **Write project-context/** documents (APP_VISION, ARCHITECTURE_MAP, etc.)
6. **Create practice exercises** with "final boss" challenges
