"use client";
import React from "react";

interface AnalystNoteProps {
  data: {
    title: string;
    content: string;
  };
}

const AnalystNote: React.FC<AnalystNoteProps> = ({ data }) => {
  return (
    <div className="p-5 bg-white border border-border-color rounded-2xl mb-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🧐</span>
        <h3 className="text-sm font-bold text-text-primary">애널리스트 노트</h3>
      </div>
      <h4 className="text-md font-bold text-text-primary mb-2">{data.title}</h4>
      <div className="relative pl-4">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-toss-blue rounded-full" />
        <p className="text-sm text-text-secondary leading-relaxed">
          {data.content}
        </p>
      </div>
    </div>
  );
};

export default AnalystNote;
