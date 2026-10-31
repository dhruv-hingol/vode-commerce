import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { brand } from "@/lib/config";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Our Story — A New Perspective",
  "Meet VODE. Our vision for thoughtful embroidery, modern silhouettes and effortless confidence in everyday clothing.",
  "/about",
);
export default function About() {
  return (
    <main id="main-content">
      <section className="story-banner">
        <div>
          <p className="eyebrow">
            INDEPENDENT IN SPIRIT. CONSIDERED BY DESIGN.
          </p>
          <h1>
            Less noise.
            <br />
            <em>More you.</em>
          </h1>
        </div>
      </section>
      <div className="page-wrap story-content">
        <p
          className="eyebrow"
          style={{ textAlign: "center", color: "var(--accent)" }}
        >
          THE STORY OF VODE
        </p>
        <p className="story-lead">
          We believe the most compelling style is the kind that feels like you.
          No performance. No permission. Just quiet confidence.
        </p>
        <section className="story-row">
          <span className="eyebrow">01 / OUR PHILOSOPHY</span>
          <div>
            <h2>A new expression of everyday.</h2>
            <p>
              VODE is an emerging Indian fashion label with a simple point of
              view: the everyday deserves a little more thought. Our vision
              brings together contemporary streetwear, understated detail and
              silhouettes that give you space to be yourself.
            </p>
          </div>
        </section>
        <section className="story-row" id="craft">
          <span className="eyebrow">02 / OUR APPROACH</span>
          <div>
            <h2>The detail makes the difference.</h2>
            <p>
              Our first collection brings together pure cotton and detailed
              embroidery. Texture, proportion and the character of a stitch
              guide our design direction. We will share the final fabrics,
              production details and garment measurements when the collection is
              ready.
            </p>
          </div>
        </section>
        <section className="story-row">
          <span className="eyebrow">03 / OUR VISION</span>
          <div>
            <h2>Wear your own perspective.</h2>
            <p>
              Clothing should make room for individuality. We’re building VODE
              for those who value an independent perspective, a thoughtful
              wardrobe and the confidence to make an everyday piece their own.
            </p>
            <div className="story-actions">
              <Link href="/shop" className="button primary">
                EXPLORE THE COLLECTION <ArrowUpRight size={17} />
              </Link>
              <a
                className="underlined-link"
                href={brand.instagram}
                target="_blank"
                rel="noreferrer"
              >
                FOLLOW THE JOURNEY <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>
        <p className="catalogue-note">
          Original VODE photography. Final prices, sizes and availability will
          be confirmed at launch.
        </p>
      </div>
    </main>
  );
}
