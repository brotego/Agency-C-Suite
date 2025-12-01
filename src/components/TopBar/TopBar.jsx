"use client";
import "./TopBar.css";

import { useRef, useEffect, useState } from "react";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import { useViewTransition } from "@/hooks/useViewTransition";
import AnimatedButton from "../AnimatedButton/AnimatedButton";

gsap.registerPlugin(ScrollTrigger);

const TopBar = () => {
  const topBarRef = useRef(null);
  const menuButtonRef = useRef(null);
  const menuLinksRef = useRef(null);
  const { navigateWithTransition } = useViewTransition();
  const [isHovered, setIsHovered] = useState(false);
  let lastScrollY = 0;
  let isScrolling = false;

  const menuLinks = [
    { label: "Hero", route: "#hero" },
    { label: "What We Do", route: "#what-we-do" },
    { label: "Featured Projects", route: "#featured-projects" },
    { label: "Client Reviews", route: "#client-reviews" },
    { label: "How I Work", route: "#how-i-work" },
    { label: "About Me", route: "#about-me" },
  ];

  useEffect(() => {
    const topBar = topBarRef.current;
    if (!topBar) return;

    const topBarHeight = topBar.offsetHeight;

    gsap.set(topBar, { y: 0 });

    const handleScroll = () => {
      if (isScrolling) return;

      isScrolling = true;
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? 1 : -1;

      if (direction === 1 && currentScrollY > 50) {
        gsap.to(topBar, {
          y: -topBarHeight,
          duration: 1,
          ease: "power4.out",
        });
      } else if (direction === -1) {
        gsap.to(topBar, {
          y: 0,
          duration: 1,
          ease: "power4.out",
        });
      }

      lastScrollY = currentScrollY;

      setTimeout(() => {
        isScrolling = false;
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (topBarRef.current) {
      gsap.set(topBarRef.current, { y: 0 });
    }
  });

  useEffect(() => {
    if (!menuLinksRef.current || !menuButtonRef.current) return;

    const links = Array.from(menuLinksRef.current.querySelectorAll(".menu-hover-link"));
    const button = menuButtonRef.current.querySelector(".btn");
    const circle = button?.querySelector(".circle");
    
    if (isHovered) {
      // Wait for the blue circle to fully expand (0.5s CSS transition) before showing links
      // The circle expands via CSS :hover, so we wait for the transition duration
      setTimeout(() => {
        // Show links with stagger animation from right to left after circle is done
        gsap.set(links, { x: 20, opacity: 0 });
        gsap.to(links, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: {
            amount: 0.3,
            from: "start", // Start from the start (leftmost link)
          },
          ease: "power3.out",
        });
      }, 500); // Wait for circle transition (0.5s)
    } else {
      // Hide links immediately
      gsap.to(links, {
        x: 20,
        opacity: 0,
        duration: 0.3,
        stagger: 0.03,
        ease: "power2.in",
      });
    }
  }, [isHovered]);

  return (
    <div className="top-bar" ref={topBarRef}>
      <div className="top-bar-logo">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigateWithTransition("/");
          }}
        >
          <img src="/logo.JPEG" alt="Agency C-Suite" />
        </a>
      </div>
      <div 
        className="top-bar-cta"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="menu-hover-links" ref={menuLinksRef}>
          {menuLinks.map((link, index) => (
            <a
              key={index}
              href={link.route}
              className="menu-hover-link"
              onClick={(e) => {
                e.preventDefault();
                if (link.route.startsWith("#")) {
                  // Smooth scroll to section
                  const element = document.querySelector(link.route);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                } else {
                  navigateWithTransition(link.route);
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div ref={menuButtonRef}>
          <AnimatedButton label="Menu" route="/connect" animate={false} />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
