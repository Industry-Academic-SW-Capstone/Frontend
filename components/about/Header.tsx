"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, TrendingUp, Download, Github } from "lucide-react";
import { NAV_ITEMS } from "./constants";
import { Button } from "./ui/Button";
import { useInstallModal } from "./context/InstallModalContext";

export const Header: React.FC = () => {
  const { openInstallModal } = useInstallModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <span
              className={`text-2xl font-bold tracking-tight ${
                isScrolled || isMobileMenuOpen
                  ? "text-gray-900"
                  : "text-gray-900 md:text-white"
              }`}
            >
              StockIt!
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  isScrolled
                    ? "text-gray-600"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* CTA Button */}
            <div className="hidden md:block">
              <button
                // variant={isScrolled ? "primary" : "secondary"}
                // size="sm"
                onClick={() => {
                  window.open(
                    "https://github.com/Industry-Academic-SW-Capstone",
                    "_blank"
                  );
                }}
                className={`gap-2 ${
                  isScrolled
                    ? "text-gray-600"
                    : "text-white/90 hover:text-white"
                } w-8 h-8 rounded-full flex items-center justify-center bg-white`}
              >
                <Github size={16} color="black" />
              </button>
            </div>
            <div className="hidden md:block">
              <Button
                variant={isScrolled ? "primary" : "secondary"}
                size="sm"
                onClick={openInstallModal}
                className="gap-2"
              >
                <Download size={16} />앱 설치하기
              </Button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X />
            ) : (
              <Menu className={isScrolled ? "text-gray-900" : "text-white"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg md:hidden p-4 flex flex-col gap-4 animate-fade-in-up">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-gray-600 font-medium py-2 px-4 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <Button
            onClick={() => {
              openInstallModal();
              setIsMobileMenuOpen(false);
            }}
            className="w-full gap-2"
          >
            <Download size={16} /> 앱 설치 가이드
          </Button>
        </div>
      )}
    </header>
  );
};
