"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { money } from "@/lib/cart";
import { useCartStore } from "@/store/useCartStore";
import { BagIcon } from "./icons";

export default function ProductDetail({ product }: { product: Product }) {
  const [size, setSize] = useState("");
  const [color, setColor] = useState(product.colors[0]);
  const [error, setError] = useState("");
  const ready = useCartStore((state) => state.hasHydrated);
  const addToCart = useCartStore((state) => state.addToCart);
  const openCart = useCartStore((state) => state.openCart);
  return (
    <main className="page-wrap">
      <Link href="/#collection" className="back-link">
        ← Back to the collection
      </Link>
      <div className="product-detail">
        <div className="detail-art">
          <Image
            src={product.image}
            alt={
              product.name + (product.isSample ? " — illustrative sample" : "")
            }
            width={700}
            height={800}
            priority
          />
          {product.isSample && (
            <span className="art-caption">
              SAMPLE PRODUCT · ILLUSTRATIVE IMAGE
            </span>
          )}
        </div>
        <div className="detail-content">
          <p className="eyebrow">
            THE EVERYDAY EDIT {product.isSample ? "/ SAMPLE CATALOGUE" : ""}
          </p>
          <h1>{product.name}</h1>
          <p className="detail-price">
            {money(product.discountedPrice)}{" "}
            <del>{money(product.originalPrice)}</del>
          </p>
          <p className="detail-description">{product.description}</p>
          <p className="small muted">
            Need help choosing?{" "}
            <Link href="/style-guide#measurements" className="text-link">
              Read the fit guide
            </Link>{" "}
            or check our{" "}
            <Link href="/help" className="text-link">
              ordering FAQ
            </Link>
            .
          </p>
          <fieldset>
            <legend>
              COLOR <span>{color}</span>
            </legend>
            <div className="option-row">
              {product.colors.map((option) => (
                <button
                  type="button"
                  aria-pressed={color === option}
                  className={
                    "color-option " + (color === option ? "selected" : "")
                  }
                  key={option}
                  onClick={() => setColor(option)}
                >
                  <span className={"swatch swatch-" + option.toLowerCase()} />
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset aria-describedby={error ? "size-error" : undefined}>
            <legend>SELECT SIZE</legend>
            <div className="option-row">
              {product.sizes.map((option) => (
                <button
                  type="button"
                  aria-pressed={size === option}
                  className={
                    "size-option " + (size === option ? "selected" : "")
                  }
                  key={option}
                  onClick={() => {
                    setSize(option);
                    setError("");
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
          {error && (
            <p id="size-error" className="field-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="button primary add-to-cart"
            disabled={!ready}
            onClick={() => {
              if (!size) {
                setError("Choose your size before adding to your bag.");
                return;
              }
              addToCart(product.id, size, color);
            }}
          >
            <BagIcon />
            {ready ? "ADD TO CART" : "LOADING YOUR BAG…"}
            <span>↗</span>
          </button>
          <button className="text-button" onClick={openCart}>
            VIEW YOUR BAG
          </button>
          <div className="product-note">
            <strong>A personal way to order.</strong>
            <p>
              Add your favourites, share your order on WhatsApp, and our team
              will take it from there.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
