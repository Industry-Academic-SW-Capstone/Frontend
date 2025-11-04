"use client";
import React from 'react';

interface ComponentCardProps {
  title: string;
  description: string;
  usage: string;
  children: React.ReactNode;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ title, description, usage, children }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-slate-600 h-12">{description}</p>
        <div className="mt-4">
          <span className="font-semibold text-sm text-slate-500 uppercase tracking-wider">Usage</span>
          <p className="mt-1 text-slate-600">{usage}</p>
        </div>
      </div>
      <div className="bg-slate-100 p-8 flex items-center justify-center flex-1">
        {children}
      </div>
    </div>
  );
};

export default ComponentCard;
