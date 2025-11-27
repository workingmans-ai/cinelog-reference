import MovieGrid from "@/components/MovieGrid";

// Hardcoded sample watched movies for Phase 2 testing
const SAMPLE_WATCHED = [
  {
    id: 550,
    title: "Fight Club",
    release_date: "1999-10-15",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    genres: [{ id: 18, name: "Drama" }],
  },
  {
    id: 155,
    title: "The Dark Knight",
    release_date: "2008-07-16",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    genres: [{ id: 28, name: "Action" }],
  },
  {
    id: 278,
    title: "The Shawshank Redemption",
    release_date: "1994-09-23",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    genres: [{ id: 18, name: "Drama" }],
  },
];

const SAMPLE_RATINGS = {
  550: { overall: 5 },
  155: { overall: 4 },
  278: { overall: 5 },
};

export default function WatchedPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-50">My Watched List</h1>
        <p className="text-slate-400 mt-1">
          {SAMPLE_WATCHED.length} movies rated
        </p>
      </div>

      {/* Sort controls - will be functional in Phase 5 */}
      <div className="mb-6">
        <p className="text-slate-500 text-sm">
          Sort functionality will be added in Phase 5
        </p>
      </div>

      {/* Movie grid */}
      <MovieGrid movies={SAMPLE_WATCHED} ratings={SAMPLE_RATINGS} />
    </div>
  );
}
