"use client";
import { useId } from "react";
import { ArrowUpRight } from "lucide-react";
import { brand } from "@/lib/config";

export default function Newsletter({ compact = false }: { compact?: boolean }) {
  const id = useId();
  const form = (
    <form
      className="newsletter-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (!brand.newsletterEmail) return;
        const email = new FormData(event.currentTarget).get("email");
        window.location.href = `mailto:${brand.newsletterEmail}?subject=${encodeURIComponent("VODE early access request")}&body=${encodeURIComponent(`Please send VODE updates to ${email}. I consent to receive collection updates and can unsubscribe by email.`)}`;
      }}
    >
      <label htmlFor={id}>YOUR EMAIL ADDRESS</label>
      <div className="newsletter-input">
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          required
          disabled={!brand.newsletterEmail}
        />
        <button type="submit" disabled={!brand.newsletterEmail}>
          {brand.newsletterEmail ? "REQUEST ACCESS" : "COMING SOON"}
          <ArrowUpRight size={15} />
        </button>
      </div>
      <p>
        {brand.newsletterEmail ? (
          "Opens your email app to request updates. Review and send your request there."
        ) : (
          <>
            Email signup opens at launch. Follow{" "}
            <a href={brand.instagram} target="_blank" rel="noreferrer">
              {brand.instagramHandle}
            </a>{" "}
            for drop announcements.
          </>
        )}
      </p>
    </form>
  );
  if (compact)
    return (
      <div className="footer-newsletter">
        <h3>NEWSLETTER</h3>
        <p className="footer-contact-copy">
          Be first to know. New drops and everything VODE.
        </p>
        {form}
      </div>
    );
  return (
    <section className="newsletter" aria-label="VODE collection updates">
      <div className="newsletter-copy">
        <p className="eyebrow">THE NEXT CHAPTER STARTS HERE</p>
        <h2>
          Be first to <em>know.</em>
        </h2>
        <p>New drops, considered collections, and everything VODE.</p>
      </div>
      {form}
    </section>
  );
}
