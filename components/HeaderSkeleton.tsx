import React from "react";
import Skeleton from "@/components/ui/Skeleton";

const HeaderSkeleton = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 max-w-md mx-auto bg-bg-primary/80 backdrop-blur-lg border-b border-border-color">
      <div className="flex items-center justify-between p-4 h-16">
        <div className="flex items-center gap-2">
          {/* User Group Skeleton */}
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="flex items-center gap-2">
          {/* Notification Bell Skeleton */}
          <Skeleton className="w-10 h-10 rounded-full" />

          {/* Account Switcher Skeleton */}
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>
    </header>
  );
};

export default HeaderSkeleton;
