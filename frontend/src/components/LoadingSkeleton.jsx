const LoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-slate-900 rounded-lg shadow-sm p-6 animate-pulse border border-slate-800">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-slate-700 mr-3"></div>
            <div className="h-6 bg-slate-700 rounded w-32"></div>
            <div className="ml-3 h-6 bg-slate-700 rounded w-8"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((j) => (
              <div key={j} className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-slate-700">
                <div className="h-5 bg-slate-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;

