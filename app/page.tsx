import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, MoveRight } from "lucide-react";

import { brand } from "@/lib/config";

import NewDrop from "@/components/new-drop";
import HeroMedia from "@/components/hero-media";
import Reveal from "@/components/reveal";
import StructuredData from "@/components/structured-data";
import { homeStructuredData, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Pure Cotton Embroidered Shirts India",
  brand.description,
  "/",
);
export default function Home() {
  return (
    <main id="main-content">
      <StructuredData data={homeStructuredData} />
      <section className="campaign-hero">
        <HeroMedia />
        <div className="hero-shade" />
        <div className="hero-topline">
          <span>VODE — THE FIRST CHAPTER</span>
          <span>CONTEMPORARY BY NATURE</span>
        </div>
        <div className="campaign-copy">
          <p className="eyebrow">A NEW EXPRESSION OF STYLE</p>
          <h1>
            New Autumn
            <br />
            <em>Collection.</em>
          </h1>
          <p className="campaign-description">
            Precision in every stitch.
            <br />
            Confidence in every detail.
          </p>
          <div className="hero-actions">
            <Link href="/shop" className="button light">
              SHOP NOW <ArrowUpRight size={17} />
            </Link>
            <Link href="/about" className="hero-story">
              DISCOVER VODE <MoveRight size={18} />
            </Link>
          </div>
        </div>
        <div className="hero-bottom">
          <a href="#new-drop">
            SCROLL TO DISCOVER <ArrowDown size={14} />
          </a>
          <span>
            01 <i /> THE NEW PERSPECTIVE
          </span>
          <span>DESIGNED TO STAND APART.</span>
        </div>
        <span className="hero-sideword" aria-hidden="true">
          VODE
        </span>
      </section>
      <div className="brand-strip">
        <span>THOUGHTFUL DETAILS</span>
        <span className="strip-star">✳</span>
        <span>MODERN SILHOUETTES</span>
        <span className="strip-star">✳</span>
        <span>EFFORTLESS CONFIDENCE</span>
        <span className="strip-star">✳</span>
        <span>RULE THE STREET WITH VODE</span>
      </div>
      <NewDrop />

      <section className="craft-section">
        <div className="craft-copy">
          <p className="eyebrow">THE BEAUTY IS IN THE DETAILS</p>
          <h2>
            Crafted in detail.
            <br />
            <em>Worn with confidence.</em>
          </h2>
          <p>
            From the texture of a fabric to the placement of a stitch, our
            vision begins with the things you feel. A considered approach to
            clothing, with character in every detail.
          </p>
          <Link href="/about#craft" className="underlined-link">
            THE VODE APPROACH <ArrowUpRight size={18} />
          </Link>
          <div className="craft-values">
            <span>01 / CONSIDERED FABRICS</span>
            <span>02 / EXPRESSIVE DETAIL</span>
            <span>03 / EFFORTLESS FIT</span>
          </div>
        </div>
        <div className="craft-image">
          <Image
            src="/images/drops/que-sera-02.jpg"
            alt="VODE collar embroidery and fine pinstripes on the Que Sera pure cotton shirt"
            fill
            sizes="(max-width:700px) 100vw, 50vw"
          />
        </div>
      </section>
      <Reveal className="philosophy page-wrap">
        <p className="eyebrow">THE VODE PHILOSOPHY</p>
        <h2>
          More than clothing.
          <br />
          <em>An expression of you.</em>
        </h2>
        <p>
          Style doesn’t need to shout to make an impression. Thoughtful details,
          modern silhouettes, and effortless confidence define our vision for
          every collection.
        </p>
        <Link href="/about" className="underlined-link">
          OUR STORY <ArrowUpRight size={17} />
        </Link>
        <span className="philosophy-mark">V.</span>
      </Reveal>
      <section className="community-section page-wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ON THE STREET. IN YOUR ELEMENT.</p>
            <h2>The VODE edit.</h2>
          </div>
          <a
            href={brand.instagram}
            target="_blank"
            rel="noreferrer"
            className="underlined-link"
          >
            {brand.instagramHandle} <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="community-grid">
          {brand.community.map((item, index) => (
            <a
              href={brand.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label={`Follow VODE on Instagram: ${item.alt}`}
              key={item.image}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width:700px) 45vw, 24vw"
              />
              <span>
                THE VODE EDIT / 0{index + 1}
                <ArrowUpRight size={16} />
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
