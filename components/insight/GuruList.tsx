"use client";
import React from "react";
import { motion } from "framer-motion";
import { PERSONAS } from "@/lib/insight/personas";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface GuruListProps {
  onSelectReport: (report: any) => void;
}

export const GuruList: React.FC<GuruListProps> = ({ onSelectReport }) => {
  const queryClient = useQueryClient();

  // Fetch latest reports
  const { data: reports } = useQuery({
    queryKey: ["guru-reports"],
    queryFn: async () => {
      const res = await fetch("/api/insight/report");
      const json = await res.json();
      return json.data || [];
    },
  });

  // Generate report mutation
  const generateMutation = useMutation({
    mutationFn: async (personaId: string) => {
      const res = await fetch("/api/insight/report/generate", {
        method: "POST",
        body: JSON.stringify({ personaId }),
      });
      if (!res.ok) throw new Error("Failed to generate");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guru-reports"] });
    },
  });

  const getAvatarPath = (name: string) => {
    // Simple mapping based on name
    if (name.includes("워렌"))
      return "/images/avatar/small/avatar_h_warren.png";
    if (name.includes("벤저민"))
      return "/images/avatar/small/avatar_h_benjamin.png";
    if (name.includes("피터")) return "/images/avatar/small/avatar_h_peter.png";
    if (name.includes("달리오"))
      return "/images/avatar/small/avatar_h_david.png"; // Ray Dalio -> David? No, check files.
    // Checking file list: avatar_h_david.png, avatar_h_george.png, avatar_h_jesse.png
    // Let's assume standard mapping or fallback
    return "/images/avatar/small/avatar_h_warren.png";
  };

  // Better mapping based on persona ID or name
  const AVATAR_MAP: Record<string, string> = {
    warren_buffett: "/images/avatar/small/avatar_h_warren.png",
    benjamin_graham: "/images/avatar/small/avatar_h_benjamin.png",
    peter_lynch: "/images/avatar/small/avatar_h_peter.png",
    ray_dalio: "/images/avatar/small/avatar_h_david.png", // Assuming David is placeholder for Dalio or similar
    jesse_livermore: "/images/avatar/small/avatar_h_jesse.png",
    george_soros: "/images/avatar/small/avatar_h_george.png",
    cathie_wood: "/images/avatar/small/avatar_h_cathie.png",
  };

  return (
    <div className="py-6">
      <div className="px-1 mb-4">
        <h2 className="text-xl font-bold text-text-primary">
          거장들의 투자 노트
        </h2>
        <p className="text-xs text-text-secondary mt-1">
          전설적인 투자자라면 지금 무엇을 살까?
        </p>
      </div>

      <div className="overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4">
        <div className="flex gap-3">
          {PERSONAS.map((persona) => {
            const latestReport = reports?.find(
              (r: any) => r.persona_id === persona.id
            );

            // Fallback avatar
            const avatarSrc =
              AVATAR_MAP[persona.id] ||
              "/images/avatar/small/avatar_h_warren.png";

            return (
              <motion.div
                key={persona.id}
                className="min-w-60 bg-bg-secondary rounded-2xl p-5 shadow-sm border border-border-color flex flex-col justify-between h-[180px] relative overflow-hidden"
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (latestReport) onSelectReport(latestReport);
                }}
              >
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-bg-third rounded-bl-full -mr-4 -mt-4 z-0 opacity-50" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-bg-third flex items-center justify-center overflow-hidden border border-border-color">
                      <img
                        src={avatarSrc}
                        alt={persona.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary text-sm">
                        {persona.name}
                      </h3>
                      <p className="text-[10px] text-toss-blue font-medium bg-blue-50/10 px-1.5 py-0.5 rounded inline-block">
                        {persona.role}
                      </p>
                    </div>
                  </div>

                  {latestReport ? (
                    <div>
                      <h4 className="font-bold text-text-primary text-sm line-clamp-2 mb-1 leading-snug">
                        {latestReport.title}
                      </h4>
                      <p className="text-[10px] text-text-third">
                        {new Date(latestReport.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center h-16">
                      <p className="text-xs text-text-third">
                        아직 리포트가 없어요.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
