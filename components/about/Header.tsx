"use client";

import React, { useState, useEffect, useEffectEvent } from "react";
import { Menu, X, TrendingUp, Download, Github } from "lucide-react";
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
    // If it's a hash link
    if (
      href.startsWith("#") ||
      (href.startsWith("/about#") && nowDirectory == "/about")
    ) {
      e.preventDefault();
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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen || nowDirectory !== "/about"
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            className="flex items-center gap-2 cursor-pointer"
            onClick={(e) => {
              handleNavClick(e, "/about#home");
            }}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <span
              className={`text-2xl font-bold tracking-tight ${
                isScrolled || nowDirectory !== "/about"
                  ? "text-gray-900"
                  : "text-white"
              }`}
            >
              StockIt!
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  isScrolled || nowDirectory !== "/about"
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
              <Button
                variant={
                  isScrolled || nowDirectory !== "/about"
                    ? "primary"
                    : "secondary"
                }
                size="sm"
                onClick={() => {
                  window.open(
                    "https://github.com/Industry-Academic-SW-Capstone",
                    "_blank"
                  );
                }}
                className={`gap-2`}
              >
                <Github size={16} /> Github
              </Button>
            </div>
            <div className="hidden md:block">
              <Button
                variant={
                  isScrolled || nowDirectory !== "/about"
                    ? "primary"
                    : "secondary"
                }
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
            aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {isMobileMenuOpen ? (
              <X />
            ) : (
              <Menu
                className={
                  isScrolled || nowDirectory !== "/about"
                    ? "text-gray-900"
                    : "text-white"
                }
              />
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
              onClick={(e) => handleNavClick(e, item.href)}
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
