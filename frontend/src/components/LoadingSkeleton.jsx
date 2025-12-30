const LoadingSkeleton = () => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-6">
      {[1, 2, 3].map((column) => (
        <div key={column} className="flex-shrink-0 w-80 lg:w-96 flex flex-col h-full border-2 border-black bg-white shadow-[4px_4px_0_0_#000]">
          {/* Header Skeleton */}
          <div className="p-4 border-b-2 border-black flex justify-between items-center bg-gray-50">
            <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-6 w-8 bg-gray-200 animate-pulse rounded"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="flex-1 p-3 space-y-3">
            {[1, 2, 3].map((card) => (
              <div key={card} className="bg-white p-4 border-2 border-dashed border-gray-300 animate-pulse">
                <div className="flex justify-between items-start mb-3">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t-2 border-gray-100">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
