"use client";
import "./FeaturedProjects.css";
import featuredProjectsContent from "./featured-projects-content";

import { useEffect, useRef } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Circle, 
  Users, 
  FileText, 
  DollarSign, 
  Settings, 
  Calculator, 
  Network, 
  Target, 
  Rocket, 
  Briefcase, 
  Handshake,
  FileSearch,
  Heart,
  Megaphone,
  Cog,
  UserCheck,
  Building2,
  PenTool,
  Scale,
  TrendingUp,
  Radio
} from "lucide-react";

// Map service names to appropriate icons
const getServiceIcon = (serviceName) => {
  const iconMap = {
    "Partner Alignment": Users,
    "Formation": FileText,
    "Fundraising": DollarSign,
    "Operations Set-up": Settings,
    "Financial Planning": Calculator,
    "Organization Planning": Network,
    "Positioning": Target,
    "Go-to-Market": Rocket,
    "New Business": Briefcase,
    "Client Management": Handshake,
    "Financial": DollarSign,
    "Business Review": FileSearch,
    "Client Relationships": Heart,
    "Marketing & PR": Megaphone,
    "Operations": Cog,
    "HR": UserCheck,
    "M&A Planning": Building2,
    "Proposal Development": PenTool,
    "Legal": Scale,
    "Growth Planning": TrendingUp,
    "Operations Planning": Settings,
    "PR": Radio,
  };
  
  return iconMap[serviceName] || Circle;
};

const FeaturedProjects = () => {

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const featuredProjectCards = gsap.utils.toArray(".featured-project-card");
    const isMobile = window.innerWidth <= 1000;
    const resizeHandlers = [];
    const descriptionResizeHandlers = [];

    featuredProjectCards.forEach((featuredProjectCard, cardIndex) => {
      const tags = featuredProjectCard.querySelectorAll(".featured-project-tag");
      const tagsArray = Array.from(tags);
      const totalTags = tagsArray.length;
      const scrollDistance = totalTags * 150;
      const tagsContainer = featuredProjectCard.querySelector(".featured-project-card-tags");

      // Desktop-only setup for tag animations and descriptions
      if (!isMobile) {
        // Set description width to match tag width
        const updateDescriptionWidths = () => {
          tagsArray.forEach((tag) => {
            const tagWrapper = tag.closest(".featured-project-tag-wrapper");
            if (tagWrapper) {
              const description = tagWrapper.querySelector(".featured-project-tag-description");
              if (description) {
                // Force a layout recalculation
                const tagWidth = tag.offsetWidth || tag.getBoundingClientRect().width;
                if (tagWidth > 0) {
                  gsap.set(description, {
                    width: tagWidth,
                    left: "50%",
                    xPercent: -50
                  });
                }
              }
            }
          });
        };

        // Initialize all descriptions to be centered
        tagsArray.forEach((tag) => {
          const tagWrapper = tag.closest(".featured-project-tag-wrapper");
          if (tagWrapper) {
            const description = tagWrapper.querySelector(".featured-project-tag-description");
            if (description) {
              gsap.set(description, { 
                left: "50%",
                xPercent: -50,
                y: 10,
                opacity: 0
              });
            }
          }
        });

        // Update widths after a short delay to ensure layout is ready
        setTimeout(() => {
          updateDescriptionWidths();
        }, 100);
        
        // Also update after a longer delay to catch any CSS changes
        setTimeout(() => {
          updateDescriptionWidths();
        }, 500);

        // Also update on window resize
        const handleDescriptionResize = () => {
          updateDescriptionWidths();
        };
        window.addEventListener("resize", handleDescriptionResize);
        descriptionResizeHandlers.push(handleDescriptionResize);

        // Animate row gap when card locks in - start closer, expand as scrolling begins
        if (tagsContainer) {
          gsap.set(tagsContainer, { "--tags-row-gap": "0rem" });
          gsap.to(tagsContainer, {
            "--tags-row-gap": "4rem",
            scrollTrigger: {
              trigger: featuredProjectCard,
              start: "top 15%",
              end: "+=200",
              scrub: true,
            },
          });
        }
      }

      if (isMobile) {
        // Mobile: Pin card and allow horizontal scrolling of numbered items
        const mobileList = featuredProjectCard.querySelector(".featured-project-mobile-list");
        
        // Function to calculate and set up mobile pinning with horizontal scroll
        const setupMobilePin = () => {
          if (!mobileList) return;
          
          // Get the mobile list items
          const mobileItems = mobileList.querySelectorAll(".featured-project-mobile-item");
          if (mobileItems.length === 0) return;
          
          // Reset transform
          gsap.set(mobileList, { x: 0 });
          
          // Calculate total width of all items including gaps
          let totalWidth = 0;
          mobileItems.forEach((item, index) => {
            const itemWidth = item.getBoundingClientRect().width;
            totalWidth += itemWidth;
            if (index < mobileItems.length - 1) {
              totalWidth += 32; // 32px for gap (2rem)
            }
          });
          
          // Get viewport width
          const viewportWidth = window.innerWidth;
          
          // Get container padding
          const containerPadding = 32; // 2rem on each side
          
          // Calculate scroll distance (how much we can scroll horizontally)
          // We want to scroll until the last item's right edge aligns with viewport right edge
          const horizontalScrollDistance = Math.max(0, totalWidth - viewportWidth + containerPadding);
          
          // Calculate vertical scroll distance needed - use viewport height as base
          // This gives us enough scroll distance to smoothly scroll through all items
          const verticalScrollDistance = Math.max(window.innerHeight * 0.5, horizontalScrollDistance * 2);
          
          // Only set up pin if content extends beyond viewport
          if (horizontalScrollDistance > 0) {
            ScrollTrigger.create({
              trigger: featuredProjectCard,
              start: "top top",
              end: `+=${verticalScrollDistance}px`,
              scrub: true,
              pin: true,
              pinSpacing: true,
              anticipatePin: 0,
              invalidateOnRefresh: false,
              markers: false,
              id: `featured-project-mobile-${cardIndex}`,
              onEnter: () => {
                featuredProjectCard.classList.add('is-pinned');
              },
              onLeave: () => {
                featuredProjectCard.classList.remove('is-pinned');
                gsap.set(mobileList, { x: -horizontalScrollDistance });
              },
              onLeaveBack: () => {
                featuredProjectCard.classList.remove('is-pinned');
                gsap.set(mobileList, { x: 0 });
              },
              onUpdate: (self) => {
                const progress = Math.min(1, Math.max(0, self.progress));
                // Animate the horizontal scroll of the mobile list
                const translateX = -progress * horizontalScrollDistance;
                gsap.set(mobileList, {
                  x: translateX,
                });
              },
            });
          }
        };

        // Initial setup with delay to ensure layout is ready
        setTimeout(() => {
          setupMobilePin();
        }, 300);

        // Also set up on window resize
        const handleResize = () => {
          // Kill all triggers for this card
          ScrollTrigger.getAll().forEach((trigger) => {
            const triggerElement = trigger.trigger || trigger.vars?.trigger;
            if (triggerElement === featuredProjectCard) {
              trigger.kill();
            }
          });
          // Reset transform
          if (mobileList) {
            gsap.set(mobileList, { x: 0 });
          }
          setTimeout(() => {
            setupMobilePin();
          }, 100);
        };

        window.addEventListener("resize", handleResize);
        resizeHandlers.push({ card: featuredProjectCard, handler: handleResize });
      } else {
        // Desktop: Original vertical scroll behavior
        ScrollTrigger.create({
          trigger: featuredProjectCard,
          start: "top 15%",
          end: `+=${scrollDistance}vh`,
          scrub: true,
          pin: featuredProjectCard,
          pinSpacing: true,
          onUpdate: (self) => {
            const progress = self.progress;

            tagsArray.forEach((tag, tagIndex) => {
              const tagWrapper = tag.closest(".featured-project-tag-wrapper");
              if (!tagWrapper) return;

              const description = tagWrapper.querySelector(".featured-project-tag-description");
              
              const tagStart = tagIndex / totalTags;
              const tagEnd = (tagIndex + 1) / totalTags;
              
              let fillProgress = 0;
              if (progress >= tagEnd) {
                fillProgress = 1;
              } else if (progress >= tagStart) {
                const range = tagEnd - tagStart;
                const positionInRange = progress - tagStart;
                fillProgress = Math.min(1, positionInRange / range);
              }

              // Animate bubble from transparent/border to white/blue
              const bgOpacity = fillProgress;
              
              // Text: light grey to blue
              const textR = gsap.utils.interpolate(242, 38, fillProgress);
              const textG = gsap.utils.interpolate(237, 56, fillProgress);
              const textB = gsap.utils.interpolate(230, 134, fillProgress);

              const borderOpacity = gsap.utils.interpolate(1, 0, fillProgress);

              if (fillProgress > 0) {
                gsap.set(tag, {
                  backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`,
                  borderColor: `rgba(102, 95, 86, ${borderOpacity})`,
                });
              } else {
                gsap.set(tag, {
                  backgroundColor: "transparent",
                  borderColor: "var(--base-400)",
                });
              }

              const h3 = tag.querySelector("h3");
              if (h3) {
                gsap.set(h3, {
                  color: `rgb(${Math.round(textR)}, ${Math.round(textG)}, ${Math.round(textB)})`,
                });
              }

              if (description) {
                // Always maintain centering with xPercent, animate y position
                if (fillProgress > 0.5) {
                  gsap.to(description, {
                    opacity: 1,
                    xPercent: -50,
                    y: 0,
                    duration: 0.3,
                  });
                } else {
                  gsap.to(description, {
                    opacity: 0,
                    xPercent: -50,
                    y: 10,
                    duration: 0.3,
                  });
                }
              }
            });
          },
        });
      }

      // Handle transition animations between cards for first two cards (desktop only)
      if (!isMobile && cardIndex < featuredProjectCards.length - 1) {
        const featuredProjectCardInner = featuredProjectCard.querySelector(
          ".featured-project-card-inner"
        );
        const nextCard = featuredProjectCards[cardIndex + 1];
        const nextCardTags = nextCard.querySelectorAll(".featured-project-tag");
        const nextCardScrollDistance = nextCardTags.length * 150;

        // Transition animation happens after current card's pin is done
        gsap.fromTo(
          featuredProjectCardInner,
          {
            y: "0%",
            z: 0,
            rotationX: 0,
          },
          {
            y: "-50%",
            z: -250,
            rotationX: 45,
            scrollTrigger: {
              trigger: nextCard,
              start: "top 100%",
              end: `+=${nextCardScrollDistance}vh`,
              scrub: true,
            },
          }
        );

        gsap.to(featuredProjectCardInner, {
          "--after-opacity": 1,
          scrollTrigger: {
            trigger: nextCard,
            start: "top 75%",
            end: "top 0%",
            scrub: true,
          },
        });
      }
    });

    return () => {
      // Only kill ScrollTriggers that belong to FeaturedProjects
      ScrollTrigger.getAll().forEach((trigger) => {
        const triggerElement = trigger.trigger || trigger.vars?.trigger;
        const isFeaturedProjectTrigger = featuredProjectCards.some(card => triggerElement === card);
        if (isFeaturedProjectTrigger) {
          trigger.kill();
        }
      });
      resizeHandlers.forEach(({ handler }) => {
        window.removeEventListener("resize", handler);
      });
      descriptionResizeHandlers.forEach((handler) => {
        window.removeEventListener("resize", handler);
      });
    };
  }, []);

  return (
    <>
      <div className="featured-projects">
        {featuredProjectsContent.map((project, cardIndex) => (
          <div key={cardIndex} className="featured-project-card" data-card-index={cardIndex}>
            <div className="featured-project-card-inner">
              <div className="featured-project-card-content">
                <div className="featured-project-card-content-main">
                  <div className="featured-project-card-title">
                    <h2>{project.title}</h2>
                  </div>
                  <div className="featured-project-card-description">
                    <p className="lg">{project.description}</p>
                    {project.description2 && (
                      <p className="lg">{project.description2}</p>
                    )}
                  </div>
                </div>
                <div className="featured-project-card-info">
                  <p>Where We Can Help:</p>
                </div>
                <div className="featured-project-card-tags-wrapper">
                  <div className="featured-project-card-tags">
                    {project.tags.map((tag, tagIndex) => {
                      // Consider description long if it's over 80 characters
                      const isLongDescription = tag.description && tag.description.length > 80;
                      return (
                        <div 
                          key={tagIndex} 
                          className={`featured-project-tag-wrapper ${isLongDescription ? 'has-long-description' : ''}`}
                        >
                          <div className="featured-project-tag">
                            <h3>{tag.name}</h3>
                          </div>
                          <div className={`featured-project-tag-description ${isLongDescription ? 'long-description' : ''}`}>
                            <p>{tag.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Mobile layout: numbered list */}
                <div className="featured-project-mobile-list">
                  {project.tags.map((tag, tagIndex) => {
                    const IconComponent = getServiceIcon(tag.name);
                    return (
                      <div key={tagIndex} className="featured-project-mobile-item">
                        <div className="featured-project-mobile-item-number">
                          <IconComponent size={24} strokeWidth={2} />
                        </div>
                        <div className="featured-project-mobile-item-content">
                          <h3 className="featured-project-mobile-item-title">{tag.name}</h3>
                          <p className="featured-project-mobile-item-description">{tag.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FeaturedProjects;

