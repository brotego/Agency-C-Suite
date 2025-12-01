"use client";
import "./HowIWork.css";
import Copy from "../Copy/Copy";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HowIWork = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const bubblesRef = useRef(null);
  const descriptionRef = useRef(null);
  const titleRef = useRef(null);

  const workMethods = [
    {
      title: "Monthly Retainer",
      description: "Ongoing support for you and your team",
    },
    {
      title: "Project Fee",
      description: "Based on scope to address a specific challenge or initiative",
    },
    {
      title: "Daily/Hourly",
      description: "As needed for advice and coaching",
    },
    {
      title: "Referral",
      description: "Connect you with fractional experts in Finance, Legal, Recruiting, HR, New Business, Marketing, PR, Operations, IT",
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const bubbleElements = gsap.utils.toArray(".how-i-work-bubble");
    const description = descriptionRef.current;
    const totalBubbles = bubbleElements.length;
    const scrollDistance = totalBubbles * 200; // 200vh per bubble for slower, smoother fill

    // Pin the section
    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${scrollDistance}vh`,
      pin: section,
      pinSpacing: true,
    });

    // Update active index and animate bubbles based on scroll progress
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${scrollDistance}vh`,
      scrub: 2, // Smoother scrubbing with lag
      onUpdate: (self) => {
        const progress = self.progress;
        const newIndex = Math.min(
          Math.floor(progress * totalBubbles),
          totalBubbles - 1
        );
        setActiveIndex(newIndex);

        // Animate bubbles and blue fill
        bubbleElements.forEach((bubble, index) => {
          const isActive = index === newIndex;
          const circle = bubble.querySelector(".how-i-work-bubble-circle");
          
          // Calculate fill progress - each bubble gets exactly 1/totalBubbles of the scroll progress
          // Critical: Each bubble must reach 100% before the next can start
          const bubbleStart = index / totalBubbles;
          const bubbleEnd = (index + 1) / totalBubbles;
          
          let fillProgress = 0;
          
          // Strict sequential filling - each bubble must complete before next starts
          if (progress < bubbleStart) {
            // Haven't reached this bubble yet - stay at 0%
            fillProgress = 0;
          } else if (progress >= bubbleEnd) {
            // This bubble is completely filled - stay at 100%
            fillProgress = 1;
          } else {
            // We're in this bubble's range - calculate fill from 0% to 100%
            // This calculation ensures smooth progression within this bubble's range only
            const range = bubbleEnd - bubbleStart;
            const positionInRange = progress - bubbleStart;
            fillProgress = positionInRange / range;
            // Clamp to ensure we never exceed 1 or go below 0
            fillProgress = Math.max(0, Math.min(1, fillProgress));
          }
          
          // Ensure previous bubble is complete before this one can fill
          if (index > 0) {
            const previousBubbleEnd = index / totalBubbles;
            if (progress < previousBubbleEnd) {
              fillProgress = 0;
            }
          }
          
          // Use gsap.set for immediate, smooth updates
          if (circle) {
            gsap.set(circle, {
              width: `${fillProgress * 100}%`,
            });
          }
          
          // Animate bubble scale and border smoothly
          gsap.to(bubble, {
            scale: isActive ? 1.1 : 1,
            borderColor: isActive ? "var(--base-300)" : "var(--base-400)",
            duration: 0.5,
            ease: "power2.out",
          });
        });

        // Description is always visible, no animation needed
      },
    });

    // Position title and description relative to bubbles
    const positionTextElements = () => {
      if (!bubblesRef.current || !titleRef.current || !descriptionRef.current) return;
      
      const bubbles = bubblesRef.current;
      const firstBubble = bubbles.querySelector(".how-i-work-bubble:first-child");
      const lastBubble = bubbles.querySelector(".how-i-work-bubble:last-child");
      const content = sectionRef.current?.querySelector(".how-i-work-content");
      
      if (firstBubble && lastBubble && content) {
        // Get positions relative to the content container
        const contentRect = content.getBoundingClientRect();
        const firstBubbleRect = firstBubble.getBoundingClientRect();
        const lastBubbleRect = lastBubble.getBoundingClientRect();
        
        // Position title at left edge of first bubble (relative to content)
        const titleLeft = firstBubbleRect.left - contentRect.left;
        gsap.set(titleRef.current, {
          left: `${titleLeft}px`,
        });
        
        // Position description at right edge of last bubble (relative to content)
        const descriptionRight = contentRect.right - lastBubbleRect.right;
        gsap.set(descriptionRef.current, {
          right: `${descriptionRight}px`,
        });
      }
    };

    // Position on mount and resize
    positionTextElements();
    window.addEventListener("resize", positionTextElements);
    
    // Also position after a short delay to ensure bubbles are rendered
    const timeout = setTimeout(positionTextElements, 100);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      window.removeEventListener("resize", positionTextElements);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="how-i-work" ref={sectionRef}>
      <div className="how-i-work-content">
        <div className="how-i-work-header" ref={titleRef}>
          <h2 className="how-i-work-title-large">How I Work With Clients</h2>
          <p className="how-i-work-title">Every partnership looks different —<br />together we'll define the structure that drives the greatest impact.</p>
        </div>
        <div className="how-i-work-description" ref={descriptionRef}>
          <p>{workMethods[activeIndex].description}</p>
        </div>
        <div className="how-i-work-bubbles" ref={bubblesRef}>
          {workMethods.map((method, index) => (
            <div 
              key={index} 
              className={`how-i-work-bubble ${index === activeIndex ? "active" : ""}`}
            >
              <span className="how-i-work-bubble-circle"></span>
              <Copy delay={0.1 + index * 0.05}>
                <h3>{method.title}</h3>
              </Copy>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowIWork;

