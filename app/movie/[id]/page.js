// Movie details page
// Will be fully implemented in Phase 2-4

export default function MoviePage({ params }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-50">Movie Details</h1>
      <p className="text-slate-400">Movie ID: {params.id}</p>
      <p className="text-slate-400">Coming soon...</p>
    </div>
  );
}
