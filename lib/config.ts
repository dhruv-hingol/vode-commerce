// Public brand details. Never put secrets in this file.
export const brand = {
  name: "VODE",
  motto: "Rule the Street with VODE",
  description:
    "Pure cotton. Fine pinstripes. Expressive embroidery. Discover VODE’s 11:11 and Que Sera shirts in The Cotton Signature Drop.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vode-style.vercel.app",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  instagram: "https://www.instagram.com/vode.co/",
  instagramHandle: "@vode.co",
  currency: "INR",
  shipping: 0,
  shippingLabel: "Delivery charges confirmed on WhatsApp",
  newsletterEmail: process.env.NEXT_PUBLIC_NEWSLETTER_EMAIL || "",
  newDrop: {
    name: "The Cotton Signature Drop",
    subtitle: "Pure cotton. Fine pinstripes. Embroidery with something to say.",
    productIds: ["11-11-cotton-shirt", "que-sera-cotton-shirt"],
  },
  campaign: {
    image: "/videos/vode-campaign-poster.jpg",
    video: "/videos/vode-campaign.mp4",
    alt: "A still from the original VODE campaign film",
  },
  announcements: [
    "THE NEW VODE COLLECTION IS COMING",
    "MADE TO STAND APART",
    "PREMIUM EMBROIDERY. TIMELESS STYLE.",
    "RULE THE STREET WITH VODE",
  ],
  community: [
    {
      image: "/images/drops/eleven-eleven-01.jpg",
      alt: "The 11:11 Cotton Shirt, photographed for VODE",
    },
    {
      image: "/images/drops/eleven-eleven-02.jpg",
      alt: "Red 11:11 and Make a wish chest embroidery",
    },
    {
      image: "/images/drops/que-sera-01.jpg",
      alt: "The Que Sera pure cotton pinstripe shirt",
    },
    {
      image: "/images/drops/que-sera-02.jpg",
      alt: "VODE collar embroidery on the Que Sera shirt",
    },
  ],
};
export const collections = [
  {
    slug: "shirts",
    name: "Embroidered shirts",
    title: "The art of standing apart.",
    description:
      "Quiet statements. Considered stitches. Discover our take on the contemporary casual shirt.",
    image: "/images/drops/eleven-eleven-01.jpg",
  },
  {
    slug: "new-arrivals",
    name: "The Cotton Signature Drop",
    title: "Cotton. Character. Confidence.",
    description:
      "Pure cotton shirts with fine pinstripes and expressive embroidery. Meet The 11:11 and The Que Sera — two signatures, one new chapter.",
    image: "/images/drops/eleven-eleven-01.jpg",
    productIds: ["11-11-cotton-shirt", "que-sera-cotton-shirt"],
  },
  {
    slug: "men",
    name: "Men",
    title: "An independent perspective.",
    description:
      "Pure cotton shirts, considered embroidery and everyday silhouettes. Explore the VODE menswear edit.",
    image: "/images/drops/eleven-eleven-01.jpg",
  },
];
