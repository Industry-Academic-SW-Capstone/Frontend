import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse bg-bg-secondary rounded-md ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
