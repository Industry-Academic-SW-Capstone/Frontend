"use client";
import React from "react";
import { motion } from "framer-motion";

interface NewsItem {
  title: string;
  link: string;
  press: string;
  time: string;
}

interface NewsBriefProps {
  data: {
    items: NewsItem[];
  };
}

export const NewsBrief: React.FC<NewsBriefProps> = ({ data }) => {
  return (
    <div className="bg-bg-secondary rounded-3xl p-6 mb-4">
      <h3 className="text-xl font-bold text-text-primary mb-6 px-1">
        주요 뉴스
      </h3>

      <div className="space-y-6">
        {data.items.map((item, index) => (
          <motion.a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4 group items-start"
          >
            {/* Icon / Badge */}
            <div className="shrink-0 mt-1">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                뉴스
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-[17px] font-medium leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-1.5">
                {item.title}
              </p>
              <div className="flex items-center gap-2 text-xs text-text-third">
                <span>{item.press}</span>
                {item.time && (
                  <>
                    <span className="w-0.5 h-0.5 bg-text-third rounded-full" />
                    <span>{item.time}</span>
                  </>
                )}
              </div>
            </div>

            {/* Arrow Icon (Optional, for affordance) */}
            <div className="shrink-0 self-center text-text-third/50">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};
export default NewsBrief;
