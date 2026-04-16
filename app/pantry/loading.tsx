export default function PantryLoading() {
  return (
    <div className="min-h-screen bg-stone-50 p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="skeleton h-7 w-32 mb-2" />
          <div className="skeleton h-4 w-16" />
        </div>
      </div>

      <div className="grid gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="p-4 bg-white border border-stone-100 rounded-2xl"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="skeleton w-8 h-8 rounded-lg" />
                <div>
                  <div className="skeleton h-5 w-28 mb-1.5" />
                  <div className="skeleton h-3.5 w-16" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="skeleton w-16 h-6 rounded-full" />
                <div className="skeleton w-8 h-8 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
