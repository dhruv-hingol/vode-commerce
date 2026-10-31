"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { products, colorHex, type Product } from "@/lib/products";
import { useWishlistStore } from "@/store/useWishlistStore";
import ProductCard from "./product-card";
import CategoryNavigation from "./category-navigation";

type CatalogueProps = {
  category?: Product["category"];
  wishlist?: boolean;
  productIds?: string[];
  audience?: "men" | "women" | "unisex";
};
export default function Catalogue({
  category,
  wishlist = false,
  productIds,
  audience,
}: CatalogueProps) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const ids = useWishlistStore((s) => s.ids);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = params.get("q") || "";
  const activeCount = [
    "category",
    "size",
    "color",
    "maxPrice",
    "availability",
  ].filter((key) => params.has(key)).length;
  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, {
      scroll: false,
    });
  }
  const result = products
    .filter((p) => {
      if (wishlist && !ids.includes(p.id)) return false;
      if (productIds && !productIds.includes(p.id)) return false;
      if (
        audience &&
        (p.audience || "unisex") !== audience &&
        (p.audience || "unisex") !== "unisex"
      )
        return false;
      if (category && p.category !== category) return false;
      if (params.get("category") && p.category !== params.get("category"))
        return false;
      if (
        query &&
        !`${p.name} ${p.category} ${p.description}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
        return false;
      if (params.get("size") && !p.sizes.includes(params.get("size")!))
        return false;
      if (params.get("color") && !p.colors.includes(params.get("color")!))
        return false;
      if (
        params.get("maxPrice") &&
        p.discountedPrice > Number(params.get("maxPrice"))
      )
        return false;
      if (
        params.get("availability") === "in-stock" &&
        !p.variants.some(
          (v) =>
            v.stock > 0 &&
            (!params.get("size") || v.size === params.get("size")) &&
            (!params.get("color") || v.color === params.get("color")),
        )
      )
        return false;
      return true;
    })
    .sort((a, b) =>
      params.get("sort") === "price-asc"
        ? a.discountedPrice - b.discountedPrice
        : params.get("sort") === "price-desc"
          ? b.discountedPrice - a.discountedPrice
          : params.get("sort") === "latest"
            ? b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id)
            : Number(Boolean(b.drop)) - Number(Boolean(a.drop)) ||
              Number(b.featured) - Number(a.featured),
    );
  return (
    <>
      {!wishlist && <CategoryNavigation />}
      <div className="catalogue-toolbar">
        <button
          className="filter-toggle"
          aria-expanded={filtersOpen}
          aria-controls="collection-filters"
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <SlidersHorizontal size={16} /> FILTER & SORT{" "}
          {activeCount > 0 && `(${activeCount})`}
          <ChevronDown size={14} className={filtersOpen ? "rotated" : ""} />
        </button>
        <p aria-live="polite">
          {result.length} {result.length === 1 ? "piece" : "pieces"}
          {query && ` for “${query}”`}
        </p>
        <label className="sort-label">
          Sort by
          <select
            value={params.get("sort") || "featured"}
            onChange={(event) => update("sort", event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="latest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </label>
      </div>
      <div
        className={`catalogue-layout ${filtersOpen ? "filters-expanded" : ""}`}
      >
        <aside
          id="collection-filters"
          className="filter-sidebar"
          aria-label="Filter products"
          hidden={!filtersOpen}
        >
          <div className="sidebar-heading">
            <h2>Your selection.</h2>
            <button
              className="icon-button"
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          </div>
          {!category && (
            <fieldset>
              <legend>CATEGORY</legend>
              {["", "Shirts"].map((value) => (
                <label className="filter-choice" key={value}>
                  <input
                    type="radio"
                    name="category-filter"
                    checked={(params.get("category") || "") === value}
                    onChange={() => update("category", value)}
                  />
                  {value || "All pieces"}
                </label>
              ))}
            </fieldset>
          )}
          <fieldset>
            <legend>SIZE</legend>
            <div className="option-row">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  className={`size-option ${params.get("size") === size ? "selected" : ""}`}
                  aria-pressed={params.get("size") === size}
                  key={size}
                  onClick={() =>
                    update("size", params.get("size") === size ? "" : size)
                  }
                >
                  {size}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>COLOUR</legend>
            <div className="filter-colours">
              {Object.entries(colorHex).map(([name, hex]) => (
                <button
                  className={`filter-colour ${params.get("color") === name ? "active" : ""}`}
                  key={name}
                  aria-pressed={params.get("color") === name}
                  onClick={() =>
                    update("color", params.get("color") === name ? "" : name)
                  }
                >
                  <span style={{ background: hex }} />
                  {name}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>PRICE RANGE</legend>
            <label className="range-label" htmlFor="price-range">
              Up to ₹
              {Number(params.get("maxPrice") || 2000).toLocaleString("en-IN")}
            </label>
            <input
              id="price-range"
              className="price-range"
              type="range"
              min="999"
              max="2000"
              step="1"
              value={params.get("maxPrice") || 2000}
              onChange={(event) => update("maxPrice", event.target.value)}
            />
            <div className="range-ends">
              <span>₹999</span>
              <span>₹2,000</span>
            </div>
          </fieldset>
          <label className="filter-choice">
            <input
              type="checkbox"
              checked={params.get("availability") === "in-stock"}
              onChange={(event) =>
                update("availability", event.target.checked ? "in-stock" : "")
              }
            />{" "}
            Available pieces only
          </label>
          {(activeCount > 0 || query) && (
            <Link
              className="underlined-link reset-link"
              href={pathname}
              scroll={false}
            >
              CLEAR ALL FILTERS <X size={13} />
            </Link>
          )}
        </aside>
        <div className="catalogue-results">
          {result.length ? (
            <div className="product-grid catalogue-grid grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
              {result.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="catalogue-empty">
              <p className="eyebrow">SPACE FOR SOMETHING YOU LOVE</p>
              <h2>
                {productIds?.length === 0
                  ? "A new chapter is coming."
                  : wishlist
                    ? "Your favourites belong here."
                    : "A fresh perspective?"}
              </h2>
              <p>
                {productIds?.length === 0
                  ? "This collection is taking shape. Explore our pure cotton shirts."
                  : wishlist
                    ? "Tap the heart on a piece to keep it close."
                    : "No pieces match your selection. Try another filter."}
              </p>
              <Link
                href={wishlist || productIds?.length === 0 ? "/shop" : pathname}
                className="button primary"
              >
                {wishlist || productIds?.length === 0
                  ? "EXPLORE THE COLLECTION"
                  : "RESET FILTERS"}{" "}
                ↗
              </Link>
            </div>
          )}
        </div>
      </div>
      <p className="catalogue-note">
        Original VODE photographs accompany The Cotton Signature Drop. Prices,
        sizes and stock are previews; confirm final details before ordering.
      </p>
    </>
  );
}
