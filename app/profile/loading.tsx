export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-stone-50 p-5 pb-24">
      <div className="skeleton h-7 w-20 mb-6" />

      {/* User Card Skeleton */}
      <div className="bg-white p-6 rounded-2xl border border-stone-100 mb-5 flex flex-col items-center">
        <div className="skeleton w-22 h-22 rounded-full mb-4" />
        <div className="skeleton h-6 w-32 mb-2" />
        <div className="skeleton h-4 w-44 mb-2" />
        <div className="skeleton h-5 w-28 rounded-full" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-stone-100 flex flex-col items-center gap-2"
          >
            <div className="skeleton w-10 h-10 rounded-xl" />
            <div className="skeleton h-8 w-12" />
            <div className="skeleton h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
