import Link from "next/link";
import BrandLogo from "./brand-logo";
import { WhatsAppIcon } from "./icons";
import { products } from "@/lib/products";

export default function SiteFooter() {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(
    /[\s()+-]/g,
    "",
  );
  const contactUrl = /^[1-9]\d{7,14}$/.test(number)
    ? `https://wa.me/${number}?text=${encodeURIComponent("Hi VODE, I'd like some help choosing my fit.")}`
    : undefined;

  return (
    <footer className="site-footer">
      <div className="footer-invitation">
        <div>
          <p className="eyebrow">GOOD STYLE STARTS WITH A CONVERSATION</p>
          <h2>Find your fit. Say hello.</h2>
          <p>Questions about sizing, colors or ordering? Let’s talk.</p>
        </div>
        {contactUrl ? (
          <a className="button footer-contact" href={contactUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat with VODE on WhatsApp (opens in a new tab)">
            <WhatsAppIcon /> CHAT WITH VODE <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <Link className="button footer-contact" href="/help">
            EXPLORE HELP &amp; FAQs <span aria-hidden="true">↗</span>
          </Link>
        )}
      </div>
      <div className="footer-grid">
        <div className="footer-brand">
          <Link href="/" aria-label="VODE home"><BrandLogo /></Link>
          <p className="footer-tagline">Less noise. More you.</p>
          <p>Everyday pieces. Your own expression.<br />Explore the VODE edit and make it yours.</p>
        </div>
        <nav className="footer-nav" aria-label="Footer collection">
          <h3>THE COLLECTION</h3>
          <Link href="/#collection">Explore all pieces</Link>
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>{product.name}</Link>
          ))}
        </nav>
        <nav className="footer-nav" aria-label="Helpful links">
          <h3>A LITTLE GUIDANCE</h3>
          <Link href="/style-guide">Clothing &amp; fit guide</Link>
          <Link href="/help">Help &amp; FAQs</Link>
          <Link href="/checkout">Review your bag</Link>
        </nav>
        <div className="footer-ordering">
          <h3>A MORE PERSONAL ORDER</h3>
          <p>Choose your pieces, add them to your bag and send your order on WhatsApp.</p>
          <p>We’ll confirm availability, delivery charges and payment details with you.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© VODE. Less noise. More you.</span>
        <span>Catalogue &amp; WhatsApp ordering</span>
        <a href="#top">Back to top <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
