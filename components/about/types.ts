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