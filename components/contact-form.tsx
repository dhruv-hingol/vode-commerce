"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { brand } from "@/lib/config";
export default function ContactForm() {
  const [notice, setNotice] = useState("");
  const number = brand.whatsapp.replace(/[\s()+-]/g, "");
  const whatsappReady = /^[1-9]\d{7,14}$/.test(number);
  return (
    <form
      className="contact-form"
      onSubmit={(event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        const message = `Hello VODE,\n\nName: ${values.get("name")}\nEmail: ${values.get("email")}\n\n${values.get("message")}`;
        if (whatsappReady)
          window.open(
            `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
            "_blank",
            "noopener,noreferrer",
          );
        else if (brand.email)
          window.location.href = `mailto:${brand.email}?subject=VODE%20enquiry&body=${encodeURIComponent(message)}`;
        else {
          setNotice(
            "Our direct enquiry channel is being prepared. Please message @vode.co on Instagram.",
          );
          return;
        }
        setNotice(
          "Your message is ready. Review and send it in the app that opens.",
        );
      }}
    >
      <div className="form-field">
        <label htmlFor="contact-name">Your name</label>
        <input
          id="contact-name"
          name="name"
          required
          autoComplete="name"
          maxLength={100}
          placeholder="How should we address you?"
        />
      </div>
      <div className="form-field">
        <label htmlFor="contact-email">Email address</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={250}
          placeholder="you@example.com"
        />
      </div>
      <div className="form-field">
        <label htmlFor="contact-message">Your message</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          maxLength={1000}
          placeholder="A question about a piece, your fit, or something else…"
        />
      </div>
      {whatsappReady || brand.email ? (
        <button className="button primary">
          PREPARE YOUR MESSAGE <ArrowUpRight size={17} />
        </button>
      ) : (
        <a
          className="button primary"
          href={brand.instagram}
          target="_blank"
          rel="noreferrer"
        >
          MESSAGE ON INSTAGRAM <ArrowUpRight size={17} />
        </a>
      )}
      <p className="small">
        {whatsappReady
          ? "Opens WhatsApp with your enquiry. Review and send it there."
          : brand.email
            ? "Opens your email app. Review and send your enquiry there."
            : "Direct enquiries will open at launch. For now, say hello on Instagram."}
      </p>
      {notice && (
        <p role="status" className="small">
          {notice}
        </p>
      )}
    </form>
  );
}
