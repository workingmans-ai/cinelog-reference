import MovieGrid from "@/components/MovieGrid";

// Hardcoded sample movies for Phase 2 testing
const SAMPLE_MOVIES = [
  {
    id: 550,
    title: "Fight Club",
    release_date: "1999-10-15",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    genres: [{ id: 18, name: "Drama" }, { id: 53, name: "Thriller" }],
  },
  {
    id: 680,
    title: "Pulp Fiction",
    release_date: "1994-09-10",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    genres: [{ id: 53, name: "Thriller" }, { id: 80, name: "Crime" }],
  },
  {
    id: 155,
    title: "The Dark Knight",
    release_date: "2008-07-16",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    genres: [{ id: 28, name: "Action" }, { id: 18, name: "Drama" }],
  },
  {
    id: 238,
    title: "The Godfather",
    release_date: "1972-03-14",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    genres: [{ id: 18, name: "Drama" }, { id: 80, name: "Crime" }],
  },
  {
    id: 13,
    title: "Forrest Gump",
    release_date: "1994-06-23",
    poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    genres: [{ id: 35, name: "Comedy" }, { id: 18, name: "Drama" }],
  },
  {
    id: 120,
    title: "The Lord of the Rings: The Fellowship of the Ring",
    release_date: "2001-12-18",
    poster_path: "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    genres: [{ id: 12, name: "Adventure" }, { id: 14, name: "Fantasy" }],
  },
  {
    id: 278,
    title: "The Shawshank Redemption",
    release_date: "1994-09-23",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    genres: [{ id: 18, name: "Drama" }, { id: 80, name: "Crime" }],
  },
  {
    id: 157336,
    title: "Interstellar",
    release_date: "2014-11-05",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    genres: [{ id: 12, name: "Adventure" }, { id: 878, name: "Science Fiction" }],
  },
];

// Sample ratings for testing
const SAMPLE_RATINGS = {
  550: { overall: 5 },
  155: { overall: 4 },
  278: { overall: 5 },
};

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-50">Popular Movies</h1>
        <p className="text-slate-400 mt-1">
          Search will be added in Phase 3
        </p>
      </div>

      {/* Movie grid */}
      <MovieGrid movies={SAMPLE_MOVIES} ratings={SAMPLE_RATINGS} />
    </div>
  );
}
