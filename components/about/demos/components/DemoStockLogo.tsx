import React from "react";

export const DemoStockLogo: React.FC<{ name: string }> = ({ name }) => {
  // Simple colored circle with first letter as logo mock
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
  ];
  const color = colors[name.length % colors.length];

  return (
    <div
      className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm`}
    >
      {name[0]}
    </div>
  );
};
