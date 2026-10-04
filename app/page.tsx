import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";
import { money } from "@/lib/cart";

import StructuredData from "@/components/structured-data";
import { homeStructuredData, pageMetadata, siteDescription } from "@/lib/seo";

export const metadata = pageMetadata(
  "Shirts, T-Shirts & Unisex Clothing",
  siteDescription,
  "/",
);

export default function Home() {
  return (
    <main>
      <StructuredData data={homeStructuredData} />
      <section className="hero page-wrap">
        <div>
          <p className="eyebrow">VODE / THE EVERYDAY EDIT</p>
          <h1>
            Shirts &amp; tees.
            <br />
            <span>Your way.</span>
          </h1>
          <p className="hero-copy">
            Everyday clothing for men, women and unisex styling.
            <br />
            Find your fit. Choose your color. Order on WhatsApp.
          </p>
          <a href="#collection" className="button primary hero-button">
            EXPLORE THE COLLECTION <span>↘</span>
          </a>
        </div>
        <div className="hero-art">
          <span className="hero-art-label">LESS, BUT BETTER.</span>
          <Image
            src="/products/shirt.svg"
            width={520}
            height={590}
            alt="Illustration of a sand-colored studio shirt"
            priority
          />
          <span className="hero-art-bottom">
            THE STUDIO SHIRT <span>01 / 03</span>
          </span>
        </div>
      </section>
      <section id="collection" className="collection page-wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">BUILD YOUR EVERYDAY</p>
            <h2>Shirts, T-shirts &amp; hoodies</h2>
          </div>
          <span className="muted small">03 CONSIDERED ESSENTIALS</span>
        </div>
        {products.some((product) => product.isSample) && (
          <p className="sample-notice">
            Preview catalogue — sample products, prices and illustrations.
          </p>
        )}
        <div className="product-grid">
          {products.map((product, index) => (
            <Link
              className="product-card"
              href={"/products/" + product.id}
              key={product.id}
            >
              <div className="product-art">
                <span className="product-index">0{index + 1}</span>
                <Image
                  src={product.image}
                  alt={product.name + (product.isSample ? " illustration" : "")}
                  width={450}
                  height={520}
                />
                <span className="product-arrow">↗</span>
              </div>
              <div className="product-card-info">
                <h3>{product.name}</h3>
                <span>
                  {money(product.discountedPrice)}{" "}
                  <del>{money(product.originalPrice)}</del>
                </span>
              </div>
              <p className="muted small">
                {product.colors.join(" / ")} · {product.sizes[0]}–
                {product.sizes.at(-1)}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <section className="how-it-works page-wrap">
        <p className="eyebrow">FROM YOUR BAG TO YOUR DOOR</p>
        <h2>A more personal checkout.</h2>
        <div className="steps">
          <div>
            <span>01</span>
            <h3>Make it yours</h3>
            <p>Choose your pieces, size and color.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Review your bag</h3>
            <p>Add your delivery details at checkout.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Say hello on WhatsApp</h3>
            <p>Send your order. We’ll handle the rest with you.</p>
          </div>
        </div>
      </section>
      <section className="discovery-section page-wrap">
        <p className="eyebrow">CLOTHING THAT FITS YOUR EVERYDAY</p>
        <h2>Shirts, T-shirts &amp; unisex styling.</h2>
        <p>
          Explore everyday clothing for men and women with a focus on the fit
          you enjoy. Start with shirts and tees, compare sizes and colors, and
          talk to VODE about your selection before confirming your WhatsApp
          order.
        </p>
        <div className="discovery-links">
          <Link href="/style-guide" className="text-link">
            Read the clothing &amp; fit guide →
          </Link>
          <Link href="/help" className="text-link">
            Sizing, delivery &amp; ordering answers →
          </Link>
        </div>
      </section>
    </main>
  );
}
