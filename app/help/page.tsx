import Link from "next/link";
import StructuredData from "@/components/structured-data";
import { faqs } from "@/lib/faqs";
import { absoluteUrl, breadcrumbs, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Ordering, Sizing & Delivery FAQ",
  "Get answers about VODE clothing sizes, unisex fit, WhatsApp ordering, delivery in India and keeping your cart saved.",
  "/help",
);

export default function HelpPage() {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(
    /[\s()+-]/g,
    "",
  );
  const contactUrl = /^[1-9]\d{7,14}$/.test(number)
    ? "https://wa.me/" + number
    : undefined;
  return (
    <main className="page-wrap editorial-page">
      <StructuredData data={breadcrumbs("Help & FAQs", "/help")} />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": absoluteUrl("/help#faq"),
          url: absoluteUrl("/help"),
          inLanguage: "en-IN",
          mainEntity: faqs.map(({ question, answer }) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        }}
      />
      <Link href="/" className="back-link">
        ← Back to VODE
      </Link>
      <p className="eyebrow">HERE TO HELP</p>
      <h1>Clothing, fit & ordering questions.</h1>
      <p className="editorial-intro">
        A few useful answers before you choose your next shirt or T-shirt. For
        details specific to your selection, speak with the VODE team.
      </p>
      <div className="faq-list">
        {faqs.map(({ question, answer }) => (
          <section key={question}>
            <h2>{question}</h2>
            <p>{answer}</p>
          </section>
        ))}
      </div>
      <div className="editorial-callout">
        <h2>Still deciding?</h2>
        <p>
          Read our{" "}
          <Link href="/style-guide">shirt, T-shirt and unisex fit guide</Link>,
          or discuss your size and delivery details with us.
        </p>
        {contactUrl && (
          <a
            className="button primary"
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            CHAT WITH VODE ON WHATSAPP ↗
          </a>
        )}
      </div>
    </main>
  );
}
