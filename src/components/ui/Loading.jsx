import { cn } from "@/utils/cn";

const Loading = ({ className, type = "skeleton", ...props }) => {
  if (type === "spinner") {
    return (
      <div className={cn("flex items-center justify-center p-8", className)} {...props}>
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Skeleton loader that matches typical dashboard content
  return (
    <div className={cn("space-y-6 p-6", className)} {...props}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg shimmer"></div>
        <div className="h-10 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg shimmer"></div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
                <div className="h-8 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
                <div className="h-3 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg shimmer"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="h-6 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer mb-4"></div>
          
          {/* Table header */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
            ))}
          </div>
          
          {/* Table rows */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 py-3 border-t border-gray-100">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="h-6 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer mb-4"></div>
            <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg shimmer"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;