"use client";
import "./index.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomEase from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";

import Nav from "@/components/Nav/Nav";
import ConditionalFooter from "@/components/ConditionalFooter/ConditionalFooter";
import AnimatedButton from "@/components/AnimatedButton/AnimatedButton";
import FeaturedProjects from "@/components/FeaturedProjects/FeaturedProjects";
import ClientReviews from "@/components/ClientReviews/ClientReviews";
import HowIWork from "@/components/HowIWork/HowIWork";
import CTAWindow from "@/components/CTAWindow/CTAWindow";
import Copy from "@/components/Copy/Copy";

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

export default function Home() {
  const lenis = useLenis();

  return (
    <>
      <Nav />
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-header">
              <Copy animateOnScroll={false} delay={0.85}>
                <h1>Fractional Executives for Start-up and Independent Creative Agencies
                </h1>
              </Copy>
            </div>
            <div className="hero-tagline">
              <Copy animateOnScroll={false} delay={1}>
                <p>
                Where creative vision meets disciplined leadership to unlock real growth.
                </p>
              </Copy>
            </div>
          </div>
        </div>
      </section>
      <section className="what-we-do">
        <div className="container">
          <div className="what-we-do-content">
            <div className="what-we-do-col">
              <Copy delay={0.1}>
                <h2 className="what-we-do-title">What is</h2>
              </Copy>
              <Copy delay={0.125}>
                <p className="lg">
                  As a founder and CEO of three creative agencies, Eleven, Argonaut and TBD, I've been an evangelist of creative-driven, independent agencies for over 25 years. I'm an entrepreneur that loves conceiving, planning, building, launching, leading, and growing independent creative agencies. My superpower is knowing how to run creative businesses so that my creative partners can focus on the things they love to do and not get bogged down with things they don't.
                </p>
              </Copy>
            </div>
            <div className="what-we-do-col">
              <Copy delay={0.14}>
                <h2 className="what-we-do-title-right">Agency C-Suite?</h2>
              </Copy>
              <Copy delay={0.15}>
                <p className="lg">
                  I'm now advising founders of creative agencies as a fractional CEO. Additionally, I've assembled a team of fractional experts with extensive agency experience who can help as needed in areas like Finance, Legal, Recruiting, HR, New Business, Marketing, PR, Operations & IT.
                </p>
              </Copy>
            </div>
          </div>
        </div>
      </section>
      <section className="featured-projects-container">
        <div className="container">
          <div className="featured-projects-header-callout">
            <Copy delay={0.1}>
              <p>How I can help</p>
            </Copy>
          </div>
          <div className="featured-projects-header">
            <Copy delay={0.15}>
              <h2>Where Are You In Your Agency Journey?</h2>
            </Copy>
          </div>
        </div>
        <FeaturedProjects />
      </section>
      <section className="client-reviews-container">
        <div className="container">
          <div className="client-reviews-header-callout">
            <p>Words from friends</p>
          </div>
          <ClientReviews />
        </div>
      </section>
      <section className="how-i-work-container">
        <div className="container">
          <HowIWork />
        </div>
      </section>
      <section className="about-me-container">
        <div className="container">
          <div className="about-me-header-callout">
            <Copy delay={0.1}>
              <p>About me</p>
            </Copy>
          </div>
          <div className="about-me-header">
            <Copy delay={0.15}>
              <h2>Who am I</h2>
            </Copy>
          </div>
          <div className="about-me-top">
            <div className="about-me-image">
              <img src="/Jordan Warren Square.jpg" alt="About me" />
            </div>
            <div className="about-me-main-text">
              <Copy delay={0.1}>
                <h1>
                  Guiding creative entrepreneurs with 25+ years of agency leadership.
                </h1>
              </Copy>
            </div>
          </div>
          <div className="about-me-bottom">
            <div className="about-me-bottom-col">
              <Copy delay={0.15}>
                <p>
                  As the son of a father who was an inventor and entrepreneur and a mother who was a model and actress, I've long felt a calling to pursue a career that blends business and creativity. I've been starting businesses since I was nine-years old, beginning with a shoe shine business, a tennis racket stringing business and a rock photography business. With an undergraduate degree in computer engineering, an MBA, and sales and management training gained while client-side at IBM, I made the switch to the agency world upon the advent of the public Internet, starting one of the first Internet marketing practices at CKS.
                </p>
              </Copy>
            </div>
            <div className="about-me-bottom-col">
              <Copy delay={0.2}>
                <p>
                  While at CKS I also helped build a 50-person brand marketing team for Steve Jobs upon his return to Apple. Since leaving CKS, I've started, built and led three integrated creative marketing agencies, Eleven, Argonaut and TBD. I now enjoy sharing my 25+ years of independent agency leadership experience with fellow agency founders who are just beginning their entrepreneurial journey.
                </p>
              </Copy>
            </div>
          </div>
        </div>
      </section>
      <ConditionalFooter />
    </>
  );
}
