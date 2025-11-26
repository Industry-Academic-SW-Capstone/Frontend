"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Download, Github } from "lucide-react";
import { NAV_ITEMS } from "./constants";
import { Button } from "./ui/Button";
import { useInstallModal } from "./context/InstallModalContext";
import { useLenis } from "./ui/SmoothScroll";
import { usePathname, useRouter } from "next/navigation";

export const Header: React.FC = () => {
  const router = useRouter();
  const { openInstallModal } = useInstallModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lenis = useLenis();

  const pathname = usePathname();
  const [nowDirectory, setNowDirectory] = useState(pathname);
  useEffect(() => {
    if (window.location.hash === "#install") {
      openInstallModal();
    }
  }, []);
  useEffect(() => {
    setNowDirectory(pathname);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    // If it's a hash link
    if (
      href.startsWith("#") ||
      (href.startsWith("/about#") && nowDirectory == "/about")
    ) {
      const targetId = href.includes("#")
        ? href.split("#")[1]
        : href.substring(1);
      if (lenis) {
        lenis.scrollTo(`#${targetId}`);
      } else {
        const element = document.getElementById(targetId);
        element?.scrollIntoView({ behavior: "smooth" });
      }
      setIsMobileMenuOpen(false);
    } else {
      router.push(href);
    }
    // If it's a normal link, let it navigate (do nothing here)
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b ${
        isScrolled || isMobileMenuOpen || nowDirectory !== "/about"
          ? "bg-white/80 backdrop-blur-xl border-gray-200/50 py-3 shadow-sm"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="/about#home"
            className="flex items-center gap-3 cursor-pointer group"
            onClick={(e) => {
              handleNavClick(e, "/about#home");
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105 duration-300">
              <img
                src="/icon-192.png"
                alt="StockIt Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className={`text-2xl font-extrabold tracking-tight transition-colors duration-300 ${
                isScrolled || nowDirectory !== "/about"
                  ? "text-slate-900"
                  : "text-white"
              }`}
            >
              스톡잇!
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isScrolled || nowDirectory !== "/about"
                    ? "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* CTA Button */}
            <div className="hidden lg:block">
              <Button
                variant={
                  isScrolled || nowDirectory !== "/about" ? "outline" : "ghost"
                }
                size="sm"
                onClick={() => {
                  window.open(
                    "https://github.com/Industry-Academic-SW-Capstone",
                    "_blank"
                  );
                }}
                className={`gap-2 ${
                  !isScrolled && nowDirectory === "/about"
                    ? "text-white hover:bg-white/10 border-white/20"
                    : ""
                }`}
              >
                <Github size={18} /> Github
              </Button>
            </div>
            <div className="hidden md:block">
              <Button
                variant="primary"
                size="sm"
                onClick={openInstallModal}
                className="gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
              >
                <Download size={18} />앱 설치하기
              </Button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled || nowDirectory !== "/about"
                ? "text-slate-900 hover:bg-slate-100"
                : "text-white hover:bg-white/10"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 shadow-xl md:hidden p-6 flex flex-col gap-4 animate-fade-in-up">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-slate-600 font-bold text-lg py-3 px-4 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}
          <div className="h-px bg-gray-100 my-2"></div>
          <Button
            onClick={() => {
              openInstallModal();
              setIsMobileMenuOpen(false);
            }}
            className="w-full gap-2 py-4 text-lg font-bold shadow-lg shadow-blue-500/20"
          >
            <Download size={20} /> 앱 설치 가이드
          </Button>
        </div>
      )}
    </header>
  );
};
