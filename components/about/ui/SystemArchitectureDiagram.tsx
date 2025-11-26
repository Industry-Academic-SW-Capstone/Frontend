"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  Server,
  Database,
  Globe,
  Shield,
  Zap,
  Activity,
  Cpu,
  LucideIcon,
  Github,
  Bell,
  Building2,
  Box,
} from "lucide-react";

const Node = ({
  x,
  y,
  icon: Icon,
  label,
  subLabel,
  color = "blue",
  delay = 0,
  onClick,
}: {
  x: number;
  y: number;
  icon: LucideIcon;
  label: string;
  subLabel?: string;
  color?: string;
  delay?: number;
  onClick?: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="absolute flex flex-col items-center justify-center w-32 z-10 cursor-pointer"
      style={{ left: x, top: y }}
      onClick={onClick}
    >
      <motion.div
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
        }}
        whileTap={{ scale: 0.95 }}
        className={`w-16 h-16 rounded-2xl bg-white border-2 border-${color}-500 shadow-lg flex items-center justify-center relative z-10`}
      >
        <Icon className={`text-${color}-600`} size={32} />
        <div
          className={`absolute inset-0 bg-${color}-100 opacity-20 rounded-2xl animate-pulse`}
        />
      </motion.div>
      <div className="mt-3 text-center bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-gray-100 shadow-sm">
        <div className="text-sm font-bold text-gray-900">{label}</div>
        {subLabel && (
          <div className="text-[10px] text-gray-500">{subLabel}</div>
        )}
      </div>
    </motion.div>
  );
};

const Connection = ({
  startX,
  startY,
  endX,
  endY,
  color = "#3B82F6",
  delay = 0,
}: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color?: string;
  delay?: number;
}) => {
  // Offsets to center the connection on the node (Node width is 128px, icon box is 64px centered)
  // Center X = x + 64
  // Center Y = y + 32 (approximate center of the icon box)
  const sX = startX + 64;
  const sY = startY + 32;
  const eX = endX + 64;
  const eY = endY + 32;

  // Calculate control points for a smooth curve
  const midX = (sX + eX) / 2;
  const path = `M ${sX} ${sY} C ${midX} ${sY}, ${midX} ${eY}, ${eX} ${eY}`;

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.2"
      />
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay, ease: "easeInOut" }}
      />
      <motion.circle
        r="4"
        fill={color}
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        style={{ offsetPath: `path('${path}')` }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
          delay: delay + 1,
        }}
      />
    </svg>
  );
};

export const SystemArchitectureDiagram = ({
  mode = "full",
  onNodeClick,
}: {
  mode?: "full" | "frontend";
  onNodeClick?: (node: string) => void;
}) => {
  const isFull = mode === "full";

  return (
    <div className="relative w-full h-[600px] bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      {/* Boundaries */}
      {isFull && (
        <>
          {/* Vercel Boundary */}
          <div className="absolute top-[180px] left-[220px] w-[160px] h-[180px] border-2 border-dashed border-gray-300 rounded-3xl opacity-50" />
          <div className="absolute top-[160px] left-[220px] text-xs font-bold text-gray-400">
            Vercel
          </div>

          {/* Docker Boundary */}
          <div className="absolute top-[100px] left-[600px] w-[150px] h-[450px] border-2 border-dashed border-blue-300 rounded-3xl opacity-50" />
          <div className="absolute top-[80px] left-[600px] text-xs font-bold text-blue-400 flex items-center gap-1">
            <Box size={12} /> Docker Cluster
          </div>
        </>
      )}
      {/* Connections */}
      <Connection
        startX={50}
        startY={250}
        endX={250}
        endY={250}
        delay={0.5}
      />{" "}
      {/* User -> Frontend */}
      {isFull ? (
        <>
          <Connection
            startX={250}
            startY={250}
            endX={450}
            endY={250}
            delay={1.0}
          />{" "}
          {/* Frontend -> Gateway */}
          <Connection
            startX={450}
            startY={250}
            endX={650}
            endY={150}
            delay={1.5}
          />{" "}
          {/* Gateway -> Core */}
          <Connection
            startX={450}
            startY={250}
            endX={650}
            endY={450}
            delay={1.5}
          />{" "}
          {/* Gateway -> AI Server */}
          <Connection
            startX={650}
            startY={150}
            endX={850}
            endY={250}
            delay={2.0}
          />{" "}
          {/* Core -> DB */}
          <Connection
            startX={650}
            startY={150}
            endX={850}
            endY={150}
            delay={2.0}
          />{" "}
          {/* Core -> Redis */}
          <Connection
            startX={650}
            startY={450}
            endX={850}
            endY={250}
            delay={2.0}
            color="#8B5CF6"
          />{" "}
          {/* AI Server -> DB */}
          {/* External Services Connections */}
          <Connection
            startX={850}
            startY={50}
            endX={650}
            endY={150}
            delay={2.5}
            color="#333"
          />{" "}
          {/* GitHub -> Core (CI/CD) */}
          <Connection
            startX={650}
            startY={150}
            endX={850}
            endY={350}
            delay={2.5}
            color="#EF4444"
          />{" "}
          {/* Core -> HanTu */}
          <Connection
            startX={650}
            startY={150}
            endX={450}
            endY={450}
            delay={2.5}
            color="#F59E0B"
          />{" "}
          {/* Core -> FCM */}
          <Connection
            startX={450}
            startY={450}
            endX={50}
            endY={250}
            delay={3.0}
            color="#F59E0B"
          />{" "}
          {/* FCM -> User */}
        </>
      ) : (
        <>
          {/* Frontend Internal Connections */}
          <Connection
            startX={250}
            startY={250}
            endX={450}
            endY={150}
            delay={1.0}
            color="#3B82F6"
          />{" "}
          {/* Frontend -> Zustand */}
          <Connection
            startX={250}
            startY={250}
            endX={450}
            endY={350}
            delay={1.0}
            color="#F59E0B"
          />{" "}
          {/* Frontend -> React Query */}
          <Connection
            startX={450}
            startY={350}
            endX={650}
            endY={250}
            delay={1.5}
            color="#F59E0B"
          />{" "}
          {/* React Query -> API */}
          <Connection
            startX={450}
            startY={150}
            endX={650}
            endY={250}
            delay={1.5}
            color="#3B82F6"
          />{" "}
          {/* Zustand -> API */}
        </>
      )}
      {/* Nodes */}
      <Node
        x={50}
        y={250}
        icon={Smartphone}
        label="User"
        subLabel="Web & PWA"
        color="gray"
        delay={0}
        onClick={() => onNodeClick?.("User")}
      />
      <Node
        x={250}
        y={250}
        icon={Globe}
        label="Frontend"
        subLabel="Next.js"
        color="blue"
        delay={0.2}
        onClick={() => onNodeClick?.("Frontend")}
      />
      {isFull ? (
        <>
          <Node
            x={450}
            y={250}
            icon={Server}
            label="Gateway"
            subLabel="Traefik"
            color="indigo"
            delay={0.4}
            onClick={() => onNodeClick?.("Gateway")}
          />

          {/* Backend Cluster */}
          <Node
            x={650}
            y={150}
            icon={Cpu}
            label="Core Server"
            subLabel="Spring Boot"
            color="green"
            delay={0.6}
            onClick={() => onNodeClick?.("Core Server")}
          />
          <Node
            x={650}
            y={450}
            icon={Zap}
            label="AI Server"
            subLabel="FastAPI"
            color="purple"
            delay={0.6}
            onClick={() => onNodeClick?.("AI Server")}
          />

          {/* Data Stores */}
          <Node
            x={850}
            y={250}
            icon={Database}
            label="Database"
            subLabel="PostgreSQL"
            color="slate"
            delay={0.8}
            onClick={() => onNodeClick?.("Database")}
          />
          <Node
            x={850}
            y={150}
            icon={Activity}
            label="Cache"
            subLabel="Redis"
            color="red"
            delay={0.8}
            onClick={() => onNodeClick?.("Cache")}
          />

          {/* External Services */}
          <Node
            x={850}
            y={50}
            icon={Github}
            label="CI/CD"
            subLabel="GitHub Actions"
            color="gray"
            delay={0.8}
            onClick={() => onNodeClick?.("CI/CD")}
          />
          <Node
            x={850}
            y={350}
            icon={Building2}
            label="한국투자증권 API"
            subLabel="Korea Inv."
            color="blue"
            delay={0.8}
            onClick={() => onNodeClick?.("한국투자증권 API")}
          />
          <Node
            x={450}
            y={450}
            icon={Bell}
            label="FCM"
            subLabel="Push Notif."
            color="amber"
            delay={0.8}
            onClick={() => onNodeClick?.("FCM")}
          />
        </>
      ) : (
        <>
          <Node
            x={450}
            y={150}
            icon={Database}
            label="Zustand"
            subLabel="Client Store"
            color="blue"
            delay={0.4}
            onClick={() => onNodeClick?.("Zustand")}
          />
          <Node
            x={450}
            y={350}
            icon={Activity}
            label="React Query"
            subLabel="Server State"
            color="amber"
            delay={0.4}
            onClick={() => onNodeClick?.("React Query")}
          />
          <Node
            x={650}
            y={250}
            icon={Server}
            label="API"
            subLabel="Backend"
            color="gray"
            delay={0.6}
            onClick={() => onNodeClick?.("API")}
          />
        </>
      )}
      {/* Monitoring Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 right-8 flex gap-4"
      >
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <Shield size={16} className="text-violet-500" />
          <span className="text-xs font-semibold text-gray-600">
            Sentry Monitoring
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <Activity size={16} className="text-orange-500" />
          <span className="text-xs font-semibold text-gray-600">
            PostHog Analytics
          </span>
        </div>
      </motion.div>
    </div>
  );
};
