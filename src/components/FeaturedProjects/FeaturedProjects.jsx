"use client";
import "./FeaturedProjects.css";
import featuredProjectsContent from "./featured-projects-content";

import { useEffect, useRef } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FeaturedProjects = () => {

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const featuredProjectCards = gsap.utils.toArray(".featured-project-card");
    const isMobile = window.innerWidth <= 1000;
    const resizeHandlers = [];

    featuredProjectCards.forEach((featuredProjectCard, cardIndex) => {
      const tags = featuredProjectCard.querySelectorAll(".featured-project-tag");
      const tagsArray = Array.from(tags);
      const totalTags = tagsArray.length;
      const scrollDistance = totalTags * 150;
      const tagsContainer = featuredProjectCard.querySelector(".featured-project-card-tags");

      // Set description width to match tag width
      // Note: Grid will auto-create columns with fixed spacing, no need to calculate

      tagsArray.forEach((tag) => {
        const tagWrapper = tag.closest(".featured-project-tag-wrapper");
        if (tagWrapper) {
          const description = tagWrapper.querySelector(".featured-project-tag-description");
          if (description) {
            const tagWidth = tag.offsetWidth;
            gsap.set(description, { width: tagWidth });
          }
        }
      });


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

      if (isMobile) {
        // Mobile: Horizontal scroll behavior - scroll the entire blue card
        const cardInner = featuredProjectCard.querySelector(".featured-project-card-inner");
        
        // Function to calculate and set up horizontal scroll
        const setupHorizontalScroll = () => {
          if (!cardInner) return;
          
          // Force a layout recalculation
          const viewportWidth = window.innerWidth;
          // Use getBoundingClientRect to get the actual width including all content
          const cardInnerRect = cardInner.getBoundingClientRect();
          const cardInnerWidth = cardInnerRect.width;
          
          // Get the padding from the container (1rem = 16px typically, but let's get it dynamically)
          const featuredProjectsContainer = featuredProjectCard.closest(".featured-projects");
          const containerPadding = featuredProjectsContainer 
            ? parseFloat(getComputedStyle(featuredProjectsContainer).paddingLeft) || 16
            : 16;
          
          // Calculate scroll distance to show same padding on right as on left
          // We want the card to scroll until its right edge is at viewport edge - padding
          // Add double the padding to ensure we see white space on the right
          const horizontalScrollDistance = Math.max(0, cardInnerWidth - viewportWidth + (containerPadding * 2));
          
          // Set initial position to left edge (x: 0)
          gsap.set(cardInner, { x: 0 });
          
          // Only set up scroll if card extends beyond viewport
          if (horizontalScrollDistance > 0) {
            ScrollTrigger.create({
              trigger: featuredProjectCard,
              start: "top 15%",
              end: `+=${horizontalScrollDistance}px`,
              scrub: true,
              pin: featuredProjectCard,
              pinSpacing: true,
              onUpdate: (self) => {
                const progress = Math.min(1, self.progress); // Clamp to 1
                // Translate from 0 (left edge) to -horizontalScrollDistance (right edge with padding)
                const translateX = -progress * horizontalScrollDistance;
                
                // Translate the entire blue card, not just the content
                gsap.set(cardInner, {
                  x: translateX,
                });

                // Animate tags as we scroll horizontally
                tagsArray.forEach((tag, tagIndex) => {
                  const tagWrapper = tag.closest(".featured-project-tag-wrapper");
                  if (!tagWrapper) return;

                  const description = tagWrapper.querySelector(".featured-project-tag-description");
                  
                  // Calculate when each tag should animate based on horizontal position
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
        };

        // Wait for layout to be ready, then set up scroll
        setTimeout(() => {
          setupHorizontalScroll();
        }, 100);

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
          if (cardInner) {
            gsap.set(cardInner, { x: 0 });
          }
          setTimeout(() => {
            setupHorizontalScroll();
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
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      resizeHandlers.forEach(({ handler }) => {
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
                  <div className="featured-project-card-info">
                    <p>Where We Can Help</p>
                  </div>
                </div>
                <div className="featured-project-card-tags-wrapper">
                  <div className="featured-project-card-tags">
                    {project.tags.map((tag, tagIndex) => (
                      <div key={tagIndex} className="featured-project-tag-wrapper">
                        <div className="featured-project-tag">
                          <h3>{tag.name}</h3>
                        </div>
                        <div className="featured-project-tag-description">
                          <p>{tag.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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

