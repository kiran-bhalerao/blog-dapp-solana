export const SponsoredSkeleton = () => {
  return (
    <div className="card glass relative overflow-hidden flex flex-col shadow rounded-lg bg-white p-4 mt-4">
      <div className="rounded-lg h-32 bg-white"></div>
      <div className="flex-1 mt-4">
        <div className="w-3/4 bg-white rounded-xl h-3 mt-1"></div>
        <div className="w-2/4 bg-white rounded-xl h-3 mt-3"></div>
      </div>
    </div>
  );
};
