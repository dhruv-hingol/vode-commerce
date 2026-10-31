export type Product = {
  id: string;
  category: "Shirts" | "T-shirts";
  isSample: boolean;
  photography: "original" | "concept";
  audience: "men" | "women" | "unisex";
  drop: string;
  name: string;
  description: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  sizes: readonly string[];
  colors: readonly string[];
  gallery: { src: string; alt: string }[];
  fabric: string;
  fit: string;
  embroidery: string;
  care: string;
  featured: boolean;
  createdAt: string;
  variants: { sku: string; size: string; color: string; stock: number }[];
  seo: { title: string; description: string };
};

// Only the two original VODE shirts are listed. Prices, sizes and inventory are
// preview values until the brand confirms launch details. No invented offers
// are indexed while isSample=true. Each photo gallery stays with its own shirt.
const shared = {
  category: "Shirts" as const,
  isSample: true,
  photography: "original" as const,
  audience: "men" as const,
  drop: "The Cotton Signature Drop",
  sizes: ["S", "M", "L", "XL"],
  originalPrice: 1999,
  fit: "Long sleeves, a button-through front and a classic collar. Confirm garment measurements with our team for your preferred fit.",
  care: "Check the garment care label before washing. Ask our team for the care instructions for your selected shirt.",
  featured: true,
  createdAt: "2026-10-31",
};
export const products: Product[] = [
  {
    ...shared,
    id: "11-11-cotton-shirt",
    name: "The 11:11 Cotton Shirt",
    image: "/images/drops/eleven-eleven-01.jpg",
    gallery: [
      {
        src: "/images/drops/eleven-eleven-01.jpg",
        alt: "VODE black pinstripe pure cotton shirt with red 11:11 chest embroidery, front view",
      },
      {
        src: "/images/drops/eleven-eleven-02.jpg",
        alt: "The 11:11 Cotton Shirt showing red Make a wish embroidery and VODE collar detail",
      },
      {
        src: "/images/drops/eleven-eleven-closeup-chest.jpg",
        alt: "Close-up of red 11:11 and white Make a wish embroidery on black pinstripe cotton",
      },
      {
        src: "/images/drops/eleven-eleven-closeup-collar.jpg",
        alt: "Close-up of red VODE collar embroidery and a white button on the black pinstripe shirt",
      },
    ],
    description:
      "Make a wish. Make an impression. Pure cotton in black pinstripes, finished with red 11:11 embroidery, delicate ‘Make a wish’ script and a signature VODE collar detail.",
    fabric: "100% cotton. Black fabric with fine contrasting pinstripes.",
    embroidery:
      "Red 11:11 chest embroidery with ‘Make a wish’ script beneath. Contrasting red VODE embroidery on the collar.",
    discountedPrice: 1499,
    colors: ["Ink"],
    variants: ["S", "M", "L", "XL"].map((size) => ({
      sku: `VODE-1111-INK-${size}`,
      size,
      color: "Ink",
      stock: 30,
    })),
    seo: {
      title: "The 11:11 Pure Cotton Embroidered Shirt",
      description:
        "A black pinstripe pure cotton shirt with detailed red 11:11, Make a wish and VODE collar embroidery.",
    },
  },
  {
    ...shared,
    id: "que-sera-cotton-shirt",
    name: "The Que Sera Cotton Shirt",
    image: "/images/drops/que-sera-01.jpg",
    gallery: [
      {
        src: "/images/drops/que-sera-01.jpg",
        alt: "VODE white pinstripe pure cotton shirt with red Que Sera Sera embroidery, full styling view",
      },
      {
        src: "/images/drops/que-sera-02.jpg",
        alt: "The Que Sera Cotton Shirt close view showing VODE collar embroidery and fine pinstripes",
      },
      {
        src: "/images/drops/que-sera-closeup-collar.jpg",
        alt: "Close-up of red VODE collar embroidery on white cotton with black pinstripes",
      },
      {
        src: "/images/drops/que-sera-closeup-chest.jpg",
        alt: "Close-up of red Que Sera, Sera script embroidery on the white pinstripe shirt",
      },
    ],
    description:
      "Whatever will be, wear it your way. A pure cotton shirt in crisp white pinstripes, detailed with flowing red ‘Que Sera Sera’ chest embroidery and a signature VODE collar.",
    fabric: "100% cotton. White fabric with fine contrasting pinstripes.",
    embroidery:
      "Red ‘Que Sera Sera’ script embroidered across the chest, with contrasting VODE embroidery on the collar.",
    discountedPrice: 1399,
    colors: ["Chalk"],
    variants: ["S", "M", "L", "XL"].map((size) => ({
      sku: `VODE-QSS-CHALK-${size}`,
      size,
      color: "Chalk",
      stock: 30,
    })),
    seo: {
      title: "The Que Sera Pure Cotton Embroidered Shirt",
      description:
        "A white pinstripe pure cotton shirt with detailed red Que Sera Sera script and VODE collar embroidery.",
    },
  },
];
export const newDropProducts = products;
export const findProduct = (id: string) =>
  products.find((product) => product.id === id);
export const variantStock = (product: Product, size: string, color: string) =>
  product.variants.find(
    (variant) => variant.size === size && variant.color === color,
  )?.stock ?? 0;
export const colorHex: Record<string, string> = {
  Ink: "#252522",
  Chalk: "#eeeae0",
};
