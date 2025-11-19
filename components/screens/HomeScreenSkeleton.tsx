import React from "react";
import Skeleton from "@/components/ui/Skeleton";

const HomeScreenSkeleton = () => {
  return (
    <div className="space-y-2 pb-24 animate-pulse">
      {/* Greeting Section Skeleton */}
      <div className="p-6 pt-3 pb-2 bg-bg-secondary rounded-2xl flex flex-col h-[76px] justify-center">
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Total Assets Section Skeleton */}
      <div className="p-6 bg-bg-secondary rounded-2xl flex flex-col h-[108px] justify-center">
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <Skeleton className="h-10 w-2/3" />
      </div>

      {/* Featured Competition / Mission Skeleton */}
      <div className="h-[180px] w-full rounded-2xl bg-bg-secondary p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
        </div>
      </div>

      {/* Favorites Section Skeleton */}
      <div className="bg-bg-secondary rounded-2xl p-5 h-[200px]">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[140px] flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
              <div className="space-y-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rankings Preview Skeleton */}
      <div className="bg-bg-secondary rounded-2xl p-5 h-[250px]">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-6 h-6" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreenSkeleton;
