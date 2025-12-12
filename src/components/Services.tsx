"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem {
  main: string;
  detail: string;
}

interface Stage {
  id: string;
  name: string;
  question: string;
  services: ServiceItem[];
}

export default function Services() {
  const [activeStage, setActiveStage] = useState(0);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const parseService = (service: string): ServiceItem => {
    const match = service.match(/^(.+?)\s*\((.+?)\)$/);
    if (match) {
      return { main: match[1].trim(), detail: match[2].trim() };
    }
    return { main: service, detail: "" };
  };

  const stages: Stage[] = [
    {
      id: "startup",
      name: "Start-up",
      question: "Are you just starting your agency and don't know where to begin?",
      services: [
        "Partner Alignment (vision, values, purpose, goals)",
        "Formation (incorporation, registration, partnership agreements)",
        "Fundraising",
        "Operations Set-up (bank, insurance, payroll, benefits, HR policies, IT, office space)",
        "Financial Planning (pro forma profit & loss (p&l) statement including revenue forecast, staffing plan and other expenses, rate card development and pricing strategy)",
        "Organization Planning (team structure, growth plan, recruiting, onboarding)",
        "Positioning (how you will be different, what problems you will uniquely solve, naming, brand narrative, messaging)",
        "Go-to-Market (how to launch the agency publicly, marketing assets, PR)",
        "New Business (strategy, plan, tactics)",
        "Client Management (Master Service Agreements (MSAs) and Statements of Work (SOWs), product/service offering development, procurement negotiations)",
      ].map(parseService),
    },
    {
      id: "growup",
      name: "Grow-up",
      question: "Have you been at this for a while and looking for ways to improve your profitability, operations, new business, marketing, client satisfaction and/or employee satisfaction? Are you thinking about taking on investment or selling your agency and need help preparing so you can achieve an ideal outcome?",
      services: [
        "Financial (review p&l, revenue forecast, expenses, cash flow, billing, collections)",
        "Business Review (MSAs, SOWs, rate card, payment terms, IP ownership)",
        "Client Relationships (satisfaction surveys, quarterly business reviews, account planning)",
        "New Business (strategy, plan, tactics)",
        "Marketing & PR (positioning, marketing assets, activities)",
        "Operations (systems & processes)",
        "HR (compliance, recruiting, employee engagement)",
        "M&A Planning",
      ].map(parseService),
    },
    {
      id: "scaleup",
      name: "Scale-up",
      question: "Do you have an opportunity to scale and need help securing it and managing the resulting growth?",
      services: [
        "Proposal Development (strategy, scope, pricing, procurement negotiation)",
        "Legal (contract negotiation)",
        "Growth Planning (staffing plan, recruiting, onboarding)",
        "Financial Planning (p&l forecasting and management)",
        "Operations Planning (systems, process)",
        "PR (new client and/or campaign announcements)",
      ].map(parseService),
    },
  ];

  // Detect mobile and handle resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobile: Simple scroll handler without pinning
  useEffect(() => {
    if (!isMobile || !sectionRef.current) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Simple scroll-based stage detection for mobile
      if (rect.top < windowHeight * 0.3 && rect.bottom > windowHeight * 0.7) {
        // In viewport - determine stage based on scroll position
        const scrollProgress = Math.max(0, Math.min(1, (windowHeight * 0.3 - rect.top) / (windowHeight * 0.4)));
        const stageIndex = Math.floor(scrollProgress * stages.length);
        setActiveStage(Math.min(stageIndex, stages.length - 1));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // Desktop: GSAP ScrollTrigger with pinning
  useGSAP(() => {
    if (isMobile || !sectionRef.current || !contentRef.current || !scrollContainerRef.current) return;

    const section = sectionRef.current;
    const content = contentRef.current;
    const container = scrollContainerRef.current;
    const windowHeight = window.innerHeight;

    let scrollTrigger: ScrollTrigger | null = null;

    try {
      // Create ScrollTrigger to pin the content
      scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        end: `+=${windowHeight * stages.length}`,
        pin: content,
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Update active stage based on scroll progress
          const stageProgress = progress * stages.length;
          const stageIndex = Math.floor(stageProgress);
          const newActiveStage = Math.min(stageIndex, stages.length - 1);
          setActiveStage(newActiveStage);

          // Update horizontal scroll position
          if (container && container.scrollWidth > container.clientWidth) {
            const maxScroll = container.scrollWidth - container.clientWidth;
            container.scrollLeft = progress * maxScroll;
          }
        },
        invalidateOnRefresh: true,
      });
    } catch (error) {
      console.error("ScrollTrigger error:", error);
    }

    return () => {
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
    };
  }, { scope: sectionRef, dependencies: [isMobile] });

  return (
    <section 
      ref={sectionRef} 
      id="services" 
      className="relative text-white" 
      style={{ backgroundColor: '#131313' }}
    >
      <div 
        ref={contentRef}
        className="py-20 w-full"
        style={{ 
          backgroundColor: '#131313', 
          minHeight: isMobile ? 'auto' : '100vh',
          display: isMobile ? 'block' : 'flex',
          alignItems: isMobile ? 'flex-start' : 'center'
        }}
      >
        <div className="container mx-auto px-6 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left side - Heading and text */}
            <div>
              <h2 className="text-4xl font-bold mb-6 text-white">Where Are You In Your Agency Journey?</h2>
              {isMobile ? (
                // Mobile: Show all stages stacked
                <div className="space-y-8">
                  {stages.map((stage, index) => (
                    <div key={stage.id} className={index === activeStage ? 'opacity-100' : 'opacity-60'}>
                      <h3 className="text-2xl font-semibold mb-3 text-white">{stage.name}</h3>
                      <p className="text-lg text-gray-300 leading-relaxed">
                        {stage.question}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                // Desktop: Horizontal scroll
                <div
                  ref={scrollContainerRef}
                  className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {stages.map((stage, index) => (
                    <div
                      key={stage.id}
                      className="flex-shrink-0 w-full snap-center"
                    >
                      <p className="text-lg text-gray-300 leading-relaxed">
                        {stage.question}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right side - Oval buttons with hover tooltips */}
            <div className="relative">
              <div className="flex flex-wrap gap-4">
                {stages[activeStage]?.services.map((service, index) => (
                  <div
                    key={index}
                    className="relative"
                    onMouseEnter={() => setHoveredService(`${activeStage}-${index}`)}
                    onMouseLeave={() => setHoveredService(null)}
                    onTouchStart={() => setHoveredService(`${activeStage}-${index}`)}
                    onTouchEnd={() => setHoveredService(null)}
                  >
                    <button className="px-6 py-3 rounded-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 whitespace-nowrap">
                      {service.main}
                    </button>
                    {hoveredService === `${activeStage}-${index}` && service.detail && (
                      <div className="absolute left-0 top-full mt-2 z-10 bg-white text-black p-4 rounded-lg shadow-xl max-w-sm border border-gray-200">
                        <p className="text-sm leading-relaxed">{service.detail}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
