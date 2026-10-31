"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const stories = [
  { image: "/images/drops/eleven-eleven-closeup-chest.jpg", title: "Make a wish.", subtitle: "THE 11:11 EMBROIDERY", href: "/products/11-11-cotton-shirt", alt: "Red 11:11 and white Make a wish embroidery on the black shirt" },
  { image: "/images/drops/eleven-eleven-closeup-collar.jpg", title: "A signature in red.", subtitle: "THE BLACK SHIRT / COLLAR DETAIL", href: "/products/11-11-cotton-shirt", alt: "Red VODE embroidery on the black pinstripe collar" },
  { image: "/images/drops/que-sera-closeup-collar.jpg", title: "Signed, VODE.", subtitle: "THE WHITE SHIRT / COLLAR DETAIL", href: "/products/que-sera-cotton-shirt", alt: "Red VODE embroidery on the white pinstripe collar" },
  { image: "/images/drops/que-sera-closeup-chest.jpg", title: "Que Sera, Sera.", subtitle: "A CLOSER LOOK AT THE STITCH", href: "/products/que-sera-cotton-shirt", alt: "Red Que Sera, Sera chest embroidery on the white shirt" },
];

export default function CampaignEdit() {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  function updateEdges() {
    const rail = track.current;
    if (rail) setEdges({ start: rail.scrollLeft < 4, end: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4 });
  }
  useEffect(() => {
    const rail = track.current;
    if (!rail) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(rail);
    return () => observer.disconnect();
  }, []);
  function move(direction: number) {
    const rail = track.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * ((rail.firstElementChild as HTMLElement).offsetWidth + 12), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return (
    <section className="campaign-edit" aria-labelledby="campaign-edit-title">
      <div className="edit-heading">
        <div><p className="eyebrow">A CLOSER LOOK</p><h2 id="campaign-edit-title">The details make the difference.</h2></div>
        <div className="rail-arrows">
          <button type="button" aria-label="Previous campaign detail" aria-controls="campaign-edit-track" disabled={edges.start} onClick={() => move(-1)}><ArrowLeft size={19} /></button>
          <button type="button" aria-label="Next campaign detail" aria-controls="campaign-edit-track" disabled={edges.end} onClick={() => move(1)}><ArrowRight size={19} /></button>
        </div>
      </div>
      <div className="edit-track" id="campaign-edit-track" ref={track} onScroll={updateEdges} tabIndex={0} role="region" aria-label="Shop the campaign details">
        {stories.map((story, index) => (
          <Link href={story.href} className="edit-card" key={story.image}>
            <div className="edit-card-image"><Image src={story.image} alt={story.alt} fill sizes="(max-width:700px) 80vw, (max-width:1100px) 44vw, 32vw" /><span className="edit-card-number">0{index + 1}</span></div>
            <div className="edit-card-copy"><div><p>{story.subtitle}</p><h3>{story.title}</h3></div><ArrowUpRight size={20} /></div>
          </Link>
        ))}
      </div>
      <p className="edit-scroll-hint">Explore the details <ArrowRight size={14} /></p>
    </section>
  );
}
