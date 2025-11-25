import React from 'react';

const SkeletonPost = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse mr-3" />
          <div className="space-y-2">
            <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-3 w-full bg-gray-200 rounded animate-pulse mb-1" />
      <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse mb-4" />

      <div className="flex gap-3 pt-3">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
};

export default SkeletonPost;
