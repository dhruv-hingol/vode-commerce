"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Plus,
  Minus,
  ZoomIn,
  Truck,
  RefreshCw,
} from "lucide-react";
import { colorHex, variantStock, type Product, products } from "@/lib/products";
import { money } from "@/lib/cart";
import { useCartStore } from "@/store/useCartStore";
import { WishlistButton } from "./product-card";
import ProductCard from "./product-card";
import Modal from "./modal";

export default function ProductDetail({ product }: { product: Product }) {
  const [size, setSize] = useState("");
  const [color, setColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [sizeGuide, setSizeGuide] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const ready = useCartStore((s) => s.hasHydrated);
  const addToCart = useCartStore((s) => s.addToCart);
  const router = useRouter();
  const stock = size
    ? variantStock(product, size, color)
    : Math.max(
        ...product.variants
          .filter((v) => v.color === color)
          .map((v) => v.stock),
        0,
      );
  useEffect(() => {
    try {
      const raw: unknown = JSON.parse(
        localStorage.getItem("vode-recent") || "[]",
      );
      const ids = Array.isArray(raw)
        ? raw
            .filter(
              (id): id is string =>
                typeof id === "string" &&
                id !== product.id &&
                products.some((p) => p.id === id),
            )
            .slice(0, 4)
        : [];
      setRecent(ids);
      localStorage.setItem(
        "vode-recent",
        JSON.stringify([product.id, ...ids].slice(0, 5)),
      );
    } catch {
      /* Browsing remains available without storage. */
    }
  }, [product.id]);
  function add(buyNow = false) {
    if (!size) {
      setError("Choose your size to continue.");
      document.getElementById("product-sizes")?.focus();
      return;
    }
    if (stock < quantity) {
      setError(
        "This quantity is not available in your selected size and colour.",
      );
      return;
    }
    const existing =
      useCartStore
        .getState()
        .items.find(
          (i) =>
            i.productId === product.id && i.size === size && i.color === color,
        )?.quantity || 0;
    if (existing + quantity > stock) {
      setError(
        `You already have ${existing} in your bag. Only ${stock} available in this variation.`,
      );
      return;
    }
    setError("");
    addToCart(product.id, size, color, quantity);
    if (buyNow) {
      useCartStore.getState().closeCart();
      router.push("/checkout");
    }
  }
  return (
    <main className="page-wrap product-page" id="main-content">
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link
          href={`/collections/${product.category === "Shirts" ? "shirts" : "t-shirts"}`}
        >
          {product.category}
        </Link>
        <span>/</span>
        {product.name}
      </div>
      <div className="product-detail">
        <div className="product-gallery">
          <button
            className="detail-art"
            onClick={() => setZoom(true)}
            aria-label={`Enlarge image of ${product.name}`}
          >
            <Image
              src={product.gallery[imageIndex].src}
              alt={product.gallery[imageIndex].alt}
              width={900}
              height={1100}
              sizes="(max-width:700px) 90vw, 50vw"
              preload
            />
            <span className="gallery-zoom">
              <ZoomIn size={19} />
            </span>
            {product.photography !== "original" && (
              <span className="art-caption">
                SAMPLE / REFERENCE PHOTOGRAPHY
              </span>
            )}
          </button>
          <div className="gallery-thumbs">
            {product.gallery.map((item, i) => (
              <button
                key={i}
                onClick={() => setImageIndex(i)}
                aria-label={`View image ${i + 1}`}
                aria-pressed={imageIndex === i}
              >
                <Image src={item.src} alt="" width={75} height={90} />
              </button>
            ))}
          </div>
        </div>
        <div className="detail-content">
          <p className="eyebrow">
            THE VODE EDIT / {product.category.toUpperCase()}
          </p>
          <div className="detail-title">
            <h1>{product.name}</h1>
            <WishlistButton id={product.id} />
          </div>
          <p className="detail-price">
            {money(product.discountedPrice)}{" "}
            <del>{money(product.originalPrice)}</del>
            <span className="discount-label">
              {Math.round(
                (1 - product.discountedPrice / product.originalPrice) * 100,
              )}
              % OFF
            </span>
          </p>
          <p className="tax-note">
            Preview price · final pricing confirmed at launch
          </p>
          <p className="detail-description">{product.description}</p>
          <fieldset>
            <legend>
              COLOUR <span>{color}</span>
            </legend>
            <div className="option-row">
              {product.colors.map((option) => (
                <button
                  className={`color-option ${color === option ? "selected" : ""}`}
                  key={option}
                  onClick={() => {
                    setColor(option);
                    setQuantity(1);
                    setError("");
                  }}
                  aria-pressed={color === option}
                >
                  <span
                    className="swatch"
                    style={{ background: colorHex[option] }}
                  />
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="size-label">
            <span>SELECT SIZE</span>
            <button
              className="text-link plain-button"
              onClick={() => setSizeGuide(true)}
            >
              Size guide
            </button>
          </div>
          <fieldset
            id="product-sizes"
            tabIndex={-1}
            aria-label="Select size"
            aria-describedby={error ? "size-error" : undefined}
          >
            <div className="option-row">
              {product.sizes.map((option) => (
                <button
                  className={`size-option ${size === option ? "selected" : ""}`}
                  key={option}
                  disabled={!variantStock(product, option, color)}
                  onClick={() => {
                    setSize(option);
                    setQuantity(1);
                    setError("");
                  }}
                  aria-pressed={size === option}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
          {error && (
            <p className="field-error" id="size-error" role="alert">
              {error}
            </p>
          )}
          <div className="stock-note">
            <span className={stock ? "stock-dot" : "stock-dot sold"} />
            {stock
              ? product.isSample
                ? "Confirm availability and measurements on WhatsApp"
                : `${stock} available in this variation`
              : "This variation is sold out"}
          </div>
          <div className="purchase-row">
            <div className="quantity-control">
              <button
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => q - 1)}
              >
                <Minus size={14} />
              </button>
              <span>{quantity}</span>
              <button
                aria-label="Increase quantity"
                disabled={quantity >= stock}
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              className="button primary product-add"
              disabled={!ready || !stock}
              onClick={() => add()}
            >
              ADD TO BAG <Plus size={16} />
            </button>
          </div>
          <button
            className="button secondary buy-now"
            disabled={!ready || !stock}
            onClick={() => add(true)}
          >
            BUY NOW <ArrowUpRight size={17} />
          </button>
          <p className="small muted purchase-note">
            Your order is finalised after our team confirms it on WhatsApp.
          </p>
          <div className="detail-service">
            <span>
              <Truck size={17} /> Delivery across India
            </span>
            <span>
              <RefreshCw size={17} /> Personal order assistance
            </span>
          </div>
          <div className="product-accordions">
            {[
              ["Fabric & fit", `${product.fabric} ${product.fit}`],
              ["The details", product.embroidery],
              ["Care guide", product.care],
              [
                "Delivery & exchanges",
                "Delivery charges, dispatch timing and exchange eligibility are confirmed by our team on WhatsApp before you finalise your order. Read our shipping and exchange policy templates or contact us for current terms.",
              ],
            ].map(([title, text]) => (
              <details key={title}>
                <summary>
                  {title}
                  <Plus size={14} />
                </summary>
                <p>{text}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
      <section className="related-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CONTINUE YOUR EXPRESSION</p>
            <h2>Better together.</h2>
          </div>
          <Link href="/shop" className="underlined-link">
            VIEW THE EDIT ↗
          </Link>
        </div>
        <div className="product-grid">
          {products
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
      {recent.length > 0 && (
        <section className="related-section">
          <p className="eyebrow">A SECOND LOOK</p>
          <h2>Recently considered.</h2>
          <div className="product-grid">
            {recent.map((id) => (
              <ProductCard
                product={products.find((p) => p.id === id)!}
                key={id}
              />
            ))}
          </div>
        </section>
      )}
      <div className="mobile-purchase">
        <span>
          {money(product.discountedPrice)}
          <small>{size ? `${size} / ${color}` : "Select a size above"}</small>
        </span>
        <button
          className="button primary"
          disabled={!ready || !stock}
          onClick={() => add()}
        >
          ADD TO BAG <Plus size={15} />
        </button>
      </div>
      {zoom && (
        <Modal
          title="Image viewer"
          className="image-viewer"
          onClose={() => setZoom(false)}
        >
          <Image
            src={product.gallery[imageIndex].src}
            alt={product.gallery[imageIndex].alt}
            width={1400}
            height={1700}
            sizes="90vw"
          />
          <div className="viewer-controls">
            <button
              className="button secondary"
              onClick={() =>
                setImageIndex(
                  (i) =>
                    (i - 1 + product.gallery.length) % product.gallery.length,
                )
              }
            >
              ← PREVIOUS
            </button>
            <span>
              {imageIndex + 1} / {product.gallery.length}
            </span>
            <button
              className="button secondary"
              onClick={() =>
                setImageIndex((i) => (i + 1) % product.gallery.length)
              }
            >
              NEXT →
            </button>
          </div>
        </Modal>
      )}
      {sizeGuide && (
        <Modal
          title="Size guide"
          className="size-guide-modal"
          onClose={() => setSizeGuide(false)}
        >
          <p className="eyebrow">FIND YOUR FIT</p>
          <h2>A little room to be you.</h2>
          <p>
            Illustrative body measurements in inches. These are guidance only;
            ask our team for approved garment measurements before ordering.
          </p>
          <table>
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest</th>
                <th>Waist</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["S", "36–38", "28–30"],
                ["M", "38–40", "30–32"],
                ["L", "40–42", "32–34"],
                ["XL", "42–44", "34–36"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((v, i) =>
                    i === 0 ? <th key={i}>{v}</th> : <td key={i}>{v}</td>,
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <Link className="underlined-link" href="/contact">
            ASK US ABOUT YOUR FIT ↗
          </Link>
        </Modal>
      )}
    </main>
  );
}
