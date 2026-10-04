export type Product = {
  id: string;
  category: string;
  isSample: boolean;
  name: string;
  description: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  sizes: readonly string[];
  colors: readonly string[];
};

// Sample catalogue: replace with approved VODE products before launch.
export const products: Product[] = [
  {
    id: "everyday-tee",
    category: "T-shirts",
    isSample: true,
    name: "The Everyday Tee",
    description:
      "A relaxed silhouette for your everyday rotation. Clean lines, an easy fit, and room to make it your own.",
    image: "/products/tee.svg",
    originalPrice: 1499,
    discountedPrice: 999,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Ink", "Chalk"],
  },
  {
    id: "studio-shirt",
    category: "Shirts",
    isSample: true,
    name: "The Studio Shirt",
    description:
      "An understated layer with an effortless shape. Wear it open, buttoned up, or entirely your way.",
    image: "/products/shirt.svg",
    originalPrice: 2499,
    discountedPrice: 1799,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Sand", "Ink"],
  },
  {
    id: "off-duty-hoodie",
    category: "Hoodies",
    isSample: true,
    name: "The Off-Duty Hoodie",
    description:
      "A generous fit with a pared-back finish. Made for slow mornings and everything that follows.",
    image: "/products/hoodie.svg",
    originalPrice: 3499,
    discountedPrice: 2499,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Stone", "Ink"],
  },
];

export const findProduct = (id: string) =>
  products.find((product) => product.id === id);
