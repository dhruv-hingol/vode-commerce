import Link from "next/link";
import StructuredData from "@/components/structured-data";
import { absoluteUrl, breadcrumbs, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Shirt, T-Shirt & Unisex Fit Guide",
  "Choose shirts and T-shirts by fit, measurements and styling. A practical everyday clothing guide for men, women and unisex wardrobes from VODE.",
  "/style-guide",
);

export default function StyleGuide() {
  return (
    <main className="page-wrap editorial-page">
      <StructuredData
        data={breadcrumbs("Clothing & Fit Guide", "/style-guide")}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          url: absoluteUrl("/style-guide"),
          name: "Shirt, T-Shirt & Unisex Fit Guide",
          inLanguage: "en-IN",
          about: [
            { "@type": "Thing", name: "Shirts" },
            { "@type": "Thing", name: "T-shirts" },
            { "@type": "Thing", name: "Clothing fit" },
          ],
        }}
      />
      <Link href="/" className="back-link">
        ← Back to VODE
      </Link>
      <p className="eyebrow">THE VODE FIT NOTES</p>
      <h1>
        Find your fit.
        <br />
        Make it your own.
      </h1>
      <p className="editorial-intro">
        For shirts, T-shirts and unisex clothing, the best starting point is how
        you want the garment to fit. Compare measurements, decide how you will
        wear it, and confirm the details before ordering.
      </p>
      <nav aria-label="Guide sections" className="guide-navigation">
        <a href="#shirts">Shirts</a>
        <a href="#t-shirts">T-shirts</a>
        <a href="#unisex-fit">Unisex fit</a>
        <a href="#measurements">Measurements</a>
      </nav>
      <section id="shirts">
        <h2>How to choose an everyday shirt</h2>
        <p>
          Start with how you plan to wear it. For a buttoned shirt, check that
          the chest has enough room for comfortable movement. For an open layer
          over a T-shirt, allow space for the garment underneath. Shoulder width
          and sleeve length matter alongside the chest measurement.
        </p>
        <p>
          For men&apos;s and women&apos;s styling alike, try a shirt with straight-leg
          trousers for a simple outfit, or wear it open over a tee for a more
          relaxed look. A longer hem gives you more room to tuck; check the
          actual length rather than assuming it from a product photo.
        </p>
        <Link href="/products/studio-shirt" className="text-link">
          View the Studio Shirt details →
        </Link>
      </section>
      <section id="t-shirts">
        <h2>How to choose a T-shirt</h2>
        <p>
          Decide whether you want a closer fit or more room through the body.
          Compare chest width and length with a T-shirt you already enjoy
          wearing. A larger size can add length as well as width, so sizing up
          is not always the same as choosing a deliberately oversized cut.
        </p>
        <p>
          Wear a tee on its own with jeans or trousers, or use it as a base
          beneath an open shirt. Check the fabric composition and care label for
          the actual garment before choosing how to wash or dry it; those
          details are not interchangeable across all T-shirts.
        </p>
        <Link href="/products/everyday-tee" className="text-link">
          View the Everyday Tee details →
        </Link>
      </section>
      <section id="unisex-fit">
        <h2>What does unisex fit mean for you?</h2>
        <p>
          Unisex clothing can be styled across genders, but a label alone does
          not describe how a garment will sit on your body. Men and women can
          use the same practical checks: shoulder position, room through the
          chest and hips, sleeve length, and where the hem falls.
        </p>
        <p>
          Choose the silhouette you prefer rather than treating a gender
          category as a size guide. If you want a relaxed look, describe that to
          our team and ask for the garment&apos;s measurements. There is no universal
          conversion between men&apos;s, women&apos;s and unisex letter sizes.
        </p>
      </section>
      <section id="measurements">
        <h2>What should you measure before ordering?</h2>
        <ol className="editorial-steps">
          <li>
            Lay a similar, well-fitting garment flat without stretching it.
          </li>
          <li>
            Measure its chest width from underarm to underarm, shoulder width,
            sleeve length and overall length.
          </li>
          <li>
            Ask whether the product&apos;s size chart uses flat garment widths, full
            circumferences or body measurements, then compare like with like.
          </li>
          <li>
            Tell VODE your preferred fit and ask about any measurement that is
            missing before confirming the order.
          </li>
        </ol>
        <p>
          Measurements vary by product. The catalogue&apos;s S–XL choices are
          selection labels, not a universal size chart.
        </p>
      </section>
      <div className="editorial-callout">
        <h2>Ready to choose?</h2>
        <p>
          Browse the catalogue, check the details of your selection and send
          your order through WhatsApp. Our{" "}
          <Link href="/help">ordering and delivery FAQ</Link> explains what
          happens next.
        </p>
        <Link href="/#collection" className="button primary">
          EXPLORE VODE CLOTHING ↗
        </Link>
      </div>
    </main>
  );
}
