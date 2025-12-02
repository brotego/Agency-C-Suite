"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./SplashScreen.css";

gsap.registerPlugin(ScrollTrigger);

const SplashScreen = ({ onComplete }) => {
  const splashRef = useRef(null);
  const logoRef = useRef(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const splash = splashRef.current;
    const logo = logoRef.current;
    if (!splash || !logo) return;

    // Hide all page content initially
    const body = document.body;
    const html = document.documentElement;
    const topBar = document.querySelector(".top-bar");
    
    // Hide everything except splash
    gsap.set(body, { overflow: "hidden" });
    gsap.set(html, { overflow: "hidden" });
    
    // Hide TopBar
    if (topBar) {
      gsap.set(topBar, { opacity: 0, visibility: "hidden" });
    }
    
    // Hide all sections and content
    const allSections = document.querySelectorAll("section");
    allSections.forEach((section) => {
      gsap.set(section, { opacity: 0, visibility: "hidden" });
    });
    
    const footer = document.querySelector(".footer");
    if (footer) {
      gsap.set(footer, { opacity: 0, visibility: "hidden" });
    }

    // Set initial logo position to center
    gsap.set(logo, {
      x: 0,
      y: 0,
      scale: 1,
      transformOrigin: "center center",
    });

    // Wait for TopBar to be ready, then animate
    const checkAndAnimate = () => {
      const topBarLogo = document.querySelector(".top-bar-logo img");
      if (topBarLogo && topBar) {
        // Hide the TopBar logo initially and disable any transitions
        gsap.set(topBarLogo, { 
          opacity: 0,
          clearProps: "transition"
        });
        // Remove any CSS transitions that might cause fade
        topBarLogo.style.transition = "none";
        animateLogo(topBarLogo, logo, splash, topBar, body);
      } else {
        setTimeout(checkAndAnimate, 50);
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(checkAndAnimate, 200);
  }, [onComplete]);

  const animateLogo = (targetElement, logo, splash, topBar, body) => {
    // Get positions
    const targetRect = targetElement.getBoundingClientRect();
    const logoRect = logo.getBoundingClientRect();

    // Calculate the transform needed to move logo to its final position
    const deltaX = targetRect.left + targetRect.width / 2 - (logoRect.left + logoRect.width / 2);
    const deltaY = targetRect.top + targetRect.height / 2 - (logoRect.top + logoRect.height / 2);
    const scaleX = targetRect.width / logoRect.width;
    const scaleY = targetRect.height / logoRect.height;

    // Show all content - this will trigger text animations
    const showContent = () => {
      // Show TopBar
      gsap.set(topBar, { opacity: 1, visibility: "visible" });
      // Show all sections
      const allSections = document.querySelectorAll("section");
      allSections.forEach((section) => {
        gsap.set(section, { opacity: 1, visibility: "visible" });
      });
      // Show footer
      const footer = document.querySelector(".footer");
      if (footer) {
        gsap.set(footer, { opacity: 1, visibility: "visible" });
      }
      // Restore body overflow
      gsap.set(body, { overflow: "" });
      gsap.set(document.documentElement, { overflow: "" });
      
      // Refresh ScrollTrigger to ensure animations trigger now that content is visible
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    // Create timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Hide splash screen completely
        gsap.set(splash, { display: "none" });
        setIsComplete(true);
        onComplete?.();
      },
    });

    // Wait 1.5 seconds, then animate
    tl.to({}, { duration: 1.5 })
      .to(
        logo,
        {
          x: deltaX,
          y: deltaY,
          scaleX: scaleX,
          scaleY: scaleY,
          duration: 1.2,
          ease: "power3.inOut",
          onComplete: () => {
            // At the exact moment logo reaches position, do everything at once
            // Show content first to prevent blink
            showContent();
            // Show TopBar logo instantly - no transition
            targetElement.style.transition = "none";
            targetElement.style.opacity = "1";
            gsap.set(targetElement, { 
              opacity: 1,
              immediateRender: true,
              clearProps: "all"
            });
            // Hide splash logo and screen instantly - after content is shown
            gsap.set(logo, { opacity: 0, display: "none", visibility: "hidden" });
            gsap.set(splash, { display: "none", zIndex: -1, visibility: "hidden" });
          },
        }
      );
  };

  if (isComplete) return null;

  return (
    <div className="splash-screen" ref={splashRef}>
      <div className="splash-logo-container">
        <img ref={logoRef} src="/logo.JPEG" alt="Agency C-Suite" className="splash-logo" />
      </div>
    </div>
  );
};

export default SplashScreen;

