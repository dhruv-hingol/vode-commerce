import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
const policies: Record<
  string,
  { title: string; intro: string; sections: { title: string; text: string }[] }
> = {
  shipping: {
    title: "Shipping & delivery",
    intro: "A considered journey, from our collection to your wardrobe.",
    sections: [
      {
        title: "Before you order",
        text: "Our team will confirm delivery serviceability for your Indian PIN code, dispatch estimates, shipping charges and tracking arrangements on WhatsApp before finalising your order.",
      },
      {
        title: "Delivery charges",
        text: "Your bag shows the product total. Unconfirmed delivery charges are excluded. Please review the complete amount with our team before paying.",
      },
    ],
  },
  returns: {
    title: "Returns & exchanges",
    intro: "Getting the fit right begins with a conversation.",
    sections: [
      {
        title: "Confirm your fit",
        text: "Check garment measurements and discuss your preferred fit with VODE before ordering. Ask our team to confirm exchange eligibility for the exact piece you choose.",
      },
      {
        title: "Before finalising an order",
        text: "The return window, condition requirements, exclusions, refund method and any collection or exchange delivery costs must be confirmed with VODE before payment. A fixed return policy has not yet been published.",
      },
    ],
  },
  privacy: {
    title: "Privacy",
    intro: "Your details deserve the same care as your wardrobe.",
    sections: [
      {
        title: "Your browser",
        text: "Your bag, wishlist and recently viewed pieces are stored in your browser using local storage. Clearing your browser’s site data removes these saved preferences. Delivery form details remain in page memory and are not saved by this storefront.",
      },
      {
        title: "WhatsApp & external links",
        text: "When you prepare an order, your delivery details and selected products are included in a WhatsApp link. Review the message before sending it. WhatsApp, Instagram and your email provider operate under their own privacy policies.",
      },
      {
        title: "Before launch",
        text: "The business must complete its privacy notice with its legal identity, privacy contact, retention periods, rights request process and any future analytics or email provider details before collecting additional customer data.",
      },
    ],
  },
  terms: {
    title: "Terms & conditions",
    intro: "A clear understanding. A more personal experience.",
    sections: [
      {
        title: "Preview catalogue",
        text: "The current catalogue uses sample products, illustrative prices, concept imagery and sample inventory. These do not represent a confirmed offer of merchandise. Final specifications and availability are confirmed by VODE.",
      },
      {
        title: "Ordering",
        text: "This website prepares a WhatsApp message and does not process payments. Opening WhatsApp does not place a confirmed or paid order. Your order is finalised only after agreement with the VODE team.",
      },
      {
        title: "Business details",
        text: "Before launch, the business must add its legal name, registered address, applicable tax details, customer grievance contact and approved commercial terms.",
      },
    ],
  },
};
export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = policies[slug];
  if (!policy) notFound();
  return pageMetadata(policy.title, policy.intro, `/policies/${slug}`, true);
}
export default async function Policy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = policies[slug];
  if (!policy) notFound();
  return (
    <main className="page-wrap editorial-page" id="main-content">
      <Link href="/" className="back-link">
        ← Back to VODE
      </Link>
      <p className="eyebrow">VODE / CUSTOMER CARE</p>
      <h1>{policy.title}.</h1>
      <p className="editorial-intro">{policy.intro}</p>
      <p className="policy-note">
        Pre-launch policy template. Final business terms will be published
        before the collection becomes available to order.
      </p>
      {policy.sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.text}</p>
        </section>
      ))}
      <Link className="underlined-link" href="/contact">
        SPEAK WITH OUR TEAM ↗
      </Link>
    </main>
  );
}
