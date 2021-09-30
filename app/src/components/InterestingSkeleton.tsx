export const InterestingSkeleton = () => {
  return (
    <div className="card glass relative overflow-hidden flex shadow rounded-lg h-36 bg-white p-4 mt-4">
      <div className="rounded-lg h-full w-32 bg-white"></div>
      <div className="flex-1 ml-3">
        <div className="w-3/4 bg-white rounded-xl h-3 mt-1"></div>
        <div className="w-2/4 bg-white rounded-xl h-3 mt-3"></div>
      </div>
    </div>
  );
};
