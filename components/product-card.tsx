"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Heart, Plus } from "lucide-react";
import { colorHex, variantStock, type Product } from "@/lib/products";
import { money } from "@/lib/cart";
import { brand } from "@/lib/config";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import Modal from "./modal";
export function WishlistButton({ id }: { id: string }) {
  const saved = useWishlistStore((s) => s.ids.includes(id));
  const toggle = useWishlistStore((s) => s.toggle);
  return (
    <button
      className={`icon-button wish-button ${saved ? "saved" : ""}`}
      onClick={() => toggle(id)}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={saved}
    >
      <Heart
        size={18}
        fill={saved ? "currentColor" : "none"}
        strokeWidth={1.4}
      />
    </button>
  );
}
export default function ProductCard({ product, wide = false }: { product: Product; wide?: boolean }) {
  const [quick, setQuick] = useState(false);
  const [size, setSize] = useState("");
  const [color, setColor] = useState(product.colors[0]);
  const [error, setError] = useState("");
  const photos = useRef<HTMLDivElement>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const add = useCartStore((s) => s.addToCart);
  const ready = useCartStore((s) => s.hasHydrated);
  const inStock = product.variants.some((v) => v.stock > 0);
  function goToPhoto(index: number) {
    const track = photos.current;
    if (!track) return;
    const next = (index + product.gallery.length) % product.gallery.length;
    track.scrollTo({
      left: next * track.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }
  return (
    <article className="product-card">
      <div className="product-photo">
        <div
          ref={photos}
          className="product-image-track"
          role="group"
          aria-label={`${product.name} photos`}
          tabIndex={0}
          onScroll={(event) => {
            const track = event.currentTarget;
            setPhotoIndex(Math.round(track.scrollLeft / track.clientWidth));
          }}
        >
          {product.gallery.map((photo, index) => (
            <Link href={`/products/${product.id}`} aria-label={`${product.name}${index ? `, photo ${index + 1}` : ""}`} key={photo.src}>
              <Image src={photo.src} alt={photo.alt} fill sizes={wide ? "(max-width:700px) 48vw, 50vw" : "(max-width:700px) 48vw, (max-width:1199px) 50vw, 48vw"} />
            </Link>
          ))}
        </div>
        {product.gallery.length > 1 && (
          <>
          <button type="button" className="product-image-arrow product-image-arrow--previous" aria-label={`Previous photo of ${product.name}`} onClick={() => goToPhoto(photoIndex - 1)}>
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
          <button type="button" className="product-image-arrow product-image-arrow--next" aria-label={`Next photo of ${product.name}`} onClick={() => goToPhoto(photoIndex + 1)}>
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
          <div className="product-image-pagination" aria-label={`${product.name} image navigation`}>
            {product.gallery.map((photo, index) => (
              <button type="button" key={photo.src} aria-label={`Show photo ${index + 1} of ${product.name}`} aria-current={photoIndex === index ? "true" : undefined} onClick={() => goToPhoto(index)}><span /></button>
            ))}
          </div>
          </>
        )}
        <span className={`product-tag ${!inStock ? "product-tag--sold-out" : ""}`}>
          {inStock ? "THE NEW EDIT" : "SOLD OUT"}
        </span>
        <WishlistButton id={product.id} />
        <button className="quick-button" disabled={!inStock} onClick={() => setQuick(true)}>
          {inStock ? <><Plus size={15} /> ADD TO CART</> : "SOLD OUT"}
        </button>
      </div>
      <div className="product-meta">
        <span className="card-brand">{brand.name}</span>
        <p>
          {product.photography === "original"
            ? "PURE COTTON / EMBROIDERED"
            : product.category === "Shirts"
              ? "EMBROIDERED / RELAXED FIT"
              : "ESSENTIAL / OVERSIZED FIT"}
        </p>
        <span>
          {Math.round(
            (1 - product.discountedPrice / product.originalPrice) * 100,
          )}
          % OFF
        </span>
      </div>
      <Link className="product-name" href={`/products/${product.id}`}>
        {product.name}
        <ArrowUpRight size={15} />
      </Link>
      <div className="product-price">
        {money(product.discountedPrice)}{" "}
        <del>{money(product.originalPrice)}</del>
      </div>
      <div
        className="color-dots"
        aria-label={`Colours: ${product.colors.join(", ")}`}
      >
        {product.colors.map((c) => (
          <span key={c} style={{ background: colorHex[c] }} title={c} />
        ))}
        <small>{product.colors.length} {product.colors.length === 1 ? "colour" : "colours"}</small>
      </div>
      {quick && (
        <Modal
          title={`Quick view: ${product.name}`}
          onClose={() => setQuick(false)}
        >
          <div className="quick-layout">
            <div className="quick-photo">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width:700px) 85vw, 400px"
              />
            </div>
            <div className="quick-content">
              <p className="eyebrow">{product.drop || "THE VODE EDIT"}</p>
              <h2>{product.name}</h2>
              <p>
                {money(product.discountedPrice)}{" "}
                <del>{money(product.originalPrice)}</del>
              </p>
              <p className="muted">{product.description}</p>
              <fieldset>
                <legend>COLOUR — {color}</legend>
                <div className="option-row">
                  {product.colors.map((c) => (
                    <button
                      className={`color-option ${c === color ? "selected" : ""}`}
                      onClick={() => setColor(c)}
                      aria-pressed={c === color}
                      key={c}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>SELECT SIZE</legend>
                <div className="option-row">
                  {product.sizes.map((s) => (
                    <button
                      className={`size-option ${s === size ? "selected" : ""}`}
                      key={s}
                      onClick={() => {
                        setSize(s);
                        setError("");
                      }}
                      disabled={!variantStock(product, s, color)}
                      aria-pressed={s === size}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </fieldset>
              {error && (
                <p role="alert" className="field-error">
                  {error}
                </p>
              )}
              <button
                className="button primary"
                disabled={!ready || !inStock}
                onClick={() => {
                  if (!size) {
                    setError("Choose your size to continue.");
                    return;
                  }
                  setQuick(false);
                  add(product.id, size, color);
                }}
              >
                ADD TO BAG <Plus size={16} />
              </button>
              <Link href={`/products/${product.id}`} className="text-link">
                View all details →
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </article>
  );
}
