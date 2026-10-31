"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { href: "/collections/men", label: "All menswear" },
  { href: "/collections/shirts", label: "Shirts" },
  { href: "/collections/t-shirts", label: "T-shirts", soldOut: true },
];

export default function CategoryNavigation() {
  const pathname = usePathname();
  return (
    <nav className="category-navigation" aria-label="Shop by category">
      {categories.map((category) => (
        <Link
          href={category.href}
          key={category.href}
          aria-current={pathname === category.href ? "page" : undefined}
        >
          {category.label}
          {category.soldOut && <small>Sold out</small>}
        </Link>
      ))}
    </nav>
  );
}
