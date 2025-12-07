"use client";
import "./Footer.css";

import Copy from "../Copy/Copy";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
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
          </div>
          <div className="footer-outro-right">
            <div className="footer-section">
              <Copy delay={0.15}>
                <p className="footer-section-item">
                  <a href="mailto:Jordan@AgencyC-Suite.com">Jordan@AgencyC-Suite.com</a>
                </p>
              </Copy>
              <Copy delay={0.2}>
                <p className="footer-section-item">
                  <a href="tel:+14158455433">+1 415 845-5433</a>
                </p>
              </Copy>
              <Copy delay={0.25}>
                <p className="footer-section-item">
                  <a href="https://www.AgencyC-Suite.com" target="_blank" rel="noopener noreferrer">www.AgencyC-Suite.com</a>
                </p>
              </Copy>
              <Copy delay={0.3}>
                <p className="footer-section-item footer-linkedin-item">
                  <a href="https://www.linkedin.com/company/agencyc-suite/" target="_blank" rel="noopener noreferrer">
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
