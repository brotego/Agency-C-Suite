"use client";

import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const lastScrollY = useRef(0);

  const sections = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 5) {
        // At the top, always show
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 2) {
        // Scrolling down - more sensitive
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 2) {
        // Scrolling up
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  return (
    <header
      className={`fixed top-0 left-0 z-50 p-6 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="text-xl font-bold text-white cursor-pointer inline-block">
          Agency-C-Suite
        </div>
        <div
          className={`absolute top-1/2 -translate-y-1/2 left-full ml-8 flex items-center gap-6 transition-all duration-300 ease-in-out whitespace-nowrap ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
          }`}
        >
          {sections.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="text-white hover:text-gray-300 transition-colors font-medium"
            >
              {section.name}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
