"use client";
import "./TopBar.css";

import { useRef, useEffect, useState, useLayoutEffect, useCallback } from "react";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { useLenis } from "lenis/react";

import { useViewTransition } from "@/hooks/useViewTransition";
import AnimatedButton from "../AnimatedButton/AnimatedButton";
import { IoMdClose } from "react-icons/io";

gsap.registerPlugin(ScrollTrigger, SplitText);

const TopBar = () => {
  const topBarRef = useRef(null);
  const menuButtonRef = useRef(null);
  const menuLinksRef = useRef(null);
  const logoRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { navigateWithTransition } = useViewTransition();
  const lenis = useLenis();
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobileOverlayOpen, setIsMobileOverlayOpen] = useState(false);
  const [isAnimatingOverlay, setIsAnimatingOverlay] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isInitializedRef = useRef(false);
  const isMobileOverlayInitializedRef = useRef(false);
  const splitTextRefs = useRef([]);

  const menuLinks = [
    { label: "What is ACS?", route: "#what-we-do" },
    { label: "Where We Can Help", route: "#featured-projects" },
    { label: "How We Work", route: "#how-i-work" },
    { label: "From Our Friends", route: "#client-reviews" },
    { label: "About", route: "#about-me" },
    { label: "Get in Touch", route: "#footer" },
  ];

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Stop/start lenis when mobile overlay is open
  useEffect(() => {
    if (lenis && isMobile) {
      if (isMobileOverlayOpen) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [lenis, isMobileOverlayOpen, isMobile]);

  // Initialize mobile overlay animation
  useLayoutEffect(() => {
    if (!isMobile) {
      isInitializedRef.current = false;
      return;
    }

    // Small delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      if (!mobileMenuRef.current) return;

      const menu = mobileMenuRef.current;

      splitTextRefs.current.forEach((split) => {
        if (split?.revert) split.revert();
      });
      splitTextRefs.current = [];

      gsap.set(menu, {
        clipPath: "circle(0% at 50% 50%)",
      });

      const h2Elements = menu.querySelectorAll("h2");

      h2Elements.forEach((h2) => {
        const split = SplitText.create(h2, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
        });

        gsap.set(split.lines, { y: "120%" });

        split.lines.forEach((line) => {
          line.style.pointerEvents = "auto";
        });

        splitTextRefs.current.push(split);
      });

      isMobileOverlayInitializedRef.current = true;
    }, 100);

    return () => {
      clearTimeout(initTimer);
    };
  }, [isMobile]);

  // Animate mobile overlay
  const animateMobileOverlay = useCallback((open) => {
    if (!mobileMenuRef.current || !isMobile) return;

    const menu = mobileMenuRef.current;
    const closeButton = menu.querySelector(".top-bar-mobile-overlay-close");
    setIsAnimatingOverlay(true);

    if (open) {
      document.body.classList.add("menu-open");

      menu.style.pointerEvents = "all";
      
      // Ensure close button is immediately clickable
      const closeBtn = menu.querySelector(".top-bar-mobile-overlay-close");
      if (closeBtn) {
        closeBtn.style.pointerEvents = "auto";
      }

      gsap.to(menu, {
        clipPath: "circle(100% at 50% 50%)",
        ease: "power3.out",
        duration: 2,
        onStart: () => {
          splitTextRefs.current.forEach((split, index) => {
            gsap.to(split.lines, {
              y: "0%",
              stagger: 0.05,
              delay: 0.35 + index * 0.1,
              duration: 1,
              ease: "power4.out",
            });
          });
          
          // Animate close button appearing and ensure it's clickable
          if (closeButton) {
            closeButton.style.pointerEvents = "auto";
            gsap.to(closeButton, {
              opacity: 1,
              scale: 1,
              delay: 0.5,
              duration: 0.5,
              ease: "power3.out",
              onComplete: () => {
                closeButton.style.pointerEvents = "auto";
              }
            });
          }
        },
        onComplete: () => {
          setIsAnimatingOverlay(false);
          // Ensure close button is always clickable after animation
          const closeBtn = menu.querySelector(".top-bar-mobile-overlay-close");
          if (closeBtn) {
            closeBtn.style.pointerEvents = "auto";
          }
        },
      });
    } else {
      const closeButton = menu.querySelector(".top-bar-mobile-overlay-close");
      
      // Hide close button first
      if (closeButton) {
        gsap.to(closeButton, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: "power2.in",
        });
      }

      const textTimeline = gsap.timeline({
        onStart: () => {
          gsap.to(menu, {
            clipPath: "circle(0% at 50% 50%)",
            ease: "power3.out",
            duration: 1,
            delay: 0.75,
            onComplete: () => {
              menu.style.pointerEvents = "none";

              splitTextRefs.current.forEach((split) => {
                gsap.set(split.lines, { y: "120%" });
              });

              document.body.classList.remove("menu-open");
              setIsAnimatingOverlay(false);
            },
          });
        },
      });

      splitTextRefs.current.forEach((split, index) => {
        textTimeline.to(
          split.lines,
          {
            y: "-120%",
            stagger: 0.03,
            delay: index * 0.05,
            duration: 1,
            ease: "power3.out",
          },
          0
        );
      });
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobileOverlayInitializedRef.current && isMobile) {
      animateMobileOverlay(isMobileOverlayOpen);
    }
  }, [isMobileOverlayOpen, animateMobileOverlay, isMobile]);

  useEffect(() => {
    const topBar = topBarRef.current;
    const logo = logoRef.current;
    const button = menuButtonRef.current?.querySelector(".btn");
    const buttonText = button?.querySelector(".button-text");
    
    if (!topBar) return;

    gsap.set(topBar, { y: 0 });

    let lastScrollY = window.scrollY || 0;
    let scrollDirection = 0; // 0 = no change, 1 = down, -1 = up

    const handleScroll = () => {
      const currentScrollY = window.scrollY || 0;
      const scrollIcon = button?.querySelector(".icon");
      const scrollCircle = button?.querySelector(".circle");
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY) {
        scrollDirection = 1; // Scrolling down
      } else if (currentScrollY < lastScrollY) {
        scrollDirection = -1; // Scrolling up
      }
      lastScrollY = currentScrollY;
      
      // Show logo when scrolling up (but not when at top, handled separately)
      if (scrollDirection === -1 && currentScrollY > 0) {
        // Show logo when scrolling up
        if (logo) {
          gsap.to(logo, {
            y: 0,
            duration: 0.6,
            ease: "power4.out",
          });
        }
      }
      
      // Expand button and show logo only when at top
      if (currentScrollY <= 1) { // Use <= 1 to catch cases where it might be slightly above 0 due to browser rounding
        // Check if button is already expanded by checking its current width
        const currentButtonWidth = button ? parseFloat(window.getComputedStyle(button).width) : 0;
        const isButtonExpanded = currentButtonWidth > 50; // Button is expanded if wider than 50px
        
        if (!isButtonExpanded) {
          const isMobile = window.innerWidth <= 768;
          const buttonDuration = isMobile ? 0.3 : 0.15; // Faster on desktop
          const buttonEase = isMobile ? "power2.out" : "power3.out";
          
          setIsMenuExpanded(true);
          setIsMenuOpen(false); // Close click menu when at top
          
          // Show logo at top
          if (logo) {
            gsap.to(logo, {
              y: 0,
              duration: 0.6,
              ease: "power4.out",
            });
          }
          if (button) {
            gsap.to(button, {
              width: "10rem",
              height: "auto",
              padding: "0.15rem",
              duration: buttonDuration,
              ease: buttonEase,
            });
          }
          if (scrollCircle) {
            gsap.to(scrollCircle, {
              width: "100%",
              height: "3rem",
              duration: buttonDuration,
              ease: buttonEase,
              onComplete: () => {
                // Clear inline width to allow CSS hover to work
                gsap.set(scrollCircle, { clearProps: "width" });
              },
            });
          }
          if (scrollIcon) {
            gsap.to(scrollIcon, {
              left: "0.95rem",
              x: 0,
              duration: buttonDuration,
              ease: buttonEase,
            });
          }
          if (buttonText) {
            gsap.to(buttonText, {
              opacity: 1,
              duration: buttonDuration,
              ease: buttonEase,
            });
          }
        }
      } else if (scrollDirection === 1 && currentScrollY > 0) {
        // Hide logo when scrolling down (and not at top)
        if (currentScrollY > 50) { // Only hide after scrolling down a bit
          setIsMenuExpanded(false);
          
          const isMobile = window.innerWidth <= 768;
          const buttonDuration = isMobile ? 0.3 : 0.15; // Faster on desktop
          const buttonEase = isMobile ? "power2.in" : "power3.out";
          
          // Hide logo - scroll up like text animation
          if (logo) {
            gsap.to(logo, {
              y: "-150%",
              duration: 0.6,
              ease: "power4.out",
            });
          }
          if (button) {
            gsap.to(button, {
              width: "3rem",
              height: "3rem",
              padding: "0",
              duration: buttonDuration,
              ease: buttonEase,
            });
          }
          if (scrollCircle) {
            gsap.to(scrollCircle, {
              width: "3rem",
              height: "3rem",
              duration: buttonDuration,
              ease: buttonEase,
              onComplete: () => {
                // Clear inline width to allow CSS hover to work
                gsap.set(scrollCircle, { clearProps: "width" });
              },
            });
          }
          if (scrollIcon) {
            // Center the icon when button is shrunk (3rem button - icon width/2)
            gsap.to(scrollIcon, {
              left: "50%",
              x: "-50%",
              duration: buttonDuration,
              ease: buttonEase,
            });
          }
          if (buttonText) {
            gsap.to(buttonText, {
              opacity: 0,
              duration: buttonDuration,
              ease: buttonEase,
            });
          }
        }
      }
    };

    // Check initial scroll position
    const initialScrollY = window.scrollY || 0;
    const initIcon = button?.querySelector(".icon");
    const initCircle = button?.querySelector(".circle");
    const isMobile = window.innerWidth <= 768;
    
    // Always ensure button is visible on mobile
    if (isMobile && button) {
      gsap.set(button, { scale: 1, opacity: 1, visibility: "visible" });
    }
    if (isMobile && initCircle) {
      gsap.set(initCircle, { scale: 1, opacity: 1, visibility: "visible" });
    }
    if (isMobile && initIcon) {
      gsap.set(initIcon, { opacity: 1, visibility: "visible" });
    }
    
    if (initialScrollY === 0) {
      setIsMenuExpanded(true);
      setIsMenuOpen(false);
      // Set initial state for logo and button
      if (logo) {
        gsap.set(logo, { y: 0 });
      }
      if (button) {
        gsap.set(button, { width: "10rem", height: "auto", padding: "0.15rem" });
      }
      if (initCircle) {
        gsap.set(initCircle, { width: "100%", height: "3rem" });
        // Clear inline width after a brief delay to allow CSS hover
        setTimeout(() => {
          gsap.set(initCircle, { clearProps: "width" });
        }, 350);
      }
      if (initIcon) {
        gsap.set(initIcon, { left: "0.95rem", x: 0 });
      }
      if (buttonText) {
        gsap.set(buttonText, { opacity: 1 });
      }
    } else {
      setIsMenuExpanded(false);
      setIsMenuOpen(false);
      // Set initial state for logo and button (hidden/shrunk)
      if (logo) {
        gsap.set(logo, { y: "-150%" });
      }
      if (button) {
        const buttonWidth = isMobile ? "3rem" : "3rem";
        gsap.set(button, { width: buttonWidth, height: "3rem", padding: "0" });
      }
      if (initCircle) {
        gsap.set(initCircle, { width: "3rem", height: "3rem" });
        // Clear inline width after a brief delay to allow CSS hover
        setTimeout(() => {
          gsap.set(initCircle, { clearProps: "width" });
        }, 350);
      }
      if (initIcon) {
        gsap.set(initIcon, { left: "50%", x: "-50%" });
      }
      if (buttonText) {
        gsap.set(buttonText, { opacity: 0 });
      }
    }

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

  // Ensure button is always visible on mobile
  useEffect(() => {
    const checkMobileAndEnsureVisible = () => {
      const isMobile = window.innerWidth <= 768;
      if (!isMobile) return;

      const button = menuButtonRef.current?.querySelector(".btn");
      const circle = button?.querySelector(".circle");
      const icon = button?.querySelector(".icon");

      if (button) {
        gsap.set(button, { 
          scale: 1, 
          opacity: 1, 
          visibility: "visible",
          display: "inline-block"
        });
      }
      if (circle) {
        gsap.set(circle, { 
          scale: 1, 
          opacity: 1, 
          visibility: "visible",
          width: "3rem",
          height: "3rem"
        });
      }
      if (icon) {
        gsap.set(icon, { 
          opacity: 1, 
          visibility: "visible",
          display: "block"
        });
      }
    };

    // Check on mount and resize
    checkMobileAndEnsureVisible();
    window.addEventListener("resize", checkMobileAndEnsureVisible);

    // Also check after a short delay to override any animations
    const timeout = setTimeout(checkMobileAndEnsureVisible, 100);

    return () => {
      window.removeEventListener("resize", checkMobileAndEnsureVisible);
      clearTimeout(timeout);
    };
  }, []);

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
    // Don't hide links if menu is open via click
    if (!isMenuExpanded && !isMenuOpen) {
      // Kill any ongoing animations on links
      links.forEach(link => {
        gsap.killTweensOf(link);
      });
      
      // Immediately set pointer-events to none and hide links to prevent glitches
      links.forEach(link => {
        gsap.set(link, { pointerEvents: "none", visibility: "hidden" });
      });
      
      // Hide links when menu is collapsed
      gsap.to(links, {
        x: 20,
        opacity: 0,
        duration: 0.15,
        stagger: 0.01,
        ease: "power2.in",
        immediateRender: true,
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
      // Kill any ongoing animations on links
      links.forEach(link => {
        gsap.killTweensOf(link);
      });
      
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
        visibility: "visible",
        pointerEvents: "auto",
        duration: 0.5,
        stagger: {
          amount: 0.2,
          from: "end",
        },
        ease: "power3.out",
      });
      setIsMenuOpen(false); // Ensure click menu is closed when auto-expanded
    }
  }, [isMenuExpanded, hasAnimated, isMenuOpen]);

  // Hover effect: expand blue circle (but don't open menu)
  useEffect(() => {
    if (!menuButtonRef.current) return;

    const button = menuButtonRef.current.querySelector(".btn");
    const circle = button?.querySelector(".circle");
    const icon = button?.querySelector(".icon");
    
    if (isHovered && !isMenuExpanded) {
      // Expand circle on hover - when collapsed, expand to fill the 3rem button
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
          onComplete: () => {
            // Clear inline width to allow CSS hover to work
            gsap.set(circle, { clearProps: "width" });
          },
        });
      }
    }
  }, [isHovered, isMenuExpanded, isMenuOpen]);

  // Click effect: open/close menu
  useEffect(() => {
    if (!menuLinksRef.current || !menuButtonRef.current) return;

    const links = Array.from(menuLinksRef.current.querySelectorAll(".menu-hover-link"));
    
    if (isMenuOpen && !isMenuExpanded) {
      // Kill any ongoing animations on links
      links.forEach(link => {
        gsap.killTweensOf(link);
      });
      
      // Show links when menu is opened via click
      gsap.set(links, { x: 20, opacity: 0, pointerEvents: "auto", visibility: "visible" });
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
      // Kill any ongoing animations on links
      links.forEach(link => {
        gsap.killTweensOf(link);
      });
      
      // Immediately hide links when menu is closed to prevent glitches
      links.forEach(link => {
        gsap.set(link, { pointerEvents: "none", visibility: "hidden" });
      });
      
      // Hide links when menu is closed
      gsap.to(links, {
        x: 20,
        opacity: 0,
        duration: 0.15,
        stagger: 0.01,
        ease: "power2.in",
        immediateRender: true,
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
      <div className="top-bar-logo" ref={logoRef}>
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
        <div 
          className={`menu-hover-links ${isMenuOpen && !isMenuExpanded ? 'mobile-visible' : ''}`}
          ref={menuLinksRef}
        >
          {menuLinks.map((link, index) => (
            <a
              key={index}
              href={link.route}
              className="menu-hover-link"
              onClick={(e) => {
                e.preventDefault();
                
                // Close mobile overlay if open
                if (isMobile && isMobileOverlayOpen) {
                  setIsMobileOverlayOpen(false);
                }
                
                // Close desktop dropdown if open
                if (!isMenuExpanded) {
                  setIsMenuOpen(false);
                }
                
                if (link.route.startsWith("#")) {
                  // Smooth scroll to section
                  const element = document.querySelector(link.route);
                  if (element) {
                    // Small delay to allow overlay to start closing
                    setTimeout(() => {
                      element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, isMobile ? 100 : 0);
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
              
              // On mobile, open overlay instead of dropdown
              if (isMobile) {
                if (!isAnimatingOverlay && isMobileOverlayInitializedRef.current) {
                  setIsMobileOverlayOpen(!isMobileOverlayOpen);
                }
              } else {
                // Desktop behavior
                if (!isMenuExpanded) {
                  setIsMenuOpen(!isMenuOpen);
                }
              }
            }}
          />
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {isMobile && (
        <div className="top-bar-mobile-overlay" ref={mobileMenuRef}>
          <button
            className="top-bar-mobile-overlay-close"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMobileOverlayOpen(false);
            }}
            aria-label="Close menu"
            type="button"
            style={{ pointerEvents: 'auto', zIndex: 1001 }}
          >
            <IoMdClose />
          </button>
          <div className="top-bar-mobile-overlay-wrapper">
            <div className="top-bar-mobile-overlay-content">
              <div className="top-bar-mobile-links">
                {menuLinks.map((link, index) => (
                  <div key={index} className="top-bar-mobile-link">
                    <a
                      href={link.route}
                      onClick={(e) => {
                        e.preventDefault();
                        if (isMobileOverlayOpen) {
                          setIsMobileOverlayOpen(false);
                        }
                        if (link.route.startsWith("#")) {
                          setTimeout(() => {
                            const element = document.querySelector(link.route);
                            if (element) {
                              element.scrollIntoView({ behavior: "smooth", block: "start" });
                            }
                          }, 100);
                        } else {
                          navigateWithTransition(link.route);
                        }
                      }}
                    >
                      <h2>{link.label}</h2>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;
