"use client";
import "./ClientReviews.css";
import clientReviewsContent from "./client-reviews-content";

import { useRef, useEffect } from "react";

import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

const ClientReviews = () => {
  const reviewTextRefs = useRef([]);
  const splitTextRefs = useRef([]);

  useEffect(() => {
    reviewTextRefs.current.forEach((ref, index) => {
      if (ref) {
        const timer = setTimeout(() => {
          if (splitTextRefs.current[index]) {
            splitTextRefs.current[index].revert();
          }

          splitTextRefs.current[index] = SplitText.create(ref, {
            type: "lines",
            mask: "lines",
          });

          if (splitTextRefs.current[index] && splitTextRefs.current[index].lines) {
            gsap.set(splitTextRefs.current[index].lines, { y: "110%" });
            gsap.to(splitTextRefs.current[index].lines, {
              y: "0%",
              duration: 0.5,
              stagger: 0.05,
              ease: "power4.out",
              delay: index * 0.1,
            });
          }
        }, 100 + index * 100);

        return () => clearTimeout(timer);
      }
    });

    return () => {
      splitTextRefs.current.forEach((splitText) => {
        if (splitText) {
          splitText.revert();
        }
      });
    };
  }, []);

  return (
    <div className="client-reviews">
      <div className="client-reviews-wrapper">
        <div className="client-reviews-grid">
          {clientReviewsContent.map((client, index) => (
            <div key={client.id} className="client-review-item">
              <div className="client-review-copy">
                <h3 ref={(el) => (reviewTextRefs.current[index] = el)}>
                  {client.review}
                </h3>
              </div>
              <div className="client-item-expanded">
                <div className="client-avatar">
                  <img src={client.avatar} alt={client.name} />
                </div>
                <div className="client-info">
                  <p className="client-name">{client.name}</p>
                  <p className="client-title">{client.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientReviews;
