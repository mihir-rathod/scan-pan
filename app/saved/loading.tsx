export default function SavedLoading() {
  return (
    <div className="min-h-screen bg-stone-50 p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="skeleton h-7 w-32 mb-2" />
          <div className="skeleton h-4 w-20" />
        </div>
      </div>

      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-stone-100 rounded-2xl overflow-hidden"
          >
            <div className="p-4 bg-stone-50 border-b border-stone-100">
              <div className="skeleton h-5 w-40 mb-2" />
              <div className="skeleton h-3.5 w-56" />
              <div className="skeleton h-3 w-24 mt-2" />
            </div>
            <div className="p-4">
              <div className="skeleton h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
