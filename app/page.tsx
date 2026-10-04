import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";
import { money } from "@/lib/cart";

export default function Home() {
  return (
    <main>
      <section className="hero page-wrap">
        <div>
          <p className="eyebrow">VODE / THE EVERYDAY EDIT</p>
          <h1>
            Good pieces.
            <br />
            <span>Your way.</span>
          </h1>
          <p className="hero-copy">
            A considered wardrobe starts with the everyday.
            <br />
            Find the pieces that feel like you.
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
            <h2>The collection</h2>
          </div>
          <span className="muted small">03 CONSIDERED ESSENTIALS</span>
        </div>
        <p className="sample-notice">
          Preview catalogue — sample products, prices and illustrations.
        </p>
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
                  alt={product.name + " illustration"}
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
    </main>
  );
}
