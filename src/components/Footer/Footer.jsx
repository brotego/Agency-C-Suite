"use client";
import "./Footer.css";

import Copy from "../Copy/Copy";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-meta">
        <div className="container footer-socials">
        
        </div>
      </div>
      <div className="footer-outro">
        <div className="container footer-outro-content">
          <div className="footer-outro-left">
            <div className="footer-header">
              <Copy delay={0.1}>
                <h3>Agency C-Suite</h3>
              </Copy>
            </div>
          </div>
          <div className="footer-outro-right">
            <div className="footer-section">
              <Copy delay={0.15}>
                <p className="footer-section-heading">Contact</p>
              </Copy>
              <Copy delay={0.2}>
                <p className="footer-section-item">
                  <a href="mailto:Jordan@Agency-C-Suite.com">Jordan@Agency-C-Suite.com</a>
                </p>
              </Copy>
              <Copy delay={0.25}>
                <p className="footer-section-item">
                  <a href="tel:+14158455433">+1 415 845-5433</a>
                </p>
              </Copy>
              <Copy delay={0.3}>
                <p className="footer-section-item">
                  <a href="https://www.Agency-C-Suite.com" target="_blank" rel="noopener noreferrer">www.Agency-C-Suite.com</a>
                </p>
              </Copy>
            </div>
            <div className="footer-section">
              <Copy delay={0.35}>
                <p className="footer-section-heading">About</p>
              </Copy>
              <Copy delay={0.4}>
                <p className="footer-section-item">Jordan Warren</p>
              </Copy>
              <Copy delay={0.45}>
                <p className="footer-section-item">Fractional CEO</p>
              </Copy>
              <Copy delay={0.5}>
                <p className="footer-section-item">Alliance Creative Partners</p>
              </Copy>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="footer-copyright">
            <p>
              Developed by — <span>Line Labs</span>
            </p>
            <p>All rights reserverd &copy; 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
