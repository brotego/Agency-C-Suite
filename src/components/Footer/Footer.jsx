"use client";
import "./Footer.css";

import { useEffect, useRef } from "react";
import Copy from "../Copy/Copy";
import { trackEmailClick, trackPhoneClick, trackLinkClick, trackSocialClick } from "@/utils/analytics";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const linkedinWidgetRef = useRef(null);

  useEffect(() => {
    // Initialize LinkedIn Follow Company widget
    const initLinkedInWidget = () => {
      if (!linkedinWidgetRef.current || typeof window === 'undefined') return;

      // Clear any existing content
      linkedinWidgetRef.current.innerHTML = '';

      // Create the script element for LinkedIn Follow Company exactly as LinkedIn requires
      const script = document.createElement('script');
      script.type = 'IN/FollowCompany';
      script.setAttribute('data-id', '0000'); // This needs to be replaced with actual company ID
      script.setAttribute('data-counter', 'bottom');
      
      linkedinWidgetRef.current.appendChild(script);

      // Parse the widget when LinkedIn is ready
      const parseWidget = () => {
        if (window.IN && window.IN.parse) {
          try {
            window.IN.parse(linkedinWidgetRef.current);
          } catch (e) {
            console.error('LinkedIn parse error:', e);
          }
        }
      };

      // Wait for LinkedIn platform script to load
      if (window.IN && window.IN.parse) {
        // LinkedIn already loaded, parse immediately
        setTimeout(parseWidget, 100);
      } else {
        // Wait for LinkedIn to load
        const checkLinkedIn = setInterval(() => {
          if (window.IN && window.IN.parse) {
            clearInterval(checkLinkedIn);
            parseWidget();
          }
        }, 100);

        // Cleanup after 20 seconds
        setTimeout(() => {
          clearInterval(checkLinkedIn);
        }, 20000);
      }
    };

    // Wait a bit for LinkedIn platform script to potentially load
    const timer = setTimeout(() => {
      initLinkedInWidget();
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (linkedinWidgetRef.current) {
        linkedinWidgetRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div id="footer" className="footer">
      <div className="footer-meta">
        <div className="container footer-socials">
        
        </div>
      </div>
      <div className="footer-outro">
        <div className="container footer-outro-content">
          <div className="footer-outro-left">
            <div className="footer-header">
              <Copy delay={0.1}>
                <h3>Get In Touch</h3>
              </Copy>
            </div>
            <div className="footer-section footer-section-desktop">
              <Copy delay={0.15}>
                <p className="footer-section-item">
                  <a 
                    href="mailto:Jordan@AgencyC-Suite.com"
                    onClick={() => trackEmailClick("Jordan@AgencyC-Suite.com")}
                  >
                    Jordan@AgencyC-Suite.com
                  </a>
                </p>
              </Copy>
              <Copy delay={0.2}>
                <p className="footer-section-item">
                  <a 
                    href="tel:+14158455433"
                    onClick={() => trackPhoneClick("+1 415 845-5433")}
                  >
                    +1 415 845-5433
                  </a>
                </p>
              </Copy>
              <Copy delay={0.25}>
                <p className="footer-section-item">
                  <a 
                    href="https://www.AgencyC-Suite.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => trackLinkClick("Website", "https://www.AgencyC-Suite.com", "Footer")}
                  >
                    www.AgencyC-Suite.com
                  </a>
                </p>
              </Copy>
              <Copy delay={0.3}>
                <p className="footer-section-item footer-linkedin-item">
                  <a 
                    href="https://www.linkedin.com/company/agencyc-suite/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => trackSocialClick("LinkedIn", "https://www.linkedin.com/company/agencyc-suite/")}
                  >
                    <FaLinkedin className="linkedin-icon" />
                    LinkedIn
                  </a>
                </p>
              </Copy>
              <div className="linkedin-follow-widget" ref={linkedinWidgetRef} />
            </div>
          </div>
          <div className="footer-outro-right">
            <div className="footer-section footer-section-mobile">
              <Copy delay={0.15}>
                <p className="footer-section-item">
                  <a 
                    href="mailto:Jordan@AgencyC-Suite.com"
                    onClick={() => trackEmailClick("Jordan@AgencyC-Suite.com")}
                  >
                    Jordan@AgencyC-Suite.com
                  </a>
                </p>
              </Copy>
              <Copy delay={0.2}>
                <p className="footer-section-item">
                  <a 
                    href="tel:+14158455433"
                    onClick={() => trackPhoneClick("+1 415 845-5433")}
                  >
                    +1 415 845-5433
                  </a>
                </p>
              </Copy>
              <Copy delay={0.25}>
                <p className="footer-section-item">
                  <a 
                    href="https://www.AgencyC-Suite.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => trackLinkClick("Website", "https://www.AgencyC-Suite.com", "Footer")}
                  >
                    www.AgencyC-Suite.com
                  </a>
                </p>
              </Copy>
              <Copy delay={0.3}>
                <p className="footer-section-item footer-linkedin-item">
                  <a 
                    href="https://www.linkedin.com/company/agencyc-suite/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => trackSocialClick("LinkedIn", "https://www.linkedin.com/company/agencyc-suite/")}
                  >
                    <FaLinkedin className="linkedin-icon" />
                    LinkedIn
                  </a>
                </p>
              </Copy>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="footer-copyright">
            <p>
              Developed by — <span>Line Labs</span>
            </p>
            <p>All rights reserved &copy; 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
