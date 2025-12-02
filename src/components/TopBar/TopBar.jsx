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
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const menuLinks = [
    { label: "What is ACS?", route: "#what-we-do" },
    { label: "Where We Can Help", route: "#featured-projects" },
    { label: "How We Work", route: "#how-i-work" },
    { label: "From Our Friends", route: "#client-reviews" },
    { label: "About Jordan", route: "#about-me" },
    { label: "Tips for Founders", route: "#tips-for-founders" },
    { label: "Get in Touch", route: "#footer" },
  ];

  useEffect(() => {
    const topBar = topBarRef.current;
    if (!topBar) return;

    gsap.set(topBar, { y: 0 });

    let scrollTimeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY || 0;
      
      // Clear any pending timeout
      clearTimeout(scrollTimeout);
      
      // Use a minimal debounce to prevent rapid state changes
      scrollTimeout = setTimeout(() => {
        // Only expand when scrolled completely to the top (exactly 0)
        if (currentScrollY === 0) {
          setIsMenuExpanded(true);
          setIsMenuOpen(false); // Close click menu when at top
        } else {
          // Collapse for any scroll position beyond 0
          setIsMenuExpanded(false);
        }
      }, 10);
    };

    // Check initial scroll position
    const initialScrollY = window.scrollY || 0;
    if (initialScrollY === 0) {
      setIsMenuExpanded(true);
      setIsMenuOpen(false);
    } else {
      setIsMenuExpanded(false);
      setIsMenuOpen(false);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    if (topBarRef.current) {
      gsap.set(topBarRef.current, { y: 0 });
    }
  });

  // Auto-expand blue circle and show menu on initial load (only if at top of page)
  useEffect(() => {
    if (!menuButtonRef.current || !menuLinksRef.current) return;

    // Check if page is at the top
    const initialScrollY = window.scrollY || 0;
    if (initialScrollY > 1) {
      // Not at top, don't animate - just set initial state
      const button = menuButtonRef.current.querySelector(".btn");
      const circle = button?.querySelector(".circle");
      const links = Array.from(menuLinksRef.current.querySelectorAll(".menu-hover-link"));
      
      if (circle) {
        gsap.set(circle, { width: "3rem" });
      }
      gsap.set(links, { x: 20, opacity: 0 });
      setIsMenuExpanded(false);
      return;
    }

    const button = menuButtonRef.current.querySelector(".btn");
    const circle = button?.querySelector(".circle");
    const links = Array.from(menuLinksRef.current.querySelectorAll(".menu-hover-link"));

    if (!circle || !button) return;

    // Wait for button to be fully rendered
    const initAnimation = () => {
      // Set initial state - circle at small width, links hidden
      gsap.set(circle, { width: "3rem" });
      gsap.set(links, { x: 20, opacity: 0 });

      // Animate blue circle expanding across the button using 100% to stay within button bounds
      const timeline = gsap.timeline({
        delay: 0.1, // Minimal delay after page load
        onComplete: () => {
          // After circle expands, show menu links with stagger
          gsap.to(links, {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: {
              amount: 0.3,
              from: "end",
            },
            ease: "power3.out",
          });
          setHasAnimated(true);
        },
      });

      timeline.to(circle, {
        width: "100%",
        duration: 0.5,
        ease: "power3.out",
        immediateRender: true,
      });
    };

    // Small delay to ensure DOM is ready
    setTimeout(initAnimation, 50);
  }, []);

  useEffect(() => {
    if (!menuLinksRef.current || !menuButtonRef.current) return;

    const links = Array.from(menuLinksRef.current.querySelectorAll(".menu-hover-link"));
    const button = menuButtonRef.current.querySelector(".btn");
    const circle = button?.querySelector(".circle");
    
    // Only manage menu visibility when scrolling, not on initial load
    // Initial load animation is handled by the auto-expand effect
    if (!isMenuExpanded) {
      // Hide links when menu is collapsed
      gsap.to(links, {
        x: 20,
        opacity: 0,
        duration: 0.3,
        stagger: 0.03,
        ease: "power2.in",
      });
      // Reset circle width when collapsed - use clearProps to let CSS hover work
      if (circle) {
        gsap.to(circle, {
          width: "3rem",
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            // Clear inline styles to allow CSS hover to work
            gsap.set(circle, { clearProps: "width" });
          },
        });
      }
    } else if (hasAnimated && isMenuExpanded) {
      // When expanding again after initial animation (at top of page), expand circle and show links
      if (circle) {
        gsap.to(circle, {
          width: "100%",
          duration: 0.5,
          ease: "power3.out",
          immediateRender: true,
        });
      }
      gsap.to(links, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: {
          amount: 0.2,
          from: "end",
        },
        ease: "power3.out",
      });
      setIsMenuOpen(false); // Ensure click menu is closed when auto-expanded
    }
  }, [isMenuExpanded, hasAnimated]);

  // Hover effect: expand blue circle (but don't open menu)
  useEffect(() => {
    if (!menuButtonRef.current) return;

    const button = menuButtonRef.current.querySelector(".btn");
    const circle = button?.querySelector(".circle");
    const icon = button?.querySelector(".icon");
    
    if (isHovered && !isMenuExpanded) {
      // Expand circle on hover (icon stays centered via CSS positioning)
      if (circle) {
        gsap.to(circle, {
          width: "100%",
          duration: 0.5,
          ease: "power3.out",
          immediateRender: true,
        });
      }
    } else if (!isHovered && !isMenuExpanded && !isMenuOpen) {
      // Reset circle when not hovered and menu not open
      if (circle) {
        gsap.to(circle, {
          width: "3rem",
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }
  }, [isHovered, isMenuExpanded, isMenuOpen]);

  // Click effect: open/close menu
  useEffect(() => {
    if (!menuLinksRef.current || !menuButtonRef.current) return;

    const links = Array.from(menuLinksRef.current.querySelectorAll(".menu-hover-link"));
    
    if (isMenuOpen && !isMenuExpanded) {
      // Show links when menu is opened via click
      gsap.set(links, { x: 20, opacity: 0 });
      gsap.to(links, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: {
          amount: 0.3,
          from: "end",
        },
        ease: "power3.out",
      });
    } else if (!isMenuOpen && !isMenuExpanded) {
      // Hide links when menu is closed
      gsap.to(links, {
        x: 20,
        opacity: 0,
        duration: 0.3,
        stagger: 0.03,
        ease: "power2.in",
      });
    }
  }, [isMenuOpen, isMenuExpanded]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        !isMenuExpanded &&
        menuButtonRef.current &&
        menuLinksRef.current &&
        !menuButtonRef.current.contains(event.target) &&
        !menuLinksRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen && !isMenuExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isMenuExpanded]);

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
          <AnimatedButton 
            label="Menu" 
            route={null} 
            animate={false}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isMenuExpanded) {
                setIsMenuOpen(!isMenuOpen);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
