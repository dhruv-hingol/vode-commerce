"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import HeroMedia from "./hero-media";

const campaigns = [
  {
    title: "A new expression.",
    caption: "THE COTTON SIGNATURE DROP",
    href: "/collections/new-arrivals",
    action: "Explore the drop",
    image: null,
    alt: "",
  },
];

export default function CampaignCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function goTo(index: number) {
    const viewport = track.current;
    if (!viewport) return;
    viewport.scrollTo({
      left:
        Math.max(0, Math.min(index, campaigns.length - 1)) *
        viewport.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  return (
    <section
      className="campaign-hero campaign-carousel"
      aria-label="VODE campaigns"
      aria-roledescription="carousel"
    >
      <div
        ref={track}
        className="campaign-track"
        tabIndex={0}
        aria-label="Campaign images. Use arrow keys to browse."
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(active + (event.key === "ArrowRight" ? 1 : -1));
          }
        }}
        onScroll={(event) => {
          const viewport = event.currentTarget;
          setActive(Math.round(viewport.scrollLeft / viewport.clientWidth));
        }}
      >
        {campaigns.map((campaign, index) => (
          <div
            className="campaign-slide"
            key={campaign.title}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${campaigns.length}`}
            inert={active !== index}
          >
            <HeroMedia active={active === index} />
            <div className="campaign-gradient" />
            <div className="campaign-editorial-copy">
              <p>{campaign.caption}</p>
              {index === 0 ? (
                <h1>{campaign.title}</h1>
              ) : (
                <h2>{campaign.title}</h2>
              )}
              <Link href={campaign.href}>
                {campaign.action} <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="campaign-navigation">
        <a href="#new-drop" className="campaign-scroll-link">
          Scroll to discover <ArrowDown size={14} />
        </a>
      </div>
    </section>
  );
}
