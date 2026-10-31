"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { brand } from "@/lib/config";

/** Silent looping campaign film, with a static poster for reduced motion/errors. */
export default function HeroMedia() {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const media = video.current;
    if (!media || !brand.campaign.video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const playCampaign = () => {
      if (reduced.matches) media.pause();
      else void media.play().catch(() => {});
    };
    playCampaign();
    reduced.addEventListener("change", playCampaign);
    return () => {
      reduced.removeEventListener("change", playCampaign);
      media.pause();
    };
  }, []);
  return (
    <div className="hero-image">
      <Image
        src={brand.campaign.image}
        alt={brand.campaign.alt}
        fill
        sizes="100vw"
        preload
      />
      {brand.campaign.video && !failed && (
        <video
          ref={video}
          className="hero-video"
          muted
          loop
          playsInline
          preload="metadata"
          poster={brand.campaign.image}
          aria-label="VODE fashion campaign"
          onError={() => setFailed(true)}
        >
          <source src={brand.campaign.video} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
