import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { brand } from "@/lib/config";
import { newDropProducts } from "@/lib/products";
import ProductCard from "./product-card";
import Reveal from "./reveal";
import CategoryNavigation from "./category-navigation";

export default function NewDrop() {
  return (
    <section
      className="new-drop-section page-wrap"
      id="new-drop"
      aria-labelledby="new-drop-title"
    >
      <Reveal>
        <div className="new-drop-intro">
          <p className="eyebrow">INTRODUCING / THE NEW DROP</p>
          <h2 id="new-drop-title">
            The Cotton Signature Drop
          </h2>
          <p>{brand.newDrop.subtitle}</p>
          <Link href="/collections/new-arrivals" className="underlined-link">
            DISCOVER THE DROP <ArrowUpRight size={18} />
          </Link>
        </div>
      </Reveal>
      <CategoryNavigation />
      <div className="new-drop-products">
        {newDropProducts.map((product, index) => (
          <div key={product.id}>
            <p className="eyebrow drop-index">
              0{index + 1} / {index === 0 ? "MAKE A WISH" : "WHATEVER WILL BE"}
            </p>
              <ProductCard product={product} wide />
            <p className="drop-description">{product.description}</p>
          </div>
        ))}
      </div>
      <p className="catalogue-note">
        Original VODE campaign photography. Preview prices and sizes; confirm
        final availability with our team.
      </p>
    </section>
  );
}
