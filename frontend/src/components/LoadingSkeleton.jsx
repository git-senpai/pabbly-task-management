const LoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-3"></div>
            <div className="h-6 bg-gray-300 rounded w-32"></div>
            <div className="ml-3 h-6 bg-gray-300 rounded w-8"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((j) => (
              <div key={j} className="bg-gray-100 rounded-lg p-4 border-l-4 border-gray-300">
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;

