"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Heart, Plus } from "lucide-react";
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
  const add = useCartStore((s) => s.addToCart);
  const ready = useCartStore((s) => s.hasHydrated);
  const inStock = product.variants.some((v) => v.stock > 0);
  return (
    <article className="product-card">
      <div className="product-photo">
        <Link href={`/products/${product.id}`} aria-label={product.name}>
          <Image
            src={product.image}
            alt={product.gallery[0].alt}
            fill
            sizes={wide ? "(max-width:700px) 88vw, 44vw" : "(max-width:767px) 88vw, (max-width:1279px) 29vw, 22vw"}
          />
          {product.gallery[1] && (
            <Image
              className="secondary-photo"
              src={product.gallery[1].src}
              alt=""
              fill
              sizes={wide ? "(max-width:700px) 88vw, 44vw" : "(max-width:767px) 88vw, (max-width:1279px) 29vw, 22vw"}
            />
          )}
        </Link>
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
