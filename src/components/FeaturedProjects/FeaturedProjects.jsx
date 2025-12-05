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

    featuredProjectCards.forEach((featuredProjectCard, cardIndex) => {
      const tags = featuredProjectCard.querySelectorAll(".featured-project-tag");
      const tagsArray = Array.from(tags);
      const totalTags = tagsArray.length;
      const scrollDistance = totalTags * 150;
      const tagsContainer = featuredProjectCard.querySelector(".featured-project-card-tags");

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

      // All cards now get the same pinning and tag-cycling behavior
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
                  y: 0,
                  duration: 0.3,
                });
              } else {
                gsap.to(description, {
                  opacity: 0,
                  y: 10,
                  duration: 0.3,
                });
              }
            }
          });
        },
      });

      // Handle transition animations between cards for first two cards
      if (cardIndex < featuredProjectCards.length - 1) {
        const featuredProjectCardInner = featuredProjectCard.querySelector(
          ".featured-project-card-inner"
        );
        const isMobile = window.innerWidth <= 1000;
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
              start: isMobile ? "top 85%" : "top 100%",
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
          </div>
        ))}
      </div>
    </>
  );
};

export default FeaturedProjects;
