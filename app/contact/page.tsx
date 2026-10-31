import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { brand } from "@/lib/config";
import { pageMetadata } from "@/lib/seo";
import ContactForm from "@/components/contact-form";
export const metadata = pageMetadata(
  "Contact — A Conversation Away",
  "Need help with your fit, a VODE piece or your WhatsApp order? Get in touch with our team.",
  "/contact",
);
export default function Contact() {
  const number = brand.whatsapp.replace(/[\s()+-]/g, "");
  return (
    <main className="page-wrap" id="main-content">
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>Contact
      </div>
      <div className="collection-intro">
        <p className="eyebrow">GOOD STYLE STARTS WITH A CONVERSATION</p>
        <h1>
          A little closer.
          <br />
          <em>A conversation away.</em>
        </h1>
      </div>
      <div className="contact-layout">
        <div className="contact-copy">
          <h2>Let’s talk.</h2>
          <p>
            A question about sizing? A piece you have your eye on? We’re here to
            help you find your own expression.
          </p>
          <a
            className="contact-link"
            href={brand.instagram}
            target="_blank"
            rel="noreferrer"
          >
            INSTAGRAM / {brand.instagramHandle}
            <ArrowUpRight size={17} />
          </a>
          {brand.email && (
            <a className="contact-link" href={`mailto:${brand.email}`}>
              {brand.email}
              <ArrowUpRight size={17} />
            </a>
          )}
          {/^[1-9]\d{7,14}$/.test(number) && (
            <a
              className="contact-link"
              href={`https://wa.me/${number}`}
              target="_blank"
              rel="noreferrer"
            >
              WHATSAPP / +{number}
              <ArrowUpRight size={17} />
            </a>
          )}
          <Link href="/help" className="contact-link">
            ORDERING & DELIVERY QUESTIONS <ArrowUpRight size={17} />
          </Link>
          <Link href="/style-guide" className="contact-link">
            FIND YOUR FIT <ArrowUpRight size={17} />
          </Link>
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
