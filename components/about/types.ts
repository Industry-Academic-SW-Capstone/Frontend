import { LucideIcon } from "lucide-react";

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
  github?: string;
  linkedIn?: string;
  email?: string;
}

export interface StockData {
  name: string;
  price: number;
  change: number;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface TechStackItem {
  name: string;
  description: string;
  icon: LucideIcon;
  category:
    | "Frontend"
    | "Backend"
    | "Infrastructure"
    | "DevOps"
    | "Analytics"
    | "Security"
    | "Other";
  reason?: string;
  usage?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  type: "NOTICE" | "EVENT" | "MAINTENANCE";
}

export interface SystemArchitectureItem {
  name: string;
  description: string;
  icon: LucideIcon;
  connections?: string[];
}

export interface DevEnvironmentItem {
  tool: string;
  purpose: string;
  icon: LucideIcon;
  category: "IDE" | "Version Control" | "Deployment" | "Communication";
}

export interface ServerLogicItem {
  title: string;
  description: string;
  steps: string[];
  icon: LucideIcon;
}
