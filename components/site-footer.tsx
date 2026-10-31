import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { brand } from "@/lib/config";
import Newsletter from "./newsletter";
import FooterSignature from "./footer-signature";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid grid gap-10 md:grid-cols-2 xl:grid-cols-4">
        <div className="footer-brand">
          <FooterSignature />
          <p>
            Pure cotton. Expressive embroidery.
            <br />
            An expression entirely your own.
          </p>
          <p className="footer-motto">RULE THE STREET WITH VODE</p>
          <nav
            className="footer-company-links"
            aria-label="Company information"
          >
            <Link href="/about">Our story</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
        <nav className="footer-nav" aria-label="Customer service">
          <h3>CUSTOMER SERVICE</h3>
          <Link href="/style-guide">Size & fit guide</Link>
          <Link href="/help">Help & FAQs</Link>
          <Link href="/policies/shipping">Shipping</Link>
          <Link href="/policies/returns">Returns & exchanges</Link>
          <Link href="/wishlist">Your wishlist</Link>
        </nav>
        <nav
          className="footer-nav footer-social"
          aria-label="Social and collection links"
        >
          <h3>FOLLOW THE STORY</h3>
          <a href={brand.instagram} target="_blank" rel="noreferrer">
            Instagram ↗
          </a>
          <Link href="/collections/new-arrivals">
            The Cotton Signature Drop
          </Link>
          <Link href="/shop">Shop the collection</Link>
          {brand.email && <a href={`mailto:${brand.email}`}>Email us ↗</a>}
          <Link href="/contact" className="underlined-link">
            LET’S TALK <ArrowUpRight size={15} />
          </Link>
        </nav>
        <Newsletter compact />
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getUTCFullYear()} VODE. ALL RIGHTS RESERVED.</span>
        <span>INDIA / INR ₹</span>
        <Link href="/policies/privacy">Privacy</Link>
        <Link href="/policies/terms">Terms</Link>
        <a href="#top">
          BACK TO TOP <ArrowUp size={13} />
        </a>
      </div>
    </footer>
  );
}
